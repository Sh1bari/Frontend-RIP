import axios from 'axios';
import { setApplicationId, setAuthenticated, setRole } from '../redux/authSlice.ts';
import { showErrorNotification } from '../components/global/notificationService.ts';

const baseURL = '/api/api'; // Замените на свой базовый URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Другие заголовки по вашему усмотрению
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupInterceptors = (dispatch:any) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Обработка статуса 401
        dispatch(setAuthenticated({ isAuthenticated: false, username: null }));
        localStorage.removeItem('token');
        localStorage.removeItem('applicationId');
        localStorage.removeItem('role')
        showErrorNotification('Вы не авторизированы');
        console.log('мув');
      }
      return Promise.reject(error);
    }
  );
};

export const resetToken = async (dispatch:any) => {
  const token = localStorage.getItem('token');
  const applicationId = localStorage.getItem('applicationId');
  dispatch(setApplicationId(applicationId));
  if (token) {
    try {
      const response = await api.post('/reset-token');
      dispatch(setAuthenticated({ isAuthenticated: true, username: response.data.username}));
      dispatch(setRole(response.data.role));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
    } catch (error) {
      // Обработайте ошибку, если это необходимо
      console.error('Ошибка при обновлении токена', error);
    }
  }
};

export default api;