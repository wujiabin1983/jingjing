// 短信模板 - 新建模板
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="resetForm()" v-if="this.getPageType=='查看'" class="mrgBottom10">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="this.tableLoading" :rules="this.getPageType=='查看' ? norules : rules" ref="form" label-width="100px" class="demo-form">
					<el-row :gutter="20">
						<el-col :span="14">
							<el-form-item label="模板编号" prop="templateId" v-if="this.getPageType=='查看'">
								<el-input v-model="form.templateId" :disabled="disabledSet" placeholder="请输入模板编号"></el-input>
							</el-form-item>
							<el-form-item label="模板名称" prop="templateName">
								<el-input v-model="form.templateName" :disabled="disabled" placeholder="请输入模板名称"></el-input>
							</el-form-item>
							<el-form-item label="商户组" prop="sellerGroupName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.sellerGroupName" placeholder="沟通渠道"></el-input>
								<el-select placeholder="请选择" v-model="form.sellerGroupName" v-else @change="groupChange">
									<el-option v-for="item in userGroupNameData"  :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="沟通渠道" prop="communicateModeName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.communicateModeName" placeholder="沟通渠道"></el-input>
								<el-select v-else v-model="form.communicateModeName" placeholder="请选择沟通渠道"  @change="roleSelect">
									<el-option v-for="item in roleOptions" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
		
							<el-form-item label="短信内容" prop="smsContent" v-if="this.getPageType!='查看'" class="smsCcontainer">
								<el-input type="textarea" :disabled="disabled" :rows="6" placeholder="请输入短信内容" v-model="form.smsContent" resize='none' class="floatLeft"></el-input>
								<div class="smsSelect" v-if="this.getPageType!='查看'">
									<div class="smsSelectInfo">
										<div class="component" v-for="(item, index) in templateItems">
											<el-button @click="buttonClick" class="width100">{{item}}</el-button>
										</div>
									</div>
								</div>
							</el-form-item>
							<el-form-item label="短信内容" prop="smsContent" v-else>
								<el-input type="textarea" :disabled="disabled" :rows="6" placeholder="" v-model="form.smsContent" resize='none' class="floatLeft width100"></el-input>
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
	import { addTemplateData, setTemplateData, selectTemplateLabel } from '@/api/platform/SMSTemp'
	import { mapGetters } from 'vuex'
	import { selectUserGroupName} from '@/api/public'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				userGroupNameData:[],
				disabled: false,
				disabledSet: false,
				tableLoading: false,
				form: {
					templateName: '',
					sellerGroupId:'',
					sellerGroupName:'',
					communicateModeId: '',
					communicateModeName: '短信',
					smsContent: ''
				},
				templateItems: [],
				roleOptions: [{
					index: '0',
					key: '微信',
					value: '微信'
				}, {
					index: '1',
					key: '短信',
					value: '短信'
				}],
				norules: {},
				rules: {
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
					sellerGroupName: [{
							required: true,
							message: '请选择商户组',
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
			groupChange(val){
				this.form.sellerGroupName=this.userGroupNameData[val].key;
				this.form.sellerGroupId=this.userGroupNameData[val].value;
			},
			getUserGroupName(){
				let that =this;
				var params = {
					userId: this.userInfo.userCode
				}
//							console.log(params)
				selectUserGroupName(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType=="SUCCESS"){
							data.messageContent.forEach((val,index)=>{
								that.userGroupNameData.push({
									index:val.index,
									key:val.key,
									value:val.value
								})
							})
						}else {
							that.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
//						console.log(err);
					})
			},
			submitForm(formName) {
				let that = this;
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '短信模板',
						params: {
							type: '2'
						}
					});
					return false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						//						console.log(JSON.stringify(params))
						this.tableLoading = true;
						let that = this;
						if(that.getPageType == '添加') {
							let that = this;
							// 查询接口
							var params = {
								"userId": this.userInfo.userCode, // 当前登录用户账号
								"sellerGroupId": this.form.sellerGroupId, // 商户组编码
								"sellerGroupName": this.form.sellerGroupName, // 商户组名称
								"templateId": this.form.templateId, // 模板编码
								"templateName": this.form.templateName, // 模板名称
								"communicateModeName": this.form.communicateModeName, // 沟通渠道
								"smsContent": this.form.smsContent, // 短信内容
							}
							addTemplateData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading = false;
									//				                    console.log(data)
									if(data.messageType == 'SUCCESS') {
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										that.$router.push({
											name: '短信模板',
											params: {
												type: '2'
											}
										});
									} else {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
								})
								.catch(function(err) {
//									console.log(err);
									that.tableLoading = false;
								});
						} else if(that.getPageType == '修改') {
							let that = this;
							// 查询接口
							var params = {
								"userId": this.userInfo.userCode, // 当前登录用户账号
								"templateId": this.form.templateId, // 品牌编码
								"templateName": this.form.templateName, // 品牌名称
								"sellerGroupId": this.form.sellerGroupId, // 商户组编码
								"sellerGroupName": this.form.sellerGroupName, // 商户组名称
								"communicateModeName": this.form.communicateModeName, // 品牌Logo
								"smsContent": this.form.smsContent, // 品牌描述
								"id": this.form.id,
								"version": this.form.version
							}
							setTemplateData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										that.$router.push({
											name: '短信模板',
											params: {
												type: '2'
											}
										});
									} else {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
								})
								.catch(function(err) {
//									console.log(err);
									that.tableLoading = false;
								});
						}

					} else {
//						console.log('error submit!!');
						return false;
					}
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
					name: '短信模板',
					params: {
						type: '2'
					}
				});
			}
		},
		created() {
			this.getUserGroupName();
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
//					console.log(JSON.stringify(data) + "返回值");
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
	.el-select {
		width: 100%;
	}
	.smsCcontainer{
		padding-right: 124px;
		position: relative;
		margin-bottom:50px;
		.smsSelect{
			width:134px;
			overflow: hidden;
			position: absolute;
			right: -135px;
			.smsSelectInfo{
				width:100%;
				height:155px;
				overflow-y: auto;
				float: left;
			}
		}
	}
</style>