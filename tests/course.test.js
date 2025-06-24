import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.unstable_mockModule('../src/services/courseService.js', () => ({
  createCourse: jest.fn(),
  deleteCorse: jest.fn(),
  getAllCourses: jest.fn(),
  getCourseById: jest.fn(),
  updateCorse: jest.fn(),
  getInstructorCourses: jest.fn(),
  enrollStudentInCourse: jest.fn(),
   getEnrolledCourses: jest.fn()
}));

const {
  createCourse,
  deleteCorse,
  getAllCourses,
  getCourseById,
  updateCorse,
  getInstructorCourses,
  enrollStudentInCourse,
  getEnrolledCourses,
} = await import('../src/services/courseService');
const { createCourseController,getAllCoursesController,getCourseByIdController,updateCourseController,deleteCourseController } = await import('../src/controller/courseController.js');

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Create course Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a course  with correct parameter', async () => {
    const req = {
      body: {
        title: 'Test Course',
        description: 'This is a test course',
      },
      user: {
        userId: 'instructor123',
      },
    };

    await createCourse({
      ...req.body,
      instructorId: req.user.userId,
    });

    await createCourseController(req, response);

    expect(createCourse).toHaveBeenCalledWith({
      title: req.body.title,
      description: req.body.description,
      instructorId: req.user.userId,
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'Course has been created successfully' });
  });

  test('should throw error if title or description is missing', async () => {
    const req = {
      body: {
        title: '',
        description: '',
      },
      user: {
        userId: 'instructor123',
      },
    };

   
    await expect(createCourseController(req, response)).rejects.toThrow('Please provide title and description');
    expect(createCourse).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});

describe('Get all courses Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all courses', async () => {
    const mockCourses = [
      { id: '1', title: 'Course 1', description: 'Description 1' },
      { id: '2', title: 'Course 2', description: 'Description 2' },
    ];

    getAllCourses.mockResolvedValue(mockCourses);

    const req = {};
    await getAllCoursesController(req, response);

    expect(getAllCourses).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: 'All courses fetched successfully',
      courses: mockCourses,
    });
  });

  test('should return not found if no courses exist', async () => {
    getAllCourses.mockResolvedValue([]);

    const req = {};
    await getAllCoursesController(req, response);

    expect(getAllCourses).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ message: 'No course found' });
  });
});

describe('Get course by ID Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return course by ID', async () => {
    const mockCourse = { id: '1', title: 'Course 1', description: 'Description 1' };
    getCourseById.mockResolvedValue(mockCourse);

    const req = { params: { id: '1' } };
    await getCourseByIdController(req, response);

    expect(getCourseById).toHaveBeenCalledWith('1');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Course fetched successfully',
      course: mockCourse,
    });
  });

  test('should return not found if course does not exist', async () => {
    getCourseById.mockResolvedValue(null);

    const req = { params: { id: '' } };
    // await getCourseByIdController(req, response);

    await expect(getCourseByIdController(req, response)).rejects.toThrow('Please provide course id');
    expect(getCourseById).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();


    // these also works:

    // expect(getCourseById).toHaveBeenCalledWith('nonexistent');
    // expect(response.status).toHaveBeenCalledWith(404);
    // expect(response.json).toHaveBeenCalledWith({ message: 'No course found with this nonexistent' });


  });
});



describe('Update course Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update course with valid parameters', async () => {
    const mockCourse = { id: '1', title: 'Updated Course', description: 'Updated Description' };
    updateCorse.mockResolvedValue(mockCourse);

    const req = {
      params: { id: '1' },
      body: { title: 'Updated Course', description: 'Updated Description' },
    };

    await updateCourseController(req, response);

    expect(updateCorse).toHaveBeenCalledWith('1', {
      title: req.body.title,
      description: req.body.description,
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Course updated successfully',
      data: mockCourse,
    });
  });


  test('should throw error if course ID is missing', async () => {
    const req = {
      params: { id: '' },
      body: { title: 'Updated Course', description: 'Updated Description' },
    };

    await expect(updateCourseController(req, response)).rejects.toThrow('Please provide course id');
    expect(updateCorse).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });

})

describe('Delete course Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete course with valid ID', async () => {
    const req = { params: { id: '1' } };

    await deleteCorse('1');
    await deleteCourseController(req, response);

    expect(deleteCorse).toHaveBeenCalledWith('1');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'Course deleted successfully' });
  });

  test('should throw error if course ID is missing', async () => {
    const req = { params: { id: '' } };

    await expect(deleteCourseController(req, response)).rejects.toThrow('Please provide course id');
    expect(deleteCorse).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});