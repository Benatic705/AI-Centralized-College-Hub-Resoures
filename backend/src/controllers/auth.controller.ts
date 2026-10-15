import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';
import { ValidationError } from '../utils/errors';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = registerSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Validation failed', parseResult.error.format());
      }

      const result = await authService.register(parseResult.data);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Validation failed', parseResult.error.format());
      }

      const result = await authService.login(parseResult.data.email, parseResult.data.password);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = refreshSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Validation failed', parseResult.error.format());
      }

      const result = await authService.refreshToken(parseResult.data.refreshToken);
      return res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const user = await authService.getCurrentUser(req.user.userId);
      return res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
