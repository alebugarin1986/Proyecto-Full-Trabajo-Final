const CategoryService = require('../services/CategoryService');

const CategoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ message: 'Categoría eliminada' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = CategoryController;
