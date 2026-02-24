const express = require('express');
const router = express.Router({ mergeParams: true });
const ReviewController = require('../controllers/ReviewController');
const { protect } = require('../middleware/auth');
const { validate, reviewValidationRules } = require('../middleware/validator');

// Note: merged params so we can use :bookId from the parent route if needed
// but here we define them directly or as sub-resource
router.post('/', protect, reviewValidationRules(), validate, ReviewController.create);
router.get('/', ReviewController.getByBook);
router.delete('/:reviewId', protect, ReviewController.delete);

module.exports = router;
