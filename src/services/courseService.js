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


// enroll student in course

export async function enrollStudentInCourse({ userId, courseId }) {
  // Check if course exists

  const course = await prisma.course.findUnique({
    where: {
     id:courseId,
    },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if user is already enrolled in the course

  const alreadyEnrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (alreadyEnrolled) {
    throw new Error('User is already enrolled in this course');
  }

  // Create enrollment record
  return await prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });
}


export async function getEnrolledCourses(userId) {
  return await prisma.enrollment.findMany({
    where: {
      userId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });
}

// export async function getInstructorCourses(instructorId) {
//   return await prisma.course.findMany({
//     where: {
//       instructorId,
//     },
//     include: {
//       instructor: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
          
//           createdAt: true,
//         },
//       },
//     },
//   });
// }


export async function getInstructorCourses(instructorId) {
  return await prisma.course.findMany({
    where: { instructorId },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
}
