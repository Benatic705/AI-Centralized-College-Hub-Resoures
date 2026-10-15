"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicController = exports.AcademicController = void 0;
const academic_service_1 = require("../services/academic.service");
const academic_validator_1 = require("../validators/academic.validator");
const errors_1 = require("../utils/errors");
class AcademicController {
    // Departments
    async getDepartments(req, res, next) {
        try {
            const data = await academic_service_1.academicService.getDepartments();
            return res.status(200).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async createDepartment(req, res, next) {
        try {
            const parsed = academic_validator_1.departmentSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.ValidationError('Invalid payload', parsed.error.format());
            const data = await academic_service_1.academicService.createDepartment(parsed.data);
            return res.status(201).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteDepartment(req, res, next) {
        try {
            const data = await academic_service_1.academicService.deleteDepartment(req.params.id);
            return res.status(200).json({ success: true, data, message: 'Department deactivated successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // Programs
    async getPrograms(req, res, next) {
        try {
            const deptId = req.query.departmentId;
            const data = await academic_service_1.academicService.getPrograms(deptId);
            return res.status(200).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async createProgram(req, res, next) {
        try {
            const parsed = academic_validator_1.programSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.ValidationError('Invalid payload', parsed.error.format());
            const data = await academic_service_1.academicService.createProgram(parsed.data);
            return res.status(201).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    // Semesters
    async getSemesters(req, res, next) {
        try {
            const data = await academic_service_1.academicService.getSemesters(req.params.programId);
            return res.status(200).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    // Subjects
    async getSubjects(req, res, next) {
        try {
            const filter = {
                departmentId: req.query.departmentId,
                semesterId: req.query.semesterId
            };
            const data = await academic_service_1.academicService.getSubjects(filter);
            return res.status(200).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async createSubject(req, res, next) {
        try {
            const parsed = academic_validator_1.subjectSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.ValidationError('Invalid payload', parsed.error.format());
            const data = await academic_service_1.academicService.createSubject(parsed.data);
            return res.status(201).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    // Categories
    async getCategories(req, res, next) {
        try {
            const data = await academic_service_1.academicService.getCategories();
            return res.status(200).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    async createCategory(req, res, next) {
        try {
            const parsed = academic_validator_1.categorySchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.ValidationError('Invalid payload', parsed.error.format());
            const data = await academic_service_1.academicService.createCategory(parsed.data);
            return res.status(201).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AcademicController = AcademicController;
exports.academicController = new AcademicController();
//# sourceMappingURL=academic.controller.js.map