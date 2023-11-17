<script>
import brace from "brace";
import * as modesByName from "brace/ext/modelist";

export default {
	setup(){
		console.log('modes by name');
		console.log(JSON.stringify(modesByName));
		// const modes = require('brace/ext/modelist');
		// console.log(JSON.stringify(modes));
	},
	data(){
		return {
			localCode: this.code,
			modes:null
		}
	},
	components: {
		editor: require('vue2-ace-editor')
	},
	props: {
		code: { type: String, required: false, default: '' },
		language: { type: String, required: false, default: '' },
		readOnly: { type: Boolean, required: false, default: false }
	},
	watch: {
		language: function(){
			require('brace/mode/' + this.language);
			this.$refs.editorElement.editor.session.setMode("brace/mode/" + this.language);
		}
	},
	methods: {
		editorInit: function(){
			require('brace/ext/language_tools')
			require('brace/theme/chrome')
			// console.log(modesByName);
			// var modes = require('brace/ext/modelist').modesByName;
			// console.log(JSON.stringify(modes));
			// var modelist = require('brace/ext/modelist');
			// console.log(modelist);
			// if(modelist.modesByName[this.language] == undefined) {
			// 	console.log("mode doesn't exist");
			// }else{
			// 	console.log("mode exists");
			// }
			if(this.readOnly){
				this.$refs.editorElement.editor.setReadOnly(true);
				// this.modes = this.$refs.editorElement.editor.getAceModes();
			}
		}
	}
}
</script>

<template>
	<div>
		<editor ref="editorElement" @init="editorInit" v-model="localCode" :lang="language" theme="chrome" width="100%" height="100"></editor>
	</div>
</template>