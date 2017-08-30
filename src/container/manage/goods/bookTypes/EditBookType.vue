<template>
	<el-dialog title="修改分类" :visible="isVisible" :before-close="closeDialog" :close-on-click-modal=false class="bookType-dialog">
		<el-form :model="bookTypeForm" label-width="100px" :rules="bookTypeFormRules" ref="bookTypeForm" class="bookType-form">
			<el-form-item label="分类编号:" prop="typeId">
				<el-input :disabled="true" v-model="bookTypeForm.typeId" auto-complete="off" class="bookType-input"></el-input>
				<span class="bookType-note">(自动生成)</span>
			</el-form-item>
			<el-form-item label="分类名称:" prop="typeName">
				<el-input v-model="bookTypeForm.typeName" auto-complete="off" class="bookType-input"></el-input>
			</el-form-item>
			<el-form-item label="分类描述:">
				<el-input type="textarea" v-model="bookTypeForm.typeDesc" class="bookType-desc"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click.native="closeDialog">取消</el-button>
			<el-button type="primary" @click.native="onSubmit" :loading="addLoading">提交</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	props: [
		'isVisible',
		'booTypeData'
	],
	data() {
		return{
			addLoading: false,
			bookTypeFormRules: {
				typeId: [
					{ required: true, message: '必填项', trigger: 'blur' }
				],
				typeName: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				]
			},
		}
	},
	computed: {
		...mapGetters([
			'bookTypeTree'
   		]),
		bookTypeForm() {
			return {
				typeId: this.booTypeData.typeId? this.booTypeData.typeId: '',
				typeName: this.booTypeData.typeName? this.booTypeData.typeName: '',
				typeDesc: this.booTypeData.typeDesc? this.booTypeData.typeDesc: '',
			}
		}
	},
	methods: {
		//提交
		onSubmit: function () {
			this.$refs.bookTypeForm.validate((valid) => {
				if (valid) {
					this.addLoading = true;
					let para = Object.assign({},this.booTypeData, {createDate:'', updateDate:''}, this.bookTypeForm);
					this.$store.dispatch('editBookType',para).then((res) => {
						this.addLoading = false;
						this.editFormVisible = false;
						if(res.status==200){
							this.$message({
								message: '修改分类成功！',
								type: 'success'
							});
							this.getBookType();//刷新父页面
							this.closeDialog();//关闭窗口
						}else{
							this.$message({
								message: '修改分类失败！',
								type: 'error'
							});
						}
			    	});  
				}
			});
		},
		getBookType() {
			let para = {
				pageNum: this.bookTypeTree.pageNum ? this.getByPage.pageNum : 1,
				pageSize: this.bookTypeTree.pageSize ? this.getByPage.pageSize : 10,
				keyWord: this.bookTypeTree.keyWord ? this.getByPage.keyWord : '',
			};
			this.$store.dispatch('getBookTypeTree',para);
		},
		//触发调用父组件关闭窗口方法
		closeDialog() {
			this.$emit("close");
		}
	}
}
</script>

<style lang="scss" scoped>
.bookType-dialog{
	.bookType-form{
		.bookType-note{
			color: #4db3ff;
			margin-left: 1em;
		}
		.bookType-input{
			width: 40% !important;
		}
		.bookType-desc{
			width:70% !important;
		}
	}
	.dialog-footer{
		text-align: center;
	}
}
</style>