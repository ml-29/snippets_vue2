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

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(PiniaVuePlugin)
Vue.use(VueCookies, { expires: 60 * 5})
Vue.use(VueRouter)

const pinia = createPinia()

Axios.defaults.baseURL = 'http://localhost:3000';

Vue.prototype.$http = Axios;

import moment from 'moment';

Vue.filter('completeDateHour', function(value) {
	if(value) {
		return moment(String(value)).format('M/D/YY, h:mm A');
	}
});

Vue.filter('miniDateTimeAgo', function(value) {
	if(value) {
		var nbSeconds = moment(new Date()).diff(moment(String(value)), 'seconds');
		var nbMinutes = moment(new Date()).diff(moment(String(value)), 'minutes');
		var nbHours = moment(new Date()).diff(moment(String(value)), 'hours');
		var nbDays = moment(new Date()).diff(moment(String(value)), 'days');
		var nbYears = moment(new Date()).diff(moment(String(value)), 'years');
	
		if(nbDays < 1){
			if(nbMinutes < 1){//less than a minute ago, return <1m
				return '<1m';
			}else if(nbHours < 1){//less than an hour ago, return nb of minutes
				return nbMinutes + 'm';
			}else{//more than an hour, return nb of hours
				return nbHours + 'h';
			}
		}else if(nbYears < 1){//less than a year ago, return month/day
			return moment(String(value)).format('M/D');
		}//more than a year ago, return nb years
		return nbYears + 'y';
	}
});

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)

import LoginPage from './components/LoginPage.vue'
import NotFoundPage from './components/NotFoundPage.vue'
import HomePage from './components/HomePage.vue'
import PublicSnippet from './components/PublicSnippet.vue'

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
	{ name: 'public', path: '/public/snippet/:id', component: PublicSnippet },
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