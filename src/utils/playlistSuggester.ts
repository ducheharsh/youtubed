import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JsonOutputParser } from "@langchain/core/output_parsers";

interface Playlist {
  title: string;
  id: string;
  url: string;
  description: string;
}

interface Playlists {
  playlists: Playlist[];
}

export function createTranscriptChain(llm: ChatGoogleGenerativeAI): LLMChain<Playlists> {
  const parser = new JsonOutputParser<Playlists>();

  const template = `
    You are an AI assistant with knowledge about popular YouTube playlists up to your last training data.
    Return a JSON object with a "playlists" key that contains an array of objects representing well-known, popular playlists for {topic} on YouTube.
    Each playlist object should have these fields:
    - "title": The title of the playlist
    - "id": A valid YouTube playlist ID (a string of 34 characters, consisting of uppercase and lowercase letters, numbers, and hyphens)
    - "url": The full YouTube URL for the playlist (https://www.youtube.com/playlist?list=<playlist_id>)
    - "description": A brief description of the playlist content

    Provide at least 3 playlists that are likely to still exist due to their popularity or association with well-known channels.
    Focus on playlists from verified channels, educational institutions, or widely recognized content creators in the field of {topic}.
    The response should be a valid JSON object.

    Important: While you should strive for accuracy, acknowledge that you cannot guarantee these playlists still exist or are accessible.

    {format_instructions}
  `;

  const promptTemplate = new PromptTemplate({
    template: template,
    inputVariables: ['topic'],
    partialVariables: {
      format_instructions: parser.getFormatInstructions(),
    },
  });

  return new LLMChain<Playlists>({
    llm,
    prompt: promptTemplate,
    outputParser: parser,
  });
}