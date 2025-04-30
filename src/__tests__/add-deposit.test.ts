import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { addDeposit } from '../app/account/account.controller';
import { idParamSchema, addDepositeSchema } from '../app/account/account.validator';
import * as accountService from '../app/account/account.service';
import { AppError } from '../errors/AppError';

describe('addDeposit controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn() as any,
    };
    next = jest.fn() as any;

    jest.spyOn(idParamSchema, 'validate').mockResolvedValue({ id: 1 } as any);
    jest.spyOn(addDepositeSchema, 'validate').mockResolvedValue({ amount: 50 } as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds 200 with updated user when deposit is successful', async () => {
    req.params = { id: '1' };
    req.body = { amount: 50 };

    const user = { id: 1, balance: 100 };
    const updatedUser = { id: 1, balance: 150 };

    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(user as any);
    jest.spyOn(accountService, 'updateBalance').mockResolvedValue(updatedUser as any);

    await addDeposit(req as Request, res as Response, next);

    expect(accountService.getDetailBalance).toHaveBeenCalledWith(1);
    expect(accountService.updateBalance).toHaveBeenCalledWith(1, 150);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 400 when id validation fails', async () => {
    const valErr = new yup.ValidationError('ID is required', null, 'id');
    valErr.inner = [valErr];
    (idParamSchema.validate as jest.Mock).mockRejectedValue(valErr);

    await addDeposit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'id', message: 'ID is required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 400 when body validation fails', async () => {
    const valErr = new yup.ValidationError('Amount is required', null, 'amount');
    valErr.inner = [valErr];
    (addDepositeSchema.validate as jest.Mock).mockRejectedValue(valErr);

    await addDeposit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'amount', message: 'Amount is required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with AppError when user not found', async () => {
    req.params = { id: '2' };
    req.body = { amount: 10 };
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(null);

    await addDeposit(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(err.code).toBe('NotFound');
  });

  it('responds with user when amount is falsy', async () => {
    req.params = { id: '1' };
    req.body = { amount: 0 };
    const user = { id: 1, balance: 100 };
  
    (addDepositeSchema.validate as jest.Mock).mockResolvedValue({ amount: 0 });
  
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(user as any);
  
    await addDeposit(req as Request, res as Response, next);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });
  
});
