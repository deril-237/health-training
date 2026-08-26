/*
  Warnings:

  - You are about to alter the column `price` on the `waves` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[training_program_id,position]` on the table `modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[training_id,program_id]` on the table `training_program` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InscriptionStatus" AS ENUM ('SUBMITTED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ModalityOption" AS ENUM ('ON_LINE', 'OFF_LINE');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('CLOUDINARY');

-- AlterTable
ALTER TABLE "waves" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "num_cni_passport" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "birth_place" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "diploma_url" TEXT NOT NULL,
    "cni_photo_url" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionMotivation" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionMotivation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_motivations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "optionId" TEXT,
    "textResponse" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_motivations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "waveId" TEXT NOT NULL,
    "status" "InscriptionStatus" NOT NULL,
    "modality" "ModalityOption" NOT NULL,
    "reasonRejected" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "provider" "StorageProvider" NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_motivations_studentId_optionId_key" ON "student_motivations"("studentId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_studentId_waveId_key" ON "inscriptions"("studentId", "waveId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_key_key" ON "FileAsset"("key");

-- CreateIndex
CREATE UNIQUE INDEX "modules_training_program_id_position_key" ON "modules"("training_program_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "training_program_training_id_program_id_key" ON "training_program"("training_id", "program_id");

-- AddForeignKey
ALTER TABLE "student_motivations" ADD CONSTRAINT "student_motivations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_motivations" ADD CONSTRAINT "student_motivations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionMotivation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_waveId_fkey" FOREIGN KEY ("waveId") REFERENCES "waves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
