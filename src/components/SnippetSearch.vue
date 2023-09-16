<script>
import { useSnippetStore } from '@/stores/snippet.js'

export default {
	setup(){
		const snippetStore = useSnippetStore;
		return { snippetStore };
	},
	data(){
		return {
			search: ''
		}
	},
	watch: {
		search: function(s) {
			this.snippetStore().searchSnippets(s);
		}
	}
}
</script>

<template>
	<b-col cols="4" class="p-2 border-right border-bottom bg-light border-gray">
		<div class="input-group input-group-sm">
			<div class="input-group-prepend">
				<span class="input-group-text" id="search-input-group"><i class="fas fa-search"></i></span>
			</div>
			<input class="form-control" placeholder="Search" v-model="search" aria-label="search" aria-describedby="search-input-group">
		</div>
	</b-col>
</template>
