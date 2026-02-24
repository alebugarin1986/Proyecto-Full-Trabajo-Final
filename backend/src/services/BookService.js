const BookRepository = require('../repositories/BookRepository');
const ReviewRepository = require('../repositories/ReviewRepository');

class BookService {
  async getAllBooks(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const books = await BookRepository.findAll(skip, limit, search);
    const total = await BookRepository.count(search);
    
    return {
      books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getBookById(id) {
    const book = await BookRepository.findById(id);
    if (!book) throw new Error('Libro no encontrado');
    return book;
  }

  async createBook(bookData) {
    return await BookRepository.create(bookData);
  }

  async updateBook(id, bookData, userId) {
    const existingBook = await BookRepository.findById(id);
    if (!existingBook) throw new Error('Libro no encontrado');
    
    // Validate ownership: only the user who uploaded it can edit it
    if (existingBook.user._id.toString() !== userId.toString()) {
      throw new Error('No tienes permiso para editar este libro');
    }

    const book = await BookRepository.update(id, bookData);
    return book;
  }

  async deleteBook(id) {
    // Delete associated reviews first (optional but good practice)
    await ReviewRepository.deleteManyByBookId(id);
    
    const book = await BookRepository.delete(id);
    if (!book) throw new Error('Libro no encontrado');
    return book;
  }
}

module.exports = new BookService();
