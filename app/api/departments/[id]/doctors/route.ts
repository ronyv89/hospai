import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const departmentId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const hospitalId = searchParams.get("hospitalId");

    if (isNaN(departmentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid department ID" },
        { status: 400 }
      );
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true, name: true, description: true },
    });

    if (!department) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      );
    }

    const skip = (page - 1) * limit;

    const where: any = {
      doctorDepartments: {
        some: {
          departmentId,
        },
      },
    };

    // If hospitalId is provided, filter doctors who work in that hospital's department
    if (hospitalId) {
      const hospitalIdInt = parseInt(hospitalId);
      if (!isNaN(hospitalIdInt)) {
        where.hospitalDepartmentDoctors = {
          some: {
            hospitalDepartment: {
              hospitalId: hospitalIdInt,
              departmentId,
            },
          },
        };
      }
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        include: {
          doctorDepartments: {
            include: {
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          hospitalDepartmentDoctors: {
            where: hospitalId
              ? {
                  hospitalDepartment: {
                    hospitalId: parseInt(hospitalId),
                    departmentId,
                  },
                }
              : {
                  hospitalDepartment: {
                    departmentId,
                  },
                },
            include: {
              hospitalDepartment: {
                include: {
                  hospital: {
                    select: {
                      id: true,
                      name: true,
                      city: true,
                      state: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.doctor.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        department,
        doctors,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error(`GET /api/departments/${params.id}/doctors error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors for department" },
      { status: 500 }
    );
  }
}
