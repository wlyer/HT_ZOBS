import {LOGLIST,LOGINFO} from './types'
import {get,post} from '../../api/api'

export default {
	//获取所有
	getLogList({commit},params){
		return new Promise((resolve, reject) => {
			get('log/getByPage',params)
	        .then(res => {
	        	commit(LOGLIST, res)
	            resolve(res);
	        })
	    });
	},
}

