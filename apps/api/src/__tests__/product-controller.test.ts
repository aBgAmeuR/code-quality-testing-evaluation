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

describe('Product Controller', () => {
  it('should create a new product', async () => {
    await server
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Product', price: 100, stock: 10 })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Product');
        expect(res.body).toHaveProperty('price', 100);
        expect(res.body).toHaveProperty('stock', 10);
      });
  });

  it('should update product stock', async () => {
    const productId = 1; // Assurez-vous que ce produit existe dans votre base de données de test
    await server
      .patch(`/api/products/${productId}/stock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stock: 20 })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('success', true);
      });
  });
});
