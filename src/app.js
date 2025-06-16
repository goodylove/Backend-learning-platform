import 'express-async-errors';

import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import authRouter from './routes/authRoute.js';

import { ErrorHandler } from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

dotenv.config();
const PORT = process.env.PORT || 5001;

export const app = express();

const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});

app.use('/api/v1/auth', authRouter);

app.use(notFound);
app.use(ErrorHandler);

const start = () => {
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

start();
