import express, { Request, Response } from 'express';
import router from './app/routes';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World!');
});
app.use(router)

export default app;