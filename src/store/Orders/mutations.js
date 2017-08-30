import {GETORDERBYPAGE, GETBOOKSBYORDERID, GETORDERBYID} from './mutation_types'
	  
export default {
		[GETORDERBYPAGE](state,data) {
				state.orderList = data;
		},
		[GETBOOKSBYORDERID](state,data) {
			state.getBooksByOrderId = data;
		},
		[GETORDERBYID](state,data){
			state.getOrderById = data;
		}
}
