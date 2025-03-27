// utils/geminiModel.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export function createGeminiModel(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    modelName: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_AI_API_KEY,
    temperature: 0.7,
  });
}