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

// PUT - Update doctor slot
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
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

    // Get doctor info
    const doctor = await prisma.doctor.findFirst({
      where: { username: decoded.username },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const slotId = parseInt(resolvedParams.id);
    
    // Check if slot exists and belongs to the doctor
    const existingSlot = await prisma.doctorSlot.findFirst({
      where: {
        id: slotId,
        doctorId: doctor.id,
      },
    });

    if (!existingSlot) {
      return NextResponse.json(
        { success: false, message: "Slot not found" },
        { status: 404 }
      );
    }

    const { hospitalId, type, description, dayOfWeek, startTime, endTime, isActive } = await request.json();

    // Build update data
    const updateData: any = {};
    if (hospitalId !== undefined) updateData.hospitalId = parseInt(hospitalId);
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (dayOfWeek !== undefined) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return NextResponse.json(
          { success: false, message: "Invalid day of week (must be 0-6)" },
          { status: 400 }
        );
      }
      updateData.dayOfWeek = dayOfWeek;
    }
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (isActive !== undefined) updateData.isActive = isActive;

    // If time or day is being updated, check for conflicts
    if (dayOfWeek !== undefined || startTime !== undefined || endTime !== undefined) {
      const finalDayOfWeek = dayOfWeek !== undefined ? dayOfWeek : existingSlot.dayOfWeek;
      const finalStartTime = startTime !== undefined ? startTime : existingSlot.startTime;
      const finalEndTime = endTime !== undefined ? endTime : existingSlot.endTime;
      const finalHospitalId = hospitalId !== undefined ? parseInt(hospitalId) : existingSlot.hospitalId;

      const overlappingSlot = await prisma.doctorSlot.findFirst({
        where: {
          doctorId: doctor.id,
          hospitalId: finalHospitalId,
          dayOfWeek: finalDayOfWeek,
          isActive: true,
          id: { not: slotId }, // Exclude current slot
          OR: [
            {
              AND: [
                { startTime: { lte: finalStartTime } },
                { endTime: { gt: finalStartTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: finalEndTime } },
                { endTime: { gte: finalEndTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: finalStartTime } },
                { endTime: { lte: finalEndTime } },
              ],
            },
          ],
        },
      });

      if (overlappingSlot) {
        return NextResponse.json(
          { success: false, message: "Time slot conflicts with existing appointment" },
          { status: 400 }
        );
      }
    }

    // Update the slot
    const updatedSlot = await prisma.doctorSlot.update({
      where: { id: slotId },
      data: updateData,
      include: {
        hospital: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSlot,
      message: "Slot updated successfully",
    });
  } catch (error) {
    console.error("Doctor slot update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete doctor slot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
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

    // Get doctor info
    const doctor = await prisma.doctor.findFirst({
      where: { username: decoded.username },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const slotId = parseInt(resolvedParams.id);
    
    // Check if slot exists and belongs to the doctor
    const existingSlot = await prisma.doctorSlot.findFirst({
      where: {
        id: slotId,
        doctorId: doctor.id,
      },
    });

    if (!existingSlot) {
      return NextResponse.json(
        { success: false, message: "Slot not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.doctorSlot.update({
      where: { id: slotId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (error) {
    console.error("Doctor slot deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}