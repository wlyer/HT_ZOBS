import {PURVIEWLIST,PURVIEWINFO} from './types'
	  
export default {
	[PURVIEWLIST](state,data) {
			state.purviewList = data;
	},
	[PURVIEWINFO](state,data){
			state.purviewInfo = data;
	},
}
