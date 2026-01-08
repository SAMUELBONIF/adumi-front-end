<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'

const itens = ref([])
const vendas = ref([])
const produtos = ref([])

const venda = ref('')
const produto = ref('')
const quantidade = ref(1)
const preco_unitario = ref(0)
const subtotal = ref(0)
const editando = ref(null)
const mensagem = ref('')

// Carregar itens, vendas e produtos
const carregarItens = async () => {
  try {
    const res = await api.get('itenvenda/')
    itens.value = res.data
  } catch (error) {
    console.error('Erro ao carregar itens:', error)
    mensagem.value = 'Erro ao carregar itens'
  }
}

const carregarVendas = async () => {
  try {
    const res = await api.get('venda/')
    vendas.value = res.data
  } catch (error) {
    console.error('Erro ao carregar vendas:', error)
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

// Atualiza preço_unitario e subtotal automaticamente ao mudar produto ou quantidade
watch([produto, quantidade], () => {
  const p = produtos.value.find(pr => pr.id === produto.value)
  if (p) {
    preco_unitario.value = p.preco
    subtotal.value = (p.preco * quantidade.value).toFixed(2)
  } else {
    preco_unitario.value = 0
    subtotal.value = 0
  }
})

const salvarItem = async () => {
  // 1. Validação inicial usando .value
  if (!venda.value || !produto.value || quantidade.value <= 0) {
    mensagem.value = 'Preencha todos os campos corretamente!'
    return
  }

  try {
    // 2. Montagem do objeto JSON "limpo" (sem referências circulares do Vue)
    // O Django espera IDs para chaves estrangeiras (venda e produto)
    const dados = {
      venda: venda.value,
      produto: produto.value,
      quantidade: Number(quantidade.value),
      preco_unitario: parseFloat(preco_unitario.value),
      subtotal: parseFloat(subtotal.value)
    }

    // 3. Verificação de modo Edição ou Criação
    if (editando.value) {
      await api.put(`itenvenda/${editando.value}/`, dados)
      mensagem.value = 'Item atualizado com sucesso!'
    } else {
      await api.post('itenvenda/', dados)
      mensagem.value = 'Item adicionado com sucesso!'
    }

    // 4. Sucesso: limpa o formulário e recarrega a lista
    limpar()
    carregarItens()
    
  } catch (error) {
    // 5. Tratamento de erro detalhado
    if (error.response && error.response.data) {
      console.error('Erro de validação do Django:', error.response.data)
      mensagem.value = 'Erro nos dados: ' + JSON.stringify(error.response.data)
    } else {
      console.error('Erro ao salvar item:', error)
      mensagem.value = 'Erro ao salvar item no servidor'
    }
  }
}

const editarItem = (i) => {
  editando.value = i.id
  venda.value = i.venda
  produto.value = i.produto
  quantidade.value = i.quantidade
  preco_unitario.value = i.preco_unitario
  subtotal.value = i.subtotal
}

const excluirItem = async (id) => {
  if (!confirm('Deseja realmente excluir este item?')) return
  try {
    await api.delete(`itenvenda/${id}/`)
    mensagem.value = 'Item excluído com sucesso!'
    carregarItens()
  } catch (error) {
    console.error('Erro ao excluir item:', error)
    mensagem.value = 'Erro ao excluir item'
  }
}

const limpar = () => {
  venda.value = ''
  produto.value = ''
  quantidade.value = 1
  preco_unitario.value = 0
  subtotal.value = 0
  editando.value = null
  mensagem.value = ''
}

onMounted(() => {
  carregarItens()
  carregarVendas()
  carregarProdutos()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Itens da Venda</h2>

    <!-- Mensagem de feedback -->
    <div v-if="mensagem" class="mb-4 p-2 bg-green-100 text-green-800 rounded">
      {{ mensagem }}
    </div>

    <!-- Formulário de item -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-gray-600 mb-1">Venda</label>
          <select v-model="venda" class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>Selecione uma venda</option>
            <option v-for="v in vendas" :key="v.id" :value="v.id">Venda #{{ v.id }} - {{ v.cliente_nome }}</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-600 mb-1">Produto</label>
          <select v-model="produto" class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>Selecione um produto</option>
            <option v-for="p in produtos" :key="p.id" :value="p.id">{{ p.nome }} - {{ p.preco }}</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-600 mb-1">Quantidade</label>
          <input
            type="number"
            v-model="quantidade"
            min="1"
            class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-600 mb-1">Preço Unitário</label>
          <input type="text" v-model="preco_unitario" readonly class="border rounded px-3 py-2 w-full bg-gray-100 text-gray-700" />
        </div>

        <div>
          <label class="block text-gray-600 mb-1">Subtotal</label>
          <input type="text" v-model="subtotal" readonly class="border rounded px-3 py-2 w-full bg-gray-100 text-gray-700" />
        </div>
      </div>

      <div class="mt-4">
        <button @click="salvarItem" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
          {{ editando ? 'Atualizar' : 'Adicionar Item' }}
        </button>
        <button @click="limpar" class="ml-2 bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition">
          Limpar
        </button>
      </div>
    </div>

    <!-- Lista de itens -->
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Venda</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Produto</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantidade</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Preço Unitário</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="i in itens" :key="i.id">
            <td class="px-4 py-2">{{ i.id }}</td>
            <td>Venda #{{ i.venda_info.id }} - {{ i.venda_info.cliente }}</td>
             <td>{{ i.produto_info.nome }}</td>
            <td class="px-4 py-2">{{ i.quantidade }}</td>
            <td class="px-4 py-2">{{ i.preco_unitario }}</td>
            <td class="px-4 py-2">{{ i.subtotal }}</td>
            <td class="px-4 py-2 space-x-2">
              <button @click="editarItem(i)" class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition">Editar</button>
              <button @click="excluirItem(i.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Excluir</button>
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
