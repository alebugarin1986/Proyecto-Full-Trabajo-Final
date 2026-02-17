import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Book, LogIn, LogOut, UserPlus, Layers } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-card" style={{ borderRadius: 0, margin: 0, padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)' }}>
          <Book size={32} />
          <span>Bookstore</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/books" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>Libros</Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.name}</span>
                <button onClick={logout} className="btn-outline" style={{ color: 'var(--secondary)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                  <LogOut size={18} />
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LogIn size={20} />
                Login
              </Link>
              <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserPlus size={20} />
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
