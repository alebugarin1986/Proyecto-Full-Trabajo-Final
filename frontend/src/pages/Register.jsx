import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // null, { emailError: boolean }
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      setSuccess(response);
    } catch (err) {
      const msg = err.response?.data?.message || 
                  err.response?.data?.errors?.[0]?.msg || 
                  'Error al registrarse';
      setError(msg);
    }
  };

  if (success) {
    return (
      <div className="fade-in" style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="glass-card">
          <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
          <h2>¡Registro Exitoso!</h2>
          {success.emailError ? (
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
              El usuario fue creado, pero <span style={{ color: 'var(--error)' }}>hubo un problema al enviar el email</span> de verificación. 
              <br/><br/>
              <strong>Nota para el desarrollador:</strong> Abre la terminal de tu servidor (backend) y verás el 🔗 <strong>ENLACE DE VERIFICACIÓN</strong> impreso allí. Cópialo y pégalo en el navegador para activar tu cuenta.
            </p>
          ) : (
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
              {success.message || 'Hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada para activar tu cuenta.'}
            </p>
          )}
          <Link to="/login" className="btn-primary">Ir al Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '450px', margin: '2rem auto' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus /> Crear Cuenta
        </h2>
        
        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Nombre</label>
            <input 
              type="text" 
              {...register('name', { required: 'Nombre es requerido' })}
              placeholder="Tu nombre completo"
            />
            {errors.name && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email es requerido' })}
              placeholder="tu@email.com"
            />
            {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              {...register('password', { 
                required: 'Contraseña es requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),?":{}|<>]).*$/,
                  message: 'Debe incluir una mayúscula y un símbolo'
                }
              })}
              placeholder="••••••••"
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
                required: 'Debes confirmar tu contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden'
              })}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Registrarse
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)' }}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
