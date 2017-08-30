<template>
	<section class="login">
	  	<div>
	  		<h3 class="title">友分享书城后台管理平台</h3>
	  	</div>
	  <el-form :model="loginForm" :rules="ruleLogin" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
	   
	    <el-form-item prop="userCode">
	      <el-input type="text" v-model="loginForm.userCode" auto-complete="off" placeholder="账号" @keyup.enter.native="login">
	      	<template slot="prepend">
						<i class="fa fa-user-o" aria-hidden="true"></i>
					</template>
	      </el-input>
	    </el-form-item>
	    <el-form-item prop="userPsw">
	      <el-input type="password" v-model="loginForm.userPsw" auto-complete="off" placeholder="密码" @keyup.enter.native="login">
	      	<template slot="prepend">
						<i class="fa fa-lock" aria-hidden="true"></i>
					</template>
	      </el-input>
	    </el-form-item>
	    <el-form-item prop="valResult">
	      <el-input v-model="loginForm.valResult" auto-complete="off" placeholder="验证码" @keyup.enter.native="login">
	      	<template slot="prepend">
				<i class="fa fa-qrcode" aria-hidden="true"></i>
			</template>
	      	<template slot="append">
				<el-button type="primary" style="width:80px;" @click.native.prevent="renderCode" >{{expression}}</el-button>
			</template>
	      </el-input>
	    </el-form-item>
	    <el-form-item style="width:100%;">
	      <el-button type="primary" style="width:100%;" @click="login" :loading="logining">登录</el-button>
	    </el-form-item>
	  </el-form>
  </section>
</template>

<script>
import base64 from '../../util/Base64EnCode';//用户账号密码传输加密处理
  export default {
    data() {
    	const valResultFunc = (rule, value, callback) => {
    		if(value === ''){
    			callback(new Error('请输入验证码'));
    		}
		    const validateCode = this.validate;
		    if(value!= undefined){
		    	if (value.toString().toLowerCase() == validateCode.toString().toLowerCase()) {
		    		callback();
			    } else if (value != ''){
			    	callback(new Error('验证码输入错误，请重新输入'));
			    }
		    }else{
		    	callback();
		    }
			}
      return { 
        logining: false,  
        expression: '',
	      validate: '',
        loginForm: {
          userCode: '',
          userPsw: '',
          valResult:'',
        },
        ruleLogin: {
          userCode: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          userPsw: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          valResult: [
            { required: true, validator: valResultFunc,trigger: 'blur' },
          ]
        },
      };
    },
    methods: {
      	login(ev) {
	        var _this = this;
	        this.$refs.loginForm.validate((valid) => {
	          	if (valid) {
		            this.logining = true;
		            const codeData = base64.encode64(this.loginForm.userCode);  //对用户名加密  
            		const passData = base64.encode64(this.loginForm.userPsw);  //对密码加密
		            //var loginParams = { userCode: codeData, userPsw: passData};
		            var loginParams = { userCode: this.loginForm.userCode, userPsw: this.loginForm.userPsw};
		            this.$store.dispatch('requestLogin',loginParams).then((data) => {  
			            this.logining = false;
			            if (data.status == 200) {
			                sessionStorage.setItem('user', JSON.stringify(data.user));
			                window.location.href='system/user';
			            } else {
			              	this.renderCode();
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
      
      //验证码
      renderCode() {
			    //定义expression和result，expression是字符串，result可能是字符串也可能是数字
			    let expression = '';
			      let  result = '';
			        let codeNormal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';//字母库
			        for (var i =0; i < 4; i ++) {
			            result = result + codeNormal[Math.round(Math.random()*(codeNormal.length-1))];
			        }//随机获取字母四个
			        expression = result.toLowerCase();//忽略大小写
			    		//设置更新状态
			        this.expression= expression;
			        this.validate= result;
			}
		},
		mounted() {
			this.renderCode();
		},
		components: {
		}
}
</script>

<style lang="scss" scoped>
.login{
	.title {
      margin: 130px auto 40px auto;
      text-align: center;
      font-size: 30px;
      font-weight: 2500;
      letter-spacing:5px;
      color: #FFFFFF;
    }
	padding: 0px;
	margin: 0px;
	float: left;
	background: url('../../image/login.png');
	width: 100%;
	height: 100%;
	.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
   
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
}
  
</style>