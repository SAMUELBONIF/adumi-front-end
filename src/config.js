// src/config.js

// Adicione /ADUMI/api ao final da URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://adumi-backend.onrender.com/ADUMI/api';

console.log("Conectando na API em:", API_URL);
