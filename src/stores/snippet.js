import { defineStore } from 'pinia'
import { useMessageStore } from '@/stores/message.js'
import Vue from 'vue'

export const useSnippetStore = defineStore('snippet', {
	state: () => ({
		snippets : [],
		list : [],//what's left of the snippet list once filtered by search, can be sorted with the getters
		selectedSnippet: null,
		messageStore: useMessageStore()
	}),
	getters: {
		getSnippetPublicLink: (state) => {
			if(state.selectedSnippet){
				return process.env.VUE_APP_URL + '/public/snippet/' + state.selectedSnippet.id;
			}
			return '';
		},
		getSnippetRelativePublicLink: (state) => {
			if(state.selectedSnippet){
				return '/public/snippet/' + state.selectedSnippet.id;
			}
			return '';
		},
		getFilteredAndSortedList: (state) => {
			//TODO
		},
		sortListByRecentlyCreated: (state) => {
			var l = state.list;
			l = l.sort(function(a,b){
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
			state.selectedSnippet = l[0];
			return l;
		},
		sortListByLastUpdated: (state) => {
			var l = state.list;
			l = l.sort(function(a,b){
				return new Date(b.updatedAt) - new Date(a.updatedAt);
			});
			state.selectedSnippet = l[0];
			return l;
		},
		sortListByTitle: (state) => {
			var l = state.list;
			l = l.sort(function(a, b){
				return a.title.localeCompare(b.title);
			});
			state.selectedSnippet = l[0];
			return l;
		},
		getNbSnippets: (state) => {
			return state.snippets.length;
		},
		getNbStarred: (state) => {
			var starredSnippets = state.snippets.filter((s) => s.starred);
			return starredSnippets.length;
		},
		getNbUnlabeled: (state) => {
			var unlabeledSnippets = state.snippets.filter((s) => s.tags.length == 0);
			return unlabeledSnippets.length;
		}
	},
	actions: {
		async fetchSnippets() {
			try{
				var response = await Vue.prototype.$http.get('/snippets');
				this.snippets = response.data;
				this.list = response.data;
				this.messageStore.debug('Snippets have been fetched');
				return true;
			}catch{
				this.messageStore.debug('Unable to fetch snippets');
				return false;
			}
		},
		async fetchSnippet(id) {
			try{
				var response = await Vue.prototype.$http.get('/snippet/' + id);
				this.messageStore.debug('Snippet has been fetched');
				return response.data;
			}catch{
				this.messageStore.debug('Unable to fetch snippet');
				return false;
			}
		},
		async createOrUpdateSnippet(snippet){
			try{
				if(snippet.id){
					await Vue.prototype.$http.put('/snippet', snippet);
				}else{
					await Vue.prototype.$http.post('/snippet', snippet);
				}
				this.fetchSnippets();
				this.messageStore.debug('Snippet has been created or updated');
				return true;
			}catch{
				this.messageStore.debug('Unable to update or create snippet');
				return false;
			}
		},
		async deleteSnippet(id){
			try{
				await Vue.prototype.$http.delete('/snippet/' + id);
				this.fetchSnippets();
				this.selectedSnippet = null;
				this.messageStore.debug('Snippet has been deleted');
				return true;
			}catch{
				this.messageStore.debug('Unable to delete snippet');
				return false;
			}
		},
		async toggleStarred(snippet){
			var s = snippet;
			s.starred = !snippet.starred;
			try{
				await this.createOrUpdateSnippet(s);
				this.messageStore.debug('Snippet has been starred');
				return true
			}catch{
				this.messageStore.debug('Unble to star snippet');
				return false;
			}
		},
		async togglePrivate(snippet){
			var s = snippet;
			s.private = !snippet.private;
			try{
				await this.createOrUpdateSnippet(s);
				this.messageStore.debug('Snippet privacy mode has been toggled');
				return true
			}catch{
				this.messageStore.debug('Unable to toggle snippet privacy mode');
				return false;
			}
		},
		resetSnippets(){
			this.snippets = [];
			this.list = [];
			this.selectedSnippet = null;
			this.messageStore.debug('Snippets have been reset');
		},
		searchSnippets(s){
			this.list = this.snippets;
			this.list = this.list.filter((snippet) =>
				snippet.title.toLowerCase().includes(s.toLowerCase())
			);
		},
		filterSnippetsByTag(tag){
			// this.list = this.filteredByTag(tagName);
			const tn = tag.name;
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.tags.some((tag) => {
					return tag.name.toLowerCase().includes(tn.toLowerCase());
				});
			});
		},
		filterSnippetsByLanguage(language){
			// this.list = this.filteredByLanguage(languageName);
			const ln = language.name;
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.parts.some((part) => {
					return part.Language.name.toLowerCase().includes(ln.toLowerCase());
				});
			});
		},
		filterSnippetsByUnlabeled(){
			// this.list = this.fileteredByUnlabeled();
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.tags.length == 0;
			});
		},
		filterSnippetsByStarred(){
			// this.list = this.filteredByStarred();
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.starred;
			});
		}
	}
})
