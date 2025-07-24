-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "qualifications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctorDepartment" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctorDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitalDepartment" (
    "id" SERIAL NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospitalDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitalDepartmentDoctor" (
    "id" SERIAL NOT NULL,
    "hospitalDepartmentId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospitalDepartmentDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "doctorDepartment_doctorId_departmentId_key" ON "doctorDepartment"("doctorId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_name_key" ON "hospital"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hospitalDepartment_hospitalId_departmentId_key" ON "hospitalDepartment"("hospitalId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "hospitalDepartmentDoctor_hospitalDepartmentId_doctorId_key" ON "hospitalDepartmentDoctor"("hospitalDepartmentId", "doctorId");

-- AddForeignKey
ALTER TABLE "doctorDepartment" ADD CONSTRAINT "doctorDepartment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorDepartment" ADD CONSTRAINT "doctorDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalDepartment" ADD CONSTRAINT "hospitalDepartment_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalDepartment" ADD CONSTRAINT "hospitalDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalDepartmentDoctor" ADD CONSTRAINT "hospitalDepartmentDoctor_hospitalDepartmentId_fkey" FOREIGN KEY ("hospitalDepartmentId") REFERENCES "hospitalDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalDepartmentDoctor" ADD CONSTRAINT "hospitalDepartmentDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Set sequence start values to 1000
ALTER SEQUENCE department_id_seq RESTART WITH 1000;
ALTER SEQUENCE doctor_id_seq RESTART WITH 1000;
ALTER SEQUENCE "doctorDepartment_id_seq" RESTART WITH 1000;
ALTER SEQUENCE hospital_id_seq RESTART WITH 1000;
ALTER SEQUENCE "hospitalDepartment_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "hospitalDepartmentDoctor_id_seq" RESTART WITH 1000;
