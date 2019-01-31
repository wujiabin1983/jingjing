<!-- 群发消息 - 群发消息 -->
<template>
	<el-container class="app-container">
		<el-header>
			<el-form :model="form" ref="form" label-width="90px" class="demo-form">
				<el-form-item label="组织">
					<el-input v-model="storeArr" :readonly="true" placeholder="请选择组织" @click.native="handleStore"></el-input>
				</el-form-item>
				<el-form-item label="群发类型">
					<el-radio-group v-model="form.type" @change="handleSelectType">
						<el-radio label="全部" :disabled="getParamType=='已入会会员'||getParamType=='未入会粉丝'" value="全部">全部</el-radio>
						<el-radio label="分组群发" :disabled="getParamType=='已入会会员'||getParamType=='未入会粉丝'" value="分组群发">分组群发</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="请选择分组" v-if="form.type == '分组群发'">
					<el-input v-model="form.groupObject.value" :readonly="true" placeholder="请选择会员分组" @click.native="handleGroupPush"></el-input>
				</el-form-item>
			</el-form>
		</el-header>
		<div class="img-yxy">
			<el-radio-group v-model="form.contentType" size="small" @change="handleContentType">
				<el-radio label="图文信息" border><i class="el-icon-document"></i>图文信息</el-radio>
				<el-radio label="文字" border><i class="el-icon-edit-outline"></i>文字</el-radio>
			</el-radio-group>
		</div>
		<el-main>
			<!-- 初始界面 -->
			<el-card class="select-card" v-if="form.contentType == '图文信息' && isShow">
				<div @click="handleSucaiku">
					<i class="el-icon-plus"></i>
					<p>从素材库中选择</p>
				</div>
			</el-card>
			<!-- 从素材库中选择 -->
			<el-card class="" v-if="form.contentType == '图文信息' && !isShow && materialVisible">
				<el-button @click="handleBack" class="marginLeft10">返回</el-button>
				<div>
					<div class="component" v-for="(item, index) in checked" :key="items.id">
						<groupWechatMaterialListShow :childDataLists="item" :isCheckBox="false" ref="groupWechatMaterialListShow" class="groupWechatMaterialList"></groupWechatMaterialListShow>
					</div>
				</div>
			</el-card>
			<!-- 文字 -->
			<el-input type="textarea" v-model="form.content" placeholder="请输入" :rows="9" resize="none" class="textareaIpt" v-if="form.contentType == '文字'"></el-input>
			<!-- 富文本里的上传图片 -->
			<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
				<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
				<input type="submit" value="上传" ref="uploadSubmit" />
			</form>
		</el-main>
		<el-button type="primary" class="sendButton" @click="handleCommit" v-if="roleBtn.sendCustomizeMenuInfo">发送</el-button>
		<el-dialog width="80%" :visible.sync="dialogVisible">
			<!-- 素材选择 -->
			<groupWechatMaterialList ref="groupWechatMaterialList" @parentMasterId="handleMasterId"></groupWechatMaterialList>
			<span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="enterMaster">确 定</el-button>
            </span>
		</el-dialog>
		<el-dialog width="50%" :visible.sync="dialogVisible2">
			<div v-loading="dialogVisibleLoading">
				<el-form :model="form" ref="form" label-width="100px" class="demo-form">
					<el-form-item label="是否定时发送">
						<el-radio-group v-model="form.executePlan.isTimingSend" @change="handleSelectExecutePlan">
							<el-radio label="是" value="是">是</el-radio>
							<el-radio label="否" value="否">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="form.executePlan.isTimingSend == '是'">
						<el-date-picker
							v-model="form.executePlan.sendTime"
							value-format="yyyy-MM-dd hh:mm:ss"
							type="datetime"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
	                <el-button @click="dialogVisible2 = false">取 消</el-button>
	                <el-button type="primary" @click="getPeopleNum">确 定</el-button>
	            </div>
			</div>
		</el-dialog>
		<!-- 会员分组 -->
		<el-dialog width="80%" :visible.sync="isGroupPushShow" id="groupDialog">
			<div>
				<el-form :inline="true" :model="groupPushForm">
                    <el-form-item>
                        <el-input v-model="groupPushForm.searchContent" placeholder="请输入分组名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="groupPushHandleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
				<!-- <el-card> -->
					<el-row :gutter="16" class="groupPushForm" v-loading="groupPushLoading">
						<el-col :span="8" v-for="(item, index) in groupPushData" :key="item.id">
							<groupCard :childData="item" childPageName="分组查看" childType="所有分组" @emitSelected="handleSelected"></groupCard>
							<!-- <groupCard :childData="item" :childPageName="groupName" childType="共享分组" :childCopy="roleBtn.copyShareGroupInfo"></groupCard> -->
						</el-col>
						<p class="noData" v-if="noData">暂无数据</p>
					</el-row>
				<!-- </el-card> -->
				<el-footer v-if="groupPushCount != 0">
					<el-pagination
						background
						class="pagination"
						layout="total, sizes, prev, pager, next, jumper" 
						@size-change="groupPushHandleSizeChange"
						:page-sizes="[6, 12, 48, 90, 150, 240, 300]"
						:page-size="groupPushLimit"
						:total="groupPushCount"
						@current-change="groupPushHandleCurrentChange">
					</el-pagination>
				</el-footer>
			</div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="isGroupPushShow = false">取 消</el-button>
                <el-button type="primary" @click="groupPushHandleConfine">确 定</el-button>
            </span>
		</el-dialog>
		<!--门店区域店组-->
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
			</template>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleTabDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { mapGetters } from 'vuex'
	import logo from '@/assets/images/000247589.jpg'
	import groupWechatMaterialList from '@/views/WebRoot/mobile/component/groupWechatMaterialList' // 图文素材
	import groupWechatMaterialListShow from '@/views/WebRoot/mobile/component/groupWechatMaterialListShow'
	import { groupMsgMasterAdd, groupMsgMasterEdit, groupMsgMasterNum, selectInfo, I_SCRM_INTERFACE_842 } from '@/api/mobile/groupMsgMaster'
	import { selectGroupAll } from '@/api/member/group'
//	import { quillEditor } from 'vue-quill-editor'
	//未入会粉丝
	import { selectWeChatFansNoData} from '@/api/member/WeChatFans'
	// 会员分组
	import { groupCard } from '@/views/WebRoot/member'
	import { selectMemberSelect } from '@/api/member/memberSelect'
	import { selectLevalInfo, selectProCityArea, selectTabData ,selectLabelData,selectSendNoMember,selectSendMember} from '@/api/public'
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				dialogVisibleLoading:false,
				storeArr:'',
				noData:false,
				groupPushLoading:false,//会员分组加载框
				getParamType:'',
				levalInfo:[],
				roleBtn: {
					sendCustomizeMenuInfo: false
				},
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				// 数据
				isShow: true, // 是否显示（从素材库中选择，自建图文）
				form: {
					"type": '全部', // 群发类型
					"groupObject": {
						'key' : '', // 分组群发/全部/已入会会员/未入会粉丝/门店/店组/区域
						'value' : '', // 分组id/会员id/门店id/店组id/区域id
						'storeId':'',
						'orgId':'',
						'orgName':''
					},
					"contentType": '图文信息', // 内容类型
					"content":'', // 消息内容
					"executePlan": { // 执行发送计划（json字符创）
						'isTimingSend': '否', // 是否定时发送（是/否）
						'sendTime': '' // 发送时间
					}
				},
				id: '',
				version: '',
				formContentType: [],

				dialogVisible: false,
				dialogVisible2: false,
				checked: [],

				materialVisible: false, // 素材库列表是否可见
				editorQuillVisible: false, // 富文本编辑器是否可见
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
                            ['link', 'image', 'formula']//去除video即可
                        ]
                    },
				},
				
				// 是否显示会员分组
				isGroupPushShow: false,
				groupPushData: [],
				// 分页
				groupPushPage: 0, // 当前页
				groupPushCount: 0, // 总条数
				page:0,
				limit: this.GLOBAL.limit, // 条/页
				groupPushLimit: 6, // 条/页
				groupPushForm: {
					searchContent: ''
				},
				groupPushSelectedId: '',
				groupPushSelectedName: '',

				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [],
				handleTabDialog: false,
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				activeName: 'first',
				tabType: '门店',
			}
		},
		props: ['childData'],
		components: {
//			quillEditor, // 富文本
			groupWechatMaterialList,
			groupWechatMaterialListShow,
			groupCard
		},
		methods: {
			enterMaster(){
//				console.log(this.checked)
				if(this.checked.length==0){
					this.dialogVisible = false;
					this.materialVisible = false;
					this.isShow = true;
				}else{
					this.dialogVisible = false;
					this.materialVisible = true;
					this.isShow = false;
				}
			},
			// 分组群发点击
			handleGroupPush() {
				if(this.getParamType==""){
					this.isGroupPushShow = true;
					this.groupPushShowGroup(this.groupPushPage, this.groupPushLimit, this.groupPushForm.searchContent);
				}
			},
			// 接收勾选分组数据
			handleSelected(str) {
				if(this.groupPushSelectedId.length > 0) {
					for(let i of this.groupPushData) {
						if(i.id != str.id && i.selected) {
							i.selected = false;
						}
					}
				}
				this.groupPushSelectedId = str.id
				this.groupPushSelectedName = str.groupName
			},
			// 显示分组数据
			groupPushShowGroup(start, limit, searchContent) {
				let params = {
					"userId" : this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"groupName": searchContent // (可空)
				}
				// console.log(params);
				this.groupPushLoading=true;
				selectGroupAll(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						this.groupPushLoading=false;
						this.groupPushCount = count;
//						console.log(JSON.stringify(data))
						if(count > 0) {
							for(let i of msg) {
								i.selected = false;
							}
							this.groupPushData = msg;
							this.noData=false;
						}else{
							this.noData=true;
						}
					})
					.catch(function(err) {
//						console.log(err);
						this.groupPushLoading=false;
					});
			},
			// 会员分组查询按钮
			groupPushHandleSearch() {
				this.groupPushShowGroup(this.groupPushPage, this.groupPushLimit, this.groupPushForm.searchContent);
			},
			// 会员分组分页
			groupPushHandleCurrentChange(val) {
				this.groupPushPage = val; // 获取当前页
            	this.groupPushShowGroup(this.groupPushPage, this.groupPushLimit, this.groupPushForm.searchContent);
			},
			// 会员分组查询  limit设置
			groupPushHandleSizeChange(val) {
				this.groupPushLimit = val;
            	this.groupPushShowGroup(this.groupPushPage, this.groupPushLimit, this.groupPushForm.searchContent);
			},
			//会员分组查询  弹窗确认按钮
			groupPushHandleConfine() {
				this.form.groupObject.value = this.groupPushSelectedName;
				this.form.groupObject.key = this.groupPushSelectedId;
				this.isGroupPushShow = false;
			},
			// *************************
			//点击所属门店弹窗显示
			searchStorePop() {
				this.handleTabDialog = true;
				this.searchStoreTab();
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
				this.handleTabDialog = false;
				this.form.groupObject.orgName = this.tabType;
			},
			//监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				this.dataIndex = val;
				that.data2.forEach((data, index) => {
					val.forEach((value, ind) => {
						if(value == data.storeId) {
							idArray += data.storeId + ",";
							nameArray += data.storeName + ",";
						}
					})
				})
				this.form.groupObject.orgId = idArray.substr(0, idArray.length - 1);
				this.storeArr = nameArray.substr(0, nameArray.length - 1);
				// console.log(this.form.storeId)
			},
			//搜索
			searchSelete() {
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
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
				this.handleStoreDialog = true;
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
						// console.log(data)
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
							// console.log(this.data2)
						}
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
						// console.log(err)
					})
				$("#transfer").show();
			},

			// 从素材库中选择
			handleSucaiku() {
				this.dialogVisible = true;
				this.$nextTick(function(){
					this.$refs.groupWechatMaterialList.handleShow(this.page,this.limit,'');
				})
//				this.form.content.type = '素材库';
			},
			handleSelectExecutePlan(str) { // 执行发送计划（是/否）
				if(str == '否') {
					this.form.executePlan.sendTime = '';
				}
			},
			handleBack() {
				this.form.content = '';
				this.isShow = true;
				this.materialVisible = this.editorQuillVisible = false;
			},
			handleContentType(str) {
				this.form.content = '';
				this.checked=[];
				if(str == '图文信息') {
					this.isShow = true;
					this.editorQuillVisible = false;
				}else {
					this.isShow = false;
					this.editorQuillVisible = true;
				}
			},
			// 群发类型选择监听方法
			handleSelectType(selected) {
				this.form.groupObject.value = '';
				this.form.groupObject.key = selected;
			},
			//群发类型选择组织点击事件
			handleStore(){
				if(this.getParamType==""){
					this.searchStorePop();
				}
			},
			handleMasterId(str) {
				if(str.masterId!=""){
					if(this.form.groupObject.key.indexOf(str.masterId) < 0) {
						this.form.content = str.masterId;
					}
					this.checked = [];
					this.checked.push(str.data);
				}else{
					this.checked = [];
				}
			},
			handleSelectImg(file) { // 上传图片
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
			handleCommit () {
				if(this.form.type!="全部"&&this.form.groupObject.value==""){
					this.$message.warning('请选择发送对象！');
					return false;
				}
				if(this.form.content==""){
					this.$message.warning('发送内容不能为空！');
					return false;
				}
//				console.log(JSON.stringify(this.form));
//				return false;
				this.dialogVisible2 = true;
			},
			handlePush(params, type) { // 发送
				let that = this;
				if(type == '修改') {
					// 修改
					groupMsgMasterEdit(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							this.dialogVisibleLoading=false;
							if(code == 'SUCCESS') {
								this.$message({
									type: 'success',
									message: msg,
									duration: 1500,
									onClose() {
										let params = {
											index: 'second'
										}
										that.$emit('tabIndex', params);
									}
								});
							} else {
								this.$message.warning(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				} else {
					// 添加
					groupMsgMasterAdd(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
								this.dialogVisibleLoading=false;
							if(code == 'SUCCESS') {
								this.$message({
									type: 'success',
									message: msg,
									duration: 1500,
									onClose() {
										let params = {
											index: 'second'
										}
										that.$emit('tabIndex', params);
									}
								});
							} else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}
			},
			getPeopleNum () {
				this.dialogVisible2 = false;
				this.dialogVisibleLoading=true;
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					groupMsgMaster: {
						...this.form,
						executePlan: {
							'isTimingSend': this.form.executePlan.isTimingSend,
							sendTime: !this.form.executePlan.sendTime ? '' : this.form.executePlan.sendTime.split(' ')
						}
					}
				}
				if(this.id.length > 0) {
					// 修改
					params.groupMsgMaster.id = this.id;
					params.groupMsgMaster.version = this.version;
					let getPeopleNumParams = params;
//					console.log(JSON.stringify(params));
//					return false; 
					groupMsgMasterNum(params)
						.then((res) => {
							// console.log(res, 'lsjdflsjdf');
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// count = data.count,
							// msg = data.data;
							if(code == 'SUCCESS') {

								let info = `预计群发人数为: ${msg}, 确认发送?`;
								this.$confirm(info, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									this.handlePush(getPeopleNumParams, '修改');
								}).catch(() => {
									this.dialogVisibleLoading=false;
									this.$message({
										type: 'info',
										message: '已取消发送'
									});
								});

							} else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						})
				} else {
					// 添加
//					console.log(JSON.stringify(params), '入参');
//					return false;
					let getPeopleNumParams = params;
					groupMsgMasterNum(params)
						.then((res) => {
							// console.log(res, 'lsjdflsjdf');
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// count = data.count,
							// msg = data.data;
							if(code == 'SUCCESS') {

								let info = `预计群发人数为: ${msg}, 确认发送?`;
								this.$confirm(info, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									this.handlePush(getPeopleNumParams, '添加');
								}).catch(() => {
									this.dialogVisibleLoading=false;
									this.$message({
										type: 'info',
										message: '已取消发送'
									});
								});

							} else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						})
				}
			},
			onEditorChange(obj) { // 图文编辑器
				// console.log(this.form.content);
				this.form.content = obj.html
			}
		},
		created() {
			// 钩子函数 -- 初始化
			let that = this;
			if(this.getType){
				this.form.type=this.getType;
				this.getParamType=this.getType;
			}else{
				this.getParamType='';
			}
			let params='';
			if(this.getPageData){
				params = {
					userId: this.userInfo.userCode,
					...JSON.parse(this.getPageData)
				}
				if(this.getType=="已入会会员"){
					selectSendMember(params) 
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//	                      	console.log(JSON.stringify(data)+"已入会会员");
							that.membershipId = data.messageContent.key;
							that.membershipName = data.messageContent.value;
							that.form.groupObject.key = data.messageContent.key;
							that.form.groupObject.value = data.messageContent.value;
						})
						.catch(function(err) {
//							console.log(err);
						});
				}
				if(this.getType=="未入会粉丝"){
					selectSendNoMember(params) 
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//	                      	console.log(JSON.stringify(data)+"未入会粉丝");
							that.membershipId = data.messageContent.key;
							that.membershipName = data.messageContent.value;
							that.form.groupObject.key = data.messageContent.key;
							that.form.groupObject.value = data.messageContent.value;
						})
						.catch(function(err) {
//							console.log(err);
						});
				}
			}
			// 权限
			this.roleBtn = permission(this.roleBtn);
			params = {
				userId: this.userInfo.userCode
			}
			selectLevalInfo(params) //请求会员等级
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					//                      console.log(JSON.stringify(data)+"会员等级")
					that.levalInfo = data.data;
				})
				.catch(function(err) {
//					console.log(err);
				});
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getType() {
				return this.$route.params.type;
			},
			getPageData() {
				return this.$route.params.pageData;
			}
		},
		mounted() {
			// var vm =this
		    // var imgHandler = async function(state) {
			//     if (state) {
			//       //button is clicked
			// 		vm.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			//     }
		    // }
		    // vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
		},
		watch: {
			'childData': function(val, oldVal) {
				let params = {
					"userId" : this.userInfo.userCode,
					"id" : val.id
				}
				let that = this;
				I_SCRM_INTERFACE_842(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// console.log(JSON.stringify(msg), '842msg');
						let info = msg.groupMsgMaster;
						let contentType = info.contentType;
						let type868 = info.content.type;
						this.form = info;
						this.form.contentType = contentType; // 显示类别
						if(contentType == '图文信息') {
							if(type868 == '素材库') {
								// form.contentType == '图文信息' && !isShow && materialVisible		
								this.isShow = false;		
								this.materialVisible = true;
								this.editorQuillVisible = false;

								let id868 = info.content.txt
								let selectParams = {
									userId: this.userInfo.userCode,
									id: id868
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
										that.form = info;
										that.form.executePlan.sendTime = `${info.executePlan.sendTime[0]} ${info.executePlan.sendTime[1]}`
										that.id = info.id;
										that.version = info.version;
//										console.log(JSON.stringify(that.form), that.id, that.version, '查询到的数据');
									})
							}else if(type868 == '自建图文') {
								// form.contentType == '图文信息' && !isShow && editorQuillVisible
								this.isShow = false;
								this.materialVisible = false;
								this.editorQuillVisible = true;
							}
						}
					})
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

	.el-input {
		width: rem(400px);
	}
	.dialog-footer{
		text-align: center;
	}
	.el-form {
		// display: inline-block;
		// position: absolute;
		// margin-left: rem(20px);
	}
	.demo-form-member{
		.el-form-item {
			float: left;
		}
	}
	.sendButton{
		width: 104px;
		margin: 0 auto;
	}
	.searchContent{
		width:160px;
		margin-bottom: 10px;
	}
	.select-card {
		width: 29% !important;
		display: flex;
		justify-content: space-around;
		align-items: center;
		clear: both;
		div {
			display: inline-block;
			text-align: center;
			// lin-height:
			width: 300px;
			height: 180px;
			border: 1px solid #d2d2d2;
			padding-top: 50px;
			cursor: pointer;
			// margin: 10px;
			cursor: pointer;
		}
		div:first-child {
			/*margin-right: 7px;*/
		}
		i {
			font-size: 40px;
		}
	}

	.img-yxy {
		margin-left: 10px;
		font-size: 15px;
		line-height: 40px;
		margin-bottom: 10px;
		cursor: pointer;
		span {
			margin-right: 10px;
		}
	}
	.quillEditorBox {
		height: 250px;
		.quillEditor {
			width: 625px;
			height: 120px;
			margin-top: 10px;
		}
	}
	.textareaIpt {
		width: 29%;
		height: 218px;
		/*margin-bottom: 10px;*/
		.el-textarea__inner{
			height: 218px;
		}
	}
	.pageImg{
		width:40px;
		height:40px;
	}
	.pageImg img {
		width: 100%;
		height:100%
	}
	.groupPushForm{
		height: 370px;
		overflow-y: auto;
		padding-top:5px;
	}
	.noData{
		width:100%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 16px;
	}
	.groupWechatMaterialList{
		width: 250px;
	}
</style>
