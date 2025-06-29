import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Learning API',
      version: '1.0.0',
      description: 'API docs for the learning platform backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },
  apis: [path.join(__dirname, '../src/routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
