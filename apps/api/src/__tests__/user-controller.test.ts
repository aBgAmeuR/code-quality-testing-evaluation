import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import jwt from 'jsonwebtoken';
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

describe('User Controller', () => {
  it('should register a new user', async () => {
    const randomUsername = `testuser_${Math.random().toString(36).substring(7)}`;
    await server
      .post('/api/auth/register')
      .send({
        username: randomUsername,
        password: 'password',
        firstname: 'Test',
        lastname: 'User'
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('auth', true);
        expect(res.body).toHaveProperty('token');
      });
  });

  it('should login an existing user', async () => {
    const randomUsername = `testuser_${Math.random().toString(36).substring(7)}`;
    await server
      .post('/api/auth/register')
      .send({
        username: randomUsername,
        password: 'password',
        firstname: 'Test',
        lastname: 'User'
      })
      .expect(201);

    await server
      .post('/api/auth/login')
      .send({ username: randomUsername, password: 'password' })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('auth', true);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', randomUsername);
      });
  });

  it('should get all users', async () => {
    const token = jwt.sign(
      { id: 1 },
      'your-super-secret-key-that-should-not-be-hardcoded',
      { expiresIn: 86400 }
    );
    await server
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
