<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'

const vendas = ref([])
const clientes = ref([])
const produtos = ref([])

const cliente = ref('')
const produto = ref('')
const quantidade = ref(1)
const valor_total = ref(0)
const editando = ref(null)
const mensagem = ref('')

// Carregar vendas, clientes e produtos
const carregarVendas = async () => {
  try {
    const res = await api.get('venda/')
    vendas.value = res.data
  } catch (error) {
    console.error('Erro ao carregar vendas:', error)
    mensagem.value = 'Erro ao carregar vendas'
  }
}

const carregarClientes = async () => {
  try {
    const res = await api.get('cliente/')
    clientes.value = res.data
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
  }
}

const carregarProdutos = async () => {
  try {
    const res = await api.get('produto/')
    produtos.value = res.data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
}

// Atualiza valor_total automaticamente ao mudar produto ou quantidade
watch([produto, quantidade], () => {
  const p = produtos.value.find(pr => pr.id === produto.value)
  if (p) {
    valor_total.value = (p.preco * quantidade.value).toFixed(2)
  } else {
    valor_total.value = 0
  }
})

const criarVenda = async () => {
  if (!cliente.value || !produto.value || quantidade.value <= 0) {
    mensagem.value = 'Preencha todos os campos corretamente!'
    return
  }

  try {
    const dados = {
      cliente: cliente.value,
      produto: produto.value,
      quantidade: quantidade.value,
      valortotal: valor_total.value
    }

    if (editando.value) {
      await api.put(`venda/${editando.value}/`, dados)
      mensagem.value = 'Venda atualizada com sucesso!'
    } else {
      await api.post('venda/', dados)
      mensagem.value = 'Venda criada com sucesso!'
    }

    limpar()
    carregarVendas()
  } catch (error) {
    console.error('Erro ao criar/atualizar venda:', error)
    mensagem.value = 'Erro ao salvar a venda'
  }
}

const editarVenda = (v) => {
  editando.value = v.id
  cliente.value = v.cliente
  produto.value = v.produto
  quantidade.value = v.quantidade
  valor_total.value = v.valortotal
}

const excluirVenda = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta venda?')) return
  try {
    await api.delete(`venda/${id}/`)
    mensagem.value = 'Venda excluída com sucesso!'
    carregarVendas()
  } catch (error) {
    console.error('Erro ao excluir venda:', error)
    mensagem.value = 'Erro ao excluir venda , essa venda tem itens associados.'
  }
}

const limpar = () => {
  cliente.value = ''
  produto.value = ''
  quantidade.value = 1
  valor_total.value = 0
  editando.value = null
  mensagem.value = ''
}

onMounted(() => {
  carregarVendas()
  carregarClientes()
  carregarProdutos()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Vendas</h2>

    <!-- Mensagem de feedback -->
    <div v-if="mensagem" class="mb-4 p-2 bg-green-100 text-green-800 rounded">
      {{ mensagem }}
    </div>

    <!-- Formulário de venda -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <label class="block text-gray-600 mb-1">Cliente</label>
          <select v-model="cliente" class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>Selecione um cliente</option>
            <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }}</option>
          </select>
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Produto</label>
          <select v-model="produto" class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>Selecione um produto</option>
            <option v-for="p in produtos" :key="p.id" :value="p.id">{{ p.nome }} - {{ p.preco }}</option>
          </select>
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Quantidade</label>
          <input
            type="number"
            v-model="quantidade"
            min="1"
            class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Valor Total</label>
          <input
            type="text"
            v-model="valor_total"
            readonly
            class="border rounded px-3 py-2 w-full bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      <button
        @click="criarVenda"
        class="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {{ editando ? 'Atualizar' : 'Criar Venda' }}
      </button>
      <button
        @click="limpar"
        class="mt-4 ml-2 bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
      >
        Limpar
      </button>
    </div>

    <!-- Lista de vendas -->
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Cliente</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Produto</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantidade</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Valor Total</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="v in vendas" :key="v.id">
            <td class="px-4 py-2">{{ v.id }}</td>
            <td class="px-4 py-2">{{ v.cliente_nome }}</td>
            <td class="px-4 py-2">{{ v.produto_nome }}</td>
            <td class="px-4 py-2">{{ v.quantidade }}</td>
            <td class="px-4 py-2">{{ v.valortotal }}</td>
            <td class="px-4 py-2 space-x-2">
              <button
                @click="editarVenda(v)"
                class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Editar
              </button>
              <button
                @click="excluirVenda(v.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
/* Layout geral */
.max-w-5xl {
  max-width: 1100px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.p-4 {
  padding: 16px;
}

/* Títulos */
.text-2xl {
  font-size: 24px;
}

.font-bold {
  font-weight: bold;
}

.mb-4 {
  margin-bottom: 16px;
}

.text-gray-800 {
  color: #1f2937;
}

/* Mensagem */
.bg-green-100 {
  background-color: #d1fae5;
}

.text-green-800 {
  color: #065f46;
}

.rounded {
  border-radius: 6px;
}

.p-2 {
  padding: 8px;
}

/* Cards */
.bg-white {
  background-color: #ffffff;
}

.shadow {
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

.rounded-lg {
  border-radius: 8px;
}

.mb-6 {
  margin-bottom: 24px;
}

/* Formulário */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.md\:grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.gap-4 {
  gap: 16px;
}

label {
  font-size: 14px;
  color: #374151;
}

/* Inputs */
.border {
  border: 1px solid #d1d5db;
}

.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.w-full {
  width: 100%;
}

input,
select {
  border-radius: 6px;
  font-size: 14px;
}

/* Botões */
button {
  cursor: pointer;
}

.bg-blue-500 {
  background-color: #2563eb;
  margin: 10px;
}

.bg-blue-600:hover {
  background-color: #1d4ed8;
}

.bg-gray-300 {
  background-color: #d1d5db;
}

.bg-gray-400:hover {
  background-color: #9ca3af;
}

.text-white {
  color: #ffffff;
}

.transition {
  transition: background-color 0.2s ease;
}

/* Tabela */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
    background-color:#1773f5ff;
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
    text-align: left;
    color : white;
  }

td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  
}

.space-x-2 > * + * {
  margin-left: 8px;
}

/* Ações */
.bg-yellow-400 {
  background-color: #1773f5ff;
}

.bg-yellow-500:hover {
  background-color: #1773f5ff;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-red-600:hover {
  background-color: #dc2626;
}
</style>
