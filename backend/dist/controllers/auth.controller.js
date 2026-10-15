"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const errors_1 = require("../utils/errors");
class AuthController {
    async register(req, res, next) {
        try {
            const parseResult = auth_validator_1.registerSchema.safeParse(req.body);
            if (!parseResult.success) {
                throw new errors_1.ValidationError('Validation failed', parseResult.error.format());
            }
            const result = await auth_service_1.authService.register(parseResult.data);
            return res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const parseResult = auth_validator_1.loginSchema.safeParse(req.body);
            if (!parseResult.success) {
                throw new errors_1.ValidationError('Validation failed', parseResult.error.format());
            }
            const result = await auth_service_1.authService.login(parseResult.data.email, parseResult.data.password);
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const parseResult = auth_validator_1.refreshSchema.safeParse(req.body);
            if (!parseResult.success) {
                throw new errors_1.ValidationError('Validation failed', parseResult.error.format());
            }
            const result = await auth_service_1.authService.refreshToken(parseResult.data.refreshToken);
            return res.status(200).json({
                success: true,
                message: 'Tokens refreshed successfully',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            return res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            if (!req.user) {
                throw new errors_1.ValidationError('User not authenticated');
            }
            const user = await auth_service_1.authService.getCurrentUser(req.user.userId);
            return res.status(200).json({
                success: true,
                message: 'User profile retrieved successfully',
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map