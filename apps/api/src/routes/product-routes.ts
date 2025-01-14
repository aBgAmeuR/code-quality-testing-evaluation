import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateStock
} from '../controllers/product-controller';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/products', auth, getAllProducts);
router.post('/products', auth, createProduct);
router.get('/products/:id', auth, getProduct);
router.patch('/products/:id/stock', auth, updateStock);

export default router;
