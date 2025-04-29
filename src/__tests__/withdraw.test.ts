// src/__tests__/withdrawBalance.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { withdrawBalanceController } from '../app/account/account.controller';
import { idParamSchema, addDepositeSchema } from '../app/account/account.validator';
import * as accountService from '../app/account/account.service';
import { AppError } from '../errors/AppError';

describe('withdrawBalanceController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.spyOn(idParamSchema, 'validate').mockResolvedValue({ id: 1 });
    jest.spyOn(addDepositeSchema, 'validate').mockResolvedValue({ amount: 50 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds 200 and updates balance on success', async () => {
    const user = { id: 1, balance: 100 };
    const updatedUser = { id: 1, balance: 50 };

    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(user as any);
    jest.spyOn(accountService, 'updateBalance').mockResolvedValue(updatedUser as any);

    await withdrawBalanceController(req as Request, res as Response, next);

    expect(accountService.getDetailBalance).toHaveBeenCalledWith(1);
    expect(accountService.updateBalance).toHaveBeenCalledWith(1, 50);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 409 when balance is insufficient', async () => {
    req.body = { amount: 200 };
    jest.spyOn(addDepositeSchema, 'validate').mockResolvedValue({ amount: 200 });
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue({ id: 1, balance: 100 } as any);

    await withdrawBalanceController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Your balance is not enough.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 400 when validation fails', async () => {
    const valErr = new yup.ValidationError('Amount is required', null, 'amount');
    valErr.inner = [valErr];
    (addDepositeSchema.validate as jest.Mock).mockRejectedValue(valErr);

    await withdrawBalanceController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'amount', message: 'Amount is required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with AppError when user not found', async () => {
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(null);

    await withdrawBalanceController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(err.code).toBe('NotFound');
  });

  it('responds with user when amount is falsy', async () => {
    req.body = { amount: 0 };
    jest.spyOn(addDepositeSchema, 'validate').mockResolvedValue({ amount: 0 });
    const user = { id: 1, balance: 100 };
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(user as any);

    await withdrawBalanceController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });
});
