import { Router } from 'express';
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', createMessage);
router.get('/', protect, authorize('admin'), getMessages);
router.put('/:id', protect, authorize('admin'), updateMessage);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

export default router;
