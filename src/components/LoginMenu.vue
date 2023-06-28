<script>
import { useAccountStore } from '@/stores/account.js'
import { useSnippetStore } from '@/stores/snippet.js'
import { useTagStore } from '@/stores/tag.js'
import { useLanguageStore } from '@/stores/language.js'

export default {
	setup(){
		const accountStore = useAccountStore();
		accountStore.checkGithubLogin();
		const snippetStore = useSnippetStore();
		const tagStore = useTagStore();
		const languageStore = useLanguageStore();
		
		return { accountStore, snippetStore, tagStore, languageStore };
	},
	data() {
		return {
			// login form fields
			loginUsername: process.env.VUE_APP_DEFAULT_USERNAME || '',
			loginPassword: process.env.VUE_APP_DEFAULT_PASSWORD || '',
			loginRememberMe: false,
			
			// signup form fields
			signUpEmail: process.env.VUE_APP_DEFAULT_SIGNUP_EMAIL || '',
			signUpUsername: process.env.VUE_APP_DEFAULT_SIGNUP_USERNAME || '',
			signUpPassword: process.env.VUE_APP_DEFAULT_SIGNUP_PASSWORD || '',
			signUpRememberMe: false
		}
	},
	created(){
		this.accountStore.checkGithubLogin();
		this.accountStore.checkLogin();
		this.refreshAppData();
	},
	computed: {
		username(){
			return this.accountStore.user.username || this.accountStore.user.githubProfile.login;
		},
		avatarUrl(){
			return this.accountStore.user.avatar || this.accountStore.user?.githubProfile?.avatar_url || 'https://placehold.co/300/300';
		}
	},
	methods: {
		async handleLogin(){
			var success = await this.accountStore.loginWithPassword(this.loginUsername, this.loginPassword, this.loginRememberMe);
			if(success){
				this.refreshAppData();
			}else{
				this.resetAppData();
			}
		},
		async handleSignUp(){
			var success = await this.accountStore.signUpWithPassword(this.signUpUsername, this.signUpPassword, this.signUpEmail, this.signUpRememberMe);
			if(success){
				this.refreshAppData();
			}else{
				this.resetAppData();
			}
		},
		async handleLogout(){
			var success = await this.accountStore.logout();
			if(success){
				this.resetAppData();
			}
		},
		resetAppData(){
			this.snippetStore.resetSnippets();
			this.tagStore.resetTags();
			this.languageStore.resetLanguages();
			this.accountStore.resetAccount();
		},
		refreshAppData(){
			this.snippetStore.fetchSnippets();
			this.tagStore.fetchTags();
			this.languageStore.fetchLanguages();
			this.accountStore.fetchAccount();
		}
	}
}
</script>
<template>
	<div>

		<div v-if="!accountStore.loggedIn">
			<b-button id="show-btn" @click="$bvModal.show('sign-in-modal')">Login</b-button>
			
			<b-modal id="sign-in-modal" body-class="p-0" ref="modal" hide-footer hide-header>
				<b-tabs content-class="mt-3" fill>
					<b-tab title="Sign in" class="p-3" title-link-class="p-3" active>
						<div class="d-block text-center mb-3">
							<h3>Sign in with email</h3>
						</div>
						<b-form class="mt-3" @submit.prevent="handleLogin">
							<b-form-group>
								<b-input-group>
									<b-input-group-prepend>
										<span class="input-group-text">
											<i class="fa-solid fa-circle-user"></i>
										</span>
									</b-input-group-prepend>
									<b-form-input class="LoginInput" size="lg" placeholder="Username or email" v-model="loginUsername"></b-form-input>
								</b-input-group>
							</b-form-group>
							
							<b-form-group>
								<b-input-group>
									<b-input-group-prepend>
										<span class="input-group-text">
											<i class="fa-solid fa-lock"></i>
										</span>
									</b-input-group-prepend>
									<b-form-input class="LoginInput" size="lg" placeholder="Password" v-model="loginPassword"></b-form-input>
								</b-input-group>
							</b-form-group>
							
							
							<b-row align-h="between" class="mt-2">
								<b-col cols="4">
									<b-form-checkbox
										v-model="loginRememberMe"
									>
										Remember me
									</b-form-checkbox>
								</b-col>
								<b-col cols="4">
									<a href="#">Forgot password ?</a>
								</b-col>
							</b-row>
							
							<b-row class="mt-3">
								<b-col cols="12">
									<b-button class="w-100" type="submit" variant="success">LOGIN</b-button>
								</b-col>
							</b-row>
							
							<b-row align-h="center" class="pt-3 pb-0">
								<p class="text-center mt-2 w-75">Don't have an account? <a href="#">Sign up</a></p>
							</b-row>
							
						</b-form>
						
						<hr class="hr-text mt-0" data-content="or">
					
						<!--<b-button squared class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>-->
						<b-row align-h="center">
							<b-button v-bind:href="'https://github.com/login/oauth/authorize?client_id=' + accountStore.githubClientId + '&redirect_uri=' + accountStore.githubRedirectURI + '&state=' + accountStore.githubState" class="w-50" variant="dark" block>
								<i class="fa-brands fa-github-alt ml-1"></i>
								GitHub
							</b-button>
						</b-row>
						
						<b-row class="pb-0" align-h="center">
							<p class="text-center mt-2 w-75">By creating this account you agree to our <a href="#">Privacy Policy</a> & <a href="#">Cookie Policy</a></p>
						</b-row>
					</b-tab>
					<b-tab title="Sign up" class="p-3" title-link-class="p-3">
						<div class="d-block text-center mb-3">
							<h3>Sign up</h3>
						</div>
						<b-form class="mt-3" @submit.prevent="handleSignUp">
							<b-form-group>
								<b-input-group>
									<b-input-group-prepend>
										<span class="input-group-text">
											<i class="fa-solid fa-circle-user"></i>
										</span>
									</b-input-group-prepend>
									<b-form-input class="LoginInput" size="lg" placeholder="Username" v-model="signUpUsername"></b-form-input>
								</b-input-group>
							</b-form-group>
							
							<b-form-group>
								<b-input-group>
									<b-input-group-prepend>
										<span class="input-group-text">
											<i class="fa-solid fa-envelope"></i>
										</span>
									</b-input-group-prepend>
									<b-form-input class="LoginInput" size="lg" placeholder="Email address" v-model="signUpEmail"></b-form-input>
								</b-input-group>
							</b-form-group>
							
							<b-form-group>
								<b-input-group>
									<b-input-group-prepend>
										<span class="input-group-text">
											<i class="fa-solid fa-lock"></i>
										</span>
									</b-input-group-prepend>
									<b-form-input class="LoginInput" size="lg" placeholder="Password" v-model="signUpPassword"></b-form-input>
								</b-input-group>
							</b-form-group>
							
							
							<b-row align-h="between" class="mt-2">
								<b-col cols="4">
									<b-form-checkbox
										v-model="signUpRememberMe"
									>
										Remember me
									</b-form-checkbox>
								</b-col>
								<b-col cols="4">
									<a href="#">Forgot password ?</a>
								</b-col>
							</b-row>
							
							<b-row class="mt-3">
								<b-col cols="12">
									<b-button class="w-100" type="submit" variant="success">SIGN UP</b-button>
								</b-col>
							</b-row>
							
						</b-form>
						
						<hr class="hr-text mt-3" data-content="or">
					
						<!--<b-button squared class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>-->
						<b-row align-h="center">
							<b-button v-bind:href="'https://github.com/login/oauth/authorize?client_id=' + accountStore.githubClientId + '&redirect_uri=' + accountStore.githubRedirectURI + '&state=' + accountStore.githubState" class="w-50" variant="dark" block>
								<i class="fa-brands fa-github-alt ml-1"></i>
								GitHub
							</b-button>
						</b-row>
						
						<b-row class="pb-0" align-h="center">
							<p class="text-center mt-2 w-75">By creating this account you agree to our <a href="#">Privacy Policy</a> & <a href="#">Cookie Policy</a></p>
						</b-row>
					</b-tab>
				</b-tabs>
			</b-modal>
		</div>
		
		<b-dropdown v-else size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
			<template #button-content>
				<b-avatar v-bind:src="avatarUrl"></b-avatar>
				<i class="fa-solid fa-chevron-down"></i><span class="sr-only">Profile options</span>
			</template>
			<b-dropdown-item href="#">See Profile</b-dropdown-item>
			<b-dropdown-item href="#" @click="handleLogout">Log out</b-dropdown-item>
		</b-dropdown>
		<p v-if="accountStore.loggedIn">{{username}}</p>
	</div>

</template>
<style scoped>
	.hr-text {
		line-height: 1em;
		position: relative;
		outline: 0;
		border: 0;
		color: black;
		text-align: center;
		height: 1.5em;
		opacity: .5;
		&:before {
			content: '';
			background-color: #818078;
			position: absolute;
			left: 0;
			top: 50%;
			width: 100%;
			height: 1px;
		}
		&:after {
			content: attr(data-content);
			position: relative;
			display: inline-block;
			color: black;
			
			padding: 0 .5em;
			line-height: 1.5em;
			color: #818078;
			background-color: #fcfcfa;
		}
	}
</style>