import { z } from 'zod';
import { createTool } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

const symptomAnalysisSchema = z.object({
  symptoms: z.string().describe('Description of symptoms or medical concerns'),
  location: z.object({
    city: z.string().optional().describe('User preferred city'),
    state: z.string().optional().describe('User preferred state')
  }).optional().describe('Location preferences for hospital recommendations')
});

const departmentMappingSchema = z.object({
  primaryDepartments: z.array(z.object({
    name: z.string().describe('Department name (e.g., cardiology, neurology, orthopedics)'),
    confidence: z.number().min(0).max(1).describe('Confidence score for this department match'),
    reasoning: z.string().describe('Why this department is recommended for the symptoms')
  })).describe('Primary medical departments that should handle these symptoms'),
  secondaryDepartments: z.array(z.object({
    name: z.string().describe('Department name'),
    confidence: z.number().min(0).max(1).describe('Confidence score for this department match'),
    reasoning: z.string().describe('Why this department might also be relevant')
  })).describe('Secondary departments that might also be relevant'),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'emergency']).describe('Urgency level based on symptoms'),
  keySymptoms: z.array(z.string()).describe('Key symptoms identified from the input'),
  recommendations: z.array(z.string()).describe('General recommendations for the patient')
});

export const symptomAnalysisTool = createTool({
  id: 'analyze_symptoms',
  description: 'Analyze symptoms using AI to identify the most appropriate medical departments and provide recommendations',
  inputSchema: symptomAnalysisSchema,
  execute: async ({ context: { symptoms, location } }) => {
    try {
      const model = openai('gpt-4o-mini');
      
      const result = await generateObject({
        model,
        schema: departmentMappingSchema,
        prompt: `
        You are a medical triage AI assistant. Analyze the following symptoms and provide recommendations for the most appropriate medical departments.

        Patient Symptoms: "${symptoms}"

        Instructions:
        1. Identify the most likely medical departments that should handle these symptoms
        2. Provide confidence scores (0-1) for each department recommendation
        3. Explain your reasoning for each department
        4. Determine the urgency level (low/medium/high/emergency)
        5. Extract key symptoms from the description
        6. Provide general recommendations for the patient

        Important Notes:
        - Focus on common department names like: cardiology, neurology, orthopedics, gastroenterology, pulmonology, dermatology, psychiatry, emergency medicine, internal medicine, pediatrics, gynecology, urology, ophthalmology, ent (ear nose throat), endocrinology, nephrology, rheumatology, hematology, infectious disease, radiology, pathology, anesthesiology, surgery, oncology
        - For emergency symptoms (severe chest pain, difficulty breathing, severe trauma, etc.), set urgency to "emergency"
        - Always include at least one primary department
        - Be conservative with urgency levels - when in doubt, suggest seeking immediate medical attention
        - Remember this is for informational purposes only and not a substitute for professional medical advice
        `,
      });

      return {
        success: true,
        data: {
          ...result.object,
          originalSymptoms: symptoms,
          location: location || null,
          disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment."
        }
      };
    } catch (error) {
      console.error('Symptom analysis error:', error);
      return {
        success: false,
        error: 'Failed to analyze symptoms',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});