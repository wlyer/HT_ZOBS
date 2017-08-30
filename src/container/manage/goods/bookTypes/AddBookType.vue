<template>
	<el-dialog title="新增分类" :visible="isVisible" :before-close="closeDialog" :close-on-click-modal="false" class="bookType-dialog">
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
export default {
	props: [
		'isVisible',
		'baseBookTypeId',
		'addLevel'
	],
	data() {
		return{
			addLoading: false,
			bookTypeForm: {
			typeId: '001004',
			typeName: '',
			typeDesc: '',
			},
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
	methods: {
		//新增
		onSubmit: function () {
			this.$refs.bookTypeForm.validate((valid) => {
				if (valid) {
					this.addLoading = true;
					let bookTypeJson = Object.assign({}, this.bookTypeForm, {parent: this.baseBookTypeId});
					let para = {bookType:bookTypeJson,level:this.addLevel}
					this.$store.dispatch('addBookType',para).then((res)=> {
						this.addLoading = false;
						this.$message({
							message: '提交成功',
							type: 'success'
						});
						this.$refs['bookTypeForm'].resetFields();
						this.closeDialog();
						this.$router.push({ path: '/goods/book'});
					});
				}
			});
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