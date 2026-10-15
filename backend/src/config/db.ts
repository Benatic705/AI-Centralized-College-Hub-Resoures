import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully');
  } catch (error: any) {
    logger.error('Failed to connect to PostgreSQL database: %s', error.message);
    throw error;
  }
}
