import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/profile/');
      setUser(response.data);
    } catch (err) {
      setError('No se pudo obtener el perfil del usuario');
      console.error('Error al obtener el perfil:', err);
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/api/profile/', user);
      setSuccess('Perfil actualizado exitosamente');
      setError('');
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar perfil');
      setSuccess('');
      console.error('Error al actualizar el perfil:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Perfil de usuario</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row">
        <div className="col-md-6">
          <h2>Actualizar perfil</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">Primer nombre</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Actualizar perfil</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Seguridad</h2>
          <p>Para cambiar la contraseña, utilice la página dedicada al cambio de contraseña para mayor seguridad.</p>
          <Link to="/change-password" className="btn btn-secondary">Cambiar contraseña</Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;