import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, User, Calendar, Tag, Book as BookIcon } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="container">Cargando...</div>;
  if (!book) return <div className="container">Libro no encontrado.</div>;

  return (
    <div className="fade-in">
      <button onClick={() => navigate(-1)} className="btn-outline" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {book.image ? (
            <img src={book.image} alt={book.title} style={{ width: '100%', display: 'block' }} />
          ) : (
            <div style={{ height: '400px', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookIcon size={120} color="var(--border)" />
            </div>
          )}
        </div>

        <div className="glass-card">
          <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
            {book.category?.name}
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{book.title}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{book.description || 'Sin descripción disponible.'}</p>
          
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <User size={20} />
              <span>Autor: <strong>{book.author}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Tag size={20} />
              <span>Subido por: {book.user?.name || 'Usuario desconocido'}</span>
            </div>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
            {user && (user._id === book.user?._id || user._id === book.user) && (
              <>
                <button className="btn-primary" style={{ padding: '12px 24px' }}>Editar Libro</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
