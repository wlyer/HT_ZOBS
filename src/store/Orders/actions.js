import {get, post, del} from '../../api/api'
import {GETORDERBYPAGE, GETBOOKSBYORDERID, GETORDERBYID } from './mutation_types'
export default {
	getOrderByPage({commit},params) {
		return new Promise((resolve, reject) => {
			get('order/getByPage',params)
	        .then(res => {
	        	commit(GETORDERBYPAGE, res);
	            resolve(res);
	        })
	    });
	},
	deleteOrderByIds({commit},params) {
		return new Promise((resolve, reject) => {
			del('order/deleteOrder',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	getBooksByOrderId({commit},params) {
		return new Promise((resolve, reject) => {
			get('order/getDetailByOrderId',params)
	        .then(res => {
	        	commit(GETBOOKSBYORDERID, res);
	            resolve(res);
	        })
	    });
	
	},
	getOrderById({commit},params) {
		return new Promise((resolve, reject) => {
			get('order/getOrderByOrderId',params)
	        .then(res => {
	        	commit(GETORDERBYID, res);
	            resolve(res);
	        })
	    });
	},
	editOrder({commit},params) {
		return new Promise((resolve, reject) => {
			post('order/editOrder',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	changeOrderState({commit},params) {
		return new Promise((resolve, reject) => {
			post('order/changeOrderState',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	}
}

