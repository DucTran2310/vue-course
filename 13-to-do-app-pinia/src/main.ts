import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { vClickOutside } from './directives/vClickOutside'
import { vFocus } from './directives/vFocus'
import { router } from './routes'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('focus', vFocus)
app.directive('click-outside', vClickOutside)

app.mount('#app')
