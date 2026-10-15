"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academic_controller_1 = require("../controllers/academic.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Departments
router.get('/departments', (req, res, next) => academic_controller_1.academicController.getDepartments(req, res, next));
router.post('/departments', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(client_1.Role.ADMIN), (req, res, next) => academic_controller_1.academicController.createDepartment(req, res, next));
router.delete('/departments/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(client_1.Role.ADMIN), (req, res, next) => academic_controller_1.academicController.deleteDepartment(req, res, next));
// Programs
router.get('/programs', (req, res, next) => academic_controller_1.academicController.getPrograms(req, res, next));
router.post('/programs', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(client_1.Role.ADMIN), (req, res, next) => academic_controller_1.academicController.createProgram(req, res, next));
// Semesters
router.get('/programs/:programId/semesters', (req, res, next) => academic_controller_1.academicController.getSemesters(req, res, next));
// Subjects
router.get('/subjects', (req, res, next) => academic_controller_1.academicController.getSubjects(req, res, next));
router.post('/subjects', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(client_1.Role.ADMIN, client_1.Role.FACULTY), (req, res, next) => academic_controller_1.academicController.createSubject(req, res, next));
// Categories
router.get('/categories', (req, res, next) => academic_controller_1.academicController.getCategories(req, res, next));
router.post('/categories', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(client_1.Role.ADMIN), (req, res, next) => academic_controller_1.academicController.createCategory(req, res, next));
exports.default = router;
//# sourceMappingURL=academic.routes.js.map