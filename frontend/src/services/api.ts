import axios from 'axios'

// L'URL de la Gateway de Quentin (à ajuster selon le port choisi dans le groupe)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Injecte automatiquement le token dans chaque requête HTTP si le joueur est connecté
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})