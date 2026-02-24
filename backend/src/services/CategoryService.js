const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryService {
  async getAllCategories() {
    return await CategoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error('Categoría no encontrada');
    return category;
  }

  async createCategory(categoryData) {
    const existing = await CategoryRepository.findByName(categoryData.name);
    if (existing) throw new Error('La categoría ya existe');
    return await CategoryRepository.create(categoryData);
  }

  async updateCategory(id, categoryData) {
    const category = await CategoryRepository.update(id, categoryData);
    if (!category) throw new Error('Categoría no encontrada');
    return category;
  }

  async deleteCategory(id) {
    const BookRepository = require('../repositories/BookRepository');
    const books = await BookRepository.findByCategory(id);
    if (books.length > 0) {
      throw new Error('No se puede eliminar una categoría que tiene libros asociados');
    }
    const category = await CategoryRepository.delete(id);
    if (!category) throw new Error('Categoría no encontrada');
    return category;
  }
}

module.exports = new CategoryService();
