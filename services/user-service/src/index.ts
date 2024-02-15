import express from 'express';
import type { Response, Request, Express, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Pool } from 'pg'; 
import userRoutes from './routes/user';
import helmet from "helmet";
import logger from './logger';

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
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Verify database connection
pool.connect()
  .then(() => console.log('Connected to database successfully.'))
  .catch((err) => console.error('Database connection failed. Error: ', err));

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
