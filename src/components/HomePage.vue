<script>
import SideNav from '@/components/SideNav.vue'
import SortByList from '@/components/SortByList.vue'
import SnippetSearch from '@/components/SnippetSearch.vue'
import SnippetSingle from '@/components/SnippetSingle.vue'
import ProfileMenu from '@/components/ProfileMenu.vue'

import { useGlobalStore } from '@/stores/global.js'

export default {
	setup(){
		const globalStore = useGlobalStore();
		
		return { globalStore };
	},
	components: {
		SideNav,
		SortByList,
		SnippetSearch,
		SnippetSingle,
		ProfileMenu
	},
	created(){
		this.globalStore.refreshAppData();
	}
}
</script>

<template>
	<b-row>
		<SideNav/>
		<SortByList/>
		<div>
			<b-row>
				<SnippetSearch/>
				<ProfileMenu/>
			</b-row>
			<SnippetSingle/>
		</div>
	</b-row>
</template>
