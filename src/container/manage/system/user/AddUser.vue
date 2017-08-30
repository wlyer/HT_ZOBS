<template>
	<section class="add-user">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 20px;">新增用户</span>
		  </div>
		  <div class="text item">
		    <!--新增界面-->
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户账号" prop="userCode">
					<el-input v-model="addForm.userCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="userPsw">
					<el-input type="password" v-model="addForm.userPsw">
						<template slot="append" v-if="showTexts">
							<font :color="colors">{{showTexts}}</font>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="reUserPsw">
					<el-input type="password" v-model="addForm.reUserPsw"></el-input>
				</el-form-item>
				<el-form-item label="用户名称" prop="userName">
					<el-input v-model="addForm.userName"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="用户邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="用户状态" prop="state">
				    <el-select v-model="addForm.state" placeholder="请选择状态类型">
					    <el-option label="启用" value="1"></el-option>
					    <el-option label="停用" value="0"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="用户角色">
					<el-select v-model="addForm.roles" multiple placeholder="请选择用户角色">
					    <el-option
					      v-for="(item,index) in roleList.list"
					      :key="index"
					      :label="item.roleName"
					      :value="item.roleId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="常用地址" >
					<el-input type="textarea" v-model="addForm.address"></el-input>
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
	import util from '../../../../util/util'
  	import { mapGetters } from 'vuex'
	export default {
		computed: {
		 ...mapGetters([
		 		'roleList',
		 		'userList'
   			])
	    },
		data() {
			//用户名重复校验
			const validateUserCode = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入用户账号'));
		        } else {
		        	let isPass = false;
		        	this.userList.list.map(item=>{
						if(item.userCode == value.trim()){
							isPass = true;
							return;
						}
					})
		        	isPass? callback(new Error('用户账号已存在！')): callback();
		        }
		    };
		    //密码校验
			 const validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
		        	this.passwordStrong(value);
		          if (this.addForm.reUserPsw !== '') {
		            this.$refs.addForm.validateField('reUserPsw');
		          }
		          callback();
		        }
		      };
		      //确认密码校验
		      const validatePass2 = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请再次输入密码'));
		        } else if (value !== this.addForm.userPsw) {
		          callback(new Error('两次输入密码不一致!'));
		        } else {
		          callback();
		        }
		      };
			return {
				addLoading:false,
				showTexts:'',
				colors:'',
				addFormRules: {
					userCode: [
						{ required: true, validator: validateUserCode, trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					userPsw: [
						{ required: true, validator: validatePass, trigger: 'blur' },
						{ min: 6, max: 16, message: '请输入6 到 16位密码', trigger: 'blur' }
					],
					reUserPsw: [
						{ required: true, validator: validatePass2, trigger: 'blur' },
						{ min: 6, max: 16, message: '请输入6 到 16位确认密码', trigger: 'blur' }
					],
					phone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '请输入正确的手机号（例如：13101030301）' , trigger: 'blur' }
					],
					email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址（例如：123456@163.com）', trigger: 'blur' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					userCode:'',
					userPsw: '',
					reUserPsw:'',
					userName:'',
					phone: '',
					email: '',
					state: '',
					roles:'',
					address: ''
				}
			}
		},
		methods: {
			//新增
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							this.$store.dispatch('addUser',para).then((res) => {  
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
								this.$router.push({ path: '/system/user' });
					        });  
						});
					}
				});
			},
			/**
			 * 密码强度校验
			 * param value 密码
			 */
			passwordStrong(value){
				//密码为八位及以上并且字母数字特殊字符三项都包括
		     	const strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
		   		//密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
		     	const mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
		     	const enoughRegex = new RegExp("(?=.{6,}).*", "g");
		     	this.password_length = value.length;
		     	if(value && value.length>5 && value.length<17){
		     		if (strongRegex.test(value)) {
			        	this.showTexts='强';
			        	this.colors='green'
		     		} else if (mediumRegex.test(value)) {
			        	this.showTexts='中';
			        	this.colors='blue'
				     } else {
			        	this.showTexts='弱';
			        	this.colors='red'
				    }
				     
		     	}else{
		        	this.showTexts='';
		     	}
			},
			//返回
			back(){
				this.$refs.addForm.resetFields();
				this.$router.go(-1);
			},
			
		},
		mounted() {
			this.$store.dispatch('getRoleList',{pageNum:1,pageSize:9999,keyWord:''});
			this.$store.dispatch('getUserList',{pageNum:1,pageSize:9999,keyWord:''});
		},
		components: {
		}
	}
</script>

<style scoped>
.footer-button{
	text-align: center;
}
.add-user{
	padding-top: 50px;
	width:600px;
    margin: auto;
}
.clearfix{
	text-align: center;
}

</style>
