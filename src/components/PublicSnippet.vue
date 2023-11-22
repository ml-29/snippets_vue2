<script>
import { useSnippetStore } from '@/stores/snippet.js'
import { useAccountStore } from '@/stores/account.js'
import CodeEditor from '@/components/CodeEditor.vue'

export default {
	setup(){
		const snippetStore = useSnippetStore();
		const accountStore = useAccountStore();
		
		return { snippetStore, accountStore };
	},
	components: {
		CodeEditor
	},
	data(){
		return {
			snippet: null
		}
	},
	created(){
		this.getSnippet();
	},
	methods: {
		async getSnippet(){
			var s = await this.snippetStore.fetchSnippet(this.$route.params.id);
			this.snippet = s;
		},
		async copyPartContent(part){
			await navigator.clipboard.writeText(part.content);
		},
		downloadPartContent(part){
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(part.content));
			element.setAttribute('download', part.title);
			
			element.style.display = 'none';
			document.body.appendChild(element);
			
			element.click();
			
			document.body.removeChild(element);
		},
		getCopyIconId(partId){
			return 'copy' + partId;
		},
		getCopyTooltipId(partId){
			return 'copytooltip' + partId;
		},
		hideTooltipAfterSeconds(id){
			setTimeout(() => {
				this.$root.$emit('bv::hide::tooltip', id);
      }, 800);
		}
	}
}
</script>

<template>
	<b-container class="h-100 bg-light p-0" fluid>
		<b-navbar toggleable="lg" type="dark" variant="info">
			<b-navbar-brand href="#">Snippets</b-navbar-brand>
	
		</b-navbar>
		
		<b-container fluid="md" class="p-3">
			<template v-if="snippet">
				<b-row class="ml-0 mb-2">
					<b-avatar class="mr-2" :src="accountStore.avatarUrl(snippet.User)" size="md" :text="accountStore.initials(snippet.User)"></b-avatar>
					<b-col class="align-items-center">
						<b-row class="text-primary font-weight-bold">{{snippet.User.username}}</b-row>
						<b-row class="cursor-on-hover text-darker" style="font-size: 0.8em">{{snippet.createdAt | completeDateHour }}</b-row>
					</b-col>
				
				</b-row>
				
				
				<div class="bg-white p-3">
					<h1 class="mb-3">{{snippet.title}}</h1>
					<b-card v-for="part in snippet.parts" class="mt-3" :key="part.id" header-class="pl-3 pr-3 pt-2 pb-2">
						<template #header>
							<b-row class="text-primary align-items-center">
								<b-col>
									<h2>{{part.title}}</h2>
								</b-col>
								<b-col cols="auto">
									<font-awesome-icon :id="getCopyIconId(part.id)" class="mr-1 cursor-on-hover" :icon="['fas', 'copy']" @click="copyPartContent(part)"/>
									<b-tooltip :target="getCopyIconId(part.id)" @shown="hideTooltipAfterSeconds(getCopyIconId(part.id))" triggers="click">
										Copied !
									</b-tooltip>
									<font-awesome-icon class="cursor-on-hover" :icon="['fas', 'download']" @click="downloadPartContent(part)"/>
								</b-col>
							</b-row>
						</template>
						<b-card-body class="p-0">
							<CodeEditor :code="part.content" :language="part.Language.name" read-only/>
						</b-card-body>
					</b-card>
				</div>
			</template>
			<template v-else>
				<div class="bg-white p-3 align-items-center">
					<font-awesome-icon class="mr-2" :icon="['fas', 'lock']" /> This snippet is private
				</div>
			</template>
			
			
		</b-container>
		
	</b-container>
</template>
<style>
	h1{
		font-size: 1.1em;
	}
	h2{
		font-size: 1em;
		margin-bottom: 0;
	}
</style>