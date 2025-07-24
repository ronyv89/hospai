import { z } from 'zod';
import { createTool } from '@mastra/core';

const getDepartmentsSchema = z.object({
  search: z.string().optional().describe('Search term for departments'),
  page: z.number().default(1).describe('Page number for pagination'),
  limit: z.number().default(10).describe('Number of results per page')
});

const getDoctorsSchema = z.object({
  search: z.string().optional().describe('Search term for doctors'),
  departmentId: z.number().optional().describe('Filter by department ID'),
  page: z.number().default(1).describe('Page number for pagination'),
  limit: z.number().default(10).describe('Number of results per page')
});

const getDoctorsByDepartmentSchema = z.object({
  departmentId: z.number().describe('Department ID to get doctors for'),
  hospitalId: z.number().optional().describe('Filter by hospital ID'),
  page: z.number().default(1).describe('Page number for pagination'),
  limit: z.number().default(5).describe('Number of results per page')
});

const getHospitalsSchema = z.object({
  search: z.string().optional().describe('Search term for hospitals'),
  city: z.string().optional().describe('Filter by city'),
  state: z.string().optional().describe('Filter by state'),
  page: z.number().default(1).describe('Page number for pagination'),
  limit: z.number().default(10).describe('Number of results per page')
});

const getHospitalByIdSchema = z.object({
  hospitalId: z.number().describe('Hospital ID to fetch')
});

const getHospitalsByDepartmentSchema = z.object({
  departmentId: z.number().describe('Department ID to find hospitals for'),
  city: z.string().optional().describe('Filter by city'),
  state: z.string().optional().describe('Filter by state'),
  page: z.number().default(1).describe('Page number for pagination'),
  limit: z.number().default(10).describe('Number of results per page')
});

export const getDepartmentsTool = createTool({
  id: 'get_departments',
  description: 'Fetch all hospital departments with optional search and pagination',
  inputSchema: getDepartmentsSchema,
  execute: async ({ context: { search, page, limit } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await fetch(`${baseUrl}/api/departments?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.statusText}`);
    }

    return await response.json();
  }
});

export const getDoctorsTool = createTool({
  id: 'get_doctors',
  description: 'Fetch doctors with optional search, department filtering, and pagination',
  inputSchema: getDoctorsSchema,
  execute: async ({ context: { search, departmentId, page, limit } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(departmentId && { departmentId: departmentId.toString() })
    });

    const response = await fetch(`${baseUrl}/api/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch doctors: ${response.statusText}`);
    }

    return await response.json();
  }
});

export const getDoctorsByDepartmentTool = createTool({
  id: 'get_doctors_by_department',
  description: 'Fetch doctors working in a specific department, optionally filtered by hospital',
  inputSchema: getDoctorsByDepartmentSchema,
  execute: async ({ context: { departmentId, hospitalId, page, limit } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(hospitalId && { hospitalId: hospitalId.toString() })
    });

    const response = await fetch(`${baseUrl}/api/departments/${departmentId}/doctors?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch doctors for department: ${response.statusText}`);
    }

    return await response.json();
  }
});

export const getHospitalsTool = createTool({
  id: 'get_hospitals',
  description: 'Fetch hospitals with optional search and location filtering',
  inputSchema: getHospitalsSchema,
  execute: async ({ context: { search, city, state, page, limit } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(city && { city }),
      ...(state && { state })
    });

    const response = await fetch(`${baseUrl}/api/hospitals?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hospitals: ${response.statusText}`);
    }

    return await response.json();
  }
});

export const getHospitalByIdTool = createTool({
  id: 'get_hospital_by_id',
  description: 'Fetch a specific hospital by ID with full details including departments and doctors',
  inputSchema: getHospitalByIdSchema,
  execute: async ({ context: { hospitalId } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/hospitals/${hospitalId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hospital: ${response.statusText}`);
    }

    return await response.json();
  }
});

export const getHospitalsByDepartmentTool = createTool({
  id: 'get_hospitals_by_department',
  description: 'Find hospitals that have a specific department available, useful for symptom-based hospital recommendations',
  inputSchema: getHospitalsByDepartmentSchema,
  execute: async ({ context: { departmentId, city, state, page, limit } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(city && { city }),
      ...(state && { state })
    });

    const response = await fetch(`${baseUrl}/api/departments/${departmentId}/hospitals?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hospitals for department: ${response.statusText}`);
    }

    return await response.json();
  }
});