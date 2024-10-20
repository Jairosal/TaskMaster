import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axiosConfig';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Usuario es requerido'),
  password: Yup.string().required('Contraseña es requerida'),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">TaskMaster</h2>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={async (values, { setSubmitting, setErrors, setStatus }) => {
                  try {
                    const response = await axios.post('api/token/', values);
                    if (response.data.access && response.data.user) {
                      login(response.data.user, response.data.access);
                      navigate('/dashboard');
                    } else {
                      setStatus("Inicio de sesión exitoso pero se recibieron datos inesperados. Por favor, inténtelo nuevamente.");
                    }
                  } catch (error) {
                    console.error('Login error:', error.response?.data);
                    if (error.response?.status === 401) {
                      setErrors({ api: 'Usuario o contraseña inválidos' });
                    } else {
                      setStatus("Ocurrió un error. Por favor, inténtelo más tarde.");
                    }
                  }
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, status, errors }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Usuario</label>
                      <Field type="text" name="username" className="form-control" />
                      <ErrorMessage name="username" component="div" className="text-danger" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Contraseña</label>
                      <Field type="password" name="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                      {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                    {errors.api && <div className="alert alert-danger mt-2">{errors.api}</div>}
                    {status && <div className="alert alert-danger mt-2">{status}</div>}
                  </Form>
                )}
              </Formik>
              <div className="mt-3 text-center">
                <Link to="/forgot-password">¿Has olvidado tu contraseña?</Link>
              </div>
              <div className="mt-2 text-center">
                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;