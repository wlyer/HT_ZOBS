import {USERLIST,USERINFO} from './types'
	  
export default {
		[USERLIST](state,data) {
				state.userList = data;
		},
		[USERINFO](state,data){
				state.userInfo = data;
		},
}
