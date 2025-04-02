// /home/project/agents/contentStrategist.ts
import { AIAgent, ContentStrategyInput, ContentStrategyOutput, ContentPiece } from './types';
import { generateJsonContent } from '@/lib/gemini'; // Import the Gemini helper

export class ContentStrategistAgent implements AIAgent<ContentStrategyInput, ContentStrategyOutput> {
    name = 'ContentStrategistAgent';
    description = 'Analyzes user queries using AI, determines intent, and plans content structure, topics, and keywords.';

    async process(input: ContentStrategyInput): Promise<ContentStrategyOutput> {
        console.log(`ContentStrategist processing query: "${input.userQuery}" with Gemini`);

        const prompt = `
Analyze the following user query about financial market trading: "${input.userQuery}"

Consider the likely user intent (e.g., learning basics, finding specific information, comparing options) and the typical target audience (assume beginner unless specified otherwise, target audience hint: ${input.targetAudience || 'beginner'}).

Based on this analysis, generate a content strategy plan in JSON format. The JSON object should have the following structure:
{
  "intent": "A concise description of the user's likely goal (e.g., 'Learn How to Start Trading Stocks', 'Understand Options Basics', 'Compare Forex Brokers').",
  "keyTopics": ["An array of specific topics the content should cover (e.g., 'Brokerage Account Setup', 'Market Orders vs Limit Orders', 'Risk Management Fundamentals')."],
  "proposedTitle": "A compelling and relevant title for the content piece.",
  "contentOutline": ["An array of strings representing the main sections or headings for the content (e.g., 'Introduction', 'What is Forex?', 'Choosing a Broker', 'Placing a Trade', 'Key Risks', 'Conclusion')."],
  "contentType": "Suggest the most appropriate content type ('article', 'guide', 'faq', 'glossary', 'interactive_module').",
  "keywords": ["An array of relevant SEO keywords (e.g., 'forex trading for beginners', 'how to trade currency', 'best forex platform')."]
}

Ensure the output is ONLY the valid JSON object, without any introductory text or markdown formatting.
`;

        try {
            // Use the JSON helper function
            const strategyOutput = await generateJsonContent<ContentStrategyOutput>(prompt);

            // Basic validation (can be enhanced with Zod)
            if (!strategyOutput || typeof strategyOutput !== 'object' || !strategyOutput.intent || !Array.isArray(strategyOutput.keyTopics)) {
                 console.error("Invalid JSON structure received from Gemini:", strategyOutput);
                 throw new Error("Received invalid JSON structure from ContentStrategistAgent's AI call.");
            }


            console.log(`ContentStrategist determined intent via Gemini: ${strategyOutput.intent}`);
            return strategyOutput;
        } catch (error) {
            console.error(`Error in ContentStrategistAgent processing: ${error}`);
            // Fallback to a default/error state or re-throw
            throw new Error(`ContentStrategistAgent failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
