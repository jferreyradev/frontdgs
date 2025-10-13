import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { usePeriodoStore } from '@/stores/periodo.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Inicializar el período activo automáticamente al cargar la app
const periodoStore = usePeriodoStore()
periodoStore.inicializarPeriodoActivo()

app.mount('#app')
