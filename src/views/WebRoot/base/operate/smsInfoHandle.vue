// 短信模板 - 新建模板
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="resetForm()" v-if="this.getPageType=='查看'" class="margin10">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? norules : rules" ref="form" label-width="100px" class="demo-form">
					<!--<el-form-item label="模板编号" prop="templateId">
						<el-input v-model="form.templateId" :disabled="disabledSet" placeholder="请输入模板编号"></el-input>
					</el-form-item>-->
					<el-row :gutter="20">
						<el-col :span="14">
							<el-form-item label="模板名称" prop="templateName">
								<el-input v-model="form.templateName" :disabled="disabled" placeholder="请输入模板名称"></el-input>
							</el-form-item>
							<el-form-item label="沟通渠道" prop="communicateModeName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.communicateModeName" placeholder="沟通渠道"></el-input>
								<el-select v-else v-model="form.communicateModeName" placeholder="请选择沟通渠道" @change="roleSelect">
									<el-option v-for="item in roleOptions" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
		
							<el-form-item label="短信内容" prop="smsContent" class="smsContent">
								<el-input type="textarea" :disabled="disabled"  placeholder="请输入短信内容" :rows="6" v-model="form.smsContent" resize='none' class="floatLeft"></el-input>
								<div class="smsInfo" v-if="this.getPageType!='查看'">
									<div class="smsUl">
										<div class="component" v-for="(item, index) in templateItems">
											<el-button @click="buttonClick" class="width100">{{item}}</el-button>
										</div>
									</div>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<div v-if="this.getPageType!='查看'">
						<el-button @click="resetForm()">返回</el-button>
						<el-button type="primary" @click="submitForm('form')">确定</el-button>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { addTemplateData, setTemplateData, selectTemplateLabel } from '@/api/base/messageTemplate'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				disabled: false,
				disabledSet: false,
				form: {
//					templateId: '',
					templateName: '',
					communicateModeId: '',
					communicateModeName: '',
					smsContent: ''
				},
				tableLoading:false,
				templateItems: [],
				roleOptions: [{
					index: '0',
					key: '短信',
					value: '短信'
				}],
				norules: {},
				rules: {
					templateId: [{
							required: true,
							message: '请输入模板编号',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					templateName: [{
							required: true,
							message: '请输入模板名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					communicateModeName: [{
							required: true,
							message: '请输入沟通渠道',
							trigger: 'blur'
						},
						{
							max: 4000,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					],
					smsContent: [{
							required: true,
							message: '请输入短信内容',
							trigger: 'blur'
						},
						{
							max: 70,
							message: '最大长度不能超过70个字符',
							trigger: 'blur'
						}
					],
				}
			}
		},
		methods: {
			submitForm(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(that.getPageType == '添加') {
							let params = {
								"userId": this.form.userId, // 当前登录用户账号
//								"templateId": this.form.templateId, 
								"templateName": this.form.templateName, // 模板名称
								"communicateModeName": this.form.communicateModeName, // 品牌Logo
								"smsContent": this.form.smsContent, // 品牌描述
							}
							this.handleAddSellerInfo(params);
						} else if(that.getPageType == '修改') {
							let params = {
								"userId": this.form.userId, // 当前登录用户账号
//								"templateId": this.form.templateId, 
								"templateName": this.form.templateName, // 模板名称
								"communicateModeName": this.form.communicateModeName, // 品牌Logo
								"smsContent": this.form.smsContent, // 品牌描述
								"id": this.form.id,
								"version": this.form.version
							}
							this.handleUpdateSellerInfo(params);
						}

					}
				});
			},
			// 添加请求后台
			handleAddSellerInfo(formData) {
				let that = this;
				this.tableLoading = true;
				//          console.log(formData)
				addTemplateData(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// let data = res.data;
						//					 console.log(data)
						that.tableLoading = false;
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.showTable(this.page, this.limit);
						} else {
							that.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
						that.tableLoading = false;
//						console.log(err);
					});
			},
			// 修改请求后台
			handleUpdateSellerInfo(formData) {
				//          console.log(formData)
				let that = this;
				this.tableLoading = true;
				setTemplateData(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(data)
						that.tableLoading = false;
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.showTable(this.page, this.limit);
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
//						console.log(err);
						that.tableLoading = false;
					});
			},
			buttonClick(val) {
				let str = this.form.smsContent;
				str += '[[' + val.target.innerText + "]]";
				this.form.smsContent = str;
				//				console.log(val.target.innerText)
			},
			roleSelect(val) {
				let index = parseInt(val);
				//				console.log(val)
				let data = this.roleOptions[index];
				this.form.communicateModeId = data.value;
				this.form.communicateModeName = data.key;
					//				console.log(JSON.stringify(data));
			},
			// 取消
			resetForm() {
				this.$router.push({
					name: '短信模板'
				});
			}
		},
		created() {
			var that = this;
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
			} else if(this.getPageType == '修改') {
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
			}
			let params = {
				userId: this.userInfo.userCode
			}
			selectTemplateLabel(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					//             	 console.log(JSON.stringify(data)+"返回值");
					let result = [];
					data.messageContent.forEach((val, index) => {
						result.push(val.labelName);
					})
					that.templateItems = result;
					that.tableLoading = false;
				})
				.catch(function(err) {
					that.tableLoading = false;
				});
		},
		computed: {
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		/*.el-input{
			width:300px
		}
		.el-select{
			width:300px
		}*/
		/*.el-textarea{
			width:225px
		}*/
	}
	.margin10{
		margin-bottom: 10px;
	}
	.el-select {
		width: 100%;
	}
	.smsContent{
		 padding-right: 124px;
		 position: relative;
		 margin-bottom:50px;
	}
	.smsInfo{
		width:134px;
		overflow: hidden;
		position: absolute;
		right: -135px;
	}
	.smsUl{
		float: left;
		width:100%;
		height:155px;
		overflow-y: auto;
	}
</style>