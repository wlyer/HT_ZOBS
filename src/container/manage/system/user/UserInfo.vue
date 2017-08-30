<template>
	 <!--用户详情-->
		<el-dialog title="用户详情" :visible.sync="dialogFormVisible1" size="tiny" class="user-info" :before-close="hiddenInfo">
	        <div class="line"></div>
	        <el-form label-width="32%" >
	            <el-form-item label="用户账号：">
					<div class="content-info">{{userInfo.userCode}}</div>
				</el-form-item>
				<el-form-item label="用户名称：">
					<div class="content-info">{{userInfo.userName}}</div>
				</el-form-item>
				<el-form-item label="手机号：">
					<div class="content-info">{{userInfo.phone}}</div>
				</el-form-item>
				<el-form-item label="用户邮箱：">
					<div class="content-info">{{userInfo.email}}</div>
				</el-form-item>
				<el-form-item label="用户状态：">
				   <div class="content-info">{{userInfo.state=='1'?'启用':'停用'}}</div>
				</el-form-item>
				<el-form-item label="用户角色：">
				    <div class="content-info">{{userInfo.roles}}</div>
				</el-form-item>
				<el-form-item label="常用地址：">
					<div class="content-info">{{userInfo.address}}</div>
				</el-form-item>
	        </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="hiddenInfo">确 定</el-button>
	        </span>
	    </el-dialog>
</template>

<script>
  	import { mapGetters } from 'vuex'
	export default {
		props: [
			'userInfo',
			'dialogFormVisible'
		],
		data() {
			return {
				dialogFormVisible1:false,
			}
		},
		methods: {
			//隐藏子组件
			hiddenInfo() {
                this.$emit('hiddenInfo', false);
            }
		},
		computed: {
		 ...mapGetters([
	   		 ])
	    },
		mounted() {
		},
		components: {
		},
		watch:{
			dialogFormVisible(){
				return this.dialogFormVisible1 = this.dialogFormVisible;
			}
		}
	}
</script>
<style scoped lang="scss">
.user-info{
	.line {
	    border-bottom: 1px solid #e4e4e4;
        margin-top: -17px;
        margin-bottom: 20px;
	}
	.content-info{
		border-bottom: 1px solid;
	    width: 80%;
	    text-align: center;
        height: 30px;
	}
}
</style>

