"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicService = exports.AcademicService = void 0;
const db_1 = require("../config/db");
const errors_1 = require("../utils/errors");
class AcademicService {
    // --- Departments ---
    async getDepartments() {
        return db_1.prisma.department.findMany({
            where: { isDeleted: false },
            include: {
                _count: {
                    select: { programs: true, subjects: true, resources: true, users: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }
    async createDepartment(data) {
        const existing = await db_1.prisma.department.findUnique({ where: { code: data.code.toUpperCase() } });
        if (existing)
            throw new errors_1.ConflictError('Department code already exists');
        return db_1.prisma.department.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                description: data.description
            }
        });
    }
    async updateDepartment(id, data) {
        return db_1.prisma.department.update({
            where: { id },
            data
        });
    }
    async deleteDepartment(id) {
        const resourceCount = await db_1.prisma.resource.count({ where: { departmentId: id, isDeleted: false } });
        if (resourceCount > 0) {
            throw new errors_1.ConflictError(`Cannot delete department with ${resourceCount} active linked resources. Use soft delete or archive resources first.`);
        }
        return db_1.prisma.department.update({
            where: { id },
            data: { isDeleted: true }
        });
    }
    // --- Programs ---
    async getPrograms(departmentId) {
        return db_1.prisma.program.findMany({
            where: {
                isDeleted: false,
                ...(departmentId ? { departmentId } : {})
            },
            include: {
                department: true,
                _count: { select: { semesters: true, resources: true } }
            },
            orderBy: { name: 'asc' }
        });
    }
    async createProgram(data) {
        const existing = await db_1.prisma.program.findUnique({ where: { code: data.code.toUpperCase() } });
        if (existing)
            throw new errors_1.ConflictError('Program code already exists');
        const program = await db_1.prisma.program.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                durationYears: data.durationYears || 4,
                totalSemesters: data.totalSemesters || 8,
                departmentId: data.departmentId
            }
        });
        // Auto-generate default semesters
        const semesterData = [];
        for (let i = 1; i <= program.totalSemesters; i++) {
            semesterData.push({
                number: i,
                name: `Semester ${i}`,
                programId: program.id
            });
        }
        await db_1.prisma.semester.createMany({ data: semesterData });
        return db_1.prisma.program.findUnique({
            where: { id: program.id },
            include: { semesters: true, department: true }
        });
    }
    // --- Semesters ---
    async getSemesters(programId) {
        return db_1.prisma.semester.findMany({
            where: { programId, isDeleted: false },
            include: {
                subjects: { where: { isDeleted: false } },
                _count: { select: { resources: true } }
            },
            orderBy: { number: 'asc' }
        });
    }
    // --- Subjects ---
    async getSubjects(filter) {
        return db_1.prisma.subject.findMany({
            where: {
                isDeleted: false,
                ...(filter?.departmentId ? { departmentId: filter.departmentId } : {}),
                ...(filter?.semesterId ? { semesterId: filter.semesterId } : {})
            },
            include: {
                department: true,
                semester: true,
                _count: { select: { resources: true } }
            },
            orderBy: { name: 'asc' }
        });
    }
    async createSubject(data) {
        const existing = await db_1.prisma.subject.findUnique({ where: { code: data.code.toUpperCase() } });
        if (existing)
            throw new errors_1.ConflictError('Subject code already exists');
        return db_1.prisma.subject.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                description: data.description,
                semesterId: data.semesterId,
                departmentId: data.departmentId
            },
            include: { department: true, semester: true }
        });
    }
    // --- Categories ---
    async getCategories() {
        return db_1.prisma.category.findMany({
            where: { isActive: true },
            include: { _count: { select: { resources: true } } },
            orderBy: { name: 'asc' }
        });
    }
    async createCategory(data) {
        const existing = await db_1.prisma.category.findUnique({ where: { code: data.code.toUpperCase() } });
        if (existing)
            throw new errors_1.ConflictError('Category code already exists');
        return db_1.prisma.category.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                description: data.description
            }
        });
    }
}
exports.AcademicService = AcademicService;
exports.academicService = new AcademicService();
//# sourceMappingURL=academic.service.js.map