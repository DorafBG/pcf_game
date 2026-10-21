<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  loading.value = true

  try {
    await api.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    // Redirection vers le login après inscription réussie
    router.push('/')
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erreur lors de l\'inscription.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="paper-card">
      <h1 class="title">Rejoins l'Aventure ! ✂️</h1>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Pseudo"
            class="paper-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="exemple@mail.com"
            class="paper-input"
          />
        </div>

        <div class="form-group">
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

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" :disabled="loading" class="paper-btn submit-btn">
          {{ loading ? 'Création...' : 'Créer mon compte 🚀' }}
        </button>
      </form>

      <div class="footer-links">
        <p>Déjà un compte ? <router-link to="/">Se connecter</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.paper-card {
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 8px 8px 0px #2c3e50;
  transform: rotate(-1deg);
}

.title {
  text-align: center;
  color: #ff5964;
  text-shadow: 2px 2px 0px #2c3e50;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: bold;
  color: #2c3e50;
}

.paper-input {
  padding: 0.8rem;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
}

.paper-btn {
  font-family: inherit;
  font-weight: bold;
  font-size: 1.1rem;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  padding: 0.8rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2c3e50;
  margin-top: 0.5rem;
}

.submit-btn {
  background-color: #35a7ff;
  color: white;
}

.error-msg {
  color: #ff5964;
  font-weight: bold;
  text-align: center;
}

.footer-links {
  text-align: center;
  margin-top: 1.5rem;
  font-weight: bold;
}

.footer-links a {
  color: #ff5964;
}
</style>