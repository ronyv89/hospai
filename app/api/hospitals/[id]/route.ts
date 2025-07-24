import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hospital ID' },
        { status: 400 }
      );
    }
    
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        hospitalDepartments: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                description: true
              }
            },
            hospitalDepartmentDoctors: {
              include: {
                doctor: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    qualifications: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!hospital) {
      return NextResponse.json(
        { success: false, error: 'Hospital not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: hospital
    })
  } catch (error) {
    console.error('GET /api/hospitals/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hospital' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hospital ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json()
    const { name, address, city, state, zipCode, phone, email, website } = body

    // Check if hospital exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { id }
    })

    if (!existingHospital) {
      return NextResponse.json(
        { success: false, error: 'Hospital not found' },
        { status: 404 }
      )
    }

    const hospital = await prisma.hospital.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(address && { address: address.trim() }),
        ...(city && { city: city.trim() }),
        ...(state && { state: state.trim() }),
        ...(zipCode !== undefined && { zipCode: zipCode?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(website !== undefined && { website: website?.trim() || null })
      }
    })

    return NextResponse.json({
      success: true,
      data: hospital
    })
  } catch (error) {
    console.error('PUT /api/hospitals/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update hospital' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hospital ID' },
        { status: 400 }
      );
    }
    
    // Check if hospital exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { id }
    })

    if (!existingHospital) {
      return NextResponse.json(
        { success: false, error: 'Hospital not found' },
        { status: 404 }
      )
    }

    await prisma.hospital.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Hospital deleted successfully'
    })
  } catch (error) {
    console.error('DELETE /api/hospitals/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete hospital' },
      { status: 500 }
    )
  }
}