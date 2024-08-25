// utils/transcriptFetcher.ts
import { YoutubeTranscript } from 'youtube-transcript';

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    console.log('Fetching transcript for video:', videoId);
    const transcript: TranscriptSegment[] = await YoutubeTranscript.fetchTranscript(videoId);
    console.log('Fetched transcript:', transcript);
    return transcript.map(segment => segment.text).join(' ');
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
}