import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Clientes.vue'
import Produtos from '../views/Produtos.vue'
import Vendas from '../views/Vendas.vue'
import ItemVenda from '../views/ItemVenda.vue'

const routes = [
  { path: '/', redirect: '/clientes' },
  { path: '/clientes', component: Clientes },
  { path: '/produtos', component: Produtos },
  { path: '/vendas', component: Vendas },
  { path: '/itens-venda', component: ItemVenda },
  { path: '/dashboard', component: Dashboard }  
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
