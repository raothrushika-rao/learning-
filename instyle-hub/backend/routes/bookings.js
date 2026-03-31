import express from 'express';
import {
    createBooking,
    getUserBookings,
    updateBookingStatus,
    cancelBooking
} from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All protected routes
router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.put('/:bookingId', authMiddleware, updateBookingStatus);
router.delete('/:bookingId', authMiddleware, cancelBooking);

export default router;
