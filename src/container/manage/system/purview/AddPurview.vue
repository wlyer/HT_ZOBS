<template>
	<section class="add-auth">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 20px;">新增权限</span>
		  </div>
		  <div class="text item">
		    <!--新增界面-->
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="权限编号" prop="purviewId">
					<el-input v-model="addForm.purviewId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限名称" prop="purviewName">
					<el-input v-model="addForm.purviewName"></el-input>
				</el-form-item>
				<el-form-item label="规则" prop="purviewRule">
					<el-input v-model="addForm.purviewRule"></el-input>
				</el-form-item>
				<el-form-item label="权限状态" prop="state">
				    <el-select v-model="addForm.state" placeholder="请选择状态类型">
					    <el-option label="启用" value="1"></el-option>
					    <el-option label="停用" value="0"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="备注" >
					<el-input type="textarea" v-model="addForm.purviewDesc"></el-input>
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
		 		'purviewList'
   			])
	    },
		data() {
			//权限编号重复校验
			const validatePurviewId = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入权限编号'));
		        } else {
		        	let isPass = false;
		        	this.purviewList.list.map(item=>{
						if(item.purviewId == value.trim()){
							isPass = true;
							return;
						}
					})
		        	isPass? callback(new Error('权限编号已存在！')): callback();
		        }
		    };
			return {
				addLoading:false,
				addFormRules: {
					purviewId: [
						{ required: true, validator: validatePurviewId, trigger: 'blur' }
					],
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
				//新增界面数据
				addForm: {
					purviewId:'',
					purviewName:'',
					purviewRule: '',
					purviewDesc: '',
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
							this.$store.dispatch('addPurview',para).then((res) => {  
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
								this.$router.push({ path: '/system/purview' });
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
		},
		components: {
		}
	}
</script>

<style scoped>
.footer-button{
	text-align: center;
}
.add-auth{
	padding-top: 50px;
	width:600px;
    margin: auto;
}
.clearfix{
	text-align: center;
}
</style>
