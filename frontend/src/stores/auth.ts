import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials)
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  }
})