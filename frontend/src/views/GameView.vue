<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État de la partie
const gameState = ref<'waiting' | 'playing' | 'result'>('waiting')
const playerChoice = ref<string | null>(null)
const opponentChoice = ref<string | null>(null)
const resultMessage = ref<string>('')
const playerScore = ref(0)
const opponentScore = ref(0)

const choices = [
  { id: 'rock', name: 'Pierre', icon: '🪨', color: '#ff5964' },
  { id: 'paper', name: 'Feuille', icon: '📜', color: '#35a7ff' },
  { id: 'scissors', name: 'Ciseaux', icon: '✂️', color: '#ffe74c' }
]

// Helper pour éviter les erreurs TypeScript "Object is possibly 'undefined'"
function getChoiceIcon(choiceId: string | null): string {
  if (!choiceId) return '❓'
  const found = choices.find(c => c.id === choiceId)
  return found ? found.icon : '❓'
}

function makeChoice(choiceId: string) {
  if (gameState.value === 'result') return
  
  playerChoice.value = choiceId
  gameState.value = 'playing'

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * choices.length)
    // Utilisation d'un fallback 'rock' ou assertion non-null pour garantir le type string
    const randomChoice = choices[randomIndex]?.id ?? 'rock'
    
    opponentChoice.value = randomChoice
    calculateResult(choiceId, randomChoice)
  }, 1200)
}

function calculateResult(player: string, opponent: string) {
  if (player === opponent) {
    resultMessage.value = 'Égalité ! 🤝'
  } else if (
    (player === 'rock' && opponent === 'scissors') ||
    (player === 'paper' && opponent === 'rock') ||
    (player === 'scissors' && opponent === 'paper')
  ) {
    resultMessage.value = 'Victoire ! 🎉 (+10 🪙)'
    playerScore.value++
  } else {
    resultMessage.value = 'Défaite ! 💥'
    opponentScore.value++
  }
  gameState.value = 'result'
}

function resetRound() {
  playerChoice.value = null
  opponentChoice.value = null
  resultMessage.value = ''
  gameState.value = 'waiting'
}
</script>

<template>
  <div class="game-wrapper">
    <!-- En-tête avec scores et retour -->
    <header class="game-header">
      <button @click="router.push('/home')" class="paper-btn back-btn">⬅️ Quitter</button>
      <div class="score-board">
        <span class="player-score">Toi: {{ playerScore }}</span>
        <span class="score-separator">-</span>
        <span class="opponent-score">Adversaire: {{ opponentScore }}</span>
      </div>
    </header>

    <!-- Arène de jeu -->
    <main class="arena">
      <!-- Zone Joueur -->
      <div class="player-zone">
        <h3>Ton Choix</h3>
        <div class="choice-display paper-card" :class="{ selected: playerChoice }">
          <span class="big-icon">{{ getChoiceIcon(playerChoice) }}</span>
        </div>
      </div>

      <!-- Zone VS / Animation -->
      <div class="versus-zone">
        <div v-if="gameState === 'playing'" class="thinking-dots">
          <span>✂️</span> Duel en cours...
        </div>
        <div v-else-if="gameState === 'result'" class="result-box">
          <h2>{{ resultMessage }}</h2>
          <button @click="resetRound" class="paper-btn play-again-btn">Rejouer 🔄</button>
        </div>
        <div v-else class="vs-badge">VS</div>
      </div>

      <!-- Zone Adversaire -->
      <div class="opponent-zone">
        <h3>Adversaire</h3>
        <div class="choice-display paper-card opponent">
          <span v-if="opponentChoice && gameState === 'result'" class="big-icon">
            {{ getChoiceIcon(opponentChoice) }}
          </span>
          <span v-else-if="gameState === 'playing'" class="big-icon spinning">🌀</span>
          <span v-else class="placeholder">❓</span>
        </div>
      </div>
    </main>

    <!-- Barre de choix des coups -->
    <footer class="controls">
      <h3>Choisis ta main :</h3>
      <div class="buttons-group">
        <button
          v-for="c in choices"
          :key="c.id"
          @click="makeChoice(c.id)"
          :disabled="gameState !== 'waiting'"
          class="choice-btn"
          :style="{ backgroundColor: c.color }"
        >
          <span class="btn-icon">{{ c.icon }}</span>
          <span class="btn-label">{{ c.name }}</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.game-wrapper {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-board {
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  box-shadow: 4px 4px 0px #2c3e50;
}

.score-separator {
  margin: 0 0.8rem;
}

/* Arène */
.arena {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
}

.player-zone, .opponent-zone {
  text-align: center;
}

.player-zone h3, .opponent-zone h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.choice-display {
  width: 140px;
  height: 140px;
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 6px 6px 0px #2c3e50;
}

.paper-card {
  transform: rotate(-3deg);
}

.paper-card.opponent {
  transform: rotate(3deg);
  background: #fff9db;
}

.big-icon {
  font-size: 4.5rem;
}

.spinning {
  display: inline-block;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.placeholder {
  font-size: 3rem;
  color: #aaa;
}

.vs-badge {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff5964;
  text-shadow: 2px 2px 0px #2c3e50;
}

.thinking-dots {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.result-box {
  text-align: center;
}

.result-box h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.8rem;
}

/* Contrôles */
.controls {
  text-align: center;
}

.buttons-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.choice-btn {
  border: 4px solid #2c3e50;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  box-shadow: 5px 5px 0px #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.1s;
}

.choice-btn:hover:not(:disabled) {
  transform: scale(1.08);
}

.choice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 2.5rem;
}

.btn-label {
  font-weight: bold;
  color: #2c3e50;
  margin-top: 0.3rem;
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

.back-btn {
  background-color: #ffffff;
}

.play-again-btn {
  background-color: #ffe74c;
}
</style>