<!--商户注册-添加-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="$router.push({ name: '商户注册管理' });" v-if="this.getPageType=='查看'" class="mrgBottom10">返回</el-button>
			<el-card>
				<el-form ref="form" :rules="this.getPageType=='查看' ? norules : rules" v-loading="tableLoading" :model="form" label-width="150px">
					<p class="title">基本信息：<i></i></p>
					<el-form-item label="商户名称" prop="sellerMan" v-if="this.getPageType == '注册'">
						<el-input v-model="form.sellerMan" placeholder="请输入商户名称" :readonly="this.getPageType == '修改'||this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="用户登录名" prop="userName" v-if="this.getPageType == '注册'||this.getPageType == '查看'">
						<el-input v-model="form.userName" :readonly="this.getPageType == '查看'||this.getPageType == '修改'" placeholder="请输入用户登录名"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" v-if="this.getPageType == '注册'">
						<el-input v-model="form.password" type="text" @focus="passChange" placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item label="有效期起止" prop="validityDateBegin" id="date-inline">
						<el-date-picker
					      v-model="dateArr"
					      :picker-options="pickerOptions0"
					      type="daterange"
					      value-format="yyyy-MM-dd"
					      :readonly="this.getPageType == '查看'"
					      @change="validityDateChange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</el-form-item>
					<el-form-item label="所属商户组" prop="userGroupName">
						<el-input v-model="form.userGroupName" :readonly="true" v-if="this.getPageType == '查看'"></el-input>
						<el-select v-model="userGroupName" placeholder="请选择所属商户组" v-else @change="userGroupNameChange">
							<el-option v-for="item in userGroupNameOption" :key="item.key" :label="item.key" :value="item.index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="form.email" :readonly="this.getPageType == '查看'" placeholder="请输入邮箱"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status" v-if="this.getPageType=='查看'">
						<el-input v-model="form.status" :readonly="true" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="form.mobile" :readonly="this.getPageType == '查看'" placeholder="请输入手机号"></el-input>
					</el-form-item>
					<el-form-item label="固定电话" prop="tel">
						<el-input v-model="form.tel" :readonly="this.getPageType == '查看'" placeholder="请输入固定电话"></el-input>
					</el-form-item>
					<p class="title">其他信息：<i></i></p>
					<el-form-item label="证件号" prop="documentCode">
						<el-input v-model="form.documentCode" :readonly="this.getPageType == '查看'" placeholder="请输入证件号"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="contactWay" v-if="false">
						<el-input v-model="form.contactWay" placeholder="请输入手机号" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="简称" prop="shortName">
						<el-input v-model="form.shortName" placeholder="请输入简称" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="企业信用证号码" prop="estaCreditNum">
						<el-input v-model="form.estaCreditNum" placeholder="请输入企业信用证号码" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="营业执照号码" prop="businessNumber">
						<el-input v-model="form.businessNumber" placeholder="请输入营业执照号码" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="税号" prop="taxNumber">
						<el-input v-model="form.taxNumber" placeholder="请输入税号" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="组织架构代码证" prop="orgCode">
						<el-input v-model="form.orgCode" placeholder="请输入组织架构代码证" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="法人" prop="artificialPerson">
						<el-input v-model="form.artificialPerson" placeholder="请输入法人" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="行业" prop="industry">
						<el-input v-model="form.industry" :readonly="true" v-if="this.getPageType == '查看'"></el-input>
						<el-select v-model="form.industry" placeholder="请选择行业" v-else @change="industryChange">
							<el-option v-for="item in selectIndustry" :key="item.value" :label="item.key" :value="item.index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="负责人" prop="chargePerson">
						<el-input v-model="form.chargePerson" placeholder="请输入负责人" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="邮编" prop="zipCode">
						<el-input v-model="form.zipCode" placeholder="请输入邮编" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="二级域名" prop="secondRealmName">
						<el-input v-model="form.secondRealmName" placeholder="请输入二级域名" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="商户描述" prop="sellerDesc">
						<el-input v-model="form.sellerDesc" type="textarea" resize="none" placeholder="请输入商户描述" :readonly="this.getPageType == '查看'"></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="remarks">
						<el-input v-model="form.remarks" :readonly="this.getPageType == '查看'" type="textarea" resize="none" placeholder="请输入备注"></el-input>
					</el-form-item>
					<el-form-item label="上传营业执照复印件" prop="busLicenseUrl">
						<div class="icon-close" v-loading="ImgLoading">
							<img v-if="dialogImageUrl" :src="dialogImageUrl + '?x-oss-process=style/small'" @click="clickTest" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
							<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
						</div>
						<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</el-form-item>
					<div v-if="this.getPageType != '查看'" class="el-footer-btn">
						<div class="el-footer-btn-con">
							<el-button @click="$router.push({ name: '商户注册管理' });">返  回</el-button>
							<el-button type="primary" @click="handleSubmit('form')">保  存</el-button>
						</div>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { validateMobile, validateTel, validateInt, validateEmail, validateIdCard, validatePassword } from '@/utils/validate';
	import Cookie from 'js-cookie'
	import { uploadImg } from '@/api/base/brandInfo'
	import { selectContentInfo,selectUserGroupName } from '@/api/public'
	import { addSellerInfo, updateSellerInfo } from '@/api/platform/commercRegister';
	import { mapGetters } from 'vuex'
	const isMobile = (rule, value, callback) => {
		if(value!=""){
			if(!validateMobile(value)) {
				callback(new Error('请输入正确的手机号码'))
			} else {
				callback()
			}
		}else {
			callback()
		}
	}
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	const isIdCard = (rule, value, callback) => {
		if(value != "") {
			if(!validateIdCard(value)) {
				callback(new Error('请输入正确的身份证号码'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	const isEmail = (rule, value, callback) => {
		if(value != "") {
			if(!validateEmail(value)) {
				callback(new Error('邮箱格式错误'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	const isTel = (rule, value, callback) => {
		if(value != "") {
			if(!validateTel(value)) {
				callback(new Error('请输入正确的固定电话号码'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	const isPassword = (rule, value, callback) => {
		if(!validatePassword(value)) {
			callback(new Error('密码为至少6位的数字或字母'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
				userGroupName:'',
				dateArr:[],
				userGroupNameOption:[],
				ImgLoading:false,
				tableLoading: false,
				// form表单数据
				form: {
					"sellerMan":"",//商户名称
					"userName":"",//用户登录名
					"password":"",//密码
					"mobile":"",//手机号
					"userGroupId":"",//用户组代码
					"realName":"",//真实姓名
					"userGroupName":"",//用户组名称
					"industry":"",//所属行业
					"shortName":"",//简称
					"sellerDesc":"",//商户描述
					"estaCreditNum":"",//企业信用证号码
					"businessNumber":"",//营业执照号码
					"taxNumber":"",//税号
					"orgCode":"",//组织结构代码证
					"artificialPerson":"",//法人
					"chargePerson":"",//负责人
					"contactWay":"",//联系方式名称
					"zipCode":"",//邮编
					"validityDateBegin":"",//有效期起
					"validityDateEnd":"",//有效期止
					"secondRealmName":"",//二级域名
					"busLicenseUrl":"",//营业执照URL
					"sex":"男",//商户名称
					"age":"",//年龄
					"email":"",//邮箱
					"tel":"",//固定电话
					"documentCode":"",//证件号
					"remarks":""//备注
				},
				dialogVisible: false,
				dialogVisibleInfo: false,
				dialogImageUrl: '', // 图片列表
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				dialogVisible: false,
				imgList: [], // 图片列表
				// 选择 - 行业
				selectIndustry: [],
				norules: {},
				// 验证
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
					userName: [{
							required: true,
							message: '请输入用户登录名',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						},{
							validator: isPassword
						}
					],
					userGroupName: [{
							required: true,
							message: '请选择所属商户组',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					validityDateBegin: [{
							required: true,
							message: '请选择有效期',
							trigger: 'change'
						},
						// { max: 100, message: '最大长度不能超过100', trigger: 'blur' }
					],
					documentCode: [{
							validator: isIdCard
					}],
					email: [{
							validator: isEmail
					}],
					age: [{
						validator: isInt
					}],
					mobile: [
						{
							validator: isMobile
						}
					],
					tel: [
						{
							validator: isTel
						}
					],
				},
				// 图片上传的路径
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
			}
		},
		methods: {
			validityDateChange(val){
//				console.log(val)
				this.form.validityDateBegin=val[0];
				this.form.validityDateEnd=val[1];
			},
			passChange(event){
				if(event.target.attributes[5].value=="text"){
					event.target.attributes[5].value='password';
				}else if(event.target.attributes[2].value=="text"){
					event.target.attributes[2].value='password';
				}
			},
			//行业
			industryChange(val) {
				if(val!=""){
					var index = parseInt(val);
					this.form.industry = this.selectIndustry[index].key;
				}
			},
			//所属商户组
			userGroupNameChange(val) {
				var index = parseInt(val);
				this.form.userGroupName = this.userGroupNameOption[index].key;
				this.form.userGroupId = this.userGroupNameOption[index].value;
			},
			// 方法
			handleSubmit(formName) {
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '商户注册管理'
					});
					return false;
				}
				let that = this;
				that.$refs['form'].validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						if(that.getPageType == '注册') {
							var params = {
								"userId": that.userInfo.userCode,
								...that.form
							}
//							console.log(params);
							addSellerInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
//									console.log(data)
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '商户注册管理'
										});
									} else {
										that.tableLoading = false;
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
//									 console.log(err);
								});
						} else if(that.getPageType == '修改') {
							var params = {
								"userId": that.userInfo.userCode,
								...that.form
							}
//							console.log(JSON.stringify(params))
							updateSellerInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '商户注册管理'
										});
									} else {
										that.tableLoading = false;
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
//									 console.log(err);
								});
						}

					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!files) {
					return false;
				}else {
					if(!/image\/\w+/.test(files.type)) {
						this.$message("请上传一张图片");
						return false;
					}
					this.ImgLoading=true;
					var reader = new FileReader();
					reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件 
					//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片 
					reader.onload = function(e) {
						// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
						// that.$refs.uploadSubmit.dispatchEvent(new MouseEvent('click')); // 上传图片
						let formData = new FormData(); // 可以增加表单数据
						formData.append("file", files); // 文件对象
						uploadImg(formData)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								//								console.log(data)
								if(code == 'SUCCESS') {
									//								console.log(msg.fileName)
									that.form.busLicenseUrl = msg.fileName; // 图片赋值
									that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
									that.$message.success('上传成功');
								} else {
									that.$message.success('上传失败');
								}
								that.ImgLoading=false;
							})
							.catch((err) => {
								that.ImgLoading=false;
								// console.log(err);
							})
					}
				}
			},
			clickTest() {
				if(this.getPageType != '查看'){
					this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
				}
				// 点击测试
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handlePictureCardPreviewInfo(file) { // 图片查看
				this.dialogVisibleInfo = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.form.busLicenseUrl = '';
				this.$refs.uploadIpt.value = '';
			},
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			// 修改的数据源
			getFormData() {
				return this.$route.params.formData;
			},
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
		created() {
			var params = {
				"getConstantCode": "INDUSTRY_TYPR"
			}
			//			console.log(params)
			selectContentInfo(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					if(data != "") {
						data.unshift({
							index:'',
							key:'请选择',
							value:''
						})
						this.selectIndustry = data;
					}
				})
				.catch((err) => {
					// console.log(err)
				})
			params = {
				userId: this.userInfo.userCode
			}
			//			console.log(params)
			selectUserGroupName(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(data);
					if(data.messageType=="SUCCESS"){
						this.userGroupNameOption=data.messageContent;
					}else {
						this.$message.warning(data.messageContent);
					}
				})
				.catch((err) => {
//					console.log(err);
				})
			// 钩子函数
			let pageType = this.getPageType;
			if(pageType == '查看' || pageType == "修改") {
				// console.log('xiugai ');
				let res = JSON.parse(this.getFormData);
				this.form=res;
//				console.log(JSON.stringify(res))
				this.dialogImageUrl = res.busLicenseUrl;
				this.userGroupName=res.userGroupName;
				this.dateArr=[];
				this.dateArr.push(res.validityDateBegin);
				this.dateArr.push(res.validityDateEnd);
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
		overflow: hidden;
	}
	/*上传图片*/
	// 上传图片
	.icon-close {
		position: relative;
		display: inline-block;
		.el-icon-circle-close {
			font-size: 14px; 
			position: absolute;
			top: -5px;
			right: -7px;
			color: #fa5555;
			cursor: pointer;
		}
	}
	.avatar-uploader .el-upload {
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		width: 140px;
		height: 140px;
		line-height: 140px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 140px;
		height: 140px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	/*.el-form-item {
		width: 50%;
		float: left;
		.el-input{
			width:222px
		}
		.el-select{
			width:222px
		}
		.el-textarea{
			width:222px
		}
	}*/
	.el-form-item {
		width: 33%;
		float: left;
	}
	
	@media only screen  
	and (min-device-width : 768px)  
	and (max-device-width : 1024px){  
		.el-form-item {
			width: 50%;
			float: left;
		}
		
		.el-select{
			width:100%
		}
		#date-inline .el-date-editor{
			width:100%
		}
	}  
	.title{
		font-size: 16px;
		padding-left: 20px;
		float: left;
		width: 100%;
		height: 40px;
		line-height: 40px;
		margin-bottom: 30px;
		position: relative;
		i{
			width: 5px;
			height: 20px;
			background: #1992ff;
			display: block;
			position: absolute;
			left: 5px;
			top: 10px;
		}
	}
</style>