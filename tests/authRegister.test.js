import { describe, expect, jest, test } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, unAuthorizedError } from '../src/errors/customErrors.js';

// ✅ Must come before imports
jest.unstable_mockModule('../src/services/authServices.js', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  resetPasswords: jest.fn(),
}));

jest.unstable_mockModule('../src/utils/token.js', () => ({
  createJwt: jest.fn(),
}));

jest.unstable_mockModule('../src/models/userModel.js', () => ({
  forgottenUserPassword: jest.fn(),
  verifyUserToken: jest.fn(),
}));

jest.unstable_mockModule('../src/mailtrap/emailjs.js', () => ({
  sendForgottenPasswordEmail: jest.fn(),
  sendResetPasswordSuccess: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

// ✅ ESM Dynamic Imports

const { registerUser, loginUser ,resetPasswords} = await import('../src/services/authServices.js');
const { register, login, verifyEmail, forgottenPassword ,resetPassword} = await import(
  '../src/controller/authController.js'
);
const { createJwt } = await import('../src/utils/token.js');
const { verifyUserToken, forgottenUserPassword } = await import('../src/models/userModel.js');
const { sendWelcomeEmail, sendForgottenPasswordEmail ,sendResetPasswordSuccess} = await import('../src/mailtrap/emailjs.js');

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const fakeUser = {
  name: 'fake_name',
  password: 'fake_password',
  email: 'fake_email',
  id: 'user_id',
};
describe('Register controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('missing field throws BadRequestError', async () => {
    const request = { body: {} };

    await expect(register(request, response)).rejects.toThrow('All fields are required');
    expect(registerUser).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });

  test('Should return status code of 201 if user is registered successfully', async () => {
    const request = {
      body: {
        name: 'fake_name',
        password: 'fake_password',
        email: 'fake_email',
      },
    };
    registerUser.mockResolvedValue(fakeUser);

    await register(request, response);

    expect(registerUser).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(StatusCodes.CREATED);

    expect(response.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: fakeUser,
    });
  });

  test('Should throw Error if user already exist', async () => {
    const request = {
      body: {
        name: 'fake_name',
        password: 'fake_password',
        email: 'fake_email',
      },
    };

    registerUser.mockRejectedValue(new BadRequestError('User already exist'));

    await expect(register(request, response)).rejects.toThrow('User already exist');
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});

describe('Login Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('logs in user when valid credentials are provided', async () => {
    const request = {
      body: {
        password: 'fake_password',
        email: 'fake_email',
      },
    };
    const { email, password } = fakeUser;

    loginUser.mockResolvedValue(email, password);

    createJwt.mockImplementation((res, id) => {
      return { res, id };
    });

    await login(request, response);

    expect(loginUser).toHaveBeenCalledWith(email, password);
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);

    expect(response.json).toHaveBeenCalledWith({
      message: 'Login successfully',
    });
  });

  test('Should throw inValid credentials, when login  fails  ', async () => {
    const request = {
      body: {
        password: 'fake_password',
        email: 'fake_email',
      },
    };

    loginUser.mockRejectedValue(new unAuthorizedError('Invalid credentials'));

    //  createJwt.mockImplementation((res,id)=>{
    //   return {res,id}
    //  })

    await expect(login(request, response)).rejects.toThrow('Invalid credentials');

    expect(loginUser).toHaveBeenCalledWith(fakeUser.email, fakeUser.password);
    expect(createJwt).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();

    expect(response.json).not.toHaveBeenCalled();
  });
});

describe('Verify Email Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Missing Value BadRequestErr', async () => {
    const req = { body: {} };

    verifyUserToken.mockRejectedValue(new BadRequestError('Invalid credentials'));

    sendWelcomeEmail.mockImplementation(async (email, name) => {
      return { email, name };
    });

    await expect(verifyEmail(req, response)).rejects.toThrow('Invalid credentials');
    expect(verifyUserToken).not.toHaveBeenCalled();
    expect(sendWelcomeEmail).not.toHaveBeenCalled();
  });

  test('Should verify user email successfully', async () => {
    const req = { body: { code: 'fake_code', email: 'fake_email' } };

    verifyUserToken.mockResolvedValue(req.body);

    sendWelcomeEmail.mockImplementation(async (email, name) => {
      return { email, name };
    });

    await verifyEmail(req, response);
    expect(verifyUserToken).toHaveBeenCalledWith('fake_code', 'fake_email');

    expect(sendWelcomeEmail).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Email verified Successfully',
    });
  });
});

describe('forgotten controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should send password token', async () => {
    const req = { body: { email: 'fake_email' } };

    forgottenUserPassword.mockResolvedValue(req.body.email);
    sendForgottenPasswordEmail.mockImplementation(async (email, token) => {
      return { email, token };
    });

    await forgottenPassword(req, response);
    expect(forgottenUserPassword).toHaveBeenCalledWith(req.body.email);
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Password reset link sent to your email',
    });
  });
});

describe('resetPassword  controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should update user password successfully', async () => {
    const req = { 
      body: { password: 'fake_password' }, 
      params:{token:"fake_token"} };

    resetPasswords.mockResolvedValue(req.body.password,req.params.token);

    sendResetPasswordSuccess.mockImplementation(async (email) => {
      return { email};
    });

    await resetPassword(req, response);
    expect(resetPasswords).toHaveBeenCalledWith(req.body.password,req.params.token);
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Password updated successfully',
    });
  });
});
// 