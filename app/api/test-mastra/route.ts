import { NextResponse } from 'next/server';
import { getDepartmentsTool } from '@/mastra/tools/hospital-tools';

// Create a minimal runtime context with type assertion
const createRuntimeContext = () => ({} as any);

export async function GET() {
  try {
    // Test the tool directly
    const result = await getDepartmentsTool.execute!({
      context: {
        search: 'cardiology',
        page: 1,
        limit: 3
      },
      runtimeContext: createRuntimeContext()
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Test Mastra API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test Mastra integration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}