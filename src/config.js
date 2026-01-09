// src/config.js

// Forçamos a barra final e o caminho ADUMI/api
const base = import.meta.env.VITE_API_URL || 'https://adumi-backend.onrender.com/ADUMI/api';

// Esta lógica garante que sempre teremos a barra final correta para o Axios
export const API_URL = base.endsWith('/') ? base : `${base}/`;

console.log("URL Base definitiva do Axios:", API_URL);
