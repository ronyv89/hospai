
import { Mastra } from '@mastra/core';
import { hospitalAssistantAgent } from './agents/hospital-assistant';
import { hospitalRecommendationWorkflow } from './workflows/hospital-recommendation';

export const mastra = new Mastra({
  agents: { hospitalAssistantAgent },
  workflows: { hospitalRecommendationWorkflow }
});