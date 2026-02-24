const ReviewRepository = require('../repositories/ReviewRepository');

class ReviewService {
  async addReview(reviewData) {
    const existingReview = await ReviewRepository.findByUserIdAndBookId(reviewData.user, reviewData.book);
    if (existingReview) {
      throw new Error('Ya has reseñado este libro');
    }
    return await ReviewRepository.create(reviewData);
  }

  async getBookReviews(bookId) {
    return await ReviewRepository.findByBook(bookId);
  }

  async deleteReview(reviewId, userId) {
    const review = await ReviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Reseña no encontrada');
    }

    // Check if the user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
      throw new Error('No tienes permiso para eliminar esta reseña');
    }

    return await ReviewRepository.delete(reviewId);
  }
}

module.exports = new ReviewService();
