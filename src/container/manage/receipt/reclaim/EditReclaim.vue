<template>
	<section class="reclaim-edit">
		<el-card>
		  <div slot="header" class="clearfix">
		    <strong style="line-height: 20px;">修改订单</strong>
		  </div>
		  	<div>
		  		<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
					<el-form-item label="回收单号" prop="reclaimId">
						<el-input v-model="editForm.reclaimId" readonly auto-complete="off"></el-input><!-- input中加入autocomplete="off" 来关闭记录,默认on -->
					</el-form-item>
					<el-form-item label="回收人姓名" prop="sellerName">
						<el-input v-model="editForm.sellerName" ></el-input><!-- input中加入autocomplete="off" 来关闭记录,默认on -->
					</el-form-item>
					<el-form-item label="回收人电话" prop="sellerPhone">
						<el-input v-model="editForm.sellerPhone" ></el-input>
					</el-form-item>
					<el-form-item label="回收人地址" prop="sellerAddr">
						<el-input v-model="editForm.sellerAddr"></el-input>
					</el-form-item>
					<el-form-item label="货物描述" prop="goodsDsc">
						<el-input size="3" v-model="editForm.goodsDsc"></el-input>
					</el-form-item>
					<el-form-item label="货物数量" prop="number">
						<el-input v-model="editForm.number"></el-input>
					</el-form-item>
					<el-form-item label="期望价格" prop="tradPrice">
						<el-input v-model="editForm.tradPrice"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="state">
					    <el-select v-model="editForm.state" placeholder="请选择状态类型">
						    <el-option label="待查看" value="0"></el-option>
						    <el-option label="同意回收" value="1"></el-option>
						    <el-option label="交易完成" value="2"></el-option>
						    <el-option label="拒绝回收" value="3"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="备注" prop="notes">
						<el-input v-model="editForm.notes"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="footer-button">
					<el-button @click.native="back">取消</el-button>
					<el-button type="primary" @click.native="editSubmit" >提交</el-button>
				</div>
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
				sellerName: [
					{ required: true, message: '请输入回收人姓名', trigger: 'blur' }
				],
				sellerPhone: [
					{ required: true, message: '请输入回收人电话', trigger: 'blur' }
				],
				sellerAddr: [
					{ required: true, message: '请输入回收人地址', trigger: 'blur' }
				],
				goodsDsc: [
					{ required: true, message: '请输入货物描述', trigger: 'blur' }
				],
				tradPrice: [
					{ required: true, message: '请输入期望价格', trigger: 'blur' }
				],
				state: [
					{ required: true, message: '请选择状态', trigger: 'blur' }
				]
			},
			editForm: {
				reclaimId:'',
				sellerName: '',
				sellerPhone: '',
				sellerAddr: '',
				goodsDsc: '',
				number: '',
				tradPrice: '',
				state: '',
				notes:'',
			},
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
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					let para = this.editForm;
					para.updateDate = (!para.updateDate || para.updateDate == '') ? '' : new Date(para.updateDate);
					para.createDate = (!para.createDate || para.createDate == '') ? '' : new Date(para.createDate);
					this.$store.dispatch('editReclaim',para).then((res) => {
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
			this.$refs.editForm.resetFields();
			this.$router.go(-1);
		},
	},
	mounted() {
		const reclaimId=this.$route.query.reclaimId;
		this.$store.dispatch('getReclaimById',{reclaimId: reclaimId}).then((res)=>{
			this.editForm = Object.assign(res,{state:res.state.toString()});
		})
	}
}
</script>

<style scoped lang="scss">
.footer-button{
	text-align: center;
}
.reclaim-edit{
	padding-top: 50px;
	width:600px;
    margin: auto;
    
	.clearfix{
		text-align: center;
	}
}

</style>
