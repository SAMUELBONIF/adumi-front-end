import axios from 'axios';

// Vamos colocar a URL completa diretamente aqui para ignorar erros de config
const api = axios.create({
  baseURL: 'https://adumi-backend.onrender.com/ADUMI/api/'
});

// Log para confirmar que ESTE arquivo novo foi carregado
console.log("Instância do Axios carregada com URL fixa!");

export default api;
