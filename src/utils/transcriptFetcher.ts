// utils/transcriptFetcher.ts
import { YoutubeTranscript } from 'youtube-transcript';

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const transcript: TranscriptSegment[] = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(segment => segment.text).join(' ');
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
}