"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = exports.subjectSchema = exports.semesterSchema = exports.programSchema = exports.departmentSchema = void 0;
const zod_1 = require("zod");
exports.departmentSchema = zod_1.z.object({
    code: zod_1.z.string().min(2, 'Department code must be at least 2 characters'),
    name: zod_1.z.string().min(2, 'Department name is required'),
    description: zod_1.z.string().optional()
});
exports.programSchema = zod_1.z.object({
    code: zod_1.z.string().min(2, 'Program code must be at least 2 characters'),
    name: zod_1.z.string().min(2, 'Program name is required'),
    durationYears: zod_1.z.number().min(1).max(6).default(4),
    totalSemesters: zod_1.z.number().min(1).max(12).default(8),
    departmentId: zod_1.z.string().uuid('Valid department ID required')
});
exports.semesterSchema = zod_1.z.object({
    number: zod_1.z.number().min(1).max(12),
    name: zod_1.z.string().min(1),
    programId: zod_1.z.string().uuid('Valid program ID required')
});
exports.subjectSchema = zod_1.z.object({
    code: zod_1.z.string().min(2, 'Subject code is required'),
    name: zod_1.z.string().min(2, 'Subject name is required'),
    description: zod_1.z.string().optional(),
    semesterId: zod_1.z.string().uuid('Valid semester ID required'),
    departmentId: zod_1.z.string().uuid('Valid department ID required')
});
exports.categorySchema = zod_1.z.object({
    code: zod_1.z.string().min(2, 'Category code is required'),
    name: zod_1.z.string().min(2, 'Category name is required'),
    description: zod_1.z.string().optional()
});
//# sourceMappingURL=academic.validator.js.map