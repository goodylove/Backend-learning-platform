import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCourseModel({ title, description, instructorId }) {
  return await prisma.course.create({
    data: {
      title,
      description,
      instructorId,
    },
  });
}

export async function getAllCourses() {
  return await prisma.course.findMany({
    include: {
      instructor: true,
    },
  });
}
