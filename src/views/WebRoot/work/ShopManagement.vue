<!--导购管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline">
					<div class="floatRight">
						<el-form-item label="组织" class="el-form-item-Q">
							<el-input v-model="storeArr" placeholder="请选择" readonly="readonly"></el-input>
							<el-button type="primary" @click="selectOrganization">选择</el-button>
						</el-form-item>
						<el-form-item label="">
							<el-input v-model="form.nameOrMobile" placeholder="请输入姓名或手机号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="userCode" label="员工工号"></el-table-column>
					<el-table-column prop="userName" label="员工姓名"></el-table-column>
					<el-table-column prop="mobile" label="手机号码"></el-table-column>
					<el-table-column prop="storeId" label="门店编码"></el-table-column>
					<el-table-column prop="wechatNum" label="微信号码"></el-table-column>
					<el-table-column prop="isGuide" label="是否为营销导购"></el-table-column>
					<el-table-column prop="memberNum" label="消费者数"></el-table-column>
					<el-table-column prop="action" label="操作" width="130">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateGuideInfo">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="离职" placement="top" v-if="roleBtn.quitGuideInfo">
								<!-- 离职 -->
								<i class="iconfont icon-renyuanlikai" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="lizhi" id="icon-lizhi" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="入会邀请码" placement="top" v-if="roleBtn.quitGuideInfo&&scope.row.isGuide=='是'">
								<!-- 入会邀请码 -->
								<i class="iconfont icon-erweima" @click.prevent="iconInviteInvitation (scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="yaoqing" id="icon-yaoqing" @click.native.prevent="iconInviteInvitation (scope.$index, scope.row)" /> -->
							</el-tooltip>
							<!-- 设为营销导购 -->
							<el-switch
						 		v-if="roleBtn.addGuideInfo"
						  		v-model="scope.row.isGuide1"
						  		@change="iconMarketingEnvironment(scope.$index, scope.row)"
							 	active-color="#13ce66"
							  	inactive-color="#eee" class="isGuide">
							</el-switch>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
			<el-dialog title="" :visible.sync="handleTabDialog" class="transfer">
				<template>
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="门店" name="first">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
						<el-tab-pane label="店组" name="second">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
						<el-tab-pane label="区域" name="third">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
					</el-tabs>
				</template>
				<div slot="footer" class="dialog-footer">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="" :visible.sync="setLoginDialog" :show-close="false" v-loading="setLoginDialoading" @close="tableLoading=false" class="box40">
				<el-form :model="setLogin" ref="setLogin" :rules="setLoginRules" class="setLogin">
					<el-form-item label="原登录账号：" prop="oldLoginId" :label-width="formLabelWidth">
						<el-input v-model="setLogin.oldLoginId" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="新登录账号：" prop="newLoginId" :label-width="formLabelWidth">
						<el-input v-model="setLogin.newLoginId" placeholder="请输入新登录账号"></el-input>
					</el-form-item>
					<el-form-item label="验证码：" prop="verificationCode" :label-width="formLabelWidth" class="vCodeForm">
						<el-input v-model="setLogin.verificationCode" placeholder="请输入验证码" class="getVerificationCode"></el-input>
						<el-button type="primary" @click="getVerificationCode" id="getCodeBtn">获取验证码</el-button>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="setLoginDialog = false,tableLoading = false">取 消</el-button>
					<el-button type="primary" @click="setLoginFn">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="入会邀请码" :visible.sync="invitationUrlDialog" class="boxImg">
				<img :src="invitationUrl" alt="" class="invitationUrl" v-if="invitationUrl">
				<p v-else>暂无入会邀请码</p>
				<div slot="footer" class="dialog-footer">
					<el-button @click="invitationUrlDialog = false">取 消</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectStoreManagement, marketingEnvironment,dimission } from '@/api/work/ShopManagement'
	import { getVerification, setLoginF } from '@/api/base/staffManagement'
	import { mapGetters } from 'vuex'
	import { validateMobile } from '@/utils/validate';
	import { selectProCityArea, selectRoleData, selectTabData } from '@/api/public'
	const isMobile = (rule, value, callback) => {
		if(!validateMobile(value)) {
			callback(new Error('请输入正确的手机号码'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				isGuide:false,
				invitationUrl:'',
				// 权限
				roleBtn: {
					addGuideInfo:false,
					updateGuideInfo:false,
					quitGuideInfo:false
				},
				invitationUrlDialog:false,
				setLoginDialoading:false,
				formLabelWidth: '120px',
				code: false,
				setLoginDialog: false,
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
				//修改
				setLogin: {
					id: '',
					version: '',
					oldLoginId: '',
					newLoginId: '',
					verificationCode: ''
				},
				setLoginRules: {
					newLoginId: [{
							required: true,
							message: '请输入手机号',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						{
							validator: isMobile,
							type: 'change'
						}
					],
					verificationCode: [{
						required: true,
						message: '请输入验证码',
						trigger: 'change'
					}]
				},
				// 搜索数据
				form: {
					nameOrMobile: '',
					storeId: ''
				},
				// 表格数据
				tableData: [],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				// 活动分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
			onReset(){
				this.form = {
					nameOrMobile: '',
					storeId: ''
				};
				this.data2=[];
				this.value2=[];
				this.storeArr='';
			},
			// 活动列表分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			//点击查询的 选择组织
			selectOrganization() {
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
				this.searchStoreTab();
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
				idArray = idArray.substr(0, idArray.length - 1);
				nameArray = nameArray.substr(0, nameArray.length - 1);
				this.storeArr = nameArray;
				this.form.storeId = idArray;
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
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form);
			},
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					storeId: searchContent.storeId,
					nameOrMobile: searchContent.nameOrMobile
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectStoreManagement(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						if(data.data) {
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val,
									isGuide1:val.isGuide=="是"
								});
							})
							that.count=data.count;
							that.tableData = result;
							that.tableLoading = false;
						} else if(data.messageType != 'SUCCESS') {
							that.$message.warning(data.messageContent);
							that.tableLoading = false;
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				//				console.log(JSON.stringify(row));//所点击行的数据
				this.tableLoading = true;
				this.setLoginDialog = true;
				this.setLogin.id = row.id;
				this.setLogin.version = row.version;
				this.setLogin.oldLoginId = row.loginId;
			},
			//登录变更确认
			setLoginFn() {
				$("#getCodeBtn").removeAttr("disabled");
				$("#getCodeBtn").css({
					"cursor": "pointer"
				});
				$("#getCodeBtn span").css({
					"cursor": "pointer"
				});
				let that = this;
				let param = {
					"userId": that.userInfo.userCode,
					"id": that.setLogin.id,
					"version": that.setLogin.version,
					"oldLoginId": that.setLogin.oldLoginId,
					"newLoginId": that.setLogin.newLoginId,
					"verificationCode": that.setLogin.verificationCode
				}
				//				console.log(param)
				that.$refs.setLogin.validate((valid) => {
					if(valid) {
						this.setLoginDialoading = true;
						setLoginF(param)
							.then((res) => {
								//								console.log(res)
								let data = JSON.parse(Base64.decode(res.data));
								if(data.messageType == 'SUCCESS') {
									that.setLoginDialog = false;
									that.tableLoading = false;
									that.setLoginDialoading = false;
									that.$message.success(data.messageContent);
									that.showTable(that.page, that.limit, that.form);
									that.setLogin= {
										id: '',
										version: '',
										oldLoginId: '',
										newLoginId: '',
										verificationCode: ''
									};
								} else {
									that.setLoginDialoading = false;
									that.tableLoading = false;
									that.$message.warning(data.messageContent);
								}
							})
							.catch((err) => {
								that.setLoginDialoading = false;
								that.setLoginDialog = false;
								that.tableLoading = false;
								// console.log(err);
							});
					}
				})
			},
			//获取验证码
			getVerificationCode() {
				if(this.setLogin.newLoginId == "") {
					this.$message({
						message: '请输入手机号',
						type: 'warning'
					});
					return false;
				}
				let that = this;
				let params = {
					mobile: this.setLogin.newLoginId
				}
				var t = '';
				// 使表格加载
				//				console.log(params)
				// 查询接口
				getVerification(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//												console.log(data)
						if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
							that.code = true;
						} else {
							that.$message({
								message: "发送成功！",
								type: 'success'
							});
							//							document.querySelector("#getCodeBtn span").innerHTML = '12';
							$("#getCodeBtn").attr("disabled", "true");
							$("#getCodeBtn span").html('59');
							$("#getCodeBtn span").css({
								"cursor": "default"
							});
							var time = parseInt($("#getCodeBtn span").html());
							t = setInterval(function() {
								time = time - 1;
								$("#getCodeBtn span").html(time);
								if(time <= 0) {
									clearInterval(t);
									that.code = false;
									$("#getCodeBtn span").html('获取验证码');
									$("#getCodeBtn").removeAttr("disabled");
									$("#getCodeBtn").css({
										"cursor": "pointer"
									});
									$("#getCodeBtn span").css({
										"cursor": "pointer"
									});
								}
							}, 1000);
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			// 图标 - 离职
			iconShanchu(index, row) {
				let that = this;
				that.tableLoading = true;
				this.$confirm('您确定要对该员工进行离职操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						userId: this.userInfo.userCode,
						params: [{
							id: row.id,
							version: row.version
						}]
					};         
//					console.log(param)
					dimission(param)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//						    console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.form);
								that.tableLoading = false;
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err+"err1");
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			//入会邀请
			iconInviteInvitation(index,row){
//				console.log(row.invitationUrl);
				this.invitationUrl=row.invitationUrl;
				this.invitationUrlDialog=true;
			},
			// 设为营销导购
			iconMarketingEnvironment(index, row) {
				let that = this;
				that.tableLoading = true;
				let str ='';
				if(row.isGuide=="是"){
					str ='您确定要取消该员工为营销导购吗?';
				}else{
					str ='您确定要设置该员工为营销导购吗?';
				}
				this.$confirm(str, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						userId: this.userInfo.userCode,
						isGuide:row.isGuide=="是"?"否":"是",
						id: row.id,
						version: row.version
					};
//					console.log(JSON.stringify(param))
					marketingEnvironment(param)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//							console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.showTable(that.page, that.limit, that.form);
								that.$message.success(data.messageContent);
								that.tableLoading = false;
							} else {
								that.showTable(that.page, that.limit, that.form);
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
//							 console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
					that.showTable(that.page, that.limit, that.form);
				});
			},
		},
		created() {
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.isGuide{
		bottom: 4px;
	}
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
		}
		.el-input{
			width: 150px;
		}
	}
	.el-dialog {
		width: 40%!important;
	}
	
	.box40 .el-dialog .el-form,
	.box30 .el-dialog .el-form,
	.boxImg .el-dialog .el-form {
		position: inherit;
	}
	.box30 .el-dialog .role {
		height: 100px;
		width: 100%;
	}
	.setLogin{
		display: inline-block;
	}
	.setLogin .el-form-item{
		margin-top: 25px;
	}
	.setLogin .el-input {
		width: 220px
	}
	
	.setLogin .getVerificationCode {
		width: 110px
	}
	
	.setLogin .vCodeForm {
		position: relative;
	}
	
	.setLogin .vCodeForm .el-button {
		position: absolute;
		right: 0;
		top: 1px;
	}
	
	
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.invitationUrl{
		width:300px;
		height:300px;
		margin: 0 auto
	}
</style>