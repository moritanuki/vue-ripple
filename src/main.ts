import { createApp } from 'vue'
import router from '@/router.ts'
import App from './App.vue'
import './assets/index.css'

const app = createApp(App)
app.use(router).mount('#app')
