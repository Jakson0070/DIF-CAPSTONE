// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const authenticate = (req, res, next) => {
    console.log('AUTH MIDDLEWARE HIT', req.method, req.originalUrl);

   

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded); // Debug log
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;