// userRoutes.ts

import express from 'express';
import { registerUser, loginUser } from '../controllers/user';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Export the router
export default router;
