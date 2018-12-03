// 移动管理 - 会员特权
<template>
	<el-container class="app-container">
		<el-header>
			<h4>会员特权</h4>
		</el-header>
		<el-main class="container-main">
			<el-row>
				<!-- 手机 -->
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{ headerSelect }}</div>
					</el-header>
					<el-main class="dsh-main dsh-main-privilege">
						<homeMemberPageSet ref="homePageSet" :bgUrl="form.bgUrl" :childData="childData" :pageName="form.pageName" :imgSrc="dialogImageUrl" :childMemCardOption="form.memCardOption" :childLogo="form.isLogo" :childLevel="form.isLevel" :childTempName="form.tempName" :childBgUrl="dialogImageUrl2" :childBgTransparency="form.bgTransparency" :childNavBox="navBoxData" :childAddBar="false" :childShow="form.attribute1" :childQuillEditor="content"  @parentClick="handleParentClick">
						</homeMemberPageSet>
					</el-main>
				</el-col>
				<!-- 编辑 -->
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>编辑会员特权内容</span>
					</el-header>
					<el-main class="dsh-main">
						<el-form :model="form" ref="form" label-width="140px" class="demo-form" v-loading="saveLoading">
							<div class="head">
								<el-form-item label="顶部与会员首页一致" class="setAttribute">
									<el-checkbox v-model="form.attribute1">启用</el-checkbox>
								</el-form-item>
								<!-- <el-form-item label="" width="0"> -->
								<div class="myTextEditorBox">
									<quill-editor ref="newEditor" class="myTextEditor"  
										:content="content"
										:options="editorOption" 
										@change="onEditorChange($event)">
									</quill-editor>
								</div>
								<!-- </el-form-item> -->
								<div class="dsh-center">
									<el-button type="primary" class="marginTop10" @click="handleSubmit" v-if="roleBtn.savePrivilegeSetInfo && this.id==''">添&nbsp;&nbsp;&nbsp;加</el-button>
									<el-button type="primary" class="marginTop10" @click="handleSubmit" v-if="roleBtn.updatePrivilegeSetInfo && this.id!=''">修&nbsp;&nbsp;&nbsp;改</el-button>
								</div>
							</div>
						</el-form>
					</el-main>
				</el-col>
			</el-row>
			<el-dialog width="80%" :visible.sync="dialogVisiblePic">
				<!-- 图片选择 -->
				<groupMaterialListPic @handleChecked="handleChecked"></groupMaterialListPic>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisiblePic = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSurePic">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog width="80%" :visible.sync="dialogVisibleVideo">
				<!-- 视频选择 -->
				<groupMaterialListVideo ref="groupMaterialListVideo" @handleChecked="handleCheckedVideo"></groupMaterialListVideo>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleVideo = false">取1 消</el-button>
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
	import { permission } from '@/utils'
	import Cookie from 'js-cookie'
	import { selectMember, addMember, editMember } from '@/api/mobile/member'
	import { mapGetters } from "vuex";
	import { homeMemberPageSet } from '@/views/WebRoot/mobile'
	import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
	import { quillEditor } from 'vue-quill-editor'

	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import groupMaterialListVideo from '@/views/WebRoot/mobile/component/groupMaterialListVideo' // 图片素材
	import groupMaterialListAudio from '@/views/WebRoot/mobile/component/groupMaterialListAudio' // 图片素材
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	export default {
		data() {
			return {
				dialogVisiblePic:false,
				dialogVisibleVideo:false,
				dialogVisibleAudio:false,
				videoUrl:'',
				checkedPic :[],
				saveLoading:false,
				roleBtn: {
					selectPrivilegeSetInfo: false,
					savePrivilegeSetInfo: false,
					updatePrivilegeSetInfo: false
				},
				// 数据
				headerSelect: "",
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
				id: '',
				version: '',
				form: {
					// "brandName": "品牌名称",
					// "pubNumCode": "公众号ID",
					// "pubNumName": "公众号名称",
					// "pageName": "", // 页面名称
					// "bgUrl": {
					// 	head: '',
					// 	all: ''
					// }, // 背景图片URL
					// "memCardOption": "不显示", // 会员卡号选项（显示电子卡号、显示手机号、显示品牌号、不显示）
					// "isLogo": "", // 是否显示品牌LOGO
					// "isLevel": "", // 是否显示会员等级
					// "tempId": "", // 使用模板
					// "tempName": "模式1", // 使用模板
					// "bgTransparency": 45 // 背景透明度
					attribute1: false, // 顶部与会员首页一致
					privilegeDesc: '' // 特权描述
				},
				childData: '', // 传递数据
				items: [], // 动态组件
				navBoxData: [],
				seq: 0,
				type: '',
				id: '',
				version: 0,

				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径

				dialogImageUrl2: '', // 图片列表
				dialogVisible2: false,

				items: [], // 富文本
				content: "", // 富文本
			};
		},
		components: {
			homeMemberPageSet,
			quillEditor,// 富文本编辑器,
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
					$(".ql-editor").append('<p><iframe class="ql-audio" style="height:150px" allowfullscreen="true" src="'+audioUrl+'" frameborder="0"></iframe></p>');
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
					$(".ql-editor").append('<p><iframe class="ql-video" allowfullscreen="true" src="'+videoUrl+'" frameborder="0"></iframe></p>');
				}
	    		this.dialogVisibleVideo=false;
			},
			selectImage(){
				this.dialogVisiblePic=true;
				this.imageType="editor";
			},
			// 图片选择
			handleChecked(str) {
				this.checkedPic[0] = str.id
			},
			//选择图片
			handleDialogSurePic() {
				let params = {
					userId: this.userInfo.userCode,
					id: this.checkedPic[0]
				}
				MaterialLibraryCardShow3(params)
					.then(res => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.count,
							msg = data.data;
						if(code == 1) {
//							console.log(msg)
							$(".ql-editor").append('<img src="'+msg[0].coverUrl+'"  />')
						}
						this.dialogVisiblePic = false;
					})
					.catch()
			},
			// 富文本编辑器
			onEditorChange(evt) {
				this.content = evt.html;
				this.form.privilegeDesc = evt.html;
			},
			// 方法
			handleShow() {
				let params = {
					"userId" : this.userInfo.userCode
				}
				selectMember(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
//						console.log(JSON.stringify(data))
						this.form.bgUrl= msg[0].bgUrl.head;
						this.form.memCardOption= msg[0].memCardOption;
						this.form.isLogo= msg[0].isLogo;
						this.form.isLevel= msg[0].isLevel== 'true' ? true : false;
						if(count > 0) {
							this.form.attribute1 = msg[0].attribute1 == 'true' ? true : false;
							this.form.privilegeDesc = msg[0].privilegeDesc;
							this.content = msg[0].privilegeDesc;
							this.id = msg[0].id;
							this.version = msg[0].version;
						}
					})
					.catch((err) => {
						this.$message.error('系统繁忙！请稍后重试！');
					});
			},
			handleSubmit() { // 保存
				this.saveLoading=true;
				if(this.id == '') {
					this.childData = '保存并发布';
					let params = {
						"userId" : this.userInfo.userCode,
						...this.form
					}
					addMember(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent,
								val = data.valueObj;
							this.saveLoading=false;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.handleShow();
							}else {
								this.$message.error(msg);
								this.handleShow();
							}
						})
				}else {
					this.childData = '保存并发布';
					// this.$refs.homePageSet.handleSaveMain();
					let params = {
						"userId" : this.userInfo.userCode,
						...this.form,
						"id": this.id,
						"version": this.version,
					}
//					console.log(params)
					editMember(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent,
								val = data.valueObj;
							this.saveLoading=false;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.handleShow();
							}else {
								this.$message.warning(msg);
								this.handleShow();
							}
						})
				}
			},
			handleParentClick(str) { // 图片导航、文字导航等
				let navSet = str.navSet;
				this.seq = str.seq;
				this.type = str.type;
				this.id = str.id;
				this.version = str.version;

			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.handleShow(); // 会员数据
			// 显示品牌
			let params = {
				userId: this.userInfo.userCode
			}
			customizeSelect(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					if(code == 'SUCCESS') {
						this.headerSelect = msg.brandName;
						this.dialogImageUrl=msg.brandLogo;
					} else {
						this.$message.warning(msg);
					}
				})
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"])
		},
		mounted() {
			let vm =this;
		    let imgHandler = async function(state) {
			    if (state) {
		    		vm.dialogVisiblePic=true;
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
		// height: 430px;
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
		width: 160px;
		height: 80px;
		line-height: 80px;
		text-align: center;
	}
	
	.avatar {
		display: block;
		width: 160px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	.dsh-flex {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 80px;
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
	.setAttribute {
		.el-checkbox {
			float: right;
		}
	}
	.myTextEditorBox {
		.myTextEditor {
		}
	}
	.center {
		text-align: center;
	}
	.dsh-main{
		position: relative;
		background: #fff;
	}
	.dsh-header{
		display: flex;
		justify-content: space-between;
	}
</style>