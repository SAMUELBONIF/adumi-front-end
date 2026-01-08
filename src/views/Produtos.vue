<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const produtos = ref([])
const nome = ref('')
const estoque = ref('')
const descricao = ref('')
const preco = ref('')
const editando = ref(null)
const mensagem = ref('')

const carregarProdutos = async () => {
  try {
    const res = await api.get('produto/')
    produtos.value = res.data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    mensagem.value = 'Erro ao carregar produtos'
  }
}

const salvarProduto = async () => {
  if (!nome.value || !descricao.value || !preco.value || !estoque.value) {
    mensagem.value = 'Preencha todos os campos!'
    return
  }

  const dados = { nome: nome.value, descricao: descricao.value, preco: parseFloat(preco.value), estoque: parseInt(estoque.value) }
  try {
    if (editando.value) {
      await api.put(`produto/${editando.value}/`, dados)
      mensagem.value = 'Produto atualizado com sucesso!'
    } else {
      await api.post('produto/', dados)
      mensagem.value = 'Produto criado com sucesso!'
    }
    limpar()
    carregarProdutos()
  } catch (error) {if (error.response) {
    // Isso vai mostrar exatamente qual campo falhou (ex: { "preco": ["Este campo é obrigatório."] })
    console.error("Erro de validação do Django:", error.response.data);
  }
    console.error('Erro ao salvar produto:', error)
    mensagem.value = 'Erro ao salvar produto'
  }
}

const editarProduto = (p) => {
  editando.value = p.id
  nome.value = p.nome
  estoque.value = p.estoque
  descricao.value = p.descricao
  preco.value = p.preco
}

const excluirProduto = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return
  try {
    await api.delete(`produto/${id}/`)
    mensagem.value = 'Produto excluído com sucesso!'
    carregarProdutos()
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    mensagem.value = 'Este produto não pode ser apagado pois está associado a uma venda.'
  }
}

const limpar = () => {
  nome.value = ''
  descricao.value = ''
  estoque.value = ''
  preco.value = ''
  editando.value = null
  mensagem.value = ''
}

onMounted(carregarProdutos)
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Produtos</h2>

    <!-- Mensagem de feedback -->
    <div v-if="mensagem" class="mb-4 p-2 bg-green-100 text-green-800 rounded">
      {{ mensagem }}
    </div>

    <!-- Formulário de produto -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <label class="block text-gray-600 mb-1">Nome do produto</label>
          <input
            v-model="nome"
            type="text"
            placeholder=" Digite o nome do produto"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
            
          </label>
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Descrição</label>
          <input
            v-model="descricao"
            type="text"
            placeholder=" Digite a descrição do produto"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
            
          </label>
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Preço</label>
          <input
            v-model="preco"
            type="number"
            step="0.01"
            placeholder=" Digite o preço do produto"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
            
          </label>
        </div>
        <div class="relative">
          <label class="block text-gray-600 mb-1">Estoque</label>
          <input
            v-model="estoque"
            type="number"
            placeholder=" Digite o estoque do produto"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
            
          </label>
        </div>
      </div>

      <button
        @click="salvarProduto"
        class="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        {{ editando ? 'Atualizar' : 'Salvar' }}
      </button>
      <button
        @click="limpar"
        class="mt-4 ml-2 bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
      >
        Limpar
      </button>
    </div>

    <!-- Lista de produtos -->
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Descrição</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Preço</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Estoque</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="p in produtos" :key="p.id">
            <td class="px-4 py-2">{{ p.nome }}</td>
            <td class="px-4 py-2">{{ p.descricao }}</td>
            <td class="px-4 py-2">{{ p.preco }}</td>
            <td class="px-4 py-2">{{ p.estoque }}</td>
            <td class="px-4 py-2 space-x-2">
              <button
                @click="editarProduto(p)"
                class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Editar
              </button>
              <button
                @click="excluirProduto(p.id)"
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
