import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import { errorMap } from '../errors/errorTypes';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof yup.ValidationError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Request validation failed',
    });
    return;
  }

  if (err instanceof AppError) {
    const config = errorMap[err.code];
    const statusCode = config?.statusCode ?? 500;
    const message = err.customMessage ?? config?.message ?? 'An error occurred';
    res.status(statusCode).json({ error: err.code, message });
    return;
  }

  if (typeof err.name === 'string' && errorMap[err.name]) {
    const { statusCode, message } = errorMap[err.name];
    res.status(statusCode).json({ error: err.name, message });
    return;
  }

  res.status(500).json({
    error: 'InternalServerError',
    message: 'Internal server error',
  });
}