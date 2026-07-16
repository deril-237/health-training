import { prisma } from "@/lib/prisma";
import { InscriptionInput } from "./schemas";
import { ConflictError, NotFoundError } from "@/lib/errors/appError";
import { Student, FilterStudent, SecondEnrollStudent } from "./types";
import fileStorageService from "@/lib/fileStorageService/fileStorage.service";
import path from "path";
import { createId } from "@paralleldrive/cuid2";
import {
  buildPaginatedResult,
  getPaginationParams,
  PaginationParams,
} from "@/lib/pagination";
import { StudentFindManyArgs } from "@/lib/generated/prisma/models";
import { handlePrismaError } from "@/lib/errors/handlePrismaError";

export async function checkNumCniPassportAndEmail(
  numCNIPassport: string,
  email: string,
) {
  const countNumCNI = await prisma.student.count({
    where: { numCNIPassport },
  });

  if (countNumCNI) {
    throw new ConflictError<InscriptionInput>({
      numCNIPassport: "numero de CNI ou du passport invalid",
    });
  }

  const countEmail = await prisma.student.count({
    where: { email },
  });

  if (countEmail) {
    throw new ConflictError<InscriptionInput>({
      numCNIPassport: "email invalid",
    });
  }
}

async function uploadStudentFile(
  studentId: string,
  file: Pick<InscriptionInput, "diploma" | "photo" | "numCNIPassport">,
): Promise<Pick<Student, "photoUrl" | "diplomaUrl" | "cniPhotoUrl">> {
  const folder = `student/${studentId}`;

  const diplomaUrl = await fileStorageService.saveFile(
    file.diploma,
    `diploma.pdf`,
    folder,
    { resource_type: "raw" },
  );

  const photoUrl = await fileStorageService.saveFile(
    file.photo,
    `profile.${path.extname(file.photo.name)}`,
    folder,
    { resource_type: "image" },
  );

  const cniPhotoUrl = await fileStorageService.saveFile(
    file.diploma,
    `diploma.pdf`,
    folder,
    { resource_type: "raw" },
  );

  return { photoUrl, diplomaUrl, cniPhotoUrl };
}

export async function checkWave(trainingProgramId: string) {
  const wave = await prisma.wave.findFirst({
    where: {
      trainingProgramId: trainingProgramId,
      status: {
        not: "FINISHED",
      },
    },
  });

  if (!wave) {
    throw new NotFoundError(
      `Les inscriptions pour cette formation ne sont pas encore ouverte desolé`,
    );
  }

  return wave;
}

export async function firstEnrollStudent(dataInscription: InscriptionInput) {
  const wave = await checkWave(dataInscription.trainingProgramId);
  await checkNumCniPassportAndEmail(
    dataInscription.numCNIPassport,
    dataInscription.email,
  );
  const studentId = createId();
  const urls = await uploadStudentFile(studentId, dataInscription);

  const student = await prisma.student.create({
    data: {
      numCNIPassport: dataInscription.numCNIPassport,
      name: dataInscription.name,
      secondName: dataInscription.secondName,
      birthDate: dataInscription.birthDate,
      birthPlace: dataInscription.birthPlace,
      email: dataInscription.email,
      residence: dataInscription.residence,
      ...urls,
      inscriptions: {
        create: {
          modality: dataInscription.modality,
          waveId: wave.id,
          status: "ACCEPTED",
        },
      },
      motivations: {
        createMany: {
          data: [
            ...dataInscription.motivations.map((motivation) => ({
              optionId: motivation,
            })),
            {
              textResponse: dataInscription.otherMotivation,
            },
          ],
        },
      },
    },
  });

  return student;
}

export async function getStudent(
  paginationParams: PaginationParams,
  filter: FilterStudent,
) {
  const params = getPaginationParams(paginationParams);

  const condition: StudentFindManyArgs = {
    distinct: "id",
    where: {
      OR: [
        { numCNIPassport: { contains: filter.search } },
        { name: { contains: filter.search } },
        { secondName: { contains: filter.search } },
      ],
      inscriptions: {
        some: { waveId: filter.waveId },
      },
    },
    take: params.limit,
    skip: params.skip,
  };

  const [student, totalItems] = await Promise.all([
    prisma.student.findMany(condition),
    prisma.student.count({ where: condition.where }),
  ]);

  return buildPaginatedResult(student, {
    currentPage: params.page,
    totalItems,
    limit: params.limit,
  });
}

export async function enrollSecondStudent({
  trainingProgramId,
  studentId,
  modality,
}: SecondEnrollStudent) {
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
    handlePrismaError<keyof SecondEnrollStudent>(error, {
      unique: {
        global: "L'etudiant est déja dans cours",
      },
      foreignKey: {
        studentId: "Il n'existe aucun étudiant avec cette identifiant",
      },
    });
  }
}

export async function getMotivationList() {
  const motivationOptions = await prisma.optionMotivation.findMany({
    orderBy: { order: "asc" },
  });

  return motivationOptions;
}

// export async function getStudentMotivationResponse(studentId: string){
//   const response = prisma.studentMotivation.findMany({
//     where:{
//       studentId,
//     },
//     include: {

//     }
//   });
// }
