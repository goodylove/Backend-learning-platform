import { StatusCodes } from 'http-status-codes';

export function ErrorHandler(err, req, res, next) {
  let customErr = {
    message: err.message || 'Internal server error',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  console.log(err.code);
  if ((err.code = 'P2002')) {
    customErr.message = 'Email already exist';
    customErr.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(customErr.statusCode).json({ message: customErr.message });
}
