// 页面设置 - 激活手机
<template>
	<el-container class="app-container">
		<el-header>
			<h4>激活手机</h4>
		</el-header>
		<el-main class="container-main" v-loading="enterLoading">
			<el-row>
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{ headerSelect }}</div>
					</el-header>
					<el-main class="app-container main-mobile">
						<div class="main-mobile-container">
							<div class="weui-cells__title">必填信息</div>
							<div class="weui-cells weui-cells_form" @click="groupPage = '列表'">
								<div class="weui-cell" v-for="item in tableDataCopy" :key="item.index" v-show="item.isRequired">
									<div class="weui-cell__hd"><label class="weui-label">{{ item.name }}</label></div>
									<div class="weui-cell__bd">
										<input class="weui-input" :placeholder="`请输入${ item.name }`" />
									</div>
								</div>
							</div>
							<div class="weui-cells__title">选填信息</div>
							<div class="weui-cells weui-cells_form" @click="groupPage = '列表'">
								<div class="weui-cell" v-for="item in tableDataCopy" :key="item.index" v-show="!item.isRequired">
									<div class="weui-cell__hd"><label class="weui-label">{{ item.name }}</label></div>
									<div class="weui-cell__bd">
										<input class="weui-input" :placeholder="`请输入${ item.name }`" />
									</div>
								</div>
							</div>
							<el-button type="primary" class="btn-push">提交</el-button>
						</div>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>编辑激活手机内容</span>
					</el-header>
					<el-main>
						<el-form :model="form" ref="form" label-width="90px" class="demo-form">
							<div v-show="groupPage == '列表'">
								<h6 class="space-around">编辑资料</h6>
								<el-table :data="tableData" class="sortBox dsh-table" border v-loading="tableLoading">
									<el-table-column prop="name" label="导航名称"></el-table-column>
									<el-table-column prop="name" label="是否必填">
										<template slot-scope="scope">
											<el-checkbox v-model="scope.row.isRequired" @change="handleCheckboxChange(scope.$index, scope.row)" :disabled="scope.row.disabled">必填</el-checkbox>
										</template>
									</el-table-column>
								</el-table>
								<h6 class="space-around space-top">用户协议</h6>
								<quill-editor ref="newEditor" :content="content2" :options="editorOption2" @change="onEditorChange2($event)">
								</quill-editor>
							</div>
						</el-form>
					</el-main>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8" class="el-col-button"></el-col>
				<el-col :span="16" class="el-col-button">
					<el-button type="primary" @click="handlePush" v-if="roleBtn.submitActivateSetInfo">发布</el-button>
				</el-col>
			</el-row>
		</el-main>
		<el-dialog title="" :visible.sync="dialogTableVisible">
			<el-table :data="extendFieldData">
				<el-table-column property="" width="40">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.checked"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column property="name" label="字段名称" width="200"></el-table-column>
				<el-table-column property="type" label="字段类型"></el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleTableDataAddBtn">确 定</el-button>
            </span>
		</el-dialog>
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
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片接口
	import Cookie from 'js-cookie'
	import { activePhoneShow, activePhoneEdit } from "@/api/mobile/activePhone";
	import { mapGetters } from "vuex";
	import Sortable from 'sortablejs' // 排序
	import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import groupMaterialListVideo from '@/views/WebRoot/mobile/component/groupMaterialListVideo' // 图片素材
	import groupMaterialListAudio from '@/views/WebRoot/mobile/component/groupMaterialListAudio' // 图片素材
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import { quillEditor } from 'vue-quill-editor'
	// import activePhoneSortable from '@/views/WebRoot/mobile/component/activePhoneSortable'
	let allTableData = {
		'手机号': '输入框',
		'性别': '单选项',
		'姓名': '输入框',
		'生日': '选择框',
		'身份证': '输入框',
		'邮箱': '输入框',
		'详细地址': '输入框',
		// '教育背景': '下拉列表'
	};
	export default {
		data() {
			return {
				dialogVisiblePic:false,
				dialogVisibleVideo:false,
				dialogVisibleAudio:false,
				imageType:'',
				videoUrl:'',
				audioUrl:'',
				checkedPic :[],
				enterLoading:false,
				roleBtn: {
					selectActivateSetInfo: false,
					submitActivateSetInfo: false
				},
				// 数据
				// 上传图片
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_827.action', // 上传图片路径

				groupPage: '列表',
				headerSelect: "",
				headerSelectItems: [{
					value: "双皮奶",
					label: "双皮奶"
				}],
				form: {
					"title": "",
					"bgUrl": "",
					"remarks": []
				},

				// items: [], // 富文本
				// content: "", // 富文本
				// editorOption: {},

				items2: [], // 富文本
				content2: "", // 富文本
				editorOption2: {
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

				tableLoading: false,
				// 表格
				tableData: [
//				{
//						"name": "手机号", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_MOBILE", // 编码
//						"isRequired": true, // 是否必填
//						'disabled': true
//					},
//					{
//						"name": "性别", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_SEX", // 编码
//						"isRequired": true, // 是否必填
//						'disabled': false
//					},
//					{
//						"name": "姓名", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_NAME", // 编码
//						"isRequired": true, // 是否必填
//						'disabled': false
//					},
//					{
//						"name": "生日", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_BIRTHDAY", // 编码
//						"isRequired": true, // 是否必填
//						'disabled': false
//					},
//					{
//						"name": "身份证", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_IDCARD", // 编码
//						"isRequired": true, // 是否必填
//						'disabled': false
//					},
//					{
//						"name": "邮箱", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_EMAIL", // 编码
//						"isRequired": false, // 是否必填
//						'disabled': false
//					},
//					{
//						"name": "详细地址", // 字段名称
//						"key": "USER_FORM_INFO_FLAG_LOCATION", // 编码
//						"isRequired": false, // 是否必填
//						'disabled': false
//					},
					// {
					// 	"name": "教育背景", // 字段名称
					// 	"key": "USER_FORM_INFO_FLAG_EDUCATION_BACKGRO", // 编码
					// 	"isRequired": false, // 是否必填
					// 	'disabled': false
					// }
				],
				tableDataCopy: [],
				// 拖拽排序对象
				sortable: null,
				// 添加导航
				dialogTableVisible: false,
				// 添加导航数据
				extendFieldData: [
//					 {
//					     checked: true,
//					     name: '姓名',
//					     type: '输入框'
//					 },
//					 {
//					     checked: false,
//					     name: '性别',
//					     type: '单选项'
//					 },
//					 {
//					     checked: false,
//					     name: '手机号',
//					     type: '输入框'
//					 },
//					 {
//					     checked: false,
//					     name: '邮箱',
//					     type: '输入框'
//					 },
//					 {
//					     checked: false,
//					     name: '地址',
//					     type: '下拉列表'
//					 },
//					 {
//					     checked: false,
//					     name: '年龄',
//					     type: '下拉选项'
//					 },
				],
				checkedData: [
					
				],

			};
		},
		components: {
			quillEditor,
			groupMaterialListPic,
			groupMaterialListVideo,
			groupMaterialListAudio
		},
		methods: {
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
			onEditorChange(event) {
				this.form.remarks[0] = event.html;
			},
			onEditorChange2(event) {
				this.form.remarks[1] = event.html;
			},
			// 方法
			showTable() {
				let params = {
					"userId": this.userInfo.userCode
				}
				activePhoneShow(params)
					.then((res) => {
						let datas = JSON.parse(Base64.decode(res.data)),
							code = datas.count,
							msg = datas.data;
//						console.log(JSON.stringify(msg)+"?");
						if(msg.length==0){
							this.tableData=[
								{
										"index":0,
										"name": "手机号", // 字段名称
										"key": "USER_FORM_INFO_FLAG_MOBILE", // 编码
										"isRequired": true, // 是否必填
										'disabled': true
									},
									{
										"index":1,
										"name": "性别", // 字段名称
										"key": "USER_FORM_INFO_FLAG_SEX", // 编码
										"isRequired": true, // 是否必填
										'disabled': false
									},
									{
										"index":2,
										"name": "姓名", // 字段名称
										"key": "USER_FORM_INFO_FLAG_NAME", // 编码
										"isRequired": true, // 是否必填
										'disabled': false
									},
									{
										"index":3,
										"name": "生日", // 字段名称
										"key": "USER_FORM_INFO_FLAG_BIRTHDAY", // 编码
										"isRequired": true, // 是否必填
										'disabled': false
									},
									{
										"index":4,
										"name": "身份证", // 字段名称
										"key": "USER_FORM_INFO_FLAG_IDCARD", // 编码
										"isRequired": true, // 是否必填
										'disabled': false
									},
									{
										"index":5,
										"name": "邮箱", // 字段名称
										"key": "USER_FORM_INFO_FLAG_EMAIL", // 编码
										"isRequired": false, // 是否必填
										'disabled': false
									},
									{
										"index":6,
										"name": "详细地址", // 字段名称
										"key": "USER_FORM_INFO_FLAG_LOCATION", // 编码
										"isRequired": false, // 是否必填
										'disabled': false
									}
								]
						}
						this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData));
						let data = [];
						msg[0].activateOption.forEach((val, index) => {
							if(val.isRequired == '是') {
								this.checkedData.push( {
									name: val.name,
									index: index
								});
							}
							data.push({
								"index":index,
								"name": val.name,
            					"disabled":val.disabled,
								key: val.key,
								isRequired: val.isRequired == '是' ? true : false
							});
						});
						this.content2 = msg[0].remarks;
						this.tableData = data;
						this.tableDataCopy = JSON.parse(JSON.stringify(data));
//						console.log(JSON.stringify(this.tableDataCopy));
						if(this.checkedData.length > 4) {
							this.tableData.forEach((val, index) => {
								val.disabled = true;
							});
							this.checkedData.forEach((val, index) => {
								if(val.name == '手机号') {
									this.tableData[val.index].disabled = true;
								}else {
									this.tableData[val.index].disabled = false;
								}
							});
						} else {
							this.tableData.forEach((val, index) => {
								if(val.name == '手机号') {
									val.disabled = true;
								}else {
									val.disabled = false;
								}
							});
						}
					})
					.catch((err) => {
//						console.log(err);
					});
			},
			// 发布
			handlePush() {
				this.enterLoading=true;
				let data = [];
				this.tableDataCopy.forEach((val, index) => {
					data.push({
						name: val.name,
						disabled: val.disabled,
						key: val.key,
						isRequired: val.isRequired ? '是' : '否'
					});
				});
				let params = {
					"userId": this.userInfo.userCode,
					"activateSet": {
						...this.form
					},
					"activateOption": [ // 激活验证项设置（json字符创）
						...data
					]
				}
				params.activateSet.remarks = this.form.remarks[1];
//             	console.log(params);
               	activePhoneEdit(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// count = data.count,
						// msg = data.data;
						this.enterLoading=false;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
//							this.showTable();
						} else {
							this.$message.warning(msg);
						}
					})
					.catch((err) => {
						this.enterLoading=false;
//						 console.log(err);
					});
			},
			handleCheckboxChange(index, row) {
				// this.checkedData = [];
				// console.log(this.checkedData);return false;
				if(row.isRequired) {
					this.checkedData.push({
						name: row.name,
						index: index
					});
				}
				if(!row.isRequired) {
					let i = '';
					this.checkedData.forEach((val, index) => {
						if(val.name == row.name) {
							i = index
						}
					});
					this.checkedData.splice(i, 1);
				}
				// 是否必填是否可以点击
				if(this.checkedData.length > 4) {
					this.tableData.forEach((val, index) => {
						val.disabled = true;
					});
					this.checkedData.forEach((val, index) => {
						if(val.name == '手机号') {
							this.tableData[val.index].disabled = true;
						}else {
							this.tableData[val.index].disabled = false;
						}
					});
				} else {
					this.tableData.forEach((val, index) => {
						if(val.name == '手机号') {
							val.disabled = true;
						}else {
							val.disabled = false;
						}
					});
				}
				this.tableDataCopy[index].isRequired = row.isRequired;
			},
			// 添加导航名称
			handleTableDataAdd() {
				this.dialogTableVisible = true;
				// this.tableData.push();
			},
			// 添加导航菜单
			handleTableDataAddBtn() {
				this.dialogTableVisible = false;
				let extendFieldData = this.extendFieldData;
				let checkedObj = [];
				let checkedName = [];
				extendFieldData.forEach((val, index) => {
					if(val.checked) {
						this.tableData.push({
							name: val.name,
							isRequired: false
						});
						checkedName.push(val.name);
						// this.extendFieldData.splice(index, 1);
					}
					this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData));
				});
				checkedName.forEach((val, index) => {
					extendFieldData.forEach((subVal, subIndex) => {
						if(val == subVal.name) {
							extendFieldData.splice(subIndex, 1);
						}
					});
				});
			},
			// 删除导航菜单那
			iconShanchu(index, row) {
				//          console.log(row);
				this.tableData.splice(index, 1);
				this.extendFieldData.push({
					checked: false,
					name: row.name,
					type: allTableData[row.name]
				});
				this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData));
			},
			// 排序
			setSort() { // 排序
				const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
				this.sortable = Sortable.create(el, {
					// ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
					setData: function(dataTransfer) {
						dataTransfer.setData('Text', '')
						// to avoid Firefox bug
						// Detail see : https://github.com/RubaXa/Sortable/issues/1012
					},
					onEnd: evt => {
						// this.sortOldIndex = evt.oldIndex;
						// this.sortNewIndex = evt.newIndex;
						let targetRow = this.tableDataCopy.splice(evt.oldIndex, 1)[0];
						this.tableDataCopy.splice(evt.newIndex, 0, targetRow);
					}
				});
			},
			// 上传图片
			clickTest() {
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
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			// this.handleTableDataShow(); // 显示表格
			this.showTable();
			let that = this;
			this.$nextTick(() => {
				this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData));
				this.setSort(); // 拖拽排序
			});

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
	.el-main{
		padding: 10px;
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
	.dsh-header{
		display: flex;
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
		// height: 440px;
	}

	.imgBox {
		width: 100%;
		height: 150px;
		padding: 5px;
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
		span {
			font-size: rem(12px);
			font-weight: normal;
			margin-left: 10px;
		}
	}

	.space-top {
		margin-top: 40px;
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
		cursor: pointer;
	}

	.avatar {
		display: block;
		width: 160px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}

	.avatar:hover {
		border-color: #409EFF;
	}

	.main-mobile {
		position: relative;
		.main-mobile-container {
			margin: 0 10px;
		}
	}
	.weui-cell {
		font-size: 12px;
	}
	.dsh-table{
		width: 60%;
		position: relative;
		z-index: 10;
	}
</style>
