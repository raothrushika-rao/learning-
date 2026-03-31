import express from 'express';
import {
    createReview,
    getDesignerReviews,
    getMyReviews,
    deleteReview
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/designer/:designerId', getDesignerReviews);

// Protected routes
router.post('/', authMiddleware, createReview);
router.get('/', authMiddleware, getMyReviews);
router.delete('/:reviewId', authMiddleware, deleteReview);

export default router;
