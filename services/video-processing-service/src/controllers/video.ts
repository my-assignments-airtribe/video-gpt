// src/controllers/videoController.ts
import { Request, Response } from 'express';
import { processVideoFromUrl } from '../services/video';
import VideoProcessingResult from '../models';

export const processVideoByUrl = async (req: Request, res: Response) => {
  const { videoUrl } = req.body;
  const username = req.user?.username;
  if (!username) {
    return res.status(400).json({ message: 'User missing in request context' });
  }
  if (!videoUrl) {
    return res.status(400).json({ message: 'Video URL is required.' });
  }
  try {
    const { transcript, keywords } = await processVideoFromUrl(videoUrl);
    const videoProcessingResult = new VideoProcessingResult({
      username,
      videoUrl,
      transcript,
      keywords,
    });
    await videoProcessingResult.save();
    res.json({ transcript, keywords });
  } catch (error:any) {
    res.status(500).json({ message: 'Error processing video', error: error.message });
  }
};
