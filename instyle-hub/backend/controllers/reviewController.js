import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createReview = async (req, res) => {
    try {
        const { designerId, rating, comment } = req.body;
        const customerId = req.userId;

        // Validate
        if (!designerId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if designer exists
        const designer = await prisma.designer.findUnique({
            where: { id: designerId }
        });

        if (!designer) {
            return res.status(404).json({ error: 'Designer not found' });
        }

        // Check if customer already reviewed this designer
        const existingReview = await prisma.review.findFirst({
            where: {
                customerId,
                designerId
            }
        });

        if (existingReview) {
            // Update existing review
            const updated = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment }
            });

            return res.json({
                message: 'Review updated successfully',
                review: updated
            });
        }

        // Create new review
        const review = await prisma.review.create({
            data: {
                id: uuidv4(),
                customerId,
                designerId,
                rating,
                comment
            },
            include: {
                customer: {
                    select: { name: true, id: true }
                }
            }
        });

        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

export const getDesignerReviews = async (req, res) => {
    try {
        const { designerId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { designerId },
            include: {
                customer: {
                    select: { name: true, id: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const customerId = req.userId;

        const reviews = await prisma.review.findMany({
            where: { customerId },
            include: {
                designer: {
                    select: { brandName: true, id: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId;

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.customerId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
