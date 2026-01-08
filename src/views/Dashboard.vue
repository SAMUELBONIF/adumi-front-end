<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js'

import api from '../services/api'

const totalClientes = ref(0)
const totalProdutos = ref(0)
const totalVendas = ref(0)
const erro = ref('')

const carregarDados = async () => {
  try {
    const [clientesRes, produtosRes, vendasRes] = await Promise.all([
      api.get('cliente/'),
      api.get('produto/'),
      api.get('venda/')
    ])

    // 1. Dados dos Cards
    totalClientes.value = clientesRes.data.length
    totalProdutos.value = produtosRes.data.length
    totalVendas.value = vendasRes.data.length

    // 2. Processar dados para o Gráfico
    // Criamos um array com 12 posições zeradas (uma para cada mês)
    const vendasPorMes = new Array(12).fill(0);

    vendasRes.data.forEach(venda => {
      // Ajuste 'venda.data' para o nome correto do campo de data do seu modelo Django
      const data = new Date(venda.data_venda); 
      const mes = data.getMonth(); // Retorna 0 para Janeiro, 1 para Fevereiro...
      
      // Se você quiser contar a quantidade de vendas:
      vendasPorMes[mes] += 1;
      
      // OU, se quiser somar o valor total das vendas:
      // vendasPorMes[mes] += parseFloat(venda.valor_total);
    });

    // 3. Atualizar o gráfico de forma reativa
    chartData.value = {
      ...chartData.value,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: vendasPorMes
        }
      ]
    };

  } catch (e) {
    console.error("Erro detalhado:", e)
    erro.value = 'Erro ao carregar dados do dashboard'
  }
}


// 1. Registrar os componentes do Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// 2. Dados reativos (ChartData precisa seguir a estrutura de objetos do Chart.js)
const chartData = ref({
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets: [
    {
      label: 'Vendas Mensais',
      backgroundColor: '#3b82f6',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Vendas Mensais' }
  },
  scales: {
    y: { beginAtZero: true }
  }
})



onMounted(() => {
  carregarDados()
  
})
</script>

<template>
  <div class="dashboard">
    <h1 class="title">Dashboard</h1>

    <div v-if="erro" class="erro">
      {{ erro }}
    </div>

    <!-- Cards -->
    <div class="cards">
    <div id="clientes" class="card">
  <div class="card-content">
    <div class="icon-box clients-icon">
      <i class="fas fa-users"></i>
    </div>
    <div class="text-box">
      <h2>Clientes</h2>
      <p class="number">{{ totalClientes }}</p>
    </div>
  </div>
</div>  



     <div id="produtos" class="card">
  <div class="card-content">
    <div class="icon-box">
      <i class="fas fa-box"></i> 
    </div>
    <div class="text-box">
      <h2>Produtos</h2>
      <p class="number">{{ totalProdutos }}</p>
    </div>
  </div>
</div>

     <div id="vendas" class="card">
  <div class="card-content">
    <div class="icon-box sales-icon">
      <i class="fas fa-shopping-cart"></i>
    </div>
    <div class="text-box">
      <h2>Vendas</h2>
      <p class="number">{{ totalVendas }}</p>
    </div>
  </div>
</div>
</div>

    <!-- Gráfico de Vendas Mensais -->


<div v-if="chartData.datasets[0].data.length > 0" style="height: 400px;">
  <Bar 
    :data="chartData" 
    :options="chartOptions" 
  />
</div>
<div v-else>Carregando gráfico...</div>

    
    <div class="content">
      <p>
        Resumo geral do sistema.  
        Estes dados são carregados diretamente da API.
      </p>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
}

.title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1f2937;
}

.erro {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.card {
  background-color: #ffffff;
  border-top: 10px solid #991b1b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

#clientes {
  background-color: #ffffff;
  border-top: 10px solid #2563eb;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

#produtos {
  background-color: #ffffff;
  border-top: 10px solid #16a34a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

#vendas {
  background-color: #ffffff;
  border-top: 10px solid #d97706;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}   

.card:hover {
  transform: translateY(-4px);
}

.card h2 {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 12px;
}

.number {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

/* Conteúdo */
.content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #374151;
  font-size: 15px;
}
</style>
