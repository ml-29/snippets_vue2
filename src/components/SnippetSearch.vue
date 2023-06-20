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
	<input placeholder="Search" v-model="search">
</template>
