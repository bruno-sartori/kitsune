import jwt from 'jsonwebtoken';
import authConfig from '@config/auth';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import UnauthorizedError from '@errors/UnauthorizedError';
import ApiError from '@errors/ApiError';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('Authorization');
  
  if (!header) {
    const error = new UnauthorizedError('Access denined, no token provided', 'INVALID_TOKEN');
    return res.status(httpStatus.UNAUTHORIZED).send({ error: error.toJSON() });
  }

  const token = header.replace('Bearer ', '');
  
  try {
    const decodedUser = jwt.verify(token, authConfig.secret);
    req.user = decodedUser;
  
    next();
  } catch (error) {
    console.error(error);
    const newError = new ApiError('Error processing user token', 'INVALID_TOKEN');
    return res.status(httpStatus.UNAUTHORIZED).send({ error: newError.toJSON() });
  }
}

export default authMiddleware;
