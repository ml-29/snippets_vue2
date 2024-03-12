<script>
import CodeEditor from './CodeEditor.vue';
import { useLanguageStore } from '@/stores/language.js';

export default {
	setup(){
		const languageStore = useLanguageStore();
		return { languageStore };
	},
	data(){
		return {
			availableLanguages: this.languageStore.availableLanguages,
			localPart: this.part,
			langTest: ''
		}
	},
	props : {
		part : { type: Object, required: true}
	},
	components : {
		CodeEditor
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
		// 'part.title': function(){
		// 	var nameParts = this.part.title.split('.');
		// 	var pluginRef = null;
		// 	if(nameParts.length >= 2){
		// 		var ext = nameParts.pop();
		// 		pluginRef = this.availableLanguages.find((l) => {
		// 			return l.extensions.includes(ext);
		// 		});
		// 	}

		// 	var languagePluginName = pluginRef ? pluginRef.name : '';

		// 	this.localPart.language = languagePluginName || this.localPart.language || '';
		// }
	},
	methods: {
		deletePart(id){
			this.$emit('deletePart', id);
		}
	}
}
</script>
<template>
	<b-card no-body>
		<template #header>
			<form>
				<b-row align-h="between">
					<b-col>
						<b-row>
							<b-col sm="3">
								<b-form-input v-model="localPart.title" required></b-form-input>
							</b-col>
							<b-col sm="3">
								<b-form-select v-model="localPart.Language">
									<b-form-select-option v-for="l in availableLanguages" :key="l.name" :value="l">{{ l.name }}</b-form-select-option>
								</b-form-select>
							</b-col>
						</b-row>
					</b-col>
					<b-col cols="auto" class="p-1 pr-3">
						<span id="delete-btn" class="cursor-on-hover text-darker" @click="deletePart(localPart.id)"><i class="fa-solid fa-trash"></i></span>
					</b-col>
					<!--<button type="button" @click="deletePart">Delete</button>-->
				</b-row>
			</form>
		</template>
		<CodeEditor :code="localPart.content" :language="localPart.Language" @input="(newCode) => {localPart.content = newCode}"></CodeEditor>
		<!--<CodeEditor :code="localPart.content" :language="localPart.language" @input="(newCode) => {localPart.content = newCode}"/>-->
	</b-card>
</template>
