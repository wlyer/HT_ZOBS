<template>
	<div>
		<el-table
	    :data="tableData"
	    style="width: 100%"
		highlight-current-row 
		@selection-change="rowOptions"
	    :row-style="showTr">
	    <el-table-column type="selection" width="55"></el-table-column>
	    <el-table-column v-for="(column, index) in columns" :key="index"
	      :label="column.label">
	      <template scope="scope">
	        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
	        <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
	          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
	          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
	        </button>
	        <span v-else-if="index===0" class="ms-tree-space"></span>
	        {{scope.row[column.prop]}}
	      </template>
	    </el-table-column>
	    <el-table-column label="操作" v-if="treeType === 'normal'" >
	      <template scope="scope">
	        <el-button
	          size="small"
	          type="info"
	          @click="handleEdit(scope.$index, scope.row,scope)"  v-if="purview.indexOf('2')>-1">
	            	修改
	        </el-button>
	        <el-button
	          size="small"
	          type="danger"
	          @click="handleDelete(scope.$index, scope.row,scope)"  v-if="purview.indexOf('3')>-1">
	          		删除
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-col :span="24" class="toolbar">
	  		<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="params.pageNum"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="params.pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="dataList.total"
		      style="float:right;">
		    </el-pagination>
	  </el-col>
	  <!--修改界面-->
	  <EditBookType @close="closeDialog" :isVisible="editFormVisible" :booTypeData="bookTypeById" ></EditBookType>
	</div>
</template>
<script>
import Utils from '../../../../util/dataTranslate.js'
import EditBookType from './EditBookType'
import { mapGetters } from 'vuex'
export default {
	name: 'TreeGrid',
	components:{
		EditBookType
	},
	props: {
		purview:{
			type: String,
		    default: function () {
		      return ''
		    }
		},
		rowOptions: {
			type: Function,
		},
		// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
		treeStructure: {
		    type: Boolean,
		    default: function () {
		      return false
		    }
		},
		// 这是相应的字段展示
		columns: {
		    type: Array,
		    default: function () {
		      return []
		    }
		},
		// 这是数据源
		dataSource: {
		    type: Array,
		    default: function () {
		      return []
		    }
		},
		// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
		requestUrl: {
		    type: String,
		    default: function () {
		      return ''
		    }
		},
		// 这个是是否展示操作列
		treeType: {
		    type: String,
		    default: function () {
		      return 'normal'
		    }
		},
		// 是否默认展开所有树
		defaultExpandAll: {
		    type: Boolean,
		    default: function () {
		      return false
		    }
		}
	},
	data () {
		return {
		  	params: '',
			dataList: '',
			editFormVisible: false,
			addLoading: false,
//			booTypeData: {} ,//修改分类数据
		}
	},
	computed: {
		...mapGetters([
			'bookTypeById'
   		]),
		// 格式化数据源
		tableData() {
		    if (this.treeStructure) {
		      let data = Utils.treeToArray(this.dataSource, null, null, this.defaultExpandAll)
		      return data
		    }
		    return this.dataSource
		}
	},
	methods: {
		// 显示行
		showTr(row, index) {
		    let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
		    row._show = show
		    return show ? '' : 'display:none;'
		},
		// 展开下级
		toggle(trIndex) {
		    let record = this.tableData[trIndex]
		    record._expanded = !record._expanded
		},
		// 显示层级关系的空格和图标
		spaceIconShow (index) {
		    if (this.treeStructure && index === 0) {
		      return true
		    }
		    return false
		},
		// 点击展开和关闭的时候，图标的切换
		toggleIconShow (index, record) {
		    if (this.treeStructure && index === 0 && record.children && record.children.length > 0) {
		      return true
		    }
		    return false
		},
		handleDelete (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'error'
			}).then(() => {
				let para = {typeId: row.typeId}
				this.$store.dispatch('deleteBookTypeById',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: '删除成功！',
							type: 'success'
						});
						this.$emit("refresh");
					}else{
						this.$message({
							message: res.msg,
							type: 'error'
						});
					}
				});
			}).catch(()=>{
				
			});
		},
		handleEdit(index, row) {
			this.$store.dispatch('getBookTypeById',{typeId: row.typeId})
		  	this.editFormVisible = true;
		},
		  //改变每页数量
		handleSizeChange(val) {
		 	this.params.pageSize = val;
		    let para = {
		    	keyWord:this.params.keyWord,
		    	pageSize: val,
		    	pageNum: this.params.pageNum
		    };
			this.listLoading = true;
		    this.$store.dispatch(this.tableConfig.dispatch,para).then((res) => {  
				this.listLoading = false;
			});
		},
		//切换页码
	    handleCurrentChange(val) {
	    	this.params.pageNum = val;
	    	let para = {
	        	keyWord:this.params.keyWord,
	        	pageSize:this.params.pageSize,
	        	pageNum: val
	        };
			this.listLoading = true;
	        this.$store.dispatch(this.tableConfig.dispatch,para).then((res) => {  
	    		this.listLoading = false;
	    	});
		},
		closeDialog() {
			this.editFormVisible = false;
		}
	}
}
</script>
<style scoped lang="scss">
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
</style>
