<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function goTo(path: string) {
  router.push(path)
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="user-info">
        <span class="avatar">✂️</span>
        <span class="welcome-text">Bienvenue, Joueur !</span>
      </div>
      <button @click="handleLogout" class="paper-btn logout-btn">Déconnexion</button>
    </header>

    <main class="menu-content">
      <h1 class="game-title">Chifoumi Microservices 🪨📜✂️</h1>
      
      <div class="cards-grid">
        <!-- Carte Jouer -->
        <div class="menu-card play-card" @click="goTo('/game')">
          <div class="card-icon">🎮</div>
          <h2>Lancer une Partie</h2>
          <p>Affronte un autre joueur en temps réel !</p>
        </div>

        <!-- Carte Boutique -->
        <div class="menu-card shop-card" @click="goTo('/shop')">
          <div class="card-icon">🛒</div>
          <h2>Boutique & Skins</h2>
          <p>Achète des skins ou recharge tes pièces !</p>
        </div>

        <!-- Carte Profil -->
        <div class="menu-card profile-card" @click="goTo('/profile')">
          <div class="card-icon">👤</div>
          <h2>Mon Profil</h2>
          <p>Consulte tes statistiques, victoires et skins !</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  font-weight: bold;
  background: white;
  padding: 0.5rem 1rem;
  border: 3px solid #2c3e50;
  border-radius: 50px;
  box-shadow: 3px 3px 0px #2c3e50;
}

.game-title {
  text-align: center;
  font-size: 3rem;
  color: #ff5964;
  text-shadow: 3px 3px 0px #2c3e50;
  margin: 3rem 0;
}

.cards-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.menu-card {
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 16px;
  padding: 2rem;
  width: 260px;
  text-align: center;
  cursor: pointer;
  box-shadow: 6px 6px 0px #2c3e50;
  transition: transform 0.2s;
}

.play-card {
  transform: rotate(-2deg);
  background: #e7f5ff;
}

.shop-card {
  transform: rotate(1.5deg);
  background: #fff9db;
}

.profile-card {
  transform: rotate(-1.5deg);
  background: #e6fcf5;
}

.menu-card:hover {
  transform: scale(1.05) rotate(0deg);
}

.card-icon {
  font-size: 3.5rem;
  margin-bottom: 0.8rem;
}

.paper-btn {
  font-family: inherit;
  font-weight: bold;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2c3e50;
}

.logout-btn {
  background: #ff5964;
  color: white;
}
</style>