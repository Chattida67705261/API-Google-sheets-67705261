import { createRouter, createWebHistory } from 'vue-router'
import ProductFormView from '../views/ProductForm.vue'
import ProductListView from '../views/ProductList.vue'

const routes = [
  {
    path: '/',
    redirect: '/products'
  },
  {
    path: '/products/create',
    name: 'product-form',
    component: ProductFormView
  },
  {
    path: '/products',
    name: 'product-list',
    component: ProductListView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
