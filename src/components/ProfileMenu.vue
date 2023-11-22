<script>
import { useAccountStore } from '@/stores/account.js'
import { useGlobalStore } from '@/stores/global.js'

export default {
	setup(){
		const accountStore = useAccountStore();
		const globalStore = useGlobalStore();
		
		return { accountStore, globalStore };
	}
}
</script>
<template>
	<b-col class="m-0 p-0 bg-light border-bottom border-gray">
		<b-row align-h="end">
			<b-dropdown id="profile-dropdown" class="mr-3" size="lg"  variant="link" toggle-class="text-decoration-none border-0 shadow-none" right no-caret>
				<template #button-content>
					<b-avatar class="mr-1" v-bind:src="accountStore.avatarUrl(accountStore.user)" size="sm" :text="accountStore.initials(accountStore.user)"></b-avatar>
					<span id="profile-chevron" class="text-darker">
						<i class="fa-solid fa-chevron-down"></i>
					</span>
				</template>
				<!--<b-dropdown-item href="#">See Profile</b-dropdown-item>-->
				<b-dropdown-item>
					<router-link :to="'logout'">Log out</router-link>
				</b-dropdown-item>
			</b-dropdown>
		</b-row>
	</b-col>
</template>
<style lang="scss" scoped>
	#profile-chevron{
		font-size: 0.5em;
		vertical-align: middle;
	}
	#profile-dropdown:hover #profile-chevron{
		color: var(--black)!important;
	}
</style>