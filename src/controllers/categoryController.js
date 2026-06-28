const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

/**
 * Fetch all categories
 */
exports.getAllCategories = async (req, res) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
};

/**
 * Fetch a single category by ID
 */
exports.getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError('No category found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
};

/**
 * Create a new category (Admin)
 */
exports.createCategory = async (req, res) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory
    }
  });
};

/**
 * Update an existing category by ID (Admin)
 */
exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    throw new ApiError('No category found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
};

/**
 * Delete a category by ID (Admin)
 */
exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError('No category found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};
