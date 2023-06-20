import { defineStore } from 'pinia'
import Vue from 'vue'

export const useTagStore = defineStore('tag', {
	state: () => {
		return {
			tags : []
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
				return true;
			}catch{
				return false;
			}
		},
		resetTags(){
			this.tags = [];
		}
	}
})
