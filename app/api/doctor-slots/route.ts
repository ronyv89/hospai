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

// GET - Fetch doctor slots
export async function GET(request: NextRequest) {
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

    // Fetch doctor slots
    const slots = await prisma.doctorSlot.findMany({
      where: {
        doctorId: doctor.id,
        isActive: true,
      },
      include: {
        hospital: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error("Doctor slots fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create doctor slot
export async function POST(request: NextRequest) {
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

    const { hospitalId, type, description, dayOfWeek, daysOfWeek, startTime, endTime, startDate, schedule } = await request.json();

    // Support both single dayOfWeek (for backward compatibility) and multiple daysOfWeek
    let targetDays: number[] = [];
    
    if (daysOfWeek && Array.isArray(daysOfWeek)) {
      targetDays = daysOfWeek;
    } else if (dayOfWeek !== undefined) {
      targetDays = [dayOfWeek];
    }

    // Validate required fields
    if (!hospitalId || !type || targetDays.length === 0 || !startTime || !endTime || !startDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate days of week (0-6)
    for (const day of targetDays) {
      if (day < 0 || day > 6) {
        return NextResponse.json(
          { success: false, message: "Invalid day of week (must be 0-6)" },
          { status: 400 }
        );
      }
    }

    // Helper function to calculate start date for a specific day of week
    const calculateStartDateForDay = (baseStartDate: string, targetDayOfWeek: number): Date => {
      const startDate = new Date(baseStartDate);
      const startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      let daysToAdd = targetDayOfWeek - startDayOfWeek;
      
      // If the target day is earlier in the week than start date, move to next week
      if (daysToAdd < 0) {
        daysToAdd += 7;
      }
      
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + daysToAdd);
      
      return targetDate;
    };

    // Check for overlapping slots for each target day and create slots
    const createdSlots = [];
    const errors = [];

    for (const dayOfWeek of targetDays) {
      try {
        // Calculate the actual start date for this day of week
        const slotStartDate = calculateStartDateForDay(startDate, dayOfWeek);
        
        // Check for overlapping slots for this specific day and date range
        // We need to check for conflicts not just on the same day of week, but also consider recurring schedules
        const overlappingSlot = await prisma.doctorSlot.findFirst({
          where: {
            doctorId: doctor.id,
            hospitalId: parseInt(hospitalId),
            dayOfWeek: dayOfWeek,
            isActive: true,
            // Check if the new slot would conflict with existing slots
            // considering their start dates and recurrence patterns
            startDate: {
              lte: slotStartDate, // Existing slots that started before or on this date
            },
            OR: [
              {
                AND: [
                  { startTime: { lte: startTime } },
                  { endTime: { gt: startTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: endTime } },
                  { endTime: { gte: endTime } },
                ],
              },
              {
                AND: [
                  { startTime: { gte: startTime } },
                  { endTime: { lte: endTime } },
                ],
              },
            ],
          },
        });

        if (overlappingSlot) {
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          errors.push(`${dayNames[dayOfWeek]}: Time slot conflicts with existing appointment`);
          continue;
        }

        // Create the slot for this day
        const newSlot = await prisma.doctorSlot.create({
          data: {
            doctorId: doctor.id,
            hospitalId: parseInt(hospitalId),
            type,
            description: description || null,
            dayOfWeek,
            startTime,
            endTime,
            startDate: slotStartDate,
            schedule: schedule || null,
          },
          include: {
            hospital: true,
          },
        });

        createdSlots.push(newSlot);
      } catch (error) {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        errors.push(`${dayNames[dayOfWeek]}: Failed to create slot`);
        console.error(`Error creating slot for day ${dayOfWeek}:`, error);
      }
    }

    // Return response based on results
    if (createdSlots.length === 0) {
      return NextResponse.json({
        success: false,
        message: `Failed to create any slots. Errors: ${errors.join(", ")}`,
      }, { status: 400 });
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: true,
        data: createdSlots,
        message: `Created ${createdSlots.length} slot(s) successfully. Some errors occurred: ${errors.join(", ")}`,
        partialSuccess: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: createdSlots,
      message: `Successfully created ${createdSlots.length} slot(s)`,
    });
  } catch (error) {
    console.error("Doctor slot creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}