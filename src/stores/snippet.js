import { defineStore } from 'pinia'
// import axios from 'axios'
import Vue from 'vue'

export const useSnippetStore = defineStore('snippet', {
	state: () => ({
		snippets : [],
		list : [],//what's left of the snippet list once filtered by search, can be sorted with the getters
		selectedSnippet: null
	}),
	getters: {
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
		// filteredByTag(tagName){
		// 	// const tn = tagName;
		// 	// var list = this.snippets;
		// 	// list = list.filter((snippet) => {
		// 	// 	console.log(tagName);
		// 	// 	return snippet.tags.some((tag) => {
		// 	// 		return tag.name.toLowerCase().includes(tagName.toLowerCase());
		// 	// 	});
		// 	// });
		// 	// // list = list.filter((snippet) => {
		// 	// // 	return snippet.tags.some((tag) => {
		// 	// // 		return tag.name.toLowerCase().includes(tn.toLowerCase());
		// 	// // 	});
		// 	// // });
		// 	// return list;
		// 	return this.snippets;
		// },
		// filteredByLanguage(languageName){
		// 	// const ln = languageName;
		// 	// // const list = this.snippets;
		// 	// var list = this.snippets.filter((snippet) => {
		// 	// 	return snippet.parts.some((part) => {
		// 	// 		return part.Language.name.toLowerCase().includes(ln.toLowerCase());
		// 	// 	});
		// 	// });
		// 	// return list;
		// 	return this.snippets;
		// },
		// filteredByUnlabeled(){
		// 	// // const list = this.snippets;
		// 	// var list = this.snippets.filter((snippet) => {
		// 	// 	return snippet.tags.length == 0;
		// 	// });
		// 	// return list;
		// 	return this.snippets;
		// },
		// filteredByStarred(){
		// 	// // const list = this.snippets;
		// 	// var list = this.snippets.filter((snippet) => {
		// 	// 	return snippet.starred;
		// 	// });
		// 	// return list;
		// 	return this.snippets;
		// }
	},
	actions: {
		async fetchSnippets() {
			try{
				var response = await Vue.prototype.$http.get('/snippets');
				this.snippets = response.data;
				this.list = response.data;
				return true;
			}catch{
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
				return true;
			}catch{
				return false;
			}
		},
		async deleteSnippet(id){
			try{
				await Vue.prototype.$http.delete('/snippet/' + id);
				this.fetchSnippets();
				this.selectedSnippet = null;
				return true;
			}catch{
				return false;
			}
		},
		resetSnippets(){
			this.snippets = [];
			this.list = [];
			this.selectedSnippet = null;
		},
		searchSnippets(s){
			this.list = this.snippets;
			this.list = this.list.filter((snippet) =>
				snippet.title.toLowerCase().includes(s.toLowerCase())
			);
		},
		filterByTag(tagName){
			// this.list = this.filteredByTag(tagName);
			const tn = tagName;
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.tags.some((tag) => {
					return tag.name.toLowerCase().includes(tn.toLowerCase());
				});
			});
		},
		filterByLanguage(languageName){
			// this.list = this.filteredByLanguage(languageName);
			const ln = languageName;
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.parts.some((part) => {
					return part.Language.name.toLowerCase().includes(ln.toLowerCase());
				});
			});
		},
		filterByUnlabeled(){
			// this.list = this.fileteredByUnlabeled();
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.tags.length == 0;
			});
		},
		filterByStarred(){
			// this.list = this.filteredByStarred();
			this.list = this.snippets;
			this.list = this.list.filter((snippet) => {
				return snippet.starred;
			});
		}
	}
})
