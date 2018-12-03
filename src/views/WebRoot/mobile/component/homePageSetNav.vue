// 会员首页 - 编辑会员首页图片导航内容
<template>
	<div class="app-container">
		<el-card class="cardListShow">
			<el-form :model="form" ref="form" label-width="120px" class="demo-form">
				<el-row>
					<el-col :span="4" class="minWidth80">
						<el-form-item label-width="0" class="uploadImgBox">
							<div class="icon-close" v-loading="dialogImageLoading">
								<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
								<img v-if="dialogImageUrl" :src="dialogImageUrl" @click="clickTest" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
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
					</el-col>
					<el-col :span="20" class="paddingTop10">
						<el-form-item label="导航名称" class="mrgBottom10">
							<el-input v-model="form.name" placeholder="请输入导航名称"></el-input>
						</el-form-item>
						<el-form-item label="导航链接">
							<el-input v-model="form.link" class="dsh-input-inline dsh-input"></el-input>
							<el-dropdown trigger="click" @command="handleLink" class="dsh-input-button">
								<el-button type="primary" @click="handleDropDown">
									选择<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown" class="dsh-dropdown-menu">
									<el-dropdown-item v-for="item in customLink" :key="item.name" :command="item.url">{{item.name}}</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import { uploadImg } from '@/api/base/brandInfo'
	import Cookie from 'js-cookie'

	import { getCustomLinksConst } from '@/api/public' // 外部链接
	export default {
		props: ['childData'],
		data() {
			return {
				form: {
					picture: '',
					name: '',
					link: ''
				},
				dialogImageLoading: false,
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径

				customLink: [],
			};
		},
		methods: {
			// 方法
			handleLink(str) {
//				console.log(str);
				this.form.link = `http://${str}`;
			},
			handleDropDown() {
				let params1 = {
					userId: this.userInfo.userCode
				}
				getCustomLinksConst(params1).then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent,
						val = data.valueObj;
		//              console.log(JSON.stringify(data))
//						console.log(data, 'sldjflasfjl')
					if(code == 'SUCCESS') {
						this.customLink = msg;
					}else { 
						this.$message.error(msg);
					}
				})
			},
			// 上传图片
			handleSelectImg(file) { 
				this.dialogImageLoading = true;
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
								that.form.picture = msg.fileName; // 图片赋值
								// that.form.picture = e.target.result; // 图片赋值
								that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
								that.$message.success('上传成功');
								that.dialogImageLoading = false;
							})
							.catch((err) => {
								// console.log(err);
								that.dialogImageLoading = false;
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

		},
		created() {
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"]),
			returnChildData() {
				if(!this.childData) {
					this.form = {
						picture: '',
						name: '',
						link: ''
					}
					this.dialogImageUrl = '';
				}else {
					this.form = {
						picture: this.childData.picture,
						name: this.childData.name,
						link: this.childData.link
					}
					this.dialogImageUrl = this.childData.picture;
				}
				return !this.childData ? [] : this.childData;
			}

		},
		watch: {
			'returnChildData': function(val, oldVal) {
				
			},
			deep: true
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 80%;
		padding: 0;
		.el-card__body{
			padding-bottom:0
		}
	}
	
	.el-form {
		padding: 0;
		.el-form-item{
			margin-bottom: 0px;
		}
		.mrgBottom10{
			margin-bottom:10px;
		}
	}
	
	.dsh-center {
		display: flex;
		justify-content: center;
	}
	
	.dsh-input-inline {
		display: inline-block;
		width: 350px;
	}
	.minWidth80{
		min-width: 80px;
	}
	// 上传图片
	.icon-close {
		position: relative;
		display: inline-block;
		padding-top: 5px;
		.el-icon-circle-close {
			font-size: 14px; 
			position: absolute;
			top: -0px;
			right: -7px;
			color: #fa5555;
			cursor: pointer;
		}
	}
	.uploadImgBox {
		margin: 0 auto;
		text-align: center;
		button {
			margin-top: 10px;
		}
		img {
			margin: 0 auto;
		}
		.imgBox {
			width: 100px;
			height: 100%;
			margin: 0 auto;
			position: relative;
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
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 80px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	.dsh-dropdown-menu{
		width:200px;
		height:200px;
		overflow: auto;
	}
	.paddingTop10{
		padding-top: 10px;
	}
</style>