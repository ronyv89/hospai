import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
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
              }
            }
          }
        }
      }),
      prisma.department.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: departments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('GET /api/departments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Department name is required' },
        { status: 400 }
      )
    }

    // Check if department already exists
    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    })

    if (existingDepartment) {
      return NextResponse.json(
        { success: false, error: 'Department already exists' },
        { status: 409 }
      )
    }

    const department = await prisma.department.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    })

    return NextResponse.json({
      success: true,
      data: department
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/departments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create department' },
      { status: 500 }
    )
  }
}