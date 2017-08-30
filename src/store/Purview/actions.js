import {PURVIEWLIST,PURVIEWINFO} from './types'
import {get,post,del} from '../../api/api'

export default {
	//获取所有
	getPurviewList({commit},params){
		return new Promise((resolve, reject) => {
			get('purview/getByPage',params)
	        .then(res => {
	        	commit(PURVIEWLIST, res)
	            resolve(res);
	        })
	    });
	},
	
	//获取权限信息
	getPurview({commit},params){
		return new Promise((resolve, reject) => {
			get('purview/getPurviewByPurviewId',params)
	        .then(res => {
	        	commit(PURVIEWINFO, res)
	            resolve(res);
	        })
	    });
	},
	
	//新增
	addPurview({commit},params){
		return new Promise((resolve, reject) => {
			post('purview/addPurview',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//修改
	editPurview({commit},params){
		delete params.updateDate;
		return new Promise((resolve, reject) => {
			post('purview/eidtPurview',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//删除
	removePurviews({commit},params){
		return new Promise((resolve, reject) => {
			del('purview/deletePurviews',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//启用or停用
	changePurviewState({commit},params){
		return new Promise((resolve, reject) => {
			get('purview/changePurviewState',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
}

