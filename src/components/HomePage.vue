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
	<b-container fluid>
		<b-row align-v="stretch">
			<SideNav/>
			<b-col>
				<b-row>
					<SnippetSearch/>
					<ProfileMenu/>
				</b-row>
				<b-row class="p-0" align-v="stretch">
					<SortByList/>
					<SnippetSingle/>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>
