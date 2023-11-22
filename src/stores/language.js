import { defineStore } from 'pinia'
import { useMessageStore } from '@/stores/message.js'
import Vue from 'vue'

export const useLanguageStore = defineStore('language', {
	state: () => {
		return {
			languages : [],
			availableLanguages : [],
			messageStore : useMessageStore()
		}
	},
	actions: {
		async fetchLanguages() {
			try{
				var response = await Vue.prototype.$http
				.get('/used-languages');
				this.languages = response.data;
				
				var r2 = await Vue.prototype.$http
				.get('/languages');
				this.availableLanguages = r2.data;
				
				this.messageStore.debug('Languages have been fetched');
			}catch{
				this.messageStore.debug('Unable to fetch languages');
				return false;
			}
		},
		resetLanguages(){
			this.languages = [];
			this.availableLanguages = [];
			this.messageStore.debug('Languages have been reset');
		}
	}
})
