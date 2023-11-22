import { defineStore } from 'pinia'
import { useSnippetStore } from '@/stores/snippet.js'
import { useAccountStore } from '@/stores/account.js'
import { useLanguageStore } from '@/stores/language.js'
import { useTagStore } from '@/stores/tag.js'
import { useMessageStore } from '@/stores/message.js'

export const useGlobalStore = defineStore('global', {
	state: () => {
		return {
			snippetStore: useSnippetStore(),
			tagStore: useTagStore(),
			languageStore: useLanguageStore(),
			accountStore: useAccountStore(),
			messageStore: useMessageStore()
		}
	},
	actions: {
		resetAppData(){
			this.snippetStore.resetSnippets();
			this.tagStore.resetTags();
			this.languageStore.resetLanguages();
			this.accountStore.resetAccount();
			this.messageStore.debug('App data has been reset');
			
		},
		async refreshAppData(){
			await this.snippetStore.fetchSnippets();
			await this.tagStore.fetchTags();
			await this.languageStore.fetchLanguages();
			await this.accountStore.fetchAccount();
			this.messageStore.debug('App data has been reset');
		}
	}
})

