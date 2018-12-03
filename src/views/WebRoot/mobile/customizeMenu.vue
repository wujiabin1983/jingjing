// 移动管理 - 自定义菜单
<template>
	<el-container class="app-container">
		<el-header>
			<h4>自定义菜单</h4>
		</el-header>
		<el-main class="container-main">
			<el-row v-loading="containerLoading">
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center"><div></div></el-header>
					<el-main class="mobileMain">
						<customMenu ref="customMenu" @clickType="handleClickType" @clickTarget="handleClickTarget" @handleEdit="handleTargetEdit" @handleEditSet="handleTargetEditSet" :clickName="form.name" :childType="radioClickType" :childContent="form.content" :childData="childData" @handleIndex="handleIndex"></customMenu>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>编辑菜单内容</span>
						<el-button @click="menuDelete" type="primary" size="mini">删除菜单</el-button>
					</el-header>
					<el-main>
						<el-form :model="form" :rules="rules" ref="form" label-width="94px" class="demo-form" v-if="isShow">
							<el-form-item label="菜单名称" prop="name">
								<el-input v-model="form.name" id="menuName" placeholder="请输入菜单名称" :disabled="disabledName"></el-input>
								<!-- <div class="form-item-msg">字数不得超过4个汉字或8个字母</div> -->
							</el-form-item>
							<el-form-item label="菜单内容" v-if="isContentShow" class="is-required">
								<div class="addMenu">
									<h5 class="margin0">添加菜单内容</h5>
									<div class="contentItem">
										<el-radio-group v-model="radioClickType"  @change="handleContentType" size="small">
											<el-radio label="文本消息" border><i class="el-icon-edit-outline"></i>文本消息</el-radio>
											<el-radio label="图文素材" id="graphicMaterial" border><i class="el-icon-document"></i>图文素材</el-radio>
											<el-radio label="外部链接" border><i class="el-icon-location-outline"></i>外部链接</el-radio>
											<el-radio label="会员功能" border><i class="el-icon-star-off"></i>会员功能</el-radio>
										</el-radio-group>
									</div>
								</div>
								<el-card v-if="radioClickType == '文本消息'">
									<el-input type="textarea" :rows="9" id="contentText" v-model="form.content" class="width100" resize="none"></el-input>
								</el-card>
								<el-card v-if="radioClickType == '图文素材'">
									<div>
										<div class="component" v-for="(item, index) in checked" :key="item.id" v-if="checked.length>0">
											<groupMaterialListShow :childDataLists="item" ref="groupMaterialListShow"></groupMaterialListShow>
										</div>
										<div v-else>暂无数据</div>
									</div>
								</el-card>
								<el-card v-if="radioClickType == '会员功能'">
									<el-form-item label="链接地址：">
										<el-input placeholder="请选择" v-model="selectUrl" :readonly="true" class="input-with-select">
											<!-- <template slot="prepend">https://</template> -->
											<el-dropdown slot="append" trigger="click" @command="handleLink">
												<el-button type="primary" id="dropLink">
													<i class="el-icon-more-outline"></i>
												</el-button>
												<el-dropdown-menu slot="dropdown" class="dropDownMenu">
													<el-dropdown-item v-for="item in customLink" :key="item.url" :command="item.name">{{item.name}}</el-dropdown-item>
												</el-dropdown-menu>
											</el-dropdown>
										</el-input>
									</el-form-item>
								</el-card>
								<el-card v-if="radioClickType == '外部链接'">
									<el-form-item label="链接地址：">
										<el-input placeholder="请输入链接地址" id="externalLinks" v-model="form.content" class="input-with-select">
											<!-- <template slot="prepend">https://</template> -->
										</el-input>
									</el-form-item>
								</el-card>

								<el-dialog width="80%" :visible.sync="dialogVisible">
									素材选择
									<groupMaterialList @parentMasterId="handleMasterId" ref="groupMaterialList" :selectValue="checked.length"></groupMaterialList>
									<span slot="footer" class="dialog-footer">
										<el-button @click="dialogVisible = false">取 消</el-button>
										<el-button type="primary" @click="handleDialogSure">确 定</el-button>
									</span>
								</el-dialog>
							</el-form-item>
							<!--<el-form-item label="菜单顺序" v-if="isOrderShow">
								<el-input-number v-model="form.order" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
								<span class="form-item-msg">数字越大排越上</span>
							</el-form-item>-->
						</el-form>
					</el-main>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="7" class="el-col-button">
					<el-button type="primary" @click="handleSubmit('save')" v-if="roleBtn.saveCustomizeMenuInfo">保存</el-button>
					<el-button type="primary" @click="handleSubmit('submit')" v-if="roleBtn.saveCustomizeMenuInfo">发布</el-button>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>
<script>// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from "@/api/platform/userGroup";
// import { customizeMenuShow } from '@/api/mobile/customizeMenu'
import { validateGetLength, validateGetLength2 } from '@/utils/validate';
import { customizeMenuShow, customizeMenuAdd, customizeMenuEdit, customizeSelect } from '@/api/mobile/customizeMenu'
		//344               691               346                343
import { mapGetters } from "vuex";
import { permission } from '@/utils'
import { customMenu } from '@/views/WebRoot/mobile'
import groupMaterialList from '@/views/WebRoot/mobile/component/groupMaterialList' // 图文素材
import groupMaterialListShow from '@/views/WebRoot/mobile/component/groupMaterialListShow'
import { getCustomLinksConstCustomize } from '@/api/public' // 外部链接
import { selectInfo, I_SCRM_INTERFACE_842 } from '@/api/mobile/groupMsgMaster'
const isGetLength = (rule, value, callback) => {
	if(validateGetLength(value)) {
		callback(new error('字数不得超过4个汉字或8个字母'))
	} else {
		callback()
	}
}
const isGetLength2 = (rule, value, callback) => {
	if(validateGetLength2(value)) {
		callback(new error('字数不得超过15个汉字或30个字母'))
	} else {
		callback()
	}
}
export default {
	data() {
		return {
			selectUrl: '',
			// 权限
			roleBtn: {
				saveCustomizeMenuInfo: false
			},
			containerLoading: false,
			clickType: '',
			// 数据
			headerSelect: "",
			isNavShow1: false,
			isNavShow2: false,
			isNavShow3: false,

			disabledName: true,
			form: {
				name: '',
				type: '',
				content: '',
				order: '',
				keyType:''
			},
			isShow: false, // 是否显示编辑菜单内容
			isContentShow: false, // 是否显示内容
			isOrderShow: false, // 是否显示排序
			childData: '', // 传递数据
			arrCa:'1111',
			pushParams: '', // 保存提交入参

			// 选择图文
			dialogVisible: false, //图文素材弹窗显隐标识
			checked: [], //存放选中的图文素材
			materialVisible: false,

			customLink: [],
			menuIndex: {
				mainIndex: '',
				subMenuIndex: ''
			},
			memberName:'',
			selectData:{},
			radioClickType:'文本',
		};
	},
	components: {
		customMenu,
		groupMaterialList,
		groupMaterialListShow
	},
	methods: {
		handleIndex(str) {
			//				console.log(JSON.stringify(str)+"菜单点击响应");//菜单点击响应
			this.menuIndex = str;
		},
		// 会员功能下拉框选择事件
		handleLink(str) {
			this.selectUrl = str;
			this.customLink.forEach((val, index) => {
				if(val.name == str) {
					this.form.content = val.url;
				}
			})
		},
		//			handleBack() {
		//				this.materialVisible = this.editorQuillVisible = false;
		//			},
		//监听菜单内容切换
		handleContentType(str) {
			if(str == '图文素材') {
				this.selectUrl = '';
				this.form.content = '';
				this.dialogVisible = true;
				this.form.type="click";
				this.form.keyType="图文";
			} else if(str == '文本消息') {
				this.selectUrl = '';
				this.form.content = '';
				this.form.type="click";
				this.form.keyType="文字";
				this.checked = [];
			} else if(str == '外部链接') {
				this.checked = [];
				this.selectUrl = '';
				this.form.content = '';
				this.form.type="view";
				this.form.keyType="";
			} else if(str == '会员功能') {
				this.checked = [];
				this.form.content = '';
				this.form.type="view";
				this.form.keyType="";
			}
		},
		// 从素材库中选择
		handleMasterId(str) {
//			console.log(JSON.stringify(str))
			this.selectData=str;
			if(this.form.content.indexOf(str.masterId) < 0) {
				this.form.content = str.data[0].id;
			}
			this.checked = []; //只能选择一个图文素材，所以需要先清空
			this.checked.push(str.data); //添加到存放图文素材的数组
		},
		handleDialogSure() {
			if(JSON.stringify(this.selectData)!="{}"&&this.checked.length==0){
				if(this.form.content.indexOf(this.selectData.masterId) < 0) {
					this.form.content = this.selectData.data[0].id;
				}
				this.checked = []; //只能选择一个图文素材，所以需要先清空
				this.checked.push(this.selectData.data); //添加到存放图文素材的数组
			}
			this.dialogVisible = false;
			this.materialVisible = true;
//			this.$refs.groupMaterialList.handleCommit();
		},
		//点击菜单获取菜单类型
		handleClickType(type) {
			// 有子菜单的主菜单
			// 主菜单添加按钮
			// 无子菜单的主菜单
			// 到达添加上线，禁止添加
			// 添加
			// 子菜单
//			console.log("菜单类型:"+type);
			this.clickType = type;
			if(type == '有子菜单的主菜单') {
				this.isShow = true;
				this.isContentShow = false;
				this.isOrderShow = false;
			}
			if(type == '无子菜单的主菜单') {
				this.isShow = true;
				this.isContentShow = true;
				this.isOrderShow = false;
			}
			if(type == '主菜单添加按钮') {
				this.isShow = false;
			}
			if(type == '添加') {
				this.isShow = false;
				this.isContentShow = true;
				this.isOrderShow = true;
			}
			if(type == '子菜单') {
				this.isShow = true;
				this.isContentShow = true;
				this.isOrderShow = true;
			}
		},
		//点击菜单获取菜单名字
		handleClickTarget(name) {
//			console.log("菜单名字:"name);
			this.form.name = name;
			this.radioClickType = '';
			this.disabledName = false;
		},
		//点击菜单获取菜单信息
		handleTargetEdit(obj) {
//			console.log(obj+"菜单信息")
			let type = this.menuIndex.type;
			let mainIndex = this.menuIndex.mainIndex;
			let subMenuindex = this.menuIndex.subMenuIndex;
			this.pushParams = JSON.parse(obj);
//			console.log("菜单类型主菜单main/子菜单subMenu："+type);
//			console.log("主菜单下标："+mainIndex);
//			console.log("子菜单下标："+subMenuindex);
			let menu = JSON.parse(obj).menuJson.button;
			if(type == 'main') {
				let mainMenu = menu[mainIndex],
					subMenuindex;
//				console.log(JSON.stringify(mainMenu)+"回显");
				if(mainMenu.type == 'view') {
					if(typeof mainMenu.url != 'undefined') {
						if(mainMenu.url.indexOf('open.weixin.qq.com') >= 0) {
							this.radioClickType = '会员功能';
						} else {
							this.radioClickType = '外部链接';
						}
					}
				} else if(mainMenu.type == 'click'&&mainMenu.keyType=="文字") {
					if(!this.form.content) {
						this.radioClickType = '文本消息';
						this.form.content = '';
					} else {
						this.radioClickType = '文本消息';
						this.form.content = subMenu.content;
					}
				} else if(mainMenu.type == 'click'&&mainMenu.keyType=="图文") {
					this.radioClickType = '图文素材';
					this.form.content = mainMenu.content;
					this.showGraphicMaterial(mainMenu.content);
				}
			} else if(type == 'subMenu') {
				let subMenu = menu[mainIndex].sub_button[subMenuindex];
//				console.log(JSON.stringify(subMenu)+"回显");
				if(subMenu.type == 'view') {
//					console.log(subMenu.url.indexOf('open.weixin.qq.com' >= 0))
					if(typeof subMenu.url != 'undefined') {
						if(subMenu.url.indexOf('open.weixin.qq.com') >= 0) {
							this.radioClickType = '会员功能';
							this.customLink.forEach((val,index)=>{
								if(val.url==subMenu.url){
									this.selectUrl=val.name;
								}
							})
						} else {
							this.radioClickType = '外部链接';
						}
						this.form.content = subMenu.url;
					}
				} else if(subMenu.type == 'click'&&subMenu.keyType=="文字") {
					if(!subMenu.content) {
						this.radioClickType = '文本消息';
						this.form.content = '';
					} else {
						this.radioClickType = '文本消息';
						this.form.content = subMenu.content;
					}
				} else if(subMenu.type == 'click'&&subMenu.keyType=="图文") {
					this.radioClickType = '图文素材';
					this.form.content = subMenu.content;
					this.showGraphicMaterial(subMenu.content);
				}
			}
		},
		//根据图文素材id返回图文信息
		showGraphicMaterial(id) {
			let that = this;
			let selectParams = {
				"userId": this.userInfo.userCode,
				"id": id
			}
			selectInfo(selectParams)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					let msg1 = [];
					msg1.push(msg);
					that.checked = [];
					that.checked.push(msg1);
				})
		},
		//设置子组件传值给父组件
		handleTargetEditSet(obj) {
			this.pushParams = JSON.parse(obj);
		},
		menuDelete() { // 删除菜单
			this.childData = '删除' + new Date().getTime();
			this.isShow=false;
		},
		handleSubmit(type) { // 保存并发布
			this.childData = '保存并发布';
			let submitFlag = true;
			if(!this.isShow) {
				this.$message('请选择菜单');
				return false;
			} else {
				this.$refs.form.validate((valid) => {
					if(valid) {
//						console.log(JSON.stringify(this.form))
						if(this.form.name!=""){
							let letterReg=/^[a-zA-Z]{1,8}$/;
							let ChineseReg=/^[\u4e00-\u9fa5]{1,4}$/;
							let count = 0;
							if(!letterReg.test(this.form.name)){
								count++;
							}
							if(!ChineseReg.test(this.form.name)){
								count++;
							}
							if(count>1){
								this.$message.warning('菜单名称最多可输入四个汉字或8个英文字母！');
						    	setTimeout(() => {
									$("#menuName").focus();
						      	}, 2000)
								submitFlag = false;
							}
						}
						if(!submitFlag){
							return false;
						}
						if(this.radioClickType == "文本消息") {
							if(this.form.content == "") {
								this.$message.warning('请输入文本消息！');
						    	setTimeout(() => {
									$("#contentText").focus();
						      	}, 2000)
								submitFlag = false;
							}
						}
						if(this.radioClickType == "图文素材") {
							if(this.form.content == "") {
								this.$message.warning('请选择图文素材！');
						    	setTimeout(() => {
									$("#graphicMaterial").click();
						      	}, 3000)
								submitFlag = false;
							}
						}
						if(this.radioClickType == "外部链接") {
							if(this.form.content == "") {
								this.$message.warning('请输入外部链接地址！');
						    	setTimeout(() => {
									$("#externalLinks").focus();
						      	}, 3000)
								submitFlag = false;
							}else{
								let urlReg = /^(https?|http?):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
								if(!urlReg.test(this.form.content)){
									this.$message.warning('请输入正确的地址(需加上http/https)！');
							    	setTimeout(() => {
										$("#externalLinks").focus();
							      	}, 3000)
									submitFlag = false;
								}
							}
						}
						if(this.radioClickType == "会员功能") {
							if(this.form.content == "") {
								this.$message.warning('请选择会员功能！');
						    	setTimeout(() => {
									$("#dropLink").click();
						      	}, 3000)
								submitFlag = false;
							}
						}
						if(!submitFlag){
							return false;
						}
//						console.log(JSON.stringify(this.form));
//						console.log(JSON.stringify(this.pushParams) + "入参");
						if(sessionStorage.getItem("listSort1")){
//							console.log(JSON.stringify(this.pushParams) + "入参");
							this.pushParams.menuJson.button[0].sub_button=JSON.parse(sessionStorage.getItem("listSort1"));
							this.pushParams.menuJson.button[0].sub_button.forEach((val,index)=>{
								if(val.type=="click"){
									this.pushParams.menuJson.button[0].sub_button[index].key='rselemenu_'+0+'_'+index;
								}else{
									delete this.pushParams.menuJson.button[0].sub_button[index].keyType;
								}
							})
						}
						if(sessionStorage.getItem("listSort2")){
							this.pushParams.menuJson.button[1].sub_button=JSON.parse(sessionStorage.getItem("listSort2"));
							this.pushParams.menuJson.button[1].sub_button.forEach((val,index)=>{
								if(val.type=="click"){
									this.pushParams.menuJson.button[1].sub_button[index].key='rselemenu_'+1+'_'+index;
								}else{
									delete this.pushParams.menuJson.button[1].sub_button[index].keyType;
								}
							})
						}
						if(sessionStorage.getItem("listSort3")){
							this.pushParams.menuJson.button[2].sub_button=JSON.parse(sessionStorage.getItem("listSort3"));
							this.pushParams.menuJson.button[2].sub_button.forEach((val,index)=>{
								if(val.type=="click"){
									this.pushParams.menuJson.button[2].sub_button[index].key='rselemenu_'+2+'_'+index;
								}else{
									delete this.pushParams.menuJson.button[2].sub_button[index].keyType;
								}
							})
						}
						this.pushParams.menuJson.button.forEach((v,i)=>{
							if(v.sub_button.length>0){
								v.sub_button.forEach((value,index)=>{
									if(value.name=="+"){
										this.pushParams.menuJson.button[i].sub_button.splice(index,1);
									}
									if(value.type=="view"){
										delete this.pushParams.menuJson.button[i].sub_button[index].content;
									}
								})
								if(v.sub_button.length>1||v.sub_button[0].name!="+"){
									delete this.pushParams.menuJson.button[i].keyType;
									delete this.pushParams.menuJson.button[i].type;
									delete this.pushParams.menuJson.button[i].content;
									delete this.pushParams.menuJson.button[i].url;
									delete this.pushParams.menuJson.button[i].key;
								}
							}
						})
//						console.log(JSON.stringify(this.pushParams) + "入参");
//						return false;
						this.containerLoading = true;
						if(type=="save"){
							customizeMenuAdd(this.pushParams)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent,
										val = data.valueObj;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										// this.$refs.customMenu.handleShow();
										this.$router.replace({
											name: '自定义菜单',
											query: {
												time: +new Date()
											},
										});
										sessionStorage.removeItem("listSort1");
										sessionStorage.removeItem("listSort2");
										sessionStorage.removeItem("listSort3");
										this.containerLoading = false;
									} else {
										this.$message.warning(msg);
										this.$router.replace({
											name: '自定义菜单',
											query: {
												time: +new Date()
											},
										});
										this.containerLoading = false;
									}
								})
								.catch((err) => {
	//								console.log(err);
									this.containerLoading = false;
								});
						}
						if(type=="submit"){
							customizeMenuEdit(this.pushParams)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent,
										val = data.valueObj;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										// this.$refs.customMenu.handleShow();
										this.$router.replace({
											name: '自定义菜单',
											query: {
												time: +new Date()
											},
										});
										sessionStorage.removeItem("listSort1");
										sessionStorage.removeItem("listSort2");
										sessionStorage.removeItem("listSort3");
										this.containerLoading = false;
									} else {
										this.$message.warning(msg);
										this.$router.replace({
											name: '自定义菜单',
											query: {
												time: +new Date()
											},
										});
										this.containerLoading = false;
									}
								})
								.catch((err) => {
	//								console.log(err);
									this.containerLoading = false;
								});
						}
					} else {
						// console.log('warning submit!!');
					}
				});
			}
		}
	},
	created() {
		// 权限
		this.roleBtn = permission(this.roleBtn);
		// 钩子函数 -- 初始化
		let params = {
			userId: this.userInfo.userCode
		}
		//获取品牌信息
		customizeSelect(params)
			.then((res) => {
				let data = JSON.parse(Base64.decode(res.data)),
					code = data.messageType,
					msg = data.messageContent;
				//					console.log(JSON.stringify(data)+"品牌信息");
				if(code == 'SUCCESS') {
					this.headerSelect = msg.brandName;
				} else {
					this.$message.warning(msg);
				}
			})
		//自定义链接数组
		params = {
			userId: this.userInfo.userCode
		}
		getCustomLinksConstCustomize(params).then((res) => {
			let data = JSON.parse(Base64.decode(res.data)),
				code = data.messageType,
				msg = data.messageContent;
			//console.log(JSON.stringify(data)+ '自定义链接')
			if(code == 'SUCCESS') {
				this.customLink = msg;
			} else {
				this.$message.warning(msg);
			}
		})
	},
	computed: {
		// 计算属性
		...mapGetters(["userInfo"]),
		rules() {
			let rules = {
				name: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}
				]
			};
			return rules;
		}
	},
	watch: {
		deep: true,
	}
};</script>
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width:480px!important;
}

.el-form {
	margin: 10px;
}

.el-input {
	width: 40%;
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
	height: 440px;
}

.contentItem span {
	margin-right: rem(10px);
	cursor: pointer;
}

.form-item-msg {
	font-size: rem(12px);
	color: #999;
}

.addMenu {
	margin-bottom: 10px;
}

.dropDownMenu {
	height: 270px;
	overflow-x: hidden;
	overflow-y: scroll;
}

.input-with-select {
	width: 280px;
}

.mobileMain {
	position: relative;
	overflow: hidden;
	padding-bottom: 10px;
}

.el-input-group__prepend {
	width: 2rem!important;
}
.dsh-header{
	display: flex;
	justify-content: space-between;
}
.margin0{
	margin: 0;
}
</style>