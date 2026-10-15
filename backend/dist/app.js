"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
// Security Headers
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.ENV.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this IP, please try again later.'
        }
    }
});
app.use(limiter);
// Body Parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    next();
});
// Health Checks
app.get('/health', async (req, res) => {
    try {
        await db_1.prisma.$queryRaw `SELECT 1`;
        return res.status(200).json({
            status: 'ok',
            service: 'college-resource-backend',
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    }
    catch (error) {
        return res.status(503).json({
            status: 'unhealthy',
            service: 'college-resource-backend',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});
app.get('/ready', (req, res) => {
    return res.status(200).json({ status: 'ready' });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
// Base API Info Route
app.get('/api', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to AI-Powered Centralized College Resource Sharing Hub API',
        version: '1.0.0'
    });
});
// Central Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map