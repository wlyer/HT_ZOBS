<template>
	<section class="relateBooks-container">
		<el-card>
		  <div slot="header" class="clearfix">
		    <strong style="line-height: 20px;">订单相关图书</strong>
		  </div>
		  	<CommTable :tableConfig="tableConfig" ></CommTable>
		  	<div class="relateBooks-btn">
				<el-button type="primary"  @click.native="back()">返回</el-button>
			</div>
		</el-card>
	</section>
</template>

<script>
import CommTable from '../../../../components/CommTable'
import { mapGetters } from 'vuex'
export default {
	components: {
		CommTable
	},
	data() {
		const columns = [{
		        label: '图书编号',
		        prop: 'bookId',
		        handelLink: this.handelLink
	        },
	        {
	          	label: '图书名称',
	          	prop: 'bookName',
	        },
	        {
	          	label: '图书价格',
	          	prop: 'price',
	        },{
	          	label: '图书折扣',
	          	prop: 'discount',
	        },
	        {
	          	label: '仓库位置',
	          	prop: 'storeHouse',
	        },
	        {
	          	label: '图书数量',
	          	prop: 'bookNum',
	        },{
	          	label: '图书状态',
	          	prop: 'state',
	          	formatter: this.stateFormatter,
	        }];
	    const orderId=this.$route.query.orderId;
		//查询参数
        const params = {
        	pageNum: 1,
			pageSize:10,
			orderId: orderId
        }
        return {
      		tableConfig: {
		      	columns,
		      	params,
		      	dispatch: 'getBooksByOrderId',
		      	dataList: [],
    		},
    		payMode:'',//支付方式
        }
	},
	computed: {
		...mapGetters([
			'getBooksByOrderId'
		]),
	},
	watch: {
		getBooksByOrderId() {
            this.$set(this.tableConfig, "dataList", this.getBooksByOrderId);
		}
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		//格式化状态
		stateFormatter(row, column) {
			let st = "";
			if(row.state == -1){
				st = '已取消';
			}else if(row.state == 0){
				st = '交易成功';
			}else if(row.state == 1 && this.payMode == 0){//货到付款+待付款 = 待发货
				st = '待发货';
			}else if(row.state == 1 && this.payMode == 1){//在线支付+待付款 = 待付款
				st = '待付款';
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
	},
	mounted() {
		const {orderId,payMode}=this.$route.query;
		this.payMode = payMode;
			let para = {
				pageNum: this.getBooksByOrderId.pageNum ? this.getBooksByOrderId.pageNum : 1,
				pageSize: this.getBooksByOrderId.pageSize ? this.getBooksByOrderId.pageSize : 10,
				orderId: orderId
			};
			this.$store.dispatch('getBooksByOrderId',para);
		
	}
}
</script>

<style scoped lang="scss">
.relateBooks-container{
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
	.relateBooks-btn {
		margin-top: 1em;
		text-align: center;
	}
}
</style>
