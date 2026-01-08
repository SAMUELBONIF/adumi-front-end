<script setup>
const ano = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <p>© {{ ano }} ADUMI Vendas. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
    background-color: #1773f5ff;
  color: white;
  padding: 16px 0;
  margin-top: 40px;
  border-top: 1px solid #e5e7eb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
  
  font-size: 13px;
}


</style>
