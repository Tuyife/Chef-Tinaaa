import { Router } from 'express';
import { getOverview } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/overview', protect, authorize('admin'), getOverview);

export default router;
