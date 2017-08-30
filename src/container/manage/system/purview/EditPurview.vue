<template>
	<section class="edit-auth">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 20px;">编辑权限</span>
		  </div>
		  <div>
		<!--编辑界面-->
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="权限编号">
					<el-input v-model="editForm.purviewId" readonly auto-complete="off"></el-input><!-- input中加入autocomplete="off" 来关闭记录,默认on -->
				</el-form-item>
				<el-form-item label="权限名称">
					<el-input v-model="editForm.purviewName"></el-input>
				</el-form-item>
				<el-form-item label="规则">
					<el-input v-model="editForm.purviewRule"></el-input>
				</el-form-item>
				<el-form-item label="权限状态" prop="state">
				    <el-select v-model="editForm.state" placeholder="请选择状态类型">
					    <el-option label="启用" value="1"></el-option>
					    <el-option label="停用" value="0"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="备注" >
					<el-input type="textarea" v-model="editForm.purviewDesc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="footer-button">
				<el-button @click.native="back()">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
			</div>
		</el-card>
	</section>
	
</template>

<script>
	import util from '../../../../util/util'
  	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				editFormRules: {
					purviewName: [
						{ required: true, message: '请输入权限名称', trigger: 'blur' }
					],
					purviewRule: [
						{ required: true, message: '请输入规则', trigger: 'blur' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					]
				},
				//修改界面数据
				editForm: {
					purviewId:'',
					purviewName:'',
					purviewRule: '',
					purviewDesc: '',
					state:''
				}
			}
		},
		methods: {
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let para = Object.assign({}, this.editForm);
							para.createDate = (!para.createDate || para.createDate == '') ? '' : util.formatDate.format(new Date(para.createDate), 'yyyy-MM-dd');
							this.$store.dispatch('editPurview',para).then((res) => {  
								if(res.status==200){
									this.$message({
										message: res.msg,
										type: 'success'
									});
								}else{
									this.$message({
										message: res.msg,
										type: 'error'
									});
								}
								this.$refs['editForm'].resetFields();
								this.$router.push({ path: '/system/purview' });
					        });
						});
					}
				});
			},
			//返回
			back(){
				this.$refs.editForm.resetFields();
				this.$router.go(-1);
			},
		},
		computed: {
		 ...mapGetters([
			'purviewInfo'
	   		 ]),
	    },
		mounted() {
			const id=this.$route.query.id;
			this.$store.dispatch('getPurview',{purviewId:id}).then((res)=>{
				this.editForm = Object.assign( res,{state:res.state.toString()});
			});
		},
		components: {
		}
	}
</script>

<style scoped>
.footer-button{
	text-align: center;
}
.edit-auth{
	padding-top: 50px;
	width:600px;
    margin: auto;
}
.clearfix{
	text-align: center;
}
</style>
