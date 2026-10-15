import app from './app';
import { ENV } from './config/env';
import { connectDatabase } from './config/db';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    // 1. Database connection check
    await connectDatabase();

    // 2. Start HTTP Server
    const port = parseInt(ENV.PORT, 10) || 5000;
    const server = app.listen(port, () => {
      logger.info(`🚀 Server running in ${ENV.NODE_ENV} mode on port ${port}`);
      logger.info(`👉 Health check: http://localhost:${port}/health`);
      logger.info(`👉 API Base: http://localhost:${port}/api`);
    });

    // Graceful Shutdown
    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: any) {
    logger.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

bootstrap();
