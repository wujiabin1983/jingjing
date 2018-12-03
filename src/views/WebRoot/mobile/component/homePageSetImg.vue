// 会员首页 - 导航
<template>
	<div class="app-container">
		<el-card>
			<el-form :model="form" ref="form" label-width="120px" class="demo-form">
				<el-row>
					<el-col :span="4" class="height100">
						<div class="icon-close" v-loading="dialogImageLoading">
							<img v-if="dialogImageUrl" :src="dialogImageUrl" @click="clickTest" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"  @click="clickTest"></i>
							<i v-if="dialogImageUrl" class="el-icon-circle-close"  @click="handleUploadDelete"></i>
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
					<el-col :span="20">
						<el-row class="dsh-flex">
							<el-col :span="12">
							</el-col>
							<el-col :span="12">
								<span class="hint">建议尺寸：640 * 320像素</span>
							</el-col>
						</el-row>
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
	export default {
		props: ['childData'],
		data() {
			return {
				form: {
					picture: ''
				},
				dialogImageLoading: false,

				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
			};
		},
		methods: {
			// 方法
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
					this.dialogImageLoading = true;
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
								that.dialogImageUrl = e.target.result; // 图片回填 - 本地图片
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
				// 点击上传
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
						picture: ''
					}
					this.dialogImageUrl = '';
				}else {
					this.form = {
						picture: this.childData.picture
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
	}
	.dsh-center {
		display: flex;
		justify-content: center;
	}
	
	.dsh-input-inline {
		display: inline-block;
		width: 130px;
	}
	.height100{
		height: 100px;
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
		.close {
			position: absolute;
			top: -5px;
			right: -5px;
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
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 100px;
		height: 100px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}

	.dsh-flex {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 80px;
	}
	.hint{
		color: #2d2d2d;
	}
</style>