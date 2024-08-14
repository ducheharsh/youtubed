// utils/transcriptProcessor.ts
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export function createTranscriptChain(llm: ChatGoogleGenerativeAI): LLMChain {
  const template = `
    You are an AI assistant that analyzes YouTube video transcripts.
    Given the following transcript, be ready to answer questions about its content.

    Transcript: {transcript}

    Human: {human_input}
    AI: Let's analyze this transcript and answer the question.
  `;

  const promptTemplate = new PromptTemplate({
    template: template,
    inputVariables: ['transcript', 'human_input'],
  });

  
  return new LLMChain({ llm, prompt: promptTemplate });
}