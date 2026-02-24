const Book = require('../models/Book');
const Review = require('../models/Review');
const User = require('../models/User');

class BookRepository {
  async _buildSearchQuery(search) {
    if (!search) return {};

    // Find users whose name matches the search term
    const users = await User.find({ name: { $regex: search, $options: 'i' } }).select('_id');
    const userIds = users.map(u => u._id);

    // Find books that have reviews by these users
    const reviews = await Review.find({ user: { $in: userIds } }).select('book');
    const reviewedBookIds = reviews.map(r => r.book);

    return {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { _id: { $in: reviewedBookIds } }
      ]
    };
  }

  async findAll(skip = 0, limit = 10, search = '') {
    const query = await this._buildSearchQuery(search);
    
    return await Book.find(query)
      .populate('categories', 'name')
      .populate('user', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async count(search = '') {
    const query = await this._buildSearchQuery(search);
    return await Book.countDocuments(query);
  }

  async findById(id) {
    return await Book.findById(id).populate('categories', 'name').populate('user', 'name');
  }

  async create(bookData) {
    const book = new Book(bookData);
    return await book.save();
  }

  async update(id, bookData) {
    return await Book.findByIdAndUpdate(id, bookData, { new: true });
  }

  async delete(id) {
    return await Book.findByIdAndDelete(id);
  }

  async findByCategory(categoryId) {
    return await Book.find({ categories: categoryId }).populate('categories', 'name');
  }
}

module.exports = new BookRepository();
