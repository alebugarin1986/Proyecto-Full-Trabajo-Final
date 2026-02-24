import { useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/users/reset-password/${token}`, { password: data.password });
      setSuccess(response.data.message || 'Contraseña restablecida con éxito.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña. El token puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '450px', margin: '2rem auto' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock /> Nueva Contraseña
        </h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Ingresa tu nueva contraseña a continuación.
        </p>
        
        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--primary)', borderRadius: '8px', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            {success}
            <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Redirigiendo al login...</p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input 
                type="password" 
                {...register('password', { 
                  required: 'Contraseña es requerida',
                  minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),?":{}|<>]).*$/,
                    message: 'Debe incluir una mayúscula y un símbolo'
                  }
                })}
                placeholder="••••••••"
                disabled={loading}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Mínimo 8 caracteres, una mayúscula y un símbolo.
              </small>
              {errors.password && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input 
                type="password" 
                {...register('confirmPassword', { 
                  required: 'Debes confirmar la contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.confirmPassword && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.confirmPassword.message}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}

        {!success && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/login" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', textDecoration: 'none', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
