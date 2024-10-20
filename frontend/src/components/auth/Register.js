import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await axiosInstance.post('/api/register/', formData);
      console.log('Respuesta de registro:', response.data);
      setSuccess('Registro exitoso! Por favor inicie sesión.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Error de registro:', err.response?.data);
      if (err.response?.data) {
        const errorMessages = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('; ');
        setError(`El registro falló: ${errorMessages}`);
      } else {
        setError('El registro falló. Inténtelo nuevamente.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registrarse en TaskMaster</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password2" className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
              </form>
              <div className="mt-3 text-center">
                ¿Ya tienes una cuenta? <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;