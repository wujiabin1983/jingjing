 // 门店活动 - 新建
<template>
	<el-container class="app-container">
		<el-main class="container-main" v-loading="this.formLoading">
			<el-row>
				<el-col :span="7" class="el-col-container">
					<el-header class="">
						创建活动
					</el-header>
					<el-main class="mobileMain">
						<article class="weui-article">
							<!-- 活动标题 -->
							<h1>{{ form.activityTitle }}&nbsp;</h1>
							<section>
								<section>
									<h3 v-if="getPageType == '修改'">{{ createDate }}&nbsp;</h3>
									<!-- 封面选择 -->
									<p class="list-image">
										<img :src="form.coverUrl" alt="">
									</p>
									<p>{{ form.summary }}</p>
								</section>
							</section>
						</article>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center">
						<span>创建活动内容</span>
					</el-header>
					<el-main>
						<el-form :model="form" ref="form" :rules="rules" label-width="120px" class="demo-form">
							<el-form-item label="标题" prop="activityTitle">
								<el-input placeholder="请输入标题" v-model="form.activityTitle" :maxlength="50" :disabled="formDisabled">
									<template slot="suffix">{{ titleNum + '/50' }}</template>
								</el-input>
							</el-form-item>
							<el-form-item label="封面选择" class="coverUrl" ref="coverUrl" prop="coverUrl">
								<el-row class="bgImage space-around" v-if="!formDisabled">
									<el-col :span="8" class="height100">
										<div class="icon-close" v-loading="imgLoading"  @click="clickTest">
											<img v-if="imageUrl" :src="imageUrl" class="avatar">
											<i v-else class="el-icon-plus avatar-uploader-icon"></i>
											<i v-if="imageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
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
									<el-col :span="15" :offset="1">
										<p class="advice">建议尺寸：900 * 500 像素</p>
									</el-col>
								</el-row>
								<div v-else>
									<el-input v-model="form.coverUrl" placeholder="从图片库中选择" :disabled="formDisabled"></el-input>
									<div class="form-item-msg">建议尺寸900*500</div>
								</div>
							</el-form-item>
							<el-form-item label="摘要">
								<el-input v-model="form.summary" placeholder="选填，不填将从正文中选取" :maxlength="120" :disabled="formDisabled">
									<template slot="suffix">{{ abstractNum + '/120' }}</template>
								</el-input>
							</el-form-item>
							<el-form-item label="选择门店" placeholder="请选择门店" prop="useStoreJson.key" :rules="[
								{ required: true, message: '请选择门店', trigger: 'change'  },
								{ max: 100, message: '最大长度不能超过100', trigger: 'change' }]">
								<el-input v-model="form.useStoreJson.key" :readonly="true" placeholder="请选择门店" class="store useStoreJsonKey"></el-input>
								<el-button type="primary" id="search" v-if="this.getPageType!='查看'" @click="searchStorePop">选择</el-button>
							</el-form-item>
							<el-form-item label="编辑正文" class="myTextEditorBox" prop="mianDesc">
								<el-input v-model="form.mianDesc" v-show=""></el-input>
								<quill-editor ref="newEditor" :options="editorOption" class="myTextEditor"  
									:content="content"
									@change="onEditorChange($event)">
								</quill-editor>
							</el-form-item>
						</el-form>
						<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpt1" @change="handleSelectImg1" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<el-dialog title="" :visible.sync="handleTabDialog" class="transfer">
							<template>
								<el-tabs v-model="activeName" @tab-click="handleClick">
									<el-tab-pane label="门店" name="first">
										<div class="search">
											<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
											</el-cascader>
											<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
											<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
										</div>
										<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
										</el-transfer>
									</el-tab-pane>
									<el-tab-pane label="店组" name="second">
										<div class="search">
											<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
											</el-cascader>
											<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
											<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
										</div>
										<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
										</el-transfer>
									</el-tab-pane>
									<!-- <el-tab-pane label="区域" name="third">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" :clearable=true @active-item-change="cascaderSelect" @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
					    </el-tab-pane> -->
								</el-tabs>
							</template>
							<div slot="footer" class="dialog-footer overHidden">
								<el-button @click="handleTabDialog = false">取 消</el-button>
								<el-button type="primary" @click="enterStore">确 定</el-button>
							</div>
						</el-dialog>
					</el-main>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="7">&nbsp;</el-col>
				<el-col :span="17" class="dsh-center marginTop10">
					<el-button type="primary" @click="handleSave">保存</el-button>
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
				<!-- 图片选择 -->
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
	import { mapGetters } from "vuex";
	// 引入富文本
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import groupMaterialListVideo from '@/views/WebRoot/mobile/component/groupMaterialListVideo' // 图片素材
	import groupMaterialListAudio from '@/views/WebRoot/mobile/component/groupMaterialListAudio' // 图片素材
	import { quillEditor } from 'vue-quill-editor'
	import { selectCouponLibrary } from '@/api/member/couponLibrary'
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import { selectAudioUse, selectLevalInfo, selectProCityArea, selectStoreData, selectTabData } from '@/api/public'
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片接口
	import Cookie from 'js-cookie'
	import { creatShopActivitiesData2, setShopActivitiesData2 } from '@/api/tool/shopActivities';
	export default {
		data() {
			return {
				dialogVisiblePic:false,
				dialogVisibleVideo:false,
				dialogVisibleAudio:false,
				imageType:'',
				audioUrl:'',
				videoUrl:'',
				checkedPic :[],
				form: {
					id: '',
					version: '',
					activityTitle: '', // 标题
					coverUrl: '', // 封面选择
					attribute1:'',//mediaId
					summary: '', // 摘要,
					useStoreJson: { // 使用门店（json格式字符串）
						key: '', // 门店/店组/区域
						value: '' // 门店ids/店组ids/区域ids
					},
					mianDesc: '' // 正文
				},
				formLoading:false,
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
				rules: {
					activityTitle : [
						{ required: true, message: '请输入标题', trigger: 'change'  },
						{ max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					],
					coverUrl: [
						{ required: true, message: '请选择封面', trigger: 'change'  },
						{ max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					],
					"useStoreJson.key": [
						{ required: true, message: '请选择门店', trigger: 'change'  },
						{ max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					],
					mianDesc:[
						{ required: true, message: '请输入正文', trigger: 'change'  },
					]
				},
				createDate: '', // 创建时间
				handleTabDialog: false,
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				handleTabDialog: false,
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				storeArr: '', //门店input容器
				tabType: '门店',

				formDisabled: false,

				titleNum: '0', // 输入字节数
				authorNum: '0',
				abstractNum: '0',

				items: [], // 富文本
				content: "", // 富文本
				activeName: 'first',
				imgLoading: false,
				dialogImageUrl: '', // 图片列表
				imageUrl:'',
				dialogVisible: false,
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
							if(this.imageType=="editor"){
								$(".ql-editor").append('<img src="'+msg[0].coverUrl+'"  />')
							}else{
								this.form.attribute1 = msg[0].mediaId; // 图片赋值
								this.form.coverUrl = msg[0].coverUrl; // 图片赋值
								this.imageUrl= msg[0].coverUrl;
							}
						}
						this.dialogVisiblePic = false;
					})
					.catch()
			},
			// form.activityTitle监听方法
			handleTitle(val, oldVal) {
				this.titleNum = val.length;
			},
			//form.author监听方法
			handleAuthor(val, oldVal) {
				this.authorNum = val.length;
			},
			//form.summary监听方法
			handleAbstract(val, oldVal) {
				this.abstractNum = val.length;
			},
			onEditorChange(evt) { // 富文本
				// console.log(evt);
				this.form.mianDesc = evt.html;
			},
			handleClick(tab, event) {
				// console.log(tab, event);
				if(tab.index == 0) {
				    this.form.linkAddress = ''; // 自定义链接清空
				}
				if(tab.index == 1) {
				    this.form.mianDesc = ''; // 正文清空
				}
			},
			handleCommand(command) { // 下拉菜单
				this.form.linkAddress = command;
			},
			handleSelectImg1(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
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
                            let value = msg.fileName;
//	                        console.log(msg.fileName);
	                        that.$refs.newEditor.quill.insertEmbed(that.$refs.newEditor.quill.getSelection().index, 'image', value)  
							that.$message.success('上传成功');
//	                        console.log(msg.fileName);
						})
						.catch((err) => {
							// console.log(err);
						})
				}
			},
			handleShowInfo(str) { // 显示卡片信息
				this.formDisabled = false;
				this.form = str;
				this.dialogImageUrl = str.coverUrl
			},
			// 正则提取中文
			GetChinese(strValue) {  
				if(this.form.summary==""){
					if(strValue!= null && strValue!= ""){  
						var reg = /[\u4e00-\u9fa5]/g;   
						if(reg.test(strValue)){
							return strValue.match(reg).join("").substr(0, 20) + '...';  
						}else {
							return "";  
						} 
					}else {
						return "";  
					} 
				}else{
					return "";  
				}
			},
			handleSave() { // 保存
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.formLoading=true;
						if(!this.form.id) {
							// 添加
							let that = this;
							if(this.form.summary == '') {
								this.form.summary = this.GetChinese(this.form.mianDesc)
							}
							let params = {
								"userId": this.userInfo.userCode,
								...this.form
							}
//							 console.log(params, 'params'); return false;
							creatShopActivitiesData2(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent,
										val = data.valueObj;
									this.formLoading=false;
									if(code == 'SUCCESS') {
										this.$message({
											message: msg,
											type: 'success',
											onClose() {
												that.$router.push({
													name: '门店活动'
												});
											}
										});
									} else {
										this.$message.warning(msg);
									}
								})
								.catch((err) => {
									this.$message.error('系统繁忙！请稍后重试！');
								});
						} else {
							// 修改
							let that = this;
							if(this.form.summary == '') {
								this.form.summary = this.GetChinese(this.form.mianDesc)
							}
							let params = {
								"userId": this.userInfo.userCode,
								...this.form,
								id: this.form.id,
								version: this.form.version
							}
//							console.log(params, 'params'); return false;
							setShopActivitiesData2(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent,
										val = data.valueObj;
									this.formLoading=false;
									if(code == 'SUCCESS') {
										this.$message({
											message: msg,
											type: 'success',
											onClose() {
												that.$router.push({
													name: '门店活动'
												});
											}
										});
									} else {
										this.$message.warning(msg);
									}
								});
							this.form.id = '';
							this.form.version = '';
						}
					} else {
						document.querySelector('.coverUrl .el-form-item__error').style.display = 'block';
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
								// console.log(msg.fileName)
								if(code == 'SUCCESS') {
									that.form.coverUrl = msg.fileName; // 图片赋值
									// that.form.coverUrl = e.target.result; // 图片回填 - 本地图片
									that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
									that.imageUrl = msg.fileName+'?x-oss-process=style/small';
									that.$message.success('上传成功');
									that.imgLoading = false;
									document.querySelector('.coverUrl .el-form-item__error').style.display = 'none';
								} else {
									that.$message({
										message: msg,
										type: 'warning'
									});
								}
							})
							.catch((err) => {
								// console.log(err);
							})
					}
				}
			},
			clickTest() {
				// 点击测试
//				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
				this.dialogVisiblePic=true;
				this.imageType="";
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.imageUrl = '';
				this.form.brandLogo = '';
				this.$refs.uploadIpt.value = '';
				this.form.coverUrl = '';
			},

			//监听tab页
			handleClick(tab, event) {
				this.tabType = event.target.firstChild.data;
				this.data2 = [];
				this.value2 = [];
				this.dataIndex = [];
				this.searchStoreTab();
			},
			//点击所属门店弹窗显示
			searchStorePop() {
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.optionsProCityAreaPop=[];
						data.forEach((val, index) => {
							if(val.label == "未知") {
								this.optionsProCityAreaPop.push({
									...val
								});
							} else {
								this.optionsProCityAreaPop.push({
									children: [],
									...val
								});
							}
						})
					})
					.catch((err) => {
						// console.log('err');        		
					})
//				this.searchStoreTab();
				this.handleTabDialog = true;
			},
			//监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				//				console.log(val)
				that.data2.forEach((data, index) => {
					val.forEach((value, ind) => {
						if(value == data.storeId) {
							idArray += data.storeId + ",";
							nameArray += data.storeName + ",";
						}
					})
				})
				this.storeName = nameArray.substr(0,nameArray.length-1);
				this.form.useStoreJson.key = nameArray.substr(0,nameArray.length-1);
				this.form.useStoreJson.value = idArray.substr(0,idArray.length-1);
				if(this.activeName=="first"){
					this.form.useStoreJson.type='门店';
				}else{
					this.form.useStoreJson.type='店组';
				}
//				console.log(JSON.stringify(this.form.useStoreJson))
			},
			//门店搜索（tab）
			searchStoreTab() {
				var params = {
					"userId": this.userInfo.userCode,
					"searchContent": this.searchContent,
					"provinceId": this.provinceId,
					"cityId": this.cityId,
					"areaId": this.areaId
				}
				// console.log(this.tabType);
				if(this.tabType == "门店") {
					params.flag = "1";
				}
				if(this.tabType == "店组") {
					params.flag = "2";
				}
				if(this.tabType == "区域") {
					params.flag = "3";
				}
				// console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(data)
						this.data2 = [];
						if(data != "") {
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
						}
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
						// console.log(err)   		
					})
				$("#transfer").show();
			},
			//监听父级选项动态加载省市区数据(弹窗内)
			cascaderSelect(val) {
				if(val.length == 1) {
					let proIndex = val[0];
					let parentId = this.optionsProCityAreaPop[proIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							this.optionsProCityAreaPop[proIndex].children = [];
							data.forEach((val, index) => {
								if(val.label == "未知") {
									this.optionsProCityAreaPop[proIndex].children.push({
										...val
									});
								} else {
									this.optionsProCityAreaPop[proIndex].children.push({
										children: [],
										...val
									});
								}
							})
							//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
						})
						.catch((err) => {
							// console.log('err');        		
						})
				}
				if(val.length == 2) {
					let proIndex = val[0];
					let cityIndex = val[1];
					let parentId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							let array = [];
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
							//				        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex].children[cityIndex].children))
						})
						.catch((err) => {
							// console.log('err');        		
						})
				}
			},
			//监听省市区返回值（弹窗）
			selectChange(val) {
				if(val.length == 0) {
					this.provinceId = '';
					this.cityId = '';
					this.areaId = '';
				}
				let proIndex = '';
				let cityIndex = '';
				let areaIndex = '';
				if(val.length == 1) {
					proIndex = val[0];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = '';
					this.areaId = '';
					let params = {
						parentId: this.provinceId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							this.optionsProCityAreaPop[proIndex].children = [];
							data.forEach((val, index) => {
								if(val.label == "未知") {
									this.optionsProCityAreaPop[proIndex].children.push({
										...val
									});
								} else {
									this.optionsProCityAreaPop[proIndex].children.push({
										children: [],
										...val
									});
								}
							})
						})
						.catch((err) => {
//							console.log(err);
						})
				}
				if(val.length == 2) {
					proIndex = val[0];
					cityIndex = val[1];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					this.areaId = '';
					let params = {
						parentId: this.cityId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							let array = [];
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
						})
						.catch((err) => {
//							console.log(err);
						})
				}
				if(val.length == 3) {
					proIndex = val[0];
					cityIndex = val[1];
					areaIndex = val[2];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					this.areaId = this.optionsProCityAreaPop[proIndex].children[cityIndex].children[areaIndex].key;
				}
			},
			//弹窗确认
			enterStore(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				this.dataIndex.forEach((val, index) => {
					idArray += that.data2[val].storeId + ",";
					nameArray += that.data2[val].storeName + ",";
					this.storeArr = nameArray;

				})
				// this.form.useStoreJson.key = nameArray;
				// this.form.useStoreJson.value = idArray;
				this.handleTabDialog = false;
			},
		},
		created() {
			let that = this;
			// 钩子函数 -- 初始化
			if(this.getPageType == '修改') {
				let data = JSON.parse(this.getFormData);
				this.form.id = data.id;
				this.form.version = data.version;
				this.form.activityTitle = data.activityTitle; // 标题
				this.dialogImageUrl = data.coverUrl; // 封面选择
				if(data.coverUrl!=""){
					this.imageUrl= data.coverUrl+'?x-oss-process=style/small'; // 封面选择
				}
				this.form.coverUrl = data.coverUrl; // 封面选择
				this.form.attribute1 = data.attribute1; // 封面选择
				this.form.summary = data.summary; // 摘要
				this.form.useStoreJson.key = data.useStoreJson.key; // 选择门店
				this.form.useStoreJson.value = data.useStoreJson.value; // 
				this.form.useStoreJson.type = data.useStoreJson.type; // 选择门店
				if(data.useStoreJson.type=="门店"){
					this.activeName=="first"
				}else{
					this.activeName=="second"
				}
				let nameArray = this.form.useStoreJson.key.split(",");
				let IdArray = this.form.useStoreJson.value.split(",");
				IdArray.forEach((value,index)=>{
					this.data2.push({
						index: index,
						storeName: '',
						storeId: value
					});
					this.value2.push(value);
				})
				nameArray.forEach((value,index)=>{
					this.data2[index].storeName=value;
				})
				this.storeArr = data.useStoreJson.key; // 选择门店
				this.form.mianDesc = data.mianDesc; // 编辑正文
				this.content = data.mianDesc; // 编辑正文
				this.createDate = data.createDate; // 创建时间
			}

		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
		},
		mounted() {
			let vm =this;
		    let imgHandler = async function(state) {
			    if (state) {
			    	vm.selectImage();
//					vm.$refs.uploadIpt1.dispatchEvent(new MouseEvent('click'));
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
			'form.activityTitle': {
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
	
	.el-input {
		width: 50%;
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
		justify-content: space-between;
	}
	
	.container-main .el-col.el-col-container {
		border: 1px solid #d2d2d2;
		font-size: 14px;
		background: #FFF;
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
		min-height: 470px;
	}
	
	.el-input-group__prepend {
		width: 2rem;
	}
	
	.mobileMain {
		position: relative;
		min-height: 470px;
		p {
			// text-indent: 10px;
			// margin: 10px;
		}
		.list-image {
			img {
				width: 100%;
				height:100%;
				border-radius: 5px;
			}
		}
	}
	/* 上传图片 */
	// 上传图片
	.icon-close {
		width:100%;
		position: relative;
		display: inline-block;
		.el-icon-circle-close {
			font-size: 14px; 
			position: absolute;
			top: -5px;
			left: 96%;
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
	
	.editBg {
		color: #009ee2;
		cursor: pointer;
	}
	
	.advice {
		color: #d2d2d2;
		margin-top: 80px;
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
		width:100%;
		height: 100px;
		line-height: 100px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width:100%;
		height: 100px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	/*添加标签*/
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
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.dsh-btn{
		width:80px;
		display: inline-block;
		color: #1992FF;
	}
	.demo-form{
		margin: 10px;
	}
	.height100{
		height: 100px;
	}
	.useStoreJsonKey{
		width: 270px;
	}
</style>