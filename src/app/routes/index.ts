// src/routes.ts
import { Router } from "express";
import registerRoutes from "../register/register.route";
import walletRoutes from "../account/account.route";

const router = Router();
router.use(registerRoutes);
router.use('/accounts', walletRoutes);

export default router;
