import { defineStore } from 'pinia'
import axios from 'axios'

export const useLanguageStore = defineStore('language', {
	state: () => {
		return {
			languages : []
		}
	},
	actions: {
		async fetchLanguages() {
			axios
				.get('http://localhost:3000/languages')
				.then((response) => {
					this.languages = response.data;
				})
		}
	}
})
