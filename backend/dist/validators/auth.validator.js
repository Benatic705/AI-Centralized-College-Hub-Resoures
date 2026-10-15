"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    role: zod_1.z.nativeEnum(client_1.Role).optional().default(client_1.Role.STUDENT),
    departmentId: zod_1.z.string().uuid().optional(),
    programId: zod_1.z.string().uuid().optional(),
    semesterId: zod_1.z.string().uuid().optional()
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
});
//# sourceMappingURL=auth.validator.js.map