import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// The main function of this middleware is just to extract the data
// and put into req.currentUser

interface UserPayload {
  id: string;
  email: string;
}

// 0. This is the way to define new properties to
//    The standard object
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. No cookie at all
  if (!req.session?.jwt) {
    return next();
  }

  // 2. Use standard library to verify JWT
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
