<script>
// import { storeToRefs } from 'pinia'

import { useTagStore } from '@/stores/tag.js'
import { useLanguageStore } from '@/stores/language.js'
// import { useSnippetStore } from '@/stores/snippet.js'

// import SnippetCreateForm from '@/components/SnippetCreateForm.vue'

// const tagStore = useTagStore();
// const languageStore = useLanguageStore();
// const snippetStore = useSnippetStore();

// const { tags } = storeToRefs(useTagStore());
// const { languages } = storeToRefs(useLanguageStore());

// tagStore.fetchTags();
// languageStore.fetchLanguages();

export default {
	setup(){
		const tagStore = useTagStore();
		const languageStore = useLanguageStore();
		// const snippetStore = useSnippetStore();

		// const { tags } = storeToRefs(useTagStore());
		// const { languages } = storeToRefs(useLanguageStore());

		tagStore.fetchTags();
		languageStore.fetchLanguages();
		return {
			tags : tagStore.tags,
			languages: languageStore.languages
		};
	},
	data() {
		return {}
	}
}
</script>

<template>
	<!-- <div>
		<div>{{tags}}</div>
		<div>{{languages}}</div>
	</div> -->

	<div class="flex-shrink-0 p-3 bg-white" style="width: 280px;">
		<div class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
			<span class="fs-5 fw-semibold">Personnal Library</span>
			<button @click="snippetStore.fetchSnippets()">Refresh</button>
			<!-- <SnippetCreateForm/> -->
		</div>
		<ul class="list-unstyled ps-0">
			<li class="mb-1">
				<button class="btn align-items-center rounded" @click="snippetStore.fetchSnippets()">
					All snippets
				</button>
			</li>
			<li class="mb-1">
				<button class="btn align-items-center rounded" @click="snippetStore.filterSnippetsByStarred()">
					Starred
				</button>
			</li>
			<li class="mb-1">
				<button class="btn align-items-center rounded" @click="snippetStore.filterSnippetsByUnlabeled()">
					Unlabeled
				</button>
			</li>
			<li class="mb-1">
				<b-button v-b-toggle.collapse-tag class="btn-toggle">Tags</b-button>
				<b-collapse id="collapse-tag" visible class="mt-2">
					<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
						<li v-for="tag in tags" :key="tag.id">
							<a href="#" class="link-dark rounded" @click="snippetStore.filterSnippetsByTag(tag.name)">{{tag.name}}</a>
						</li>
					</ul>
				</b-collapse>
			</li>
			<li class="mb-1">
				<b-button v-b-toggle.collapse-language class="btn-toggle">Languages</b-button>
				<b-collapse id="collapse-language" visible class="mt-2">
					<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
						<li v-for="language in languages" :key="language.id">
							<a href="#" class="link-dark rounded" @click="snippetStore.filterSnippetsByTag(language.name)">{{language.name}}</a>
						</li>
					</ul>
				</b-collapse>
			</li>
		</ul>
	</div>
</template>
