import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as db from './db/database';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes setup
app.use('/api/auth', userRoutes);
app.use('/api', productRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const port = process.env.PORT || 3001;

// Start server only after the database is connected
const startServer = async () => {
  try {
    await db.connect();

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on('error', (err: Error) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      console.info('SIGTERM signal received.');
      server.close(() => {
        db.closeConnection()
            .then(() => process.exit(0))
            .catch(() => process.exit(1));
      });
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
