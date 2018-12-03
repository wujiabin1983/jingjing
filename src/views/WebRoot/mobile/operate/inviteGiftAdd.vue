// 移动管理 - 邀请有礼
<template>
	<el-container class="app-container">
		<el-header>
			<h4>邀请有礼</h4>
		</el-header>
		<el-main class="container-main">
			<el-row>
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{ headerSelect }}</div>
					</el-header>
					<el-main class="main-box">
						<div class="imgBox ql-editor" v-html="imgBoxInviter" v-if="form.inviteTab.value=='inviterAwardSet'"></div>
						<div class="imgBox ql-editor" v-html="imgBoxInvited" v-if="form.inviteTab.value=='invitedAwardSet'"></div>
					</el-main>
					<el-row class="buttonBoxPhone">
						<el-col :span="12">
							<div class="dsh-button">邀请好友</div>
							<!--<el-button type="primary">邀请好友</el-button>-->
						</el-col>
						<el-col :span="12">
							<div class="dsh-button">查看邀请记录</div>
							<!--<el-button type="primary">查看邀请记录</el-button>-->
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>设置邀请有礼内容</span>
					</el-header>
					<el-main class="dsh-main" v-loading="enterLoading">
						<el-form :model="form" ref="form" :rules="rules" label-width="100px" class="demo-form">
							<el-form-item label="活动名称" prop="activityName">
								<el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
							</el-form-item>
							<el-form-item label="活动时间" prop="activityDate.value" class="formActivityDate">
								<el-radio-group v-model="form.activityDate.value" @change="handleSelectActivityDate">
									<el-radio label="短期">
										<el-date-picker v-model="form.activityDate.short[0]" type="date" :editable="false" placeholder="选择日期时间" value-format="yyyy-MM-dd" :disabled="form.activityDate.value != '短期'">
										</el-date-picker>
										<span>至</span>
										<el-date-picker v-model="form.activityDate.short[1]" type="date" :editable="false" placeholder="选择日期时间" value-format="yyyy-MM-dd" :disabled="form.activityDate.value != '短期'">
										</el-date-picker>
									</el-radio>
									<el-radio label="长期">长期</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="状态">
								<el-switch v-model="form.status"></el-switch>
							</el-form-item>
							<el-tabs v-model="form.inviteTab.value" @tab-click="handleClick">
								<el-tab-pane label="邀请者" name="inviterAwardSet">
									<!-- form.inviteTab.inviterAwardSet -->
									<el-form-item label="奖励设置">
										<el-button type="primary" data-btn="form.inviteTab.inviterAwardSet.ruleSet" @click="handleRuleSet('inviterAwardSet')">设置会员奖励规则</el-button>
									</el-form-item>
									<el-form-item label="赠送限制">
										<span>邀请满</span>
										<el-input v-model="form.inviteTab.inviterAwardSet.limit"></el-input>
										<span>人赠送</span>
									</el-form-item>
									<el-form-item label="奖励次数">
										<span>奖励</span>
										<el-input v-model="form.inviteTab.inviterAwardSet.time"></el-input>
										<span>次（0为无限次）</span>
									</el-form-item>
									<el-form-item label="活动说明">
										<quill-editor ref="newEditor" id="quill"  :content="form.inviteTab.inviterAwardSet.content" :options="editorOption1" @change="onEditorChange1($event)">
										</quill-editor>
									</el-form-item>
								</el-tab-pane>
								<el-tab-pane label="被邀请者" name="invitedAwardSet">
									<!-- form.inviteTab.invitedAwardSet -->
									<el-form-item label="奖励设置">
										<el-button type="primary" data-btn="form.inviteTab.invitedAwardSet" @click="handleRuleSet('invitedAwardSet')">设置会员奖励规则</el-button>
									</el-form-item>
									<el-form-item label="活动说明">
										<quill-editor ref="newEditor1" id="quill1" :content="form.inviteTab.invitedAwardSet.content" :options="editorOption2" @change="onEditorChange2($event)">
										</quill-editor>
									</el-form-item>
								</el-tab-pane>
							</el-tabs>
						</el-form>
						<div class="el-footer-btn-con">
							<el-button type="primary" @click="handleFinish">完成</el-button>
						</div>
					</el-main>
				</el-col>
			</el-row>
			<el-row>
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
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片
	import Cookie from 'js-cookie'
	// import { bindMembershipCardBinding, bindMembershipCardShow } from "@/api/mobile/bindMembershipCard";
	import { inviteGiftAdd, inviteGiftEdit } from '@/api/mobile/inviteGift'
	import { mapGetters } from "vuex";
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import groupMaterialListVideo from '@/views/WebRoot/mobile/component/groupMaterialListVideo' // 图片素材
	import groupMaterialListAudio from '@/views/WebRoot/mobile/component/groupMaterialListAudio' // 图片素材
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
	import { quillEditor } from 'vue-quill-editor'
	export default {
		data() {
			return {
				imgBoxInviter:'',
				imgBoxInvited:'',
				dialogVisiblePic:false,
				dialogVisibleVideo:false,
				dialogVisibleAudio:false,
				enterLoading:false,
				audioUrl:'',
				audioType:'',
				videoType:'',
				videoUrl:'',
				imageType:'',
				checkedPic :[],
				// 数据
				headerSelect: "",
				form: {
					"activityName": "", // 活动名称
					"activityDate": {
						value: '长期',
						short: [],
						lang: ''
					}, // 活动时间
					status: true, // 状态
					inviteTab: { // tab选项卡
						"value": 'inviterAwardSet', // 选项卡的值
						"inviterAwardSet": {
							ruleSet: {}, // 奖励设置
							limit: '', // 赠送限制
							time: '', // 奖励次数
							content: '', // 活动说明
							// status: '' // 状态
						}, // 邀请者奖励设置
						"invitedAwardSet": {
							ruleSet: {}, // 奖励设置
							content: '', // 活动说明
							// status: '' // 状态
						} // 被邀请者奖励设置
					}
				},
				inviterAwardSetRuleSet: {}, // 邀请者奖励设置
				invitedAwardSetRuleSet: {}, // 被邀请者奖励设置
				rules: {
					activityName: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}, ]
				},
				ruleType: '', // 奖励设置分类（邀请者/被邀请者）

				// 富文本（邀请者）
				items1: [], // 富文本
				content1: "", // 富文本
				editorOption1: {
					modules: {
						syntax: {
							highlight: text => hljs.highlightAuto(text).value
						},
						toolbar: [
							['bold', 'italic', 'underline', 'strike'], // toggled buttons
							['blockquote', 'code-block'],

							[{
								'header': 1
							}, {
								'header': 2
							}], // custom button values
							[{
								'list': 'ordered'
							}, {
								'list': 'bullet'
							}],
							[{
								'script': 'sub'
							}, {
								'script': 'super'
							}], // superscript/subscript
							[{
								'indent': '-1'
							}, {
								'indent': '+1'
							}], // outdent/indent
							[{
								'direction': 'rtl'
							}], // text direction

							[{
								'size': ['small', false, 'large', 'huge']
							}], // custom dropdown
							[{
								'header': [1, 2, 3, 4, 5, 6, false]
							}],

							[{
								'color': []
							}, {
								'background': []
							}], // dropdown with defaults from theme
							[{
								'font': []
							}],
							[{
								'align': []
							}],
                            ['link', 'image', 'formula', 'video','videoLink','audio'],
                            ['clean']
						]
					},
				},
				// 富文本（被邀请者）
				items2: [], // 富文本
				content2: "", // 富文本
				editorOption2: {
					modules: {
						syntax: {
							highlight: text => hljs.highlightAuto(text).value
						},
						toolbar: [
							['bold', 'italic', 'underline', 'strike'], // toggled buttons
							['blockquote', 'code-block'],

							[{
								'header': 1
							}, {
								'header': 2
							}], // custom button values
							[{
								'list': 'ordered'
							}, {
								'list': 'bullet'
							}],
							[{
								'script': 'sub'
							}, {
								'script': 'super'
							}], // superscript/subscript
							[{
								'indent': '-1'
							}, {
								'indent': '+1'
							}], // outdent/indent
							[{
								'direction': 'rtl'
							}], // text direction

							[{
								'size': ['small', false, 'large', 'huge']
							}], // custom dropdown
							[{
								'header': [1, 2, 3, 4, 5, 6, false]
							}],

							[{
								'color': []
							}, {
								'background': []
							}], // dropdown with defaults from theme
							[{
								'font': []
							}],
							[{
								'align': []
							}],
                            ['link', 'image', 'formula', 'video','videoLink','audio'],
                            ['clean']
						]
					},
				},
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
			};
		},
		components: {
			quillEditor,
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
				if(audioUrl!=""&&this.audioType=="quill"){
					$("#quill .ql-editor").append('<p><iframe class="ql-video" style="height:150px" allowfullscreen="true" src="'+audioUrl+'" frameborder="0"></iframe></p>');
				}else{
					$("#quill1 .ql-editor").append('<p><iframe class="ql-video" style="height:150px" allowfullscreen="true" src="'+audioUrl+'" frameborder="0"></iframe></p>');
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
				if(videoUrl!=""&&this.imageType=="quill"){
					$("#quill .ql-editor").append('<p><iframe class="ql-video" allowfullscreen="true" src="'+videoUrl+'" frameborder="0"></iframe></p>')
				}
				if(videoUrl!=""&&this.imageType=="quill1"){
					$("#quill1 .ql-editor").append('<p><iframe class="ql-video" allowfullscreen="true" src="'+videoUrl+'" frameborder="0"></iframe></p>')
				}
	    		this.dialogVisibleVideo=false;
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
//							console.log(this.imageType)
							if(this.imageType=="quill"){
								$("#quill .ql-editor").append('<img src="'+msg[0].coverUrl+'"  />')
							}else{
								$("#quill1 .ql-editor").append('<img src="'+msg[0].coverUrl+'"  />')
							}
						}
						this.dialogVisiblePic = false;
					})
					.catch()
			},
			handleSelectActivityDate(str) {
				if(str == '长期') {
					this.form.activityDate.short = [];
				}
			},
			// tab选项卡
			handleClick() {

			},
			// 会员奖励规则
			handleRuleSet(tab) {
//				console.log(JSON.stringify(this.form));
				if(this.form.activityDate.value!="长期"&&this.form.activityDate.short.length==0){
					this.$message.warning('请选择活动时间！');
					return false;
				}
				sessionStorage.setItem("inviteGiftAdd",JSON.stringify(this.form));
				// 修改
				if(this.getPageType == '修改') {
					// 邀请者
					if(tab == 'inviterAwardSet') {
						// console.log(this.form);
						this.$router.push({
							name: '页面设置邀请有礼设置会员奖励制度',
							params: {
								pageName: '页面设置邀请有礼新建活动',
								pageType: 'inviterAwardSet',
								readyFormData: JSON.stringify(this.form)
							},
							query: {
								time: +new Date()
							},
						});
						this.ruleType = 'inviterAwardSet';
					}
					// 被邀请者
					if(tab == 'invitedAwardSet') {
						this.$router.push({
							name: '页面设置邀请有礼设置会员奖励制度',
							params: {
								pageName: '页面设置邀请有礼新建活动',
								pageType: 'invitedAwardSet',
								readyFormData: JSON.stringify(this.form)
							},
							query: {
								time: +new Date()
							},
						});
						this.ruleType = 'invitedAwardSet';
					}
				} else {
					// 新增
					// 邀请者
					if(tab == 'inviterAwardSet') {
						this.$router.push({
							name: '页面设置邀请有礼设置会员奖励制度',
							params: {
								pageName: '页面设置邀请有礼新建活动',
								pageType: 'inviterAwardSet'
							},
							query: {
								time: +new Date()
							},
						});
						this.ruleType = 'inviterAwardSet';
					}
					// 被邀请者
					if(tab == 'invitedAwardSet') {
						this.$router.push({
							name: '页面设置邀请有礼设置会员奖励制度',
							params: {
								pageName: '页面设置邀请有礼新建活动',
								pageType: 'invitedAwardSet'
							},
							query: {
								time: +new Date()
							},
						});
						this.ruleType = 'invitedAwardSet';
					}
				}
			},
			// 富文本（邀请者）
			onEditorChange1(val) {
				this.form.inviteTab.inviterAwardSet.content = val.html;
				this.imgBoxInviter=val.html;
			},
			// 富文本（被邀请者）
			onEditorChange2(val) {
				this.form.inviteTab.invitedAwardSet.content = val.html;
				this.imgBoxInvited=val.html;
			},
			// 完成
			handleFinish() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.enterLoading=true;
						this.form.inviteTab.inviterAwardSet.ruleSet = JSON.parse(sessionStorage.getItem('inviterAwardSetRuleSet'));
						this.form.inviteTab.invitedAwardSet.ruleSet = JSON.parse(sessionStorage.getItem('invitedAwardSetRuleSet'));
						if(!this.form.id) {
							let params = {
								"userId": this.userInfo.userCode,
								"activityName": this.form.activityName, // 活动名称
								"activityDate": this.form.activityDate, // 活动时间
								"inviterAwardSet": this.form.inviteTab.inviterAwardSet, // 邀请者
								"invitedAwardSet": this.form.inviteTab.invitedAwardSet, // 被邀请者
							}
//							console.log(JSON.stringify(params), 'aaaa');return false;
							inviteGiftAdd(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									// console.log(data);
									this.enterLoading=false;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										sessionStorage.removeItem('invitedAwardSetRuleSet');
										sessionStorage.removeItem('invitedAwardSetRuleSet');
										this.$router.push({
											name: '邀请有礼'
										});
									} else {
										this.$message.warning(msg);
									}
								})
								.catch((err) => {
									this.enterLoading=false;
									// console.log(err);
								});
						} else {
							let params = {
								"userId": this.userInfo.userCode,
								"activityName": this.form.activityName, // 活动名称
								"activityDate": this.form.activityDate, // 活动时间
								"inviterAwardSet": this.form.inviteTab.inviterAwardSet, // 邀请者
								"invitedAwardSet": this.form.inviteTab.invitedAwardSet, // 被邀请者
								"id": this.form.id,
								"version": this.form.version
							}
							// console.log(params, 'bbbb');return false;
							inviteGiftEdit(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									// console.log(data);
									this.enterLoading=false;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										this.$router.push({
											name: '邀请有礼'
										});
									} else {
										this.$message.warning(msg);
									}
								})
								.catch((err) => {
									this.enterLoading=false;
									// console.log(err);
								});
						}
					}
				});
			}

		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.$refs);
			// console.log(this.getFormData);
			let that = this;
			let params = {
				userId: this.userInfo.userCode
			}
			customizeSelect(params)//品牌信息
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					if(code == 'SUCCESS') {
						this.headerSelect = msg.brandName;
					} else {
						this.$message.error(msg);
					}
				})
//			console.log(this.getPageType);
			if(this.getPageType == '新增') {
				sessionStorage.setItem('inviteGiftAdd', JSON.stringify(this.form))
			}
			// 规则设置返回按钮
			if(this.getPageType == '返回') {
				this.form = JSON.parse(sessionStorage.getItem('inviteGiftAdd'));
				if(this.getPageItem == 'inviterAwardSet') {
					that.inviterAwardSetRuleSet = JSON.parse(sessionStorage.getItem('inviterAwardSetRuleSet'));
					that.form.inviteTab.inviterAwardSet.ruleSet = JSON.parse(sessionStorage.getItem('inviterAwardSetRuleSet'));
				} else if(this.getPageItem == 'invitedAwardSet') {
					that.invitedAwardSetRuleSet = JSON.parse(sessionStorage.getItem('invitedAwardSetRuleSet'));
					that.form.inviteTab.invitedAwardSet.ruleSet = JSON.parse(sessionStorage.getItem('invitedAwardSetRuleSet'));
				}
			}
			// 规则设置保存和修改按钮
			if(this.getPageType == '设置会员奖励规则') {
				this.form = JSON.parse(sessionStorage.getItem('inviteGiftAdd'));
				if(this.getPageItem == 'inviterAwardSet') {
					that.form.inviteTab.inviterAwardSet.ruleSet = JSON.parse(sessionStorage.getItem('inviterAwardSetRuleSet'));
					sessionStorage.setItem('inviteGiftAdd', JSON.stringify(that.form));
				} else if(this.getPageItem == 'invitedAwardSet') {
					that.form.inviteTab.invitedAwardSet.ruleSet = JSON.parse(sessionStorage.getItem('invitedAwardSetRuleSet'));
					sessionStorage.setItem('inviteGiftAdd', JSON.stringify(that.form));
				}
				this.form = JSON.parse(sessionStorage.getItem('inviteGiftAdd'));
			}

			// 奖励规则表格页面修改按钮
			if(this.getPageType == '修改') {
				let form = JSON.parse(this.getFormData);
				this.form.id = form.id;
				this.form.version = form.version;
				this.form.activityName = form.activityName;
				this.form.activityDate = form.activityDate;
				if(JSON.stringify(form.inviterAwardSet.ruleSet) != '{}') {
					this.form.inviteTab.value = 'inviterAwardSet';
				} else {
					this.form.inviteTab.value = 'invitedAwardSet';
				}
				this.form.inviteTab.inviterAwardSet = form.inviterAwardSet;
				this.form.inviteTab.invitedAwardSet = form.invitedAwardSet;
				this.imgBoxInviter=form.inviterAwardSet.content;
				this.imgBoxInvited=form.invitedAwardSet.content;
				// 先清除原先的缓存 √
				sessionStorage.removeItem('inviteGiftAdd');
				sessionStorage.removeItem('inviterAwardSetRuleSet');
				sessionStorage.removeItem('invitedAwardSetRuleSet');
				// 设置新缓存
				sessionStorage.setItem('inviteGiftAdd', JSON.stringify(this.form));
				sessionStorage.setItem('inviterAwardSetRuleSet', JSON.stringify(form.inviterAwardSet.ruleSet));
				sessionStorage.setItem('invitedAwardSetRuleSet', JSON.stringify(form.invitedAwardSet.ruleSet));

			}
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"]),
			// 邀请者(inviterAwardSet)/被邀请者(invitedAwardSet)
			getPageItem() {
				let pageItem = this.$route.params.pageItem;
				// this.$route.params.pageItem = '';
				return pageItem;
			},
			// 页面类型
			getPageType() {
				let pageType = this.$route.params.pageType;
				// this.$route.params.pageType = '';
				return pageType;
			},
			// 会员奖励规则
			getFormData() {
				let formData = this.$route.params.formData;
				// this.$route.params.formData = '';
				return formData;
			},
			// 原页面缓存
			getReadyFormData() {
				let readyFormData = this.$route.params.readyFormData;
				// this.$route.params.readyFormData = '';
				return readyFormData;
			}
		},
		mounted() {
			var vm = this
			var imgHandler = async function(state) {
				if(state) {
					//button is clicked
					vm.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
				}
			}
			vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler);

			var imgHandler1 = async function(state) {
				if(state) {
					//button is clicked
					vm.$refs.uploadIpt1.dispatchEvent(new MouseEvent('click'));
				}
			}
			vm.$refs.newEditor1.quill.getModule("toolbar").addHandler("image", imgHandler1);
			var vm =this;
			//邀请者图片
		    var imgHandler = async function(state) {
			    if (state) {
			    	vm.imageType='quill';
		    		vm.dialogVisiblePic=true;
			    }
		    }
	    	//被邀请者图片
		    var imgHandler1 = async function(state) {
			    if (state) {
			    	vm.imageType='quill1';
		    		vm.dialogVisiblePic=true;
			    }
		    }
		    vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
		    vm.$refs.newEditor1.quill.getModule("toolbar").addHandler("image", imgHandler1)
			$(".ql-audio").click(function(){
				if(vm.form.inviteTab.value == 'inviterAwardSet'){
			    	vm.audioType='quill';
				}else{
			    	vm.audioType='quill1';
				}
				vm.dialogVisibleAudio=true;
			})
			
			$(".ql-videoLink").click(function(){
				if(vm.form.inviteTab.value == 'inviterAwardSet'){
			    	vm.videoType='quill';
		    		vm.dialogVisibleVideo=true;
		    		vm.$nextTick(function(){
		    			vm.$refs.groupMaterialListVideo.handleMaterialLibraryListShow();
		    		})
				}else{
			    	vm.videoType='quill1';
		    		vm.dialogVisibleVideo=true;
		    		vm.$nextTick(function(){
		    			vm.$refs.groupMaterialListVideo.handleMaterialLibraryListShow();
		    		})
				}
			})
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.dsh-button{
		background: #33b1e8;
		border-color: #33b1e8;
		color: #fff;    
		min-width: 104px;
	    padding: 0.45rem 0.75rem;
	    font-size: 0.7rem;
        display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    text-align: center;
		box-sizing: border-box;
		margin: 0;
		transition: .1s;
		font-weight: 500;
	}
	.el-form {
		//   display: inline-block;
		//   position: absolute;
		//   margin-left: rem(20px);
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
		background: #FFF;
		position: relative;
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
	
	.imgBox {
		width: 100%;
		padding: 0;
		h1{
			font-size: 2em;
			margin: 0;
		}
		.ql-align-center {
		    text-align: center;
		}
	}
	.imgBox p img{
		width: 100%;
	}
	img{
		width: 100%;
	}
	.buttonBoxPhone {
		width: 100%;
		position: absolute;
		bottom: -44px;
		background: #eee;
		.el-col {
			margin: 5px 0;
			text-align: center;
		}
		.el-button{
			cursor: auto;
		}
	}
	
	.btn-push {
		margin-top: 10px;
		width: 100%;
	}
	
	.sortable-ghost {
		opacity: .8;
		color: #fff!important;
		background: red!important;
	}
	
	.cleanElFormItem {
		display: inline-block;
		width: 35%;
		margin-bottom: 0;
	}
	
	// 活动时间
	.formActivityDate {
		.el-radio {
			display: block;
			margin-bottom: 10px;
			margin-left: 0;
		}
	}
	.main-box{
		height: 436px;
		background: #FFF;
	}
	// 上传图片
	/* 上传图片 */
	
	.bgImage {
		.el-col:last-child {
			height: 80px;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
		}
	}
	
	.space-around {
		margin-bottom: 10px;
	}
	
	.editBg {
		color: #009ee2;
		cursor: pointer;
	}
	
	.advice {
		color: #d2d2d2;
	}
	
	.icon-rank {
		font-size: 20px;
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
	.dsh-header{
		display: flex;
		justify-content: space-between;
	}
	.dsh-main{
		background: #FFF;
		padding: 10px;
	}
</style>