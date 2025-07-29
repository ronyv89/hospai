-- CreateEnum
CREATE TYPE "DoctorSlotType" AS ENUM ('OUT_PATIENTS', 'IP_ROUNDS', 'SURGERY', 'CONSULTATION', 'EMERGENCY', 'OPD', 'CHECKUP');

-- AlterTable
ALTER TABLE "doctor" ADD COLUMN "username" TEXT;

-- AlterTable
ALTER TABLE "doctorSlot" DROP COLUMN "title",
ADD COLUMN "type" "DoctorSlotType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "doctor_username_key" ON "doctor"("username");