import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import { prisma } from './config/db';

import authRoutes from './routes/auth.routes';

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ENV.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate limiting
const limiter = rateLimit({
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  next();
});

// Health Checks
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'ok',
      service: 'college-resource-backend',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error: any) {
    return res.status(503).json({
      status: 'unhealthy',
      service: 'college-resource-backend',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/ready', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'ready' });
});

// API Routes
app.use('/api/auth', authRoutes);

// Base API Info Route
app.get('/api', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to AI-Powered Centralized College Resource Sharing Hub API',
    version: '1.0.0'
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
