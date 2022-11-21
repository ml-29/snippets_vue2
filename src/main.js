import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import App from '@/App.vue'

import './assets/main.scss'
import './assets/sidenavs.css'
import './assets/sidebars.js'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(PiniaVuePlugin)

const pinia = createPinia()

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
    render: h => h(App),
});
