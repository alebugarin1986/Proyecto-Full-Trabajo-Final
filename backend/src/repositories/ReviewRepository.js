const Review = require('../models/Review');

class ReviewRepository {
  async create(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  }

  async findByBook(bookId) {
    return await Review.find({ book: bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
  }

  async findByUserIdAndBookId(userId, bookId) {
    return await Review.findOne({ user: userId, book: bookId });
  }

  async findById(id) {
    return await Review.findById(id);
  }

  async delete(id) {
    return await Review.findByIdAndDelete(id);
  }

  async deleteManyByBookId(bookId) {
    return await Review.deleteMany({ book: bookId });
  }
}

module.exports = new ReviewRepository();
