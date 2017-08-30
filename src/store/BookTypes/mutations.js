import {GETTREE, GETBYID,BOOKTYPELIST} from './mutation_types'
	  
export default {
		[GETTREE](state,data) {
			state.bookTypeTree = data;
		},
		[GETBYID](state,data) {
			state.bookTypeById = data;
		},
		[BOOKTYPELIST](state,data) {
			state.bookTypeList = data;
		}
}
