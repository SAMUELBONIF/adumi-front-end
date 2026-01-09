// src/config.js

// 1. Pegamos o que vem do Vercel
const rawUrl = import.meta.env.VITE_API_URL || '';

// 2. Se a URL não contiver o sufixo necessário, nós adicionamos manualmente
// Isso é uma proteção caso a variável do Vercel venha errada
export const API_URL = rawUrl.includes('/ADUMI/api') 
  ? rawUrl 
  : 'https://adumi-backend.onrender.com/ADUMI/api/';

console.log("URL Final que o Axios vai usar:", API_URL);
