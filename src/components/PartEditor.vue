<script>
import CodeMirrorEditor from './CodeMirrorEditor.vue';
import { languages } from "@codemirror/language-data";

export default {
	data(){
		return {
			editorLanguages: languages,
			localPart: this.part
		}
	},
	props : {
		part : { type: Object, required: true}
	},
	components : {
		CodeMirrorEditor
	},
	watch: {
		localPart: function() {
			this.$emit('input', this.localPart);
		},
		editorLanguage: function() {
			if(this.editorLanguage != this.part.language){
				this.localPart.language = this.editorLanguage;
			}
		},
		'part.title': function(){
			var nameParts = this.part.title.split('.');
			var pluginRef = null;
			if(nameParts.length >= 2){
				var ext = nameParts.pop();
				pluginRef = this.editorLanguages.find((l) => {
					return l.extensions.includes(ext);
				});
			}

			var languagePluginName = pluginRef ? pluginRef.name : '';

			this.localPart.language = languagePluginName || this.localPart.language || '';
		}
	}, methods: {
		deletePart(){
			this.$emit('deletePart', this.part);
		}
	}
}
</script>
<template>
	<!--<input v-model="part.title">-->
	<b-card no-body>
		<template #header>
			<form>
				<b-row>
					<b-col sm="3">
						<b-form-input v-model="localPart.title" required></b-form-input>
					</b-col>
					<b-col sm="3">
						<b-form-select v-model="localPart.language">
							<b-form-select-option value="">Plain Text</b-form-select-option>
							<b-form-select-option v-for="l in editorLanguages" :key="l.name" :value="l.name">{{ l.name }}</b-form-select-option>
						</b-form-select>
					</b-col>
					<button type="button" @click="deletePart">Delete</button>
				</b-row>
			</form>
		</template>
		<CodeMirrorEditor :code="localPart.content" :language="localPart.language" @input="(newCode) => {localPart.content = newCode}"/>
	</b-card>
</template>
