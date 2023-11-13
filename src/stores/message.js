import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
	state: () => ({
		messages : []
	}),
	getters: {
		getMessages: function(state){
			if(process.env.NODE_ENV != 'development'){
				return state.messages.filter((m) => {
					return !m.debug;
				});
			}
			return state.messages;
		}
	},
	actions: {
		error(message){
			this.messages.push({ error : message });
		},
		debug(message){
			this.debug.push({ debug : message });
		}
	}
})

