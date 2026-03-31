import express from 'express';
import {
    getDesigners,
    getDesignerById,
    updateDesignerProfile,
    searchDesigners
} from '../controllers/designerController.js';
import { authMiddleware, designerMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getDesigners);
router.get('/search', searchDesigners);
router.get('/:id', getDesignerById);

// Protected routes
router.put('/profile', authMiddleware, designerMiddleware, updateDesignerProfile);

export default router;
