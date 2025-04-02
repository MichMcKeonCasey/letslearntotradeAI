// /home/project/lib/gemini.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// IMPORTANT: Replace with your actual Google AI Studio API Key
// You should ideally store this in environment variables (e.g., .env.local)
// Example: GEMINI_API_KEY
const API_KEY = "YOUR_GEMINI_API_KEY"; // PASTE YOUR GEMINI API KEY HERE

if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
  console.warn("Gemini API Key is missing or using placeholder. Please add your key to lib/gemini.ts");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Or another suitable model
});

const generationConfig = {
  temperature: 0.8, // Adjust creativity vs. factuality
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
  // responseMimeType: "text/plain", // Or "application/json" if needed
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Generates content using the Gemini model.
 * @param prompt The text prompt to send to the model.
 * @returns The generated text content.
 * @throws Throws an error if the API call fails or content is blocked.
 */
export async function generateContent(prompt: string): Promise<string> {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
    throw new Error("Gemini API Key is not configured.");
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [], // Start fresh for each call in this simple helper
    });

    const result = await chatSession.sendMessage(prompt);

    // Check for blocked content (important!)
    if (!result.response) {
        console.error("Gemini response was blocked or empty.", result);
        throw new Error("Gemini response was blocked or empty. Check safety settings or prompt.");
    }
     if (result.response.promptFeedback?.blockReason) {
        console.error("Gemini prompt was blocked:", result.response.promptFeedback.blockReason);
        throw new Error(`Gemini prompt was blocked: ${result.response.promptFeedback.blockReason}`);
     }


    const text = result.response.text();
    if (!text) {
        console.error("Gemini returned empty text content.", result.response);
        throw new Error("Gemini returned empty text content.");
    }
    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a more specific error message if possible
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    } else {
        throw new Error("An unknown error occurred while calling the Gemini API.");
    }
  }
}

/**
 * Generates content and attempts to parse it as JSON.
 * @param prompt The text prompt designed to elicit a JSON response.
 * @returns The parsed JSON object.
 * @throws Throws an error if the API call fails, content is blocked, or parsing fails.
 */
export async function generateJsonContent<T>(prompt: string): Promise<T> {
    const rawResponse = await generateContent(prompt + "\n\nRespond ONLY with valid JSON that conforms to the requested structure. Do not include any introductory text, code block markers (like ```json), or explanations.");

    try {
        // Basic cleanup attempt for common issues like markdown code blocks
        const cleanedResponse = rawResponse.replace(/^```json\s*|```$/g, '').trim();
        const parsedJson = JSON.parse(cleanedResponse);
        return parsedJson as T;
    } catch (error) {
        console.error("Failed to parse Gemini response as JSON:", error);
        console.error("Raw response was:", rawResponse); // Log the raw response for debugging
        throw new Error(`Failed to parse Gemini response as JSON. Raw response: ${rawResponse.substring(0, 100)}...`);
    }
}
