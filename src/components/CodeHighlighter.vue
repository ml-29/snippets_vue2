<script>
import {basicSetup} from 'codemirror'
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { languages } from "@codemirror/language-data"

export default {
	data(){
		return {
			editor: null
		}
	},
	props: {
		code: { type: String, required: false, default: '' },
		language: { type: String, required: false, default: '' }
	},
	methods: {
		initEditor: function(){
			var extensions = [
				basicSetup,
				EditorState.readOnly.of(true)
			];
			new Promise((resolve, reject) => {
				var languageLoader = languages.find((l) => {
					return l.name == this.language;
				});
				if(languageLoader){
					languageLoader.loadFunc().then((loadedPlugin) => {
						if(loadedPlugin){
							extensions.push(loadedPlugin);
							resolve();
						}
						reject();
					});
				}else{
					resolve();
				}
			}).finally(() => {
				if(this.editor){
					this.editor.destroy();
				}
				this.editor = new EditorView({
					doc: this.code,
					extensions: extensions,
					parent: this.$refs.editorWrapper
				});
			});
		}
	},
	mounted(){
		this.initEditor();
	}
}
</script>

<template>
	<div ref="editorWrapper"></div>
</template>
<style scoped>
	input{
		pointer-events: none;
	}
</style>