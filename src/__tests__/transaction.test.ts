// src/__tests__/getTransactions.controller.test.ts

import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { getTransactionsController } from '../app/account/account.controller';
import { idParamSchema } from '../app/account/account.validator';
import * as accountService from '../app/account/account.service';
import { TransactionRecord } from '../app/account/account.types';

describe('getTransactionsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // By default, validation passes with id = 1
    jest.spyOn(idParamSchema, 'validate').mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds 200 with transaction history on success', async () => {
    const fakeHistory: TransactionRecord[] = [
      { id: 1, type: 'DEPOSIT', amount: 100, createdAt: new Date() },
      { id: 2, type: 'WITHDRAW', amount: 50, createdAt: new Date() },
    ];
    jest.spyOn(accountService, 'getTransactions').mockResolvedValue(fakeHistory);

    await getTransactionsController(req as Request, res as Response, next);

    expect(accountService.getTransactions).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeHistory);
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 400 when validation fails', async () => {
    const valErr = new yup.ValidationError('Invalid ID', null, 'id');
    valErr.inner = [valErr];
    (idParamSchema.validate as jest.Mock).mockRejectedValue(valErr);

    await getTransactionsController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'id', message: 'Invalid ID' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next on service error', async () => {
    const serviceError = new Error('DB down');
    jest.spyOn(accountService, 'getTransactions').mockRejectedValue(serviceError);

    await getTransactionsController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(serviceError);
  });
});
