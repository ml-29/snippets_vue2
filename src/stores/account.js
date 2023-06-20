import { defineStore } from 'pinia'
// import axios from 'axios'
import cryptoRandomString from 'crypto-random-string'
import Vue from 'vue'

// import { useSnippetStore } from '@/stores/snippet.js'

export const useAccountStore = defineStore('account', {
	state: () => {
		return {
			user: {},
			loggedIn: false,
			githubClientId: process.env.VUE_APP_GITHUB_CLIENT_ID,
			githubRedirectURI: process.env.VUE_APP_GITHUB_REDIRECT_URI
		}
	},
	actions: {
		async loginWithPassword(username, password){
			console.log('loginWithPassword');
			try {
				var response = await Vue.prototype.$http.post('/login', {
					username: username,
					password: password
				});
				this.user = response.data.user;
				this.loggedIn = true;
				Vue.prototype.$http.defaults.params = { token: response.data.token};
				return true;
			}catch(error){
				return false;
			}
		},
		async signUpWithPassword(username, password, email){
			console.log('signup with password');
			try {
				var response = await Vue.prototype.$http.post('/sign-up', {
					username: username,
					password: password,
					email: email
				});
				this.user = response.data.user;
				console.log(response.data.user);
				this.loggedIn = true;
				Vue.prototype.$http.defaults.params = { token: response.data.token};
				return true;
			}catch(error){
				console.log(error);
				return false;
			}
		},
		async checkGithubLogin() {
			if(this.githubCode && this.githubState && this.githubState === this.githubReceivedState){
				try{
					var response = await Vue.prototype.$http.post('/github-login', { code : this.githubCode });
					//remove github params from URL
					
					this.user = response.data.user;
					this.loggedIn = true;
					Vue.prototype.$http.defaults.params = { token: response.data.token};
					console.log('Logged in with github ! ');
					return true;
				}catch{
					return false;
				}
			}
		},
		async checkLogin(){
			//TODO
		},
		async logout(){
			try{
				console.log('logging out');
				var response = await Vue.prototype.$http.post('/logout/' + this.user.id);
				this.user = {};
				this.loggedIn = false;
				this.token = '';
				Vue.prototype.$http.defaults.params['token'] = undefined;
				return true;
			}catch{
				return false;
			}
		}
	},
	getters: {
		githubState: (state) => {
			if(!Vue.prototype.$cookies.get("state")){//if cookie does not exist, set it
				Vue.prototype.$cookies.set("state", cryptoRandomString({length: 40}))
			}
			return Vue.prototype.$cookies.get("state");
		},
		githubReceivedState: (state) => {
			var uri = window.location.search.substring(1);
			var params = new URLSearchParams(uri);
			return params.get('state');
		},
		githubCode: (state) => {
			var uri = window.location.search.substring(1);
			var params = new URLSearchParams(uri);
			return params.get('code');
		}
	}
})
