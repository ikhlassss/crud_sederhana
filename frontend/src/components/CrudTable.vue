<template>
  <div class="container py-5">
    <div class="card shadow-sm">
      <div class="card-body">
        <h3 class="card-title mb-4 text-primary">🍽️ CRUD Data Makanan</h3>

        <!-- Form Input -->
        <form @submit.prevent="submitForm" class="row g-3 align-items-center mb-4">
          <div class="col-md-8">
            <input
              v-model.trim="form.name"
              type="text"
              class="form-control"
              placeholder="Masukkan nama makanan"
              required
              autofocus
            />
          </div>

          <div class="col-md-auto">
            <button type="submit" class="btn btn-success">
              {{ form.id ? 'Simpan Perubahan' : 'Tambah Makanan' }}
            </button>
            <button v-if="form.id" type="button" @click="resetForm" class="btn btn-secondary ms-2">
              Batal
            </button>
          </div>
        </form>

        <!-- Loading Indicator -->
        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
          <span class="visually-hidden">Loading...</span>
        </div>

        <!-- Data Table -->
        <table v-else class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 10%;">ID</th>
              <th>Nama</th>
              <th style="width: 25%;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <button
                  class="btn btn-outline-warning btn-sm me-2"
                  @click="startEdit(item)"
                  aria-label="Edit data"
                >
                  ✏️ Edit
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDelete(item.id)"
                  aria-label="Hapus data"
                >
                  🗑️ Hapus
                </button>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td colspan="3" class="text-center text-muted">Belum ada data makanan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const data = ref([])
const form = ref({ name: '', id: null })
const loading = ref(false)

// Ambil semua data makanan
async function loadData() {
  loading.value = true
  try {
    data.value = await api.getAll()
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  } finally {
    loading.value = false
  }
}

// Tambah atau update data
async function submitForm() {
  if (!form.value.name) return

  try {
    if (form.value.id) {
      await api.update(form.value)
    } else {
      await api.create({ name: form.value.name })
    }
    await loadData()
    resetForm()
  } catch (error) {
    console.error('Gagal menyimpan data:', error)
  }
}

// Hapus data dengan konfirmasi
async function confirmDelete(id) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    try {
      await api.delete(id)
      await loadData()
      // Jika sedang edit data yang dihapus, reset form
      if (form.value.id === id) resetForm()
    } catch (error) {
      console.error('Gagal menghapus data:', error)
    }
  }
}

// Mulai edit data
function startEdit(item) {
  form.value = { ...item }
}

// Reset form input
function resetForm() {
  form.value = { name: '', id: null }
}

onMounted(loadData)
</script>
