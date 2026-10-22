<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { useShopStore } from '@/stores/shop'

const router = useRouter()
const shopStore = useShopStore()

const userStats = ref({
  username: 'Joueur',
  email: 'joueur@mail.com',
  wins: 12,
  losses: 5,
  draws: 2
})

onMounted(async () => {
  try {
    const response = await api.get('/auth/me')
    userStats.value = response.data
  } catch (error) {
    console.warn('Impossible de récupérer le profil réel, mode démo activé.')
  }
})
</script>

<template>
  <div class="profile-container">
    <header class="profile-header">
      <button @click="router.push('/home')" class="paper-btn back-btn">⬅️ Menu Principal</button>
      <h1>Profil du Joueur 👤</h1>
    </header>

    <main class="profile-content">
      <!-- Carte des infos et statistiques -->
      <div class="paper-card info-card">
        <div class="avatar">✂️</div>
        <h2>{{ userStats.username }}</h2>
        <p class="email-text">{{ userStats.email }}</p>

        <div class="stats-grid">
          <div class="stat-box win">
            <span class="stat-num">{{ userStats.wins }}</span>
            <span class="stat-label">Victoires 🏆</span>
          </div>
          <div class="stat-box loss">
            <span class="stat-num">{{ userStats.losses }}</span>
            <span class="stat-label">Défaites 💥</span>
          </div>
          <div class="stat-box draw">
            <span class="stat-num">{{ userStats.draws }}</span>
            <span class="stat-label">Égalités 🤝</span>
          </div>
        </div>
      </div>

      <!-- Carte du solde & skins débloqués -->
      <div class="paper-card inventory-card">
        <h2>Inventaire & Pièces 🪙</h2>
        <div class="coins-display">
          <span>Solde actuel :</span>
          <strong>{{ shopStore.coins }} 🪙</strong>
        </div>

        <h3>Skins débloqués :</h3>
        <div class="owned-items-list">
          <div
            v-for="item in shopStore.items.filter(i => i.owned)"
            :key="item.id"
            class="item-badge"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </div>
          <p v-if="!shopStore.items.some(i => i.owned)" class="empty-text">
            Aucun skin débloqué pour le moment. Va voir la boutique ! 🛒
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #ff5964;
  text-shadow: 2px 2px 0px #2c3e50;
}

.profile-content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.paper-card {
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 6px 6px 0px #2c3e50;
  flex: 1;
  min-width: 300px;
}

.info-card {
  text-align: center;
  transform: rotate(-1deg);
}

.inventory-card {
  transform: rotate(1deg);
}

.avatar {
  font-size: 4rem;
  background: #ffe74c;
  width: 90px;
  height: 90px;
  line-height: 90px;
  border-radius: 50%;
  border: 3px solid #2c3e50;
  margin: 0 auto 1rem;
}

.email-text {
  color: #666;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  border: 3px solid #2c3e50;
  border-radius: 10px;
  width: 80px;
}

.stat-box.win { background: #d4edda; }
.stat-box.loss { background: #f8d7da; }
.stat-box.draw { background: #fff3cd; }

.stat-num {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.8rem;
}

.coins-display {
  font-size: 1.3rem;
  margin: 1rem 0;
  background: #fff9db;
  padding: 0.8rem;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
}

.owned-items-list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.item-badge {
  background: #f0f0f0;
  border: 2px solid #2c3e50;
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}

.empty-text {
  color: #888;
  font-style: italic;
}

.paper-btn {
  font-family: inherit;
  font-weight: bold;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2c3e50;
  background: white;
}
</style>