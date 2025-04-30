import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { checkBalanceController } from '../app/account/account.controller';
import { idParamSchema } from '../app/account/account.validator';
import * as accountService from '../app/account/account.service';
import { AppError } from '../errors/AppError';

describe('checkBalanceController', () => {
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

    jest.spyOn(idParamSchema, 'validate').mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds 200 with user when found', async () => {
    const user = { id: 1, name: 'Test', email: 'test@example.com', balance: 100 };
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(user as any);

    await checkBalanceController(req as Request, res as Response, next);

    expect(accountService.getDetailBalance).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with AppError when user is not found', async () => {
    jest.spyOn(accountService, 'getDetailBalance').mockResolvedValue(null);

    await checkBalanceController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(err.code).toBe('NotFound');
  });

  it('responds 400 when validation fails', async () => {
    const validationError = new yup.ValidationError('ID is required', null, 'id');
    validationError.inner = [validationError];
    (idParamSchema.validate as jest.Mock).mockRejectedValue(validationError);

    await checkBalanceController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'id', message: 'ID is required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
