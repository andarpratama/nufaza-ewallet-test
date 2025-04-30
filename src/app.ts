import express, { Request, Response } from 'express';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello from E-Wallet API",
    author: "andarpratama"
  });
});
app.use(router)
app.use(errorHandler);

export default app;