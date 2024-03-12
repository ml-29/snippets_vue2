<script>
import { useSnippetStore } from '@/stores/snippet.js';
import { useLanguageStore } from '@/stores/language.js';
import PartEditor from './PartEditor.vue';

export default {
	components : {
		PartEditor
	},
	setup(){
		const snippetStore = useSnippetStore();
		const languageStore = useLanguageStore();
		
		return { languageStore, snippetStore };
	},
	computed: {
		editing : function (){
			return this.snippet.id != 0;
		},
		defaultPart : function(){//needs to be computed so language by default is up to date with store (it's empty when component is instanciated)
			var p = {
				title: '',
				content : ""
			};
			p.Language = this.languageStore.defaultLanguage;
			return p;
		}
	},
	data() {
		return {
			formId: 'form' + this._uid,
			modal: null,
			localSnippet: {},
			defaultSnippet : {
				id: 0,
				title : "",
				description : "",
				tags : [],
				starred : true,
				parts : []
			}
		}
	},
	props: {
		snippet : {type: Object, required: false,
			default() { return {
			id: 0,
			title : "",
			description : "",
			tags : [],
			starred : true,
			parts : []
		}; }
		}
	},
	methods: {
		handleShowModal(){
			if(this.snippet.id){
				this.localSnippet = JSON.parse(JSON.stringify(this.snippet));
			}else{
				this.localSnippet = JSON.parse(JSON.stringify(this.defaultSnippet));
			}
			this.localSnippet.tags = this.localSnippet.tags.map((t) => {
				return t.name;
			});
			this.localSnippet.parts = this.localSnippet.parts.map((p) => {
				p.language = p.Language.name;
				return p;
			});
		},
		handleOk(bvModalEvent){
			// Prevent modal from closing
			bvModalEvent.preventDefault()
			// Trigger submit handler
			this.handleSubmit()
		},
		async handleSubmit(){
			var success = false;
			var s = structuredClone(this.localSnippet);
			
			s.tags = s.tags.map((t)=>{
				return { name : t }
			});
			
			s.parts = s.parts.map((p)=>{
				var pp = structuredClone(p);
				
				pp.Language = { name: pp.language };
				pp.language = undefined;
				return pp;
			});
			
			console.log(s);
			
			success = await this.snippetStore.createOrUpdateSnippet(s);
			if(success){//if the snippet was successfully added, close the form and reset its data
				this.closeForm();
			}
		},
		addPart(){//adds a part to the snippet in the form
			this.localSnippet.parts.push(Object.assign({}, this.defaultPart));
		},
		deletePart(id){//removes a part of the snippet in the form
			console.log(JSON.stringify(this.localSnippet.parts));
			console.log(id);
			var index = this.localSnippet.parts.findIndex((p) => p.id == id);
			console.log('deleting part at ' + index);
			this.localSnippet.parts.splice(index, 1);
		},
		closeForm(){
			this.$refs.modal.hide();
		}
	}
}
</script>
<template>
	<b-modal
		v-bind="$attrs"
		ref="modal"
		size="xl"
		@ok="handleOk"
		@show="handleShowModal"
		scrollable>
		<template #modal-header>
			<h5 v-if="editing">Edit snippet</h5>
			<h5 v-else>New snippet</h5>
			<b-col sm="6">
				<b-form-tags input-id="tags" v-model="localSnippet.tags" remove-on-delete></b-form-tags>
			</b-col>
		</template>
		<template #default>
			<form :id="formId" ref="form" @submit.stop.prevent="handleSubmit">
				<b-form-group
					label="Title"
					label-for="title"
					invalid-feedback="Title is required"
				>
					<b-form-input
						id="title"
						v-model="localSnippet.title"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					label="Description"
					label-for="description"
				>
					<b-form-textarea
						id="description"
						v-model="localSnippet.description"
						placeholder="Enter something ..."
						rows="3"
						max-rows="15"
					></b-form-textarea>
				</b-form-group>

				<h2>Files</h2>
				<PartEditor v-for="part in localSnippet.parts" :key="part.id"
					:part="part"
					@input="(newPart) => {part = newPart}"
					@deletePart="deletePart"/>

				<b-button @click="addPart">Add file</b-button>
			</form>
		</template>
		<template #modal-footer>
			<b-form-checkbox v-model="localSnippet.starred" name="starred" class="mr-auto" switch>
				Starred
			</b-form-checkbox>

			<b-button size="sm" variant="outline-primary" @click="closeForm">
				Discard
			</b-button>
			<b-button :form="formId" type="submit" size="sm" variant="primary">
				SAVE
			</b-button>
		</template>

	</b-modal>

</template>
