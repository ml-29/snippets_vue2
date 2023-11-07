 <script>
import { useAccountStore } from '@/stores/account.js'
import { useSnippetStore } from '@/stores/snippet.js'
import { useTagStore } from '@/stores/tag.js'
import { useLanguageStore } from '@/stores/language.js'

import $ from 'jquery'

import { library } from '@fortawesome/fontawesome-svg-core'

export default {
	setup(){
		const accountStore = useAccountStore();
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
			loginError: false,
			loginShowPassword: false,
			
			// signup form fields
			signUpEmail: process.env.VUE_APP_DEFAULT_SIGNUP_EMAIL || '',
			signUpUsername: process.env.VUE_APP_DEFAULT_SIGNUP_USERNAME || '',
			signUpPassword: process.env.VUE_APP_DEFAULT_SIGNUP_PASSWORD || '',
			signUpRememberMe: false,
			signUpError: false,
			signUpShowPassword: false
		}
	},
	mounted(){
		this.$nextTick(() => {
			this.$bvModal.show('sign-in-modal');
		});
	},
	computed: {
		username(){
			return this.accountStore.user.username || this.accountStore.user.githubProfile.login;
		},
		avatarUrl(){
			return this.accountStore.user.avatar || this.accountStore.user?.githubProfile?.avatar_url || 'https://placehold.co/300/300';
		},
		signUpEmailOk(){
			var regex = new RegExp(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/,'g');
			return regex.test(this.signUpEmail);
		},
		signUpUsernameOk(){
			var regex = new RegExp(/^[a-z0-9_]+$/,'i');
			return regex.test(this.signUpUsername) && this.signUpUsername.length >= 3;
		},
		signUpPasswordOk(){
			var containsLetters = new RegExp(/(?=.*[a-z])/);
			var containsUppercaseLetters = new RegExp(/(?=.*[A-Z])/);
			var containsNumbers = new RegExp(/(?=.*[0-9])/);
			var containsSymbol = new RegExp(/(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])/);
			return this.signUpPassword.length > 8
				&& containsLetters.test(this.signUpPassword)
				&& containsUppercaseLetters.test(this.signUpPassword)
				&& containsNumbers.test(this.signUpPassword)
				&& containsSymbol.test(this.signUpPassword);
		}
	},
	methods: {
		async handleLogin(){
			var success = await this.accountStore.loginWithPassword(this.loginUsername, this.loginPassword, this.loginRememberMe);
			if(success){
				this.$router.push({ name: 'home' });
			}else{
				this.loginError = 'Unable to login : Wrong username or password';
			}
		},
		async handleSignUp(){
			var success = await this.accountStore.signUpWithPassword(this.signUpUsername, this.signUpPassword, this.signUpEmail, this.signUpRememberMe);
			if(success){
				this.$router.push({ name: 'home' });
			}else{
				this.signUpError = 'Error : Unable to signup';
			}
		}
	}
}
</script>
<template>
	<section class="sticky">
		<b-modal id="sign-in-modal" body-class="p-0" ref="modal" no-close-on-backdrop hide-backdrop centered hide-footer hide-header>
		<b-tabs content-class="mt-3" fill>
			<b-tab title="Sign in" class="p-3" title-link-class="p-3" active>
				<div class="d-block text-center mb-3">
					<h3>Sign in with email</h3>
				</div>
				<b-alert v-if="loginError" show variant="danger">
					{{loginError}}
				</b-alert>
				<b-form class="mt-3" @submit.prevent="handleLogin">
					<b-form-group>
						<b-input-group>
							<b-input-group-prepend>
								<span class="input-group-text">
									<i class="fa-solid fa-circle-user"></i>
								</span>
							</b-input-group-prepend>
							<b-form-input class="LoginInput" size="lg" placeholder="Username or email" v-model="loginUsername" required></b-form-input>
						</b-input-group>
					</b-form-group>
					
					<b-form-group>
						<b-input-group>
							<b-input-group-prepend>
								<span class="input-group-text">
									<i class="fa-solid fa-lock"></i>
								</span>
							</b-input-group-prepend>
							<b-form-input class="LoginInput" size="lg" placeholder="Password" :type="loginShowPassword ? 'text' : 'password'" v-model="loginPassword" required></b-form-input>
							<b-input-group-append class="cursor-on-hover">
								<span class="input-group-text bg-white" @click="loginShowPassword = !loginShowPassword">
									<font-awesome-icon v-if="loginShowPassword" :icon="['fas', 'eye']"/>
									<font-awesome-icon v-else :icon="['fas', 'eye-slash']"/>
								</span>
							</b-input-group-append>
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
							<a href="#" style="visibility: hidden;">Forgot password ?</a>
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
					<b-button v-bind:href="'https://github.com/login/oauth/authorize?client_id=' + this.accountStore.githubClientId + '&redirect_uri=' + this.accountStore.githubRedirectURI + '&state=' + this.accountStore.githubState" class="w-50" variant="dark" block>
						<i class="fa-brands fa-github-alt ml-1"></i>
						GitHub
					</b-button>
				</b-row>
				
				<b-row class="pb-0" align-h="center" style="visibility: hidden;">
					<p class="text-center mt-2 w-75">By creating this account you agree to our <a href="#">Privacy Policy</a> & <a href="#">Cookie Policy</a></p>
				</b-row>
			</b-tab>
			<b-tab title="Sign up" class="p-3" title-link-class="p-3">
				<div class="d-block text-center mb-3">
					<h3>Sign up</h3>
				</div>
				<b-alert v-if="signUpError" show variant="danger">
					{{signUpError}}
				</b-alert>
				<b-form class="mt-3" @submit.prevent="handleSignUp">
					<b-form-group>
						<b-input-group>
							<b-input-group-prepend>
								<span class="input-group-text">
									<i class="fa-solid fa-circle-user"></i>
								</span>
							</b-input-group-prepend>
							<b-form-input class="LoginInput" size="lg" placeholder="Username" v-model="signUpUsername"></b-form-input>
								<b-form-invalid-feedback :state="signUpUsernameOk">
									Username should be at least 3 characters long and contain only letters, numbers and underscores
								</b-form-invalid-feedback>
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
								<b-form-invalid-feedback :state="signUpEmailOk">
									Please enter a valid e-mail address
								</b-form-invalid-feedback>
						</b-input-group>
					</b-form-group>
					
					<b-form-group>
						<b-input-group>
							<b-input-group-prepend>
								<span class="input-group-text">
									<i class="fa-solid fa-lock"></i>
								</span>
							</b-input-group-prepend>
							<b-form-input class="LoginInput" size="lg" placeholder="Password" :type="signUpShowPassword ? 'text' : 'password'" v-model="signUpPassword"></b-form-input>
							<b-input-group-append class="cursor-on-hover">
								<span class="input-group-text bg-white" @click="signUpShowPassword = !signUpShowPassword">
									<font-awesome-icon v-if="signUpShowPassword" :icon="['fas', 'eye']"/>
									<font-awesome-icon v-else :icon="['fas', 'eye-slash']"/>
								</span>
							</b-input-group-append>
							<b-form-invalid-feedback :state="signUpPasswordOk">
								Password should be at least 8 characters long, include numbers, letters (upper and lower case) and at least one symbol among ~`!@#$%^&*()_\-+={[}]|\:;"'&lt;&gt;,.?/
							</b-form-invalid-feedback>
						</b-input-group>
					</b-form-group>
					
					
					<b-row align-h="between" class="mt-2">
						<b-col cols="4">
							<b-form-checkbox v-model="signUpRememberMe">
								Remember me
							</b-form-checkbox>
						</b-col>
						<b-col cols="4">
							<a href="#" style="visibility: hidden;">Forgot password ?</a>
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
				
				<b-row class="pb-0" align-h="center" style="visibility: hidden;">
					<p class="text-center mt-2 w-75">By creating this account you agree to our <a href="#">Privacy Policy</a> & <a href="#">Cookie Policy</a></p>
				</b-row>
			</b-tab>
		</b-tabs>
	</b-modal>
  <div class="bubbles">
      <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    
  </div>
</section>
	

</template>
<style>
	/*bubbles*/
	body,html{
  width:100%;
  height: 100%;
}
body{
  margin:0;
  padding:0;
  background:AntiqueWhite;
}
.bubbles{
  position:absolute;
  width:100%;
  height: 100%;
  z-index:0;
  overflow:hidden;
  top:0;
  left:0;
}
.bubble{
  position: absolute;
  bottom:-100px;
  width:40px;
  height: 40px;
  background:#f1f1f1;
  border-radius:50%;
  opacity:0.5;
  animation: rise 10s infinite ease-in;
}
.bubble:nth-child(1){
  width:40px;
  height:40px;
  left:10%;
  animation-duration:8s;
}
.bubble:nth-child(2){
  width:20px;
  height:20px;
  left:20%;
  animation-duration:5s;
  animation-delay:1s;
}
.bubble:nth-child(3){
  width:50px;
  height:50px;
  left:35%;
  animation-duration:7s;
  animation-delay:2s;
}
.bubble:nth-child(4){
  width:80px;
  height:80px;
  left:50%;
  animation-duration:11s;
  animation-delay:0s;
}
.bubble:nth-child(5){
  width:35px;
  height:35px;
  left:55%;
  animation-duration:6s;
  animation-delay:1s;
}
.bubble:nth-child(6){
  width:45px;
  height:45px;
  left:65%;
  animation-duration:8s;
  animation-delay:3s;
}
.bubble:nth-child(7){
  width:90px;
  height:90px;
  left:70%;
  animation-duration:12s;
  animation-delay:2s;
}
.bubble:nth-child(8){
  width:25px;
  height:25px;
  left:80%;
  animation-duration:6s;
  animation-delay:2s;
}
.bubble:nth-child(9){
  width:15px;
  height:15px;
  left:70%;
  animation-duration:5s;
  animation-delay:1s;
}
.bubble:nth-child(10){
  width:90px;
  height:90px;
  left:25%;
  animation-duration:10s;
  animation-delay:4s;
}
@keyframes rise{
  0%{
    bottom:-100px;
    transform:translateX(0);
  }
  50%{
    transform:translate(100px);
  }
  100%{
    bottom:1080px;
    transform:translateX(-200px);
  }
}
	/*modal*/
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