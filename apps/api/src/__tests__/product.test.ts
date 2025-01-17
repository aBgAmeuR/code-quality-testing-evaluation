import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import jwt from 'jsonwebtoken';
import { closeConnection, connect } from '../db/database';
import { createServer } from '../server';

let server: TestAgent;
let token: string;

beforeAll(async () => {
  await connect();
  server = supertest(createServer());
  token = jwt.sign(
    { id: 1 },
    'your-super-secret-key-that-should-not-be-hardcoded',
    { expiresIn: 86400 }
  );
});

afterAll(async () => {
  await closeConnection();
});

describe('Product Routes', () => {
  it('should return a list of products', async () => {
    await server
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('should return a single product by ID', async () => {
    const productId = 1; // Assurez-vous que ce produit existe dans votre base de données de test
    await server
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', productId);
      });
  });

  it('should return 404 for a non-existent product', async () => {
    const nonExistentProductId = 9999;
    await server
      .get(`/api/products/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe('Product not found');
      });
  });
});
