<template>
	<el-card class="addBook-card">
		<div slot="header" class="clearfix">
		    <strong style="line-height: 5px;">新增图书</strong>
		</div>
		<el-form :model="addBookForm" label-width="100px" :rules="formRules" ref="addBookForm">
			<el-row>
				<el-col :span="12">
				 	<el-form-item label="图书编号：" prop="bookId">
						<el-input v-model="addBookForm.bookId" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="状态：">
						<el-select  placeholder="请选择状态" v-model="addBookForm.state">
					      <el-option label="下架" value=0></el-option>
					      <el-option label="上架" value=1></el-option>
					    </el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="图书名称：" prop="bookName">
						<el-input v-model="addBookForm.bookName" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="作者：" prop="author">
						<el-input v-model="addBookForm.author" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="价格：" prop="price">
						<el-input v-model="addBookForm.price" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				  <el-col :span="12">
				 	<el-form-item label="折扣：" prop="discount">
						<el-input v-model="addBookForm.discount" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="出版社：" prop="press">
						<el-input v-model="addBookForm.press" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				  <el-col :span="12">
				 	<el-form-item label="出版时间：" prop="publishTime">
						<el-date-picker type="date" placeholder="选择日期" v-model="addBookForm.publishTime"></el-date-picker>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
				 	<el-form-item label="印刷时间：" prop="printtime">
						<el-date-picker type="date" placeholder="选择日期" v-model="addBookForm.printtime"></el-date-picker>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="版次：" prop="edition">
						<el-input v-model="addBookForm.edition" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="页数：" prop="pageNum">
						<el-input v-model="addBookForm.pageNum" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="字数：" prop="wordNum">
						<el-input v-model="addBookForm.wordNum" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="开本：" prop="bookSize">
						<el-input v-model="addBookForm.bookSize" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="纸质：" prop="paper">
						<el-input v-model="addBookForm.paper" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
				 	<el-form-item label="仓库位置：" prop="storehouse">
						<el-input v-model="addBookForm.storehouse" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
				 <el-col :span="12">
				 	<el-form-item label="库存量：" prop="bookNum">
						<el-input v-model="addBookForm.bookNum" auto-complete="off"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="24">
				 	<el-form-item label="图书简介：" prop="bookDesc">
						<el-input type="textarea" v-model="addBookForm.bookDesc"></el-input>
					</el-form-item>
				 </el-col>
			</el-row>
			<el-row>
				 <el-col :span="24">
				 	<el-form-item label="封面图：" prop="image_l">
				 		<el-upload
						  class="upload-demo"
						  :action="url"
						  :on-success="handleSuccess"
						  :on-remove="handleRemove"
						  :disabled="addBookForm.image_l==''?false:true">
						  <el-button size="small" type="primary" :disabled="addBookForm.image_l==''?false:true">点击上传</el-button>&nbsp;&nbsp;&nbsp;<font slot="tip" size="1" color="#8C939D">只能上传jpg/png文件，且不超过500kb</font>
						</el-upload>
					</el-form-item>
				 </el-col>
			</el-row>
			
		</el-form>
		<div style="text-align: center;">
			<el-button type="primary" @click.native="reset">重置</el-button>
			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		</div>
	</el-card>
</template>

<script>
import util from '../../../../util/util';
import {Host} from '../../../../api/Host';
export default {
	data() {
		return {
			fileList:[],
			url:Host+`upload/uploadFile`,
			addBookForm: {
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
				state: [
					{ type: 'number', required: true, message: '请选择状态', trigger: 'blur' }
				],
				storehouse: [
					{ required: true, message: '请选输入仓库位置', trigger: 'blur' }
				]
			},
		}
	},
	methods: {
		//图片上传移除
		handleRemove(file) {
	        this.addBookForm.image_l="";
      	},
      	//图片上传中
      	handleSuccess(response, file) {
      		this.addBookForm.image_l=response.msg.fileName;
      	},
		addSubmit() {
			this.$refs.addBookForm.validate((valid) => {
				if (valid) {
					this.addLoading = true;
					let typeId=this.$route.query.typeId;
					let para = Object.assign({}, {typeId: typeId}, this.addBookForm);
					if(para.discount==''){
						para.discount=1;
					}
					para.publishTime = (!para.publishTime || para.publishTime == '') ? '' : util.formatDate.format(new Date(para.publishTime), 'yyyy-MM-dd');
					para.printtime = (!para.printtime || para.printtime == '') ? '' : util.formatDate.format(new Date(para.printtime), 'yyyy-MM-dd');
					this.$store.dispatch('addBook',para).then((res) => {
						this.addLoading = false;
						if(res.status==200){
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.$refs['addBookForm'].resetFields();
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
			this.$refs.addBookForm.resetFields();
		}
	},
	mounted(){
		this.addBookForm.bookId=new Date().getTime()+"";
	}
}
	
</script>
<style scoped lang="scss">
.addBook-card {
	width:65%;
    margin: 1em auto;
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
