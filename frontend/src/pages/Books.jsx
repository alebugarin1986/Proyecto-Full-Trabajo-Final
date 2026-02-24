import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Plus, Book as BookIcon, Edit, Search } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const { user } = useAuth();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    description: '', 
    category: [], 
    image: '', 
    newCategoryName: '',
    initialRating: 5,
    initialReview: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const fetchBooks = async (page, search) => {
    setLoading(true);
    try {
      const res = await api.get(`/books?page=${page}&limit=12&search=${search}`);
      setBooks(res.data.books);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Error fetching books', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let categoryIds = formData.category;
      
      // If "new category" is among the selected, we need to create it first
      if (categoryIds.includes('NEW_CATEGORY')) {
        if (!formData.newCategoryName.trim()) {
           alert('Por favor ingrese el nombre del nuevo género');
           return;
        }
        const catRes = await api.post('/categories', { name: formData.newCategoryName });
        categoryIds = categoryIds.filter(id => id !== 'NEW_CATEGORY').concat(catRes.data._id);
        fetchCategories(); 
      }

      const bookPayload = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        categories: categoryIds,
        image: formData.image
      };

      if (editingId) {
        // UPDATE existing book
        await api.put(`/books/${editingId}`, bookPayload);
        alert('¡Libro actualizado con éxito!');
      } else {
        // CREATE new book
        const bookRes = await api.post('/books', bookPayload);

        // 2. If there's a comment, create the first review automatically
        if (formData.initialReview.trim()) {
          await api.post(`/books/${bookRes.data._id}/reviews`, {
            rating: formData.initialRating,
            comment: formData.initialReview
          });
        }
        alert('¡Libro y reseña inicial guardados con éxito!');
      }

      setFormData({ 
        title: '', 
        author: '', 
        description: '', 
        category: [], 
        image: '', 
        newCategoryName: '',
        initialRating: 5,
        initialReview: ''
      });
      setShowForm(false);
      setEditingId(null);
      setCurrentPage(1);
      fetchBooks(1, searchTerm);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      category: book.categories?.map(c => c._id || c) || [],
      image: book.image || '',
      newCategoryName: '',
      initialRating: 5,
      initialReview: ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Catálogo de Libros</h1>
        {user && (
          <button onClick={() => {
            if (showForm) {
              setEditingId(null);
              setFormData({ title: '', author: '', description: '', category: [], image: '', newCategoryName: '', initialRating: 5, initialReview: '' });
            }
            setShowForm(!showForm);
          }} className="btn-primary">
            <Plus size={20} /> {showForm ? 'Cancelar' : 'Nuevo Libro'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <h3>{editingId ? 'Editar Libro' : 'Añadir Nuevo Libro'}</h3>
          <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Título</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej: El Aleph" />
            </div>
            <div className="form-group">
              <label>Autor</label>
              <input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Ej: Jorge Luis Borges" />
            </div>
            <div className="form-group">
              <label>Géneros (Mantén Ctrl/Cmd para elegir varios)</label>
              <select 
                multiple 
                required 
                style={{ height: 'auto', minHeight: '120px' }}
                value={formData.category} 
                onChange={e => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({...formData, category: values});
                }}
              >
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                <option value="NEW_CATEGORY" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Nuevo Género...</option>
              </select>
            </div>
            
            {formData.category.includes('NEW_CATEGORY') && (
              <div className="form-group fade-in">
                <label>Nombre del nuevo género</label>
                <input 
                  type="text" 
                  required 
                  value={formData.newCategoryName} 
                  onChange={e => setFormData({...formData, newCategoryName: e.target.value})} 
                  placeholder="Ej: Realismo Mágico"
                  autoFocus
                />
              </div>
            )}

            <div className="form-group">
              <label>URL Imagen (Opcional)</label>
              <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
            </div>

            {!editingId && (
              <>
                <div className="form-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ color: 'var(--primary)', fontWeight: 'bold' }}>⭐ Tu Reseña inicial (Opcional)</label>
                </div>

                <div className="form-group">
                  <label>Tu Calificación</label>
                  <select 
                    value={formData.initialRating} 
                    onChange={e => setFormData({...formData, initialRating: e.target.value})}
                  >
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tu Comentario</label>
                  <input 
                    type="text" 
                    value={formData.initialReview} 
                    onChange={e => setFormData({...formData, initialReview: e.target.value})} 
                    placeholder="¿Qué te pareció?"
                  />
                </div>
              </>
            )}

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Sinopsis</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Escribe una breve descripción"></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              {editingId ? 'Actualizar Libro' : 'Guardar Libro y Reseña'}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Buscar por título, autor o crítico..." 
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text)', 
            width: '100%', 
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando Libros...</div>
      ) : (
        <>
          <div className="grid grid-3">
            {books.map(book => (
              <div key={book._id} className="glass-card fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '200px', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {book.image ? (
                    <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <BookIcon size={64} color="var(--border)" />
                  )}
                </div>
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{book.title}</h3>
                    {user && (user._id === book.user?._id || user._id === book.user) && (
                      <button onClick={() => handleEdit(book)} style={{ color: 'var(--primary)', background: 'transparent', padding: '4px' }} title="Editar libro">
                        <Edit size={18} />
                      </button>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Por: {book.author}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {book.categories?.map(cat => (
                      <span key={cat._id} style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <Link to={`/books/${book._id}`} className="btn-outline" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {books.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No se encontraron libros que coincidan con tu búsqueda.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem', marginBottom: '1rem' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem' }}
              >
                Anterior
              </button>
              
              <span style={{ color: 'var(--text-muted)' }}>
                Página <strong>{currentPage}</strong> de {pagination.totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))} 
                disabled={currentPage === pagination.totalPages}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem' }}
              >
                Siguiente
              </button>
            </div>
          )}
          
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Total: {pagination.total} libros
          </div>
        </>
      )}
    </div>
  );
};

export default Books;
