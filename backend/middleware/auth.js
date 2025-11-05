const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - check if user is authenticated
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in cookies or Authorization header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).render('error', {
            message: 'Not authorized to access this route',
            error: { status: 401 }
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).render('error', {
                message: 'User not found',
                error: { status: 401 }
            });
        }

        next();
    } catch (error) {
        return res.status(401).render('error', {
            message: 'Not authorized to access this route',
            error: { status: 401 }
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).render('error', {
                message: `User role '${req.user.role}' is not authorized to access this route`,
                error: { status: 403 }
            });
        }
        next();
    };
};

// Check if user is logged in (for views)
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies && req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            res.locals.user = req.user;
        } catch (error) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};

