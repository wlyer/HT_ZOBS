import {get,post, del} from '../../api/api'
import {ADDBOOK, GETBYPAGE, REMOVEBOOK, BATCHREMOVEBOOK, GETBYID} from './mutation_types'
export default {
	
	addBook({commit},params) {
		return new Promise((resolve, reject) => {
			post('book/addBook',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	editBook({commit},params) {
		return new Promise((resolve, reject) => {
			post('book/editBook',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	getByPage({commit},params) {
		return new Promise((resolve, reject) => {
			get('book/getByPage',params)
	        .then(res => {
	        	commit(GETBYPAGE, res);
	            resolve(res);
	        })
	    });
	},
	
	removeBook({commit},params) {
		return new Promise((resolve, reject) => {
			del('book/deleteBooks',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	
	getById({commit},params) {
		return new Promise((resolve, reject) => {
			get('book/getBookByBookId',params)
	        .then(res => {
	        	commit(GETBYID, res);
	            resolve(res);
	        })
	    });
	},
	
	getBooksByBookTypeId({commit},params) {
		return new Promise((resolve, reject) => {
			get('book/getBooksByTypeId',params)
	        .then(res => {
	        	commit(GETBYPAGE, res);
	            resolve(res);
	        })
	    });
	},
	changeState({commit},params) {
		return new Promise((resolve, reject) => {
			post('book/changeState',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	}
}

