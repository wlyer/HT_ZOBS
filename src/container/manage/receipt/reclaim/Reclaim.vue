<template>
	<div class="recl-container">
		<div class="recl-top">
			<el-button type="primary" :disabled="this.sels.length===0" @click="batchRemove" v-if="purview.indexOf('3')>-1">删除</el-button>
			<el-input
				title="请输入关键字（回收单编号，回收人，回收人电话，回收人地址）"
			  	placeholder="请输入关键字（回收单编号，回收人，回收人电话，回收人地址）"
			  	icon="search"
			  	v-model="searchVaule"
			  	:on-icon-click="handleSearch"
			  	v-if="purview.indexOf('4')>-1">
			</el-input>
		</div>
		<CommTable :tableConfig="tableConfig"></CommTable>
		
		<!--同意/拒绝回收单 -->
		<el-dialog size="tiny" title="审核回收单" :visible.sync="dialogIsAgreeVisible">
		  	<el-form :model="isAgreeForm" ref="isAgreeForm" label-width="110px">
			    <el-form-item label="回收单号:" >
			      	{{isAgreeForm.reclaimId}}
			    </el-form-item>
			    <el-form-item label="审核结果:" >
			      	<el-radio-group v-model="agree">
					    <el-radio :label="1">同意回收</el-radio>
					    <el-radio :label="3">拒绝回收</el-radio>
					</el-radio-group>
			    </el-form-item>
			    <el-form-item label="备注:" >
			      	<el-input type="textarea" style="width: 220px;" :autosize="{ minRows: 2, maxRows: 4}" v-model="isAgreeForm.notes" auto-complete="off"></el-input>
			    </el-form-item>
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogIsAgreeVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="doAgreeSubmit">确 定</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>

<script>
import CommTable from '../../../../components/CommTable'
import { mapGetters } from 'vuex'
import util from '../../../../util/util'
export default {
	components: {
		CommTable,
	},
	data() {
	 	const columns = [
	 		{
	 			label: '回收单编号',
	 			prop: 'reclaimId',
	 			handelLink: this.handelLink,
	 		},
	        {
	          	label:'回收人姓名',
	          	prop:'sellerName',
	        },
	        {
	          	label:'回收人地址',
	          	prop:'sellerAddr',
	        },
	        {
	          	label:'货物描述',
	          	prop:'goodsDsc',
	        },
	        {
	          	label:'状态',
	          	prop:'state',
	          	formatter: this.stateFormatter,
	        },
	        {
	          	label: "操作",
	          	width:250,
		  		operations: [
			  		{
			          label: '编辑',
			          butType: 'info',
			          func: this.handleEdit,
		        	},{
			          label: '删除',
			          butType: 'danger',
			          func: this.handleDelete,
			          isShow:this.butIsShow,
		        	},{
			          butType: 'danger',
			          label:'审核',
			          func: this.doAgree,
			          isShow:this.agreeIsShow,
		        	},{
			          label: '完成',
			          butType: 'danger',
			          func: this.doReclaim,
			          isShow:this.doneIsShow,
		        	}
		        ]
	        }];
	    //查询参数
        let params = {
        	pageNum: 1,
			pageSize:10,
			keyWord: ''
        }
		return{
			agree:1,
			dialogIsAgreeVisible:false,
			purview:'',
      		tableConfig: {
		      	columns,
		      	params,
		      	dispatch: 'getReclaimByPage',
		      	dataList: [],
		      	rowOptions:this.handleSelectionChange,
		      	listLoading:true,
    		},
    		searchVaule:'',//检索值
    		sels: [],//列表选中列
    		isAgreeForm:{
    			reclaimId:'',
    			notes:'',
    			state:'',
    		},
		}
	},
	computed: {
		...mapGetters([
			'reclaimList',
   		])
	},
	watch: {
		reclaimList() {
            this.$set(this.tableConfig, "dataList", this.reclaimList);
            this.$set(this.tableConfig, "listLoading", false);
		}
	},
	methods: {
		//跳转回收单详情
		handelLink(row){
			this.$router.push({ path: '/receipt/reclaim/reclaimDetail' , query: { reclaimId: row.reclaimId }});
		},
		//是够显示同意拒绝按钮
		agreeIsShow(index,row){
			if(row.state == 0 || row.state == 1 || row.state == 3 ){//待查看 、 待确定（同意、拒绝）时显示
				return true;
			}else{
				return false;
			}
		},
		//是否显示完成按钮
		doneIsShow(index,row){
			if(row.state == 1 || row.state == 3 ){//待确定（同意、拒绝）时显示
				return true;
			}else{
				return false;
			}
		},
		//0 待查看，1同意，2交易完成，3拒绝
		//回收交易完成
		doReclaim(index,row){
			this.$confirm('是否完成该笔交易?', '提示', {
				type: 'warning'
			}).then(() => {
				let para = {reclaimId:row.reclaimId,state:2}
				this.$store.dispatch('changeReclaimState',para).then((res)=>{
					if(res.status == 200){
						this.handleSearch();
					}else{
						this.$message({
							message:res.msg,
							type:error,
						});
					}
				});
			});
		},
		//同意or拒绝
		doAgree(index,row){
			if(row.state == 0){
				this.agree = 1;
			}else{
				this.agree = row.state;
			}
			this.isAgreeForm = row;
			this.dialogIsAgreeVisible = true;
		},
		//同意or拒绝
		doAgreeSubmit(){
			let para = Object.assign(this.isAgreeForm,{state:this.agree});
			para.updateDate = (!para.updateDate || para.updateDate == '') ? '' : new Date(para.updateDate);
			para.createDate = (!para.createDate || para.createDate == '') ? '' : new Date(para.createDate);
			this.$store.dispatch('editReclaim',para).then((res)=>{
				if(res.status == 200){
					this.$refs['isAgreeForm'].resetFields();
					this.dialogIsAgreeVisible = false;
					this.handleSearch();
				}else{
					this.$message({
						message:res.msg,
						type:error,
					});
				}
			});
			
		},
		//格式化状态
		stateFormatter(row, column) {
			let st = "";
			if(row.state == 0){
				st = '待查看';
			}else if(row.state == 1){
				st = '同意回收';
			}else if(row.state == 2){
				st = '交易完成';
			}else if(row.state == 3){
				st = '拒绝回收';
			}
			return st;
		},
		//是否在操作列中显示删除(true-显示, false-不显示)
		butIsShow(index, row,label) {
			if(label == '修改' && this.purview.indexOf('2')>-1){
				return true;
			}else if(label == '删除' && this.purview.indexOf('3')>-1){
				return true;
			}else{
				return false;
			}
		},
		//关键字检索
		handleSearch() {
			let para = {
				pageNum: 1,
				pageSize:10,
				keyWord: this.searchVaule,
				state:-2
			};
		this.$store.dispatch('getReclaimByPage', para);
		},
		//行中修改
		handleEdit(index,row) {
			this.$router.push({ path: '/receipt/reclaim/editReclaim' , query: { reclaimId: row.reclaimId }});
		},
		//行中删除
		handleDelete(index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				let para = { reclaimIds: row.reclaimId };
				this.$store.dispatch('deleteByReclaimId',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: '删除成功！',
							type: 'success'
						});
						this.handleSearch();
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
		batchRemove: function () {
			this.$confirm('确认删除选中记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				let reclaimIds = this.sels.map(item => item.reclaimId).toString();
				let para = {reclaimIds:reclaimIds}
				this.$store.dispatch('deleteByReclaimId',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: '删除成功！',
							type: 'success'
						});
						this.handleSearch();
					}else{
						this.$message({
							message: '删除失败！',
							type: 'error'
						});
					}
			    });  
			});
		},
		//列表勾选的行
		handleSelectionChange(val) {
		    this.sels = val;
	    },
		//关闭对话框前重置表单
		MyClose() {
			//清空数据
			this.$store.dispatch('clear_retrieve_book');
			this.$store.dispatch('clearRetrieveBookObj');
			this.addFormVisible = false
			this.$refs['addForm'].resetFields();
		},
	},
	mounted() {
		let user = JSON.parse(sessionStorage.getItem('user'));
		if(user.purview[4]){
			let purview = user.purview[4].toString();
			this.purview = purview;
			
			if(user.purview[4].indexOf('4')>-1){
				this.handleSearch();
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
.recl-container{
	margin-top: 10px;
	width: 100%;
	.recl-top{
		margin-bottom: 5px;
		float: left;
		width:100%;
		.el-input{
			width: 20%;
			display: inline-block;
			float: right;
		}
	}
	.recl-addForm{
		.rel-note{
			color: #4db3ff;
			margin-left: 1em;
		}
		.recl-input{
		width: 46% !important;
		}
	}
	.recl-footer {
		text-align: center;
	}
}
</style>