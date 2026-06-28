const express = require('express');
const productController = require('../controllers/productController');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(uploadProductImages, productController.createProduct); // Auth checking to be added in Phase 3

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(uploadProductImages, productController.updateProduct) // Auth checking to be added in Phase 3
  .delete(productController.deleteProduct); // Auth checking to be added in Phase 3

module.exports = router;
