<script>
import {EditorView, basicSetup} from 'codemirror'
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
	watch: {
		language: function(){
			this.initEditor();
		}
	},
	methods: {
		inputCode: function(){
			this.$emit('input', this.editor.state.sliceDoc());
		},
		initEditor: function(){
			var extensions = [
				basicSetup
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
	<div ref="editorWrapper" @keyup="inputCode"></div>
</template>
