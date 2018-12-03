<!--品牌信息-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? norules : rules" ref="form" label-width="140px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-form-item label="品牌编码" prop="brandId" v-if="this.getPageType=='查看'">
								<el-input :disabled="disabledSet" v-model="form.brandId" placeholder="请输入品牌编码"></el-input>
							</el-form-item>
							<el-form-item label="品牌名称" prop="brandName">
								<el-input v-model="form.brandName" :disabled="disabled" placeholder="请输入品牌名称"></el-input>
							</el-form-item>

							<el-form-item label="绑定公众号原始Id" prop="pubNumCode">
								<!-- <el-button type="primary" @click="pubNumCode()" v-if="this.getPageType!='查看'">绑定公众号</el-button> -->
								<el-input v-model="form.pubNumCode" :disabled="disabled" placeholder="绑定公众号原始Id"></el-input>
							</el-form-item>
							<el-form-item label="品牌描述" prop="brandDesc">
								<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入品牌描述" v-model="form.brandDesc">
								</el-input>
							</el-form-item>
							<el-form-item label="模式" prop="pattern" class="textLeft">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.pattern" placeholder="模式"></el-input>
								<el-radio-group v-else v-model="form.pattern">
									<el-radio label="scrm模式">scrm模式</el-radio>
									<el-radio label="POS模式">POS模式</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-dialog title="提示" :visible.sync="dialogVisibleOfficial" width="30%">
								<!-- <span>这是一段信息</span> -->
								<brandInfoQrcode></brandInfoQrcode>
								<span slot="footer" class="dialog-footer">
									<el-button @click="dialogVisibleOfficial = false">取 消</el-button>
									<el-button type="primary" @click="dialogVisibleOfficial = false">确 定</el-button>
								</span>
							</el-dialog>
							<el-form-item label="品牌LOGO" prop="brandLogo" v-if="this.getPageType!='查看'" class="textLeft">
								<!-- <el-button type="primary" @click="clickTest">上传图片</el-button>
								<el-button type="primary" @click="handleUploadDelete">删除</el-button> -->
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
									<img width="100%" :src="brandImgUrl" alt="">
								</el-dialog>
								<span class="activitySpan">图片建议尺寸：140像素*140像素</span>
							</el-form-item>
							<el-form-item label="品牌LOGO" v-if="this.getPageType=='查看'" class="textLeft">
								<img width="100%" :src="brandLogoInfo" alt="" class="brandLogoInfo" @click="handlePictureCardPreviewInfo">
								<el-dialog :visible.sync="dialogVisibleInfo">
									<img width="100%" :src="brandImgUrl" alt="">
								</el-dialog>
							</el-form-item>
						</el-col>
					</el-row>
					<div v-if="this.getPageType!='查看'" class="textCenter">
						<el-button @click="handleBack">返回</el-button>
						<el-button type="primary" @click="submitForm('form')">确定</el-button>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { mapGetters } from 'vuex'
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { addBrandInfo, setBrandInfo } from '@/api/base/brandInfo'
	/** 
	 * {uploadImg 上传图片
	 * } */
	import { uploadImg } from '@/api/base/brandInfo'
	import { returnSelectedFile } from '@/api/upload'
	import { brandInfoQrcode } from '@/views/WebRoot/base'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				brandImgUrl:'',
				tableLoading: false,
				imgLoading:false,
				disabled: false,
				disabledSet: false,
				brandLogoInfo: '',
				// form表单数据
				form: {
					brandName: '',
					brandLogo: '',
					brandDesc: '',
					pubNumCode: '',
					// appId:'',
					// appSecret:'',
					pattern: 'scrm模式'
				},

				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				dialogVisibleInfo: false,
				dialogVisibleOfficial: false, // 绑定公众号
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				// uploadAction: '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				norules: {},
				rules: {
					brandName: [{
							required: true,
							message: '请输入品牌名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					pattern: [{
							required: true,
							message: '请选择模式',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				}
			}
		},
		components: {
			brandInfoQrcode
		},
		methods: {
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
					this.imgLoading=true;
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
								that.imgLoading=false;
								if(code == 'SUCCESS') {
									//								console.log(msg.fileName)
									that.form.brandLogo = msg.fileName; // 图片赋值
									that.brandImgUrl=msg.fileName; // 图片赋值
									that.dialogImageUrl =msg.fileName+'?x-oss-process=style/small';// 图片回填 - 本地图片
									that.$message.success('上传成功');
								} else {
									that.$message.warning('上传失败');
								}
							})
							.catch((err) => {
								that.imgLoading=false;
//								console.log(err);
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
			handlePictureCardPreviewInfo(file) { // 图片查看
				this.dialogVisibleInfo = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.form.brandLogo = '';
				this.$refs.uploadIpt.value = '';
			},

			// 方法
			submitForm(formName) {
				let that = this;
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '品牌信息'
					});
					return false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						let params = {};
						if(that.getPageType == '添加') {
							params = {
								"userId": this.userInfo.userCode, // 当前登录用户账号
								"brandId": this.form.brandId, // 品牌编码
								"brandName": this.form.brandName, // 品牌名称
								"brandLogo": this.form.brandLogo, // 品牌Logo
								"brandDesc": this.form.brandDesc, // 品牌描述
								"pubNumCode": this.form.pubNumCode, // 绑定公众号id
								"pattern": this.form.pattern // 模式
							}
							//							console.log(params)
							addBrandInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									// let data = res.data;
									// console.log(data); return false;
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '品牌信息'
										});
									} else {
										that.tableLoading = false;
										that.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
//									console.log(err);
								});
						} else if(that.getPageType == '修改') {
							params = {
								"userId": this.userInfo.userCode, // 当前登录用户账号
								"brandId": this.form.brandId, // 品牌编码
								"brandName": this.form.brandName, // 品牌名称
								"brandLogo": this.form.brandLogo, // 品牌Logo
								"brandDesc": this.form.brandDesc, // 品牌描述
								"pubNumCode": this.form.pubNumCode, // 绑定公众号id
								"pattern": this.form.pattern, // 模式
								"id": this.form.id,
								"version": this.form.version
							}
							setBrandInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									// let data = res.data;
									// console.log(data); return false;
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '品牌信息'
										});
									} else {
										that.tableLoading = false;
										that.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
//									console.log(err);
								});
						}

					} else {
//						console.log('error submit!!');
						return false;
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '品牌信息'
				});
			},
			// 状态单选框改变
			radioStatusChange(val) {
				//				console.log(val);
			},
			// 选择部门名称
			handleDepartmentName() {
				this.departmentSelect.forEach((val, index) => {
					if(val.label == this.form.departmentName) {
						this.form.departmentId = val.value;
					}
				});
			},
			// 选择用户组名称
			handleUserGroupName() {
				this.userGroupSelect.forEach((val, index) => {
					if(val.label == this.form.userGroupName) {
						this.form.userGroupId = val.value;
					}
				});
			},
			// 选择角色名称
			handleUserRoleName() {
				this.roleSelect.forEach((val, index) => {
					if(val.label == this.form.userRoleName) {
						this.form.userRoleId = val.value;
					}
				});
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			//			console.log(this.getPageType + "-操作类型");
			//			console.log(this.getFormData)
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				// console.log(res)
				this.form = {
					...res
				}
				//				console.log(this.form);
				this.brandImgUrl=this.form.brandLogo; // 图片赋值
				if(this.form.brandLogo!=""){
					this.brandLogoInfo =this.form.brandLogo+'?x-oss-process=style/small';// 图片回填 - 本地图片
				}
				// this.form.status
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.disabledSet = true;
				// console.log(res)
				this.form = {
					...res
				}
				if(this.form.brandLogo!=""){
					this.dialogImageUrl =this.form.brandLogo+'?x-oss-process=style/small';// 图片回填 - 本地图片
				}
				this.brandImgUrl=this.form.brandLogo; // 图片赋值
				// this.form.status
			}
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
	
	.el-button {
		margin-bottom: 5px;
	}
	
	.el-form {}
	
	.el-radio+.el-radio {
		margin-left: 0.5rem;
	}
	
	.el-select {
		width: 100%;
	}
	/*上传图片*/
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
		cursor:pointer;
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
	
	.activitySpan {
		display: block;
		color: #AEAEAE;
	}
	.textLeft{
		text-align: left;
	}
	.textCenter{
		text-align: center;
	}
	.brandLogoInfo{
		width:134px;
		height:134px;
		display: inline-block;
	}
</style>