import { Request, Response } from 'express';
import { log } from '@repo/logger';
import { getDb } from '../db/database';
import { Product } from '../types';

export const getAllProducts = (req: Request, res: Response): void => {
  const database = getDb();

  database.all(
    'SELECT * FROM products',
    [],
    (error: Error, result: Product[]) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: 'success',
        data: result
      });
    }
  );
};

export const createProduct = (req: Request, res: Response): void => {
  const { name, price, stock }: Product = req.body;
  const database = getDb();

  database.run(
    `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`,
    [name, price, stock],
    function createProductCallback(this: any, err: Error) {
      if (err) {
        log(err);
        return res.status(500).json({ error: 'Error creating product' });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        price,
        stock
      });
    }
  );
};

export const getProduct = (req: Request, res: Response): void => {
  const id: string = req.params.id;
  const database = getDb();

  database.get(
    'SELECT * FROM products WHERE id = ?',
    [id],
    (error: Error, result: Product) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: 'success',
        data: result
      });
    }
  );
};

export const updateStock = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { stock }: { stock: number } = req.body;
  const database = getDb();

  database.run(
    `UPDATE products SET stock = ? WHERE id = ?`,
    [stock, id],
    function updateStockCallback(this: any, err: Error) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update stock' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ success: true });
    }
  );
};
