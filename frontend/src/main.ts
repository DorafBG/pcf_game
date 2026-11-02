import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. On importe Pinia
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // 2. On l'active dans Vue
app.use(router)

app.mount('#app')