<template>
	<el-dialog title="权限详情" :visible.sync="dialogFormVisible1" size="tiny" class="purview-info" :before-close="hiddenInfo">
	  	<div class="line"></div>
	  	<!--编辑界面-->
		<el-form  label-width="32%" >
			<el-form-item label="权限编号：">
				<div class="content-info">{{purviewInfo.purviewId}}</div>
			</el-form-item>
			<el-form-item label="权限名称：">
				<div class="content-info">{{purviewInfo.purviewName}}</div>
			</el-form-item>
			<el-form-item label="规则：">
				<div class="content-info">{{purviewInfo.purviewRule}}</div>
			</el-form-item>
			<el-form-item label="备注：" >
				<div class="content-info">{{purviewInfo.purviewDesc}}</div>
			</el-form-item>
		</el-form>
	    <div slot="footer" class="dialog-footer">
	    	<el-button type="primary"  @click="hiddenInfo">返 回</el-button>
	    </div>
	</el-dialog>
</template>

<script>
  	import { mapGetters } from 'vuex'
	export default {
		props: [
			'purviewInfo',
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
.purview-info{
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

