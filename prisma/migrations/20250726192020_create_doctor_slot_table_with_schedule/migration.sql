-- CreateTable
CREATE TABLE "doctorSlot" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "schedule" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctorSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctorSlot" ADD CONSTRAINT "doctorSlot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorSlot" ADD CONSTRAINT "doctorSlot_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Set sequence start value to 1000
ALTER SEQUENCE "doctorSlot_id_seq" RESTART WITH 1000;