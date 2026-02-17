import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Plus, Book as BookIcon, Trash2, Edit, Search } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', description: '', category: '', image: '', newCategoryName: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, catsRes] = await Promise.all([
        api.get('/books'),
        api.get('/categories')
      ]);
      setBooks(booksRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let categoryId = formData.category;

      // Si seleccionó "Nueva Categoría", primero la creamos
      if (categoryId === 'NEW_CATEGORY') {
        if (!formData.newCategoryName.trim()) {
           alert('Por favor ingrese el nombre de la nueva categoría');
           return;
        }
        const catRes = await api.post('/categories', { name: formData.newCategoryName });
        categoryId = catRes.data._id;
      }

      await api.post('/books', {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: categoryId,
        image: formData.image
      });

      setFormData({ title: '', author: '', description: '', category: '', image: '', newCategoryName: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Error al guardar el libro');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Cargando Libros...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Catálogo de Libros</h1>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} /> {showForm ? 'Cancelar' : 'Nuevo Libro'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <h3>Añadir Nuevo Libro</h3>
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
              <label>Categoría</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                <option value="NEW_CATEGORY" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Nueva Categoría...</option>
              </select>
            </div>
            
            {formData.category === 'NEW_CATEGORY' && (
              <div className="form-group fade-in">
                <label>Nombre de la nueva categoría</label>
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
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Escribe una breve reseña..."></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Guardar Libro</button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Buscar por título o autor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="grid grid-3">
        {books
          .filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(book => (
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
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{book.category?.name}</span>
                {user && (user._id === book.user?._id || user._id === book.user) && (
                  <button onClick={() => handleDelete(book._id)} style={{ color: 'var(--secondary)', background: 'transparent', padding: '4px' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h3 style={{ margin: '0.5rem 0' }}>{book.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Por: {book.author}</p>
              <Link to={`/books/${book._id}`} className="btn-outline" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
        {books.filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No se encontraron libros que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
