<!-- 自动回复 -->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-loading="enterLoading">
				<div class="setStore">
					<span>按门店配置</span>
					<el-switch v-model="formType" @change="handleSwitchChange" active-value="是" inactive-value="否"></el-switch>
				</div>
				<el-row>
					<el-col :span="12" class="borderRight">
						<div class="img-yxy">
							<el-radio-group v-model="form.messageType" size="small" @change="handleContentType">
								<el-radio label="图文" border><i class="el-icon-document"></i>图文</el-radio>
								<el-radio label="图片" border><i class="el-icon-picture-outline"></i>图片</el-radio>
								<el-radio label="文字" border><i class="el-icon-edit-outline"></i>文字</el-radio>
							</el-radio-group>
						</div>
						<main>
							<el-card class="select-card" v-show="(form.messageType == '图文' || form.messageType == '图片') && isShow">
								<div @click="handleSCK">
									<i class="el-icon-plus"></i>
									<p>从素材库中选择</p>
								</div>
								<!--<div @click="handleZJTW">
									<i class="el-icon-edit-outline"></i>
									<p>自建图文</p>
								</div>-->
							</el-card>
							<el-card class="" v-show="(form.messageType == '图文' || form.messageType == '图片') && !isShow && materialVisible">
								<el-button @click="handleBack">返回</el-button>
								<div class="overHidden" v-show="form.messageType == '图文'">
									<div class="component" v-for="(item, index) in checked" :key="items.id">
										<groupMaterialListShow :childDataLists="item" ref="groupMaterialListShow" class="groupMaterialList"></groupMaterialListShow>
									</div>
								</div>
								<div class="overHidden" v-show="form.messageType == '图片'">
									<el-card class="graphicCard">
										<div class="imgBox">
											<img :src="matterData.coverUrl" alt="">
										</div>
										<div class="cardInfo">
											<div>{{ matterData.title }}</div>
											<span>{{ matterData.updateDate }}</span>
										</div>
									</el-card>
								</div>
							</el-card>
							<el-card class="" v-show="(form.messageType == '图文' || form.messageType == '图片') && !isShow && editorQuillVisible">
								<el-button @click="handleBack">返回</el-button>
								<quill-editor ref="newEditor" class="myTextEditor"  
									:content="content"
									:options="editorOption"
									@change="onEditorChange($event)">
								</quill-editor>
							</el-card>
							<div v-show="form.messageType == '文字'">
								<el-input type="textarea" :rows="9" resize="none" v-model="form.messageContent.text"></el-input>
							</div>
							<el-dialog width="80%" :visible.sync="dialogVisible">
								<!-- 素材选择 -->
								<groupMaterialList v-show="dialogVisible" @parentMasterId="handleMasterId" ref="groupMaterialList"></groupMaterialList>
								<span slot="footer" class="dialog-footer">
									<el-button @click="dialogVisible = false">取 消</el-button>
									<el-button type="primary" @click="handleDialogSure">确 定</el-button>
								</span>
							</el-dialog>
							<el-dialog width="80%" :visible.sync="dialogVisiblePic">
								<!-- 图片选择 -->
								<!-- <div>dsaf</div> -->
								<groupMaterialListPic v-show="dialogVisiblePic" @handleChecked="handleChecked"></groupMaterialListPic>
								<!-- <groupMaterialList @parentMasterId="handleMasterId" ref="groupMaterialList"></groupMaterialList> -->
								<span slot="footer" class="dialog-footer">
									<el-button @click="dialogVisiblePic = false">取 消</el-button>
									<el-button type="primary" @click="handleDialogSurePic">确 定</el-button>
								</span>
							</el-dialog>
						</main>
						<!-- <el-card class="" v-show="form.messageType == '文字'"> -->
						<!-- </el-card> -->
						
					</el-col>
					<el-col :span="12">
						<el-form :model="form" ref="form" label-width="90px" class="demo-form">
							<el-form-item label="品牌">
								<el-input v-model="formBrandName" placeholder="请输入品牌" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="门店" v-show="formType == '是'">
								<el-input v-model="formStoreIdList" :readonly="true" placeholder="请选择" class="dsh-input"></el-input>
								<el-button type="primary"  @click="storeClick" class="">选择</el-button>
							</el-form-item>
							<el-form-item label="回复类型">
								<el-radio-group v-model="form.reaplyType" class="radio-block">
									<el-radio label="自动回复"></el-radio>
									<el-radio label="关注回复"></el-radio>
									<el-radio label="关键字回复"></el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="关键字" v-show="form.reaplyType == '关键字回复'">
								<el-input v-model="form.keyWord" placeholder="逗号间隔"></el-input>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="el-footer-btn-con marginTop10">
						<el-button type="primary" @click="handleAdd" v-show="!form.id && roleBtn.addAutoReplySetMasterInfo">添加</el-button>
						<el-button type="primary" @click="handleAdd"  v-show="form.id && roleBtn.updateAutoReplySetMasterInfo">修改</el-button>
						<el-button @click="handleCancel">取消</el-button>
					</el-col>
				</el-row>
			</el-card>
			<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
				<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
				<input type="submit" value="上传" ref="uploadSubmit" />
			</form>
			<el-dialog title="" :visible.sync="handleTabDialog" class="transfer" append-to-body>
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
					<el-tab-pane label="区域" name="third">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
				</el-tabs>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-header>
		<el-main>
			<h6 class="mrgBottom10">默认配置</h6>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange" v-loading="tableLoading" highlight-current-row>
					<!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="brandName" label="品牌"></el-table-column>
					<el-table-column prop="reaplyType" label="回复类型"></el-table-column>
					<el-table-column prop="messageType" label="回复内容类型"></el-table-column>
					<el-table-column prop="messageTypeContent" label="回复内容"></el-table-column>
					<el-table-column prop="keyWord" label="关键字"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-show="!scope.row.isEdit && roleBtn.updateAutoReplySetMasterInfo">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-show="roleBtn.deleteAutoReplySetMasterInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- <el-tooltip class="item" content="删除" placement="top" v-show="scope.row.activityStatus == '暂存'||scope.row.activityStatus == '未通过'">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconDelete(scope.$index, scope.row)" />
							</el-tooltip> -->
						</template>
					</el-table-column>
				</el-table>
				<el-footer v-show="count != 0">
					<el-pagination 
						background 
						class="pagination" 
						layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" 
						:page-size="limit"
						:total="count" 
						@current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>

			<h6 class="mrgBottom10">按店配置</h6>
			<el-card>
				<el-table ref="tableData1" :data="tableData1" @selection-change="handleSelectionChange" v-loading="tableLoading1" highlight-current-row>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="brandName" label="品牌"></el-table-column>
					<el-table-column prop="reaplyType" label="回复类型"></el-table-column>
					<el-table-column prop="messageType" label="回复内容类型"></el-table-column>
					<el-table-column prop="messageTypeContent" label="回复内容"></el-table-column>
					<el-table-column prop="keyWord" label="关键字"></el-table-column>
					<el-table-column prop="relationName" label="门店"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-show="!scope.row.isEdit && roleBtn.updateAutoReplySetMasterInfo">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-show="roleBtn.deleteAutoReplySetMasterInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- <el-tooltip class="item" content="删除" placement="top" v-show="scope.row.activityStatus == '暂存'||scope.row.activityStatus == '未通过'">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconDelete(scope.$index, scope.row)" />
							</el-tooltip> -->
						</template>
					</el-table-column>
				</el-table>
				<el-footer v-show="count1 != 0">
					<el-pagination 
						background 
						class="pagination" 
						layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange1" 
						:page-size="limit"
						:total="count" 
						@current-change="handleCurrentChange1">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片
	import Cookie from 'js-cookie'
	import groupMaterialList from '@/views/WebRoot/mobile/component/groupMaterialList' // 图文素材
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import { selectAutoRespond, addAutoRespond, editAutoRespond, deleteAutoRespond } from '@/api/mobile/autoRespond'
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import groupMaterialListShow from '@/views/WebRoot/mobile/component/groupMaterialListShow'

	import { selectProCityArea, selectRoleData, selectTabData, getBrandInfo } from '@/api/public'
	import { selectInfo } from '@/api/mobile/groupMsgMaster'
	import { quillEditor } from 'vue-quill-editor'
	export default {
		data() {
			return {
				enterLoading:false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				// 权限
				roleBtn: {
					selectAutoReplySetMasterInfo: false,
					addAutoReplySetMasterInfo: false,
					updateAutoReplySetMasterInfo: false,
					deleteAutoReplySetMasterInfo: false
				},
				tableLoading: false,
				tableLoading1: false,
				// 分页
				page: 1, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
				page1: 1, // 当前页
				count1: 0, // 总条数
				limit1: this.GLOBAL.limit, // 条/页
				formType: '否', // 是否按照门店配置
				formBrandName: '', // 品牌名称
				formStoreIdList: '', // 门店
				// 数据
				form: {
					id: '',
					version: '',
					"reaplyType": "自动回复", // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
					"messageType": "图文", // 消息类型（文本、图文、图片）
					"messageContent": {
						type: '', // 类型
						text: '', // 内容
						mediaId:''
					}, // 消息内容
					"keyWord": "", // 关键词
					"type" : "", // 门店/店群/店组
					"storeList" : [
						// {
						// 	"storeId" : "门店ID",
						// 	"storeName" : "门店名称"
						// }
					],
					// "storeIdList": "", // 门店编码
					// "storeGroupIdList": "", // 店组编码
					// "districtIdList": "", // 所属区域编码1

					// materialType: '', // (素材库, 自建图文)
				},
				id: '',
				version: '',
				isShow: true, // 是否显示（从素材库中选择，自建图文）
				// 图文
				dialogVisible: false,
				checked: [],
				materialVisible: false,
				// 图片
				dialogVisiblePic: false,
				checkedPic: [],

				editorQuillVisible: false,
				items: [], // 富文本
				content: "", // 富文本
				editorOption: {
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
                            ['link', 'image', 'formula']//去除video即可
                        ]
                    },
				},

				multipleSelection: [],
				tableData: [
					// {
					// 	"brandName": "", // 品牌名称
					// 	"reaplyType": "", // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
					// 	"messageType": "图文", // 消息类型（文本、图文、图片）
					// 	"keyWord": "", // 关键词
					// }
				],
				tableData1: [
					// {
					// 	"brandName": "", // 品牌名称
					// 	"reaplyType": "", // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
					// 	"messageType": "图文", // 消息类型（文本、图文、图片）
					// 	"keyWord": "", // 关键词
					// }
				],

				// 穿梭框
				handleTabDialog: false,
				storeArr: '',
				tabType: '门店',
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				activeName: 'first',

				// 图片素材显示
				matterData: {
					coverUrl: '',
					title: '',
					updateDate: ''
				}
			}
		},
		props: ['childData'],
		components: {
			quillEditor, // 富文本
			groupMaterialList,
			groupMaterialListPic,
			groupMaterialListShow
		},
		methods: {
			// 图片选择
			handleChecked(str) {
				this.checkedPic[0] = str.id;
				this.form.messageContent.mediaId=str.mediaId
			},
			// 素材库
			handleSCK() {
				// this.form.materialType = '素材库';
				this.form.messageContent.type = '素材库';
				if(this.form.messageType == '图文') {
					this.dialogVisible = true;
				}else {
					this.dialogVisiblePic = true;
				}
			},
			// 自建图文
			handleZJTW() {
				this.form.messageContent.type = '自建图文';
				// this.form.materialType = '自建图文'
				this.isShow = false;
				this.editorQuillVisible = true;

				var vm =this
				var imgHandler = async function(state) {
					if (state) {
						vm.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
					}
				}
				vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
			},
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				//判断file的类型是不是图片类型。 
				if(!/image\/\w+/.test(files.type)) {
					this.$message("请上传一张图片");
					return false;
				}
				var reader = new FileReader();
				reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件 
				//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片 
				reader.onload = function(e) {
					let formData = new FormData(); // 可以增加表单数据
					formData.append("file", files); // 文件对象
					uploadImg(formData)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
                            let value = msg.fileName;
	                        that.$refs.newEditor.quill.insertEmbed(that.$refs.newEditor.quill.getSelection().index, 'image', value)  
							that.$message.success('上传成功');
//	                        console.log(msg.fileName);
						})
						.catch((err) => {
							// console.log(err);
						})
				}
			},
			// 取消
			handleCancel() {
				this.form = {
					id: '',
					version: '',
					"reaplyType": "", // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
					"messageType": "图文", // 消息类型（文本、图文、图片）
					"messageContent": {
						type: '',
						text: ''	
					}, // 消息内容
					"keyWord": "", // 关键词
					"type" : "", // 门店/店群/店组
					"storeList" : [
						// {
						// 	"storeId" : "门店ID",
						// 	"storeName" : "门店名称"
						// }
					],
					// "storeIdList": "", // 门店编码
					// "storeGroupIdList": "", // 店组编码
					// "districtIdList": "", // 所属区域编码1

					// materialType: '', // (素材库, 自建图文)
				};
				this.content = '';
			},
			// 添加
			handleAdd() {
				let that = this;
				if(!this.form.id) {
					// 添加
					let params = {
						"userId": this.userInfo.userCode,
						...this.form
					}
					if(params.messageContent.text==""){
						this.$message.warning('回复内容不能为空！');
						return false;
					}
					delete params.id; // 去掉id和version
					delete params.version; // 去掉id和version
//					console.log(JSON.stringify(params), '添加');
//					return false;
					this.enterLoading=true;
					addAutoRespond(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent,
								val = data.valueObj;
							this.enterLoading=false;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.form= {
									id: '',
									version: '',
									"reaplyType": "自动回复", // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
									"messageType": "图文", // 消息类型（文本、图文、图片）
									"messageContent": {
										type: '', // 类型
										text: '', // 内容
										mediaId:''
									}, // 消息内容
									"keyWord": "", // 关键词
									"type" : "", // 门店/店群/店组
									"storeList" : [
										// {
										// 	"storeId" : "门店ID",
										// 	"storeName" : "门店名称"
										// }
									],
									// "storeIdList": "", // 门店编码
									// "storeGroupIdList": "", // 店组编码
									// "districtIdList": "", // 所属区域编码1
				
									// materialType: '', // (素材库, 自建图文)
								};
								this.form.messageContent = {
									type: '',
									text: ''
								}
								this.content = '';
								this.isShow = true;
								this.materialVisible = this.editorQuillVisible = false;
								this.showTable(this.page, this.limit); 
							}else {
								this.$message.warning(msg);
							}
						})
						.catch((err) => {
							// this.$message.warning('系统繁忙！请稍后重试！');
						});
				}else {
					// 修改
					let params = {
						"userId": this.userInfo.userCode,
						...this.form
					}
					if(params.messageContent.text==""){
						this.$message.warning('回复内容不能为空！');
						return false;
					}
//					console.log(params); return false;
					this.enterLoading=true;
					editAutoRespond(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent,
								val = data.valueObj;
							this.enterLoading=false;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.showTable(this.page, this.limit); 
							}else {
								this.$message.warning(msg);
							}
						})
						.catch((err) => {
							// this.$message.warning('系统繁忙！请稍后重试！');
						});
					this.form.id = '';
					this.form.version = '';
				}
			},
			// 图标 - 修改
			iconXiugai(index, row) { 
				$('html,body').animate({scrollTop: '0px'}, 800);
				let that = this;
				this.isShow = true;
				this.form = {
						id: '',
						version: '',
						"reaplyType": "", // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
						"messageType": "图文", // 消息类型（文本、图文、图片）
						"messageContent": {
							type: '', // 类型
							text: '', // 内容
							mediaId:''
						}, // 消息内容
						"keyWord": "", // 关键词
						"type" : "", // 门店/店群/店组
						"storeList" : [
							// {
							// 	"storeId" : "门店ID",
							// 	"storeName" : "门店名称"
							// }
						],
						// "storeIdList": "", // 门店编码
						// "storeGroupIdList": "", // 店组编码
						// "districtIdList": "", // 所属区域编码1

						// materialType: '', // (素材库, 自建图文)
					},
				this.form.id = row.id;
				this.form.version = row.version;
				this.formType = row.isOpen; // 是否按门店配置
				// this.form.brandId = row.brandId; // 品牌编码
				// this.form.brandName = row.brandName; // 品牌名称
				this.form.reaplyType = row.reaplyType; // 回复类型（被关注自动回复、消息自动回复、关键词自动回复）
				this.form.messageType = row.messageType; // 消息类型（文本、图文、图片）
				this.form.messageContent.type = row.messageContent.type;
				this.form.messageContent.text = row.messageContent.text; // 
				this.form.messageContent.mediaId = row.messageContent.mediaId; // 消息内容
				this.form.keyWord = row.keyWord; // 关键词
				this.form.storeList = row.storeList == '' ? [] : row.storeList;
				this.content = '';

				if(row.storeList.length > 0) {
					let formStoreNameList = '';
					this.data2=[];
					this.value2=[];
					row.storeList.forEach((val,index) => {
						formStoreNameList += val.storeName + ',';
						this.data2.push({
							index:index,
							storeName:val.storeName,
							storeId:val.storeId
						})
						this.value2.push(val.storeId);
					});
					this.formStoreIdList = formStoreNameList.substr(0,formStoreNameList.length-1); // 门店编码
					
				}
				this.$refs.tableData.setCurrentRow(row);
				
				/**
				 *  isShow
					dialogVisible
					materialVisible
					dialogVisiblePic
					editorQuillVisible
				 */
				if(row.messageType == '图文') {
					this.isShow = false;
					if(row.messageContent.type == '素材库') {
						this.materialVisible = true;
						this.editorQuillVisible = false;
						let selectParams = {
							userId: this.userInfo.userCode,
							id: row.messageContent.text
						}
						selectInfo(selectParams)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								// let params = {
								// 	"type": val.type, // 群发类型
								// 	"groupObject": val.groupObject,
								// 	"contentType": val.contentType, // 内容类型
								// 	"content": {
								// 		type: val.content.type,
								// 		txt: val.content.txt, // 消息内容
								// 	},
								// 	"executePlan": { // 执行发送计划（json字符创）
								// 		'isTimingSend': val.executePlan.isTimingSend, // 是否定时发送（是/否）
								// 		'sendTime': `${val.sendDate} ${val.sendTime}` // 发送时间
								// 	}
								// }
								let msg1 = [];
								msg1.push(msg);
								that.checked = [];
								that.checked.push(msg1);
								// that.form = info;
								// that.form.executePlan.sendTime = `${info.executePlan.sendTime[0]} ${info.executePlan.sendTime[1]}`
								// that.id = info.id;
								// that.version = info.version;
								// console.log(JSON.stringify(that.form), that.id, that.version, '查询到的数据');
							})
					}else if(row.messageContent.type == '自建图文') {
						this.materialVisible = false;
						this.editorQuillVisible = true;
						this.content = row.messageContent.text;
						this.form.messageContent.text = row.messageContent.text; // 消息内容
					}
				}else if(row.messageType == '图片') {
					this.isShow = false;
					if(row.messageContent.type == '素材库') {
						this.materialVisible = true;
						this.editorQuillVisible = false;
						
						let params = {
							userId: this.userInfo.userCode,
							id: row.messageContent.text
						}
						MaterialLibraryCardShow3(params)
							.then(res => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.count,
									msg = data.data;
//									console.log(JSON.stringify(data))
								if(code == 1) {
									this.matterData.coverUrl = msg[0].coverUrl;
									this.matterData.title = msg[0].title;
									this.matterData.updateDate = msg[0].createdOn.split(' ')[0];
								}
							})
							.catch()
					}else if(row.messageContent.type == '自建图文') {
						this.materialVisible = false;
						this.editorQuillVisible = true;
						this.content = row.messageContent.text;
						this.form.messageContent.text = row.messageContent.text; // 消息内容
					}
				} else {
//					console.log(row.messageContent.text, 'row.messageContent.textrow.messageContent.textrow.messageContent.textrow.messageContent.text')
					this.form.messageContent.text = row.messageContent.text; // 消息内容
				}
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				// let that = this;
				// let ids = row.id;
				// this.multipleSelection.forEach((val, index) => {
				// 	ids.push(val.id);
				// });
				let ids = [];
				ids.push(row.id);
				let params = {
					"userId": this.userInfo.userCode,
					"idList" : ids
				}
				// console.log(params, '删除');
				deleteAutoRespond(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent,
							val = data.valueObj;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.showTable(this.page, this.limit); 
						}else {
							this.$message.warning(msg);
							this.showTable(this.page, this.limit); 
						}
					})
					.catch((err) => {
						// this.$message.warning('系统繁忙！请稍后重试！');
					});
			},
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit); 
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleCurrentChange1(val) {
				this.page1 = val; // 获取当前页
				this.showTable(this.page, this.limit); 
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			handleSizeChange1(val) {
				this.limit1 = val;
				this.showTable(this.page, this.limit);
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(this.multipleSelection);
				// console.log(val);
			},
			handleSwitchChange(str) {
				if(str == '是') {
					this.form.keyWord = '';
				} else {
					this.formStoreIdList = "";
					this.form.storeList = [];
					// this.form.storeGroupIdList = "";
					// this.form.districtIdList = "";
				}
			},
			// 从素材库中选择
			handleMasterId(str) { 
				// this.messageContent = [];
//				console.log(JSON.stringify(str))
				if(this.form.messageContent.text.indexOf(str.masterId) < 0) {
					this.form.messageContent.text = str.masterId;
				}
				this.form.messageContent.mediaId=str.masterId
				this.checked = [];
				this.checked.push(str.data);
//				 console.log(JSON.stringify(this.form.messageContent));
			},
			// 图文素材确定
			handleDialogSure() {
				this.dialogVisible = false;
				this.materialVisible = true;
				this.isShow = false;
				this.$refs.groupMaterialList.handleCommit();
			},
			// 图片素材确定
			handleDialogSurePic() {
				this.dialogVisiblePic = false;
				this.materialVisible = true;
				this.isShow = false;
				// this.$refs.groupMaterialList.handleCommit();
				this.form.messageContent.text = this.checkedPic[0];
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
							// matterData: {
							// 	coverUrl: '',
							// 	title: '',
							// 	updateDate: ''
							// }
//							console.log(msg[0])
							this.matterData.coverUrl = msg[0].coverUrl;
							this.matterData.title = msg[0].title;
							this.matterData.updateDate = msg[0].createdOn.split(' ')[0];
						}
					})
					.catch()
			},
			handleBack() {
				this.form.messageContent = {
					type: '',
					text: ''
				}
				this.content = '';
				this.isShow = true;
				this.materialVisible = this.editorQuillVisible = false;
			},
			handleContentType(str) {
				this.form.messageContent = {
					type: '',
					text: ''	
				};
				this.content = '';
				if(str == '图文') {
					this.isShow = true;
					this.editorQuillVisible = false;
					this.isShow = true;
					this.materialVisible = false;
				} else if (str == '图片') {
					this.isShow = true;
					this.editorQuillVisible = false;
					this.materialVisible = false;
				}else {
					this.editorQuillVisible = true;
				}
			},
			
			onEditorChange(obj) { // 图文编辑器
				//          console.log(this.form.content);
				this.form.messageContent.text = obj.html
			},
			showTable (start, limit) {
				let that = this;
				let params = {
					"userId" : this.userInfo.userCode,
					"page" : start,//可为空
					"limit" : limit,//可为空、
					"isOpen": '否'
				}
				let params1 = {
					"userId" : this.userInfo.userCode,
					"page" : start,//可为空
					"limit" : limit,//可为空
					"isOpen": '是'
				}
				// 使表格加载
				this.tableLoading = true;
				this.tableLoading1 = true;
				// 查询接口
				selectAutoRespond(params)//查询非门店配置
					.then(function(res) {
						// console.log(res.data)
						let data = JSON.parse(Base64.decode(res.data));
						let msg = data.data;
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								...val
							});
							if(val.messageType=="图文"){
								result[index].messageTypeContent="图文";
							}else if(val.messageType=="图片"){
								result[index].messageTypeContent="图片";
							}else{
								result[index].messageTypeContent=val.messageContent.text;
							}
						})
						that.count = data.count; 
						if(!msg) {
							that.tableData = [];
						}
						that.tableData = result;
//						console.log(JSON.stringify(that.tableData));
						that.tableLoading = false;
					})
					.catch(function(err) {
						that.tableData = [];
						that.tableLoading = false;
					});

				selectAutoRespond(params1)//查询门店配置
					.then(function(res) {
						// console.log(res.data)
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);
						// console.log(data, 'showTable');
						// 获取后台返回的数据总条数 赋值
						that.count1 = data.count; 
						let msg = data.data;
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								...val
							});
							if(val.messageType=="图文"){
								result[index].messageTypeContent="图文";
							}else if(val.messageType=="图片"){
								result[index].messageTypeContent="图片";
							}else{
								result[index].messageTypeContent=val.messageContent.text;
							}
						})
						// console.log(msg);
						if(!msg) {
							that.tableData1 = [];
						}
						that.tableData1 = result;
//						console.log(JSON.stringify(that.tableData1));
						that.tableLoading1 = false;
					})
					.catch(function(err) {
						that.tableData1 = [];
						that.tableLoading1 = false;
					});
			},

		// 穿梭框
			//点击查询的 选择组织
			storeClick() {
				this.handleTabDialog = true;
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
			},
			//监听tab页
			handleClick(tab, event) {
				this.tabType = event.target.firstChild.data;
				this.data2 = [];
				this.value2 = [];
				this.dataIndex = [];
				this.searchStoreTab();
			},
			//监听父级选项动态加载省市区数据(弹窗内)
			cascaderSelect(val) {
				if(val.length == 1) {
					let proIndex = val[0];
					let parentId = this.optionsProCityAreaPop[proIndex].key;
					let params = {
						parentId: parentId
					}
					// console.log(params, '||params');
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
				let storeList = [];
				that.data2.forEach((data,dataIndex)=>{
					that.dataIndex.forEach((value, index) => {
						if(data.storeId==value){
							this.storeArr = nameArray;
							this.form.type = this.tabType;
							storeList.push({
								storeId: data.storeId,
								storeName: data.storeName
							});
						}
					})
				})
				this.form.storeList = storeList;
				this.handleTabDialog = false;
			},
			// 监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				this.dataIndex = val;
				that.data2.forEach((data,dataIndex)=>{
					val.forEach((value, index) => {
						if(data.storeId==value){
							idArray += data.storeId + ",";
							nameArray += data.storeName + ",";
						}
					})
				})
				this.formStoreIdList = nameArray.substr(0,nameArray.length-1);
				// this.form.storeName = nameArray;
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
				//				console.log(this.tabType);
				if(this.tabType == "门店") {
					params.flag = "1";
				}
				if(this.tabType == "店组") {
					params.flag = "2";
				}
				if(this.tabType == "区域") {
					params.flag = "3";
				}
				//				console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//		        		console.log(JSON.stringify(data)+"返回值")
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
							//							console.log(this.data2)
						}
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
						// console.log(err)
					})
				$("#transfer").show();
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);

			this.showTable(this.page, this.limit); 

			var params = {
				userId: this.userInfo.userCode
			}
			getBrandInfo(params)	
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					// console.log(JSON.stringify(data) + "所属品牌")
					if(data != "") {
						this.formBrandName = data.messageContent.brandName;
					}
				})
				.catch((err) => {
				})
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
		mounted() {
			// var vm =this
		    // var imgHandler = async function(state) {
			//     if (state) {
			// 		vm.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			//     }
			// }
		    // vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
		},
		watch: {
			'childData': function(val, oldVal) {
				//          console.log(val);
				// "type": "",
				// "groupObject": "",
				// "contentType": "",
				// "content": "sdfsdf",
				// "executePlan": "",
				// "status": "",
				// "lastExecuteDate": "",
				// "sendNumber": "",
				// "members": "", // 已入会会员
				// "unMembers": "" // 未入会会员
				this.form = val;
				this.id = val.id;
				this.version = val.version;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	// .el-card {
	//     width: 100%;
	// }
	.demo-form {
		height: 100px;
	}
	
	.el-form {
		// display: inline-block;
		// position: absolute;
		// margin-left: rem(20px);
	}
	
	.select-card {
		display: flex;
		justify-content: space-around;
		align-items: center;
		clear: both;
		div {
			display: inline-block;
			text-align: center;
			// lin-height: 
			width: 230px;
			height: 180px;
			border: 1px solid #d2d2d2;
			padding-top: 50px;
			cursor: pointer;
			// margin: 10px;
			cursor: pointer;
		}
		div:first-child {
			margin-right: 7px;
		}
		i {
			font-size: 40px;
		}
	}
	
	.img-yxy {
		clear: both;
		margin-left: 10px;
		font-size: 15px;
		line-height: 40px;
		cursor: pointer;
		span {
			margin-right: 10px;
		}
	}

	.radio-block {
		margin-top: 10px;
		.el-radio {
			display: block;
			margin-bottom: 10px;
			margin-left: 0px;
		}
	}
	
	.current-row {
		background: red;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}

	// 图片素材擦片查看
	.graphicCard.el-card {
		float: left;
		margin-top: 10px;
		margin-right: 10px;
		width: 220px!important;
		background: #FFF;
	}
	
	.graphicCard .imgBox {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		width: 200px;
		height: 100px;
		border: 1px solid #CCC;
		img {
			width: 200px;
		}
	}
	
	.graphicCard .cardInfo {
		display: flex;
		justify-content: space-between;
		height: 30px;
		line-height: 30px;
	}
	
	.graphicCard .cardHandle {
		display: flex;
		justify-content: space-between;
		.el-button {
			width: 50%;
		}
	}
	.setStore{
		text-align: right;
		margin-bottom: 10px;
	}
	.borderRight{
		border-right: 1px solid #d2d2d2;
	}
	.groupMaterialList{
		width: 250px;
		float: left;
	}
	.myTextEditor{
		width: 470px;
		margin-top: 10px;
	}
	.el-textarea{
		width: 98%;
	}
</style>