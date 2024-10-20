import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetchUser(token);
        } catch (error) {
          console.error('Error verifying token:', error);
          logoutUser();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('/api/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const idleLogout = () => {
    if (user) {
      toast.warn('Su sesión está a punto de expirar por inactividad. ¿Desea continuar?', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClick: () => {
          toast.dismiss();
        },
      });

      setTimeout(() => {
        if (user) {
          logoutUser();
          toast.info('Su sesión ha expirado por inactividad.', {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }, 5000);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout: logoutUser, idleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);