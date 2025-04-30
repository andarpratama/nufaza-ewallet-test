import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { idParamSchema, addDepositeSchema, transferSchema } from "./account.validator";
import { createTransaction, getDetailBalance, getDetailUser, getTransactions, updateBalance } from "./account.service";
import { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { BalanceResponse, DepositResponse, IUser, TransactionRecord, TransferResponse, WithdrawResponse } from "./account.types";

export const checkBalanceController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = await idParamSchema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
        });
        const result: BalanceResponse | null = await getDetailBalance(id);
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

export const addDeposit: RequestHandler = async (req, res, next): Promise<void> => {
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

    // If amount is falsy (e.g., 0), just return current balance
    if (!amount) {
      res.status(200).json(user);
      return;
    }

    const newBalance = user.balance + amount;
    const deposit: DepositResponse = await updateBalance(id, newBalance);

    // record transaction
    await createTransaction({ userId: id, type: 'DEPOSIT', amount });

    res.status(200).json(deposit);
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        errors: error.inner.map(e => ({ field: e.path, message: e.message })),
      });
    } else {
      next(error);
    }
  }
};

export const withdrawBalanceController: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
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

    // If amount is falsy (e.g. 0), return current balance
    if (!amount) {
      res.status(200).json(user);
      return;
    }

    // Insufficient balance
    if (amount > user.balance) {
      res.status(409).json({ message: 'Your balance is not enough.' });
      return;
    }

    const newBalance = user.balance - amount;
    const withdrawal: WithdrawResponse = await updateBalance(id, newBalance);

    // record transaction
    await createTransaction({ userId: id, type: 'WITHDRAW', amount });

    res.status(200).json(withdrawal);
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        errors: error.inner.map(e => ({ field: e.path, message: e.message })),
      });
    } else {
      next(error);
    }
  }
};

export const transferController: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = await idParamSchema.validate(req.params, { abortEarly: false, stripUnknown: true });
    const { amount, toAccountId } = await transferSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

    // Prevent self-transfer
    if (id === toAccountId) {
      res.status(400).json({ message: 'You cannot transfer to yourself.' });
      return;
    }

    const sender = await getDetailUser(id);
    const receiver = await getDetailUser(toAccountId);
    if (!sender) throw new AppError('NotFound', `Sender with ID ${id} not found`);
    if (!receiver) throw new AppError('NotFound', `Receiver with ID ${toAccountId} not found`);

    if (amount > sender.balance) {
      res.status(409).json({ message: 'Your balance is not enough.' });
      return;
    }

    const newSenderBal = sender.balance - amount;
    const newReceiverBal = receiver.balance + amount;
    await updateBalance(id, newSenderBal);
    await updateBalance(toAccountId, newReceiverBal);

    // record transactions for both
    await createTransaction({ userId: id, type: 'TRANSFER_OUT', amount });
    await createTransaction({ userId: toAccountId, type: 'TRANSFER_IN', amount });

    const response: TransferResponse = { fromBalance: newSenderBal, toBalance: newReceiverBal };
    res.status(200).json(response);
    return;
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.inner.map(err => ({ field: err.path, message: err.message })) });
      return;
    }
    if (error instanceof AppError && error.code === 'NotAllowed') {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getTransactionsController: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await idParamSchema.validate(req.params, { abortEarly: false, stripUnknown: true });
    const history: TransactionRecord[] = await getTransactions(id);
    res.status(200).json(history);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.inner.map(e => ({ field: e.path, message: e.message })) });
      return
    }
    next(error);
  }
};
