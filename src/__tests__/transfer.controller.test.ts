import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { transferController } from '../app/account/account.controller';
import { idParamSchema, transferSchema } from '../app/account/account.validator';
import * as accountService from '../app/account/account.service';
import { AppError } from '../errors/AppError';

describe('transferController', () => {
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
    jest.spyOn(transferSchema, 'validate').mockResolvedValue({ toAccountId: 2, amount: 25000 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 if user tries to transfer to themselves', async () => {
    jest.spyOn(transferSchema, 'validate').mockResolvedValue({ toAccountId: 1, amount: 10000 });

    await transferController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'You cannot transfer to yourself.' });
  });

  it('responds 200 and returns fromBalance and toBalance on success', async () => {
    const sender = { id: 1, balance: 50000 };
    const receiver = { id: 2, balance: 10000 };
    const updatedSender = { balance: 25000 };
    const updatedReceiver = { balance: 35000 };

    jest.spyOn(accountService, 'getDetailUser').mockImplementation(async (id) => {
      if (id === 1) return sender as any;
      if (id === 2) return receiver as any;
      return null;
    });

    jest.spyOn(accountService, 'updateBalance')
      .mockImplementation(async (id, balance) => ({ id, balance }));

    await transferController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      fromBalance: 25000,
      toBalance: 35000,
    });
  });

  it('responds 409 when balance is insufficient', async () => {
    const sender = { id: 1, balance: 1000 };
    const receiver = { id: 2, balance: 20000 };

    jest.spyOn(accountService, 'getDetailUser').mockImplementation(async (id) => {
      if (id === 1) return sender as any;
      if (id === 2) return receiver as any;
      return null;
    });

    await transferController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Your balance is not enough.' });
  });

  it('calls next with AppError when sender not found', async () => {
    jest.spyOn(accountService, 'getDetailUser').mockImplementation(async (id) => {
      if (id === 1) return null;
      return { id: 2, balance: 50000 } as any;
    });

    await transferController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(err.code).toBe('NotFound');
  });

  it('calls next with AppError when receiver not found', async () => {
    jest.spyOn(accountService, 'getDetailUser').mockImplementation(async (id) => {
      if (id === 1) return { id: 1, balance: 50000 } as any;
      return null;
    });

    await transferController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(err.code).toBe('NotFound');
  });

  it('responds 400 on validation error', async () => {
    const valErr = new yup.ValidationError('amount is required', null, 'amount');
    valErr.inner = [valErr];
    (transferSchema.validate as jest.Mock).mockRejectedValue(valErr);

    await transferController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'amount', message: 'amount is required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
