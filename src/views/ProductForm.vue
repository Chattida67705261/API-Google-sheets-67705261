<template>
  <div class="product-form-page container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card form-card shadow-lg border-0 rounded-4">
          <div
            class="card-header form-card-header text-center text-white rounded-top-4"
          >
            <h4 class="mb-1 fw-bold">Product Form</h4>
            <small>Submit product data to n8n webhook</small>
          </div>

          <div class="card-body p-4">
            <div
              v-if="status.message"
              :class="`alert alert-${status.type} alert-dismissible fade show`"
            >
              {{ status.message }}
              <button type="button" class="btn-close" @click="status.message = ''"></button>
            </div>

            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Product ID *</label>
                <input v-model="form.productId" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Product Name *</label>
                <input v-model="form.productName" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Quantity *</label>
                <input v-model.number="form.quantity" type="number" min="0" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Price *</label>
                <input v-model.number="form.price" type="number" min="0" class="form-control" required />
              </div>

              <button class="btn submit-button w-100 fw-bold" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Submitting...' : 'Save Product' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  productId: '',
  productName: '',
  quantity: null,
  price: null
})

const loading = ref(false)

const status = reactive({
  message: '',
  type: ''
})

const resetForm = () => {
  form.productId = ''
  form.productName = ''
  form.quantity = null
  form.price = null
}

const submitForm = async () => {
  loading.value = true
  status.message = ''

  try {
    // ตอนทดสอบใน n8n ให้เปลี่ยนเป็น `/webhook-test/product` และกด "Listen for test event"
    // หลัง Publish workflow แล้วค่อยใช้ `/webhook/product`
    const response = await fetch('http://localhost:5678/webhook/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...form
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save product')
    }

    status.message = 'Product saved successfully.'
    status.type = 'success'
    resetForm()
  } catch (error) {
    console.error(error)
    status.message = 'Unable to save product. Please check the n8n flow and try again.'
    status.type = 'danger'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.product-form-page {
  --page-bg: #f4f7fb;
  --surface: #ffffff;
  --primary: #6b8796;
  --primary-dark: #4f6774;
  --focus: rgba(107, 135, 150, 0.22);
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, var(--page-bg) 100%);
}

.form-card {
  background-color: var(--surface);
  overflow: hidden;
}

.form-card-header {
  background: linear-gradient(135deg, #8aa3b1, #6b8796);
  border-bottom: none;
}

.card {
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.form-control {
  background-color: #fbfdff;
  border-color: #d5dfe5;
}

.form-label {
  color: var(--primary-dark);
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem var(--focus);
  border-color: var(--primary);
}

.submit-button {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.submit-button:hover,
.submit-button:focus {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  color: #fff;
}

.submit-button:disabled {
  background-color: #a9bbc4;
  border-color: #a9bbc4;
}
</style>
