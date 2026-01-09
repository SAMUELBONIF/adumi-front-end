
import axios from 'axios';
import { API_URL } from '../config';  // importa a URL do config.js

const api = axios.create({
  baseURL: API_URL
});

export default api;
