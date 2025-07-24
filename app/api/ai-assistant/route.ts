import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location, preferences, useWorkflow } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }

    if (useWorkflow) {
      // Use the hospital recommendation workflow
      const workflow = mastra.getWorkflow("hospitalRecommendationWorkflow");
      const run = await workflow.createRunAsync();
      const workflowResult = await run.start({
        inputData: {
          userQuery: query,
          location: location || {},
          preferences: preferences || {},
        },
      });

      return NextResponse.json({
        success: true,
        data: workflowResult,
      });
    } else {
      // Use the hospital assistant agent directly (default behavior)
      const agent = mastra.getAgent("hospitalAssistantAgent");
      
      // Construct a comprehensive message that includes location and preferences
      let fullMessage = query;
      if (location && (location.city || location.state)) {
        fullMessage += `\n\nLocation preferences: ${location.city ? `City: ${location.city}` : ''}${location.state ? ` State: ${location.state}` : ''}`;
      }
      if (preferences && Object.keys(preferences).length > 0) {
        fullMessage += `\n\nPreferences: ${JSON.stringify(preferences, null, 2)}`;
      }

      const response = await agent.generate([{ role: "user", content: fullMessage }]);

      return NextResponse.json({
        success: true,
        data: {
          response: response.text,
          toolCalls: response.toolCalls || [],
          query: query,
          location: location || null,
          preferences: preferences || null
        },
      });
    }
  } catch (error) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process AI assistant request", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message");

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message parameter is required" },
        { status: 400 }
      );
    }

    // Use the hospital assistant agent for simple queries
    const agent = mastra.getAgent("hospitalAssistantAgent");
    const response = await agent.generate([{ role: "user", content: message }]);

    return NextResponse.json({
      success: true,
      data: {
        response: response.text,
        toolCalls: response.toolCalls || [],
      },
    });
  } catch (error) {
    console.error("AI Assistant GET API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process AI assistant query" },
      { status: 500 }
    );
  }
}
