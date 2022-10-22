<script>
import SideNav from './components/SideNav.vue'
import SortByList from './components/SortByList.vue'

export default {
	data() {
		return {
			count: 0
		}
	},
	components: {
		SideNav,
		SortByList
	}
}
</script>

<template>
	<div v-fragments>
		<SideNav/>
		<SortByList/>

		<!-- <div>
			<Search/>
			<Snippet/>
		</div> -->
	</div>
</template>
