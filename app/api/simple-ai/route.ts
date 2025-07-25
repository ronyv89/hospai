import { NextRequest, NextResponse } from 'next/server';
import { getDepartmentsTool, getDoctorsTool, getHospitalsByDepartmentTool } from '@/mastra/tools/hospital-tools';
import { symptomAnalysisTool } from '@/mastra/tools/symptom-analysis-tool';

// Create a minimal runtime context with type assertion
const createRuntimeContext = () => ({} as any);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    // Use AI-powered symptom analysis
    const analysisResult = await symptomAnalysisTool.execute!({
      context: {
        symptoms: query,
        location: location || undefined
      },
      runtimeContext: createRuntimeContext()
    }) as any;

    if (!analysisResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to analyze symptoms', details: analysisResult.error },
        { status: 500 }
      );
    }

    const analysis = analysisResult.data;
    const recommendedDepartments: any[] = [];
    const recommendedDoctors: any[] = [];
    const recommendedHospitals: any[] = [];

    // Get departments for each AI-recommended department
    for (const dept of analysis.primaryDepartments) {
      const departmentsResult = await getDepartmentsTool.execute!({
        context: {
          search: dept.name,
          page: 1,
          limit: 2
        },
        runtimeContext: createRuntimeContext()
      }) as any;

      if (departmentsResult.success && departmentsResult.data.length > 0) {
        for (const foundDept of departmentsResult.data) {
          recommendedDepartments.push({
            id: foundDept.id,
            name: foundDept.name,
            description: foundDept.description,
            confidence: dept.confidence,
            reasoning: dept.reasoning,
            aiRecommended: true
          });

          // Get hospitals for this department
          const hospitalsResult = await getHospitalsByDepartmentTool.execute!({
            context: {
              departmentId: foundDept.id,
              city: location?.city,
              state: location?.state,
              page: 1,
              limit: 3
            },
            runtimeContext: createRuntimeContext()
          }) as any;

          if (hospitalsResult.success && hospitalsResult.data?.hospitals) {
            recommendedHospitals.push(...hospitalsResult.data.hospitals.map((hospital: any) => ({
              id: hospital.id,
              name: hospital.name,
              address: hospital.address,
              city: hospital.city,
              state: hospital.state,
              phone: hospital.phone,
              website: hospital.website,
              departmentName: foundDept.name,
              departmentId: foundDept.id,
              availableDoctors: hospital.hospitalDepartments?.[0]?.hospitalDepartmentDoctors?.length || 0
            })));
          }

          // Get doctors for this department
          const doctorsResult = await getDoctorsTool.execute!({
            context: {
              departmentId: foundDept.id,
              page: 1,
              limit: 2
            },
            runtimeContext: createRuntimeContext()
          }) as any;

          if (doctorsResult.success && doctorsResult.data.length > 0) {
            recommendedDoctors.push(...doctorsResult.data.map((doctor: any) => ({
              id: doctor.id,
              firstName: doctor.firstName,
              lastName: doctor.lastName,
              qualifications: doctor.qualifications,
              departments: doctor.doctorDepartments?.map((dd: any) => dd.department.name) || [],
              departmentMatch: foundDept.name,
              reasoning: `${dept.reasoning} - Specialist in ${foundDept.name}`
            })));
          }
        }
      }
    }

    // Remove duplicate hospitals
    const uniqueHospitals = recommendedHospitals.filter((hospital, index, self) =>
      index === self.findIndex(h => h.id === hospital.id)
    );

    const response = {
      query,
      aiAnalysis: {
        keySymptoms: analysis.keySymptoms,
        urgencyLevel: analysis.urgencyLevel,
        primaryDepartments: analysis.primaryDepartments,
        secondaryDepartments: analysis.secondaryDepartments,
        recommendations: analysis.recommendations,
        disclaimer: analysis.disclaimer
      },
      recommendedDepartments,
      recommendedDoctors,
      recommendedHospitals: uniqueHospitals,
      summary: `Based on AI analysis of your symptoms "${query}", the most relevant departments are ${analysis.primaryDepartments.map((d: any) => d.name).join(', ')}. Urgency level: ${analysis.urgencyLevel}.`,
      nextSteps: [
        analysis.urgencyLevel === 'emergency' ? 'Seek immediate emergency medical attention' :
        analysis.urgencyLevel === 'high' ? 'Schedule an urgent appointment or visit urgent care' :
        'Schedule an appointment with one of the recommended specialists',
        'Contact your insurance provider to verify coverage',
        'Prepare a list of your symptoms and medical history',
        'Consider getting a referral from your primary care physician if required',
        'If symptoms worsen or become severe, seek immediate medical attention'
      ].filter(Boolean)
    };

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Simple AI API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process AI request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}