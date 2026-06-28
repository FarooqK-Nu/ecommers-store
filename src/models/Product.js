import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    unique: true,
    maxlength: [120, 'A product name must be less than or equal to 120 characters'],
    minlength: [3, 'A product name must be more than or equal to 3 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'A product price must be greater than or equal to 0']
  },
  discount: {
    type: Number,
    default: 0,
    validate: {
      validator: function (val) {
        // 'this' only points to current doc on NEW document creation, not update
        return val >= 0 && val < this.price;
      },
      message: 'Discount price ({VALUE}) must be below the regular price and greater than or equal to 0'
    }
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category']
  },
  brand: {
    type: String,
    required: [true, 'A product must have a brand'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must be at most 5'],
    set: val => Math.round(val * 10) / 10 // Rounds to 1 decimal place (e.g. 4.567 -> 4.6)
  },
  reviews: {
    type: Number,
    default: 0 // Total reviews count
  },
  stockQuantity: {
    type: Number,
    required: [true, 'A product must have a stock quantity'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  variants: {
    sizes: {
      type: [String],
      enum: {
        values: ['S', 'M', 'L', 'XL', 'XXL'],
        message: 'Size must be one of: S, M, L, XL, XXL'
      }
    },
    colors: {
      type: [String]
    },
    storage: {
      type: [String],
      enum: {
        values: ['64GB', '128GB', '256GB', '512GB', '1TB'],
        message: 'Storage variant must be one of: 64GB, 128GB, 256GB, 512GB, 1TB'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// INDEXES for optimization
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });

// Document middleware: runs before .save() and .create()

// Middleware to gen a slug if name is updated or created
productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
