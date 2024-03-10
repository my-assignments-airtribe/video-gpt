import express from 'express';
import type { Response, Request, Express, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Client } from 'pg'; 
import userRoutes from './routes/user';
import helmet from "helmet";
import logger from './logger';
import { errorHandler } from './utils/error-handler';

// Load environment variables from .env file
dotenv.config();

// Create a new express application instance
const app: Express = express();
const PORT = process.env.PORT || 3000;



// Middleware to parse the body of incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// PostgreSQL pool connection setup

const pool = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

pool.connect()
  .then(() => {
    // create the users table if it doesn't exist
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`
    )
      .then(() => {
        logger.info('Database connection successful.');
      })
      .catch((err) => {
        console.error('Error creating users table: ', err, JSON.stringify(err, null, 2), err.stack);
      });
  })
  .catch((err) => {
    console.error('Database connection failed. Error: ', err, JSON.stringify(err, null, 2), err.stack);
  });

// Routes
app.use('/api/user', userRoutes);

// Basic route for testing the server
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the User Service API!' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    logger.info(`Response: ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

app.use(errorHandler);

// Start the Express server
let server = app.listen(PORT, () => {
  logger.info(`User Service running at http://localhost:${PORT}`);
});

const gracefulShutdown = () => {
  logger.info('Starting graceful shutdown...');
  server.close(() => {
    logger.info('HTTP server closed.');
    
    pool.end(() => {
      logger.info('Database connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export { pool };
