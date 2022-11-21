import { defineStore } from 'pinia'
import axios from 'axios'

export const useSnippetStore = defineStore('snippet', {
	state: () => ({
		selectedSnippet: null,
		snippets : [],
		list : [],//what's left of the snippet list once filtered by search, can be sorted with the getters
		errors : []
	}),
	getters: {
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
		}
	},
	actions: {
		async fetchSnippets() {
			axios
				.get('http://localhost:3000/snippets')
				.then((response) => {
					this.snippets = response.data;
					this.list = response.data;
				});
		},
		async createOrUpdateSnippet(snippet){
			try{
				if(snippet.id){
					await axios.put('http://localhost:3000/snippet', snippet);
				}else{
					await axios.post('http://localhost:3000/snippet', snippet);
				}

				this.fetchSnippets();
				// this.selectedSnippet = null;
				// this.selectedSnippet = this.list[0];
				return true;
			}catch(error){
				return false;
			}
		},
		async deleteSnippet(id){
			try{
				await axios.delete('http://localhost:3000/snippet/' + id);
				this.fetchSnippets();
				this.selectedSnippet = null;
				return true;
			}catch(error){
				return false;
			}
		},
		async searchSnippets(s){
			this.list = this.snippets;
			this.list = this.list.filter((snippet) =>
				snippet.title.toLowerCase().includes(s.toLowerCase())
			);
		},
		async filterSnippetsByTag(tagName){
			const tn = tagName;
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.tags.some((tag) => {
					return tag.name.toLowerCase().includes(tn.toLowerCase());
				});
			});
		},
		async filterSnippetsByLanguage(languageName){
			const ln = languageName;
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.parts.some((part) => {
					return part.Language.name.toLowerCase().includes(ln.toLowerCase());
				});
			});
		},
		async filterSnippetsByUnlabeled(){
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.tags.length == 0;
			});
		},
		async filterSnippetsByStarred(){
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.starred;
			});
		}
	}
})
