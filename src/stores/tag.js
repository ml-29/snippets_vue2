import { defineStore } from 'pinia'
import axios from 'axios'

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
			axios
				.get('http://localhost:3000/tags')
				.then((response) => {
					this.tags = response.data;

				})
		}
	}
})
