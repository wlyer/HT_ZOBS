<template>
	<section class="add-role">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 20px;">新增角色</span>
		  </div>
		  <div class="text item">
		    <!--新增界面-->
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色编号" prop="roleId">
					<el-input v-model="addForm.roleId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色状态" prop="state">
				    <el-select v-model="addForm.state" placeholder="请选择状态类型">
					    <el-option label="启用" value="1"></el-option>
					    <el-option label="停用" value="0"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="角色权限" prop="purviews">
				    <el-select v-model="addForm.purviews" multiple placeholder="请选择角色权限">
					    <el-option
					      v-for="(item,index) in purviewList.list"
					      :key="index"
					      :label="item.purviewName"
					      :value="item.purviewId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="roleDesc">
					<el-input type="textarea" v-model="addForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="footer-button">
				<el-button @click.native="back">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		  </div>
		</el-card>
	</section>
</template>

<script>
  	import { mapGetters } from 'vuex'
	export default {
		computed: {
		 ...mapGetters([
		 		'purviewList',
		 		'roleList'
   			])
	    },
		data() {
			//角色编号重复校验
			const validateRoleId = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入角色编号'));
		        } else {
		        	let isPass = false;
		        	this.roleList.list.map(item=>{
						if(item.roleId == value.trim()){
							isPass = true;
							return;
						}
					})
		        	isPass? callback(new Error('角色编号已存在！')): callback();
		        }
		    };
		    //角色名称限制
			const validateRoleName = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请输入角色名称'));
		        }
		        if (value == '超级管理员'){
		        	callback(new Error('角色名称不能是超级管理员'));
		        }
		        callback();
		    };
			return {
				addLoading:false,
				addFormRules: {
					roleId: [
						{ required: true, validator: validateRoleId, trigger: 'blur' }
					],
					roleName: [
						{ required: true,  validator: validateRoleName, trigger: 'blur' },
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					roleId:'',
					roleName: '',
					roleDesc:'',
					purviews:'',
					state:''
				}
			}
		},
		methods: {
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							this.$store.dispatch('addRole',para).then((res) => {  
								this.addLoading = false;
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
								this.$refs['addForm'].resetFields();
								this.$router.push({ path: '/system/role' });
					        });  
						});
					}
				});
			},
			//返回
			back(){
				this.$refs.addForm.resetFields();
				this.$router.go(-1);
			},
		},
		mounted() {
			this.$store.dispatch('getPurviewList',{pageNum:1,pageSize:9999,keyWord:''});
			this.$store.dispatch('getRoleList',{pageNum:1,pageSize:9999,keyWord:''});
		},
		components: {
		}
	}
</script>

<style scoped>
.footer-button{
	text-align: center;
}
.add-role{
	padding-top: 50px;
	width:600px;
    margin: auto;
}
.clearfix{
	text-align: center;
}
</style>
