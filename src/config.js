// src/config.js

// 1. Tenta pegar do Vercel (VITE_API_URL)
// 2. Se falhar, usa o link do Render diretamente para não cair no 127.0.0.1
export const API_URL = import.meta.env.VITE_API_URL || 'https://adumi-backend.onrender.com';

console.log("Conectando em:", API_URL); // Isso vai nos mostrar no console do navegador qual URL ele pegou
