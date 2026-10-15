"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    if (err instanceof errors_1.AppError) {
        logger_1.logger.warn(`AppError [${err.code}]: ${err.message}`, {
            path: req.path,
            method: req.method,
            details: err.details
        });
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
    }
    logger_1.logger.error(`Unhandled Exception: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred on the server'
                : err.message
        }
    });
}
//# sourceMappingURL=error.middleware.js.map