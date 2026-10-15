import { Router } from 'express';
import { academicController } from '../controllers/academic.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Departments
router.get('/departments', (req, res, next) => academicController.getDepartments(req, res, next));
router.post('/departments', requireAuth, requireRole(Role.ADMIN), (req, res, next) => academicController.createDepartment(req, res, next));
router.delete('/departments/:id', requireAuth, requireRole(Role.ADMIN), (req, res, next) => academicController.deleteDepartment(req, res, next));

// Programs
router.get('/programs', (req, res, next) => academicController.getPrograms(req, res, next));
router.post('/programs', requireAuth, requireRole(Role.ADMIN), (req, res, next) => academicController.createProgram(req, res, next));

// Semesters
router.get('/programs/:programId/semesters', (req, res, next) => academicController.getSemesters(req, res, next));

// Subjects
router.get('/subjects', (req, res, next) => academicController.getSubjects(req, res, next));
router.post('/subjects', requireAuth, requireRole(Role.ADMIN, Role.FACULTY), (req, res, next) => academicController.createSubject(req, res, next));

// Categories
router.get('/categories', (req, res, next) => academicController.getCategories(req, res, next));
router.post('/categories', requireAuth, requireRole(Role.ADMIN), (req, res, next) => academicController.createCategory(req, res, next));

export default router;
