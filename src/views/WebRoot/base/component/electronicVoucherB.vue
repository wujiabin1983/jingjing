// 预置活动模板 - 新建模板 - 微信卡券设置
<template>
	<el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-form">
		<el-form-item label="劵号位数" prop="cardNumDigif">
			<el-input v-model="form.cardNumDigif" placeholder="请输入劵号位数"></el-input>
		</el-form-item>
		<el-form-item label="劵号规则起始位" prop="ruleBeginDigif">
			<el-input v-model="form.ruleBeginDigif" placeholder="请输入劵号规则起始位"></el-input>
		</el-form-item>
		<el-form-item label="前缀字符" prop="prefixChar">
			<el-input v-model="form.prefixChar" placeholder="请输入前缀字符"></el-input>
		</el-form-item>
		<el-form-item label="劵号后缀长度" prop="prefixEndLength">
			<el-input v-model="form.prefixEndLength" placeholder="请输入劵号后缀长度"></el-input>
		</el-form-item>
		<el-form-item label="品牌名称">
			<el-input v-model="form.brandName" :disabled="true" placeholder="请输入品牌名称"></el-input>
		</el-form-item>
		<el-form-item label="品牌LOGO" prop="brandLogo">
			<div class="icon-close" v-loading="imgLoading">
				<img v-if="dialogImageUrl" :src="dialogImageUrl" @click="clickTest" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
				<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
			</div>
			<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
				<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
				<input type="submit" value="上传" ref="uploadSubmit" />
			</form>
			<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
			<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="form.brandLogo" alt="">
			</el-dialog>
		</el-form-item>
		<el-form-item label="核销方式" prop="verificationMode">
			<!-- <el-input v-model="form.verificationMode" placeholder="请输入核销方式"></el-input> -->
			<div class="verificationModeBox">
				<el-radio v-model="form.verificationMode" label="仅卡号">仅卡号</el-radio>
				<div>
					111-222-333
				</div>
			</div>
			<div class="verificationModeBox">
				<el-radio v-model="form.verificationMode" label="仅二维码">仅二维码</el-radio>
				<div>
					<img :src="qrCodeUrl" class="qrCodeImage" alt="">
				</div>
			</div>
			<div class="verificationModeBox">
				<el-radio v-model="form.verificationMode" label="仅条形码">仅条形码</el-radio>
				<div>
					<img :src="barCodeUrl" alt="">
				</div>
			</div>
			<div class="verificationModeBox">
				<el-radio v-model="form.verificationMode" label="卡号和二维码">卡号和二维码</el-radio>
				<div>
					<div class="textCenter">
						<img class="qrCodeUrl" :src="qrCodeUrl" alt="">
						<span>111-222-333</span>
					</div>
				</div>
			</div>
			<div class="verificationModeBox">
				<el-radio v-model="form.verificationMode" label="卡号和条形码">卡号和条形码</el-radio>
				<div>
					<div class="textCenter">
						<img class="barCodeUrl" :src="barCodeUrl" alt="">
						<span>111-222-333</span>
					</div>
				</div>
			</div>
		</el-form-item>
		<el-form-item label="操作提示" prop="operateDesc">
			<el-input v-model="form.operateDesc" placeholder="请输入操作提示"></el-input>
		</el-form-item>
		<el-form-item label="状态" prop="status">
			<el-switch v-model="form.status" active-color="#ddc" inactive-color="#ff4949">
			</el-switch>
		</el-form-item>
		<el-button type="primary" class="marginTop10" @click="prev">上一步</el-button>
		<el-button type="primary" class="marginTop10" @click="nextPage">下一步</el-button>
	</el-form>
</template>
<script>
	import { permission } from '@/utils'
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail,validateInt } from '@/utils/validate';
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片接口
	import Cookie from 'js-cookie'
	import qrCodeUrl from '@/assets/images/twoQcode.png' // 二维码图片
	import barCodeUrl from '@/assets/images/oneQcode.png' // 二维码图片
	import { getBrandInfo } from '@/api/public'
	import { mapGetters } from 'vuex'
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
	export default {
		data() {
			return {
				roleBtn: {
					selectElectronicRuleInfo: false,
					addElectronicRuleInfo: false,
					updateElectronicRuleInfo: false
				},
				qrCodeUrl:qrCodeUrl,
				barCodeUrl:barCodeUrl,
				// form表单数据
				form: {
					cardNumDigif: '', // 劵号位数
					ruleBeginDigif: '', // 劵号规则起始位
					prefixChar: '', // 前缀字符
					prefixEndLength: '', // 后缀长度
					brandName: '', // 品牌名称(非后台数据)
					brandLogo: '', // 品牌Logo
					verificationMode: '仅卡号', // 核销方式（仅卡号、仅二维码、仅条形码、卡号和二维码、卡号和条形码）
					operateDesc: '', // 操作提示（文字）
					status: '' // 状态（启用、禁止）
				},
				// 上传图片
				imgLoading: false,
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				rules: {
					cardNumDigif: [{
							required: true,
							message: '请输入劵号位数',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},{
							validator: isInt
						}
					],
					ruleBeginDigif: [{
							required: true,
							message: '请输入劵号规则起始位',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					prefixChar: [{
							required: true,
							message: '请输入前缀字符',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					prefixEndLength: [{
							required: true,
							message: '请输入劵号后缀长度',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},{
							validator: isInt
						}
					],
					// sex: [
					//     { required: true, message: '请输入性别', trigger: 'change' },
					//     { validator: isRadioSelected, type: 'change' },       
					// ],
				}
			}
		},
		methods: {
			// 上传图片
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				if(!files) {
					return false;
				}else {
					//判断file的类型是不是图片类型。 
					if(!/image\/\w+/.test(files.type)) {
						this.$message("请上传一张图片");
						return false;
					}
					this.imgLoading = true;
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
								//              console.log(msg.fileName)
								if(code == 'SUCCESS') {
									that.form.brandLogo = msg.fileName; // 图片赋值
									// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
									that.dialogImageUrl = msg.fileName + '?x-oss-process=style/small'; // 图片回填 - 本地图片
									that.$message.success('上传成功');
									that.imgLoading = false;
								}else{
									that.imgLoading = false;
									that.$message.warning(msg);
								}
							})
							.catch((err) => {
								// console.log(err);
								that.imgLoading = false;
							})
					}
				}
			},
			clickTest() {
				// 点击测试
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.form.brandLogo = '';
				this.$refs.uploadIpt.value = '';
			},
			nextPage() {
				//			console.log(JSON.stringify(this.form))
				this.$refs['form'].validate((valid) => {
					if(valid) {
						sessionStorage.setItem("dataTwos", JSON.stringify(this.form));
						//					console.log(JSON.stringify(this.form))
						this.$emit('message1', '2');
					}
				})
			},
			prev() {
				this.$emit('message1', '0');
			},
			getBrand(params) {
				getBrandInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.form.brandName = data.messageContent.brandName;
						this.dialogImageUrl = data.messageContent.brandLogo + '?x-oss-process=style/small';
						this.form.brandLogo = data.messageContent.brandLogo;
					})
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			var params = {
				userId: this.userInfo.userCode
			}
			this.getBrand(params);
			if(sessionStorage.getItem("dataTwos")) {
				let data = sessionStorage.getItem("dataTwos");
				this.form = JSON.parse(data);
//				console.log(data)
				if(this.form.brandLogo!=""){
					this.dialogImageUrl = this.form.brandLogo + '?x-oss-process=style/small';
				}
			} else if(sessionStorage.getItem("type")) {
				if(sessionStorage.getItem("type") == "修改") {
					let data = sessionStorage.getItem("data");
					this.form = JSON.parse(data).wechatCoupons;
					if(this.form.brandLogo!=""){
						this.dialogImageUrl = this.form.brandLogo + '?x-oss-process=style/small';
					}
				}
			}
			// 钩子函数 -- 初始化
//			 console.log(this.getFormData);
			// console.log(this.getPageType);
			if(this.getPageType == '查看') {
				if(this.roleBtn.selectElectronicRuleInfo) {
					let res = JSON.parse(this.getFormData);
					this.form = {
						...res
					}
				}
				// this.form.status
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
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
	
	.el-input {
		width: rem(350px);
	}
	
	.el-select {
		width: 100%;
	}
	.el-form{
		width: auto;
	}
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
		width: 134px;
		height: 134px;
		line-height: 134px;
		cursor: pointer;
		text-align: center;
	}
	
	.avatar {
		display: inline-block;
		width: 134px;
		height: 134px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		margin-bottom: -10px;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	// 核销方式
	.verificationModeBox {
		float: left;
		margin-right: 10px;
	}
	
	.verificationModeBox>div {
		width: 120px;
		height: 80px;
		padding: 10px;
		border: 1px solid #000;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.qrCodeImage{
		width: 60px;
		height: 60px;
		display: block;
	}
	.textCenter{
		text-align: center;
	}
	.qrCodeUrl{
		width:45px;
		height:45px;
		display: block;
		margin: 0 auto;
		margin-top:10px
	}
	.barCodeUrl{
		width: 110px;
		display: block;
		margin: 0 auto;
	}
</style>