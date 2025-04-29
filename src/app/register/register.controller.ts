// src/register/register.controller.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import * as yup from "yup";
import { createUserSchema } from "./register.validator";
import { createUser } from "./register.service";

/**
 * Controller to handle user registration.
 */
export const registerController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedBody = await createUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { name, email } = validatedBody;

    // Create the user
    const user = await createUser({ name, email });

    // Respond with created user data
    res.status(201).json(user);
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof yup.ValidationError) {
      const formatted = error.inner.map(err => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({ errors: formatted });
      return;
    }

    // Handle service or unexpected errors
    res.status(500).json({ message: error.message });
  }
};
