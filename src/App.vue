<script>
import SideNav from './components/SideNav.vue'
import SortByList from './components/SortByList.vue'
import SnippetSearch from './components/SnippetSearch.vue'
import SnippetSingle from './components/SnippetSingle.vue'
import LoginMenu from './components/LoginMenu.vue'

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
		SnippetSingle,
		LoginMenu
	}
}
</script>

<template>
	<div v-fragments>
		<SideNav/>
		<SortByList/>
		<div>
			<LoginMenu/>
			<SnippetSearch/>
			<SnippetSingle/>
		</div>
	</div>
</template>
