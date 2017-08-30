import {LOGLIST,LOGINFO} from './types'
	  
export default {
		[LOGLIST](state,data) {
				state.logList = data;
		},
		[LOGINFO](state,data){
				state.logInfo = data;
		},
}
