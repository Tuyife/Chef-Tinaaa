import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  claimBooking,
  updateBooking,
} from '../controllers/bookingController.js';
import { protect, optionalProtect, authorize } from '../middleware/auth.js';

const router = Router();

// Guests (no token) can create a booking; logged-in customers can too.
// optionalProtect links the booking to the account when a valid token is sent.
router.post('/', optionalProtect, createBooking);

// Logged-in users claim bookings made earlier as a guest.
router.post('/claim', protect, claimBooking);

router.use(protect);

// Customers create bookings; both customers (own) and admins (all) can list.
router.get('/', getBookings);
router.get('/:id', getBooking);
router.put('/:id', authorize('admin'), updateBooking);

export default router;
