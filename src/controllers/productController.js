import Product from '../models/Product.js';
import APIFeatures from '../utils/APIFeatures.js';
import ApiError from '../utils/ApiError.js';
import * as uploadService from '../services/uploadService.js';

/**
 * Get all products with filtering, sorting, field limiting, and pagination
 */
export const getAllProducts = async (req, res) => {
  // 1) Initialize query and features chain
  const features = new APIFeatures(
    Product.find().populate('category'),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2) Execute Query
  const products = await features.query;

  // 3) Send response
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
};

/**
 * Get a single product by ID
 */
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    throw new ApiError('No product found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
};

/**
 * Create a new product (Admin)
 * Handles image uploading to Cloudinary if image files are provided
 */
export const createProduct = async (req, res) => {
  // Handle file uploads to Cloudinary
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadService.uploadBuffer(file.buffer),
    );
    req.body.images = await Promise.all(uploadPromises);
  }

  // Parse variants if they are sent as JSON strings (common in form-data submissions)
  if (req.body.variants && typeof req.body.variants === 'string') {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch (e) {
      throw new ApiError('Invalid variants JSON structure', 400);
    }
  }

  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
};

/**
 * Update an existing product by ID (Admin)
 * Handles uploading new image files to Cloudinary
 */
export const updateProduct = async (req, res) => {
  // Handle file uploads to Cloudinary
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadService.uploadBuffer(file.buffer),
    );
    const imageUrls = await Promise.all(uploadPromises);

    // Support merging/appending new images to existing list or replacing completely
    if (req.query.append === 'true') {
      const existingProduct = await Product.findById(req.params.id);
      const currentImages = (existingProduct && existingProduct.images) || [];
      req.body.images = [...currentImages, ...imageUrls];
    } else {
      req.body.images = imageUrls;
    }
  }

  // Parse variants if they are sent as JSON strings
  if (req.body.variants && typeof req.body.variants === 'string') {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch (e) {
      throw new ApiError('Invalid variants JSON structure', 400);
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!product) {
    throw new ApiError('No product found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
};

/**
 * Delete a product by ID (Admin)
 */
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError('No product found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
