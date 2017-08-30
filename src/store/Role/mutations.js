import {ROLELIST,ROLEINFO} from './types'
	  
export default {
		[ROLELIST](state,data) {
				state.roleList = data;
		},
		[ROLEINFO](state,data){
				state.roleInfo = data;
		},
}
