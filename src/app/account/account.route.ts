import { Router } from 'express';
import { addDeposit, checkBalanceController } from './account.controller';

const router = Router();

router.get('/:id/balance', checkBalanceController);
router.post('/:id/deposit', addDeposit);

export default router;
