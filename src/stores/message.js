import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
	state: () => ({
		messages : []
	}),
	getters: {
		getMessages: (state) => {
			return state.messages;
		},
	},
	actions: {
		error(message){
			this.messages.push({ error : message });
		},
		debug(message){
			if(process.env.VUE_APP_DEBUG_LOGS_ON == 'development'){
				console.log('-- DEBUG -- : ' + message);
			}
		}
	}
})

