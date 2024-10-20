import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/password-reset/', { email });
      setSuccess('Instrucciones para restablecer su contraseña enviadas a su correo electrónico.');
      setError('');
    } catch (err) {
      console.error('Password reset error:', err.response?.data);
      setError(err.response?.data?.error || 'No se pudieron enviar las instrucciones de reinicio. Inténtelo nuevamente');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Haz olvidado tu contraseña</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Restablecer contraseña</button>
              </form>
              <div className="mt-3 text-center">
                <Link to="/login">Volver al inicio de sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;