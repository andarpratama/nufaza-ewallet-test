import { Router } from 'express';
import { addDeposit, checkBalanceController, withdrawBalanceController } from './account.controller';

const router = Router();

router.get('/:id/balance', checkBalanceController);
router.post('/:id/deposit', addDeposit);
router.post('/:id/withdraw', withdrawBalanceController);

export default router;
