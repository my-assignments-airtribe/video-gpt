import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { registrationSchema } from "../validation";
import { UsernameTakenError, ValidationError } from "../utils/error-types";
import { pool } from "..";

dotenv.config();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;
    
    // Validate request body against the registration schema
    const { error } = registrationSchema.validate(
      { username, password, email },
      { stripUnknown: true }
    );
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Check if the username or email is already in use
    const existingUserQuery = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUserQuery.rows.length > 0) {
      throw new UsernameTakenError("Username or email is already taken");
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    const user = userQuery.rows[0];
    if (!user) {
      throw new ValidationError("Invalid username or password");
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ValidationError("Invalid username or password");
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      username: user.username,
    });
  } catch (error) {
    next(error);
  }
};
