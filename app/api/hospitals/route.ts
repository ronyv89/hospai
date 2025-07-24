import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city') || ''
    const state = searchParams.get('state') || ''

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { address: { contains: search, mode: 'insensitive' as const } },
        { city: { contains: search, mode: 'insensitive' as const } }
      ]
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' as const }
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' as const }
    }

    const [hospitals, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
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
      }),
      prisma.hospital.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: hospitals,
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
    console.error('GET /api/hospitals error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hospitals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, city, state, zipCode, phone, email, website } = body

    if (!name || !address || !city || !state) {
      return NextResponse.json(
        { success: false, error: 'Hospital name, address, city, and state are required' },
        { status: 400 }
      )
    }

    // Check if hospital already exists with same name and city
    const existingHospital = await prisma.hospital.findFirst({
      where: { 
        name: name.trim(),
        city: city.trim(),
        state: state.trim()
      }
    })

    if (existingHospital) {
      return NextResponse.json(
        { success: false, error: 'Hospital already exists in this location' },
        { status: 409 }
      )
    }

    const hospital = await prisma.hospital.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        website: website?.trim() || null
      }
    })

    return NextResponse.json({
      success: true,
      data: hospital
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/hospitals error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create hospital' },
      { status: 500 }
    )
  }
}