<script>
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSnippetStore } from '@/stores/snippet.js'

export default {
	setup(){
		const store = useSnippetStore();
		const { selectedSnippet } = storeToRefs(store);
		const { fetchSnippets } = useSnippetStore();

		// const sortMethods = ref({
		// 	'Recently Created' : 'sortListByRecentlyCreated',
		// 	'Last Updated' : 'sortListByLastUpdated',
		// 	'Title' : 'sortListByTitle'
		// });

		fetchSnippets();

		// const selectedSortMethod = ref(Object.keys(sortMethods.value)[0]);
		// const sortedList = computed(() => {
		// 	return store[sortMethods.value[selectedSortMethod.value]];
		// });
		return { store, selectedSnippet };
	},
	data() {
		return {
			sortMethods: {
				'Recently Created' : 'sortListByRecentlyCreated',
				'Last Updated' : 'sortListByLastUpdated',
				'Title' : 'sortListByTitle'
			},
			selectedSortMethod: null
		}
	},
	created(){
       this.selectedSortMethod = Object.keys(this.sortMethods)[0];
    },
	computed: {
		sortedList(){
			return this.store[this.sortMethods[this.selectedSortMethod]];
		}
	}
}
</script>

<template>
	<div id="sort-by-list-container" class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style="width: 380px;">
		<!-- <a href="/" class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
		<span class="fs-5 fw-semibold">List group</span>
		</a> -->
		<div class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
			<span class="fs-5 fw-semibold">Sort by </span>
			<select v-model="selectedSortMethod">
				<option v-for="(value, key) in sortMethods" :key="key">{{ key }}</option>
			</select>
		</div>

		<div class="list-group list-group-flush border-bottom scrollarea">
			<a v-for="snippet in sortedList" :key="snippet.id" href="#" class="list-group-item list-group-item-action py-3 lh-tight" :class="{ active: selectedSnippet && (snippet.id == selectedSnippet.id) }" aria-current="true" @click="selectedSnippet = snippet">
				<div class="d-flex w-100 align-items-center justify-content-between">
					<strong class="mb-1">{{snippet.title}}</strong>
					<!-- <small>Wed</small> -->
				</div>
				<div class="col-10 mb-1 small">{{snippet.description}}</div>
				<span v-for="tag in snippet.tags" :key="tag.id">
					{{tag.name}}
				</span>
			</a>
		</div>
	</div>
</template>
