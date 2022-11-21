<script>
import {EditorView, basicSetup} from 'codemirror'
import { languages } from "@codemirror/language-data"

export default {
	data() {
		return {
			editor : null,
			languagePluginLoader : null
		}
	},
	props: {
		code: { type: String, required: false, default: '' },
		suggestedLanguage: { type: String, required: false, default: '' },
		fileName: { type: String, required: false, default: ''}
	},
	watch: {
		suggestedLanguage: function (){//tries to find and init a matching language loader when suggested language changes
			this.initEditor();
			// this.setLanguageLoader();
		},
		fileName: function (){
			// console.log('file name changed');
			this.initEditor();
			// this.setLanguageLoader();
		},
		// guessed: function(){
		// 	this.initEditor();
		// }
	},
	methods: {
		guessLanguagePluginLoaderFromSuggestedLanguage: function(){
			return languages.find(l => {
				return l.name == this.suggestedLanguage;
			});
		},
		guessLanguagePluginLoaderFromFileExtension: function(){
			var ext = this.fileName.split('.').pop();
			return languages.find((l) => {
				return l.extensions.includes(ext);
			});
		},
		setLanguageLoader: function(){
			this.languagePluginLoader = this.guessLanguagePluginLoaderFromFileExtension() || this.guessLanguagePluginLoaderFromSuggestedLanguage() || null;
		},
		initEditor(){
			var extensions = [
				basicSetup
			];
			new Promise((resolve, reject) => {
				// this.languagePluginLoader = this.guessLanguagePluginLoaderFromFileExtension() || this.guessLanguagePluginLoaderFromSuggestedLanguage() || null;
				// this.guessed = languagePluginLoader.name;
				this.setLanguageLoader();
				if(this.languagePluginLoader.name != this.suggestedLanguage){
					//request that the language changes
					this.$emit('changeSuggestedLanguage', this.languagePluginLoader.name);
				}
				if(this.languagePluginLoader){
					this.languagePluginLoader.loadFunc().then((loadedPlugin) => {
						if(loadedPlugin){
							extensions.push(loadedPlugin);
						}
						resolve();
					});
				}else{
					reject();
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
	<div>
		<!-- <span>{{suggestedLanguage}}</span><span>{{fileName}}</span><span>{{languagePluginLoader}}</span> -->
		<span>Guessed : {{guessed}}</span>
		<div ref="editorWrapper"></div>
	</div>
</template>
