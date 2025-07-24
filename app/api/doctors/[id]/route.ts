import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        doctorDepartments: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        hospitalDepartmentDoctors: {
          include: {
            hospitalDepartment: {
              include: {
                hospital: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                    state: true,
                    phone: true,
                    email: true,
                  },
                },
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(`GET /api/doctors/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { firstName, lastName, qualifications, departmentIds } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(qualifications) || qualifications.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one qualification is required" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      qualifications: qualifications.map((q: string) => q.trim()),
    };

    // Update department associations if provided
    if (Array.isArray(departmentIds)) {
      // Verify departments exist
      const departments = await prisma.department.findMany({
        where: { id: { in: departmentIds } },
      });

      if (departments.length !== departmentIds.length) {
        return NextResponse.json(
          { success: false, error: "One or more departments not found" },
          { status: 400 }
        );
      }

      // Delete existing department associations and create new ones
      updateData.doctorDepartments = {
        deleteMany: {},
        create: departmentIds.map((deptId: number) => ({
          departmentId: deptId,
        })),
      };
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: updateData,
      include: {
        doctorDepartments: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(`PUT /api/doctors/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    await prisma.doctor.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/doctors/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
