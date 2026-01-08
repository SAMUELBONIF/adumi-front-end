<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

// Dados dos cards
const totalClientes = ref(0)
const totalProdutos = ref(0)
const totalVendas = ref(0)

// Dados para o gráfico de vendas por mês
const meses = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
const vendasPorMes = ref(Array(12).fill(0))

// Carregar totais e gráfico
const carregarDashboard = async () => {
  try {
    // Clientes
    const clientesRes = await api.get('cliente/')
    totalClientes.value = clientesRes.data.length

    // Produtos
    const produtosRes = await api.get('produto/')
    totalProdutos.value = produtosRes.data.length

    // Vendas
    const vendasRes = await api.get('venda/')
    totalVendas.value = vendasRes.data.length

    // Preencher vendas por mês
    vendasPorMes.value = Array(12).fill(0)
    vendasRes.data.forEach(v => {
      const data = new Date(v.data_venda) // Assuming the API returns data_venda
      const mes = data.getMonth() // 0 a 11
      vendasPorMes.value[mes] += 1
    })
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
}

onMounted(carregarDashboard)

// Chart.js setup
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: meses.value,
  datasets: [
    {
      label: 'Vendas por mês',
      backgroundColor: '#3b82f6', // Azul
      data: vendasPorMes.value
    }
  ]
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Vendas Mensais' }
  },
  scales: {
    y: { beginAtZero: true }
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-blue-500 text-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold">Clientes</h2>
        <p class="text-3xl font-bold mt-2">{{ totalClientes }}</p>
      </div>

      <div class="bg-green-500 text-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold">Produtos</h2>
        <p class="text-3xl font-bold mt-2">{{ totalProdutos }}</p>
      </div>

      <div class="bg-yellow-500 text-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold">Vendas</h2>
        <p class="text-3xl font-bold mt-2">{{ totalVendas }}</p>
      </div>
    </div>

    <!-- Gráfico de Vendas -->
    <div class="bg-white p-6 rounded-lg shadow">
      <Bar :chart-data="{ ...chartData, datasets: [{ ...chartData.datasets[0], data: vendasPorMes }] }" :chart-options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #1f2937;
}
</style>
