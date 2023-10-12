<script>
import { useSnippetStore } from '@/stores/snippet.js'

export default {
	setup(){
		const snippetStore = useSnippetStore();
		
		return { snippetStore };
	},
	data(){
		return {
			snippet: null
		}
	},
	created(){
		this.getSnippet();
	},
	methods: {
		async getSnippet(){
			var s = await this.snippetStore.fetchSnippet(this.$route.params.id);
			this.snippet = s;
		}
	}
}
</script>

<template>
	<b-container class="bg-light" fluid>
		<h1>{{snippet}}</h1>
		<div v-if="snippet">
			{{snippet}}
		</div>
		<div v-else>
			This snippet is private
		</div>
	</b-container>
</template>
