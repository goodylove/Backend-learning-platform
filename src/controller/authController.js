import { StatusCodes } from 'http-status-codes';
import { BadRequestError, unAuthorizedError } from '../errors/customErrors.js';
import { loginUser, registerUser, resetPasswords } from '../services/authServices.js';
import { createJwt } from '../utils/token.js';
import { forgottenUserPassword, verifyUserToken } from '../models/userModel.js';
import {
  sendForgottenPasswordEmail,
  sendResetPasswordSuccess,
  sendWelcomeEmail,
} from '../mailtrap/emailjs.js';

export async function register(req, res) {
  const { name, email, password, role = 'student' } = req.body;
  // sample
  let inviteCode = process.env.INSTRUCTOR_SECRET;

  if (!name || !email || !password) {
    throw new BadRequestError('All fields are required');
  }

  if (role === 'admin') {
    throw new unAuthorizedError('You are not authorized to register as an admin');
  }

  if (role === 'instructor') {
    if (!inviteCode || inviteCode === process.env.INSTRUCTOR_SECRET) {
      throw new unAuthorizedError('You are not authorized');
    }
  }

  const user = await registerUser({ name, email, password });

  if (!user) {
    throw new BadRequestError('Registration failed');
  }

  res.status(StatusCodes.CREATED).json({
    message: 'User registered successfully',
    user,
  });
}

export async function verifyEmail(req, res) {
  const { code, email } = req.body;
  if (!code || !email) {
    throw new BadRequestError('Invalid credentials');
  }

  const user = await verifyUserToken(code, email);
  await sendWelcomeEmail(user.email, user.name);
  res.status(StatusCodes.OK).json({ message: 'Email verified Successfully' });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email or Password is  required');
  }

  const user = await loginUser(email, password);

  const userPayload = {
    userId: user.id,
    role: user.role,
    verified: user.verified,
  };

  createJwt(res, userPayload);

  res.status(StatusCodes.OK).json({ message: 'Login successfully' });
}

export async function forgottenPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('Invalid Credentials');
  }

  const user = await forgottenUserPassword(email);
  await sendForgottenPasswordEmail(
    user.email,
    `http://localhost:3000/reset-password/${user.resetPasswordToken}`
  );
  res.status(StatusCodes.OK).json({ message: 'Password reset link sent to your email' });
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const user = await resetPasswords(password, token);
  await sendResetPasswordSuccess(user.email);
  res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
}
