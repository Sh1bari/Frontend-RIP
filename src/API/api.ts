import axios from 'axios';

const baseURL = 'http://localhost:8082/api'; // Замените на свой базовый URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Другие заголовки по вашему усмотрению
  },
});

export default api;