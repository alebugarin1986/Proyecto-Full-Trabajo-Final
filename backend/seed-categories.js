const mongoose = require('mongoose');
require('dotenv').config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Si ya hay categorías, no hacemos nada
    const Category = mongoose.model('Category', new mongoose.Schema({ 
        name: { type: String, required: true, unique: true },
        description: String 
    }));
    
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('Las categorías ya existen.');
      process.exit(0);
    }

    const initialCategories = [
      { name: 'Ficción', description: 'Libros de narrativa y aventura' },
      { name: 'Ciencia Ficción', description: 'Historias futuristas y tecnológicas' },
      { name: 'Historia', description: 'Relatos de hechos reales pasados' },
      { name: 'Terror', description: 'Libros para no dormir' },
      { name: 'Fantasía', description: 'Mundos mágicos y épicos' }
    ];

    await Category.insertMany(initialCategories);
    console.log('✅ ¡Éxito! Categorías iniciales creadas correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al precargar categorías:', error.message);
    process.exit(1);
  }
};

seedCategories();
