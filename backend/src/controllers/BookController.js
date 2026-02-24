const BookService = require('../services/BookService');

const BookController = {
  getAll: async (req, res, next) => {
    try {
      const { page = 1, limit = 12, search = '' } = req.query;
      const data = await BookService.getAllBooks(page, limit, search);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const book = await BookService.getBookById(req.params.id);
      res.json(book);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const bookData = { ...req.body, user: req.user._id };
      const book = await BookService.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const book = await BookService.updateBook(req.params.id, req.body, req.user._id);
      res.json(book);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await BookService.deleteBook(req.params.id);
      res.json({ message: 'Libro eliminado' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = BookController;
