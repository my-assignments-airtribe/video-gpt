// docker run --name postgress-user-db -e POSTGRES_PASSWORD=-p 5432:5432 -d postgres


import express from 'express';
import type { Response, Request, Express } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Pool } from 'pg'; // PostgreSQL client
// import userRoutes from './routes/userRoutes';

// Load environment variables from .env file
dotenv.config();

// Create a new express application instance
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse the body of incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
// app.use('/api/users', userRoutes);

// Basic route for testing the server
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the User Service API!' });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}`);
});

export { pool }; // Export the pool to use it in other parts of the application
