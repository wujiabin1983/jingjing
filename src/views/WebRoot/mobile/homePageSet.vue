// 移动管理 - 会员首页
<template>
	<el-container class="app-container">
		<el-header>
			<h4>会员首页</h4>
		</el-header>
		<el-main class="container-main">
			<el-row>
				<!-- 手机 -->
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{!form.pageName ? headerSelect : form.pageName}}</div>
					</el-header>
					<el-main class="dsh-main">
						<homePageSet 
							ref="homePageSet" 
							:childData="childData" 
							:pageName="form.pageName" 
							:imgSrc="dialogImageUrl" 
							:imgSrc2="dialogImageUrl2" 
							:childMemCardOption="form.memCardOption" 
							:childLogo="form.isLogo" 
							:childLevel="form.isLevel" 
							:childTempName="form.tempName" 
							:childBgUrl="dialogImageUrl2" 
							:childBgTransparency="form.bgTransparency" 
							:childNavBox="navBoxData" 
							@parentClick="handleParentClick" 
							@setSeq="handleGetSeq"
							@parentInsert="handleInsert">
						</homePageSet>
					</el-main>
				</el-col>
				<!-- 编辑 -->
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>编辑会员首页内容</span>
					</el-header>
					<el-main  class="dsh-main">
						<el-form :model="form" ref="form" v-loading="enterLoading" v-if="isHeadShow" label-width="120px" class="demo-form">
							<div class="head">
								<el-form-item label="页面名称：">
									<el-input v-model="form.pageName" placeholder="请输入页面名称"></el-input>
								</el-form-item>
								<el-form-item label="会员卡背景：">
									<el-row>
										<el-col :span="7" class="dsh-col-left" v-loading="dialogImageUrlLoading">
											<div class="icon-close">
												<img v-if="dialogImageUrl" :src="dialogImageUrl + '?x-oss-process=style/small'" @click="clickTest" class="avatar1">
												<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
												<i v-if="dialogImageUrl" @click="handleUploadDelete" class="el-icon-circle-close"></i>
											</div>
											<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
												<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
												<input type="submit" value="上传" ref="uploadSubmit" />
											</form>
											<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
											<el-dialog :visible.sync="dialogVisible">
												<img width="100%" :src="dialogImageUrl" alt="">
											</el-dialog>
										</el-col>
										<el-col :span="15" class="dsh-col-right">
											<el-row class="dsh-flex1">
												<span class="hint">建议尺寸：320 * 160像素</span>
											</el-row>
										</el-col>
									</el-row>
								</el-form-item>
								<el-form-item label="会员卡号：">
									<el-radio-group v-model="form.memCardOption" @change="handleMemCardOption">
										<el-radio label="显示电子卡号">显示电子卡号</el-radio>
										<el-radio label="显示手机号">显示手机号</el-radio>
										<el-radio label="显示品牌号">显示品牌号</el-radio>
										<el-radio label="不显示">不显示</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="LOGO内容：">
									<el-radio-group v-model="form.isLogo">
										<el-radio label="品牌LOGO">品牌LOGO</el-radio>
										<el-radio label="会员头像">会员头像</el-radio>
										<el-radio label="不显示">不显示</el-radio>
									</el-radio-group>

								</el-form-item>
								<el-form-item label="会员等级：">
									<el-checkbox v-model="form.isLevel">不显示</el-checkbox>
								</el-form-item>
								<el-form-item label="选择模式：">
									<el-radio-group v-model="form.tempName" @change="handleTempName">
										<el-radio label="模板1">模板1</el-radio>
										<el-radio label="模板2">模板2</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="背景图片：" :class="{ hidden: form.tempName != '模板2' }">
									<el-row>
										<el-col :span="4" class="dsh-col-bg" v-loading="dialogImageUrlLoading2">
											<div class="icon-close">
												<img v-if="dialogImageUrl2" :src="dialogImageUrl2 + '?x-oss-process=style/small'" @click="clickTest2" class="avatar">
												<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest2" style="width:80px;height:120px;line-height: 120px;"></i>
												<i v-if="dialogImageUrl2" class="el-icon-circle-close" @click="handleUploadDelete2"></i>
											</div>
											<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
												<input type="file" name="file" ref="uploadIpt2" @change="handleSelectImg2" />
												<input type="submit" value="上传" ref="uploadSubmit" />
											</form>
											<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
											<el-dialog :visible.sync="dialogVisible2">
												<img width="100%" :src="dialogImageUrl2" alt="">
											</el-dialog>
										</el-col>
										<el-col :span="15">
											<el-row class="dsh-flex">
												<el-col :span="12">
												</el-col>
												<el-col :span="12">
													<span class="hintColor">建议尺寸：320 * 480 像素</span>
												</el-col>
											</el-row>
										</el-col>
									</el-row>
								</el-form-item>
								<el-form-item label="背景透明度：" :class="{ hidden: form.tempName != '模板2' }">
									<el-input v-model="form.bgTransparency" placeholder="请输入背景透明度" class="dsh-opa"></el-input>%
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="handleSaveHead">保存</el-button>
								</el-form-item>
							</div>
						</el-form>
						<div v-else>
							<div v-loading="handleSaveMainLoading" class="component" v-for="(item, index) in items" :key="item.id">
								<div :is="item.component" :text="item.id" :childData="!item.data ? [] : item.data" v-show="item.isHidden" :ref="`homePageSetNav${index}`"></div>
							</div>
							<div class="btn-save">
								<el-button type="primary" @click="handleSaveMain">保存</el-button>
							</div>
						</div>
					</el-main>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片
	import Cookie from 'js-cookie'
	import { homePageSetShow, homePageSetSave, homePageSetShow2, homePageSetSave2, homePageSetEdit2 } from '@/api/mobile/homePageSet'
	import { mapGetters } from "vuex";
	import { homePageSet, homePageSetNav, homePageSetImg, homePageSetTitle } from '@/views/WebRoot/mobile'
	import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
	export default {
		data() {
			return {
				enterLoading:false,
				handleSaveMainLoading:false,
				roleBtn: {
					selectMemHomePageSetInfo: false,
					saveMemHomePageSetInfo: false
				},
				// 数据
				headerSelect: "",

				form: {
					// "brandName": "品牌名称",
					// "pubNumCode": "公众号ID",
					// "pubNumName": "公众号名称",
					"pageName": "", // 页面名称
					"bgUrl": {
						head: '',
						all: ''
					}, // 背景图片URL
					"memCardOption": "不显示", // 会员卡号选项（显示电子卡号、显示手机号、显示品牌号、不显示）
					"isLogo": "", // 是否显示品牌LOGO
					"isLevel": "", // 是否显示会员等级
					"tempId": "", // 使用模板
					"tempName": "模板1", // 使用模板
					"bgTransparency": 45 // 背景透明度
				},
				childData: '', // 传递数据
				isHeadShow: true,
				items: [], // 动态组件
				navBoxData: [],
				addSeq: 0,
				maxSeq: 0, // 当前最大序列号
				seq: 0, // 当前选中的序列号
				type: '',
				id: '',
				version: 0,

				dialogImageUrlLoading: false,
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径

				dialogImageUrlLoading2: false,
				dialogImageUrl2: '', // 图片列表
				dialogVisible2: false
			};
		},
		components: {
			homePageSet,
			homePageSetNav,
			homePageSetImg,
			homePageSetTitle
		},
		methods: {
			// 方法
			handleInsert(obj) {
				// this.insertSeq = obj.seq + 1;
			},
			handleShow() {
				let params = {
					userId: this.userInfo.userCode
				}
				homePageSetShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.form = msg;
							this.dialogImageUrl = this.form.bgUrl.head;
							this.dialogImageUrl2 = this.form.bgUrl.all;

							// this.form.isLogo = msg.isLogo == 'true' ? true : false;
							this.form.isLevel = msg.isLevel == 'true' ? true : false;
							this.form.bgUrl = msg.bgUrl == '' ? {head: '',all: ''} : msg.bgUrl;
						} else {
							this.$message.warning(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					})
			},
			handleSaveHead() { // 保存(上)
				let params = {
					"userId": this.userInfo.userCode,
					"id": this.form.id,
					"pageName": this.form.pageName,
					"tempId": this.form.tempId,
					"tempName": this.form.tempName,
					"bgUrl": this.form.bgUrl,
					"memCardOption": this.form.memCardOption,
					"isLogo": this.form.isLogo,
					"isLevel": this.form.isLevel,
					"bgTransparency": this.form.bgTransparency,
					"version": this.form.version
				}
				this.enterLoading=true;
				homePageSetSave(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						this.enterLoading=false;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.handleShow();
						} else {
							this.$message.warning(msg);
							this.handleShow();
						}
					})
					.catch((err) => {
						this.enterLoading=false;
						// console.log(err);
					})
			},
			handleMemCardOption(str) {
				//          console.log(str);
			},

			handleSubmit() { // 保存并发布
				this.childData = '保存并发布';
			},
			handlePreview() { // 预览
				this.childData = '预览';
			},

			handleTempName(str) { // 选择模式
				if(str == '模板1') {
					this.form.bgUrl.all = '';
					this.form.bgTransparency = '';
					this.dialogImageUrl2 = '';
				}
			},
			// 设置当前序列号
			handleGetSeq(num) {
				this.maxSeq = num;
			},
			handleParentClick(obj) { // 图片导航、文字导航等
				this.type = obj.type;
				let data = !obj.data ? {} : obj.data;
				let navSet = !data.navSet ? {} : data.navSet;
				this.id = !data.id ? '' : data.id;
				this.version = !data.version ? '' : data.version;
				this.seq = !data.seq ? 0 : data.seq;
				this.addSeq = !obj.index ? 0 : obj.index;
//				console.log(this.addSeq);
				if(this.type == '卡片') {
					this.isHeadShow = true;
				} else {
					this.isHeadShow = false;
					if(this.type == '图文导航') {
						this.items = [];
						let displayData = [1, 1, 1, 1];
						for(let i = 0; i < 4; i++) {
							this.items.push({
								'id': i,
								'component': 'home-page-set-nav',
								'data': navSet[i],
								'isHidden': displayData[i]
							});
						}
					}
					if(this.type == '文本导航') {
						this.items = [];
						let displayData = [1, 0, 0, 0];
						// for(let i = 0; i < 1; i++) {
							this.items.push({
								'id': 0,
								'component': 'home-page-set-nav',
								'data': navSet[0],
								'isHidden': displayData[0]
							});
						// }
					}
					if(this.type == '图片') {
						this.items = [];
						this.items.push({
							'id': 0,
							'component': 'home-page-set-img',
							'data': navSet[0],
							'isHidden': true
						});
					}
					if(this.type == '辅助空白') {
						this.handleSaveBr();
					}
					if(this.type == '辅助线') {
						this.handleSaveHr();
					}
					if(this.type == '标题') {
						// console.log(navSet[0]);
						this.items = [];
						this.items.push({
							'id': 0,
							'component': 'home-page-set-title',
							'data': navSet[0],
							'isHidden': true
						});
					}
				}
			},
			// 添加辅助空白
			handleSaveBr() {
				let params = {
					"userId": this.userInfo.userCode,
					"seq": this.addSeq, //从上到下的顺序（0、1、2...）
					"type": this.type
				}
				homePageSetSave2(params)
					.then((res) => {
						// this.$refs.homePageSet.handlePictureNaveAdd(this.type);
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.$refs.homePageSet.showTable();
						} else {
							this.$message.warning(msg);
							this.$refs.homePageSet.showTable();
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			// 添加辅助线
			handleSaveHr() {
				let params = {
					"userId": this.userInfo.userCode,
					"seq": this.addSeq, //从上到下的顺序（0、1、2...）
					"type": this.type
				}
				homePageSetSave2(params)
					.then((res) => {
						// this.$refs.homePageSet.handlePictureNaveAdd(this.type);
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.$refs.homePageSet.showTable();
						} else {
							this.$message.warning(msg);
							this.$refs.homePageSet.showTable();
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleSaveMain() { // 图片导航、文字导航等保存
				let arrayObj = [];
				this.items.forEach((val, index) => {
					let refIndex = `homePageSetNav${index}`;
					arrayObj.push({
						...this.$refs[refIndex][0].form
					});
				});
				this.handleSaveMainLoading=true;
				let id = this.id;
				let version = this.version;
				this.id = this.version = '';
				// this.navBoxData = arrayObj;
				let params = {};
				if(!id || !version) {
					// console.log(this.seq);
					params = {
						"userId": this.userInfo.userCode,
						"navSet": arrayObj,
						"seq": this.addSeq, //从上到下的顺序（0、1、2...）
						"type": this.type
					}
					homePageSetSave2(params)
						.then((res) => {
							// this.$refs.homePageSet.handlePictureNaveAdd(this.type);
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							this.handleSaveMainLoading=false;
							if(code == 'SUCCESS') {
								this.isHeadShow=true;
								this.$message.success(msg);
								this.$refs.homePageSet.showTable();
							} else {
								this.$message.warning(msg);
								this.$refs.homePageSet.showTable();
							}
						})
						.catch((err) => {
							this.handleSaveMainLoading=false;
							// console.log(err);
						});
				} else {
					params = {
						"userId": this.userInfo.userCode,
						"id": id,
						"navSet": arrayObj,
						"seq": this.seq, //从上到下的顺序（0、1、2...）
						"type": this.type,
						"version": version
					}
					homePageSetEdit2(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							this.handleSaveMainLoading=false;
							if(code == 'SUCCESS') {
								this.isHeadShow=true;
								this.$message.success(msg);
								this.$refs.homePageSet.showTable();
							} else {
								this.$message.warning(msg);
								this.$refs.homePageSet.showTable();
							}
						})
						.catch((err) => {
							this.handleSaveMainLoading=false;
							// console.log(err);
						});
				}

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
					this.dialogImageUrlLoading = true;
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
									msg = data.messageContent,
									val = data.valueObj;
								if(code == 'SUCCESS') {
									// console.log(that.form.bgUrl.head);
									that.form.bgUrl.head = msg.fileName; // 图片赋值
									// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
									that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
	
									that.$message.success('上传成功');
									that.dialogImageUrlLoading = false;
									//                      console.log(that.form.bgUrl);
								}
							})
							.catch((err) => {
								// console.log(err);
								this.dialogImageUrlLoading = false;
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
				this.form.bgUrl.head = '';
				this.$refs.uploadIpt.value = '';
			},

			handleSelectImg2(file) { // 上传图片
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
					this.dialogImageUrlLoading2 = true
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
								//                          console.log(msg.fileName)
								that.form.bgUrl.all = msg.fileName; // 图片赋值
								// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
								that.dialogImageUrl2 = msg.fileName; // 图片回填 - 本地图片
								that.$message.success('上传成功');
								that.dialogImageUrlLoading2 = false;
							})
							.catch((err) => {
								// console.log(err);
								that.dialogImageUrlLoading2 = false;
							})
					}
				}
			},
			clickTest2() {
				// 点击测试
				this.$refs.uploadIpt2.dispatchEvent(new MouseEvent('click'));
			},
			handlePictureCardPreview2(file) { // 图片查看
				this.dialogVisible2 = true;
			},
			handleUploadDelete2() { // 删除图片
				this.dialogImageUrl2 = '';
				this.form.bgUrl.all = '';
				this.$refs.uploadIpt2.value = '';
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			// console.log(this.$refs);
			this.handleShow(); // 显示会员首页数据

			// 选择品牌
			let params = {
				userId: this.userInfo.userCode
			}
			customizeSelect(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					// count = data.count,
					// msg = data.data;
					// console.log(msg)
					if(code == 'SUCCESS') {
						this.headerSelect = msg.brandName;
					} else {
						this.$message.warning(msg);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"])
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.app-container {
		padding: 0;
	}
	.el-card {
		width: 100%;
	}

	.el-form {
		margin: 10px;
	}

	.el-input {
		width: 40%;
	}

	.el-textarea {
		width: 80%;
	}

	.dsh-center {
		display: flex;
		justify-content: center;
	}

	.dsh-vertical-center {
		display: flex;
		align-items: center;
	}

	.container-main .el-col.el-col-container {
		border: 1px solid #d2d2d2;
		font-size: 14px;
	}

	.container-main .el-col.el-col-button {
		padding: rem(20px);
		display: flex;
		justify-content: center;
		font-size: 14px;
	}

	.container-main .el-header {
		width: 100%;
		height: 50px !important;
		padding: 10px;
		background: #f5f7fa;
	}

	.container-main .el-main {
		position: relative;
		// height: 640px;
	}

	.contentItem span {
		margin-right: rem(10px);
		cursor: pointer;
	}

	.form-item-msg {
		font-size: rem(12px);
		color: #999;
	}
	/* 上传图片 */
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
		// border-radius: 6px;
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
		// border-radius: 8px;
		width: 160px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		cursor: pointer;
	}

	.avatar {
		display: block;
		width: 80px;
		height: 120px;
		border: 1px dashed #d9d9d9;
		cursor: pointer;
	}
	.avatar1 {
		display: block;
		width: 160px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		cursor: pointer;
	}

	.avatar:hover {
		border-color: #409EFF;
	}

	.dsh-flex {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-start;
		height: 125px;
	}

	.dsh-flex1 {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-start;
		height:75px;
	}
	.hidden {
		display: none;
	}

	.component {
		// display: block;
		overflow: hidden;
	}

	.btn-save {
		text-align: center;
		padding-bottom: 10px;
		.el-button {
			width: 100px;
		}
	}
	.dsh-header{
		display: flex;
		justify-content: space-between;
	}
	.dsh-main{
		position: relative;
		background: #fff;
	}
	.hint{
		color: #AEAEAE;
		margin-left: 10px;
	}
	.dsh-col-left{
		height: 70px;
		min-width: 160px;
	}
	.dsh-col-right{
		height: 70px;
	}
	.dsh-col-bg{
		height: 120px;
		margin-bottom: 10px;
	}
	.hintColor{
		color: #2d2d2d;
	}
	.dsh-opa{
		width: 140px
	}
</style>
