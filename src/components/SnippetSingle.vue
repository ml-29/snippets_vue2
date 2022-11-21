<script>
import { storeToRefs } from 'pinia';
import { useSnippetStore } from '@/stores/snippet.js';

import SnippetCreateEditForm from '@/components/SnippetCreateEditForm.vue'

export default {
	components : {
		SnippetCreateEditForm
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
		}
	}
}
</script>

<template>
	<div>
		<template v-if="selectedSnippet">
			<b-button v-b-modal.modal-scrollable.modal-xl.modal-edit-form>Edit Snippet</b-button>
			<SnippetCreateEditForm id="modal-edit-form" :snippet="selectedSnippet"/>
			<button @click="deleteSnippet(selectedSnippet.id)">Delete</button>

			<h2>{{selectedSnippet.title}}</h2>
			<div>
				{{selectedSnippet.description}}
			</div>
			<div>
				{{selectedSnippet.preview}}
			</div>
			<span v-for="tag in selectedSnippet.tags" :key="tag.name">
				{{tag.name}}
			</span>
			<div v-for="part in selectedSnippet.parts" :key="part.id">
				<span>{{part.title}}</span>
				<pre :class="part.Language.name">
					<code>
						{{part.content}}
					</code>
				</pre>
				</div>
		</template>
		<template v-else>
			<b>Nothing to see here !</b>
		</template>
	</div>

</template>
