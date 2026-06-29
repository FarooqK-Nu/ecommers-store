import express from 'express';
import validate from '../middleware/validationMiddleware.js';
import categorySchema from '../validations/category.schema.js';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(validate(categorySchema), categoryController.createCategory); // Auth checking to be added in Phase 3

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory) // Auth checking to be added in Phase 3
  .delete(categoryController.deleteCategory); // Auth checking to be added in Phase 3

export default router;
