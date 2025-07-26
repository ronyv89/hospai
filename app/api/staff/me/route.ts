import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

interface JWTPayload {
  username: string;
  staffType: string;
  role: string;
  iat: number;
  exp: number;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify and decode JWT token
    let decoded: JWTPayload;
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Extract username from decoded token
    const username = decoded.username;
    
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Fetch doctor information from database
    const doctor = await prisma.doctor.findFirst({
      where: {
        username: username,
      },
      include: {
        doctorDepartments: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Staff member not found" },
        { status: 404 }
      );
    }

    // Extract department names
    const departmentNames = doctor.doctorDepartments.map(
      (dd) => dd.department.name
    );

    const staffInfo = {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      username: doctor.username,
      staffType: decoded.staffType,
      role: decoded.role,
      qualifications: doctor.qualifications,
      departments: departmentNames,
      primaryDepartment: departmentNames[0] || "General Medicine",
      tokenExpiry: decoded.exp,
    };

    return NextResponse.json({
      success: true,
      data: staffInfo,
    });
  } catch (error) {
    console.error("Staff info fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}