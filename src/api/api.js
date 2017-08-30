import axios from 'axios';
import {Host} from './Host';
//import { Loading } from 'element-ui';
let user = sessionStorage.getItem('user')?JSON.parse(sessionStorage.getItem('user')):'';
var api = axios.create({
    headers: {
    	'user_id':user.userCode,
    	'content-type': 'application/json;charset=utf-8'
    },
    baseURL:`${Host}`,
});
export function post(url, params) {
	//let loadingInstance = Loading.service({ fullscreen: true,text:'拼命加载中' });
    return new Promise((resolve, reject) => {
        api.post(url, params)
        .then(response => {
            resolve(response.data);
            //延迟加载
           /* setTimeout(() => {
		     	loadingInstance.close();
		    }, 600);*/
        })
        .catch((error) => {
          console.log(error)
           reject(error)
        })
    })
}

export function get(url, params) {
	//let loadingInstance = Loading.service({ fullscreen: true,text:'拼命加载中' });
	return new Promise((resolve, reject) => {
        api.get(url, {params: params})
        .then(response => {
            resolve(response.data);
         	//延迟加载
            /*setTimeout(() => {
		     	loadingInstance.close();
		    }, 600);*/
        })
        .catch((error) => {
          console.log(error)
           reject(error)
        })
    });
}

export function del(url, params) {
	//let loadingInstance = Loading.service({ fullscreen: true,text:'拼命加载中' });
	return new Promise((resolve, reject) => {
        api.delete(url, {params: params})
        .then(response => {
            resolve(response.data);
         	//延迟加载
            /*setTimeout(() => {
		     	loadingInstance.close();
		    }, 600);*/
        })
        .catch((error) => {
          console.log(error)
           reject(error)
        })
    });
}




