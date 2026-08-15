import { Router } from 'express';
import {
  getPublished,
  getAdmin,
  create,
  update,
  remove,
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/public', getPublished);
router.get('/all', protect, authorize('admin'), getAdmin);
router.post('/', protect, authorize('admin'), create);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);

export default router;
