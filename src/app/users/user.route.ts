import { Router, Request, Response } from 'express';

const router = Router();

router.get('/users', async (req: Request, res: Response) => {
    res.status(200).send('create user');
});

router.post('/users', async (req: Request, res: Response) => {
    res.status(200).send('create user');
});

export default router;
