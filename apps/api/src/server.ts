import bodyParser from 'body-parser';
import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user-routes';
import productRoutes from './routes/product-routes';

export const createServer = (): Express => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(cors())
    .use('/api/auth', userRoutes)
    .use('/api', productRoutes)
    .get('/message/:name', (req, res) =>
      res.json({ message: `hello ${req.params.name}` })
    )
    .get('/status', (_, res) => res.json({ ok: true }));

  return app;
};
