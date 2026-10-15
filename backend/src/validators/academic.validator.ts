import { z } from 'zod';

export const departmentSchema = z.object({
  code: z.string().min(2, 'Department code must be at least 2 characters'),
  name: z.string().min(2, 'Department name is required'),
  description: z.string().optional()
});

export const programSchema = z.object({
  code: z.string().min(2, 'Program code must be at least 2 characters'),
  name: z.string().min(2, 'Program name is required'),
  durationYears: z.number().min(1).max(6).default(4),
  totalSemesters: z.number().min(1).max(12).default(8),
  departmentId: z.string().uuid('Valid department ID required')
});

export const semesterSchema = z.object({
  number: z.number().min(1).max(12),
  name: z.string().min(1),
  programId: z.string().uuid('Valid program ID required')
});

export const subjectSchema = z.object({
  code: z.string().min(2, 'Subject code is required'),
  name: z.string().min(2, 'Subject name is required'),
  description: z.string().optional(),
  semesterId: z.string().uuid('Valid semester ID required'),
  departmentId: z.string().uuid('Valid department ID required')
});

export const categorySchema = z.object({
  code: z.string().min(2, 'Category code is required'),
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional()
});
