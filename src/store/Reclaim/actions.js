import {get,post, del} from '../../api/api'
import {
	RECLAIMLIST,
	RECLAIMINFO,
} from './mutation_types'

export default {
    //分页获取回收单
    getReclaimByPage: ({commit}, params)=> {
    	return new Promise((resolve, reject) => {
			get('reclaim/getByPage',params)
	        .then(res => {
	        	commit(RECLAIMLIST,res);
	            resolve(res);
	        })
	    }); 
    },
    //修改回收单状态
    changeReclaimState: ({commit}, params)=> {
    	return new Promise((resolve, reject) => {
			get('reclaim/changeReclaimState',params)
	        .then(res => {
	            resolve(res);
	        })
	    }); 
    },
    //删除回收单
    deleteByReclaimId: ({commit}, params)=> {
    	return new Promise((resolve, reject) => {
			del('reclaim/deleteByReclaimId',params)
	        .then(res => {
	            resolve(res);
	        })
	    });
    },
    //根据id获取回收单
    getReclaimById: ({commit}, params)=> {
    	return new Promise((resolve, reject) => {
			get('reclaim/queryRetrieveById',params)
	        .then(res => {
	        	commit(RECLAIMINFO,res);
	            resolve(res);
	        })
	    }); 
    },
    //修改回收单
    editReclaim: ({commit}, params)=> {
    	return new Promise((resolve, reject) => {
			post('reclaim/editReclaim',params)
	        .then(res => {
	            resolve(res);
	        })
	    });  
    }
}

