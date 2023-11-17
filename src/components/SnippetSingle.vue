<script>
import { storeToRefs } from 'pinia';
import { useSnippetStore } from '@/stores/snippet.js';

import SnippetCreateEditForm from '@/components/SnippetCreateEditForm.vue'
// import CodeHighlighter from '@/components/CodeHighlighter.vue'
import AceEditor from '@/components/AceEditor.vue'
import VueMarked from '@hrwg/vue-marked'

import { library } from '@fortawesome/fontawesome-svg-core'

export default {
	components : {
		SnippetCreateEditForm,
		// CodeHighlighter,
		AceEditor,
		VueMarked
	},
	setup(){
		const snippetStore = useSnippetStore();
		const { selectedSnippet } = storeToRefs(snippetStore);
		return { snippetStore, selectedSnippet };
	},
	methods: {
		async deleteSnippet(id){
			var res = this.snippetStore.deleteSnippet(id);
			if(res){//if the snippet was successfully added, close the form and reset its data
				this.selectedSnippet.value = null;
			}
		},
		async toggleStarred(snippet){
			this.snippetStore.toggleStarred(snippet);
		},
		async togglePrivate(snippet){
			this.snippetStore.togglePrivate(snippet);
		},
		async copySnippetURL(){
			await navigator.clipboard.writeText(this.snippetStore.getSnippetPublicLink);
		},
		async copySnippetGUID(snippet){
			await navigator.clipboard.writeText('guid:' + snippet.id);
		},
		openSnippetPage(snippet){
			window.open(this.snippetStore.getSnippetPublicLink, "_blank").focus();
		}
	}
}
</script>

<template>
	<b-col class="bg-light" align-self="stretch">
		<template v-if="selectedSnippet">
			<b-row class="bg-white p-3" align-h="between">
				<b-col cols="auto">
					<b-row>
						<b-col cols="auto" class="p-0 pr-3">
							<b-col id="btn-star" class="text-gray cursor-on-hover text-center" :class="{ 'text-yellow' : selectedSnippet.starred }" @click="toggleStarred(selectedSnippet)">
								<i class="fa-solid fa-star"></i>
							</b-col>
							<b-col v-if="selectedSnippet.private" class="text-darker text-center">
								<i class="fa-solid fa-lock"></i>
							</b-col>
						</b-col>
						
						<b-col>
							<b-row style="font-size: 1.2em;"><b>{{selectedSnippet.title}}</b></b-row>
							<b-row id="guid" class="cursor-on-hover text-darker mb-2" @click="copySnippetGUID(selectedSnippet)">
								<b>guid : {{selectedSnippet.id}}</b>
								&nbsp;<i id="copy-icon" class="fa-solid fa-copy"></i>
							</b-row>
							<b-tooltip target="guid" triggers="hover" noninteractive>
								Click to copy ID
							</b-tooltip>
							<b-row style="font-size: 0.8em;"><b>{{selectedSnippet.User.username}}</b><span class="cursor-on-hover text-darker">&nbsp;- {{selectedSnippet.createdAt | completeDateHour }}</span></b-row>
						</b-col>
					</b-row>
				</b-col>
				
				<b-col cols="auto">
					<b-row align-h="end">
						<b-col cols="auto" class="p-1">
							<span id="edit-btn" v-b-modal.modal-scrollable.modal-xl.modal-edit-form class="cursor-on-hover text-darker"><i class="fa-solid fa-pen"></i></span>
							<SnippetCreateEditForm id="modal-edit-form" :snippet="selectedSnippet"/>
						</b-col>
						<b-col cols="auto" class="p-1">
							<span id="delete-btn" class="cursor-on-hover text-darker" @click="deleteSnippet(selectedSnippet.id)"><i class="fa-solid fa-trash"></i></span>
						</b-col>
					</b-row>
					<b-row align-h="end" class="mt-3">
						<b-button v-for="tag in selectedSnippet.tags" variant="outline-secondary" size="sm" class="rounded bg-light text-darker mr-1" :key="tag.id">
							{{tag.name}}
						</b-button>
					</b-row>
				</b-col>
			</b-row>
			
			<b-row class="bg-white border-top border-bottom border-light-gray" align-h="between" align-v="stretch">
				<b-col>
					<b-row align-h="start" align-v="center">
						<b-button id="share-btn" class="bg-white text-darker border-right border-top-0 border-bottom-0 border-left-0 border-gray" @click="copySnippetURL">SHARE</b-button>
						<a class="pl-2" href="snippetStore.getSnippetPublicLink">{{ snippetStore.getSnippetPublicLink }}</a>
					</b-row>
					<b-tooltip target="share-btn" delay="50" triggers="click">
						Copied !
					</b-tooltip>
				</b-col>
		
				<b-col cols="auto">
					<b-row align-v="baseline">
						<b-col id="btn-copy" class="cursor-on-hover text-darker p-1" @click="copySnippetURL">
							<i class="fa-solid fa-copy"></i>
						</b-col>
						<b-tooltip target="btn-copy" delay="50" triggers="click">
							Copied !
						</b-tooltip>
						<b-col id="btn-open-link" class="cursor-on-hover text-darker p-1 mr-3" @click="openSnippetPage">
							<i class="fa-solid fa-arrow-up-right-from-square"></i>
						</b-col>
						<b-tooltip target="btn-open-link" triggers="hover">
							Open snippet page
						</b-tooltip>
					</b-row>
				</b-col>
				
				<b-col cols="auto" class="border-gray border-left pl-2">
					<b-row align-v="baseline">
						<b-col class="cursor-on-hover text-darker pt-1" @click="togglePrivate(selectedSnippet)">
							<template v-if="selectedSnippet.private">
								<font-awesome-icon :icon="['fas', 'lock']" /> PRIVATE
							</template>
							<template v-else>
								<font-awesome-icon :icon="['fas', 'eye']" /> PUBLIC
							</template>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			
			<b-row>
				<b-col class="bg-light p-3">
					<b-row>
						<b-col>
							<VueMarked v-if="selectedSnippet.description">{{selectedSnippet.description}}</VueMarked>
							<div class="mb-3" v-else>{{selectedSnippet.title}}</div>
						</b-col>
					</b-row>
					<hr class="mt-0">
					
					<b-row class="mb-3">
						<b-col>
							<span class="text-darker">
								Files
							</span>
							<b-badge pill variant="secondary rounded text-white">{{selectedSnippet.parts.length}}</b-badge>
						</b-col>
					</b-row>
					
					<b-row>
						<b-col>
							<b-card no-body>
								<b-tabs card>
									<b-tab :title="part.title" v-for="part in selectedSnippet.parts" :key="part.id">
										<b-card-text>
											<AceEditor :code="part.content" :language="part.Language.name" read-only/>
											<!--<CodeHighlighter :code="part.content" :language="part.Language.name"/>-->
										</b-card-text>
									</b-tab>
								</b-tabs>
							</b-card>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			
			
		</template>
		<template v-else>
			<b>Nothing to see here !</b>
		</template>
	</b-col>

</template>
<style lang="scss" scoped>
	#share-btn {
		box-shadow: none!important;
	}
	#guid {
		font-size: 0.8em;
	}
	#share-btn:hover, #edit-btn:hover, #delete-btn:hover, #guid:hover, #btn-copy:hover, #btn-open-link:hover{
		color: var(--black)!important;
	}
	#guid #copy-icon{
		visibility: hidden;
		color: var(--success)!important;
	}
	#guid:hover #copy-icon{
		visibility: visible;
	}
	#btn-star:not(.active):not(.text-yellow):hover{
		color: var(--darker)!important;
	}
	a:hover{
		text-decoration: none;
	}
</style>