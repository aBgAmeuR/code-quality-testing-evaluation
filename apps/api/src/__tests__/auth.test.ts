import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { closeConnection, connect } from '../db/database';
import { createServer } from '../server';

let server: TestAgent;

beforeAll(async () => {
  await connect();
  server = supertest(createServer());
});

afterAll(async () => {
  await closeConnection();
});

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    await server
      .get('/api/auth/users')
      .expect(401)
      .then((res) => {
        expect(res.body.error).toBe('No token provided');
      });
  });

  it('should return 401 if token is invalid', async () => {
    const invalidToken = jwt.sign({ id: 1 }, 'wrong-secret-key', {
      expiresIn: 86400
    });
    await server
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401)
      .then((res) => {
        expect(res.body.error).toBe('Failed to authenticate token');
      });
  });

  it('should return 200 if token is valid', async () => {
    const token = jwt.sign(
      { id: 1 },
      'your-super-secret-key-that-should-not-be-hardcoded',
      { expiresIn: 86400 }
    );
    await server
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
