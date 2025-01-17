import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { closeConnection, connect, getDb } from '../db/database';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeConnection();
});

describe('Database', () => {
  it('should connect to the database', () => {
    const db = getDb();
    expect(db).toBeDefined();
  });

  it('should close the database connection', async () => {
    await closeConnection();
    expect(() => getDb()).toThrow(
      'Database not connected. Call connect() first.'
    );
  });
});
