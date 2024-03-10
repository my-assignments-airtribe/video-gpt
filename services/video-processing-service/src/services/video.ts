// src/services/videoService.ts
import { downloadVideo } from '../utils/download-video';
import { transcodeVideo } from '../utils/ffmpeg';
import path from 'path';
import fs from 'fs';
import { extractAudioFromVideo } from './extract-audio';
import { transcribeAudio } from './transcription';
import { extractKeywords } from '../utils/extract-keywords';

const tmpDir = path.resolve(__dirname, '../../tmp');

export const processVideoFromUrl = async (videoUrl: string): Promise<{ transcript: string, keywords: string[] }> => {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const timestamp = Date.now();
  let processedFilePath = '';
  let audioOutputPath = '';
  const downloadedFilePath = await downloadVideo(videoUrl, path.join(tmpDir, `original-${timestamp}.mp4`)).then((res) => {
    processedFilePath = path.join(tmpDir, `processed-${timestamp}.mp4`);
    audioOutputPath = path.join(tmpDir, `audio-${timestamp}.mp3`);
    return res;
  });
  

  try {
    await transcodeVideo(downloadedFilePath, processedFilePath);
    await extractAudioFromVideo(processedFilePath, audioOutputPath);
    const transcript = await transcribeAudio(audioOutputPath);
    const keywords = extractKeywords(transcript);
    return { transcript, keywords };
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  } finally {
    fs.unlinkSync(downloadedFilePath);
    fs.unlinkSync(processedFilePath);
    fs.unlinkSync(audioOutputPath);
  }
};
