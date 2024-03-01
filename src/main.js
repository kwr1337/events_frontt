import {createApp} from 'vue'
import App from './App.vue'
import components from '@/components/UI';
import router from './router'
import store from './store'
import { createManager } from '@vue-youtube/core';
import "bootstrap/dist/css/bootstrap.min.css"

const app = createApp(App)

components.forEach(component => {
    app.component(component.name, component)
})


app
    .use(store)
    .use(router)
    .use(createManager())
    .mount('#app')
import "bootstrap/dist/js/bootstrap.js"