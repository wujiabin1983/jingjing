<!-- 图文素材 - 语音 -->
<template>
	<el-container class="app-container">
		<el-main v-loading="tableLoading">
			<el-tabs tab-position="left" v-model="activeName" class="dsh-tabs" @tab-click="handleTabClick" @tab-add="handleTabAdd(activeName)" :addable="false">
				<el-tab-pane v-for="item in tabsMenu" :key="item.brandId" :label="item.groupName" :name="item.groupId">
					<!-- 分组操作区域 -->
					<el-header class="contentHeader">
						<div class="floatLeft">
							<span class="activeNameEdit" v-if="activeNameShow">{{activeNameEdit}}</span>
							<input v-if="!activeNameShow" v-model="activeNameEdit" class="contentInput" ref="contentInput" v-focus @keyup.enter="handleNameEdit">
							<span @click="handleNameEdit" v-if="item.groupId != 'ALL_COUNT' && item.groupId != 'NO_GROUP'">{{activeNameEditBtn}}</span>
							<span v-if="!activeNameShow" @click="handleNameCancel">取消</span>
							<span @click="handleNameDelete" v-if="roleBtn.deleteMaterialLibraryGroupInfo2 && item.groupId != 'ALL_COUNT' && item.groupId != 'NO_GROUP'">删除分组</span>
							<span @click="handleTabAdd(activeName)">添加分组</span>
						</div>
						<div class="floatRight">
							<b class="dsh-b">音频大小不超出2M</b>
							<el-button type="primary" @click="handleGroupAdd" v-if="roleBtn.deleteMaterialLibraryGroupInfo2">新增语音</el-button>
						</div>
					</el-header>
					<!-- 卡片操作区域 -->
					<div>
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAll">全选</el-checkbox>
						<el-button @click="handleMove" type="primary"  v-if="roleBtn.moveMaterialLibraryInfo2">移动分组</el-button>
					</div>
					<!-- 图片素材卡片 -->
					<el-checkbox-group v-model="checked" @change="handleChange">
						<el-card class="graphicCard cardGraphicListShow" v-for="items in cardItems" :key="items.id">
							<div class="imgBox">
								<div class="aplayer-area">
									<aplayer mini
										:music="{
											title: items.coverUrl,
											artist: ' ',
											src: !items.coverUrl ? '' : items.coverUrl,
											pic: '',
											muted: true
										}"
									/>
									<div class="aplayerInfo">
										<span class="title">{{items.title}}</span>
										<span class="title">{{items.createdOn.split(' ')[0]}}</span>
									</div>
								</div>
								<div class="aplayerTime" title="播放时间" alt="播放时间">
									{{items.fieldTime}}
								</div>
							</div>
							<div class="cardInfo">
								<el-checkbox :label="items.id" :valie="items.id">{{ }}</el-checkbox>
							</div>
							<div class="cardHandle">
								<el-button @click="handleEdit(items)">
									<i class="el-icon-edit"></i>
								</el-button>
								<el-button @click="handleDelete(items)" v-if="roleBtn.deleteMaterialLibraryGroupInfo2">
									<i class="el-icon-delete"></i>
								</el-button>
							</div>
						</el-card>
					</el-checkbox-group>
				</el-tab-pane>
			</el-tabs>
			<!-- 分页 -->
			<el-footer>
				<el-pagination
					background
					class="pagination"
					layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
					:page-size="limit"
					:total="count"
					@current-change="handleCurrentChange">
				</el-pagination>
			</el-footer>
			<div class="addTabBox" v-if="tabAddBoxShow">
				<span>创建分组</span>
				<div>
					<el-input v-model="tabAddName" placeholder="请输入分组名称"></el-input>
				</div>
				<el-button type="primary" @click="handletabAddBtn">确认</el-button>
				<el-button @click="tabAddBoxShow = false;tabAddName = '';">取消</el-button>
			</div>
		</el-main>

		<!-- 选择分组弹窗 -->
		<el-dialog title="选择分组" :visible.sync="dialogFormVisible" width="25%">
			<el-form :model="groupForm">
				<el-form-item label="">
					<el-select v-model="groupForm.group" placeholder="请选择分组" @change="handleSelectGroup">
						<el-option v-for="item in tabsMenuSelect" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<br>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleMoveSuccBtn">确 定</el-button>
			</div>
		</el-dialog>
		
		<!-- (新建/修改)图片弹窗 -->
		<el-dialog :title="`${dialogAddFormTitle}语音素材`" :visible.sync="dialogAddFormVisible" @close="handleClosed">
			<el-form :inline="true" :model="groupAddForm" v-loading="formLoading" label-width="100px" ref="groupAddForm" :rules="rules">
				<el-form-item label="标题" prop="name">
					<el-input class="width260" v-model="groupAddForm.name" placeholder="请输入标题"></el-input>
				</el-form-item>
				<el-form-item label="语音内容" prop="picture">
					<el-input class="width150" v-model="groupAddForm.picture" :readonly="true" :alt="groupAddForm.picture" :title="groupAddForm.picture" placeholder="请上传音频"></el-input>
					<el-button type="primary" @click="clickTest">上传</el-button>
				</el-form-item>
				<el-form-item class="el-form-img" v-loading="imgLoading">
					<audio v-if="imageUrl" :src="imageUrl" controls></audio>
					<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
						<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg"/>
						<input type="submit" value="上传" ref="uploadSubmit"/>
					</form>
					<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
				</el-form-item>
			</el-form>
			<br>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleAddSuccBtn(dialogAddFormTitle)">确 定</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	import { uploadAudio} from '@/api/base/brandInfo'
	import { MaterialLibraryListShow, MaterialLibraryListAdd, MaterialLibraryListEdit, MaterialLibraryListDelete, MaterialLibraryCardShow, MaterialLibraryCardMove, MaterialLibraryCardDelete, MaterialLibraryCardAdd, MaterialLibraryCardEdit } from '@/api/mobile/graphicMaterial'
	import Aplayer from 'vue-aplayer'
	export default {
		data() {
			return {
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
				roleBtn: {
					updateMaterialLibraryInfo2: false, // 修改分组
					deleteMaterialLibraryGroupInfo2: false, // 删除分组
					moveMaterialLibraryInfo2: false, // 移动分组
				},
				// 数据
				activeName: '',//tabs页签值
				tabsMenu: [],//分组数据值
				tabsMenuSelect:[],//移动分组下拉框值
				tabIndex: 0, // 选项卡下标
				tabGroupId: '', // groupId  =  activeName
				tabAddBoxShow: false, // 分组添加框
				tabAddName: '', // 添加的名称
				activeNameShow: true, // 是否允许修改选中的标签页
				activeNameEdit: '', // 可重命名的分组名称 , 初始化等于activeName
				activeNameEditBtn: '重命名', // 重命名按钮 [重命名/保存]
				contentInputFocus: false, // 输入框获得焦点
				checked: [], // 素材项目选择 el-checkbox-group
				checkedIdList: [], // 被选中的卡片id
				checkedAll: false, // 是否全选 多选
				isIndeterminate: false, // 全选按钮
				dialogFormVisible: false, //移动分组弹出窗
				groupForm: {//移动分组-选择分组
					group: ''
				}, 
				// 分组弹框
				dialogAddFormVisible: false,//新增语音素材弹出窗
				dialogAddFormTitle: '',//新增语音素材弹出窗标题（新增/修改）
				groupAddForm: {//新增语音素材form表单值
					id: '',
					version: '',
					name: '',
					picture: ''
				},
				rules: {//新增语音素材form验证
					name: [
						{ required: true, message: '请输入标题', trigger: 'blur' },
					],
					picture: [
						{ required: true, message: '请选择图片素材', trigger: 'blur' },
					]
				},
				cardItems: [],//语音素材数据
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传语音素材路径
				imgLoading:false,//上传语音加载窗
				imageUrl:'',//语音URL
				selectedId: '', // 移动分组下拉框选择的分组id
				selectedName: '', // 移动分组下拉框选择的分组名称
				tableLoading: false,//语音素材加载窗
				formLoading:false//新增语音素材form提交加载窗
			}
		},
		components: {
			Aplayer
		},
		methods: {
			//分页监听事件
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": this.activeName,
					"fileType": "语音"
				}
				this.handleShowCard(params); // 初始化素材卡片
			},
			//分页每页条数修改事件
			handleSizeChange(val) {
				this.limit = val;
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": this.activeName,
					"fileType": "语音"
				}
				this.handleShowCard(params); // 初始化素材卡片
			},
			//移动分组 下拉框监听事件
			handleSelectGroup(item) {
				this.selectedId = item;
				let that = this;
				this.tabsMenu.forEach(val => {
					if(item = val.groupId) {
						that.selectedName = val.groupName;
					}
				})
			},
			//语音素材数据请求
			handleShowCard(params) { // 显示素材卡片
				this.tableLoading = true;
				MaterialLibraryCardShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.count,
							msg = data.data;
						// console.log(msg);
						this.count = data.count;
						let listItems = [];
						msg.forEach(val => {
							listItems.push({
								id: !val.id ? '' : val.id,
								version: !val.version ? '' : val.version,
								fileType: val.fileType,
								coverUrl: val.coverUrl,
								title: val.title,
								updateDate: val.updateDate,
								fieldTime: val.fieldTime,
								createdOn: val.createdOn,
							});
						})
						this.cardItems = listItems;
						this.tableLoading = false;
						this.dialogAddFormVisible=false;
					})
					.catch((err) => {
						// this.$message.warning(err);
						this.tableLoading = false;
					})
			},
			// tags标签页点击事件
			handleTabClick(obj) {
				this.tabAddBoxShow = false; // 如果存在添加选项卡分组添加框，则隐藏之
				this.activeNameEdit = obj.label; // 重命名后的重新定位
				this.tabIndex = obj.index; // 存储当前选中的下标
				this.tabGroupId = obj.name==""?'ALL_COUNT':obj.name; // 存储当前选中的masterId
				this.activeName = obj.name==""?'ALL_COUNT':obj.name;
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": obj.name,
					"fileType": "语音"
				}
				this.handleShowCard(params);
				// 初始化多选
				this.checked = []; // 素材项目选择 el-checkbox-group
				this.checkedIdList = []; // 被选中的卡片id
				this.checkedAll = false; // 是否全选 多选
				this.isIndeterminate = false; // 
			},
			//添加分组按钮点击事件
			handleTabAdd(obj) {
				this.tabAddBoxShow = true;
			},
			//添加分组提交事件
			handletabAddBtn() { 
				let name = this.tabAddName;
				this.tabAddName = '';
				if(name == '') {
					this.$message('分组名称不能为空');
					this.tabAddBoxShow = false;
				} else {
					let repeatNum = false;
					this.tabsMenu.forEach((val, index) => {
						if(val.groupName == name) {
							repeatNum = true;
						}
					});
					if(!repeatNum) {
						let params = {
							"userId": this.userInfo.userCode,
							"groupName": name,
							"groupType": '语音'
						}
						this.tableLoading = true;
						MaterialLibraryListAdd(params) // 添加分组
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								if(code == 'SUCCESS') {
									this.$message.success('新增成功！');
									this.handleMaterialLibraryListShow(); // 初始化分组名称
									this.tableLoading = false;
								} else {
									this.$message.warning(msg);
									this.tableLoading = false;
								}
							})
							.catch((err) => {
								this.tableLoading = false;
								// console.log(err);
							});
					} else {
						this.$message.warning('分组名称不能重复');
					}
					this.tabAddBoxShow = false;
				}
			},
			// 重命名 分组提交
			handleNameEdit() { 
				let btnStr;
				if(this.activeNameShow) {
					btnStr = this.activeNameEditBtn;
					this.activeNameShow = false;
					this.activeNameEditBtn = '确认';
					this.contentInputFocus = true;

				} else {
					this.activeNameShow = true;
					this.activeNameEditBtn = '重命名';
					this.tableLoading = true;
					let params = {
						"userId": this.userInfo.userCode,
						"groupId": this.tabGroupId,
						"groupName": this.activeNameEdit
					}
					MaterialLibraryListEdit(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.tableLoading = false;
								this.handleMaterialLibraryListShow(); // 初始化分组名称
							} else {
								this.$message.warning(msg);
								this.tableLoading = false;
							}
						})
						.catch((err) => {
							// console.log(err);
							this.tableLoading = false;
						})
				}

			},
			//分组重命名取消事件
			handleNameCancel() {
				this.activeNameShow = true;
				this.activeNameEditBtn = '重命名';
				this.handleMaterialLibraryListShow(); // 初始化分组名称
			},
			//删除分组事件
			handleNameDelete() { 
				if(this.tabIndex > 1) { // [全部]分组不能删除
					if(this.tabGroupId.length > 0) {
						this.$confirm('您确定要删除吗, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let params = {
								"userId": this.userInfo.userCode,
								"groupId": this.tabGroupId
							}
							MaterialLibraryListDelete(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										this.activeName="ALL_COUNT";
										this.tabGroupId="ALL_COUNT";
										this.activeNameEdit = "所有"; // 重命名后的重新定位
										this.tabIndex = '0'; // 存储当前选中的下标
										this.handleMaterialLibraryListShow(); // 初始化分组名称
									} else {
										this.$message.warning(msg);
									}
								})
								.catch((err) => {
									this.$message.warning(err);
								})
						})
					}

				} else {
					this.$message.warning('无法删除当前分组');
				}
			},
			//移动分组按钮点击事件
			handleMove() {
				let count = this.checked.length; // 选中素材的个数
				if(count == 0) {
					this.$message.warning('请选择需要移动的素材');
				} else {
					this.dialogFormVisible = true;
				}
			},
			//移动分组提交事件
			handleMoveSuccBtn() {
				let params = {
					"userId": this.userInfo.userCode,
					"idList": this.checked,
					"groupId": this.selectedId,
					"groupName": this.selectedName
				}
				if(params.groupId==''){
					this.$message.warning('请选择分组！');
					return false;
				}
				MaterialLibraryCardMove(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent,
							val = data.valueObj;
						if(code == 'SUCCESS') {
							this.dialogFormVisible = false;
							this.$message.success(msg);
							this.selectedId=''; // 移动分组下拉框选择的分组id
							this.selectedName= ''; // 移动分组下拉框选择的分组名称
							this.groupForm.group='';
							this.handleMaterialLibraryListShow(); // 初始化分组名称
						} else {
							this.tableLoading = false;
							this.$message.warning(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});

			},
			//语音素材卡片左下角修改按钮
			handleEdit(obj) {
				this.groupAddForm = {
					id: !obj.id ? '' : obj.id,
					version: !obj.version ? '' : obj.version,
					name: obj.title,
					picture: obj.coverUrl
				}
				this.dialogImageUrl = obj.coverUrl;
				this.imageUrl = obj.coverUrl;
				this.mainLogoUrl = obj.coverUrl; // 图片赋值


				this.dialogAddFormTitle = '修改';
				this.dialogAddFormVisible = true;
			},
			//语音素材卡片右下角删除按钮
			handleDelete(obj) {
				let params = {
					userId: this.userInfo.userCode,
					idList: obj.id
				}
				MaterialLibraryCardDelete(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent,
							val = data.valueObj;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							let obj = {
								label:this.activeNameEdit,
								index:this.tabIndex,
								name:this.tabGroupId,
							}
							this.handleTabClick(obj);
						} else {
							this.$message.warning(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			//左侧分组数据查询
			handleMaterialLibraryListShow() { 
				let params = {
					"userId": this.userInfo.userCode,
					"fileType": "语音"
				}
				this.tableLoading=true;
				MaterialLibraryListShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						// console.log(data);
						if(msg.length > 0) {
							let tabsMenuData = [{
								"groupId":"ALL_COUNT",
								"groupName":"所有",
								"qty":"0"
							}];
							this.tabsMenuSelect=[];
							msg.forEach((value, index) => {
								tabsMenuData.push({
									...value
								});
								this.tabsMenuSelect.push({
									...value
								});
							});
							this.tabsMenu = tabsMenuData;
							let obj = {
								label:this.activeNameEdit,
								index:this.tabIndex,
								name:this.tabGroupId,
							}
							this.handleTabClick(obj);
							this.tableLoading = false;
						} else {
							this.$message.warning(msg);
							this.tableLoading = false;
						}
					})
					.catch((err) => {
						// console.log(err);
					})
			},
			//监听全选复选框事件
			handleCheckAll(val) {
				let itemAll = [];
				this.cardItems.forEach((val, index) => {
					itemAll.push(val.id);
				});
				this.checked = val ? itemAll : [];
				this.isIndeterminate = false;
			},
			//监听语音素材卡片复选框
			handleChange(value) {
				this.cardItems.forEach(val => {
					if(val.title == value) {
						this.checkedIdList.push(val.id);
					}
				})
				let checkedCount = value.length;
				this.checkedAll = checkedCount === this.cardItems.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cardItems.length;
			},
			//新增语音素材按钮事件
			handleGroupAdd() {
				this.dialogAddFormTitle = '新建';
				this.dialogAddFormVisible = true;
			},
			//新增语音素材提交
			handleAddSuccBtn(title) { // 确定
				let that = this;
				this.$refs.groupAddForm.validate((valid) => {
					if (valid) {
						this.formLoading = true;
						if(title == '新建') {
							let params = {
								"userId": this.userInfo.userCode,
								"groupId": this.tabGroupId,
								"groupName": this.activeNameEdit,
								"fileType": "语音",
								"coverUrl": this.groupAddForm.picture,
								"title": this.groupAddForm.name,
								"fieldUrl": "文件路径",
								"label": "标签",
								"introduction": "简介"
							}
							MaterialLibraryCardAdd(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									if(code == 'SUCCESS') {
										that.$message.success(msg);
										let activeName = that.activeName;
										let obj = {
											label:this.activeNameEdit,
											index:this.tabIndex,
											name:this.tabGroupId,
										}
										this.handleTabClick(obj);
										this.formLoading = false;
									} else {
										this.$message.warning(msg);
										this.formLoading = false;
									}
								})
								.catch((err) => {
									this.formLoading = false;
									// console.log(err);
								});
						}else if(title == '修改') {
							let params = {
								"userId": this.userInfo.userCode,
								"id": this.groupAddForm.id,
								"groupId":  this.tabGroupId,
								"groupName":  this.activeNameEdit,
								"fileType": "语音",
								"coverUrl": this.groupAddForm.picture,
								"title": this.groupAddForm.name,
								"fieldUrl": "文件路径",
								"label": "标签",
								"introduction": "简介",
								"version": this.groupAddForm.version
							}
							MaterialLibraryCardEdit(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									if(code == 'SUCCESS') {
										that.$message.success(msg);
										let activeName = that.activeName;
										let obj = {
											label:this.activeNameEdit,
											index:this.tabIndex,
											name:this.tabGroupId,
										}
										this.handleTabClick(obj);
										this.formLoading = false;
									} else {
										this.$message.warning(msg);
										this.formLoading = false;
									}
								})
								.catch((err) => {
									// console.log(err);
									this.formLoading = false;
								});
						}
					}
				});
			},
			//弹出窗口关闭
			handleClosed() {
				this.groupAddForm.id = '';
				this.groupAddForm.version = '';
				this.groupAddForm.name = '';
				this.groupAddForm.picture = '';
				this.dialogImageUrl = '';
				this.imageUrl = '';
				this.mainLogoUrl = ''; // 图片赋值
				this.groupAddForm.picture = '';
				this.$refs.uploadIpt.value = '';
			},
			//监听input-type值   上传语音
			handleSelectImg(file) {
				let that = this;
				let files = file.target.files[0];
				if(!files) {
					return false;
				}else {
					// 图片限制大小2M
					let fSize = 1024 * 1024 *2;
					if (files.size > fSize) {
						this.$message({
							message: "音频大小不能大于2M",
							duration: 2000,
							type: 'warning'
						}) 
						return false; 
					}
					if (!/(mp3|wma|wav)$/.test(files.name) && !/audio/.test(files.type)) { 
						this.$message({
							message: "音频类型必须是mp3、wma、wav、amr中的一种",
							duration: 2000,
							type: 'warning'
						}) 
						return false; 
					}
					this.imgLoading=true;
					let reader = new FileReader();
					reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的文件 
					reader.onload = function(e) { 
						let formData = new FormData();// 可以增加表单数据
						formData.append("file", files);// 文件对象
						uploadAudio(formData)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								that.imgLoading=false;
								if(code == 'SUCCESS') {
									that.mainLogoUrl = msg.fileName; // 图片赋值
									that.dialogImageUrl=msg.fileName; // 图片回填 - 本地图片
									that.imageUrl=msg.fileName;
									that.groupAddForm.picture = msg.fileName;
									that.$message.success('上传成功');
								}else{
									that.$message({
										message:msg,
										type: 'warning',
										duration: 2000
									});
								}
							})
							.catch((err) => {
								that.imgLoading=false;
								// console.log(err);
							})	
					} 
				}
			},
			//点击上传语音
			clickTest() {
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.handleMaterialLibraryListShow(); // 初始化分组名称
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			aplayerTitle () {
				// groupAddForm.picture.split('/')[groupAddForm.picture.split('/').length-1]
				let picture = this.groupAddForm.picture;
				let name = picture.split('/')[picture.split('/').length-1]
				if(name.length > 30) {
					return name.substr(0, 30) + '...';
				}else {
					return name
				}
			}
		},
		directives: {
			focus: {
				// 指令的定义
				inserted: function(el) {
					el.focus()
				}
			}
		},
		watch: {

		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.app-container {
		padding: 0;
	}
	.el-card {
		padding-top: 0;	
	}
	.el-main{
		position: relative;
	}
	.el-input {
		display: inline-block;
	}
	.contentHeader {
		height: 40px!important;
		span {
			margin-right: 20px;
		}
		span:nth-child(n + 2) {
			cursor: pointer;
			color: #009ee2;
		}
		.contentInput {
			width: 100px;
			height: 16px;
			border: 0;
			padding: 0;
			outline: none;
			border-bottom: 1px solid #2d2d2d;
		}
	}
	
	.floatRight {
		float: right;
	}
	
	.floatLeft {
		float: left;
		height: 32px;
		line-height: 32px;
	}
	
	.el-tabs__item {
		width: 200px!important;
	}
	
	.graphicCard.el-card {
		position: relative;
		float: left;
		margin-top: 10px;
		margin-right: 10px;
		width: 220px!important;
		background: #FFF;
	}
	
	.graphicCard .imgBox {
		width: 200px;
		height: 100px;
		.aplayer-area {
			display: flex;
			height: 80%;
			justify-content: space-between;
			align-items: center;
			overflow: hidden;
			.aplayerInfo {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 55%;
				height: 80%;
			}

		}
		.aplayerTime {
			width: 100%;
			display: block;
			margin-left: 10px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

		}
	}
	.graphicCard .cardInfo {
		position: absolute;
		right: 0;
		top: 0;
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
	
	.addTabBox {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 130px;
		border: 1px solid #CCC;
		padding: 10px;
		background: #fff;
		z-index: 200;
	}

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
	.componentBox{
		width:426px
	}
	.component{
		position: relative;
		width: 140px;
		height: 140px;
		margin-right: 8px;
		margin-bottom: 8px;
		float: left;
	}
	.componentDelete{
		position: absolute;
		cursor: pointer;
		top: -5px;
		right: -5px;
		font-size: 20px;
		width: 15px;
		height: 15px;
		line-height: 15px;
		text-align: center;
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
		height: 80px;
		line-height: 80px;
		text-align: center;
		float: left;
	}
	
	.avatar {
		display: block;
		width: 140px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		float: left;
	}
	.avatar:hover {
		border-color: #409EFF;
	}
	.el-form-img {
		width: 100%;
		text-align: center;
	}
	
	.activeNameEdit{
		vertical-align: center;
	}
	.dsh-b{
		vertical-align: bottom;
	}
	.dsh-tabs{
		position: relative;
		min-height: 200px;
	}
	
	.dsh-input{
		width: 130px;
		margin: 10px 0;
	}
	.width260{
		width: 260px;	
	}
	.width150{
		width: 150px;	
	}
</style>