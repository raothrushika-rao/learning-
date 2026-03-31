import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
    try {
        const { designerId, date, notes } = req.body;
        const customerId = req.userId;

        // Validate
        if (!designerId || !date) {
            return res.status(400).json({ error: 'Designer ID and date required' });
        }

        // Check if designer exists
        const designer = await prisma.designer.findUnique({
            where: { id: designerId }
        });

        if (!designer) {
            return res.status(404).json({ error: 'Designer not found' });
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                id: uuidv4(),
                customerId,
                designerId,
                date: new Date(date),
                notes: notes || '',
                status: 'pending'
            },
            include: {
                customer: {
                    select: { name: true, email: true }
                },
                designer: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;
        const { role } = req.query;

        let where = {};

        if (role === 'customer') {
            where.customerId = userId;
        } else if (role === 'designer') {
            where.designerId = userId;
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                customer: {
                    select: { name: true, email: true, id: true }
                },
                designer: {
                    select: { brandName: true, id: true },
                    include: {
                        user: {
                            select: { email: true }
                        }
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Only designer can update status
        if (booking.designerId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: { status }
        });

        res.json({
            message: 'Booking updated successfully',
            booking: updated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.userId;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.customerId !== userId && booking.designerId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'cancelled' }
        });

        res.json({
            message: 'Booking cancelled successfully',
            booking: updated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};
