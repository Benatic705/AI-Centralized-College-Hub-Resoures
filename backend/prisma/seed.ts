import { PrismaClient, Role, UserStatus, ResourceStatus, ResourceVisibility } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed process...');

  // 1. Seed System Settings
  const settings = [
    { key: 'MAX_FILE_SIZE_MB', value: '50', description: 'Maximum allowed upload size in megabytes' },
    { key: 'ALLOWED_FILE_TYPES', value: 'pdf,doc,docx,ppt,pptx,txt', description: 'Comma separated allowed extension list' },
    { key: 'REQUIRE_RESOURCE_APPROVAL', value: 'true', description: 'Whether uploads require admin approval before becoming public' },
    { key: 'DUPLICATE_SIMILARITY_THRESHOLD', value: '0.88', description: 'Embedding cosine similarity threshold to trigger duplicate alert' },
    { key: 'SEMANTIC_SEARCH_WEIGHT', value: '0.60', description: 'Hybrid search weight for semantic vector similarity' },
    { key: 'KEYWORD_SEARCH_WEIGHT', value: '0.15', description: 'Hybrid search weight for full text keyword match' },
    { key: 'REGISTRATION_ENABLED', value: 'true', description: 'Allow new user registration' }
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s
    });
  }
  console.log('✅ System Settings seeded');

  // 2. Seed Resource Categories
  const categories = [
    { code: 'LECTURE_NOTE', name: 'Lecture Notes', description: 'Course notes, unit summaries, and lecture transcripts' },
    { code: 'ASSIGNMENT', name: 'Assignments', description: 'Coursework assignments, homework, and problem sets' },
    { code: 'QUESTION_PAPER', name: 'Question Papers', description: 'Previous year examination papers and mid-term tests' },
    { code: 'LAB_MANUAL', name: 'Laboratory Manuals', description: 'Lab experiment guides, instruction sets, and practical manuals' },
    { code: 'PROJECT_REPORT', name: 'Project Reports', description: 'Capstone project documentations, mini-projects, and case studies' },
    { code: 'REFERENCE_MATERIAL', name: 'Reference Material', description: 'E-books, journal papers, and supplementary reading' },
    { code: 'STUDY_MATERIAL', name: 'Study Material', description: 'Revision guides, quick formula sheets, and exam prep modules' },
    { code: 'SYLLABUS', name: 'Syllabus & Curriculum', description: 'Course objectives, topic lists, and grading scheme' },
    { code: 'PRESENTATION', name: 'Presentations & Slides', description: 'PowerPoint slides and visual lecture presentations' },
    { code: 'OTHER', name: 'Other Resources', description: 'Miscellaneous academic documents and aids' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: { name: cat.name, description: cat.description },
      create: cat
    });
  }
  console.log('✅ Categories seeded');

  // 3. Seed Departments
  const deptCS = await prisma.department.upsert({
    where: { code: 'CS' },
    update: {},
    create: { code: 'CS', name: 'Computer Science & Engineering', description: 'Department of CS & Engineering' }
  });

  const deptIT = await prisma.department.upsert({
    where: { code: 'IT' },
    update: {},
    create: { code: 'IT', name: 'Information Technology', description: 'Department of Information Technology' }
  });

  const deptEC = await prisma.department.upsert({
    where: { code: 'EC' },
    update: {},
    create: { code: 'EC', name: 'Electronics & Communication', description: 'Department of ECE' }
  });

  const deptME = await prisma.department.upsert({
    where: { code: 'ME' },
    update: {},
    create: { code: 'ME', name: 'Mechanical Engineering', description: 'Department of Mechanical Engineering' }
  });
  console.log('✅ Departments seeded');

  // 4. Seed Programs
  const progBTechCS = await prisma.program.upsert({
    where: { code: 'BTECH_CS' },
    update: {},
    create: {
      code: 'BTECH_CS',
      name: 'B.Tech Computer Science and Engineering',
      durationYears: 4,
      totalSemesters: 8,
      departmentId: deptCS.id
    }
  });

  const progBTechIT = await prisma.program.upsert({
    where: { code: 'BTECH_IT' },
    update: {},
    create: {
      code: 'BTECH_IT',
      name: 'B.Tech Information Technology',
      durationYears: 4,
      totalSemesters: 8,
      departmentId: deptIT.id
    }
  });
  console.log('✅ Programs seeded');

  // 5. Seed Semesters for BTech CS
  const semesters: Array<{ id: string; number: number; name: string }> = [];
  for (let i = 1; i <= 8; i++) {
    const sem = await prisma.semester.upsert({
      where: { programId_number: { programId: progBTechCS.id, number: i } },
      update: {},
      create: {
        number: i,
        name: `Semester ${i}`,
        programId: progBTechCS.id
      }
    });
    semesters.push(sem);
  }
  console.log('✅ Semesters seeded');

  const sem5 = semesters.find(s => s.number === 5)!;
  const sem3 = semesters.find(s => s.number === 3)!;

  // 6. Seed Subjects
  const subDBMS = await prisma.subject.upsert({
    where: { code: 'CS501' },
    update: {},
    create: {
      code: 'CS501',
      name: 'Database Management Systems',
      description: 'Relational model, SQL, Normalization, Transactions, and Indexing',
      semesterId: sem5.id,
      departmentId: deptCS.id
    }
  });

  const subOS = await prisma.subject.upsert({
    where: { code: 'CS502' },
    update: {},
    create: {
      code: 'CS502',
      name: 'Operating Systems',
      description: 'Processes, Threads, Memory Management, Deadlocks, and File Systems',
      semesterId: sem5.id,
      departmentId: deptCS.id
    }
  });

  const subDS = await prisma.subject.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      description: 'Arrays, Trees, Graphs, Sorting, and Search Algorithms',
      semesterId: sem3.id,
      departmentId: deptCS.id
    }
  });
  console.log('✅ Subjects seeded');

  // 7. Seed Test Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash },
    create: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      departmentId: deptCS.id
    }
  });

  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@example.com' },
    update: { passwordHash },
    create: {
      email: 'faculty@example.com',
      passwordHash,
      firstName: 'Dr. Alan',
      lastName: 'Turing',
      role: Role.FACULTY,
      status: UserStatus.ACTIVE,
      departmentId: deptCS.id
    }
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: { passwordHash },
    create: {
      email: 'student@example.com',
      passwordHash,
      firstName: 'Alice',
      lastName: 'Smith',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
      departmentId: deptCS.id,
      programId: progBTechCS.id,
      semesterId: sem5.id
    }
  });
  console.log('✅ Users seeded: admin@example.com, faculty@example.com, student@example.com (Password: Password123!)');

  // 8. Seed Initial Sample Resources
  const catLectureNotes = await prisma.category.findUnique({ where: { code: 'LECTURE_NOTE' } });
  const catQuestionPaper = await prisma.category.findUnique({ where: { code: 'QUESTION_PAPER' } });

  if (catLectureNotes && catQuestionPaper) {
    const resDBMS = await prisma.resource.upsert({
      where: { checksum: 'seed-checksum-dbms-unit2' },
      update: {},
      create: {
        title: 'DBMS Unit 2 - Relational Algebra & Normalization',
        description: 'Comprehensive lecture notes covering 1NF, 2NF, 3NF, BCNF, and relational algebra queries.',
        originalFileName: 'DBMS_Unit2_Notes.pdf',
        storedFileName: 'stored_dbms_unit2_1001.pdf',
        filePath: 'storage/uploads/stored_dbms_unit2_1001.pdf',
        fileSize: 2450000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        checksum: 'seed-checksum-dbms-unit2',
        status: ResourceStatus.APPROVED,
        visibility: ResourceVisibility.PUBLIC,
        categoryId: catLectureNotes.id,
        departmentId: deptCS.id,
        programId: progBTechCS.id,
        semesterId: sem5.id,
        subjectId: subDBMS.id,
        uploadedById: facultyUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date(),
        viewCount: 42,
        downloadCount: 18,
        averageRating: 4.8,
        isFeatured: true,
        aiCategory: 'LECTURE_NOTE',
        aiConfidence: 0.96,
        aiKeywords: ['normalization', 'sql', 'dbms', 'relational algebra', '3nf', 'bcnf']
      }
    });

    const resOS = await prisma.resource.upsert({
      where: { checksum: 'seed-checksum-os-midterm' },
      update: {},
      create: {
        title: 'Operating Systems Previous Year Question Paper 2024',
        description: 'End-term examination paper covering deadlock detection, semaphore synchronization, and paging.',
        originalFileName: 'OS_EndTerm_2024.pdf',
        storedFileName: 'stored_os_2024_paper.pdf',
        filePath: 'storage/uploads/stored_os_2024_paper.pdf',
        fileSize: 1120000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        checksum: 'seed-checksum-os-midterm',
        status: ResourceStatus.APPROVED,
        visibility: ResourceVisibility.PUBLIC,
        categoryId: catQuestionPaper.id,
        departmentId: deptCS.id,
        programId: progBTechCS.id,
        semesterId: sem5.id,
        subjectId: subOS.id,
        uploadedById: facultyUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date(),
        viewCount: 88,
        downloadCount: 45,
        averageRating: 4.5,
        isFeatured: true,
        aiCategory: 'QUESTION_PAPER',
        aiConfidence: 0.94,
        aiKeywords: ['operating systems', 'deadlock', 'semaphores', 'paging', 'question paper']
      }
    });

    // Bookmark & Rating seed
    await prisma.bookmark.upsert({
      where: { userId_resourceId: { userId: studentUser.id, resourceId: resDBMS.id } },
      update: {},
      create: { userId: studentUser.id, resourceId: resDBMS.id, folderName: 'DBMS Prep' }
    });

    await prisma.rating.upsert({
      where: { userId_resourceId: { userId: studentUser.id, resourceId: resDBMS.id } },
      update: { rating: 5, review: 'Super clear explanation of BCNF!' },
      create: { userId: studentUser.id, resourceId: resDBMS.id, rating: 5, review: 'Super clear explanation of BCNF!' }
    });
  }

  console.log('✅ Sample Resources, Bookmarks, and Ratings seeded');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
