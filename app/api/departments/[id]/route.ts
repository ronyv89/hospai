import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      )
    }

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        doctorDepartments: {
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
        },
        hospitalDepartments: {
          include: {
            hospital: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true
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

    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: department
    })
  } catch (error) {
    console.error(`GET /api/departments/[id] error:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch department' },
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
    const id = parseInt(paramId)
    const body = await request.json()
    const { name, description } = body

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Department name is required' },
        { status: 400 }
      )
    }

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if name conflicts with another department
    const nameConflict = await prisma.department.findFirst({
      where: {
        name: name.trim(),
        id: { not: id }
      }
    })

    if (nameConflict) {
      return NextResponse.json(
        { success: false, error: 'Department name already exists' },
        { status: 409 }
      )
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    })

    return NextResponse.json({
      success: true,
      data: department
    })
  } catch (error) {
    console.error(`PUT /api/departments/[id] error:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to update department' },
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
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid department ID' },
        { status: 400 }
      )
    }

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    await prisma.department.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully'
    })
  } catch (error) {
    console.error(`DELETE /api/departments/[id] error:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}