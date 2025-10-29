// middleware/authenticateJWT.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'myjwtsecret'; // Secret key for signing tokens

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

module.exports = { authenticateJWT, SECRET_KEY };
