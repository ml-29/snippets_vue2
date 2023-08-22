import { defineStore } from 'pinia'
import { useSnippetStore } from '@/stores/snippet.js'
import { useAccountStore } from '@/stores/account.js'
import { useLanguageStore } from '@/stores/language.js'
import { useTagStore } from '@/stores/tag.js'

export const useGlobalStore = defineStore('global', {
	state: () => {
		return {
			snippetStore: useSnippetStore(),
			tagStore: useTagStore(),
			languageStore: useLanguageStore(),
			accountStore: useAccountStore()
		}
	},
	actions: {
		resetAppData(){
			this.snippetStore.resetSnippets();
			this.tagStore.resetTags();
			this.languageStore.resetLanguages();
			this.accountStore.resetAccount();
		},
		refreshAppData(){
			this.snippetStore.fetchSnippets();
			this.tagStore.fetchTags();
			this.languageStore.fetchLanguages();
			this.accountStore.fetchAccount();
		}
	}
})

