<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useShopStore, type Item } from '@/stores/shop'

const shopStore = useShopStore()
const isModalOpen = ref(false)
const selectedAmount = ref(100)
const notification = ref('')

onMounted(() => {
  shopStore.fetchShopItems()
})

async function handleBuy(item: Item) {
  try {
    await shopStore.buyItem(item)
    showNotification(`Bravo ! Tu as débloqué : ${item.name}`)
  } catch (err: any) {
    showNotification(err.message || 'Erreur lors de l\'achat')
  }
}

async function handleRecharge() {
  await shopStore.addCoins(selectedAmount.value)
  showNotification(`+${selectedAmount.value} pièces ajoutées à ton compte !`)
  isModalOpen.value = false
}

function showNotification(msg: string) {
  notification.value = msg
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}
</script>

<template>
  <div class="shop-wrapper">
    <!-- Banner Notification -->
    <div v-if="notification" class="notification-banner">
      {{ notification }}
    </div>

    <!-- En-tête de la Boutique -->
    <header class="shop-header">
      <div class="header-left">
        <button @click="$router.push('/home')" class="paper-btn back-btn">
          ⬅️ Retour Menu
        </button>
        <h1 class="shop-title">Boutique Snipperclips ✂️</h1>
      </div>
      <div class="coins-badge" @click="isModalOpen = true">
        <span class="coin-icon">🪙</span>
        <span class="coin-count">{{ shopStore.coins }} pièces</span>
        <button class="add-btn">+</button>
      </div>
    </header>

    <!-- Grille des articles -->
    <main class="items-grid">
      <div
        v-for="item in shopStore.items"
        :key="item.id"
        class="paper-item-card"
        :class="{ owned: item.owned, p2w: item.type === 'p2w_well' }"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <h2 class="item-name">{{ item.name }}</h2>
        <p class="item-desc">{{ item.description }}</p>

        <div class="item-footer">
          <span class="item-price">{{ item.price }} 🪙</span>
          <button
            v-if="!item.owned"
            @click="handleBuy(item)"
            :disabled="shopStore.coins < item.price"
            class="paper-buy-btn"
          >
            Acheter
          </button>
          <span v-else class="owned-tag">Possédé ✅</span>
        </div>
      </div>
    </main>

    <!-- Modal de Paiement / Recharge de pièces -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="paper-modal">
        <h2>Recharger des Pièces 🪙</h2>
        <p>Sélectionne le montant à ajouter à ta bourse :</p>
        
        <div class="amount-options">
          <button 
            v-for="amount in [100, 500, 1000]" 
            :key="amount"
            :class="{ active: selectedAmount === amount }"
            @click="selectedAmount = amount"
            class="amount-btn"
          >
            {{ amount }} 🪙
          </button>
        </div>

        <div class="modal-actions">
          <button @click="handleRecharge" class="paper-buy-btn">Payer (Simulation)</button>
          <button @click="isModalOpen = false" class="paper-cancel-btn">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-wrapper {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f1ea;
  background-image: radial-gradient(#d3cbbd 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.notification-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ffe74c;
  border: 3px solid #2c3e50;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 4px 4px 0px #2c3e50;
  font-weight: bold;
  z-index: 100;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.shop-title {
  font-size: 2.5rem;
  color: #ff5964;
  text-shadow: 2px 2px 0px #2c3e50;
}

.coins-badge {
  background: #ffffff;
  border: 3px solid #2c3e50;
  border-radius: 50px;
  padding: 0.5rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 4px 4px 0px #2c3e50;
  transition: transform 0.1s;
}

.coins-badge:hover {
  transform: scale(1.05);
}

.coin-count {
  font-weight: bold;
  font-size: 1.1rem;
}

.add-btn {
  background: #35a7ff;
  color: white;
  border: 2px solid #2c3e50;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-weight: bold;
  cursor: pointer;
}

/* Grille des cartes */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.paper-item-card {
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0px #2c3e50;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: rotate(-1deg);
  transition: transform 0.2s;
}

.paper-item-card:nth-child(even) {
  transform: rotate(1.5deg);
}

.paper-item-card:hover {
  transform: rotate(0deg) scale(1.02);
}

.paper-item-card.p2w {
  background: #fffbe6;
  border-color: #ff5964;
}

.item-icon {
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.item-name {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.item-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-weight: bold;
  font-size: 1.2rem;
}

.paper-buy-btn {
  background: #35a7ff;
  color: white;
  border: 3px solid #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2c3e50;
}

.paper-buy-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.owned-tag {
  color: #38b000;
  font-weight: bold;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.paper-modal {
  background: white;
  border: 4px solid #2c3e50;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 8px 8px 0px #2c3e50;
  text-align: center;
}

.amount-options {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.amount-btn {
  padding: 0.75rem 1.2rem;
  border: 3px solid #2c3e50;
  background: #fff;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.amount-btn.active {
  background: #ffe74c;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.paper-cancel-btn {
  background: #ff5964;
  color: white;
  border: 3px solid #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

/* Alignement du bloc de gauche (Bouton + Titre) */
.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Base des boutons style papier */
.paper-btn {
  font-family: inherit;
  font-weight: bold;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2c3e50;
  transition: transform 0.1s, box-shadow 0.1s;
}

.paper-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #2c3e50;
}

/* Style spécifique du bouton retour */
.back-btn {
  background-color: #ffffff;
  color: #2c3e50;
  font-size: 1rem;
}

.back-btn:hover {
  background-color: #f0f0f0;
}
</style>