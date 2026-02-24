const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { protect } = require('../middleware/auth');

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', protect, CategoryController.create);
router.put('/:id', protect, CategoryController.update);
router.delete('/:id', protect, CategoryController.delete);

module.exports = router;
