import {USERLIST,USERINFO} from './types'
import {get,post,del} from '../../api/api'

export default {
	//获取所有
	getUserList({commit},params){
		return new Promise((resolve, reject) => {
			get('user/getByPage',params)
	        .then(res => {
	        	commit(USERLIST, res)
	            resolve(res);
	        })
	    });
	},
	
	//获取用户信息
	getUser({commit},params){
		return new Promise((resolve, reject) => {
			get('user/getUserByUserCode',params)
	        .then(res => {
	        	commit(USERINFO, res)
	            resolve(res);
	        })
	    });
	},
	
	//新增
	addUser({commit},params){
		const roles = params.roles;
		delete params.roles;
		return new Promise((resolve, reject) => {
			post('user/addUser?roles='+roles,params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//修改
	editUser({commit},params){
		const roles = params.roles;
		delete params.roles;
		delete params.updateDate;
		return new Promise((resolve, reject) => {
			post('user/editUser?roleIds='+roles,params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//批量删除
	removeUsers({commit},params){
		return new Promise((resolve, reject) => {
			del('user/deleteUsers',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//启用or停用
	changeUserState({commit},params){
		return new Promise((resolve, reject) => {
			get('user/changeUserState',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//修改密码
	changeUserPsw({commit},params){
		return new Promise((resolve, reject) => {
			post('user/changeUserPsw',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	//登入
	requestLogin({commit},params){
		return new Promise((resolve, reject) => {
			post('user/login',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
	},
	
	//根据状态获取用户
	getUserByState({commit},params){
		return new Promise((resolve, reject) => {
			get('user/getUserByState',params)
	        .then(res => {
	        	commit(USERLIST, res)
	            resolve(res);
	        })
	    });
	},
}

