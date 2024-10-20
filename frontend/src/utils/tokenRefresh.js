import axios from './axiosConfig';

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('auth/token/refresh/', { refresh: refreshToken });
    localStorage.setItem('token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Redirigir al login si falla el refresh
    window.location = '/login';
  }
};