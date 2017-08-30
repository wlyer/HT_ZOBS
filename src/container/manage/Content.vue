<template>
    <el-col :span="24" class="content-wrapper">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</el-col>
</template>
<script>
    export default {
        name: 'content',
        data () {
            return {
                
            }
        },
        methods:{
            
        },
        created(){
            
        },
        mounted(){

        }
    }
</script>

<style scoped lang="scss">
	@import '~scss_vars';
</style>