import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export interface Item {
  id: string
  name: string
  type: 'skin_rock' | 'skin_paper' | 'skin_scissors' | 'p2w_well'
  price: number
  description: string
  icon: string
  owned: boolean
}

export const useShopStore = defineStore('shop', () => {
  const coins = ref<number>(100) // Solde initial pour les tests
  const items = ref<Item[]>([
    {
      id: 'rock-gold',
      name: 'Pierre Dorée',
      type: 'skin_rock',
      price: 50,
      description: 'Une pierre brillante découpée dans du papier aluminium doré !',
      icon: '🪨✨',
      owned: false
    },
    {
      id: 'paper-origami',
      name: 'Feuille Origami',
      type: 'skin_paper',
      price: 40,
      description: 'Un pliage parfait ready pour emballer les rochers.',
      icon: '📜📐',
      owned: false
    },
    {
      id: 'scissors-craft',
      name: 'Ciseaux Cranteurs',
      type: 'skin_scissors',
      price: 60,
      description: 'Découpe la feuille avec des bords en zig-zag rigolos.',
      icon: '✂️🎨',
      owned: false
    },
    {
      id: 'p2w-well',
      name: 'Le Puits (Pay-to-Win)',
      type: 'p2w_well',
      price: 150,
      description: 'Un dessin au feutre d\'un puits. Bat la Pierre et les Ciseaux !',
      icon: '🕳️✏️',
      owned: false
    }
  ])

  // Charger les données depuis le microservice Shop via la Gateway
  async function fetchShopItems() {
    try {
      const response = await api.get('/shop/items')
      items.value = response.data.items
      coins.value = response.data.coins
    } catch (error) {
      console.warn('Impossible de joindre l\'API Shop, utilisation du mode démo.')
    }
  }

  // Acheter un article
  async function buyItem(item: Item) {
    if (coins.value < item.price) {
      throw new Error('Solde de pièces insuffisant !')
    }

    try {
      await api.post('/shop/buy', { itemId: item.id })
      coins.value -= item.price
      item.owned = true
    } catch (error) {
      // Dégradation gracieuse pour le test local si le backend n'est pas prêt
      coins.value -= item.price
      item.owned = true
    }
  }

  // Recharger des pièces (Paiement)
  async function addCoins(amount: number) {
    try {
      await api.post('/shop/recharge', { amount })
      coins.value += amount
    } catch (error) {
      coins.value += amount
    }
  }

  return {
    coins,
    items,
    fetchShopItems,
    buyItem,
    addCoins
  }
})