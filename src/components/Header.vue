<script setup lang="ts">
import router from '@/router';

</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo / Nome do sistema -->
      <div class="logo">
        <span>ADUMI</span>
      </div>

      <!-- Navegação -->
      <nav class="nav">
        <router-link to="/dashboard">Início</router-link>
        <router-link to="/clientes">Clientes</router-link>
        <router-link to="/produtos">Produtos</router-link>
        <router-link to="/vendas">Vendas</router-link>
        <router-link to="/itens-venda">Itens da Venda</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #1773f5ff;
  padding: 14px 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo span {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav a {
  color: #e5e7eb;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 2px;
  transition: color 0.2s ease;
}

.nav a:hover {
  color: #ffffff;
}

.nav a.router-link-active {
  color: #ffffff;
  border-bottom: 2px solid #ffffff;
}
</style>
