// src/utils/ffmpeg.ts
import ffmpeg from 'fluent-ffmpeg';

export const transcodeVideo = (inputPath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputFormat('mp4') // or any format you prefer
      .videoCodec('libx264') // standard codec for compatibility
      .audioCodec('aac') // standard audio codec
      .on('end', resolve)
      .on('error', (err: Error) => reject(err))
      .save(outputPath);
  });
};
