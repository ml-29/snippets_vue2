import { defineStore } from 'pinia'
import { useMessageStore } from '@/stores/message.js'
import Vue from 'vue'

export const useTagStore = defineStore('tag', {
	state: () => {
		return {
			tags : [],
			messageStore: useMessageStore()
		}
	},
	getters: {
		nameOnlyTags: (state) => {
			var tags = state.tags;
			return tags.map((tag) => {
				return tag.name;
			});
		}
	},
	actions: {
		async fetchTags() {
			try{
				var response = await Vue.prototype.$http.get('/tags');
				this.tags = response.data;
				this.messageStore.debug('Tags have been fetched');
				return true;
			}catch{
				this.messageStore.debug('Unable to fetch tags');
				return false;
			}
		},
		resetTags(){
			this.tags = [];
			this.messageStore.debug('Tags have been reset');
		}
	}
})
