// src/routes.ts
import { Router, Request, Response } from "express";
import userRoutes from "../users/user.route";

const router = Router();

// Root endpoint
router.get("/", async (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
});
// Grouped routes
router.use(userRoutes);

export default router;
