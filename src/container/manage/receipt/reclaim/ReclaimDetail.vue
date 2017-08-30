<template>
	<section class="order-edit">
		<el-card>
		  <div slot="header" class="clearfix">
		    <strong style="line-height: 20px;">回收单详情</strong>
		  </div>
		  	<div>
		  		<el-card class="orderDetail-one">
			  		<div style="margin-bottom: 30px;"><strong>回收单信息</strong></div>
			  		<div>
			  			<div class="orderDetail-div">
			  				<div>回收单号：<span v-text="reclaimInfo.reclaimId"></span></div>
			  				<div>创建时间：<span v-text="reclaimInfo.createDate"></span></div>
			  			</div>
			  			<div  class="orderDetail-div">
			  				<div>回收人姓名：<span v-text="reclaimInfo.sellerName"></span></div>
			  				<div>回收人电话：<span v-text="reclaimInfo.sellerPhone"></span></div>
			  			</div>
			  			<div  class="orderDetail-div">
			  				<div>回收状态：<span v-text="state2Name()"></span></div>
			  				<div>回收地址：<span v-text="reclaimInfo.sellerAddr"></span></div>
			  			</div>
			  			<div >
			  				<div>备注：<span v-text="reclaimInfo.notes"></span></div>
			  			</div>
			  		</div>
				 </el-card>
			</div>
			<el-form class="detail-form" label-width="100px"  ref="orderDetailForm">
				<el-card style="padding-left: 1em;">
					<div class="orderDetail-tab"><strong>货物信息</strong></div>
					<el-form-item label="货物描述：">
						<span v-text="reclaimInfo.goodsDsc"></span>
					</el-form-item>
					<el-form-item label="货物数量：">
						<span v-text="reclaimInfo.number"></span>
					</el-form-item>
					<el-form-item label="期望价格：">
						<span v-text="reclaimInfo.tradPrice"></span>
					</el-form-item>
					<el-form-item label="货物展示：">
						<template v-for="(img,index) in reclaimInfo.imgs">
							<img :src="url+img" @click="openDialog(url+img)"></img>
						</template>
					</el-form-item>
				</el-card>
			</el-form>
			<div class="orderDetail-botton">
				<el-button type="primary"  @click.native="back()">返回</el-button>
			</div>
		</el-card>
		<el-dialog size="tiny"  :visible.sync="imgVisible" >
		  <div align="center">
		  	 <img :src="imgUrl"></img>
		  </div>
		</el-dialog>
	</section>
	
</template>

<script>
import { mapGetters } from 'vuex';
import {Host} from '../../../../api/Host';
export default {
	data() {
		return {
			imgVisible:false,
			imgUrl:'',
		}
	},
	computed: {
		...mapGetters([
			'reclaimInfo'
		]),
		url(){
   		 	return Host+`bookpicture/`;
   		 }
	},
	methods: {
		//返回
		back(){
			this.$router.go(-1);
		},
		//图片详情
		openDialog(url){
			this.imgUrl = url;
			this.imgVisible = true;
		},
		//数字的状态转换成文字
		state2Name() {
			let stateNum = this.reclaimInfo.state;
			let st = "";
			if(stateNum == 0){
				st = '待审核';
			}else if(stateNum == 1){
				st = '同意回收';
			}else if(stateNum == 2){
				st = '交易完成';
			}else if(stateNum == 3){
				st = '拒绝回收';
			}
			return st;
		}
	},
	mounted() {
		const reclaimId=this.$route.query.reclaimId;
		this.$store.dispatch('getReclaimById',{reclaimId: reclaimId})
	}
}
</script>

<style scoped lang="scss">
.orderDetail-botton{
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
	.orderDetail-one{
		font-size: 14px;
    	color: #48576a;
    	padding-left: 2em;
    	.el-row{
    		margin-top: 2em;
    	}
    	.orderDetail-div div{
    		float: left;
    		width: 50%;
    		margin-bottom: 2em;
    	}
	}
	.detail-form{
		img{
			height: 50px;
			width: 50px;
		}
	}
	.orderDetail-tab{
		margin-bottom: 2em;
    	margin-left: 1em;
	}
	
}
.el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
