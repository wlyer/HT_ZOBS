<template>
	<section>
		<!--工具条-->
		<el-col :span="18" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="6" class="toolbar" style="padding-bottom: 0px;">
			<el-input
				title="请输入关键字（权限编号，权限名称，权限状态，备注）"
			  	placeholder="请输入关键字（权限编号，权限名称，权限状态，备注）"
			  	icon="search"
			  	v-model="filters.keyWord"
			  	:on-icon-click="getPurviews"
			  	@keyup.enter.native="getPurviews">
			</el-input>
		</el-col>
		<!--列表-->
		<CommTable  :tableConfig="tableConfig"></CommTable>
		<!-- 权限详情  -->
		<PurviewInfo :dialogFormVisible="dialogFormVisible" :purviewInfo="purviewInfo" @hiddenInfo="hiddenInfo"></PurviewInfo>
	</section>
	
</template>

<script>
	import CommTable from '../../../../components/CommTable';
	import PurviewInfo from './PurviewInfo';
  	import { mapGetters } from 'vuex'
	export default {
		computed: {
		 ...mapGetters([
			'purviewList'
	   		 ])
	    },
		data() {
		       const columns = [{
					key:1,
			        label:'权限编号',
			        prop:'purviewId',
			        handelLink:this.clickLick,
		        },
		        {
				  	key:2,
		          	label:'权限名称',
		          	prop:'purviewName',
		        },
		        {
			 	 	key:3,
		          	label:'规则',
		          	prop:'purviewRule',
		        },
		        {
				  	key:4,
		          	label:'创建时间',
		          	prop:'createDate',
		        },
		        {
				  	key:5,
		          	label:'备注',
		          	prop:'purviewDesc',
		        },
		        {
				  	key:6,
		          	label:'状态',
		          	prop:'state',
		          	formatter:this.formatState
		        },
		        {
				  	key:6,
		          	label:'操作',
				  	width:200,
				  	operations:[
					  	{
					  		func :this.handleEdit,
					  		label:'编辑',
					  		butType:'info'
					  	},
					  	{
					  		func :this.handleDel,
					  		label:'删除',
					  		butType:'info'
					  	},
					  	{
					  		func :this.changeState,
					  		label:this.labelFun,
					  		butType:'danger'
					  	}
				  	]
		        }];
		        //查询参数
		        let params = {
		        	pageNum: 1,
					pageSize:10,
					keyWord: ''
		        };
		        const dispatch='getPurviewList';
			return {
				formLabelWidth: '40%',
				purviewInfo:'',
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
			//点击链接显示详情
			clickLick(row){
				this.dialogFormVisible=true;
				this.purviewInfo=row;
			},
			//子组件控制父组件
			hiddenInfo(visible){
				this.dialogFormVisible = visible;
			},
			//状态显示转换
			formatState: function (row, column) {
				return row.state == 1 ? '启用' : row.state == 0 ? '停用' : '未知';
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
			//显示新增界面
			handleAdd: function () {
				this.$router.push({ path: '/system/purview/addPurview' });
			},
			
			//显示编辑界面
			handleEdit: function (index, row,scope) {
				this.$router.push({ path: '/system/purview/editPurview', query: { id: row.purviewId }});
			},
			//获取权限列表
			getPurviews() {
				this.tableConfig.params = {
					pageNum: 1,
					pageSize:10,
					keyWord: this.filters.keyWord
				};
				this.listLoading = true;
		        this.$store.dispatch('getPurviewList',this.tableConfig.params).then((res) => {  
					this.listLoading = false;
		        });  
			},
			//删除
			handleDel: function (index, row) {
				if(row.state == 1){
					this.$message({
						message: '启用状态的权限不能删除！',
						type: 'error'
					});
				}else{
					this.$confirm('确认删除该记录吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = { purviewIds: row.purviewId };
						this.$store.dispatch('removePurviews',para).then((res) => {  
							this.listLoading = false;
							if(res.status == 200){
								this.$message({
									message: res.msg,
									type: 'success'
								});
								this.getPurviews();
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
						message: '启用状态的权限不能删除！',
						type: 'error'
					});
				}else{
					const purviewIds = this.sels.map(item => item.purviewId).toString();
					this.$confirm('确认删除选中记录吗？', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = { purviewIds: purviewIds };
						this.$store.dispatch('removePurviews',para).then((res) => {  
							this.listLoading = false;
							if(res.status==200){
								this.$message({
									message: res.msg,
									type: 'success'
								});
								this.getPurviews();
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
			//修改权限状态
			changeState:function(index, row,scope){
				let para ='';
				if(row.state==1){//目前是启用状态,改为停用
					para = { purviewIds: row.purviewId,state:0 };
				}else{
					para = { purviewIds: row.purviewId,state:1 };
				}
				this.$confirm(row.state==1?'确认停用选中记录吗？':'确认启用选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$store.dispatch('changePurviewState',para).then((res) => {
						this.listLoading = false;
						if(res.status==200){
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.getPurviews();
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
		  	purviewList(){
		  		this.$set(this.tableConfig, "dataList", this.purviewList);
		  		this.$set(this.tableConfig, "params", this.tableConfig.params);
		  		this.$set(this.tableConfig, "listLoading", false);
		  	}
		},
		mounted() {
			this.getPurviews();
		},
		components: {
			CommTable,
			PurviewInfo
		}
	}

</script>

<style scoped>
.toolbar{
	background: white;
}
</style>
