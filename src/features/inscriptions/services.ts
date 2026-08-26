"server-only";

import { Identifier } from "@/interfaces/entities";
import { emailsService } from "@/lib/emails";
import {
  ConflictError,
  NotFoundError,
  RateLimitError,
} from "@/lib/errors/appError";
import { handlePrismaError } from "@/lib/errors/handlesError";
import { InscriptionWhereInput } from "@/lib/generated/prisma/models/Inscription";
import {
  buildPaginatedResult,
  getPaginationParams,
  PaginationParams,
} from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { generateOtpCode } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { minimalFileFields } from "../fileAssets";
import { getAdmin } from "../users";
import { waveWithTrainingProgram } from "../waves";
import {
  lengthOtpCode,
  motivation,
  nbAttempts,
  validityPeriodOtpCodeInSecond,
} from "./constants";
import {
  FilterInscription,
  FirstInscriptionByStudentDTO,
  FirstInscriptionResult,
  GetOtpCodeDTO,
  InscriptionStatus,
  OtpCode,
  RejectInscriptionDTO,
  StudentFirstInscriptionDTO,
  StudentMotivation,
  StudentSecondInscriptionDTO,
} from "./types";
import { formatWaitTime } from "@/lib/utils";
import OtpVerificationEmail from "@/emails/templates/OtpCodeVerificationEmail";
import { InscriptionConfirmationEmailToAdmin } from "@/emails/templates/InscriptionConfirmationMailToAdmin";
import { getTrainingProgram } from "../trainings/services";
import InscriptionConfirmationEmailToStudent from "../../emails/templates/InscriptionConfirmationEmailToStudent";
import { RejectedInscriptionEmail } from "@/emails/templates/RejectedInscriptionEmail";
import { AcceptedInscriptionEmail } from "@/emails/templates/AcceptedInscriptionEmail";
import {
  buildCloudinarySignature,
  getUrl,
} from "@/lib/StorageService/cloudinary/cloudinary-signer";
import { ALLOWED_MIME_TYPES_LIST } from "@/lib/StorageService";

const folders = {
  diploma: "diploma",
  studentPhoto: "student-photo",
  cniPassport: "cni-passport",
};

const selectDocuments = {
  diplomaFile: {
    select: minimalFileFields,
  },
  photoFile: {
    select: minimalFileFields,
  },
  cniPassportFile: {
    select: minimalFileFields,
  },
};

const checkOtpCodeRateLimit = new RateLimiterMemory({
  points: nbAttempts,
  duration: validityPeriodOtpCodeInSecond,
});

// helper
export async function checkNumCniPassportAndEmail(
  numCNIPassport: string,
  email: string,
) {
  const [studentByCni, studentByEmail] = await Promise.all([
    prisma.student.findFirst({
      where: { numCNIPassport },
      select: {
        id: true,
      },
    }),

    prisma.student.findFirst({
      where: { email },
      select: {
        id: true,
      },
    }),
  ]);

  if (studentByCni) {
    throw new ConflictError<keyof StudentFirstInscriptionDTO>({
      numCNIPassport: ["Ce numéro de CNI ou passeport existe déjà"],
    });
  }

  if (studentByEmail) {
    throw new ConflictError<keyof StudentFirstInscriptionDTO>({
      email: ["Cet email existe déjà"],
    });
  }
}

export async function checkWave(trainingProgramId: string) {
  const wave = await prisma.wave.findFirst({
    where: {
      trainingProgramId: trainingProgramId,
      status: {
        not: "FINISHED",
      },
    },
    select: {
      id: true,
      quota: true,
      _count: {
        select: { inscriptions: true },
      },
    },
  });

  if (!wave || wave._count.inscriptions === wave.quota) {
    throw new NotFoundError(
      "Les inscriptions pour cette formation ne sont pas ouvertes",
    );
  }

  return wave;
}

// inscriptions
async function firstStudentInscription(
  dataInscription: StudentFirstInscriptionDTO,
  status: InscriptionStatus = InscriptionStatus.SUBMITTED,
): Promise<FirstInscriptionResult> {
  const wave = await checkWave(dataInscription.trainingProgramId);
  await checkNumCniPassportAndEmail(
    dataInscription.numCNIPassport,
    dataInscription.email,
  );

  const motivations: Pick<StudentMotivation, "optionId" | "textResponse">[] =
    dataInscription.motivations?.map((motivation) => ({
      optionId: motivation,
      textResponse: null,
    })) ?? [];

  if (dataInscription.otherMotivation) {
    motivations.push({
      textResponse: dataInscription.otherMotivation,
      optionId: null,
    });
  }

  const student = await prisma.student.create({
    data: {
      numCNIPassport: dataInscription.numCNIPassport,
      name: dataInscription.name,
      secondName: dataInscription.secondName,
      birthDate: dataInscription.birthDate,
      birthPlace: dataInscription.birthPlace,
      email: dataInscription.email,
      residence: dataInscription.residence,
      phone: dataInscription.phone,
      diplomaFile: {
        create: dataInscription.diploma,
      },
      photoFile: {
        create: dataInscription.photo,
      },
      cniPassportFile: {
        create: dataInscription.cniPassport,
      },
      inscriptions: {
        create: {
          modality: dataInscription.modality,
          waveId: wave.id,
          status: status,
        },
      },
      motivations: {
        createMany: {
          data: motivations,
        },
      },
    },
    select: {
      email: true,
      id: true,
      name: true,
      secondName: true,
      phone: true,
      numCNIPassport: true,
      inscriptions: { select: { id: true, createdAt: true } },
    },
  });

  return student;
}

export async function firstInscriptionByAdmin(
  data: StudentFirstInscriptionDTO,
) {
  const result = await firstStudentInscription(
    data,
    InscriptionStatus.ACCEPTED,
  );

  // await sendConfirmationMail(data.trainingProgramId, result, false);

  return result;
}

export async function secondStudentInscription(
  studentId: Identifier,
  {
    trainingProgramId,

    modality,
  }: StudentSecondInscriptionDTO,
) {
  const wave = await checkWave(trainingProgramId);

  try {
    const inscription = await prisma.inscription.create({
      data: {
        studentId: studentId,
        waveId: wave.id,
        modality: modality,
        status: "ACCEPTED",
      },
    });

    return inscription;
  } catch (error) {
    handlePrismaError<keyof StudentSecondInscriptionDTO | "studentId">(error, {
      unique: {
        global: "L'etudiant c'est déja inscrit dans cettte formation",
      },
      foreignKey: {
        studentId: "Il n'existe aucun étudiant avec cette identifiant",
      },
    });
  }
}

export async function getInscriptionList(
  paginationParams: PaginationParams,
  filter: FilterInscription,
) {
  const where: InscriptionWhereInput = {};

  if (filter.trainingProgramId) {
    where.wave = { trainingProgramId: filter.trainingProgramId };
  }

  if (filter.search) {
    where.student = {
      OR: [
        { numCNIPassport: { contains: filter?.search } },
        { name: { contains: filter?.search } },
        { secondName: { contains: filter?.search } },
      ],
    };
  }

  if (filter.status) {
    where.status = filter.status;
  }

  const select = {
    id: true,
    status: true,
    modality: true,
    createdAt: true,
    updatedAt: true,
    student: {
      select: {
        id: true,
        name: true,
        secondName: true,
        photoFile: selectDocuments.photoFile,
      },
    },
    wave: {
      select: waveWithTrainingProgram,
    },
  };

  const params = getPaginationParams(paginationParams);
  const [inscriptions, total] = await Promise.all([
    prisma.inscription.findMany({
      select,
      where,
      take: params.limit,
      skip: params.skip,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.inscription.count({
      where,
    }),
  ]);

  return buildPaginatedResult(
    inscriptions.map((inscription) => ({
      ...inscription,
      student: {
        ...inscription.student,
        photoFile: {
          ...inscription.student.photoFile,
          url: getUrl(
            inscription.student.photoFile.key,
            inscription.student.photoFile.mimeType as ALLOWED_MIME_TYPES_LIST,
          ),
        },
      },
    })), // add url image,
    {
      currentPage: params.page,
      limit: params.limit,
      totalItems: total,
    },
  );
}

export async function getInscription(inscriptionId: Identifier) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: inscriptionId },
    include: {
      student: {
        include: {
          ...selectDocuments,
          motivations: {
            orderBy: {
              option: {
                order: "asc",
              },
            },
            select: motivation,
          },
        },
      },
      wave: {
        select: { ...waveWithTrainingProgram, status: true },
      },
    },
  });

  if (!inscription) {
    throw new NotFoundError(
      "Il n'existe aucun étudiant avec cette identifiant",
    );
  }
  return inscription;
}

export async function acceptInscription(inscriptionId: Identifier) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: inscriptionId },
    select: {
      status: true,
      student: {
        select: { name: true, secondName: true, email: true },
      },
      wave: {
        select: { ...waveWithTrainingProgram, status: true },
      },
    },
  });

  if (!inscription) {
    throw new NotFoundError(
      "Il n'existe aucun étudiant avec cette identifiant",
    );
  }

  if (inscription.status !== InscriptionStatus.SUBMITTED) {
    throw new ConflictError({}, "Ce dossier a déjà été traité");
  }

  if (inscription.wave.status === "FINISHED") {
    throw new ConflictError(
      {},
      "Ce dossier ne peut pas etre accepté car la vague pour laquelle le candidat à soucris est terminé",
    );
  }

  const inscriptionUpdated = await prisma.inscription.update({
    where: { id: inscriptionId },
    data: { status: "ACCEPTED" },
    select: {
      id: true,
      modality: true,
      waveId: true,
      status: true,
      studentId: true,
    },
  });

  await emailsService.sendMail({
    to: inscription.student.email,
    subject: "Response à votre inscription",
    react: AcceptedInscriptionEmail({
      studentName: inscription.student.name,
      trainingName: `${inscription.wave.trainingProgram.training.name} durrée: ${inscription.wave.trainingProgram.program.duration} mois`,
    }),
  });

  return inscriptionUpdated;
}

export async function rejectInscription(
  inscriptionId: Identifier,
  data: RejectInscriptionDTO,
) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: inscriptionId },
    select: {
      status: true,
      student: {
        select: { name: true, secondName: true, email: true },
      },
      wave: {
        select: {
          status: true,
          trainingProgram: {
            select: {
              program: { select: { id: true, duration: true } },
              training: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!inscription) {
    throw new NotFoundError(
      "Il n'existe aucun étudiant avec cette identifiant",
    );
  }

  if (inscription.status !== InscriptionStatus.SUBMITTED) {
    throw new ConflictError({}, "Ce dossier a déjà été traité");
  }

  const inscriptionUpdated = await prisma.inscription.update({
    where: { id: inscriptionId },
    data: { status: "REJECTED", ...data },
    select: {
      id: true,
      modality: true,
      waveId: true,
      status: true,
      studentId: true,
    },
  });

  await emailsService.sendMail({
    to: inscription.student.email,
    subject: "Response à votre inscription",
    react: RejectedInscriptionEmail({
      studentName: inscription.student.name,
      trainingName: `${inscription.wave.trainingProgram.training.name} durrée: ${inscription.wave.trainingProgram.program.duration} mois`,
      reasonRejected: data.reasonRejected ?? "",
    }),
  });

  return inscriptionUpdated;
}

export async function getInscriptionStatistics() {
  const [
    total,
    inscriptionAccepted,
    inscriptionRejected,
    inscriptionSubmitted,
  ] = await Promise.all([
    prisma.inscription.count(),
    prisma.inscription.count({
      where: { status: "ACCEPTED" },
    }),
    prisma.inscription.count({
      where: { status: "REJECTED" },
    }),
    prisma.inscription.count({
      where: { status: "SUBMITTED" },
    }),
  ]);

  return {
    total,
    inscriptionAccepted,
    inscriptionRejected,
    inscriptionSubmitted,
  };
}

export async function firstInscriptionByStudent(
  data: FirstInscriptionByStudentDTO,
  pendingId: string,
) {
  // verify otp code
  // await verifyCode(pendingId, data.otpCode);

  const pendingRegistration = await prisma.otpCode.findUnique({
    where: { id: pendingId },
  });

  if (!pendingRegistration || !pendingRegistration.used) {
    throw new ConflictError({}, "Session non existante");
  }

  // save inscription
  const result = await firstStudentInscription(
    data,
    InscriptionStatus.SUBMITTED,
  );

  // send mail confirmation
  await sendConfirmationMail(data.trainingProgramId, result, true);
}

async function sendConfirmationMail(
  programId: Identifier,
  student: FirstInscriptionResult,
  sendToAdmin = false,
) {
  const admin = await getAdmin();

  const trainingProgram = await getTrainingProgram(programId);

  const trainingProgramName = `${trainingProgram.training.name}  ${trainingProgram.program.duration} mois`;
  await Promise.all([
    sendToAdmin
      ? emailsService.sendMail({
          to: student.email,
          subject: "Soumission d'inscription",
          react: InscriptionConfirmationEmailToAdmin({
            studentEmail: student.email,
            studentName: student.name,
            studentPhone: student.phone,
            trainingName: trainingProgramName,
            submittedAt: student.inscriptions[0].createdAt.toDateString(),
            link: `${process.env.APP_URL}/admin/inscriptions/${student.inscriptions[0].id}`,
          }),
        })
      : undefined,
    emailsService.sendMail({
      to: admin.email,
      subject: `Soumission de candidature de ${student.name}  ${student.secondName}`,
      // html: `Mr/Mme ${data.name} ${data.secondName} vient de soumettre sa candidature`,
      react: InscriptionConfirmationEmailToStudent({
        trainingName: trainingProgramName,
        studentName: student.name,
        submittedAt: student.inscriptions[0].createdAt.toDateString(),
      }),
    }),
  ]);
}

// manage otp code
export async function getOtpCode({
  email,
  numCNIPassport: numCNI,
}: GetOtpCodeDTO) {
  // rate limit
  const rateLimit = await checkOtpCodeRateLimit.get(email);

  if (rateLimit && rateLimit.remainingPoints <= 0) {
    const waitingTime = Math.ceil(rateLimit.msBeforeNext / 1000);
    throw new RateLimitError(
      waitingTime,
      `Trop de tentative. Vous devez patienter ${formatWaitTime(waitingTime)} avant de pouvoir demander un nouveau code`,
    );
  }

  await checkNumCniPassportAndEmail(numCNI, email);
  const otpCode = generateOtpCode(lengthOtpCode);
  const codeHash = await bcrypt.hash(otpCode, 10);

  const pending = await prisma.otpCode.create({
    data: {
      email,
      codeHash,
      expiredAt: new Date(Date.now() + validityPeriodOtpCodeInSecond * 1000),
    },
  });

  await emailsService.sendMail({
    to: email,
    subject: "Verification d'email d'inscription ",
    // html: `Votre code est ${otpCode}`,
    react: OtpVerificationEmail({
      firstName: "Mr/Mme",
      otpCode,
      expiresInMinutes: validityPeriodOtpCodeInSecond / 60,
    }),
  });

  return { pendingId: pending.id };
}

export async function verifyCode(pendingId: string, code: string) {
  const pendingRegistration = await prisma.otpCode.findUnique({
    where: { id: pendingId },
  });

  if (!pendingRegistration) {
    throw new NotFoundError("Aucune session d'inscription en cours");
  }

  if (otpCodeExpired(pendingRegistration)) {
    throw new ConflictError({}, "Code expiré, redemande un OTP");
  }

  await checkCode(code, pendingRegistration);

  await checkOtpCodeRateLimit.delete(pendingRegistration.email);
  await prisma.otpCode.update({
    where: { id: pendingRegistration.id },
    data: { used: true },
  });
}

async function checkCode(code: string, pendingRegistration: OtpCode) {
  const isExact = await bcrypt.compare(code, pendingRegistration.codeHash);
  if (!isExact) {
    try {
      const resultRateLimit = await checkOtpCodeRateLimit.consume(
        pendingRegistration.email,
        1,
      );

      if (resultRateLimit.remainingPoints === 0) {
        const waitingTime = Math.ceil(resultRateLimit.msBeforeNext / 1000);
        throw new RateLimitError(
          waitingTime,
          `Code Incorrect. Vous devez patienter ${formatWaitTime(waitingTime)} avant de pouvoir réessayer`,
        );
      }
      throw new ConflictError(
        {},
        `Code incorrect. Il vous manque ${resultRateLimit.remainingPoints} tentative`,
      );
    } catch (rejRes) {
      if (rejRes instanceof RateLimiterRes) {
        const waitingTime = Math.ceil(rejRes.msBeforeNext / 1000);
        throw new RateLimitError(
          waitingTime,
          `Code Incorrect. Vous devez patienter ${formatWaitTime(waitingTime)} avant de pouvoir réessayer`,
        );
      }
      throw rejRes;
    }
  }
}

function otpCodeExpired(otpCode: OtpCode) {
  return otpCode.expiredAt.getTime() < Date.now();
}

export function getSignature() {
  return {
    diploma: buildCloudinarySignature({ folder: folders.diploma }),
    studentPhoto: buildCloudinarySignature({ folder: folders.studentPhoto }),
    cniPassport: buildCloudinarySignature({ folder: folders.cniPassport }),
  };
}
