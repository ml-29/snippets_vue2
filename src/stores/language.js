import { defineStore } from 'pinia'
import { useMessageStore } from '@/stores/message.js'
import Vue from 'vue'

export const useLanguageStore = defineStore('language', {
	state: () => {
		return {
			languages : [],
			messageStore : useMessageStore()
		}
	},
	actions: {
		async fetchLanguages() {
			try{
				var response = await Vue.prototype.$http
				.get('/languages');
				this.languages = response.data;
				this.messageStore.debug('Languages have been fetched');
			}catch{
				this.messageStore.debug('Unable to fetch languages');
				return false;
			}
		},
		resetLanguages(){
			this.languages = [];
			this.messageStore.debug('Languages have been reset');
		}
	}
})
