<script>
export default {
	data(){
		return {
			language: '',
			fileName: '',
			content: "<h1>Pouet</h1> console.log('pouet'); #hello def fib(n):",
			editorInstance: null
		}
	},
	components: {
		editor: require('vue2-ace-editor')
	},
	watch: {
		language: function(){
			require('brace/mode/' + this.language);
			this.$refs.myEditor.editor.session.setMode("brace/mode/" + this.language);
			// require('brace/mode');
		}
	},
	methods: {
		editorInit: function () {
			// editor.session.setMode("brace/mode/" + this.language);
			// this.editorInstance = editor;
			// require('brace/mode/' + this.language)
			require('brace/ext/language_tools') //language extension prerequsite...
			// require('brace/mode/html')
			// require('brace/mode/javascript')    //language
			// require('brace/mode/markdown')
			// require('brace/mode/less')
			// require('brace/theme/chrome')
			// require('brace/snippets/javascript') //snippet
		}
	},
}
</script>

<template>
	<div>
		<input v-model="language">
		<editor ref="myEditor" v-model="content" @init="editorInit" :lang="language" theme="chrome" width="500" height="100"></editor>
	</div>
</template>
