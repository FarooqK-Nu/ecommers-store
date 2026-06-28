const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory); // Auth checking to be added in Phase 3

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory) // Auth checking to be added in Phase 3
  .delete(categoryController.deleteCategory); // Auth checking to be added in Phase 3

module.exports = router;
