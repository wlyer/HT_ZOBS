<template>
	<section>
		<!--工具条-->
		<el-col :span="18" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd" v-if="purview.indexOf('1')>-1">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="batchRemove" :disabled="this.sels.length===0" v-if="purview.indexOf('3')>-1">删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="6" class="toolbar" style="padding-bottom: 0px;">
			<el-input
			  	title="请输入关键字（角色编号，角色名称，创建者，备注）"
			  	placeholder="请输入关键字（角色编号，角色名称，创建者，备注）"
			  	icon="search"
			  	v-model="filters.keyWord"
			  	:on-icon-click="getRoles"
			  	@keyup.enter.native="getRoles"
			  	v-if="purview.indexOf('4')>-1">
			</el-input>
		</el-col>
		<!--列表-->
		<CommTable  :tableConfig="tableConfig"></CommTable>
		<RoleInfo :dialogFormVisible="dialogFormVisible" :roleInfo="roleInfo" @hiddenInfo="hiddenInfo"></RoleInfo>
		
		
	</section>
	
</template>

<script>
	import CommTable from '../../../../components/CommTable';
	import RoleInfo from './RoleInfo';
  import { mapGetters } from 'vuex'
	export default {
		computed: {
		 ...mapGetters([
			'roleList'
	   		 ])
	    },
		data() {
		       const columns = [{
					key:1,
			        label:'角色编号',
			        prop:'roleId',
			        handelLink:this.clickLick,
		        },
		        {
				  	key:2,
		          	label:'角色名称',
		          	prop:'roleName',
		        },
		        {
			 	 	key:3,
		          	label:'备注',
		          	prop:'roleDesc',
		        },
		        {
				  	key:5,
		          	label:'状态',
		          	prop:'state',
		          	formatter:this.formatState
		        },
		        {
				  	key:6,
		          	label:'操作',
				  	width:200,
				  	flag:true,
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
		        //查询参数
		        let params = {
		        	pageNum: 1,
					pageSize:10,
					keyWord: ''
		        };
		        const dispatch='getRoleList';
			return {
				purview:[],
				roleInfo:'',
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
				dialogFormVisible:false,
			}
		},
		methods: {
			//状态显示转换
			formatState: function (row, column) {
				return row.state == 1 ? '启用' : row.state == 0 ? '停用' : '未知';
			},
			//点击链接显示详情
			clickLick(row){
				this.dialogFormVisible=true;
				let purviews = row.purviews?row.purviews.map(item => item.purviewName).toString():'暂无';
				this.roleInfo=Object.assign( row,{purviews:purviews});
			},
			//子组件控制父组件隐藏
			hiddenInfo(visible){
				this.dialogFormVisible = visible;
			},
			//启用停用功能按钮设置
			labelFun(index,row){
				let str = '启用';
				if(row.state == 1){
					str = '停用';
				}
				return str;
			},
			//选中的列
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
					return true;
				}
			},
	      	//显示新增界面
			handleAdd: function () {
				this.$router.push({ path: '/system/role/addRole' });
			},
			
			//显示编辑界面
			handleEdit: function (index, row,scope) {
				this.$router.push({ path: '/system/role/editRole', query: { id: row.roleId }});
			},
			//获取角色列表
			getRoles() {
				this.tableConfig.params = {
					pageNum: 1,
					pageSize:10,
					keyWord: this.filters.keyWord
				};
				this.listLoading = true;
				this.$store.dispatch('getRoleList',this.tableConfig.params).then((res) => {  
					this.listLoading = false;
		        });  
			},
			//删除
			handleDel: function (index, row) {
				if(row.state == 1){
					this.$message({
						message: '启用状态的角色不能删除！',
						type: 'error'
					});
				}else{
					this.$confirm('确认删除该记录吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = { roleIds: row.roleId };
						this.$store.dispatch('removeRoles',para).then((res) => {  
							this.listLoading = false;
							if(res.status == 200){
								this.$message({
									message: res.msg,
									type: 'success'
								});
								this.getRoles();
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
						message: '启用状态的角色不能删除！',
						type: 'error'
					});
				}else{
					var roleIds = this.sels.map(item => item.roleId).toString();
					this.$confirm('确认删除选中记录吗？', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = { roleIds: roleIds };
						this.$store.dispatch('removeRoles',para).then((res) => {  
							this.listLoading = false;
							if(res.status==200){
								this.$message({
									message: res.msg,
									type: 'success'
								});
								this.getRoles();
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
					para = { roleIds: row.roleId,state:0 };
				}else{
					para = { roleIds: row.roleId,state:1 };
				}
				this.$confirm(row.state==1?'确认停用选中记录吗？':'确认启用选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$store.dispatch('changeRoleState',para).then((res) => {
						this.listLoading = false;
						if(res.status==200){
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.getRoles();
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
		  	roleList(){
		  		this.$set(this.tableConfig, "dataList", this.roleList);
		  		this.$set(this.tableConfig, "params", this.tableConfig.params);
		  		this.$set(this.tableConfig, "listLoading", false);
		  	},
		},
		mounted() {
			let user = JSON.parse(sessionStorage.getItem('user'));
			if(user.purview[6]){
				let purview = user.purview[6].toString();
				this.purview = purview;
			}
			if(user.purview[6].indexOf('4')>-1){
				this.getRoles();
			}else{
				this.$message({
		          	message: '您没有查询权限，无法查看数据，请联系管理员！',
		          	type: 'warning'
		        });
			}
		},
		components: {
			CommTable,
			RoleInfo
		}
	}

</script>

<style scoped>
.toolbar{
	background: white;
}
</style>
