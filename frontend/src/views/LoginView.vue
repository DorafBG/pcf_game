<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  try {
    errorMessage.value = ''
    isLoading.value = true
    await authStore.login({ email: email.value, password: password.value })
    // Redirection vers le dashboard après connexion
    router.push('/dashboard')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Identifiants incorrects'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <!-- Carte style papier découpé -->
    <div class="paper-card">
      <h1 class="title">PFC 2027 ✂️🪨📜</h1>
      <p class="subtitle">Connecte-toi pour entrer dans l'arène !</p>

      <form @submit.prevent="handleLogin" class="form">
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="joueur@pfc.fr"
            class="paper-input"
          />
        </div>

        <div class="field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="paper-input"
          />
        </div>

        <p v-if="errorMessage" class="error-badge">{{ errorMessage }}</p>

        <button type="submit" :disabled="isLoading" class="paper-btn">
          {{ isLoading ? 'Connexion...' : 'Jouer !' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Fond style papier / cahier d'écolier */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

/* Carte effet découpage Snipperclips */
.paper-card {
  background: #ffffff;
  border: 4px solid #2c3e50;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 8px 8px 0px #2c3e50;
  transform: rotate(-1deg);
  transition: transform 0.2s ease;
}

.paper-card:hover {
  transform: rotate(0deg);
}

.title {
  font-size: 2rem;
  color: #ff5964;
  text-align: center;
  margin-bottom: 0.2rem;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

label {
  font-weight: bold;
  color: #2c3e50;
}

.paper-input {
  padding: 0.75rem;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background-color: #fffbe6;
}

.paper-input:focus {
  border-color: #35a7ff;
}

.paper-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #ffe74c;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 4px 4px 0px #2c3e50;
  transition: all 0.1s ease;
}

.paper-btn:hover {
  background-color: #ffd000;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #2c3e50;
}

.paper-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #2c3e50;
}

.error-badge {
  background-color: #ff5964;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid #2c3e50;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 1rem;
}
</style>