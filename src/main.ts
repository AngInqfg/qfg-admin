import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router/index'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
