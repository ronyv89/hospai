import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const departmentId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const city = searchParams.get("city");
    const state = searchParams.get("state");

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
      hospitalDepartments: {
        some: {
          departmentId,
        },
      },
    };

    // Add location filters if provided
    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (state) {
      where.state = {
        contains: state,
        mode: "insensitive",
      };
    }

    const [hospitals, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          hospitalDepartments: {
            where: {
              departmentId,
            },
            include: {
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
              hospitalDepartmentDoctors: {
                include: {
                  doctor: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      qualifications: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.hospital.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        department,
        hospitals,
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
    console.error(`GET /api/departments/[id]/hospitals error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hospitals for department" },
      { status: 500 }
    );
  }
}