import { StatusCodes } from 'http-status-codes';
import { BadRequestError, unAuthorizedError } from '../errors/customErrors.js';
import { forgottenUserPassword, loginUser, registerUser, resetUserPasswords, verifyUserToken } from '../services/authServices.js';
import { createJwt } from '../utils/token.js';
import {
  sendForgottenPasswordEmail,
  sendResetPasswordSuccess,
  sendWelcomeEmail,
} from '../mailtrap/emailjs.js';


export async function register(req, res) {
  let inviteCode = process.env.INSTRUCTOR_SECRET;
  const { name, email, password, role = 'student', instructorCode=""} = req.body;
  // sample
  // instructorCode=inviteCode 

  if (!name || !email || !password) {
    throw new BadRequestError('All fields are required');
  }

  // if (role === 'admin') {
  //   throw new unAuthorizedError('You are not authorized to register as an admin');
  // }

  if (role === 'instructor') {
    if (!inviteCode || inviteCode === process.env.INSTRUCTOR_SECRET) {
      throw new unAuthorizedError('You are not authorized');
    }
  }
  if(instructorCode){
    if (instructorCode !== process.env.INSTRUCTOR_SECRET) {
      throw new unAuthorizedError('You are not authorized to register as an instructor');
    }

    const instructor = await registerUser({ name, email, password, role: 'instructor' });

    if (!instructor) {
      throw new BadRequestError('Registration failed');
    }
    res.status(StatusCodes.CREATED).json({
      message: 'Instructor registered successfully',
      user: instructor,
    });
    return;

  }
  
  const user = await registerUser({ name, email, password ,role});



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
    id: user.id,
    name: user.name,
    email: user.email,
    userId: user.id,
    role: user.role,
    verified: user.verified,
  };

  // user: userPayload 
  createJwt(res, userPayload);

  res.status(StatusCodes.OK).json({ message: 'Login successfully'});
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

  const user = await resetUserPasswords(password, token);
  await sendResetPasswordSuccess(user.email);
  res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
}
