/*
  Warnings:

  - Added the required column `startDate` to the `doctorSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add column with default value first, then make it NOT NULL
ALTER TABLE "doctorSlot" ADD COLUMN "startDate" TIMESTAMP(3) DEFAULT NOW();

-- Update existing records to have startDate based on current date
UPDATE "doctorSlot" SET "startDate" = NOW() WHERE "startDate" IS NULL;

-- Remove default and make column NOT NULL
ALTER TABLE "doctorSlot" ALTER COLUMN "startDate" DROP DEFAULT;
ALTER TABLE "doctorSlot" ALTER COLUMN "startDate" SET NOT NULL;
