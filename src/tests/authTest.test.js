import { register } from '../controller/authController.js';
import { BadRequestError } from '../errors/customErrors.js';
import { registerUser } from '../services/authServices.js';

{
  /*mock request body */
}

const request = {
  body: {
    email: 'fake_email',
    name: 'fake_name',
    password: 'fake_password',
  },
};

{
  /*mock response body */
}
const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const fakeUser = {
  id: '123',
  name: 'fake_name',
  email: 'fake_email',

  role: 'student',
};

jest.mock('../services/authServices.js', () => ({
  registerUser: jest.fn(),
}));

describe('register controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clean up before each test
  });

  test('All fields are required', async () => {
    const request = { body: {} };

    try {
      await register(request, response);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('All fields are required');
    }
    expect(registerUser).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });

  test('should return 201 if user is created', async () => {
    registerUser.mockResolvedValue(fakeUser);
    await register(request, response);

    expect(registerUser).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: fakeUser,
    });
  });

  test('should return 401 if user already exist', async () => {
    registerUser.mockImplementation(() => {
      throw new BadRequestError('User Already Exist');
    });

    try {
      await register(request, response);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
      expect(err.message).toBe('User Already Exist');
    }

    expect(registerUser).toHaveBeenCalledWith(request.body);
    expect(response.status).not.toHaveBeenCalled();
  });
});
