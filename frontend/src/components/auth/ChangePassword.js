import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }
    try {
      await axiosInstance.put('/api/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      setSuccess('Contraseña cambiada exitosamente');
      setError('');
      setTimeout(() => navigate('/profile'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
      setSuccess('');
      console.error('Error al cambiar contraseña:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cambiar contraseña</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">Contraseña actual</label>
          <input
            type="password"
            className="form-control"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        <button type="submit" className="btn btn-primary">Cambiar contraseña</button>
      </form>
    </div>
  );
}

export default ChangePassword;