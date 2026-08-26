"use server";

import { authActionClient } from "@/lib/safeAction";
import { ResourceType } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import zod from "zod";

export interface SignedUploadPayload {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  publicId: string;
  uploadPrest: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];

const originalNameSchema = zod
  .string()
  .min(1)
  .refine(
    (name) => {
      const ext = name.split(".").pop()?.toLowerCase();
      return !!ext && ALLOWED_EXTENSIONS.includes(ext);
    },
    { message: "Extension de fichier non autorisée" },
  );

export async function buildObjectKey(extension: string) {
  const objectName = crypto.randomUUID();

  const ext = extension ? extension.replace(/^\./, "").toLowerCase() : "";

  return ext ? `${objectName}.${ext}` : `${objectName}`;
}

export const moveFile = async (
  currentPublicId: string,
  newPublicId: string,
  resourceType: ResourceType,
) => {
  const result = await cloudinary.uploader.rename(
    currentPublicId,
    newPublicId,
    {
      resource_type: resourceType,
    },
  );
};

export const getCloudinarySignedPayload = authActionClient.action(async () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: uploadPreset },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    uploadParams: {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
      upload_preset: uploadPreset,
    },
  };
});
