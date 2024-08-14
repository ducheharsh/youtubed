// pages/api/chat.ts
import { createGeminiModel } from '../../../utils/geminiModel';
import { createTranscriptChain } from '../../../utils/playlistSuggester';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
 
  const body = await req.json();
  const topic = body.topic
  
  if (!topic) {
    return NextResponse.json({ error: 'Missing topic in request body' });
  }

  try {

    const model = createGeminiModel();
    const chain = createTranscriptChain(model);

    const response = await chain.call({
        topic: topic,
    });

    return NextResponse.json({ output: response});
  } catch (error) {
  
    console.error('Error in chat handler:', error);
    return NextResponse.json({ error: 'Failed to process request' });
  }
}