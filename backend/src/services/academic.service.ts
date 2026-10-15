import { prisma } from '../config/db';
import { NotFoundError, ConflictError } from '../utils/errors';

export class AcademicService {
  // --- Departments ---
  async getDepartments() {
    return prisma.department.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: { programs: true, subjects: true, resources: true, users: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createDepartment(data: { code: string; name: string; description?: string }) {
    const existing = await prisma.department.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) throw new ConflictError('Department code already exists');

    return prisma.department.create({
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description
      }
    });
  }

  async updateDepartment(id: string, data: { name?: string; description?: string }) {
    return prisma.department.update({
      where: { id },
      data
    });
  }

  async deleteDepartment(id: string) {
    const resourceCount = await prisma.resource.count({ where: { departmentId: id, isDeleted: false } });
    if (resourceCount > 0) {
      throw new ConflictError(`Cannot delete department with ${resourceCount} active linked resources. Use soft delete or archive resources first.`);
    }
    return prisma.department.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  // --- Programs ---
  async getPrograms(departmentId?: string) {
    return prisma.program.findMany({
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

  async createProgram(data: { code: string; name: string; durationYears?: number; totalSemesters?: number; departmentId: string }) {
    const existing = await prisma.program.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) throw new ConflictError('Program code already exists');

    const program = await prisma.program.create({
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
    await prisma.semester.createMany({ data: semesterData });

    return prisma.program.findUnique({
      where: { id: program.id },
      include: { semesters: true, department: true }
    });
  }

  // --- Semesters ---
  async getSemesters(programId: string) {
    return prisma.semester.findMany({
      where: { programId, isDeleted: false },
      include: {
        subjects: { where: { isDeleted: false } },
        _count: { select: { resources: true } }
      },
      orderBy: { number: 'asc' }
    });
  }

  // --- Subjects ---
  async getSubjects(filter?: { departmentId?: string; semesterId?: string }) {
    return prisma.subject.findMany({
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

  async createSubject(data: { code: string; name: string; description?: string; semesterId: string; departmentId: string }) {
    const existing = await prisma.subject.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) throw new ConflictError('Subject code already exists');

    return prisma.subject.create({
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
    return prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { resources: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(data: { code: string; name: string; description?: string }) {
    const existing = await prisma.category.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) throw new ConflictError('Category code already exists');

    return prisma.category.create({
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description
      }
    });
  }
}

export const academicService = new AcademicService();
