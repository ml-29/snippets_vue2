import { defineStore } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useMessageStore } from '@/stores/message.js'
import cryptoRandomString from 'crypto-random-string'
import Vue from 'vue'

export const useAccountStore = defineStore('account', {
	state: () => {
		return {
			user: {},
			loggedIn: false,
			globalStore: useGlobalStore(),
			messageStore: useMessageStore(),
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
				this.messageStore.debug('Account fetched');
				return true;
			}catch(error){
				this.messageStore.debug(error);
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
				this.messageStore.debug('Logged in with password');
				return true;
			}catch(error){
				this.messageStore.debug(error);
				this.messageStore.error('Could not log in');
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
				this.messageStore.debug('Signed up with password');
				return true;
			}catch(error){
				this.messageStore.debug(error);
				this.messageStore.error('Could not sign up');
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
				this.messageStore.debug('Logged out');
				return true;
			}catch(error){
				this.messageStore.debug(error);
				this.messageStore.error('Could not log out');
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
					
					this.messageStore.debug('Logged in with Github');
					return true;
				}catch(error){
					this.messageStore.debug(error);
					this.messageStore.error('Could not log in with Github');
					this.globalStore.resetAppData();
					return false;
				}
			}else{
				this.messageStore.debug('Unable to log in with github due to bad code or unmatched state');
				return false;
			}
		},
		async isAuthenticated(){
			//quick fix: token computed here instead of using a getter because getter is not always up to date, reason unknown
			var token = Vue.prototype.$cookies.get("token") || sessionStorage.getItem("token") || null;
			if(token){
				this.propagateToken(token, false);
				var res = await this.fetchAccount();
				this.messageStore.debug('User is authenticated');
				return res;
			}
			this.messageStore.debug('User is not authenticated');
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
