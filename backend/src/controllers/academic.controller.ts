import { Request, Response, NextFunction } from 'express';
import { academicService } from '../services/academic.service';
import { departmentSchema, programSchema, subjectSchema, categorySchema } from '../validators/academic.validator';
import { ValidationError } from '../utils/errors';

export class AcademicController {
  // Departments
  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await academicService.getDepartments();
      return res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  }

  async createDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = departmentSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError('Invalid payload', parsed.error.format());
      const data = await academicService.createDepartment(parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  }

  async deleteDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await academicService.deleteDepartment(req.params.id);
      return res.status(200).json({ success: true, data, message: 'Department deactivated successfully' });
    } catch (err) { next(err); }
  }

  // Programs
  async getPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const deptId = req.query.departmentId as string;
      const data = await academicService.getPrograms(deptId);
      return res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  }

  async createProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = programSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError('Invalid payload', parsed.error.format());
      const data = await academicService.createProgram(parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  }

  // Semesters
  async getSemesters(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await academicService.getSemesters(req.params.programId);
      return res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  }

  // Subjects
  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = {
        departmentId: req.query.departmentId as string,
        semesterId: req.query.semesterId as string
      };
      const data = await academicService.getSubjects(filter);
      return res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  }

  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = subjectSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError('Invalid payload', parsed.error.format());
      const data = await academicService.createSubject(parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  }

  // Categories
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await academicService.getCategories();
      return res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = categorySchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError('Invalid payload', parsed.error.format());
      const data = await academicService.createCategory(parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  }
}

export const academicController = new AcademicController();
