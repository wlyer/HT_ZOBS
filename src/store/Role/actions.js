import {ROLELIST,ROLEINFO} from './types'
import {get,post,del} from '../../api/api'

export default {
	//获取所有角色
	getRoleList({commit},params){
		return new Promise((resolve, reject) => {
			get('role/getByPage',params)
	        .then(res => {
	        	commit(ROLELIST, res)
	            resolve(res);
	        })
	    });
	},
	
	//获取角色信息
	getRole({commit},params){
		return new Promise((resolve, reject) => {
			get('role/getRoleByRoleId',params)
	        .then(res => {
	        	commit(ROLEINFO, res)
	            resolve(res);
	        })
	    });
	},
	
	//新增
	addRole({commit},params){
		const purviews = params.purviews;
		delete params.purviews;
		return new Promise((resolve, reject) => {
			post('role/addRole?purviews='+purviews,params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//修改
	editRole({commit},params){
		const purviews = params.purviews;
		delete params.purviews;
		delete params.updateDate;
		return new Promise((resolve, reject) => {
			post('role/editRole?purviews='+purviews,params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//批量删除
	removeRoles({commit},params){
		return new Promise((resolve, reject) => {
			del('role/deleteRoles',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//启用or停用
	changeRoleState({commit},params){
		return new Promise((resolve, reject) => {
			get('role/changeRoleState',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	}
}

