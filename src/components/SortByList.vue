<script>
import { storeToRefs } from 'pinia'
import { useSnippetStore } from '@/stores/snippet.js'
import { useAccountStore } from '@/stores/account.js'

import VueMarked from '@hrwg/vue-marked'

export default {
	setup(){
		const snippetStore = useSnippetStore();
		const accountStore = useAccountStore();
		
		return { snippetStore, accountStore };
	},
	components : {
		VueMarked
	},
	data() {
		return {
			sortMethods: {
				'Recently Created' : 'sortListByRecentlyCreated',
				'Last Updated' : 'sortListByLastUpdated',
				'Title' : 'sortListByTitle'
			},
			selectedSortMethod: null,
			selectedSnippet: this.snippetStore.selectedSnippet
		}
	},
	watch: {
		selectedSnippet : function(){
			this.snippetStore.selectedSnippet = this.selectedSnippet
		}
	},
	methods: {
		setSortMethod(method){
			this.selectedSortMethod = method;
		}
	},
	created(){
		this.selectedSortMethod = Object.keys(this.sortMethods)[0];
	},
	computed: {
		sortedList(){
			return this.snippetStore[this.sortMethods[this.selectedSortMethod]];
		}
	}
}
</script>

<template>
	<b-col cols="4" class="bg-light border-right border-right border-gray p-0">
		<b-col class="p-0">
			<b-dropdown id="sort-by-dropdown" size="sm" toggle-class="sort-by-btn border-0 bg-transparent shadow-none" :text="selectedSortMethod" class="m-md-2" no-caret>
				<template #button-content>
					{{selectedSortMethod}} <i class="fa-solid fa-chevron-down" style="font-size: 0.8em;"></i>
				</template>
				<b-dropdown-item-button v-for="(value, key) in sortMethods" :active="selectedSortMethod == key ? true : false" :key="key" @click="setSortMethod(key)">
					{{ key }}
				</b-dropdown-item-button>
			</b-dropdown>
		</b-col>
		<b-list-group id="sort-by-list">
			<b-list-group-item v-for="snippet in sortedList" :key="snippet.id" href="#" class="sort-by-list-item border-right-0 text-dark bg-white cursor-on-hover" :class="{ active: selectedSnippet && (snippet.id == selectedSnippet.id) }" aria-current="true" @click="selectedSnippet = snippet">
				<b-row>
					<b-col class="p-0" cols="auto" align-v="start">
						<b-col v-if="snippet.starred" class="text-center text-yellow">
							<i class="fa-solid fa-star"></i>
						</b-col>
						<b-col v-if="snippet.private" class="text-darker text-center">
							<i class="fa-solid fa-lock"></i>
						</b-col>
						<b-col class="text-center" style="visibility: hidden;">
							<i class="fa-solid fa-star"></i>
						</b-col>
					</b-col>
					
					<b-col class="p-0">
						<strong class="mb-1">{{snippet.title}}</strong>
						
						<VueMarked v-if="snippet.description" class="small">{{snippet.description}}</VueMarked>
						<p v-else class="small">{{snippet.title}}</p>
						
						<b-button v-for="tag in snippet.tags" variant="outline-secondary" size="sm" class="no-hover rounded bg-light text-darker mr-1" :key="tag.id" style="cursor-events: none!important;">
							{{tag.name}}
						</b-button>
					</b-col>
					
					<b-col class="p-0 pr-2" align-h="end" cols="auto">
						<b-col class="p-0">
							<b-avatar v-bind:src="accountStore.avatarUrl(snippet.User)" size="sm" :text="accountStore.initials(snippet.User)"></b-avatar>
						</b-col>
						<b-col class="p-0 text-center">
							<small>{{snippet.createdAt | miniDateTimeAgo }}</small>
						</b-col>
					</b-col>
				</b-row>
				
			</b-list-group-item>
		</b-list-group>
	</b-col>
</template>
<style lang="scss">
	button#sort-by-dropdown__BV_toggle_{
		color: var(--darker);
	}
	button#sort-by-dropdown__BV_toggle_:hover{
		color: var(--black)!important;
	}
	.sort-by-list-item:hover{
		background-color: var(--light)!important;
	}
	#sort-by-list .active{
		background-color: var(--light)!important;
		border-color: var(--gray);
		border-left: 4px solid var(--success);
		color: var(--black);
		box-shadow: inset 0 2px 2px rgba(0,0,0,.1);
	}
	button.no-hover.bg-light:hover{
		background-color: var(--light)!important;
	}
</style>