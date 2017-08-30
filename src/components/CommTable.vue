<template>
	<div class="block">
		<el-table :data="dataList.list" style="width: 100%"
			v-loading="listLoading"
			element-loading-text="拼命加载中"
			highlight-current-row 
		    @selection-change="rowOptions">
		    <el-table-column type="selection" width="55" v-if="rowOptions"></el-table-column>
			<template v-for="item in columns">
				<el-table-column v-if="item.operations" 
					:key="item.prop" 
					:prop="item.prop" 
					:label="item.label" 
					:width="item.width"
					:formatter='item.formatter'
					:align="item.align">
					<template scope="scope">
						<el-button 
							size="small" 
							v-for="(tag,index) in item.operations" 
							:key="index"
							:type="tag.butType"
							:disabled="item.flag?(((item.flag==scope.row.userCode && tag.label!='编辑') || scope.row.roles == '超级管理员' || scope.row.roleName == '超级管理员')?true:false):false"
							@click="tag.func(scope.$index, scope.row,scope)"
							v-if="tag.isShow?tag.isShow(scope.$index, scope.row,tag.label):true"
						>
							{{typeof(tag.label)== "string"? tag.label: tag.label(scope.$index, scope.row,scope)}}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.handelLink" 
					:prop="item.prop" 
					:label="item.label" 
					:width="item.width" 
					:key="item.prop" 
					:align="item.align">
					<template scope="scope">
			          <span class="link-type" @click='item.handelLink(scope.row)'>
			          	{{scope.row[item.prop]}}
			          </span>
			        </template>
        		</el-table-column>
				<el-table-column v-else 
					:prop="item.prop" 
					:label="item.label" 
					:width="item.width" 
					:key="item.prop" 
					:formatter='item.formatter'
					:align="item.align">
        		</el-table-column>
			</template>
		</el-table>
		<el-col :span="24" style="padding-top: 25px;">
	  		<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="params.pageNum"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="params.pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="dataList.total==undefined? 0: dataList.total"
		      style="float:right;">
		    </el-pagination>
	  	</el-col>
	</div>
</template>

<script>
	export default {
		props: [
			'tableConfig',
		],
		data() {
			return {
				dataList: this.tableConfig.dataList,
				columns: this.tableConfig.columns,
				params: this.tableConfig.params,
		        rowOptions:this.tableConfig.rowOptions?this.tableConfig.rowOptions:'',
		        listLoading:this.tableConfig.listLoading,
			}
		},
		watch:{
			//监听props的变化
			tableConfig:{
				handler(){
					this.dataList = this.tableConfig.dataList;
					this.columns =  this.tableConfig.columns;
					this.rowOptions =  this.tableConfig.rowOptions?this.tableConfig.rowOptions:'';
					this.params =  this.tableConfig.params;
					this.listLoading = this.tableConfig.listLoading;
				},
				deep: true
			}
		},
		methods: {
			//改变每页数量
			handleSizeChange(val) {
				this.params.pageSize = val;
		        let para = Object.assign({}, this.params);
				this.listLoading = true;
		        this.$store.dispatch(this.tableConfig.dispatch,para).then((res) => {  
	        		this.listLoading = false;
		    	});
		    },
		    //切换页码
		    handleCurrentChange(val) {
		    	this.params.pageNum = val;
		        let para = Object.assign({}, this.params);
				this.listLoading = true;
		        this.$store.dispatch(this.tableConfig.dispatch,para).then((res) => {  
	        		this.listLoading = false;
		    	});
			},
		}
	}
</script>
<style scoped lang="scss">
.link-type,.link-type:focus {
  color: #337ab7;
  cursor: pointer;
  &:hover {
    color: rgb(32, 160, 255);
  }
}
</style>
