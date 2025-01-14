import { log } from '@repo/logger';
import { closeConnection, connect } from './db/database';
import { createServer } from './server';

const startServer = async () => {
  const port = process.env.PORT || 5001;
  const server = createServer();

  await connect();

  server
    .listen(port, () => {
      log(`Server is running on port ${port}`);
    })
    .on('error', (err: Error) => {
      log('Server error:', err);
      throw err;
    })
    .on('close', async () => {
      await closeConnection();
    });
};

startServer();
