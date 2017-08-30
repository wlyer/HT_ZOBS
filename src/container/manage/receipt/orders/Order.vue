<template>
	<div class="order-container">
		<div class="order-top">
			<el-button type="primary" :disabled="this.sels.length===0" @click="batchRemove">删除</el-button>
			<el-input
				title="请输入关键字（订单编号，收货人，收货人电话，收货地址，送货人）"
			  	placeholder="请输入关键字（订单编号，收货人，收货人电话，收货地址，送货人）"
			  	icon="search"
			  	v-model="searchVaule"
			  	:on-icon-click="handleSearch">
			</el-input>
		</div>
		<CommTable  :tableConfig="tableConfig"></CommTable>
		<el-dialog title="分配订单"  :visible.sync="distributeVisible" :close-on-click-modal="false" :before-close="closeDistributeDialog">
			<el-form :model="distributeForm" label-width="110px" :rules="distributeFormRules" ref="distributeForm" >
				<el-form-item label="订单号：" prop="orderId">
					<span v-text="distributeForm.orderId" auto-complete="off"></span>
				</el-form-item>
				<el-form-item label="送件人：" prop="delivery">
					<el-input v-model="distributeForm.delivery" auto-complete="off" class="distribute-input"></el-input>
				</el-form-item>
				<el-form-item label="送件人电话：" prop="deliveryPhone">
					<el-input v-model="distributeForm.deliveryPhone" auto-complete="off" class="distribute-input"></el-input>
				</el-form-item>
				<el-form-item label="送货时间：" prop="deliveryDate">
					<el-date-picker type="datetime" placeholder="选择日期" class="distribute-input" v-model="distributeForm.deliveryDate"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="finish-footer">
				<el-button type="primary" @click.native="closeDistributeDialog">取消</el-button>
				<el-button type="primary" @click.native="distribute">分配</el-button>
			</div>
		</el-dialog>
		<!-- 退款 -->
		<el-dialog title="退款/退货" size="small"  :visible.sync="backMoneyVisible"  :before-close="closeBackMoney">
				<span style="display:block;margin-bottom: 10px;font-weight: bold;">订单编号：{{orderId}}</span>
				<el-table
					v-loading="loading"
					element-loading-text="拼命加载中"
				    :data="books"
				    height="250"
				    border
				    style="width: 100%">
				    <el-table-column
				      	prop="bookName"
				      	label="图书名称"
				      	width="150">
				    </el-table-column>
				    <el-table-column
				      	prop="bookNum"
				      	label="图书数量"
				      	width="120">
				    </el-table-column>
				    <el-table-column
				      	prop="backPrice"
				      	label="退款金额"
				      	width="120">
				      	<template scope="scope">
				      		{{(scope.row.price*scope.row.discount*scope.row.bookNum).toFixed(2)}}
				      	</template>
				    </el-table-column>
				    <el-table-column
				      	prop="state"
				      	label="状态"
				      	width="120"
				      	:formatter='stateFormatter'>
				    </el-table-column>
				     <el-table-column
				      	label="操作"
				      	>
				      	<template scope="scope">
				      		<el-button size="small" type="danger" @click.native="backMoney(scope.$index, scope.row,scope)" v-if="scope.row.state ==4 || scope.row.state ==6">{{scope.row.state==4?('退款'):(scope.row.state==6?'退货':'')}}</el-button>
				      	</template>
				    </el-table-column>
				</el-table>
			<div slot="footer" class="finish-footer">
				<el-button type="primary" @click.native="closeBackMoney">确定</el-button>
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
		CommTable
	},
	data() {
		const columns = [{
		        label: '订单编号',
		        prop: 'orderId',
		        handelLink: this.handelLink,
		        width: 160
	        },
	        {
	          	label: '收件人',
	          	prop: 'receiver',
	        },
	        {
	          	label: '收件电话',
	          	prop: 'phone',
	          	width: 125
	        },
	        {
	          	label: '送货人',
	          	prop: 'delivery',
	        },
	        {
	          	label: '订单金额',
	          	prop: 'price',
	          	width: 100,
	        },
	        {
	          	label: '支付方式',
	          	prop: 'payMode',
	          	formatter: this.paymentFormatter,
	          	width: 100,
	        },
	        {
	          	label: '状态',
	          	prop: 'state',
	          	formatter: this.stateFormatter,
	          	width: 100,
	        },
	        {
	          	label: "操作",
	          	width: 250,
		  		operations: [
			  		{
			          label: '编辑',
			          butType: 'info',
			          func: this.handleEdit
		        	},{
			          label: '删除',
			          butType: 'danger',
			          func: this.handleDelete,
			          isShow: this.delIsShow,
		        	},{
			          label: this.labelFun,
			          butType: 'info',
			          func: this.handleAction,
			          isShow: this.butIsShow,
		        	}
		        ]
	        }];
	    //查询参数
        const params = {
        	pageNum: 1,
			pageSize:10,
			keyWord: ''
        }
        return {
        	loading:false,
        	orderId:'',//为确认退款货提供订单编号
        	books:[],//订单图书信息
      		tableConfig: {
		      	columns,
		      	params,
		      	dispatch: 'getOrderByPage',
		      	dataList: [],
		      	rowOptions:this.handleSelectionChange,
		      	listLoading:true,
    		},
    		searchVaule: '',//检索值
    		sels: [],//列表选中列
    		finishVisible: false,//完成订单操作
    		distributeVisible: false,//分配订单操作
    		backMoneyVisible:false,//退款退货操作
			//配送订单表单
			distributeForm: {
				orderId:'',
				delivery:'',
				deliveryPhone:'',
				deliveryDate:''
			},
			distributeFormRules: {
				delivery:[
					{required: true, message: '请输入名称', trigger: 'blur' }
				],
				deliveryPhone:[
					{required: true, message: '请输入电话号码', trigger: 'blur' },
					{ pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '请输入正确的手机号（例如：13101030301）' , trigger: 'blur,change' }
				],
				deliveryDate:[
					{type: 'date', required: true, message: '请输入时间', trigger: 'blur' }
				]
			}
        }
	},
	computed: {
		...mapGetters([
			'getOrderByPage',
		]),
	},
	watch: {
		getOrderByPage() {
            this.$set(this.tableConfig, "dataList", this.getOrderByPage);
            this.$set(this.tableConfig, "listLoading", false);
		}
	},
	methods: {
		//关键字检索
		handleSearch() {
			this.getOrders();
		},
		//初始化或者刷新表格
		getOrders() {
			let para = {
				pageNum: this.getOrderByPage.pageNum ? this.getOrderByPage.pageNum : 1,
				pageSize: this.getOrderByPage.pageSize ? this.getOrderByPage.pageSize : 10,
				keyWord: this.searchVaule
			};
			this.$store.dispatch('getOrderByPage',para);
		},
		//格式化状态
		stateFormatter(row, column) {
			let st = "";
			if(row.state == -1){
				st = '取消订单';
			}else if(row.state == 0){
				st = '交易成功';
			}else if(row.state == 1 && row.payMode==0){//货到付款，订单为待付款，显示待发货
				st = '待发货';
			}else if(row.state == 1 && row.payMode==1){//在线支付，订单为待付款，显示待付款
				st = '待付款';
			}else if(row.state == 2){
				st = '待发货';
			}else if(row.state == 3){
				st = '待收货';
			}else if(row.state == 4){
				st = '申请退款';
			}else if(row.state == 5){
				st = '退款成功';
			}else if(row.state == 6){
				st = '申请退货';
			}else if(row.state == 7){
				st = '退货成功';
			}else if(row.state == 9){
				st = '交易关闭';
			}
			return st;
		},
		//支付方式状态
		paymentFormatter(row, column) {
			let st = "";
			if(row.payMode == 0){
				st = '货到付款';
			}else if(row.payMode == 1){
				st = '在线支付';
			}
			return st;
		},
		//状态不同显示不同操作
	    labelFun(index,row) {
	    	let str = '完成';
	    	let states = row.books.map((item)=>item.state).toString();
	    	if(row.state == 2 || (row.state ==1 && row.payMode == 0)){//待发货和货到付款的待付款
	    		str = '分配';
	    	}else if(row.state == 3 && states.indexOf(4)==-1 && states.indexOf(6)==-1){//订单待收货且订单中的商品不存在申请退款/申请退货，则显示完成按钮
	    		str = '完成';
	    	}else if(row.state == 4 || states.indexOf(4)>-1){
	    		str = '退款';
	    	}else if(row.state == 6 || states.indexOf(6)>-1){
	    		str = '退货';
	    	}
	    	return str;
	    },
	    //是否在操作列中显示按钮(true-显示, false-不显示)
		butIsShow(index, row) {
			let states = row.books.map(item=>item.state).toString();
			//待付款且货到付款则显示分配按钮，否则不显示分配按钮
			if(row.state == 1 && row.payMode == 0){
				return true;
			}
			//待发货/待收货，且订单中存在商品是申请退款/申请退货，则显示退款退货按钮
			if((row.state==2 || row.state==3) && (states.indexOf(4)>-1 || states.indexOf(6)>-1)){
				return true;
			}
			if(row.state==2 || row.state== 3 || row.state==4 || row.state==6){
				return true;
			}else{
				return false;
			}
		},
		//删除按钮是否显示
		delIsShow(index, row){
			if(row.state == -1 || (row.state == 1 && row.payMode == 1)){//取消订单和在线支付的待付款可以删除
				return true;
			}else{
				return false;
			}
		},
	    //转跳订单详情
	    handelLink(row) {
	    	this.$router.push({ path: '/receipt/order/orderDetail', query: { orderId: row.orderId }});
	    },
	    //根据不同状态进行相关操作
	    handleAction(index, row) {
	    	let states = row.books.map((item)=>item.state).toString();
	    	if(row.state==2 || (row.state ==1 && row.payMode == 0)){//待发货或者(待付款且为货到付款)进入分配界面
	    		this.distributeForm = Object.assign({},this.distributeForm,{orderId:row.orderId})
	    		this.distributeVisible = true;
	    	}else if(row.state==3 && states.indexOf(4)==-1 && states.indexOf(6)==-1){//订单状态为3，且订单中不存在退货/退款商品，则显示完成按钮（进入确认收货界面,完成订单）
	    		this.$confirm('确认完成该笔交易?', '提示', {
					type: 'warning'
				}).then(() => {
					let bookIds = [];
					row.books.map((item)=>{
						if(item.state==3){//只有待收货的才能完成
							bookIds.push(item.bookId);
						}
					});
					let para = {orderId:row.orderId,bookId:bookIds.toString(),state:0};
					this.$store.dispatch('changeOrderState',para).then((res) => {
						if(res.status==200){
							this.$message({
								message: '交易完成',
								type: 'success'
							});
							this.getOrders();
						}else{
							this.$message({
								message: res.msg,
								type: 'error'
							});
						}
				    });  
				});
	    	}else if(row.state==4 || row.state==6 || states.indexOf(4)>-1 || states.indexOf(6)>-1){//订单或者订单中存在商品是退款中或者退货中显示确认退款/确认退货
	    		this.loading=true;
	    		this.$store.dispatch('getOrderById',{orderId:row.orderId}).then((res) => {
	    			this.books=res.books;
	    			this.loading=false;
	    		});
	    		this.orderId = row.orderId;
	    		this.backMoneyVisible = true;
	    	}
	    },
		//行中修改
		handleEdit(index,row) {
			this.$router.push({ path: '/receipt/order/editOrder', query: { orderId: row.orderId }});
		},
		//行中删除
		handleDelete(index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'error'
			}).then(() => {
				let para = { orderIds: row.orderId };
				this.$store.dispatch('deleteOrderByIds',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: '删除成功！',
							type: 'success'
						});
						this.getOrders();
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
			this.$confirm('确认删除选中记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				let states = this.sels.map(item => item.state).toString();
				if(states.indexOf('-1')>-1 || states.indexOf('1')>-1){
					let orderIds = this.sels.map(item => item.orderId).toString();
					let para = {orderIds:orderIds}
					this.$store.dispatch('deleteOrderByIds',para).then((res) => {
						if(res.status==200){
							this.$message({
								message: '删除成功！',
								type: 'success'
							});
							this.getOrders();
						}else{
							this.$message({
								message: '删除失败！',
								type: 'error'
							});
						}
				    });  
				}else{
					this.$message({
						message:'存在已付款的订单，不能删除！',
						type:'error'
					});
					return;
				}
			});
		},
		
		//列表勾选的行
		handleSelectionChange(val) {
		    this.sels = val;
	    },
	    
	    //分配
	    distribute(){
	    	this.$refs.distributeForm.validate((valid) => {
				if (valid) {
					//获取订单信息
					this.$store.dispatch('getOrderById',{orderId:this.distributeForm.orderId}).then((res) => {
						let para = Object.assign({}, res, this.distributeForm,{state:3});
						para.deliveryDate = (!para.deliveryDate || para.deliveryDate == '') ? '' : new Date(para.deliveryDate);
						para.createDate = (!para.createDate || para.createDate == '') ? '' : new Date(para.createDate);
						para.updateDate = (!para.updateDate || para.updateDate == '') ? '' : new Date(para.updateDate);
						para.receiverDate = (!para.receiverDate || para.receiverDate == '') ? '' : new Date(para.receiverDate);
						delete para.sellerInfo;
						delete para.books;
						//分配修改订单
						this.$store.dispatch('editOrder',para).then((res) => {
	    					if(res.status==200){
								this.$message({
									message: '分配成功！',
									type: 'success'
								});
								this.closeDistributeDialog()
								this.getOrders();
							}else{
								this.$message({
									message: '分配失败！',
									type: 'error'
								});
							}
	    				});
					});
					
				}
			});
	    },
	    //关闭完成窗口
	    closeFinishDialog(){
	    	this.finishVisible = false;
	    	this.$refs['finishForm'].resetFields();
	    },
	    //关闭分配窗口
	    closeDistributeDialog(){
	    	this.distributeVisible = false;
	    	this.$refs['distributeForm'].resetFields();
	    },
	    closeBackMoney(){
	    	this.orderId = '',
	    	this.books = [],
	    	this.backMoneyVisible = false;
	    	this.getOrders();
	    },
	    
	    //退款相应操作----------------------------- 
	    
	    //退款或者退货
	    backMoney(index, row){
	    	let state = 0;
	    	let flag = '';
	    	if(row.state == 4){
				state = 5;
				flag = '退款';
			}else if(row.state == 6){
				state = 7;
				flag = '退货';
			}
	    	this.$confirm('确认该商品需要'+flag+'?', '提示', {
				type: 'warning'
			}).then(() => {
				let para = {orderId:this.orderId,bookId:row.bookId,state:state};
				this.$store.dispatch('changeOrderState',para).then((res) => {
					if(res.status==200){
						this.$message({
							message: flag+'成功！',
							type: 'success'
						});
						this.loading=true;
			    		this.$store.dispatch('getOrderById',{orderId:this.orderId}).then((res) => {
			    			this.books=res.books;
			    			this.loading=false;
			    		});
					}else{
						this.$message({
							message: flag+'失败！',
							type: 'error'
						});
					}
			    });  
			});
	    },
	},
	mounted() {
		//初始化表格
		this.getOrders();
	}
}

</script>

<style scoped lang="scss">
.order-container{
	margin-top: 10px;
	width: 100%;
	.order-top{
		margin-bottom: 5px;
		float: left;
		width:100%;
		.el-input{
			width: 20%;
			display: inline-block;
			float: right;
		}
	}
	.finish-footer{
		text-align: center;
	}
	.distribute-input{
		width: 70% !important;
	}
}
</style>