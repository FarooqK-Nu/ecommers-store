class APIFeatures {
  // Track whether a keyword search is active (for relevance sorting)
  #hasKeyword = false;
  /**
   * Create an APIFeatures instance.
   * @param {mongoose.Query} query - The Mongoose Query object.
   * @param {Object} queryString - The Express req.query object.
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filter the query (handles basic matches, range filters, and keyword searches)
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1) Advanced Filtering (convert gte, gt, lte, lt to $gte, $gt, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    this.query = this.query.find(JSON.parse(queryStr));

    // 2) Full-text keyword search using MongoDB text index (name + description + brand)
    // Much faster than regex on large datasets; uses the pre-built text index.
    if (this.queryString.keyword) {
      this.#hasKeyword = true;
      this.query = this.query
        .find({ $text: { $search: this.queryString.keyword } })
        .select({ score: { $meta: 'textScore' } }); // attach relevance score to each doc
    }

    return this;
  }

  /**
   * Sort results dynamically
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else if (this.#hasKeyword) {
      // When a keyword is active and no explicit sort is given, rank by relevance
      this.query = this.query.sort({ score: { $meta: 'textScore' } });
    } else {
      this.query = this.query.sort('-createdAt'); // Default sort
    }

    return this;
  }

  /**
   * Limit fields returned in the response
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude internally generated fields by default
    }

    return this;
  }

  /**
   * Paginate results
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20; // Default limit of 20
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
