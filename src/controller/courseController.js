import { StatusCodes } from 'http-status-codes';
import { unAuthenticatedError } from '../errors/customErrors.js';
import {
  createCourse,
  deleteCorse,
  enrollStudentInCourse,
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getInstructorCourses,
  updateCorse,
} from '../services/courseService.js';

export const createCourseController = async (req, res) => {
  const { title, description } = req.body;

    if (!title || !description) {
    throw new unAuthenticatedError('Please provide title and description');
    }

  const instructorId = req.user.userId;

  await createCourse({ title, description, instructorId });

  res.status(StatusCodes.OK).json({ message: 'Course has been created successfully' });
};

export const getAllCoursesController = async (req, res) => {
  const course = await getAllCourses();

  if (!course || course.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No course found' });
  }

  res.status(StatusCodes.OK).json({ message: 'All courses fetched successfully', courses: course });
};

export const getCourseByIdController = async (req, res) => {
  const { id } = req.params;
  

  if (!id) {
    throw new unAuthenticatedError('Please provide course id');
  }

  const course = await getCourseById(id);

  if (!course) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: `No course found with this ${id}` });
  }

  res.status(StatusCodes.OK).json({ message: 'Course fetched successfully', course });
};

export const updateCourseController = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) {
    throw new unAuthenticatedError('Please provide course id');
  }

  if (!title || !description) {
    throw new unAuthenticatedError('Please provide title and description');
  }

  const data = await updateCorse(id, { title, description });
  // Logic to update the course goes here

  res.status(StatusCodes.OK).json({ message: 'Course updated successfully', data });
};

export const deleteCourseController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new unAuthenticatedError('Please provide course id');
  }
  await deleteCorse(id);

  res.status(StatusCodes.OK).json({ message: 'Course deleted successfully' });
};

// enroll student in course

export const enrollController =  async (req, res) => {
    const {id} = req.params;
    // console.log(req.params);
    const {userId,role} = req.user;

    if( role !== 'student') {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Only students can enroll in courses' });
    }

    await enrollStudentInCourse({ userId, courseId:id});
    return res.status(StatusCodes.CREATED).json({ message: 'Successfully enrolled in the course' });


}

export const getEnrolledCoursesController = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    throw new unAuthenticatedError('Please provide user id');
  }

  const courses = await getEnrolledCourses( userId );

  if (!courses || courses.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No enrolled courses found' });
  }

  res.status(StatusCodes.OK).json({ message: 'Enrolled courses fetched successfully', courses });
}

export const getInstructorCoursesController = async (req, res) => {
  const { userId } = req.user;
 

  if (!userId) {
    throw new unAuthenticatedError('Please provide user id');
  }
  const courses = await getInstructorCourses( userId );

  if (!courses || courses.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No courses found for this instructor' });
  }

  res.status(StatusCodes.OK).json({ message: 'Instructor courses fetched successfully', courses });
}