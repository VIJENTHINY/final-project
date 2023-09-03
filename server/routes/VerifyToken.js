const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            console.log('No token found in request header');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.userId = decoded.userId;
        console.log('userId:', req.userId);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;