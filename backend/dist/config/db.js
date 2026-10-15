"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        logger_1.logger.info('Database connection established successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to PostgreSQL database: %s', error.message);
        throw error;
    }
}
//# sourceMappingURL=db.js.map