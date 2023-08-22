<script>
import { useAccountStore } from '@/stores/account.js'
import { useGlobalStore } from '@/stores/global.js'

export default {
	setup(){
		const accountStore = useAccountStore();
		const globalStore = useGlobalStore();
		
		return { accountStore, globalStore };
	},
	computed: {
		username(){
			return this.accountStore.user.username || this.accountStore.user.githubProfile.login;
		},
		avatarUrl(){
			return this.accountStore.user.avatar || this.accountStore.user?.githubProfile?.avatar_url || 'https://placehold.co/300/300';
		}
	}
}
</script>
<template>
	<div>
		<b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
			<template #button-content>
				<b-avatar v-bind:src="avatarUrl"></b-avatar>
				<i class="fa-solid fa-chevron-down"></i><span class="sr-only">Profile options</span>
			</template>
			<b-dropdown-item href="#">See Profile</b-dropdown-item>
			<b-dropdown-item>
				<router-link :to="'logout'">Log out</router-link>
			</b-dropdown-item>
		</b-dropdown>
		<p v-if="accountStore.loggedIn">{{username}}</p>
	</div>
</template>