import './assets/main.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js';

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import AnimateOnScroll from 'primevue/animateonscroll';
import Ripple from 'primevue/ripple';
import {ToastService} from "primevue";

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        option: {
            darkModeSelector: 'none',
        }
    },
    ripple: true,
})

app.use(router)

app.use(ToastService)

app.directive('ripple', Ripple);

app.directive('animateonscroll', AnimateOnScroll);

app.mount('#app')

