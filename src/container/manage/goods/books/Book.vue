<template>
	<div class="book-container" id="book-container">
		<div id="book-left">
		 	<el-tree
			  :data="bookTypeTree"
			  :props="defaultProps"
			  node-key="typeId"
			  default-expand-all
			  :expand-on-click-node="false"
			  :highlight-current= true
			  @node-click="handleClick"
		  	>
			</el-tree>
		</div>
		<div id="book-middle"></div>
		<div id="book-right">
		 	<div class="book-top">
				<el-button type="primary" @click="addSubmit" v-if="purview.indexOf('1')>-1">新增</el-button>
				<el-button type="primary" :disabled="this.sels.length===0" @click="batchRemove" v-if="purview.indexOf('3')>-1">删除</el-button>
				<el-input
					title="请输入关键字（图书编号，图书名称，图书类别，作者，图书简介，图书状态）"
				  	placeholder="请输入关键字（图书编号，图书名称，图书类别，作者，图书简介，图书状态）"
				  	icon="search"
				  	v-model="searchVaule"
				  	:on-icon-click="handleSearch"
				  	@keyup.enter.native="handleSearch"
				  	v-if="purview.indexOf('4')>-1"
				  >
				</el-input>
			</div>
			<CommTable  :tableConfig="tableConfig"></CommTable>
			<BookInfo :dialogFormVisible="dialogFormVisible" :bookInfo="bookInfo" @hiddenInfo="hiddenInfo"></BookInfo>
		</div>
	</div>
</template>

<script>
import CommTable from '../../../../components/CommTable';
import BookInfo from './BookInfo';
import DivideUtil from '../../../../util/divideUtil';
import { mapGetters } from 'vuex'
 export default {
 	components:{
 		CommTable,
 		BookInfo
 	},
    data() {
    	const columns = [{
		        label:'图书编号',
		        prop:'bookId',
		        handelLink:this.clickLick,
	        },
	        {
	          	label:'图书名称',
	          	prop:'bookName',
	        },
	        {
	          	label:'图书单价(元)',
	          	prop:'price',
	        },
	        {
	          	label:'图书折扣',
	          	prop:'discount',
	        },
	        {
	          	label:'入库时间',
	          	prop:'createDate',
	        },
	        {
	          	label:'入库位置',
	          	prop:'storehouse',
	        },
	        {
	          	label:'库存量(册)',
	          	prop:'bookNum',
	        },
	        {
	          	label: "操作",
	          	width: 190,
		  		operations: [
			  		{
			          label: '修改',
			          butType: 'info',
			          func: this.handleEdit,
			          isShow:this.butIsShow,
		        	},
		        	{
			          label: this.labelFun,
			          butType: 'info',
			          func: this.handleAction,
			          isShow:this.butIsShow,
		        	},
		        	{
			          label: '删除',
			          butType: 'danger',
			          func: this.handleDelete,
			          isShow:this.butIsShow,
		        	}
		        ]
	        }];
	    //查询参数
        let params = {
        	pageNum: 1,
			pageSize:10,
			keyWord: ''
        }
      	return {
      		bookInfo:'',
      		dialogFormVisible:false,//详情
      		purview:'',
      		tableConfig: {
		      	columns,
		      	dispatch: 'getByPage',
		      	params,
		      	dataList: [],
		      	rowOptions:this.handleSelectionChange,
		      	listLoading:true,
    		},
    		searchVaule: '',//检索值
    		sels: [],//列表选中列
    		typeId:'',//分类id
		    defaultProps: {
		      	children: 'children',
		      	label: 'typeName'
		    }
  		}
	},
	computed: {
	 	...mapGetters([
			'getByPage',
			'bookTypeTree'
   		])
	},
	watch: {
		getByPage() {
            this.$set(this.tableConfig, "dataList", this.getByPage);
            this.$set(this.tableConfig, "listLoading", false);
		}
	},
	methods: {
		//子组件控制父组件隐藏
		hiddenInfo(visible){
			this.dialogFormVisible = visible;
		},
		//点击链接显示详情
		clickLick(row){
			this.dialogFormVisible=true;
			this.bookInfo=row;
		},
		//是否在操作列中显示删除(true-显示, false-不显示)
		butIsShow(index, row,label) {
			if(label == '修改' && this.purview.indexOf('2')>-1){
				return true;
			}else if(label == '删除' && this.purview.indexOf('3')>-1){
				return true;
			}else if(typeof(label) == 'function' && this.purview.indexOf('2')>-1){
				return true;
			}else{
				return false;
			}
		},
		//初始化或者刷新表格
		getBooks() {
			let para = {
				pageNum: this.getByPage.pageNum ? this.getByPage.pageNum : 1,
				pageSize: this.getByPage.pageSize ? this.getByPage.pageSize : 10,
				keyWord: this.searchVaule
			};
			this.$store.dispatch('getByPage',para);
		},
		//点击分类
		handleClick(data) {
			let para = {
				pageNum:  1,
				pageSize: 10,
				typeId: data.typeId
			};
			this.$store.dispatch('getBooksByBookTypeId', para);
			this.typeId = data.typeId;
		},
		//新增
		addSubmit() {
			if(this.typeId == ''){
				this.$message({
					message: '请先选择图书分类',
					type: 'error'
				});
				return;
			}
			this.$router.push({ path: '/goods/book/addBook' ,query: { typeId: this.typeId }});
		},
		//关键字检索
		handleSearch(ev) {
			let para = {
				pageNum: this.getByPage.pageNum ? this.getByPage.pageNum : 1,
				pageSize: this.getByPage.pageSize ? this.getByPage.pageSize : 10,
				keyWord: this.searchVaule,
				typeId: this.typeId
			};
			this.$store.dispatch('getByPage',para);
		},
		//行中修改
		handleEdit(index, row) {
			this.$router.push({ path: '/goods/book/editBook' ,query: { bookId: row.bookId }});
		},
		//行中删除
		handleDelete(index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'error'
			}).then(() => {
				let para = { bookId: row.bookId };
				this.$store.dispatch('removeBook',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: '删除成功！',
							type: 'success'
						});
						this.getBooks();
					}else{
						this.$message({
							message: '删除失败！',
							type: 'error'
						});
					}
			    });  
			});
		},
		//批量删除
		batchRemove() {
			let bookIds = this.sels.map(item => item.bookId).toString();
			let para = {bookId:bookIds}
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'error'
			}).then(() => {
				this.$store.dispatch('removeBook',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: '删除成功！',
							type: 'success'
						});
						this.getBooks();
					}else{
						this.$message({
							message: '删除失败！',
							type: 'error'
						});
					}
			    });
			})
		},
		//列表勾选的行
		handleSelectionChange(val) {
		    this.sels = val;
	    },
	    //状态不同显示不同操作
	    labelFun(index,row) {
	    	let str = '下架';
	    	if(row.state == 0){
	    		str = '上架';
	    	}else if(row.state ==1){
	    		str = '下架';
	    	}
	    	return str;
	    },
	    //上/下架操作
	    handleAction(index, row) {
	    	let tempState =0;
	    	if(row.state==0){
	    		tempState = 1;
	    	}
	    	let para = { bookId: row.bookId, state: tempState };
			this.$store.dispatch('changeState',para).then((res) => {
				if(res.status==200){
					this.$message({
						message: '操作成功！',
						type: 'success'
					});
					this.getBooks();
				}else{
					this.$message({
						message: '操作失败！',
						type: 'error'
					});
				}
		    });
	    },
	},
	mounted() {
		let para = {
				pageNum: 1,
				pageSize:  10,
				keyWord: ''
			};
		this.$store.dispatch('getBookTypeTree',para);
		let user = JSON.parse(sessionStorage.getItem('user'));
		if(user.purview[1]){
			let purview = user.purview[1].toString();
			this.purview = purview;
			if(user.purview[1].indexOf('4')>-1){
				this.getBooks();
			}else{
				this.$message({
		          	message: '您没有查询权限，无法查看数据，请联系管理员！',
		          	type: 'warning'
		        });
			}
		}
		//分栏拖拽
		DivideUtil.divideFun("book-container", "book-left", "book-middle", "book-right");
	},
};
</script>

<style scoped lang="scss">
.book-container {
	margin-top: 10px;
	position: relative;
	height: 50em;
	/*overflow: hidden;*/
	#book-left, #book-right, #book-middle { 
		height:100%; 
		position:absolute;
	}
	#book-left {
		width:300px;
	}
	#book-middle {
		width:9px;
		left:300px;
	}
	#book-middle:hover{ cursor:col-resize;}
	#book-right {
		right:0; 
		left:309px; 
		width:auto;
	}
	.book-top{
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