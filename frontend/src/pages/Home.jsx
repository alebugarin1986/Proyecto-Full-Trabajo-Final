import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="fade-in">
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1>
          Descubre tu próxima <span style={{ color: 'var(--primary)' }}>Aventura</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Bookstore es la plataforma definitiva para gestionar tu catálogo personal de libros. Seguro, rápido y siempre accesible.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/books" className="btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>Ver Catálogo</Link>
          {!user && (
            <Link to="/register" className="btn-outline" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>Empezar Ahora</Link>
          )}
        </div>
      </section>

      <section className="grid grid-3" style={{ marginTop: '4rem' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h3>Gestión Completa</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Crea, edita y organiza tus libros por categorías con facilidad.</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h3>Seguridad JWT</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Tus datos están protegidos con autenticación de última generación.</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <Mail size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h3>Verificación por Email</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Aseguramos la identidad de nuestros usuarios mediante verificación real.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
