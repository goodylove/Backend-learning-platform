// import { PrismaClient } from '@prisma/client';
// import { BadRequestError } from '../errors/customErrors.js';
// import crypto from 'crypto';

// const prisma = new PrismaClient();

// export const createUser = async ({ name, email, password, verificationToken  ,role}) => {
//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password,
//       role,
//       verificationToken,
//     },
//   });
//   return user;
// };

// export const findUserByEmail = async (email) => {
//  const user =  await prisma.user.findUnique({
//     where: { email },
//   });
//   return user
// };

// export const verifyUserToken = async (token, email) => {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     throw new BadRequestError('No User Found');
//   }

//   if (user.verificationToken !== token) {
//     throw new BadRequestError('Invalid verificationToken');
//   }

//   const verifiedUser = await prisma.user.update({
//     where: { email },
//     data: {
//       verified: true,
//       verificationToken: null,
//     },
//   });
//   return verifiedUser;
// };

// export const forgottenUserPassword = async (email) => {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     throw new BadRequestError('Invalid credentials');
//   }
//   const resetPasswordToken = crypto.randomBytes(20).toString('hex');

//   const updateUserPassword = await prisma.user.update({
//     where: { email },
//     data: {
//       resetPasswordToken,
//     },
//   });
//   return updateUserPassword;
// };

// export const resetUserPassword = async (password, token) => {
//   const user = await prisma.user.findFirst({
//     where: { resetPasswordToken: token },
//   });

//   if (!user) {
//     throw new BadRequestError('invalid token provided');
//   }

//   const updatePassword = await prisma.user.update({
//     where: { email: user.email },
//     data: {
//       password: password,
//       resetPasswordToken: null,
//     },
//   });
//   return updatePassword;
// };
