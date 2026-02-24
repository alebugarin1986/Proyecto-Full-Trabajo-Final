import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, User, Calendar, Tag, Book as BookIcon, Trash2 } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/books/${id}/reviews`)
        ]);
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Debes iniciar sesión para dejar una reseña');
    
    setSubmitting(true);
    try {
      const { data } = await api.post(`/books/${id}/reviews`, reviewForm);
      setReviews([data, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      alert('Reseña añadida con éxito');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;
    
    try {
      await api.delete(`/books/${id}/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar la reseña');
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Cargando detalles...</div>;
  if (!book) return <div className="container" style={{ marginTop: '2rem' }}>Libro no encontrado.</div>;

  return (
    <div className="fade-in">
      <button onClick={() => navigate(-1)} className="btn-outline" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start', gap: '2rem' }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {book.categories?.map(cat => (
              <span key={cat._id} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {cat.name}
              </span>
            ))}
          </div>
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
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '3rem' }}>
        {/* Review Form */}
        <div className="glass-card">
          <h3>Deja tu reseña</h3>
          {!user ? (
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              <Link to="/login" style={{ color: 'var(--primary)' }}>Inicia sesión</Link> para calificar este libro.
            </p>
          ) : (
            <form onSubmit={handleReviewSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Calificación</label>
                <select 
                  value={reviewForm.rating} 
                  onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                  className="input"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                  <option value="4">⭐⭐⭐⭐ (Muy bueno)</option>
                  <option value="3">⭐⭐⭐ (Bueno)</option>
                  <option value="2">⭐⭐ (Regular)</option>
                  <option value="1">⭐ (Malo)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Comentario</label>
                <textarea 
                  required
                  rows="4" 
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="¿Qué te pareció este libro?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Publicar Reseña'}
              </button>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div className="glass-card">
          <h3>Reseñas de la comunidad</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Aún no hay reseñas para este libro. ¡Sé el primero en opinar!</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{review.user?.name}</span>
                    <span style={{ color: 'var(--primary)' }}>{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>{review.comment}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                    {user && (user._id === review.user?._id || user.id === review.user?._id) && (
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                        title="Eliminar reseña"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
