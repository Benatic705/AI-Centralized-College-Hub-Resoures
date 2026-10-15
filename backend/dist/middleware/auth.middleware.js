"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AuthenticationError('Missing or invalid Authorization header');
        }
        const token = authHeader.split(' ')[1];
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(new errors_1.AuthenticationError('Token has expired'));
        }
        else if (error instanceof errors_1.AuthenticationError) {
            next(error);
        }
        else {
            next(new errors_1.AuthenticationError('Invalid authentication token'));
        }
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.AuthenticationError('User authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new errors_1.AuthorizationError(`Access denied. Requires one of roles: ${allowedRoles.join(', ')}`));
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map