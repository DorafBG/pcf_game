import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import GameView from '../views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView,},
    { path: '/home', name: 'home', component: HomeView},
    { path: '/shop', name: 'shop', component: ShopView},
    { path: '/game', name: 'game', component: GameView }
  ]
})

export default router
