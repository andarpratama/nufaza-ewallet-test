// src/register/register.route.ts
import { Router } from 'express';
import { addDeposit, checkBalanceController } from './account.controller';

const router = Router();

// Ini akan POST ke /register/account
router.get('/:id/balance', checkBalanceController);
router.post('/:id/deposit', addDeposit);

export default router;
