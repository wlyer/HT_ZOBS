<template>
	<section>
		<!--工具条-->
		<el-col :span="18" class="toolbar" style="padding-bottom: 0px;">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="操作日志" name="columnsOperate"></el-tab-pane>
			    <el-tab-pane label="数据库日志" name="columnsDb"></el-tab-pane>
			    <el-tab-pane label="系统日志" name="columnsSys"></el-tab-pane>
			  </el-tabs>
		</el-col>
		<el-col :span="6" class="toolbar" style="padding-bottom: 0px;">
			<el-input
				title="关键字查询（操作用户，日志级别，日志内容）"
			  	placeholder="关键字查询（操作用户，日志级别，日志内容）"
			  	icon="search"
			  	v-model="filters.keyWord"
			  	:on-icon-click="getLogs"
			  	@keyup.enter.native="getLogs">
			</el-input>
		</el-col>
		<!--列表-->
		<CommTable  :tableConfig="tableConfig"></CommTable>
	</section>
	
</template>

<script>
	import CommTable from '../../../../components/CommTable';
  import { mapGetters } from 'vuex'
  const columnsOperate = [{
					key:1,
			        label:'操作日志编号',
			        prop:'logId',
		        },
		        {
				  	key:2,
		          	label:'日志内容',
		          	prop:'logContent',
		        },
		        {
			 	 	key:3,
		          	label:'操作用户',
		          	prop:'userCode',
		        },
		        {
			 	 	key:4,
		          	label:'操作时间',
		          	prop:'createDate',
		        },
		        {
				  	key:5,
		          	label:'日志级别',
		          	prop:'lever',
		        }];
		        const columnsDb = [{
					key:1,
			        label:'数据库日志编号',
			        prop:'logId',
		        },
		        {
				  	key:2,
		          	label:'日志内容',
		          	prop:'logContent',
		        },
		        {
			 	 	key:3,
		          	label:'操作用户',
		          	prop:'userCode',
		        },
		        {
			 	 	key:4,
		          	label:'操作时间',
		          	prop:'createDate',
		        },
		        {
				  	key:5,
		          	label:'日志级别',
		          	prop:'lever',
		        }];
		        const columnsSys = [{
					key:1,
			        label:'系统日志编号',
			        prop:'logId',
		        },
		        {
				  	key:2,
		          	label:'日志内容',
		          	prop:'logContent',
		        },
		        {
			 	 	key:3,
		          	label:'操作用户',
		          	prop:'userCode',
		        },
		        {
			 	 	key:4,
		          	label:'操作时间',
		          	prop:'createDate',
		        },
		        {
				  	key:5,
		          	label:'日志级别',
		          	prop:'lever',
		        }];
	export default {
		computed: {
		 ...mapGetters([
			'logList'
	   		 ])
	    },
		data() {
	        //方法名
	        const dispatch = 'getLogList';
	        //查询参数
	        let params = {
	        	pageNum: 1,
				pageSize:10,
				type:0,
				keyWord: ''
	        }
			return {
				activeName: 'columnsOperate',
				//日志分类（0=操作日志；1=数据库日志；2=系统日志）
		        type:0,
				tableConfig:{
					dataList:[],
					columns:columnsOperate,
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
			//获取选中的列
			handleSelectionChange(val) {
		        this.sels = val;
	      	},
	      	//切换导航
			handleClick(tab, event) {
				if(tab.name=='columnsOperate'){
					this.tableConfig.columns=columnsOperate;
					this.filters.keyWord='';
					this.type=0;
					this.getLogs();
				}else if(tab.name=='columnsDb'){
					this.tableConfig.columns=columnsDb;
					this.filters.keyWord='';
					this.type=1;
					this.getLogs();
				}else{
					this.tableConfig.columns=columnsSys;
					this.filters.keyWord='';
					this.type=2;
					this.getLogs();
				}
		     },
			//获取日志列表
			getLogs() {
				this.tableConfig.params = {
					pageNum: 1,
					pageSize:10,
					type:this.type,
					keyWord: this.filters.keyWord
				};
				this.listLoading = true;
				this.$store.dispatch('getLogList',this.tableConfig.params).then((res) => {  
					this.listLoading = false;
		        });  
			},
		},
		watch:{
		  	logList(){
		  		this.$set(this.tableConfig, "dataList", this.logList);
		  		this.$set(this.tableConfig, "params", this.tableConfig.params);
		  		this.$set(this.tableConfig, "listLoading", false);
		  	},
			columns:{
		  		 handler(val,oldval){  
                    this.$set(this.tableConfig, "columns", val);
                },  
                deep:true//对象内部的属性监听，也叫深度监听  
　　　　　　 	},
		},
		mounted() {
			this.getLogs();
		},
		components: {
			CommTable,
		}
	}

</script>

<style scoped>
.toolbar{
	background: white;
}
</style>
