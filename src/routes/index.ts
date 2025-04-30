// src/routes.ts
import { Router } from "express";
import registerRoutes from "../app/register/register.route";
import accountRoutes from "../app/account/account.route";

const router = Router();
router.use(registerRoutes);
router.use('/accounts', accountRoutes);

export default router;
