<script>
import SideNav from './components/SideNav.vue'
import SortByList from './components/SortByList.vue'
import SnippetSearch from './components/SnippetSearch.vue'
import SnippetSingle from './components/SnippetSingle.vue'

export default {
	data() {
		return {
			count: 0
		}
	},
	components: {
		SideNav,
		SortByList,
		SnippetSearch,
		SnippetSingle
	}
}
</script>

<template>
	<div v-fragments>
		<SideNav/>
		<SortByList/>
		<div>
			<SnippetSearch/>
			<SnippetSingle/>
		</div>
	</div>
</template>
