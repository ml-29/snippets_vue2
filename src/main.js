import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueCookies from 'vue-cookies'
import Axios from 'axios'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import App from '@/App.vue'

import './assets/main.scss'
import './assets/sidenavs.css'
import './assets/sidebars.js'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(PiniaVuePlugin)
Vue.use(VueCookies, { expires: 60 * 5})

const pinia = createPinia()

Axios.defaults.baseURL = 'http://localhost:3000';

Vue.prototype.$http = Axios;

Vue.directive('fragments', {
  inserted: function(el) {
    const children = Array.from(el.children)
    const parent = el.parentElement
    children.forEach((item) => { parent.appendChild(item) })
    parent.removeChild(el)
  }
});

new Vue({
  el: '#app',
  pinia,
  render: h => h(App)
});