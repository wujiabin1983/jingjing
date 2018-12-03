// 商户管理商户用户组管理新增
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="centerInfo">
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" ref="form" v-loading="tableLoading" label-width="100px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="用户组代码" prop="codeGroup" v-if="this.getPageType=='查看'">
								<el-input v-model="form.codeGroup" placeholder="请输入用户组代码" auto-complete="off" :disabled="getPageType!='添加'"></el-input>
							</el-form-item>
							<el-form-item label="用户组名称" prop="nameGroup">
								<el-input v-model="form.nameGroup" placeholder="请输入用户组名称" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="描述">
								<el-input v-model="form.desc" type="textarea" resize="none" placeholder="请输入描述"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div>
						<el-button @click="resetForm('form')">返回</el-button>
						<el-button type="primary" @click="handleForm('form')">确定</el-button>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { commercGroupAddDou } from '@/views/WebRoot/platform' // 组件
	import { addSellerUserGroupInfo,updateSellerUserGroupInfo } from '@/api/platform/commercGroupManage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				propoverVisible1: false, // popover 是否可见 - 可管理商户
				// 数据
				form: {
					codeGroup: '',
					nameGroup: '',
					desc: '',
					sellerId: '',
					sellerMan:''
				},
				sellerMan: [],
				tableLoading: false,
				departmentOptions:[],
				// 表单数据验证
				norules: {},
				rules: {
					sellerMan: [{
							required: true,
							message: '请输入商户名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					nameGroup: [{
							required: true,
							message: '请输入用户组名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					desc: [{
							required: true,
							message: '请输入描述',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					]
				}
			}
		},
		components: {
			commercGroupAddDou
		},
		methods: {
			handleClose(value){
				let array=[];
				this.sellerMan.forEach((val,index)=>{
					if(value!=val.name){
						array.push(val);
					}
				})
				this.sellerMan=array;
			},
			handleChildMerchantSubmit(str) {
				this.form.sellerId = str.sellerId;
				this.form.sellerMan=str.sellerId;
				let array=str.sellerId.split(",");
				str.sellerMan.split(",").forEach((val,index)=>{
					this.sellerMan.push({
						name:val,
						type:'',
						id:array[index]
					})
				})
				this.propoverVisible1 = false;
				// console.log();
			},
			// 确认
			handleForm(formName) {
				// console.log(this.form);
				let that = this;
				let sellerId='';
				let str='';
				this.sellerMan.forEach((val,index)=>{
					str+=val.name+",";
					sellerId+=val.id+",";
				})
				str=str.substr(0,str.length-1);
				sellerId=sellerId.substr(0,sellerId.length-1);
				
				this.form.sellerId=sellerId;
				this.form.sellerMan=str;
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						if(this.getPageType=="添加"){
							var res = this.form;
//							console.log(JSON.stringify(res))
							let params = {
								"userId": this.userInfo.userCode,
								"userGroupName": res.nameGroup,
								"userGroupDesc": res.desc,
								"sellerId": res.sellerId,
								"sellerMan":res.sellerMan
							}
							addSellerUserGroupInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$router.push({
											name: '商户组管理'
										});
										that.$message.success(data.messageContent);
									} else {
										that.tableLoading = false;
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									// console.log(err);
								});
						}else{
							var res = this.form;
							let params = {
								"userId": this.userInfo.userCode,
								"userGroupName": res.nameGroup,
								"userGroupDesc": res.desc,
								"sellerId": res.sellerId,
								"sellerMan": res.sellerMan,
								"id":res.id,
								"version":res.version
							}
							updateSellerUserGroupInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$router.push({
											name: '商户组管理'
										});
										that.$message.success(data.messageContent);
									} else {
										that.tableLoading = false;
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									// console.log(err);
								});
						}
					} else {
						return false;
					}
				})
			},
			// 取消
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.$router.push({
					name: '商户组管理'
				});
			}
		},
		created() {
//			 console.log(this.getPageType);
			// 钩子函数 -- 初始化
			if(this.getPageType == '修改') {
				let res = JSON.parse(this.getPageData);
//				console.log(res.sellerMan)
				this.form=res;
				let array=res.sellerId.split(",");
				res.sellerMan.split(",").forEach((val,index)=>{
					if(val == '') {
						return false;
					}else {
						this.sellerMan.push({
							name:val,
							type:'',
							id:array[index]
						});
					}
//					console.log(JSON.stringify(this.sellerMan[index]))
				})
			}
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getPageData() {
				return this.$route.params.data;
			},
			...mapGetters([
				'userInfo',
			])
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form-item {
		width: rem(370px);
	}
	.elInput{
		width:205px;
		box-sizing: border-box;
		color: #333;
		display: inline-block;
		font-size: inherit;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #d2d2d2;
		outline: none;
		min-height:32px;
		padding: 0 15px;
		transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	}
	.elInput .el-tag{
		margin-right: 5px;
	}
</style>