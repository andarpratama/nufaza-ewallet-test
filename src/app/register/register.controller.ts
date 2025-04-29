import { Request, Response, NextFunction, RequestHandler } from "express";
import * as yup from "yup";
import { createUserSchema } from "./register.validator";
import { createUser } from "./register.service";

export const registerController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedBody = await createUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { name, email } = validatedBody;

    const user = await createUser({ name, email });

    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const formatted = error.inner.map(err => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({ errors: formatted });
      return;
    }

    res.status(500).json({ message: error.message });
  }
};
