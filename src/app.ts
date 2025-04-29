import express, { Request, Response } from 'express';
import router from './app/routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});
app.use(router)
app.use(errorHandler);

export default app;