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

		// tagStore.fetchTags();
		// languageStore.fetchLanguages();
		return {
			snippetStore,
			tagStore,
			languageStore
		};
	},
	data() {
		return {}
	},
	methods: {
		refresh(){
			this.snippetStore.fetchSnippets();
			this.tagStore.fetchTags();
			this.languageStore.fetchLanguages();
		},
		displayAllSnippets(){
			this.snippetStore.fetchSnippets();
		},
		filterByStarred(){
			this.snippetStore.filterSnippetsByStarred();
		},
		filterByUnlabeled(){
			this.snippetStore.filterSnippetsByUnlabeled();
		},
		filterByTag(tag){
			this.snippetStore.filterSnippetsByTag(tag);
		},
		filterByLanguage(language){
			this.snippetStore.filterSnippetsByLanguage(language);
		}
	},
	components: {
		SnippetCreateEditForm
	}
}
</script>

<template>
	<div class="flex-shrink-0 p-3 bg-white" style="width: 280px;">
		<div class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
			<span class="fs-5 fw-semibold">Personnal Library</span>
			<button @click="refresh">Refresh</button>
			<b-button v-b-modal.modal-scrollable.modal-xl.modal-create-form>New snippet</b-button>
			<SnippetCreateEditForm id="modal-create-form"/>
		</div>
		<ul class="list-unstyled ps-0">
			<li class="mb-1">
				<button class="btn align-items-center rounded" @click="displayAllSnippets">
					All snippets
					<b-badge pill variant="primary" class="rounded-pill">{{ snippetStore.getNbSnippets }}</b-badge>
				</button>
			</li>
			<li class="mb-1">
				<button class="btn align-items-center rounded" @click="filterByStarred">
					Starred
					<b-badge pill variant="primary" class="rounded-pill">{{ snippetStore.getNbStarred }}</b-badge>
				</button>
			</li>
			<li class="mb-1">
				<button class="btn align-items-center rounded" @click="filterByUnlabeled">
					Unlabeled
					<b-badge pill variant="primary" class="rounded-pill">{{ snippetStore.getNbUnlabeled }}</b-badge>
				</button>
			</li>
			<li class="mb-1">
				<b-button v-b-toggle.collapse-tag class="btn-toggle">Tags</b-button>
				<b-collapse id="collapse-tag" visible class="mt-2">
					<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
						<li v-for="tag in tagStore.tags" :key="tag.id">
							<a href="#" class="link-dark rounded" @click="filterByTag(tag.name)">
								{{tag.name}}
							</a>
							<b-badge pill variant="primary" class="rounded-pill">{{ tag.nbSnippets }}</b-badge>
						</li>
					</ul>
				</b-collapse>
			</li>
			<li class="mb-1">
				<b-button v-b-toggle.collapse-language class="btn-toggle">Languages</b-button>
				<b-collapse id="collapse-language" visible class="mt-2">
					<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
						<li v-for="language in languageStore.languages" :key="language.id">
							<a href="#" class="link-dark rounded" @click="filterByLanguage(language.name)">
								{{language.name}}
							</a>
							<b-badge pill variant="primary" class="rounded-pill">{{ language.nbSnippets }}</b-badge>
						</li>
					</ul>
				</b-collapse>
			</li>
		</ul>
	</div>
</template>
