<script>
import { useSnippetStore } from '@/stores/snippet.js'
import { useTagStore } from '@/stores/tag.js'
import { useLanguageStore } from '@/stores/language.js'
import SnippetCreateEditForm from '@/components/SnippetCreateEditForm.vue'

export default {
	setup(){
		const snippetStore = useSnippetStore();
		const tagStore = useTagStore();
		const languageStore = useLanguageStore();
		
		return {
			snippetStore,
			tagStore,
			languageStore
		};
	},
	data() {
		return {
			selectedTag: null,
			selectedLanguage: null
		}
	},
	methods: {
		refresh(){
			this.snippetStore.fetchSnippets();
			this.tagStore.fetchTags();
			this.languageStore.fetchLanguages();
			this.selectedTag = null;
			this.selectedLanguage = null;
		},
		displayAllSnippets(){
			this.selectedTag = null;
			this.selectedLanguage = null;
			this.snippetStore.fetchSnippets();
		},
		filterByStarred(){
			this.selectedTag = null;
			this.selectedLanguage = null;
			this.snippetStore.filterSnippetsByStarred();
		},
		filterByUnlabeled(){
			this.selectedTag = null;
			this.selectedLanguage = null;
			this.snippetStore.filterSnippetsByUnlabeled();
		},
		filterByTag(tag){
			this.selectedTag = tag.id;
			this.selectedLanguage = null;
			this.snippetStore.filterSnippetsByTag(tag);
		},
		filterByLanguage(language){
			this.selectedTag = null;
			this.selectedLanguage = language.id;
			this.snippetStore.filterSnippetsByLanguage(language);
		},
		languageIsSelected(language){
			return this.selectedLanguage == language.id;
		},
		tagIsSelected(tag){
			return this.selectedTag == tag.id;
		}
	},
	components: {
		SnippetCreateEditForm
	}
}
</script>

<template>
	<b-container class="p-3 bg-dark text-white" style="width: 280px; height: 100vh">
		<b-row class="mt-1 mb-3">
			<b-col>
				<span class="fs-5 fw-semibold">Personnal Library</span>
			</b-col>
			<b-col cols="2">
				<span id="refresh" @click="refresh" class="text-gray"><i class="fa-solid fa-arrow-rotate-right"></i></span>
			</b-col>
		</b-row>
		
		<b-row class="mb-3">
			<b-col>
				<b-button v-b-modal.modal-scrollable.modal-xl.modal-create-form block variant="success">New snippet</b-button>
			</b-col>
			
		</b-row>
		
		<SnippetCreateEditForm id="modal-create-form"/>
		
		<ul class="col mb-4">
			<li class="row pt-2 pb-2" @click="displayAllSnippets">
				<b-col cols="1"><i class="fa-solid fa-list"></i></b-col>
				<b-col cols="9">All snippets</b-col>
				<b-col cols="1">{{ snippetStore.getNbSnippets }}</b-col>
			</li>

			<li class="row pt-2 pb-2" @click="filterByStarred">
				<b-col cols="1"><i class="fa-solid fa-star"></i></b-col>
				<b-col cols="9">Starred</b-col>
				<b-col cols="1">{{ snippetStore.getNbStarred }}</b-col>
			</li>
			
			<li class="row pt-2 pb-2" @click="filterByUnlabeled">
				<b-col cols="1"><i class="fa-solid fa-tag"></i></b-col>
				<b-col cols="9">Unlabeled</b-col>
				<b-col cols="1">{{ snippetStore.getNbUnlabeled }}</b-col>
			</li>
		</ul>

		<div class="text-secondary uppercase mt-3">Tags</div>
		
		<ul id="tags" class="col mb-4">
			<li class="row pt-1 pb-1" v-for="tag in tagStore.tags" v-bind:class="{ selected: tagIsSelected(tag) }" :key="tag.id" @click="filterByTag(tag)">
				<b-col cols="10">{{ tag.name }}</b-col>
				<b-col cols="1">{{ tag.nbSnippets }}</b-col>
			</li>
		</ul>

		<div class="text-secondary uppercase mt-3">Languages</div>
		
		<ul id="languages" class="col">
			<li class="row pt-1 pb-1" v-for="language in languageStore.languages" v-bind:class="{ selected: languageIsSelected(language) }" :key="language.id" @click="filterByLanguage(language)">
				<b-col cols="10">{{ language.name }}</b-col>
				<b-col cols="1">{{ language.nbSnippets }}</b-col>
			</li>
		</ul>
	</b-container>
</template>
<style lang="scss" scoped>
	#refresh:hover>*{
		color: #FFF;
		cursor: pointer;
	}
	.uppercase {
		text-transform: uppercase;
	}
	ul{
		padding: 0;
	}
	ul li{
		list-style: none;
	}
	ul li:hover{
		background-color: #00141a;
		cursor: pointer;
	}
	
	.selected{
		background-color: #00141a;
		border-left: 3px solid var(--primary);
	}
</style>