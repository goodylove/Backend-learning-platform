import { StatusCodes } from 'http-status-codes';
import { unAuthenticatedError } from '../errors/customErrors.js';
import {
  createCourse,
  deleteCorse,
  getAllCourses,
  getCourseById,
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
