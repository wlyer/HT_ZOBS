import actions from './actions.js';
import mutations from './mutations.js';
import getters from './getters.js';
//初始化状态
const state = {
	reclaimList: [],//分页获取回收单
	reclaimInfo:'',//回收单信息
}
export default {
    state,
    getters,
    actions,
    mutations
}