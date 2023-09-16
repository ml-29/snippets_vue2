import { defineStore } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import cryptoRandomString from 'crypto-random-string'
import Vue from 'vue'

export const useAccountStore = defineStore('account', {
	state: () => {
		return {
			user: {},
			loggedIn: false,
			globalStore: useGlobalStore(),
			// githubState: Vue.prototype.$cookies.get("state") || null,
			githubClientId: process.env.VUE_APP_GITHUB_CLIENT_ID,
			githubRedirectURI: process.env.VUE_APP_GITHUB_REDIRECT_URI,
			// token: Vue.prototype.$cookies.get("token") || sessionStorage.getItem("token") || null
		}
	},
	actions: {
		//sets token as default param for all axios requests + saves it as a cookie if requested
		propagateToken(token, rememberMe){
			Vue.prototype.$http.defaults.params = { token: token };//save for axios to use with every request
			sessionStorage.setItem("token", token);//save to session so conexion is not lost between pages
			if(rememberMe){
				Vue.prototype.$cookies.set("token", token);
			}
		},
		async fetchAccount(){
			try{
				var response = await Vue.prototype.$http.get('/user');
				this.user = response.data.user;
				this.loggedIn = true;
				return true;
			}catch{
				return false;
			}
		},
		resetAccount(){
			this.user = {};
			this.loggedIn = false;
		},
		async loginWithPassword(username, password, rememberMe){
			try {
				var response = await Vue.prototype.$http.post('/login', {
					username: username,
					password: password
				});
				this.user = response.data.user;
				this.loggedIn = true;
				this.propagateToken(response.data.token, rememberMe);
				this.globalStore.refreshAppData();
				return true;
			}catch(error){
				this.globalStore.resetAppData();
				return false;
			}
		},
		async signUpWithPassword(username, password, email, rememberMe){
			try {
				var response = await Vue.prototype.$http.post('/sign-up', {
					username: username,
					password: password,
					email: email
				});
				this.user = response.data.user;
				this.loggedIn = true;
				this.propagateToken(response.data.token, rememberMe);
				this.globalStore.refreshAppData();
				return true;
			}catch(error){
				this.globalStore.resetAppData();
				return false;
			}
		},
		async logout(){
			try{
				var response = await Vue.prototype.$http.post('/logout/' + this.user.id);
				
				//remove token from everywhere
				Vue.prototype.$http.defaults.params = { token: undefined };
				sessionStorage.removeItem("token");
				Vue.prototype.$cookies.remove("token");
				
				this.globalStore.resetAppData();
				return true;
			}catch{
				return false;
			}
		},
		async loginWithGithub(code, state) {
			if(code && state && this.githubState === state){
				try{
					Vue.prototype.$cookies.remove("state");
					
					var response = await Vue.prototype.$http.post('/github-login', { code : code });
					this.propagateToken(response.data.token, true);

					this.globalStore.refreshAppData();
					return true;
				}catch{
					this.globalStore.resetAppData();
					return false;
				}
			}else{
				return false;
			}
		},
		async isAuthenticated(){
			//quick fix: token computed here instead of using a getter because getter is not always up to date, reason unknown
			var token = Vue.prototype.$cookies.get("token") || sessionStorage.getItem("token") || null;
			if(token){
				this.propagateToken(token, false);
				var res = await this.fetchAccount();
				return res;
			}
			return false;
		}
	},
	getters: {
		githubState: (state) => {
			if(!Vue.prototype.$cookies.get("state")){//if cookie does not exist, set it
				Vue.prototype.$cookies.set("state", cryptoRandomString({length: 40}));
			}
			return Vue.prototype.$cookies.get("state");
		},
		username: (state) => (user) => {
			return user.username || user.githubProfile.login;
		},
		initials: (state) => (user) => {
			var names = user.username.split(' '), initials = names[0].substring(0, 1).toUpperCase();
			
			if (names.length > 1) {
				initials += names[names.length - 1].substring(0, 1).toUpperCase();
			}
			return initials;
		},
		avatarUrl: (state) => (user) => {
			return user.avatar || user?.githubProfile?.avatar_url || 'https://placehold.co/300/300';
		}
	}
})
