import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

function PasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await axios.post(`/api/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: password
      });
      setMessage(response.data.message);
      setIsResetSuccessful(true);
      // Redirección automática después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Ocurrió un error');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reestablecer contraseña</h2>
      {!isResetSuccessful ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Restablecer contraseña</button>
        </form>
      ) : (
        <div>
          <p>Tu contraseña ha sido restablecida con éxito. Serás redirigido a la página de inicio de sesión en 3 segundos.</p>
          <Link to="/login" className="btn btn-primary">Ir a inicio de sesión ahora</Link>
        </div>
      )}
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
}

export default PasswordReset;