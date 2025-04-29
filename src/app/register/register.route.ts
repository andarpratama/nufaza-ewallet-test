// src/register/register.route.ts
import { Router } from 'express';
import { registerController } from './register.controller';

const router = Router();

// Ini akan POST ke /register/account
router.post('/accounts', registerController);

export default router;
