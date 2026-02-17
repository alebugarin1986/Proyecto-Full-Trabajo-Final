import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Layers, AlertCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, description });
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear categoría');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('No se puede eliminar la categoría si tiene libros asociados');
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestionar Categorías</h1>
      
      <div className="glass-card" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <h3>Nueva Categoría</h3>
        {error && <p style={{ color: 'var(--error)', margin: '1rem 0' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end', marginTop: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Nombre</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Ficción" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Descripción</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve detalle..." />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '45px' }}>
            <Plus size={20} /> Añadir
          </button>
        </form>
      </div>

      <div className="grid">
        {categories.map(cat => (
          <div key={cat._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px' }}>
                <Layers color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{cat.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cat.description || 'Sin descripción'}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(cat._id)} className="btn-outline" style={{ color: 'var(--secondary)', padding: '8px' }}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No hay categorías creadas.
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
