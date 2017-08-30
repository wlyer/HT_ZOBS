<template>
	<section>
		<!--工具条-->
		<el-col :span="18"  class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-button type="primary" @click="handleAdd" v-if="purview.indexOf('1')>-1">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="batchRemove" :disabled="this.sels.length===0" v-if="purview.indexOf('3')>-1">删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="6"  class="toolbar" style="padding-bottom: 0px;">
			<el-input
			  	title="请输入关键字（用户编号，用户名称，用户状态，联系电话，常用地址）"
			  	placeholder="请输入关键字（用户编号，用户名称，用户状态，联系电话，常用地址）"
			  	icon="search"
			  	v-model="filters.keyWord"
			  	:on-icon-click="getUsers"
			  	@keyup.enter.native="getUsers"
			  	v-if="purview.indexOf('4')>-1">
			</el-input>
		</el-col>
		<!--列表-->
		<CommTable  :tableConfig="tableConfig"></CommTable>
		<!-- 用户详情  -->
		<UserInfo :dialogFormVisible="dialogFormVisible" :userInfo="userInfo" @hiddenInfo="hiddenInfo"></UserInfo>
			<transition name="fade" mode="out-in">
				<router-view></router-view>
			</transition>
	</section>
	
</template>

<script>
	import CommTable from '../../../../components/CommTable';
	import UserInfo from './UserInfo';
  	import { mapGetters } from 'vuex'
	export default {
		computed: {
		 ...mapGetters([
	   		 ])
	    },
		data() {
			const user = JSON.parse(sessionStorage.getItem('user')); 
		       const columns = [{
					key:1,
			        label:'用户账号',
			        prop:'userCode',
			        width:130,
			        handelLink:this.clickLick,
		        },
		        {
				  	key:2,
		          	label:'用户名',
		          	prop:'userName',
		        },
		        {
			 	 	key:3,
		          	label:'手机号',
		          	prop:'phone',
		          	width:130
		        },
		        {
			 	 	key:4,
		          	label:'邮箱',
		          	prop:'email',
		          	width:170
		        },
		        {
				  	key:6,
		          	label:'角色名',
		          	prop:'roles',
		        },
		        {
				  	key:7,
		          	label:'状态',
		          	prop:'state',
		          	width:90,
		          	formatter:this.formatState,
		        },
		        {
				  	key:8,
		          	label:'操作',
		          	width:200,
					flag:user.userCode,		          	
				  	operations:[
					  	{
					  		func :this.handleEdit,
					  		label:'编辑',
					  		butType:'info',
					  		isShow:this.butIsShow,
					  	},
					  	{
					  		func :this.handleDel,
					  		label:'删除',
					  		butType:'info',
					  		isShow:this.butIsShow,
					  	},
					  	{
					  		func :this.changeState,
					  		label:this.labelFun,
					  		butType:'danger',
					  		isShow:this.butIsShow,
					  	}
				  	]
		        }];
		        //方法名
		        const dispatch = 'getUserList';
		        //查询参数
		        let params = {
		        	pageNum: 1,
					pageSize:10,
					keyWord: ''
		        }
			return {
				purview:'',//权限
				userList:[],
				userInfo:'',
				dialogFormVisible:false,
				tableConfig:{
					dataList:[],
					columns,
					params,
					dispatch:dispatch,
					rowOptions:this.handleSelectionChange,
					listLoading:true,
				},
				
				filters: {
					keyWord: ''
				},
				sels: [],//列表选中列
			}
		},
		methods: {
			//状态显示转换
			formatState: function (row, column) {
				let str = '';
				switch(row.state)
					{
					case 0:
					  str='停用';
					  break;
					case 1:
					  str='启用';
					  break;
				    case 2:
				      str='待激活';
				      break;
					default:
					  str='未知';
					}
				return str;
			},
			//启用停用功能按钮设置
			labelFun(index,row){
				let str = '启用';
				if(row.state == 1){
					str = '停用';
				}
				return str;
			},
			//点击链接显示详情
			clickLick(row){
				this.dialogFormVisible=true;
				this.userInfo=row;
			},
			//子组件控制父组件隐藏
			hiddenInfo(visible){
				this.dialogFormVisible = visible;
			},
			//获取选中列
			handleSelectionChange(val) {
		        this.sels = val;
	      	},
	      	//是否在操作列中显示删除(true-显示, false-不显示)
			butIsShow(index, row,label) {
				if(label == '编辑' && this.purview.indexOf('2')>-1){
					return true;
				}else if(label == '删除' && this.purview.indexOf('3')>-1){
					return true;
				}else if(typeof(label) == 'function' && this.purview.indexOf('2')>-1){
					return true;
				}else{
					return false;
				}
			},
		   //显示新增界面
			handleAdd: function () {
				this.$router.push({ path: '/system/user/addUser' });
			},
			
			//显示编辑界面
			handleEdit: function (index, row,scope) {
				this.$router.push({ path: '/system/user/editUser', query: { id: row.userCode }});
			},
			//获取用户列表
			getUsers() {
				this.tableConfig.params = {
					pageNum: 1,
					pageSize:10,
					keyWord: this.filters.keyWord
				};
				this.listLoading = true;
				this.$store.dispatch('getUserList',this.tableConfig.params).then((res) => {  
					res.list.map(item => {
						item.roles = item.roles.length != 0?item.roles.map(item => item.roleName).toString():'--';
					});
					this.userList = res;
					this.listLoading = false;
		        });  
			},
			//删除
			handleDel: function (index, row) {
				if(row.state == 1){
					this.$message({
						message: '启用状态的用户不能删除！',
						type: 'error'
					});
				}else{
					this.$confirm('确认删除该记录吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = { userCodes: row.userCode };
						this.$store.dispatch('removeUsers',para).then((res) => {  
							this.listLoading = false;
							if(res.status==200){
								this.$message({
									message: res.msg,
									type: 'success'
								});
								this.getUsers();
							}else{
								this.$message({
									message: res.msg,
									type: 'error'
								});
							}
				        });  
					}).catch(() => {
	
					});
				}
				
			},
			//批量删除
			batchRemove: function () {
				const states = this.sels.map(item => item.state);
				if(states.indexOf(1)>-1){
					this.$message({
						message: '启用状态的用户不能删除！',
						type: 'error'
					});
				}else{
					const userCodes = this.sels.map(item => item.userCode).toString();
					this.$confirm('确认删除选中记录吗？', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = { userCodes: userCodes };
						this.$store.dispatch('removeUsers',para).then((res) => {  
							this.listLoading = false;
							if(res.status==200){
								this.$message({
									message: res.msg,
									type: 'success'
								});
								this.getUsers();
							}else{
								this.$message({
									message: res.msg,
									type: 'error'
								});
							}
				        });  
					}).catch(() => {
	
					});	
				}
			},
			//修改用户状态
			changeState:function(index, row,scope){
				let para ='';
				if(row.state==1){//目前是启用状态,改为停用
					para = { userCodes: row.userCode,state:0 };
				}else{
					para = { userCodes: row.userCode,state:1 };
				}
				this.$confirm(row.state==1?'确认停用选中记录吗？':'确认启用选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$store.dispatch('changeUserState',para).then((res) => {
						this.listLoading = false;
						if(res.status==200){
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.getUsers();
						}else{
							this.$message({
								message: res.msg,
								type: 'error'
							});
						}
			        });  
				}).catch(() => {

				});
			},
		},
		watch:{
		  	userList(){
		  		this.$set(this.tableConfig, "dataList", this.userList);
		  		this.$set(this.tableConfig, "params", this.tableConfig.params);
		  		this.$set(this.tableConfig, "listLoading", false);
		  	}
		},
		mounted() {
			let user = JSON.parse(sessionStorage.getItem('user'));
			if(user.purview[5]){
				let purview =  user.purview[5].toString();
				this.purview = purview;
				
				if(user.purview[5].indexOf('4')>-1){
					this.getUsers();
				}else{
					this.$message({
			          	message: '您没有查询权限，无法查看数据，请联系管理员！',
			          	type: 'warning'
			        });
				}
			}
		},
		components: {
			CommTable,
			UserInfo
		}
	}

</script>

<style scoped>
.toolbar{
	background: white;
}
</style>
