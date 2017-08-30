<template>
	<section class="order-edit">
		<el-card>
		  <div slot="header" class="clearfix">
		    <strong style="line-height: 20px;">修改订单</strong>
		  </div>
		  	<div>
		  		<el-card class="editOrder-one">
			  		<div style="margin-bottom: 30px;"><strong>订单信息</strong></div>
			  		<div>
			  			<div  class="editOrder-div">
			  				<div>订单号：<span v-text="editOrderForm.orderId"></span></div>
			  				<div>支付方式：<span v-text="paymentState(getOrderById.payMode)"></span></div>
			  			</div>
			  			<div  class="editOrder-div">
			  				<div>收件人：<span v-text="editOrderForm.receiver"></span></div>
			  				<div>收件电话：<span v-text="editOrderForm.phone"></span></div>
			  			</div>
			  			<div class="editOrder-div">
			  				<div>收件地址：<span v-text="getOrderById.address"></span></div>
			  				<div>下单时间：<span v-text="editOrderForm.createDate"></span></div>
			  			</div>
			  		</div>
				 </el-card>
			</div>
		<!--编辑界面-->
			<el-form :model="editOrderForm" label-width="100px" :rules="editFormRules" ref="editOrderForm">
				<el-card style="padding-left: 1em;">
					<div class="editOrder-tab"><strong>送货信息</strong></div>
					<el-form-item label="送件人：">
					    <el-input v-model="editOrderForm.delivery" class="editOrder-delivery" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="送件人电话：">
						<span v-text="editOrderForm.deliveryPhone"></span>
					</el-form-item>
					<el-form-item label="配送时间：">
						<el-date-picker type="date" placeholder="选择日期" v-model="editOrderForm.deliveryDate"></el-date-picker>
					</el-form-item>
				</el-card>
				<el-card style="padding-left: 1em;">
					<div class="editOrder-tab"><strong>收货信息</strong></div>
					<el-form-item label="收货时间：">
						<el-date-picker type="date" placeholder="选择日期" v-model="editOrderForm.receiverDate"></el-date-picker>
					</el-form-item>
					<el-form-item label="状态" prop="state">
					    <el-select disabled v-model="editOrderForm.state" placeholder="请选择状态类型" class="editOrder-state">
						      <el-option label="取消订单" value="-1"></el-option>
						      <el-option label="交易成功" value="0"></el-option>
						      <el-option label="待付款" value="1"></el-option>
						      <el-option label="待发货" value="2"></el-option>
						      <el-option label="待收货" value="3"></el-option>
						      <el-option label="申请退款待确认" value="4"></el-option>
						      <el-option label="退款成功" value="5"></el-option>
						      <el-option label="申请退货待确认" value="6"></el-option>
						      <el-option label="退货成功" value="7"></el-option>
						      <el-option label="交易关闭" value="9"></el-option>
					    </el-select>
					</el-form-item>
				</el-card>
			</el-form>
			<div class="editOrder-botton">
				<el-button type="primary" @click.native="relateBooks(editOrderForm.orderId,editOrderForm.payMode)">订单相关图书信息</el-button>
				<el-button type="primary"  @click.native="back()">返回</el-button>
				<el-button type="primary"  @click.native="editSubmit" >提交</el-button>
			</div>
		</el-card>
	</section>
	
</template>

<script>
import { mapGetters } from 'vuex'
import util from '../../../../util/util'
export default {
	data() {
		return {
			editFormRules: {
				delivery: [
					{ required: true, message: '请选择送件人', trigger: 'blur' }
				],
				deliveryDate: [
					{ required: true, message: '请输入送货时间', trigger: 'blur' }
				],
				receiverDate: [
					{ required: true, message: '请输入收货时间', trigger: 'blur' }
				],
				state: [
					{ required: true, message: '请选择状态', trigger: 'blur' }
				]
			},
			editOrderForm: {
				orderId: '',
				receiver: '',
				phone: '',
				orderDate: '',
				delivery: '',
				deliveryDate: '',
				deliveryPhone: '',
				receiverDate: '',
				state: ''
			},
			addLoading: false,
		}
	},
	computed: {
		...mapGetters([
			'getOrderById'
		]),
	},
	methods: {
		//编辑
		editSubmit() {
			this.$refs.editOrderForm.validate((valid) => {
				if (valid) {
					this.addLoading = true;
					let para = Object.assign({},this.getOrderById, this.editOrderForm);
					para.updateDate = (!para.updateDate || para.updateDate == '') ? '' : new Date(para.updateDate);
					para.deliveryDate = (!para.deliveryDate || para.deliveryDate == '') ? '' : new Date(para.deliveryDate);
					para.receiverDate = (!para.receiverDate || para.receiverDate == '') ? '' : new Date(para.receiverDate);
					para.createDate = (!para.createDate || para.createDate == '') ? '' : new Date(para.createDate);
					delete para.sellerInfo;
					delete para.books;
					this.$store.dispatch('editOrder',para).then((res) => {
						this.addLoading = false;
						if(res.status==200){
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editOrderForm'].resetFields();
							this.$router.push({ path: '/receipt/order' });
						}else{
							this.$message({
								message: res.msg,
								type: 'error'
							});
						}
				    });
				}
			});
		},
		//返回
		back(){
			this.$refs.editOrderForm.resetFields();
			this.$router.go(-1);
		},
		//浏览订单相关图书
		relateBooks(orderId,payMode) {
			this.$router.push({ path: '/receipt/order/relateBooks', query: { orderId: orderId,payMode:payMode }});
		},
		//支付方式状态
		paymentState(payMode) {
			let st = "";
			if(payMode == 0){
				st = '货到付款';
			}else if(payMode == 1){
				st = '在线支付';
			}
			return st;
		}
	},
	mounted() {
		const orderId=this.$route.query.orderId;
		this.$store.dispatch('getOrderById',{orderId: orderId}).then((res)=>{
			this.editOrderForm = Object.assign(res,{state:res.state.toString()});
		})
	}
}
</script>

<style scoped lang="scss">
.editOrder-botton{
	margin-top: 1em;
	text-align: center;
}
.order-edit{
	padding-top: 50px;
	width:65%;
    margin: auto;
    .clearfix:before,
  	.clearfix:after {
        display: table;
        content: "";
  	}
	.clearfix:after {
	    clear: both
	}
	.editOrder-one{
		font-size: 14px;
    	color: #48576a;
    	padding-left: 2em;
    	.el-row{
    		margin-top: 2em;
    	}
    	.editOrder-div div{
    		float: left;
    		width: 50%;
    		margin-bottom: 2em;
    	}
	}
	.editOrder-tab{
		margin-bottom: 2em;
    	margin-left: 1em;
	}
	.editOrder-delivery {
		width: 35% !important;
	}
	.editOrder-state {
		width: 35% !important;
	}
}
.el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
