export default {
	getOrderByPage: (state) => {
		return state.orderList;
	},
	getBooksByOrderId: (state)=> {
		return state.getBooksByOrderId;
	},
	getOrderById: (state)=> {
		return state.getOrderById;
	}
}
