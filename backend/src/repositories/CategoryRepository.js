const Category = require('../models/Category');

class CategoryRepository {
  async findAll() {
    return await Category.find();
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async findByName(name) {
    return await Category.findOne({ name });
  }

  async create(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async update(id, categoryData) {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryRepository();
