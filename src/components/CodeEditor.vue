<script>
import { useLanguageStore } from '@/stores/language.js';

export default {
	setup(){
		const languageStore = useLanguageStore();
		return { languageStore };
	},
	data(){
		return {
			localCode: this.code,
			availableLanguages: this.languageStore.availableLanguages
		}
	},
	components: {
		editor: require('vue2-ace-editor')
	},
	props: {
		code: { type: String, required: false, default: '' },
		language: { type: Object, required: false, default: function(){ return { aceEditorMode : 'javascript'}; } },
		readOnly: { type: Boolean, required: false, default: false }
	},
	watch: {
		localCode: function(){
			this.$emit('input', this.localCode);
		}
	},
	methods: {
		editorInit: function(){
			require('brace/ext/language_tools')
			require('brace/theme/chrome')
			
			this.languageStore.availableLanguages.map((l) => {
				require('brace/mode/' + l.aceEditorMode);
			});
			
			if(this.readOnly){
				this.$refs.editorElement.editor.setReadOnly(true);
			}
		}
	}
}
</script>

<template>
	<div>
		<editor ref="editorElement" @init="editorInit" v-model="localCode" :lang="language.aceEditorMode" theme="chrome" width="100%" height="100"></editor>
	</div>
</template>