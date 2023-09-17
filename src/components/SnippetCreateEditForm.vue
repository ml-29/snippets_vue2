<script>
import { useSnippetStore } from '@/stores/snippet.js';
import PartEditor from './PartEditor.vue';

export default {
	components : {
		PartEditor
	},
	setup(){
		const defaultSnippet = {
			id: 0,
			title : "",
			description : "",
			tags : [],
			starred : true,
			parts : []
		};
		const snippetStore = useSnippetStore();
		return { defaultSnippet, snippetStore };
	},
	data() {
		return {
			formId: 'form' + this._uid,
			modal: null,
			localSnippet: {}
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
			this.localSnippet.parts.push({
				title: '',
				content : "",
				language : ''
			});
		},
		deletePart(index){//removes a part of the snippet in the form
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
			<h5>New snippet</h5>
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
				<!-- {{localSnippet.parts}} -->
				<PartEditor v-for="(part, index) in localSnippet.parts" :key="index"
					:part="part"
					@input="(newPart) => {part = newPart}"
					@deletePart="deletePart(index)"/>

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
