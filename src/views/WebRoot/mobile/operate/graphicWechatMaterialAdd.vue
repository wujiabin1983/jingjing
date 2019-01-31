// 图文素材 - 新建微信图文素材
<template>
	<el-container class="app-container">
		<el-main class="container-main">
			<el-row>
				<el-col :span="7" class="el-col-container" v-loading="showLoading">
					<el-header class="">
						图文列表-预览窗口
					</el-header>
					<el-main class="dsh-main">
						<graphicWechatList ref="graphicWechatList" @cForm="handleShowInfo" :fileNameObj="fileNameObj" :checkedPic="checkedPic" :picObj="picObj"></graphicWechatList>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container" v-loading="saveLoading">
					<el-header class="dsh-vertical-center dsh-header">
						<span>编辑图文列表内容</span>
					</el-header>
					<el-main class="dsh-main" v-loading="showLoading">
						<el-form :model="form" ref="formMain" :rules="rulesForm" label-width="120px" class="demo-form">
							<!-- 封面选择开始 -->
							<el-form-item label="封面选择" prop="fieldUrl">
								<el-row class="bgImage space-around">
									<el-col :span="8">
										<!-- fieldUrl 图片路径 预览图片显示地址 -->
										<el-input v-model="form.fieldUrl" v-show="false" style="width:500px"></el-input>
										<!-- <el-input v-model="form.mediaId" v-show="false" ></el-input> -->
										<!-- 上传图片的样式 -->
										<div class="icon-close" v-loading="imgLoading">
											<img v-if="dialogImageUrl" :src="dialogImageUrl + '?x-oss-process=style/small'" @click="clickTest" class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
											<i class="el-icon-circle-close" @click="handleUploadDelete"></i>
										</div>

										<el-dialog :visible.sync="dialogVisible">
											<img width="100%" :src="dialogImageUrl" alt="">
										</el-dialog>

										<el-dialog width="80%" :visible.sync="dialogVisiblePic" id="groupDialog">
											<!-- 图片选择 -->
											<groupMaterialListPic v-show="dialogVisiblePic" @handleChecked="handleChecked"></groupMaterialListPic>

											<span slot="footer" class="dialog-footer">
												<el-button @click="dialogVisiblePic = false">取 消</el-button>
												<el-button type="primary" @click="handleDialogSurePic">确 定</el-button>
											</span>
										</el-dialog>
									</el-col>
									<el-col :span="16">
										<p class="advice">建议尺寸：900 * 500 像素</p>
									</el-col>
								</el-row>

							</el-form-item>
							<!-- 封面选择结束 -->
							<el-form-item label="标题" prop="imageTextTitle">
								<el-input placeholder="请输入标题" v-model="form.imageTextTitle" :maxlength="50" :disabled="formDisabled">
									<template slot="suffix">{{ titleNum + '/50' }}</template>
								</el-input>
							</el-form-item>
							<el-form-item label="作者" prop="author">
								<el-input v-model="form.author" placeholder="请输入作者" :maxlength="20" :disabled="formDisabled">
									<template slot="suffix">{{ authorNum + '/20' }}</template>
								</el-input>
							</el-form-item>
							
							<el-form-item label="摘要">
								<el-input v-model="form.summary" placeholder="选填，不选将从正文中选取" :maxlength="120" :disabled="formDisabled">
									<template slot="suffix">{{ abstractNum + '/120' }}</template>
								</el-input>
							</el-form-item>
						</el-form>
						<el-form :model="form" ref="form" label-width="80px" class="demo-form">
							<el-tabs v-model="activeName" @tab-click="handleClick">
								<el-tab-pane label="编辑正文" name="first">
									<quill-editor class="quill-editor" ref="newEditor" v-if="!formDisabled" :content="form.mainBody.mb01" :options="editorOption" @change="onEditorChange($event)">
									</quill-editor>
									<div v-else>
										<!-- formDisabled  mainBody -->
										<el-form-item>
											<el-input placeholder="请输入正文" v-model="form.mainBody.mb01" :disabled="formDisabled"></el-input>
										</el-form-item>
									</div>
								</el-tab-pane>
							</el-tabs>
							<el-form-item label="阅读原文" class="readtext">
								<el-input placeholder="请输入链接地址" v-model="form.linkAddress" :readonly="false">
								</el-input>
								<el-dropdown @command="handleCommand" >
									<span class="el-dropdown-link">
                                            选择链接地址<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
									<el-dropdown-menu slot="dropdown" class="dsh-dropdown-menu">
										<el-dropdown-item v-for="item in customLink" :key="item.name" :command="item.url">{{item.name}}</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-form-item>
						</el-form>

					</el-main>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="7">&nbsp;</el-col>
				<el-col :span="17" class="dsh-center marginTop10">
					<el-button type="primary" @click="handleSave" v-if="isSave">保存</el-button>
					<el-button @click="handlePush" type="primary" >预览(生成二维码)</el-button>
				</el-col>
			</el-row>
			<el-dialog :visible.sync="showQrcode">
				<div id="qrcode" ref="qrcode" title="">
				</div>
			</el-dialog>
			
			<el-dialog width="80%" :visible.sync="dialogVisibleVideo">
				<!-- 视频选择 -->
				<groupMaterialListVideo ref="groupMaterialListVideo" @handleChecked="handleCheckedVideo"></groupMaterialListVideo>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleVideo = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSureVideo">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog width="80%" :visible.sync="dialogVisibleAudio">
				<!-- 音频选择 -->
				<groupMaterialListAudio ref="groupMaterialListAudio" @handleChecked="handleCheckedAudio"></groupMaterialListAudio>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleAudio = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSureAudio">确 定</el-button>
				</span>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from "@/api/platform/userGroup";
	import { mapGetters } from "vuex";
	import graphicWechatList from '@/views/WebRoot/mobile/component/graphicWechatList'
	import { graphicWechatPush } from '@/api/mobile/graphicMaterialAdd'
	import {selectLabelData} from '@/api/public'
	import groupMaterialListVideo from '@/views/WebRoot/mobile/component/groupMaterialListVideo' // 图片素材
	import groupMaterialListAudio from '@/views/WebRoot/mobile/component/groupMaterialListAudio' // 图片素材
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import { getCustomLinksConstCustomize } from '@/api/public' // 外部链接
	import { MaterialLibraryFiveShow } from '@/api/mobile/graphicMaterial'
	// 引入富文本
	import { quillEditor } from 'vue-quill-editor'
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import Cookie from 'js-cookie'
	import QRCode from 'qrcodejs2' // 二维码生成器
	export default {
		data() {
			return {
				saveLoading:false,
				//dialogVisiblePic:false,
				dialogVisibleVideo:false,
				dialogVisibleAudio:false,
				videoUrl:'',
				audioUrl:'',
				//checkedPic :[],
				imageType:'',
				// 图片选择
				dialogVisiblePic: false,
				checkedPic: [],
				isSave:true,
				form: {
					imageTextTitle: '', // 标题
					author: '', // 作者
					coverUrl: '', //图片地址
					mediaId: '', // mediaId
					fieldUrl: '', // 封面图片
					summary: '', // 摘要 abstrac,
					mainBody: {
						"mb01":"", // 阿里图片
						"mb02":"" // 微信图片
					}, // 正文
					linkAddress: '' // 链接地址
				},
				rulesForm: {
					imageTextTitle: [{
							required: true,
							message: '请输入标题',
							trigger: 'change'
						},
						{
							max: 50,
							message: '最大长度不能超过50',
							trigger: 'change'
						}
					],
					author: [{
							required: true,
							message: '请输入作者',
							trigger: 'change'
						},
						{
							max: 20,
							message: '最大长度不能超过20',
							trigger: 'change'
						}
					],
					fieldUrl: [{
							required: true,
							message: '请选择封面',
							trigger: 'change'
						},
						{
							max: 1000,
							message: '最大长度不能超过1000',
							trigger: 'change'
						}
					]
				},
				fileNameObj: {},
				picObj: {},
				//标签
				labelLoading:false,
				dialogVisibleLabel:false,
				labelGroupSelect:[],
				tableLoading:false,
				labelForm:{
					labelName:'',
					labelValue:''
				},
				labelClickType:'',
				labelGroup:[],
				labelName:[],
				rules: {
					labelValue: [{
							required: true,
							message: '请选择标签',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					]
				},
				showLoading:false,//初始加载框

				formDisabled: false,

				titleNum: '0', // 输入字节数
				authorNum: '0',
				abstractNum: '0',

				items: [], // 富文本
				content: "", // 富文本
				editorOption:{
					modules: {
                        syntax: {
                            highlight: text => hljs.highlightAuto(text).value
                        },
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block'],

                            [{'header': 1}, {'header': 2}],               // custom button values
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                            [{'direction': 'rtl'}],                         // text direction

                            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],

                            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                            [{'font': []}],
                            [{'align': []}],
                            ['link', 'image', 'formula', 'video','videoLink','audio'],
                            ['clean']
                        ]
                    },
				},
				customLink:[],//链接地址
				activeName: 'first',

				imgLoading: false,
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				showQrcode: false,
			};
		},
		components: {
			quillEditor,
			graphicWechatList,
			groupMaterialListPic,
			groupMaterialListVideo,
			groupMaterialListAudio
		},
		methods: {
			//音频监听
			handleCheckedAudio(str){
				if(str.coverUrl){
					this.audioUrl=str.coverUrl;
				}else{
					this.audioUrl='';
				}
			},
			//音频弹出确认
			handleDialogSureAudio(){
				let audioUrl=this.audioUrl;
				if(audioUrl!=""){
					$(".ql-editor").append('<p><iframe class="ql-video" style="height:150px" allowfullscreen="true" src="'+audioUrl+'" frameborder="0"></iframe></p>');
				}
	    		this.dialogVisibleAudio=false;
			},
			//视频弹出监听选择
			handleCheckedVideo(str){
				if(str.coverUrl){
					this.videoUrl=str.coverUrl;
				}else{
					this.videoUrl='';
				}
			},
			//视频弹出确认
			handleDialogSureVideo(){
				let videoUrl=this.videoUrl;
				if(videoUrl!=""){
					$(".ql-editor").append('<p><iframe class="ql-video" allowfullscreen="true" src="'+videoUrl+'" frameborder="0"></iframe></p>')
				}
	    		this.dialogVisibleVideo=false;
			},
			// 图片选择
			handleChecked(str) {
				debugger
				this.checkedPic[0] = str.id
			},
			//弹出确认
			selectImage(){
				this.dialogVisiblePic=true;
				this.imageType="editor";
			},

			// 图片选择
			handleChecked(obj) {
				//console.log(JSON.stringify(obj));
				//let mediaId = obj.mediaId;
				let fieldUrl = obj.coverUrl;
				this.form.mediaId = obj.mediaId;
				this.checkedPic[0] = fieldUrl;
				this.picObj[fieldUrl] = fieldUrl;
			},
			// 图片素材确定
			handleDialogSurePic() {
				this.dialogVisiblePic = false;
				this.isShow = false;
				// this.$refs.groupMaterialList.handleCommit();
				let pic = this.checkedPic[0];
				if(this.imageType=="editor"){
					$(".ql-editor").append('<img src="'+pic+'"  />')
				}else{
					this.form.fieldUrl = pic;
					this.dialogImageUrl = pic;
				}
//				console.log(this.picObj);
			},
			qrcode (url) {  // 生成二维码
				$("#qrcode").html("");
				let qrcode = new QRCode(this.$refs.qrcode, {  
					width: 400,  
					height: 400, // 高度  
					text: url, // 二维码内容  
					render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
					background: '#f0f',  
					foreground: '#ff0'
				}) 
				this.$refs.qrcode.setAttribute('title', '');
				// qrcode.clear();
				qrcode.makeCode(url);
			},
			handlePush() {
				let articlesArray = [];
				let data = this.$refs.graphicWechatList.transform();
				if(data.length>0){
					if(data[0].fieldUrl ==""){
						return false;
					}
					data.forEach(val => {
						articlesArray.push({
//							"title": val.imageTextTitle,
//							"description": val.mainBody.mb01,
//							"url": val.linkAddress==""?'':val.linkAddress,
//							"picurl": val.fieldUrl 
							...val,
							fieldUrl: val.fieldUrl,
							coverUrl: val.fieldUrl,
							//mediaId: val.mediaId,
							mainBody: {
								mb01: val.mainBody.mb01,
								mb02: val.mainBody.mb01	
							},
						});
					})
					let params = {
						userId: this.userInfo.userCode,
						"params": [
							...articlesArray,
						]
					}
//					console.log(JSON.stringify(params))
					let that = this;
					graphicWechatPush(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType=="SUCCESS"){
								that.showQrcode = true;
								that.$nextTick(function() {
									that.qrcode(data.messageContent);
								});
							}else{
								that.$message.warning(data.messageContent);
							}
						})
						.catch((err) => {
	//						console.log(err);
						})
				}
			},
			// 方法
			handleTitle(val, oldVal) {
				this.titleNum = val.length;
			},
			handleAuthor(val, oldVal) {
				this.authorNum = val.length;
			},
			handleAbstract(val, oldVal) {
				this.abstractNum = val.length;
			},
			onEditorChange(evt) { // 富文本
				// console.log(evt);
				this.form.mainBody.mb01 = evt.html;
				this.form.mainBody.mb02 = evt.html;
			},
			handleClick(tab, event) {
				if(tab.index == 0) {
				    if(!this.formDisabled) {	
				    	this.form.linkAddress="";
//						var vm =this
//						var imgHandler = async function(state) {
//						    if (state) {
//						      //button is clicked
//								vm.$refs.uploadIpt1.dispatchEvent(new MouseEvent('click'));
//						    }
//						}
//						vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
					}
				}else{
					this.form.mainBody.mb01="";
				}
				//          console.log(tab.index);
				// if(tab.index == 0) {
				//     this.form.linkAddress = ''; // 自定义链接清空
				// }
				// if(tab.index == 1) {
				//     this.form.mainBody = ''; // 正文清空
				// }
			},
			handleCommand(command) { // 下拉菜单
				this.form.linkAddress = command;
			},
			handleShowInfo(str) { // 显示卡片信息
//				console.log(JSON.stringify(str))
				this.formDisabled = false;
				this.isSave=true;
				this.form = str;
				this.dialogImageUrl = str.fieldUrl;

//				this.$nextTick(function() {
//					var vm =this
//					var imgHandler = async function(state) {
//						if (state) {
//							vm.$refs.uploadIpt1.dispatchEvent(new MouseEvent('click'));
//						}
//					}
//					vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
//				})
			},
			handleSave() { // 保存
				this.$refs['formMain'].validate((valid) => {
					if(valid) {
						if(this.activeName=="first"){
							if(this.form.mainBody.mb01==""){
								this.$message.warning('请输入正文内容！');
								return false;
							}
						}else{
							if(this.form.linkAddress==""){
								this.$message.warning('请选择链接地址！');
								return false;
							}
						}
						this.saveLoading=true;
						this.$refs.graphicWechatList.handleSave(); //另一页面保存
					}
				})
			},

			clickTest() {
				// 点击测试
				// if(!this.$refs.uploadIpt) {
				// 	return false;
				// }else {
				// 	this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
				// }
				this.dialogVisiblePic = true;
				this.imageType="";
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.form.brandLogo = '';
				this.form.fieldUrl = '';
				//this.$refs.uploadIpt.value = '';
			},

			showDataInfo(){
				//回显数据
				let	params = {
					"userId": this.userInfo.userCode, // 当前登录用户账号
					"page": 0, // 当前页
					"limit": 1, // 每页记录数
					"imageTextTitle": '',
					"masterId": this.groupId // 主页面传过来的信息Id
				}
				// console.log(params);
				this.showLoading=true;
				MaterialLibraryFiveShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						this.formDisabled = false;
						this.isSave=true;
						this.form = msg[0][0];
						this.dialogImageUrl = msg[0][0].fieldUrl;
//						this.$nextTick(function() {
//							var vm =this
//							var imgHandler = async function(state) {
//								if (state) {
//									//button is clicked
//									vm.$refs.uploadIpt1.dispatchEvent(new MouseEvent('click'));
//								}
//							}
//							vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
//						})
						this.showLoading=false;
					})
					.catch((err) => {
						// console.log(err);
					});
			}
		},
		created() {
			// 钩子函数 -- 初始化

			let params = {
				userId: this.userInfo.userCode
			}
			let that = this;
			getCustomLinksConstCustomize(params).then((res) => {
				let data = JSON.parse(Base64.decode(res.data)),
					code = data.messageType,
					msg = data.messageContent,
					val = data.valueObj;
	//              console.log(JSON.stringify(data))
				if(code == 'SUCCESS') {
					this.customLink = msg;
				}else { 
					this.$message.error(msg);
				}
			})
			if(this.getMasterId!='') {
				this.showDataInfo();
			}
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"]),
			getMasterId() {
				let masterId = this.$route.params.masterId;
				return masterId;
			},
		},
		mounted() {
			let vm = this;
		    let imgHandler = async function(state) {
			    if (state) {
			    	vm.selectImage();
			    }
		    }
		    vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
			$(".ql-audio").click(function(){
				vm.dialogVisibleAudio=true;
			})
			
			$(".ql-videoLink").click(function(){
	    		vm.dialogVisibleVideo=true;
				vm.$nextTick(() => {
	    			vm.$refs.groupMaterialListVideo.handleMaterialLibraryListShow();
				});
			})
		},
		watch: {
			'form.imageTextTitle': {
				handler: 'handleTitle',
				deep: true
			},
			'form.author': {
				handler: 'handleAuthor',
				deep: true
			},
			'form.summary': {
				handler: 'handleAbstract',
				deep: true
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
		margin: 10px;
	}
	.dsh-main{
		position: relative;
		background: #fff;
	}
	.el-input {
		width: 40%;
	}
	
	.el-textarea {
		width: 80%;
	}
	
	.dsh-center {
		display: flex;
		justify-content: space-around;
	}
	
	.dsh-margin10 {
		margin: 10px;
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
	}
	
	.el-input-group__prepend {
		width: 2rem;
	}
	/* 上传图片 */
	// 图片删除按钮
	.icon-close {
		position: relative;
		width: 100%;
		.el-icon-circle-close {
			position: absolute;
			top: -5px;
			left:96%;
			color: #fa5555;
			cursor: pointer;
		}
	}
	.bgImage {
		.el-col:last-child {
			height: 100px;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
		}
	}
	
	.space-around {
		margin-bottom: 10px;
	}
	
	.advice {
		color: #d2d2d2;
		margin-left: 10px;
		margin-top: 70px;
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
		border-radius: 3px;
		width: 100%;
		height: 100px;
		line-height: 100px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 180px;
		height: 100px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	// 添加标签
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	#qrcode {
		text-align: center;
		display: flex;
		justify-content: center;
	}
	.elInput{
		padding-left: 30px;
		margin-bottom: 40px;
	}
	.elInput>span{
		height: 30px;
		line-height: 30px;
		margin-right: 5px;
		margin-bottom: 10px;
	}
	.noLabel{
		padding-left: 30px;
		margin-bottom: 30px;
		display: block;
	}
	.labelGroup{
		padding-left: 30px;
	}
	.labelGroup>span{
		height: 30px;
		line-height: 30px;
		margin-right: 5px;
		margin-bottom: 20px;
		cursor: pointer;
	}
	.dsh-header{
		display: flex;
		justify-content: space-between;
	}
	.dsh-dropdown-menu{
		width:200px;
		height:200px;
		overflow: auto;
	}
	.readtext{
		padding-top: 10px;
		margin-top: 10px;
	}
	.width300{
		width: 300px;
	}
	.quill-editor{
		height:200px;
		margin-bottom:68px;
		mragin-left:50px;
		mragin-right:50px;
	}
</style>