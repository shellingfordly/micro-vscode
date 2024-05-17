import { createApp } from 'vue'
import './styles.less'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'uno.css'
import 'virtual:unocss-devtools'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
