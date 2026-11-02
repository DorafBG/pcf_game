import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import GameView from '../views/GameView.vue'
import ProfileView from '../views/ProfileView.vue'
import MatchmakingView from '../views/MatchmakingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView,},
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/home', name: 'home', component: HomeView},
    { path: '/shop', name: 'shop', component: ShopView},
    { path: '/game', name: 'game', component: GameView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/matchmaking', name: 'matchmaking', component: MatchmakingView }
  ]
})

export default router
