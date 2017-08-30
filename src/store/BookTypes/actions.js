import {get, post, del} from '../../api/api'
import {GETTREE, GETBYID,BOOKTYPELIST} from './mutation_types'
export default {
	//获取分类树
	getBookTypeTree({commit},params) {
		return new Promise((resolve, reject) => {
			get('bookType/getTree',params)
	        .then(res => {
	        	commit(GETTREE, res);
	            resolve(res);
	        })
	    });
	},
	//获取分类列表
	getBookType({commit},params) {
		return new Promise((resolve, reject) => {
			get('bookType/getByPage',params)
	        .then(res => {
	        	commit(BOOKTYPELIST, res);
	            resolve(res);
	        })
	    });
	},
	//通过typeId获取
	getBookTypeById({commit},params) {
		return new Promise((resolve, reject) => {
			get('bookType/getBookTypeByTypeId',params)
	        .then(res => {
	        	commit(GETBYID, res);
	            resolve(res);
	        })
	    });
	},
	//通过id删除
	deleteBookTypeById({commit},params) {
		return new Promise((resolve, reject) => {
			del('bookType/deleteBookType',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//修改分类
	editBookType({commit},params) {
		return new Promise((resolve, reject) => {
			post('bookType/editBookType',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//新增分类
	addBookType({commit},params) {
		return new Promise((resolve, reject) => {
			post('bookType/addBookType?level='+params.level,params.bookType)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
}
