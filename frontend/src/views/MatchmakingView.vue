<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { socketService } from '@/services/socket'

const router = useRouter()

const elapsedTime = ref(0)
const statusMessage = ref('Recherche d\'un adversaire...')
let timerInterval: number | null = null

onMounted(() => {
  // 1. Démarrer le compteur visuel d'attente
  timerInterval = window.setInterval(() => {
    elapsedTime.value++
  }, 1000)

  // 2. Connexion au tuyau WebSocket de la Gateway
  const socket = socketService.connect()

  // 3. Envoyer l'événement de mise en file d'attente
  socket.emit('joinQueue')

  // 4. Écouter l'événement "matchFound" émis par le backend/gateway
  socket.on('matchFound', (data: { matchId: string, opponentName: string }) => {
    statusMessage.value = `Adversaire trouvé (${data.opponentName}) ! Lancement...`
    
    setTimeout(() => {
      // Redirection vers la vue de jeu avec l'ID du match en paramètre si besoin
      router.push('/game')
    }, 1500)
  })
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)

  // Si le joueur quitte la page sans avoir trouvé de partie, on le retire de la file
  const socket = socketService.getSocket()
  if (socket) {
    socket.emit('leaveQueue')
    socket.off('matchFound')
  }
})

function cancelMatchmaking() {
  const socket = socketService.getSocket()
  if (socket) {
    socket.emit('leaveQueue')
  }
  router.push('/home')
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="matchmaking-container">
    <div class="paper-card matchmaking-box">
      <div class="loader-icon spinning">✂️</div>
      
      <h2>{{ statusMessage }}</h2>
      
      <div class="timer-badge">
        <span>Temps d'attente :</span>
        <strong>{{ formatTime(elapsedTime) }}</strong>
      </div>

      <div class="tip-box">
        <p>💡 <em>Astuce : Pierre bat Ciseaux, Ciseaux bat Feuille, Feuille bat Pierre !</em></p>
      </div>

      <button @click="cancelMatchmaking" class="paper-btn cancel-btn">
        ❌ Annuler la recherche
      </button>
    </div>
  </div>
</template>

<style scoped>
.matchmaking-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.matchmaking-box {
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 420px;
  width: 90%;
  box-shadow: 8px 8px 0px #2c3e50;
  transform: rotate(-1deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loader-icon {
  font-size: 4rem;
}

.spinning {
  display: inline-block;
  animation: spin 1.5s infinite linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.matchmaking-box h2 {
  color: #2c3e50;
  font-size: 1.5rem;
}

.timer-badge {
  background: #e7f5ff;
  border: 3px solid #2c3e50;
  border-radius: 50px;
  padding: 0.6rem 1.2rem;
  font-size: 1.1rem;
  display: flex;
  gap: 0.5rem;
  box-shadow: 3px 3px 0px #2c3e50;
}

.tip-box {
  background: #fff9db;
  border: 2px dashed #2c3e50;
  border-radius: 10px;
  padding: 0.8rem;
  font-size: 0.9rem;
  color: #2c3e50;
}

.paper-btn {
  font-family: inherit;
  font-weight: bold;
  font-size: 1rem;
  border: 3px solid #2c3e50;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  box-shadow: 4px 4px 0px #2c3e50;
}

.cancel-btn {
  background-color: #ff5964;
  color: white;
}
</style>