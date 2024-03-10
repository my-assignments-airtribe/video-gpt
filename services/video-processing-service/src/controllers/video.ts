// src/controllers/videoController.ts
import { Request, Response } from 'express';
import { processVideoFromUrl } from '../services/video';

export const processVideoByUrl = async (req: Request, res: Response) => {
  const { videoUrl } = req.body;
  const userId = req.user?.userId;
  const username = req.user?.username;
  if (!userId && !username) {
    return res.status(400).json({ message: 'User missing in request context' });
  }
  if (!videoUrl) {
    return res.status(400).json({ message: 'Video URL is required.' });
  }
  try {
    const { transcript, keywords } = await processVideoFromUrl(videoUrl);
    res.json({ transcript, keywords });
  } catch (error:any) {
    res.status(500).json({ message: 'Error processing video', error: error.message });
  }
};
