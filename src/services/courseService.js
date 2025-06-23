import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCourse({ title, description, instructorId }) {

const  exitingCourse = await prisma.course.findUnique({
    where: {
      title: title,
    },
  });


  if(exitingCourse) {
    throw new Error('Course with this title already exists');
  }


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
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verified: true,
          createdAt: true,
         
        },
      }
    },
  });
}

export async function getCourseById(courseId) {

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verified: true,
          createdAt: true,
        },
      },
    },
  })
return course;

}

export  async function updateCorse(courseId, updateData) {
  const updateCourse = await prisma.course.update({
    where: {
      id: courseId,
    },
    data: updateData,

  })
return updateCourse;
}

export  async function deleteCorse(courseId) {
  await prisma.course.delete({
    where: {
      id: courseId,
    },
    })

}