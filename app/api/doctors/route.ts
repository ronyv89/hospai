import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const departmentId = searchParams.get("departmentId");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
        { qualifications: { hasSome: [search] } },
      ];
    }

    if (departmentId) {
      where.doctorDepartments = {
        some: {
          departmentId: parseInt(departmentId),
        },
      };
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
      }),
      prisma.doctor.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/doctors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, qualifications, departmentIds } = body;

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

    if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one department is required" },
        { status: 400 }
      );
    }

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

    const doctor = await prisma.doctor.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        qualifications: qualifications.map((q: string) => q.trim()),
        doctorDepartments: {
          create: departmentIds.map((deptId: number) => ({
            departmentId: deptId,
          })),
        },
      },
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

    return NextResponse.json(
      {
        success: true,
        data: doctor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/doctors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}
