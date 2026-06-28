import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

/**
 * Fetch all categories
 */
export const getAllCategories = async (req, res) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
};

/**
 * Fetch a single category by ID
 */
export const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError('No category found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
};

/**
 * Create a new category (Admin)
 */
export const createCategory = async (req, res) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
};

/**
 * Update an existing category by ID (Admin)
 */
export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!category) {
    throw new ApiError('No category found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
};

/**
 * Delete a category by ID (Admin)
 */
export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError('No category found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
