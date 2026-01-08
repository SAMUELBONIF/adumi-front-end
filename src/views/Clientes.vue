<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const clientes = ref([])
const nome = ref('')
const email = ref('')
const telefone = ref('')
const editando = ref(null)
const mensagem = ref('') // Para feedback visual

const carregarClientes = async () => {
  try {
    const res = await api.get('cliente/')
    clientes.value = res.data
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
    mensagem.value = 'Erro ao carregar clientes'
  }
}

const salvarCliente = async () => {
  if (!nome.value || !email.value || !telefone.value) {
    mensagem.value = 'Preencha todos os campos!'
    return
  }

  const dados = { nome: nome.value, email: email.value, telefone: telefone.value }

  try {
    if (editando.value) {
      await api.put(`cliente/${editando.value}/`, dados)
      mensagem.value = 'Cliente atualizado com sucesso!'
    } else {
      await api.post('cliente/', dados)
      mensagem.value = 'Cliente criado com sucesso!'
      alert('Cliente criado com sucesso!')
    }
    limpar()
    carregarClientes()
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    mensagem.value = 'Erro ao salvar cliente'
  }
}

const editarCliente = (c) => {
  editando.value = c.id
  nome.value = c.nome
  email.value = c.email
  telefone.value = c.telefone
}

const excluirCliente = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este cliente?')) return
  try {
    await api.delete(`cliente/${id}/`)
    mensagem.value = 'Cliente excluído com sucesso!'
    carregarClientes()
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
    mensagem.value = 'Erro ao excluir cliente'
  }
}

const limpar = () => {
  nome.value = ''
  email.value = ''
  telefone.value = ''
  editando.value = null
  mensagem.value = ''
}

onMounted(carregarClientes)
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Clientes</h2>

    <!-- Mensagem de feedback -->
    <div v-if="mensagem" class="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
      {{ mensagem }}
    </div>

    <!-- Formulário de cliente -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <label class="block text-gray-600 mb-1">Nome</label>
          <input
            v-model="nome"
            type="text"
            id="nome"
            placeholder="Digite o nome do cliente"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           
          <label
            
            for="nome"
            class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all"
          >
            
          </label>
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder=" Digite o email do cliente"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            for="email"
            class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all"
          >
           
          </label>
        </div>

        <div class="relative">
          <label class="block text-gray-600 mb-1">Telefone</label>
          <input
            v-model="telefone"
            type="text"
            id="telefone"
            placeholder=" Digite o telefone do cliente"
            class="peer border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            for="telefone"
            class="absolute left-3 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-blue-500 peer-focus:text-sm transition-all"
          >
            
          </label>
        </div>
      </div>

      <button
        @click="salvarCliente"
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

    <!-- Lista de clientes -->
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Telefone</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="c in clientes" :key="c.id">
            <td class="px-4 py-2">{{ c.nome }}</td>
            <td class="px-4 py-2">{{ c.email }}</td>
            <td class="px-4 py-2">{{ c.telefone }}</td>
            <td class="px-4 py-2 space-x-2">
              <button
                @click="editarCliente(c)"
                class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Editar
              </button>
              <button
                @click="excluirCliente(c.id)"
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
