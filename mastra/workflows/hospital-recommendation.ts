import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { hospitalAssistantAgent } from '../agents/hospital-assistant';

// Input schema for the workflow
const hospitalRecommendationInputSchema = z.object({
  userQuery: z.string().describe('User\'s medical query or health concern'),
  location: z.object({
    city: z.string().optional().describe('Preferred city'),
    state: z.string().optional().describe('Preferred state')
  }).optional().describe('User\'s location preferences'),
  preferences: z.object({
    insurance: z.string().optional().describe('Insurance type'),
    urgency: z.enum(['low', 'medium', 'high']).optional().describe('Urgency level'),
    specialRequirements: z.string().optional().describe('Any special requirements')
  }).optional().describe('User preferences and requirements')
});

// Output schema for the workflow
const hospitalRecommendationOutputSchema = z.object({
  response: z.string().describe('AI assistant response with departments, hospitals, and doctors'),
  toolCalls: z.array(z.any()).optional().describe('Tool calls made by the agent'),
  query: z.string().describe('Original user query'),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional()
  }).optional(),
  preferences: z.object({
    insurance: z.string().optional(),
    urgency: z.enum(['low', 'medium', 'high']).optional(),
    specialRequirements: z.string().optional()
  }).optional(),
  summary: z.string().describe('Brief summary of the recommendations')
});

// Single step that uses the hospital assistant agent
const processRequestStep = createStep({
  id: 'process_medical_request',
  inputSchema: hospitalRecommendationInputSchema,
  outputSchema: hospitalRecommendationOutputSchema,
  execute: async (params: any) => {
    const { userQuery, location, preferences } = params;
    
    // Construct a comprehensive message that includes location and preferences
    let fullMessage = userQuery;
    if (location && (location.city || location.state)) {
      fullMessage += `\n\nLocation preferences: ${location.city ? `City: ${location.city}` : ''}${location.state ? ` State: ${location.state}` : ''}`;
    }
    if (preferences && Object.keys(preferences).length > 0) {
      fullMessage += `\n\nPreferences: ${JSON.stringify(preferences, null, 2)}`;
    }

    // Use the hospital assistant agent to generate comprehensive response
    console.log('Full message:', fullMessage);
    const message = { role: "user" as const, content: fullMessage };
    console.log('Message object:', message);
    const response = await hospitalAssistantAgent.generate([message]);

    // Create a brief summary
    const summary = `Hospital recommendation workflow completed for query: "${userQuery}". ${location ? `Location: ${location.city || 'Any'}, ${location.state || 'Any'}.` : ''} The AI assistant provided comprehensive recommendations including departments, hospitals, and qualified doctors.`;

    return {
      response: response.text || 'No response generated',
      toolCalls: response.toolCalls || [],
      query: userQuery,
      location: location || null,
      preferences: preferences || null,
      summary
    };
  }
});

// Create the main workflow
export const hospitalRecommendationWorkflow = createWorkflow({
  id: 'hospitalRecommendationWorkflow',
  description: 'AI-powered workflow to recommend departments, hospitals, and doctors based on user medical queries using the hospital assistant agent',
  inputSchema: hospitalRecommendationInputSchema,
  outputSchema: hospitalRecommendationOutputSchema
})
  .then(processRequestStep)
  .commit();