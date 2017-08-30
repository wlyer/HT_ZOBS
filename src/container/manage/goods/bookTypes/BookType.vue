<template>
	<div class="bookType-container">
		<div class="bookType-top">
			<el-dropdown @command="handleAdd"  v-show="purview.indexOf('1')>-1" v-if="bookTypeTree.length!=0">
			 	<el-button type="primary"> 新增<i class="el-icon-caret-bottom el-icon--right"></i>
			 </el-button>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item command=1 :disabled="this.sels.length===0">同级分类</el-dropdown-item>
			    <el-dropdown-item command=0 :disabled="this.sels.length===0">下级分类</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
			<el-button type="primary" @click="addBaseBookType" v-show="purview.indexOf('1')>-1" v-else>新增</el-button>
			<el-button type="primary" :disabled="this.sels.length===0" @click="batchRemove" v-if="purview.indexOf('3')>-1">删除</el-button>
			<el-input
				title="请输入关键字（分类编号，分类名称,分类描述）"
			  	placeholder="请输入关键字（分类编号，分类名称,分类描述）"
			  	icon="search"
			  	v-model="searchVaule"
			  	:on-icon-click="getBookType"
			  	@keyup.enter.native="getBookType"
			  	v-if="purview.indexOf('4')>-1">
			</el-input>
		</div>
		<TreeGrid :columns="columns" :treeStructure="true" :dataSource="dataSource" :rowOptions="handleSelectionChange" @refresh="getBookType" :purview="purview"></TreeGrid>
		<!--新增界面-->
	  	<AddBookType :isVisible='addFormVisible' @close="closeDialog" :baseBookTypeId='baseBookTypeId' :addLevel="addLevel" ></AddBookType>
	</div>
</template>

<script>
import TreeGrid from './TreeGrid'
import AddBookType from './AddBookType'
import { mapGetters } from 'vuex'
export default {
	components: {
		TreeGrid,
		AddBookType
	},
	data() {
		return {
			purview:'',
			searchVaule:'',//检索值
    		sels: [],//列表选中列
    		addFormVisible: false,
    		baseBookTypeId: '',
    		addLevel: '',
	        columns: [
	          {
	            label: '分类编号',
	            prop: 'typeId'
	          },
	          {
	            label: '分类名称',
	            prop: 'typeName'
	          },
	          {
	            label: '分类人',
	            prop: 'createUser'
	          },
	          {
	            label: '分类描述',
	            prop: 'typeDesc'
	          },
	          {
	            label: '分类时间',
	            prop: 'createDate'
	          }
	        ],
		}
	},
	computed: {
	 	...mapGetters([
			'bookTypeTree'
   		]),
   		dataSource() {
   			return this.bookTypeTree;
   		},
	},
	methods: {
		//初始化或者刷新表格
		getBookType() {
			let para = {
				pageNum: this.bookTypeTree.pageNum ? this.getByPage.pageNum : 1,
				pageSize: this.bookTypeTree.pageSize ? this.getByPage.pageSize : 10,
				keyWord: this.searchVaule,
			};
			this.$store.dispatch('getBookType',para);
		},
		handleAdd(command) {
			if(this.sels.length != 1){
				this.$confirm('请选择一个分类!', '提示', {
		            confirmButtonText: '确定',
		            showCancelButton: false,
		            type: 'warning'
		        })
			}else{
				this.baseBookTypeId = this.sels[0].typeId;
				this.addLevel = command;
				this.addFormVisible = true;
			}
		},
		//新增根分类
		addBaseBookType() {
			this.baseBookTypeId = '';
			this.addLevel = -1;
			this.addFormVisible = true;
		},
		//列表勾选的行
		handleSelectionChange(val) {
		    this.sels = val;
	    },
	    //批量删除
		batchRemove: function () {
//			var codes = this.sels.map(item => item.reclaimCode).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'error'
			}).then(() => {
				alert("删除")
				this.getBookType();
			})
		},
		closeDialog() {
			this.addFormVisible = false;
		}
	},
	mounted() {
		let user = JSON.parse(sessionStorage.getItem('user'));
		let purview = '';
		if(user.purview[2]){
			let purview = user.purview[2].toString();
			this.purview = purview;
			
			if(user.purview[2].indexOf('4')>-1){
				this.getBookType();
			}else{
				this.$message({
		          	message: '您没有查询权限，无法查看数据，请联系管理员！',
		          	type: 'warning'
		        });
			}
		}
	},
}
</script>

<style scoped lang="scss">
.bookType-container{
	margin-top: 1em;
	width: 100%;
	.bookType-top{
		margin-bottom: 5px;
		float: left;
		width:100%;
		.el-input{
			width: 20%;
			display: inline-block;
			float: right;
		}
	}
}
</style>