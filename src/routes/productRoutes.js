import express from 'express';
import validate from '../middleware/validationMiddleware.js';
import productSchema from '../validations/product.schema.js';
import * as productController from '../controllers/productController.js';
import { uploadProductImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(uploadProductImages, validate(productSchema), productController.createProduct); // Auth checking to be added in Phase 3

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(uploadProductImages, productController.updateProduct) // Auth checking to be added in Phase 3
  .delete(productController.deleteProduct); // Auth checking to be added in Phase 3

export default router;
