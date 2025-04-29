// src/routes.ts
import { Router } from "express";
import userRoutes from "../users/user.route";
import registerRoutes from "../register/register.route";
import walletRoutes from "../wallet/wallet.route";

const router = Router();
router.use(userRoutes);
router.use(registerRoutes);
router.use(walletRoutes);

export default router;
