import 'express-async-errors';

import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';


import authRouter from './routes/authRoute.js';

import { ErrorHandler } from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import swaggerSpec from '../docs/swaggerSpec.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 5001;

export const app = express();



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    error: 'Too many login attempts. Try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', courseRoutes);

app.use(notFound);
app.use(ErrorHandler);

const start = () => {
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

start();
