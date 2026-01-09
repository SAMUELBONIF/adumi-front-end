import axios from 'axios';

// Usamos a URL completa com o prefixo /ADUMI/api/ conforme o seu teste manual
const api = axios.create({
  baseURL: 'https://adumi-backend.onrender.com/ADUMI/api/'
});

// Este log ajudará a confirmar se o novo código foi carregado no navegador
console.log("Axios carregado com URL fixa: https://adumi-backend.onrender.com/ADUMI/api/");

export default api;
