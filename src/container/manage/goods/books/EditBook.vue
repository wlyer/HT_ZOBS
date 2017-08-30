<template>
	<el-card class="editBook-card">
		<div slot="header" class="clearfix">
		    <strong style="line-height: 5px;">修改图书</strong>
		</div>
		<el-form :model="editBookForm" label-width="100px" :rules="formRules" ref="editBookForm">
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="图书编号：" prop="bookId">
						<el-input v-model="editBookForm.bookId" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="图书名称：" prop="bookName">
						<el-input v-model="editBookForm.bookName" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="作者：" prop="author">
						<el-input v-model="editBookForm.author" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="价格：" prop="price">
						<el-input v-model="editBookForm.price" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="折扣：" prop="discount">
						<el-input v-model="editBookForm.discount" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="出版社：" prop="press">
						<el-input v-model="editBookForm.press" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="出版时间：" prop="publishTime">
						<el-date-picker type="date" placeholder="选择日期" v-model="editBookForm.publishTime"></el-date-picker>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="版次：" prop="edition">
						<el-input v-model="editBookForm.edition" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="页数：" prop="pageNum">
						<el-input v-model="editBookForm.pageNum" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="字数：" prop="wordNum">
						<el-input v-model="editBookForm.wordNum" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="印刷时间：" prop="printtime">
						<el-date-picker type="date" placeholder="选择日期" v-model="editBookForm.printtime"></el-date-picker>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="开本：" prop="bookSize">
						<el-input v-model="editBookForm.bookSize" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="纸质：" prop="paper">
						<el-input v-model="editBookForm.paper" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
					<el-form-item label="状态：" prop="state">
						<el-select  placeholder="请选择状态" v-model="editBookForm.state">
					      <el-option label="下架" :value=0></el-option>
					      <el-option label="上架" :value=1></el-option>
					    </el-select>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="仓库位置：" prop="storehouse">
						<el-input v-model="editBookForm.storehouse" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="库存量：" prop="bookNum">
						<el-input v-model="editBookForm.bookNum" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="图书简介：" prop="bookDesc">
						<el-input type="textarea" v-model="editBookForm.bookDesc"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="24">
				 	<el-form-item label="封面图：" prop="image_l">
				 		<el-upload
						  class="upload-demo"
						  :action="url"
						  :file-list="fileList"
						  :on-success="handleSuccess"
						  :on-remove="handleRemove"
						  :disabled="editBookForm.image_l==''?false:true">
						  <el-button size="small" type="primary" :disabled="editBookForm.image_l==''?false:true">点击上传</el-button>&nbsp;&nbsp;&nbsp;<font slot="tip" size="1" color="#8C939D">只能上传jpg/png文件，且不超过500kb</font>
						</el-upload>
					</el-form-item>
				 </el-col>
			</el-row>
		</el-form>
		<div style="text-align: center;">
			<el-button type="primary" @click.native="reset">重置</el-button>
			<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
		</div>
	</el-card>
</template>

<script>
import util from '../../../../util/util'
import { mapGetters } from 'vuex';
import {Host} from '../../../../api/Host';
export default {
	data() {
		return {
			url:Host+`upload/uploadFile`,
			editBookForm: {
				bookId: '',
				bookName: '',
				author: '',
				price: '',
				discount: '',
				press: '',
				publishTime: '',
				edition: '',
				pageNum: '',
				wordNum: '',
				printtime: '',
				bookSize: '',
				paper: '',
				image_l: '',
				image_s: '',
				orderBy: '',
				storehouse: '',
				bookNum: '',
				state: '',
				bookDesc: ''
			},
			addLoading: false,
			formRules: {
				bookId: [
					{ required: true, message: '必填项', trigger: 'blur' }
				],
				bookName: [
					{ required: true, message: '请输入图书名称', trigger: 'blur' }
				],
				price: [
					{ required: true, message: '请输入价格', trigger: 'blur' }
				],
				storehouse: [
					{ required: true, message: '请选输入仓库位置', trigger: 'blur' }
				]
			},
		}
	},
	computed: {
		...mapGetters([
			'getBookById'
   		]),
   		fileList(){
   			if(this.editBookForm.image_l!=''){
   				return [{name:this.editBookForm.image_l,url:Host+`bookpicture/`+this.editBookForm.image_l}]
   			}
   			return [];
   		}
	},
	watch: {
		getBookById() {
			let bookData ={
					bookId: this.getBookById.bookId? this.getBookById.bookId: '',
					bookName: this.getBookById.bookName? this.getBookById.bookName: '',
					author: this.getBookById.author? this.getBookById.author: '',
					price: this.getBookById.price? this.getBookById.price.toString(): '',
					discount: this.getBookById.discount? this.getBookById.discount: '',
					press: this.getBookById.press? this.getBookById.press: '',
					publishTime: this.getBookById.publishTime? this.getBookById.publishTime: '',
					edition: this.getBookById.edition? this.getBookById.edition: '',
					pageNum: this.getBookById.pageNum? this.getBookById.pageNum: '',
					wordNum: this.getBookById.wordNum? this.getBookById.wordNum: '',
					printtime: this.getBookById.printtime? this.getBookById.printtime: '',
					bookSize: this.getBookById.bookSize? this.getBookById.bookSize: '',
					paper: this.getBookById.paper? this.getBookById.paper: '',
					image_l: this.getBookById.image_l? this.getBookById.image_l: '',
					image_s: this.getBookById.image_s? this.getBookById.image_s: '',
					orderBy: this.getBookById.orderBy? this.getBookById.orderBy: '',
					storehouse: this.getBookById.storehouse? this.getBookById.storehouse: '',
					bookNum: this.getBookById.bookNum? this.getBookById.bookNum: '',
					state: this.getBookById.state? this.getBookById.state.toString(): '',
					bookDesc: this.getBookById.bookDesc? this.getBookById.bookDesc: ''
   				}
			this.editBookForm = Object.assign({},this.editBookForm, bookData);
		}
	},
	methods: {
		//图片上传移除
		handleRemove(file) {
	        this.editBookForm.image_l="";
      	},
      	//图片上传中
      	handleSuccess(response, file) {
      		this.editBookForm.image_l=response.msg.fileName;
      	},
		editSubmit() {
			this.$refs.editBookForm.validate((valid) => {
				if (valid) {
					this.addLoading = true;
					let para = Object.assign({}, this.getBookById, this.editBookForm);
					para.createDate = (!para.createDate || para.createDate == '') ? '' : util.formatDate.format(new Date(para.createDate), 'yyyy-MM-dd');
					para.publishTime = (!para.publishTime || para.publishTime == '') ? '' : util.formatDate.format(new Date(para.publishTime), 'yyyy-MM-dd');
					para.printtime = (!para.printtime || para.printtime == '') ? '' : util.formatDate.format(new Date(para.printtime), 'yyyy-MM-dd');
					delete para.updateDate;
					this.$store.dispatch('editBook',para).then((res) => {
						this.addLoading = false;
						if(res.status==200){
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.$refs['editBookForm'].resetFields();
							this.$router.push({ path: '/goods/book' });
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
		//重置
		reset() {
			this.$refs.editBookForm.resetFields();
		}
	},
	mounted() {
		let bookId=this.$route.query.bookId;
		this.$store.dispatch('getById',{bookId: bookId});
	},
}
	
</script>
<style scoped lang="scss">
.editBook-card {
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
	.el-row {
		margin-top: 10px;
	}
}
</style>
