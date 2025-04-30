import { Router } from 'express';
import { addDeposit, checkBalanceController, transferController, withdrawBalanceController } from './account.controller';

const router = Router();

router.get('/:id/balance', checkBalanceController);
router.post('/:id/deposit', addDeposit);
router.post('/:id/withdraw', withdrawBalanceController);
router.post('/:id/transfer', transferController);

export default router;
