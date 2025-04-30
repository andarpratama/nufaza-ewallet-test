import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { idParamSchema, addDepositeSchema, transferSchema } from "./account.validator";
import { getDetailBalance, getDetailUser, updateBalance } from "./account.service";
import { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { BalanceResponse, DepositResponse, IUser, TransferResponse, WithdrawResponse } from "./account.types";

export const checkBalanceController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = await idParamSchema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
        });
        const result: BalanceResponse = await getDetailBalance(id);
        if (!result) {
            throw new AppError("NotFound", `User with ID ${id} not found`);
        }
        res.status(200).json(result as BalanceResponse);
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

    const user: DepositResponse = await getDetailBalance(id);
    if (!user) {
      throw new AppError('NotFound', `User with ID ${id} not found`);
    }

    if (!amount) {
      res.status(400).json({
        error: 'Amount is required for deposit',
      });
      return
    }

    const newBalance =
      parseInt(user.balance.toString(), 10) +
      parseInt(amount.toString(), 10);
    const depositResponse: DepositResponse = await updateBalance(id, newBalance);
    res.status(200).json(depositResponse);

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

export const withdrawBalanceController: RequestHandler = async (req, res, next) => {
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

    const convertedAmount = parseInt(amount.toString(), 10)
    const convertedBalance = parseInt(user.balance.toString(), 10)

    if (convertedAmount > convertedBalance) {
      res.status(409).json({
        message: 'Your balance is not enough.'
      });
      return
    }
    

    if (!amount) {
      res.status(400).json({
        error: 'Amount is required for deposit',
      });
      return
    }

    const newBalance =
      parseInt(user.balance.toString(), 10) +
      parseInt(amount.toString(), 10);
    const withdrawResponse: WithdrawResponse = await updateBalance(id, newBalance);
    res.status(200).json(withdrawResponse);
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

export const transferController: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await idParamSchema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { amount, toAccountId } = await transferSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (parseInt(id.toString(), 10) === parseInt(toAccountId.toString(), 10)) {
      throw new AppError('NotAllowed', `You cannot transfer to yourself.`);
    }
    

    const sender = await getDetailUser(id);
    const receiver = await getDetailUser(toAccountId);

    if (!sender) {
      throw new AppError('NotFound', `User with ID ${id} not found`);
    }

    if (!receiver) {
      throw new AppError('NotFound', `User with ID ${toAccountId} not found`);
    }

    const convertedAmount = parseInt(amount.toString(), 10);
    const senderBalance = parseInt(sender.balance.toString(), 10);
    const receiverBalance = parseInt(receiver.balance.toString(), 10);

    if (convertedAmount > senderBalance) {
      res.status(409).json({
        message: 'Your balance is not enough.'
      });
      return
    }
    
    const newSenderBalance = senderBalance - convertedAmount;
    const newReceiverBalance = receiverBalance + convertedAmount;

    await updateBalance(id, newSenderBalance);
    await updateBalance(toAccountId, newReceiverBalance);

    const transferResponse: TransferResponse = {
      fromBalance: newSenderBalance,
      toBalance: newReceiverBalance,
    };
    
    res.status(200).json(transferResponse);

    return

  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
       res.status(400).json({
        errors: error.inner.map(err => ({
          field: err.path,
          message: err.message,
        })),
      });

      return
    }
    next(error);
  }
};
