// src/utils/extractAudio.ts
import ffmpeg from 'fluent-ffmpeg';

export const extractAudioFromVideo = (videoPath: string, audioOutputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioOutputPath)
      .audioCodec('libmp3lame')
      .on('end', () => resolve())
      .on('error', (err: Error) => reject(err))
      .run();
  });
};
