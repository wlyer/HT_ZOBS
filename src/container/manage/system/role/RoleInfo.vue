<template>
	<!--角色详情 -->
	<el-dialog title="角色详情" :visible.sync="dialogFormVisible1"  size="tiny" class="role-info" :before-close="hiddenInfo">
    	<div class="line"></div>
    	<!--角色详情-->
		<el-form  label-width="32%">
			<el-form-item label="角色编号：">
				<div class="content-info">{{roleInfo.roleId}}</div>
			</el-form-item>
			<el-form-item label="角色名称：">
				<div class="content-info">{{roleInfo.roleName}}</div>
			</el-form-item>
			<el-form-item label="角色权限：">
				<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="content-info" :title="roleInfo.purviews">{{roleInfo.purviews}}</div>
			</el-form-item>
			<el-form-item label="角色状态：">
				<div class="content-info">{{roleInfo.state==1?'启用':'停用'}}</div>
			</el-form-item>
			<el-form-item label="备注：">
				<div class="content-info">{{roleInfo.roleDesc}}</div>
			</el-form-item>
			
		</el-form>
  		<div slot="footer" class="dialog-footer">
	    	<el-button type="primary" @click="hiddenInfo">确 定</el-button>
	  	</div>
	</el-dialog>
</template>

<script>
  	import { mapGetters } from 'vuex'
	export default {
		props: [
			'roleInfo',
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
.role-info{
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
