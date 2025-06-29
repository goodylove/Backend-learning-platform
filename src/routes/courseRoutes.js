import express from 'express';
import {
  createCourseController,
  deleteCourseController,
  enrollController,
  getAllCoursesController,
  getCourseByIdController,
  getEnrolledCoursesController,
  getInstructorCoursesController,
  updateCourseController,
} from '../controller/courseController.js';
import { authMiddleWare, authPermission } from '../middleware/authMiddleWare.js';
const courseRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Course
 *   description: APIs for managing courses
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     tags: [Course]
 *     summary: Create a new course by instructor only
 *     description: This endpoint allows instructors to create a new course.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *               description:
 *                 type: string
 *                 example: This course covers the basics of programming using Python
 *   responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden access, only instructors can create courses
 *       500:
 *         description: Internal server error
 */

courseRoutes.post('/', authMiddleWare, authPermission('instructor'), createCourseController);

/**
 * @swagger
 * /courses:
 *   get:
 *     tags: [Course]
 *     summary: Get all courses
 *     description: This endpoint allows users to retrieve a list of all available courses.
 *     responses:
 *       200:
 *         description: Successfully retrieved all courses
 *       404:
 *         description: No courses found
 *       500:
 *         description: Internal server error
 */

courseRoutes.get('/', authMiddleWare, getAllCoursesController);

/**
 * @swagger
 * /courses:
 *   delete:
 *     tags: [Course]
 *     summary: Delete a course by ID by instructor only
 *     description: This endpoint allows instructors to delete an existing course.
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden access, only instructors can delete courses
 *       404:
 *         description: Course not found with the provided ID
 */
courseRoutes.delete('/', authMiddleWare, authPermission('instructor'), deleteCourseController);



/** 
 * @swagger
 * /courses/student-enrolled-courses:
 *   get:
 *     tags: [Course]
 *     summary: Get enrolled courses for a student
 *     description: This endpoint allows students to retrieve a list of courses they are enrolled in.
 *     responses:
 *       200:
 *         description: Successfully retrieved enrolled courses
 *       404:
 *         description: No enrolled courses found for the student
 *       500:
 *         description: Internal server error
 */


courseRoutes.get('/student-enrolled-courses', authMiddleWare, authPermission('student'),getEnrolledCoursesController);
/**
 * @swagger
 * /courses/instructor-courses:
 *   get:
 *     tags: [Course]
 *     summary: Get courses created by the instructor
 *     description: This endpoint allows instructors to retrieve a list of courses they have created.
 *     responses:
 *       200:
 *         description: Successfully retrieved instructor's courses
 *       404:
 *         description: No courses found for the instructor
 *       500:
 *         description: Internal server error
 */

courseRoutes.get('/instructor-courses', authMiddleWare, authPermission('instructor'), getInstructorCoursesController);
 

/** 
 *  @swagger
 * /courses/{id}/enroll:
 *   post:
 *     tags: [Course]
 *     summary: Enroll in a course by student only
 *     description: This endpoint allows students to enroll in a specific course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled in the course
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden access, only students can enroll in courses
 */

courseRoutes.post('/:id/enroll', authMiddleWare, authPermission('student'), enrollController);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     tags: [Course]
 *     summary: Get course by ID
 *     description: This endpoint allows users to retrieve a specific course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the course
 *       404:
 *         description: Course not found with the provided ID
 *       500:
 *         description: Internal server error
 */
courseRoutes.get('/:id', authMiddleWare, getCourseByIdController);
/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     tags: [Course]
 *     summary: Update course  with ID by instructor only
 *     description: This endpoint allows instructor  to update a specific course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update 
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - description
 *           properties:
 *             title:
 *               type: string
 *               example: Advanced JavaScript Concepts
 *             description:
 *               type: string
 *               example: This course delves into advanced topics in JavaScript, including closures,
 *               
 * 
 *     responses:
 *       200:
 *         description: Successfully retrieved the course
 *       404:
 *         description: Course not found with the provided ID
 *       500:
 *         description: Internal server error
 */

courseRoutes.patch('/:id', authMiddleWare, authPermission('instructor'), updateCourseController);









export default courseRoutes;
