import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { idParamSchema, addDepositeSchema } from "./account.validator";
import { getDetailBalance, updateBalance } from "./account.service";
import { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { IUser } from "./account.types";

export const checkBalanceController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = await idParamSchema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
        });
        const user = await getDetailBalance(id);
        if (!user) {
            throw new AppError("NotFound", `User with ID ${id} not found`);
        }
        res.status(200).json(user);
        return;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                errors: error.inner.map((err) => ({ field: err.path, message: err.message })),
            });
            return;
        }
        next(error);
    }
};

export const addDeposit: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await idParamSchema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { amount } = await addDepositeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const user = await getDetailBalance(id);
    if (!user) {
      throw new AppError('NotFound', `User with ID ${id} not found`);
    }

    if (amount) {
      const newBalance =
        parseInt(user.balance.toString(), 10) +
        parseInt(amount.toString(), 10);
      const updatedUser = await updateBalance(id, newBalance);
      res.status(200).json(updatedUser);
      return; 
    }

    res.status(200).json(user);
    return;
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        errors: error.inner.map(err => ({
          field: err.path,
          message: err.message,
        })),
      });
      return;
    }
    next(error);
  }
};

