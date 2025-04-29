import { Router } from 'express';
import { registerController } from './register.controller';

const router = Router();

router.post('/accounts', registerController);

export default router;
