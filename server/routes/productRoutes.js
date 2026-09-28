import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  verifyProductAI
} from '../controllers/productController.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.post('/ai-verify', verifyProductAI);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
