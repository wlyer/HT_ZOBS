import {
	RECLAIMLIST,
	RECLAIMINFO,
} from './mutation_types'
	  
export default {
	[RECLAIMLIST](state, data) {
        state.reclaimList = data;
    },
    [RECLAIMINFO](state, data) {
        state.reclaimInfo = data;
    },
}
