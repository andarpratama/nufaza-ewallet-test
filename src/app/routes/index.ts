// src/routes.ts
import { Router, Request, Response } from "express";
import userRoutes from "../users/user.route";

const router = Router();
router.use(userRoutes);

export default router;
