import * as yup from 'yup';

export const createUserSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

export const idParamSchema = yup.object({
  id: yup
    .number()
    .transform((val, orig) => {
      return typeof orig === 'string' && orig.match(/^\d+$/)
        ? parseInt(orig, 10)
        : NaN;
    })
    .integer('“id” must be an integer')
    .positive('“id” must be a positive integer')
    .required('“id” is required'),
});

export const addDepositeSchema = yup.object({
  amount: yup
    .number()
    .required('amount is required')
    .typeError('amount must be a number')
    .min(0, 'amount must be greater than or equal to 0'),
});

export const transferSchema = yup.object({
  toAccountId: yup
    .number()
    .positive('“id” must be a positive integer')
    .required('“id” is required'),
  amount: yup
    .number()
    .required('amount is required')
    .typeError('amount must be a number')
    .min(0, 'amount must be greater than or equal to 0'),
});

