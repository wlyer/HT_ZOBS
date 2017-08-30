<template>
	<!-- 修改密码 -->
	<el-dialog title="修改密码" :visible.sync="dialogFormVisible1" >
	  <el-form :model="pswForm" :rules="pswRule" ref="pswForm">
	    <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPsw">
	      <el-input type="password" v-model="pswForm.oldPsw" auto-complete="off"></el-input>
	    </el-form-item>
	    <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPsw">
	      <el-input type="password" v-model="pswForm.newPsw" auto-complete="off">
	      	<template slot="append" v-if="showTexts">
				<font :color="colors">{{showTexts}}</font>
			</template>
	      </el-input>
	    </el-form-item>
	    <el-form-item label="确认密码" :label-width="formLabelWidth" prop="reNewPsw">
	      <el-input type="password" v-model="pswForm.reNewPsw" auto-complete="off"></el-input>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="hiddenInfo">取 消</el-button>
	    <el-button type="primary" @click="changePsw">确 定</el-button>
	  </div>
	</el-dialog>
</template>

<script>
  	import { mapGetters } from 'vuex'
	export default {
		props: [
			'dialogFormVisible'
		],
		data() {
			//密码校验
			 const validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
		        	this.passwordStrong(value);
		          if (this.pswForm.reNewPsw !== '') {
		            this.$refs.pswForm.validateField('reNewPsw');
		          }
		          callback();
		        }
		      };
		      //确认密码校验
		      const validatePass2 = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请再次输入密码'));
		        } else if (value !== this.pswForm.newPsw) {
		          callback(new Error('两次输入密码不一致!'));
		        } else {
		          callback();
		        }
		      };
			return {
				dialogFormVisible1:false,
				formLabelWidth: '120px',
				showTexts:'',
				colors:'',
				pswForm: {
					oldPsw: '',
					newPsw: '',
					reNewPsw: '',
				},
				pswRule: {
			        oldPsw: [
			            { required: true, message: '请输入旧密码', trigger: 'blur' },
			            { min: 6, max: 16, message: '请输入6 到 16位旧密码', trigger: 'blur'}
			        ],
			        newPsw: [
			            { required: true, validator: validatePass, trigger: 'blur'},
						{ min: 6, max: 16, message: '请输入6 到 16位新密码', trigger: 'blur'}
			        ],
			        reNewPsw: [
			            { required: true, validator: validatePass2, trigger: 'blur' },
						{ min: 6, max: 16, message: '请输入6 到 16位确认密码', trigger: 'blur'}
			        ]
		        },
			}
		},
		methods: {
			//取消隐藏子组件
			hiddenInfo() {
                this.$emit('hiddenInfo', false);
           },
			//修改密码
			changePsw(){
				const _this = this;
		        this.$refs.pswForm.validate((valid) => {
					if (valid) {
			        	let user = sessionStorage.getItem('user');
						if (user) {
							user = JSON.parse(user);
						}
			            const para = {userCode:user.userCode , oldUserPsw:_this.pswForm.oldPsw,userPsw:_this.pswForm.newPsw};
			            this.$store.dispatch('changeUserPsw',para).then((data) => {  
				            if (data.status == 200) {
				                this.$message({
				                  message: data.msg,
				                  type: 'success'
				                });
				                this.$emit('hiddenInfo', false);
				            } else {
				              	this.$message({
				                  message: data.msg,
				                  type: 'error'
				                });
				            }
					    });  
			        } else {
			            console.log('error submit!!');
			            return false;
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
		},
		computed: {
		 ...mapGetters([
   		 ]),
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

<style scoped>

</style>
