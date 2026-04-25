<template>
  <div class="product-list-page container py-5">
    <div class="text-center mb-4">
      <h2 class="page-title fw-bold">Product List</h2>
      <p class="text-muted">Data loaded from n8n webhook</p>
    </div>

    <div class="card list-card shadow-lg border-0 rounded-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="section-title mb-0">Products</h5>
          <button class="btn reload-button" @click="fetchProducts">
            Reload Data
          </button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border spinner-accent"></div>
          <p class="mt-2">Loading product data...</p>
        </div>

        <div v-else-if="products.length" class="table-responsive">
          <table class="table table-hover align-middle text-center product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in products" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.productId }}</td>
                <td>{{ item.productName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center text-muted py-4">
          No product data found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const N8N_BASE_URL = 'http://localhost:5678'
const PRODUCT_LIST_URL = `${N8N_BASE_URL}/webhook/products`

const products = ref([])
const loading = ref(false)
const errorMessage = ref('')

const normalizeProducts = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : []

  return [...items].reverse()
}

const fetchProducts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // ตอนทดสอบใน n8n ให้เปลี่ยนเป็น `/webhook-test/products` และกด "Listen for test event"
    // หลัง Publish workflow แล้วค่อยใช้ `/webhook/products`
    const response = await fetch(PRODUCT_LIST_URL)

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(detail || 'Failed to load products')
    }

    const result = await response.json()
    products.value = normalizeProducts(result)
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'Unable to load product data. Please check the n8n flow.'
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-list-page {
  --page-bg: #f4f7fb;
  --surface: #ffffff;
  --primary: #6b8796;
  --primary-dark: #4f6774;
  --primary-soft: #e5edf1;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, var(--page-bg) 100%);
}

.page-title,
.section-title {
  color: var(--primary-dark);
}

.list-card {
  background-color: var(--surface);
}

.reload-button {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.reload-button:hover,
.reload-button:focus {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  color: #fff;
}

.spinner-accent {
  color: var(--primary);
}

.product-table thead th {
  background-color: var(--primary-soft);
  color: var(--primary-dark);
  border-bottom: none;
}

.product-table tbody tr:hover {
  background-color: #f6fafc;
}
</style>
