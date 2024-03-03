// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer Token

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    // Ensure decoded token matches our interface
    const payload = decoded as UserPayload;
    if (!payload.userId || !payload.username) {
      return res.sendStatus(403); // Forbidden, invalid token structure
    }

    req.user = payload;
    next();
  });
};
