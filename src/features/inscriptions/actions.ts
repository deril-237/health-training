"use server";

import {
  checkNumCniPassportAndEmail,
  checkWave,
  secondStudentInscription,
  getInscriptionList,
  getInscription,
  acceptInscription,
  rejectInscription,
  getInscriptionStatistics,
  getOtpCode,
  firstInscriptionByAdmin,
  firstInscriptionByStudent,
  verifyCode,
  getSignature,
} from "./services";
import {
  formInscriptionByStudentSchema,
  getOtpCodeSchema,
  inscriptionFilterSchema,
  inscriptionSchema,
  rejectInscriptionSchema,
  secondInscriptionSchema,
  studentFileInscriptionInput,
  verifyOtpCodeSchema,
} from "./schemas";
import {
  cniPassportSchema,
  emailSchema,
  identifierSchema,
} from "@/lib/zodRules";
import { paginationSchema } from "@/lib/pagination";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionClient, authActionClient } from "@/lib/safeAction";
import zod from "zod";
import { cookies } from "next/headers";
import { cookieMaxAge, cookieName } from "./constants";

// authenticated action

export const firstStudentInscriptionByAdminAction = authActionClient
  .inputSchema(inscriptionSchema)
  .action(async ({ parsedInput: data }) => {
    const student = await firstInscriptionByAdmin(data);

    revalidatePath(`/admin/students`, "page");

    redirect(`/admin/students/${student.id}`, "replace");
  });

export const secondInscriptionStudentAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(secondInscriptionSchema)
  .action(async ({ parsedInput: data, bindArgsParsedInputs }) => {
    const [studentId] = bindArgsParsedInputs;
    const result = await secondStudentInscription(studentId, data);

    revalidatePath(`/admin/students/${studentId}`, "page");

    return result;
  });

export const getInscriptionListAction = authActionClient
  .bindArgsSchemas([paginationSchema, inscriptionFilterSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [pagination, filter] = bindArgsParsedInputs;

    const result = await getInscriptionList(pagination, filter);

    return result;
  });

export const getInscriptionDetailsAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [inscriptionId] = bindArgsParsedInputs;

    const result = await getInscription(inscriptionId);

    return result;
  });

export const acceptInscriptionAction = authActionClient
  .inputSchema(zod.object({ inscriptionId: identifierSchema }))
  .action(async ({ parsedInput }) => {
    const { inscriptionId } = parsedInput;

    const result = await acceptInscription(inscriptionId);
    revalidatePath(`inscriptions/${inscriptionId}`, "page");
    revalidatePath(`inscriptions`);
    return result;
  });

export const rejectInscriptionAction = authActionClient
  .bindArgsSchemas([identifierSchema])
  .inputSchema(rejectInscriptionSchema)
  .action(async ({ bindArgsParsedInputs, parsedInput }) => {
    const [inscriptionId] = bindArgsParsedInputs;

    const result = await rejectInscription(inscriptionId, parsedInput);
    revalidatePath(`/admin/inscriptions/${inscriptionId}`, "page");
    revalidatePath(`/admin/inscriptions`);
    return result;
  });

export const getInscriptionStatisticsAction = authActionClient.action(
  getInscriptionStatistics,
);

export const getSignedUploadAdminPayloadAction = authActionClient
  .inputSchema(studentFileInscriptionInput)
  .action(async () => {
    const signatures = getSignature();

    return signatures;
  });

// public action

export const checkNumCniPassportAndEmailAction = actionClient
  .bindArgsSchemas([cniPassportSchema, emailSchema])
  .action(async ({ bindArgsParsedInputs }) => {
    const [numCNIPassport, email] = bindArgsParsedInputs;
    await checkNumCniPassportAndEmail(numCNIPassport, email);
  });

export const checkWaveAction = actionClient
  .inputSchema(zod.object({ trainingProgramId: identifierSchema }))
  .action(async ({ parsedInput: { trainingProgramId } }) => {
    const result = await checkWave(trainingProgramId);
  });

export const getOtpCodeAction = actionClient
  .inputSchema(getOtpCodeSchema)
  .action(async ({ parsedInput }) => {
    const result = await getOtpCode(parsedInput);

    const cookiesStore = await cookies();

    cookiesStore.set({
      name: cookieName,
      value: result.pendingId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: cookieMaxAge,
      path: "/",
    });
  });

export const firstStudentInscriptionByStudentAction = actionClient
  .inputSchema(formInscriptionByStudentSchema)
  .action(async ({ parsedInput }) => {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get(cookieName);

    if (!sessionId) {
      redirect(`/inscription`);
    }

    const result = await firstInscriptionByStudent(
      parsedInput,
      sessionId.value,
    );
  });

export const verifyOtpCodeAction = actionClient
  .inputSchema(verifyOtpCodeSchema)
  .action(async ({ parsedInput }) => {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get(cookieName);

    if (!sessionId) {
      redirect(`/inscription`);
    }

    await verifyCode(sessionId.value, parsedInput.otpCode);
  });

export const getSignedUploadStudentPayloadAction = actionClient
  .inputSchema(studentFileInscriptionInput)
  .action(async () => {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get(cookieName);

    if (!sessionId) {
      redirect(`/inscription`);
    }

    const signatures = getSignature();

    return signatures;
  });
