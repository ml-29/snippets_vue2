import { defineStore } from 'pinia'
// import axios from 'axios'
import Vue from 'vue'

export const useLanguageStore = defineStore('language', {
	state: () => {
		return {
			languages : []
		}
	},
	actions: {
		async fetchLanguages() {
			try{
				var response = await Vue.prototype.$http
				.get('/languages');
				this.languages = response.data;
			}catch{
				return false;
			}
		},
		resetLanguages(){
			this.languages = [];
		}
	}
})
