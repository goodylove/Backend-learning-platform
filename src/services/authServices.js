import { BadRequestError, unAuthorizedError } from '../errors/customErrors.js';
import { createUser, findUserByEmail, resetUserPassword } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { sendVerificationEmail } from '../mailtrap/emailjs.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new BadRequestError('User already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = generateToken();

  const newUser = await createUser({
    name,
    email,
    password: hashPassword,
    verificationToken,
  });

  await sendVerificationEmail(newUser.email, newUser.verificationToken);

  const safeUser = {
    name: newUser.name,
    email: newUser.email,
    verificationToken: newUser.verificationToken,
  };

  return safeUser;
};

export const resetPasswords = async ( password, token ) => {
  console.log(password)

  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword)

  const user = await resetUserPassword(hashPassword, token);
  return user;
};

export const loginUser = async ( email, password ) => {
  const user = await findUserByEmail(email);
  

  if (!user) {
    throw new unAuthorizedError('invalid credentials');
  }
  
  if(!user.verified){
    throw new unAuthorizedError("Please verify your email")
  }


  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new unAuthorizedError('invalid credentials');
  }

  return user;
};
