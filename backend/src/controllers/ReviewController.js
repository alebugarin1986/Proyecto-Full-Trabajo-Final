const ReviewService = require('../services/ReviewService');

const ReviewController = {
  create: async (req, res, next) => {
    try {
      const reviewData = {
        ...req.body,
        user: req.user._id,
        book: req.params.bookId
      };
      const review = await ReviewService.addReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  },

  getByBook: async (req, res, next) => {
    try {
      const reviews = await ReviewService.getBookReviews(req.params.bookId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await ReviewService.deleteReview(req.params.reviewId, req.user._id);
      res.json({ message: 'Reseña eliminada con éxito' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ReviewController;
