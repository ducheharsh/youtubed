// utils/transcriptFetcher.ts
import { YoutubeTranscript } from 'youtube-transcript';
import {Innertube} from 'youtubei.js/web';



export async function fetchTranscript(videoId: string): Promise<string> {
  const youtube = await Innertube.create({
    lang: 'en',
    location: 'US',
    retrieve_player: false,
  });

  try {
    const info = await youtube.getInfo(videoId);
		const transcriptData = await info.getTranscript();
    console.log('Fetching transcript for video:', videoId);

    return transcriptData.transcript.content?.body?.initial_segments.map(segment => segment.snippet.text).filter(Boolean).join('') || '';
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
}