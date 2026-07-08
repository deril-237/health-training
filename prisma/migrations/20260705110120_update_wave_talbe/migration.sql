/*
  Warnings:

  - You are about to drop the `Wave` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Wave";

-- CreateTable
CREATE TABLE "waves" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "quota" INTEGER NOT NULL,
    "status" "WaveStatus" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "number_wave" INTEGER NOT NULL,
    "training_program_id" TEXT NOT NULL,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
