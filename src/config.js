// src/config.js

// 1. Tenta ler VITE_API_URL do Vercel
// 2. Se não encontrar, usa o link do Render diretamente
export const API_URL = import.meta.env.VITE_API_URL || 'https://adumi-backend.onrender.com';

console.log("Conectando na API em:", API_URL);
