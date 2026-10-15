"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    try {
        // 1. Database connection check
        await (0, db_1.connectDatabase)();
        // 2. Start HTTP Server
        const port = parseInt(env_1.ENV.PORT, 10) || 5000;
        const server = app_1.default.listen(port, () => {
            logger_1.logger.info(`🚀 Server running in ${env_1.ENV.NODE_ENV} mode on port ${port}`);
            logger_1.logger.info(`👉 Health check: http://localhost:${port}/health`);
            logger_1.logger.info(`👉 API Base: http://localhost:${port}/api`);
        });
        // Graceful Shutdown
        const shutdown = (signal) => {
            logger_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                logger_1.logger.info('HTTP server closed.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('Failed to start backend server:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=server.js.map