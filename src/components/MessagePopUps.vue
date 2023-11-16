<script>
import { useMessageStore } from '@/stores/message.js'

export default {
	setup(){
		const messageStore = useMessageStore();

		return { messageStore };
	},
	data() {
		return {
			variants : {
				debug : 'info',
				error : 'danger'
			}
		}
	},
	methods : {
		getType: function(message){
			return Object.keys(message)[0];
		}
	}
}
</script>

<template>
	<div class="w-50 mx-auto position fixed-top">
		<b-alert v-for="m in messageStore.getMessages" :key="m" :show="3" fade :variant="variants[getType(m)]" class="mt-3 ml-3 mr-3">
			<b>{{ getType(m) }} : </b>{{ Object.values(m)[0] }}
		</b-alert>
	</div>
</template>
<style lang="scss" scoped>
	.alert b{
		text-transform: capitalize;
	}
</style>