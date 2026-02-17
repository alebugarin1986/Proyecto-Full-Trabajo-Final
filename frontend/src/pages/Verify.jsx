import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/users/verify/${token}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="fade-in" style={{ maxWidth: '500px', margin: '6rem auto', textAlign: 'center' }}>
      <div className="glass-card">
        {status === 'loading' && (
          <>
            <Loader2 size={64} className="animate-spin" color="var(--primary)" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
            <h2>Verificando tu cuenta...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
            <h2>¡Cuenta Verificada!</h2>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
              Tu email ha sido verificado con éxito. Ya puedes iniciar sesión.
            </p>
            <Link to="/login" className="btn-primary">Ir al Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={64} color="var(--error)" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
            <h2>Enlace Inválido</h2>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
              El código de verificación no es válido o ha expirado.
            </p>
            <Link to="/register" className="btn-outline">Intentar de nuevo</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
