import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/main.scss'
import { setupAxios } from '@/boot/axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupAxios(app)

app.mount('#app')
