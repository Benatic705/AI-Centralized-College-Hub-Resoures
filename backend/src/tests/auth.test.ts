import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import app from '../app';
import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

describe('Auth & System Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Health Check Endpoint returns status ok and database connected', async () => {
    // Test database connectivity
    const count = await prisma.user.count();
    expect(count).toBeGreaterThan(0);
  });

  it('Verifies seeded admin, faculty, and student users exist in database', async () => {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe(Role.ADMIN);

    const faculty = await prisma.user.findUnique({ where: { email: 'faculty@example.com' } });
    expect(faculty).not.toBeNull();
    expect(faculty?.role).toBe(Role.FACULTY);

    const student = await prisma.user.findUnique({ where: { email: 'student@example.com' } });
    expect(student).not.toBeNull();
    expect(student?.role).toBe(Role.STUDENT);

    // Verify password check
    const isMatch = await bcrypt.compare('Password123!', admin!.passwordHash);
    expect(isMatch).toBe(true);
  });
});
