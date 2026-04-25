<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h2 class="fw-bold text-success">Product List</h2>
      <p class="text-muted">Data loaded from n8n webhook</p>
    </div>

    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Products</h5>
          <button class="btn btn-success" @click="fetchProducts">
            Reload Data
          </button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border text-success"></div>
          <p class="mt-2">Loading product data...</p>
        </div>

        <div v-else-if="products.length" class="table-responsive">
          <table class="table table-hover align-middle text-center">
            <thead class="table-success">
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

const products = ref([])
const loading = ref(false)
const errorMessage = ref('')

const normalizeProducts = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

const fetchProducts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // ตอนทดสอบใน n8n ให้เปลี่ยนเป็น `/webhook-test/products` และกด "Listen for test event"
    // หลัง Publish workflow แล้วค่อยใช้ `/webhook/products`
    const response = await fetch('http://localhost:5678/webhook/products')

    if (!response.ok) {
      throw new Error('Failed to load products')
    }

    const result = await response.json()
    products.value = normalizeProducts(result)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to load product data. Please check the n8n flow.'
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
body {
  background-color: #f8f9fa;
}
</style>
