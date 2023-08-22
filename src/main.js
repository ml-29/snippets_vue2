import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueCookies from 'vue-cookies'
import VueRouter from 'vue-router'

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
Vue.use(VueRouter)

const pinia = createPinia()

Axios.defaults.baseURL = 'http://localhost:3000';

Vue.prototype.$http = Axios;

import LoginPage from './components/LoginPage.vue'
import NotFoundPage from './components/NotFoundPage.vue'
import HomePage from './components/HomePage.vue'

import { useAccountStore } from '@/stores/account.js'

const routes = [
	{
		path: '/',
		name: 'home',
		meta: {
			requiresAuth: true
		},
		component: HomePage,
		beforeEnter: async (to, from, next) => {
			var accountStore = useAccountStore();
			var isAuth = await accountStore.isAuthenticated();
			if(!isAuth) {
				next({name : 'login'});
			} else {
				next(); // go to wherever I'm going
			}
		}
	},
  { name: 'login', path: '/login', component: LoginPage,
			beforeEnter: async(to, from, next) => {
				var accountStore = useAccountStore();
				var isAuth = await accountStore.isAuthenticated();
				if(isAuth) {
					next({name : 'home'});
				}else{
					next();
				}
			}
  },
  { name: 'logout', path: '/logout',
			beforeEnter: async(to, from, next) => {
				var accountStore = useAccountStore();
				var logout = await accountStore.logout();
				if(logout){
					next({name: 'login'});
				}else{
					next(from);
				}
			}
  },
  { name: 'github-callback', path: '/github-callback',
			beforeEnter: async(to, from, next) => {
				var accountStore = useAccountStore();
				var isAuth = await accountStore.loginWithGithub(to.query.code, to.query.state);
				if(isAuth){
					next({name: 'home'});
				}else{
					next({name : 'login'});
				}
			}
		
  },
  
  { name: 'not-found', path: '/not-found', component: NotFoundPage },
  { path: '*', redirect: '/not-found'}
]

const router = new VueRouter({
	mode: 'history',
  routes
});

new Vue({
	el: '#app',
	pinia,
	router,
	render: h => h(App)
});