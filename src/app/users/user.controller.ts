// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import * as yup from 'yup';
import { createUserSchema } from './user.validator';
import { createUser } from './user.service';

export const createUserController = async (req: Request, res: Response) => {
  try {
    await createUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { name, email } = req.body;

    const user = await createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        errors: error.inner.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};
