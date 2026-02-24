const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const { protect } = require('../middleware/auth');
const { validate, bookValidationRules } = require('../middleware/validator');

router.get('/', BookController.getAll);
router.get('/:id', BookController.getById);
router.post('/', protect, bookValidationRules(), validate, BookController.create);
router.put('/:id', protect, BookController.update);
// router.delete('/:id', protect, BookController.delete); // Deletion disabled by request

// Review routes
router.use('/:bookId/reviews', require('./ReviewRoutes'));

module.exports = router;
