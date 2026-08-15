import { Router } from 'express';
import { getCustomers, toggleCustomer } from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', getCustomers);
router.put('/:id', toggleCustomer);

export default router;
