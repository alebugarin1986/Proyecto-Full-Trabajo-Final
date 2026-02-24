const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
