import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getDesigners = async (req, res) => {
    try {
        const { specialty, search } = req.query;

        let where = {};

        if (specialty && specialty !== 'all') {
            where.specialty = specialty;
        }

        if (search) {
            where.OR = [
                { brandName: { contains: search } },
                { bio: { contains: search } }
            ];
        }

        const designers = await prisma.designer.findMany({
            where,
            include: {
                user: {
                    select: { name: true, email: true }
                },
                reviews: true
            }
        });

        // Calculate average rating
        const designersWithRating = designers.map(designer => ({
            ...designer,
            rating: designer.reviews.length > 0
                ? (designer.reviews.reduce((sum, r) => sum + r.rating, 0) / designer.reviews.length).toFixed(1)
                : 5.0
        }));

        res.json(designersWithRating);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch designers' });
    }
};

export const getDesignerById = async (req, res) => {
    try {
        const { id } = req.params;

        const designer = await prisma.designer.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                reviews: {
                    include: {
                        customer: {
                            select: { name: true, id: true }
                        }
                    }
                }
            }
        });

        if (!designer) {
            return res.status(404).json({ error: 'Designer not found' });
        }

        // Calculate average rating
        const rating = designer.reviews.length > 0
            ? (designer.reviews.reduce((sum, r) => sum + r.rating, 0) / designer.reviews.length).toFixed(1)
            : 5.0;

        res.json({
            ...designer,
            rating
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch designer' });
    }
};

export const updateDesignerProfile = async (req, res) => {
    try {
        const { brandName, bio, specialty, pricingRange } = req.body;

        const designer = await prisma.designer.findUnique({
            where: { userId: req.userId }
        });

        if (!designer) {
            return res.status(404).json({ error: 'Designer profile not found' });
        }

        const updated = await prisma.designer.update({
            where: { id: designer.id },
            data: {
                brandName,
                bio,
                specialty,
                pricingRange
            }
        });

        res.json({
            message: 'Profile updated successfully',
            designer: updated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const searchDesigners = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.json([]);
        }

        const designers = await prisma.designer.findMany({
            where: {
                OR: [
                    { brandName: { contains: query, mode: 'insensitive' } },
                    { specialty: { contains: query, mode: 'insensitive' } },
                    { bio: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 10,
            include: {
                reviews: true
            }
        });

        res.json(designers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Search failed' });
    }
};
