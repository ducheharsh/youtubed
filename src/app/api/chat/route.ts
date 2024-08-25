// pages/api/chat.ts
import { createGeminiModel } from '../../../utils/geminiModel';
import { fetchTranscript } from '../../../utils/transcriptFetcher';
import { createTranscriptChain } from '../../../utils/transcriptProcessor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
 
  const body = await req.json();
  const videoId = body.videoId
  const message = body.message

  if (!videoId || !message) {
    return NextResponse.json({ error: 'Missing videoId or message in request body' });
  }

  try {
    const transcript = await fetchTranscript(videoId);

    const model = await createGeminiModel();

    const chain = createTranscriptChain(model);

    const response = await chain.call({
      transcript: transcript,
      human_input: message,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Error in chat handler:', error);
    return NextResponse.json({ error: 'Failed to process request' });
  }
}