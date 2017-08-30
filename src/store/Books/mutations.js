import {GETBYPAGE, GETBYID} from './mutation_types'
	  
export default {
		[GETBYPAGE](state,data) {
			state.bookList = data;
		},
		[GETBYID](state, data) {
			state.bookDataById = data;	
		}
}
