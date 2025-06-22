import express from 'express';
import { createCourseController, getAllCoursesController } from '../controller/courseController.js';
import { authMiddleWare, authPermission } from '../middleware/authMiddleWare.js';
const courseRoutes = express.Router();

courseRoutes
  .route('/')
  .post(authMiddleWare, authPermission('instructor'), createCourseController)
  .get(authMiddleWare, getAllCoursesController);

courseRoutes.route('/:id').get(authMiddleWare, authPermission('instructor', 'student'));

export default courseRoutes;
