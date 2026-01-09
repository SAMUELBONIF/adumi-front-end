import axios from 'axios';

// ESQUEÇA O CONFIG.JS POR UM MOMENTO. 
// Vamos escrever a URL completa aqui para forçar o Vite a gerar um novo arquivo.
const api = axios.create({
  baseURL: 'https://adumi-backend.onrender.com/ADUMI/api/'
});

// Adicione este console.log com um texto diferente, como "VERSAO_NOVA_FORÇADA"
console.log("VERSAO_NOVA_FORÇADA: Conectando em /ADUMI/api/");

export default api;
