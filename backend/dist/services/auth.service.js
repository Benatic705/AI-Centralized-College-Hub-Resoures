"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
class AuthService {
    async register(data) {
        const existing = await db_1.prisma.user.findUnique({
            where: { email: data.email.toLowerCase() }
        });
        if (existing) {
            throw new errors_1.ConflictError('A user with this email address already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email: data.email.toLowerCase(),
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role || client_1.Role.STUDENT,
                status: client_1.UserStatus.ACTIVE,
                departmentId: data.departmentId,
                programId: data.programId,
                semesterId: data.semesterId
            },
            include: {
                department: true,
                program: true,
                semester: true
            }
        });
        // Create Audit Log
        await db_1.prisma.auditLog.create({
            data: {
                actorId: user.id,
                action: 'USER_REGISTERED',
                entityType: 'User',
                entityId: user.id,
                metadata: { email: user.email, role: user.role }
            }
        });
        const tokenPayload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken
        };
    }
    async login(email, pass) {
        const user = await db_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                department: true,
                program: true,
                semester: true
            }
        });
        if (!user) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new errors_1.AuthenticationError('Your account has been deactivated or suspended');
        }
        const isMatch = await bcryptjs_1.default.compare(pass, user.passwordHash);
        if (!isMatch) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        const tokenPayload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        // Audit Log
        await db_1.prisma.auditLog.create({
            data: {
                actorId: user.id,
                action: 'USER_LOGIN',
                entityType: 'User',
                entityId: user.id
            }
        });
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken
        };
    }
    async refreshToken(token) {
        try {
            const payload = (0, jwt_1.verifyRefreshToken)(token);
            const user = await db_1.prisma.user.findUnique({
                where: { id: payload.userId }
            });
            if (!user || user.status !== client_1.UserStatus.ACTIVE) {
                throw new errors_1.AuthenticationError('Invalid refresh token or inactive account');
            }
            const newPayload = { userId: user.id, email: user.email, role: user.role };
            const newAccessToken = (0, jwt_1.generateAccessToken)(newPayload);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(newPayload);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        }
        catch (error) {
            throw new errors_1.AuthenticationError('Invalid or expired refresh token');
        }
    }
    async getCurrentUser(userId) {
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
                avatarUrl: true,
                departmentId: true,
                programId: true,
                semesterId: true,
                department: true,
                program: true,
                semester: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new errors_1.NotFoundError('User profile not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map