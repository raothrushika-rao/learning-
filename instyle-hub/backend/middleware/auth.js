import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const designerMiddleware = (req, res, next) => {
    if (req.userRole !== 'designer') {
        return res.status(403).json({ error: 'Only designers can access this' });
    }
    next();
};

export const customerMiddleware = (req, res, next) => {
    if (req.userRole !== 'customer') {
        return res.status(403).json({ error: 'Only customers can access this' });
    }
    next();
};
