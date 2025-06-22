import { BadRequestError, unAuthorizedError } from '../errors/customErrors.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { sendVerificationEmail } from '../mailtrap/emailjs.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async ({ name, email, password ,role}) => {

  const existingUser =  await prisma.user.findUnique({
    where: { email },
  });
 



  if (existingUser) {
    throw new BadRequestError('User already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = generateToken();

   const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
      verificationToken: verificationToken,
    },
  });

  

  // await sendVerificationEmail(newUser.email, newUser.verificationToken);

  const safeUser = {
    name: user.name,
    email: user.email,
    role: user.role,
    verificationToken: user.verificationToken,
  };

  return safeUser;
};

export const forgottenUserPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }
  const resetPasswordToken = crypto.randomBytes(20).toString('hex');

  const updateUserPassword = await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken,
    },
  });
  return updateUserPassword;
};


export const verifyUserToken = async (token, email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BadRequestError('No User Found');
  }

  if (user.verificationToken !== token) {
    throw new BadRequestError('Invalid verificationToken');
  }

  const verifiedUser = await prisma.user.update({
    where: { email },
    data: {
      verified: true,
      verificationToken: null,
    },
  });
  return verifiedUser;
};


export const resetUserPasswords = async (password, token) => {
  const user = await prisma.user.findFirst({
    where: { resetPasswordToken: token },
  });

  if (!user) {
    throw new BadRequestError('invalid token provided');
  }


  const hashPassword = await bcrypt.hash(password, 10);
  const updatePassword = await prisma.user.update({
    where: { email: user.email },
    data: {
      password: hashPassword,
      resetPasswordToken: null,
    },
  });
  return updatePassword;
};




// export const resetPasswords = async ( password, token ) => {
//   console.log(password)

//   const hashPassword = await bcrypt.hash(password, 10);
//   console.log(hashPassword)

//   const user = await resetUserPassword(hashPassword, token);
//   return user;
// };

export const loginUser = async ( email, password ) => {
 const user =  await prisma.user.findUnique({
    where: { email },
  });
 
  

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
