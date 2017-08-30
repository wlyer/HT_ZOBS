<template>
		<el-dialog title="图书详情"  :visible.sync="dialogFormVisible1"  class="user-info" :before-close="hiddenInfo">
	        <div class="line"></div>
	        <el-form label-width="100px" >
	        	<el-row>
				 	<div align="center">
				 		<img :src="url" ></img>
				 	</div>
				</el-row>
	            <el-row>
				 <el-col :span="12">
				 	<el-form-item label="图书编号：">
						<div class="content-info">{{bookInfo.bookId}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="图书名称：">
						<div class="content-info">{{bookInfo.bookName}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="作者：">
				 		<div class="content-info">{{bookInfo.author}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="价格：">
						<div class="content-info">{{bookInfo.price}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="折扣：">
						<div class="content-info">{{bookInfo.discount}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="出版社：">
						<div class="content-info">{{bookInfo.press}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="出版时间：">
						<div class="content-info">{{bookInfo.publishTime}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="版次：">
						<div class="content-info">{{bookInfo.edition}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="页数：">
						<div class="content-info">{{bookInfo.pageNum}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="字数：">
						<div class="content-info">{{bookInfo.wordNum}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="印刷时间：">
						<div class="content-info">{{bookInfo.printtime}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="开本：">
						<div class="content-info">{{bookInfo.bookSize}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="纸质：">
						<div class="content-info">{{bookInfo.paper}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
					<el-form-item label="状态：">
						<div class="content-info">{{bookInfo.state==0?'下架':'上架'}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="仓库位置：">
						<div class="content-info">{{bookInfo.storehouse}}</div>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="库存量：">
						<div class="content-info">{{bookInfo.bookNum}}</div>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
			 	<el-form-item label="图书简介：">
					<div class="content-info">{{bookInfo.bookDesc}}</div>
				</el-form-item>
			</el-row>
	        </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="hiddenInfo">确 定</el-button>
	        </span>
	    </el-dialog>
</template>

<script>
  	import { mapGetters } from 'vuex';
  	import {Host} from '../../../../api/Host';
	export default {
		props: [
			'bookInfo',
			'dialogFormVisible'
		],
		data() {
			return {
				dialogFormVisible1:false,
			}
		},
		methods: {
			//隐藏子组件
			hiddenInfo() {
                this.$emit('hiddenInfo', false);
            }
		},
		computed: {
		 ...mapGetters([
	   		 ]),
	   		 url(){
	   		 	return Host+`bookpicture/`+this.bookInfo.image_l;
	   		 }
	    },
		mounted() {
		},
		components: {
		},
		watch:{
			dialogFormVisible(){
				return this.dialogFormVisible1 = this.dialogFormVisible;
			}
		}
	}
</script>
<style scoped lang="scss">
.user-info{
	img{
		width:100px;
		height:150px;
	}
	.line {
	    border-bottom: 1px solid #e4e4e4;
        margin-top: -17px;
        margin-bottom: 20px;
	}
	.content-info{
		border-bottom: 1px solid;
	    width: 80%;
	    text-align: center;
        height: 30px;
	}
}
</style>

