import { Router } from 'express';
import { processVideoByUrl } from '../controllers/video';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/process-video',authenticate, processVideoByUrl);

export default router;
