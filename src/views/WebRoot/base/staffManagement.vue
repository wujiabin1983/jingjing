<!--员工管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.selectEmployeeInfo || roleBtn.addEmployeeInfo || roleBtn.exportEmployeeInfo || roleBtn.authorEmployeeInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectEmployeeInfo">
					<div class="floatRight">
						<el-form-item label="组织" class="el-form-item-Q">
							<el-input v-model="storeArr" class="input140" placeholder="请选择" readonly="readonly"></el-input>
							<el-button type="primary" @click="storeClick">选择</el-button>
						</el-form-item>
						<el-form-item label="员工类型" class="el-form-item-Q">
							<el-select v-model="form.userType" class="input140" clearable placeholder="请选择">
								<el-option label="商户用户" value="商户用户"></el-option>
								<el-option label="品牌用户" value="品牌用户"></el-option>
								<el-option label="片区用户" value="片区用户"></el-option>
								<el-option label="店群用户" value="店群用户"></el-option>
								<el-option label="门店用户-店长" value="门店用户-店长"></el-option>
								<el-option label="门店用户-导购" value="门店用户-导购"></el-option>
								<el-option label="门店用户-收银员" value="门店用户-收银员"></el-option>
								<el-option label="门店用户-其他" value="门店用户-其他"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="" class="el-form-item-Q">
							<el-select v-model="form.roleTypeName" class="input140" @change="rolesSelect" clearable placeholder="权限角色">
								<el-option v-for="item in roleOptions" :key="item.value" :label="item.key" :value="item.key">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="状态" class="el-form-item-Q">
							<el-select v-model="form.status" clearable placeholder="请选择">
								<el-option label="激活" value="激活"></el-option>
								<el-option label="停用" value="停用"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="el-form-item-Q">
							<el-input v-model="form.paramsCode" class="input140" placeholder="请输入工号、姓名"></el-input>
						</el-form-item>
					</div>
					<div class="select-btn-style">
						<el-form-item class="el-form-item-Q">
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
			<el-card v-if="roleBtn.addEmployeeInfo || roleBtn.exportEmployeeInfo || roleBtn.authorEmployeeInfo">
				<el-button type="primary" @click="addTable" v-if="roleBtn.addEmployeeInfo">新增员工</el-button>
				<el-button type="primary" @click="importData" :disabled="expoirtDis" v-if="roleBtn.exportEmployeeInfo">导出</el-button>
				<el-button type="primary" @click="setJurisdiction" v-if="roleBtn.authorEmployeeInfo">批量设置权限</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-if="userInfo.userType=='EMPLOYEE'" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="userCode" label="员工编号"></el-table-column>
					<el-table-column prop="userName" label="员工姓名"></el-table-column>
					<el-table-column prop="userType" label="员工类型"></el-table-column>
					<el-table-column prop="storeName" label="所属门店">
						<template slot-scope="scope" >
	                    	<el-popover trigger="hover" placement="top">
					          <p> {{ scope.row.storeName }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.storeName }}</el-tag>
					          </div>
					        </el-popover>
			            </template>
					</el-table-column>
					<el-table-column prop="status" width="50" label="状态"></el-table-column>
					<el-table-column prop="loginId" label="登录账号"></el-table-column>
					<el-table-column prop="roleTypeName" label="员工权限"></el-table-column>
					<el-table-column prop="action" width="120" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateEmployeeInfo&&scope.row.userType!='商户用户'">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="登录变更" placement="top" v-if="roleBtn.uploginEmployeeInfo">
								<!-- 登录变更 -->
								<i class="iconfont icon-member" @click.prevent="iconQueren(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="qiehuan" id="icon-qiehuan" @click.native.prevent="iconQueren(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteEmployeeInfo&&scope.row.userType!='商户用户'	">
								<!-- 删除 -->
								<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<el-table ref="tableData" v-if="userInfo.userType=='SELLER'" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="userCode" label="员工编号"></el-table-column>
					<el-table-column prop="userName" label="员工姓名"></el-table-column>
					<el-table-column prop="userType" label="员工类型"></el-table-column>
					<el-table-column prop="brandName" label="所属品牌"></el-table-column>
					<el-table-column prop="status" width="50" label="状态"></el-table-column>
					<el-table-column prop="loginId" label="登录账号"></el-table-column>
					<el-table-column prop="roleTypeName" label="员工权限"></el-table-column>
					<el-table-column prop="action" width="120" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateEmployeeInfo&&scope.row.userType!='商户用户'">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="登录变更" placement="top" v-if="roleBtn.uploginEmployeeInfo">
								<!-- 登录变更 -->
								<icon-svg icon-class="qiehuan" id="icon-qiehuan" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteEmployeeInfo&&scope.row.userType!='商户用户'	">
								<!-- 删除 -->
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background  class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>

			<el-dialog title="权限分配" :visible.sync="handleStoreDialog" v-loading="setJurisdictionLoading" class="box30">
				<el-form :model="roleForm" ref="setJurisdiction" :rules="roleRules" class="role">
					<el-form-item label="权限角色" prop="role">
						<el-select v-model="roleForm.roleTypeName" placeholder="请选择角色" class="setJurisdiction" @change="roleSelect">
							<el-option v-for="item in roleOptions" :key="item.key" :label="item.key" :value="item.index">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="handleStoreDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterJurisdiction">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="登录变更" :visible.sync="setLoginDialog" @close="tableLoading=false" v-loading="setLoginDialoading" class="box40">
				<el-form :model="setLogin" ref="setLogin" :rules="setLoginRules" class="setLogin">
					<el-form-item label="原登录账号：" prop="oldLoginId" :label-width="formLabelWidth">
						<el-input v-model="setLogin.oldLoginId" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="新登录账号：" prop="newLoginId" :label-width="formLabelWidth">
						<el-input v-model="setLogin.newLoginId" placeholder="请输入新登录账号"></el-input>
					</el-form-item>
					<!--<el-form-item label="验证码：" prop="verificationCode" :label-width="formLabelWidth" class="vCodeForm">
						<el-input v-model="setLogin.verificationCode" placeholder="请输入验证码" class="getVerificationCode"></el-input>
						<el-button @click="getVerificationCode" id="getCodeBtn">获取验证码</el-button>
					</el-form-item>-->
				</el-form>
				<div slot="footer" class="dialog-footer" >
					<el-button @click="setLoginDialog = false,tableLoading=false">取 消</el-button>
					<el-button type="primary" @click="setLoginFn">确 定</el-button>
				</div>
			</el-dialog>
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
							<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'index',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
						<el-tab-pane label="店组" name="second">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'index',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
						<el-tab-pane label="区域" name="third">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'index',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
					</el-tabs>
				</template>
				<div slot="footer" class="dialog-footer">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectStaffManagement, jurisdictionStaff, addStaffManagement, getVerification, setStaffManagement, delectStaffManagement, setLoginF, exportData } from '@/api/base/staffManagement'
	import { mapGetters } from 'vuex'
	import { selectProCityArea, selectRoleData, selectTabData } from '@/api/public'
	import { validateMobile } from '@/utils/validate';
	import Cookie from 'js-cookie'
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
				expoirtDis:false,//导出只读标识
				setLoginDialoading: false,//登录表格请求加载窗
				setJurisdictionLoading: false,//权限分配请求加载窗
				// 权限
				roleBtn: {
					selectEmployeeInfo: false,
					addEmployeeInfo: false,
					updateEmployeeInfo: false,
					deleteEmployeeInfo: false,
					authorEmployeeInfo: false,
					uploginEmployeeInfo: false,
					exportEmployeeInfo: false
				},
				handleTabDialog: false,//选择门店弹窗标识
				storeArr: '',//显示所选择的门店
				tabType: '门店',//选择门店弹窗tabs页签类型
				activeName: 'first',//选择门店弹窗tabs页签类型
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
				//权限分配弹出提交数据
				roleForm: {
					roleType: '', //角色代码
					roleTypeName: '' //角色名称
				},
				roleTypeName: '',
				//角色下拉请求
				roleOptions: [],
				setLoginDialog: false,
				handleStoreDialog: false,
				formLabelWidth: '120px',
				code: false,
				// 搜索数据
				form: {
					userType: '',
					status: '',
					roleTypeName: '',
					storeId: '',
					paramsCode: ''
				},
				setLogin: {
					id: '',
					version: '',
					oldLoginId: '',
					newLoginId: '',
					verificationCode: ''
				},
				// 表格数据
				tableData: [],
				//				{
				//					loginId: '', //登录账号
				//					password: '', //密码
				//					userCode: '', //员工编号
				//					userName: '', //员工姓名
				//					userHeaderUrl: '', //员工头像URL	--------
				//					storeAliasName: '', //所属门店
				//					storeUrl: '', //状态
				//					age: '', //年龄	
				//					sex: '', //性别				---------
				//					birthDate: '', //出生日期
				//					entryDate: '', //入职日期		--------
				//					userType: '', //员工类型
				//					roleTypeName: '', //所属角色名称
				//					storeId: '', //门店编码
				//					storeName: '', //门店名称
				//					specialSignature: '', //个性签名
				//					documentType: '', //证件类型
				//					idNumber: '', //证件号码
				//					status: '', //状态
				//					workAddress: '', //工作地址
				//					brandId: '', //品牌编码
				//					brandName: '' //品牌名称
				//				}
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,//表格加载窗
				roleRules: {
					roleId: [{
						required: true,
						message: '请选择角色',
						trigger: 'change'
					}]
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
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			onReset() {
				this.form = {
					userType: '',
					status: '',
					roleTypeName: '',
					storeId: '',
					paramsCode: ''
				};
				this.storeArr = '';
				this.roleTypeName = '';
			},
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
				var nameArray = '';
				var that = this;
				this.dataIndex.forEach((val, index) => {
					nameArray += that.data2[val].storeName + ",";
					this.storeArr = nameArray;
				})
				this.handleTabDialog = false;
			},
			//监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var that = this;
				this.dataIndex = val;
				val.forEach((val, index) => {
					idArray += that.data2[val].storeId + ",";
				})
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
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
//				console.log(JSON.stringify(this.form));
				this.showTable('', this.limit, this.form);
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
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
						//						console.log(data)
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
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					...searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				//				console.log(params)
				// 查询接口
				selectStaffManagement(params)
					.then(function(res) {
						//						console.log(res)
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(!data.messageType) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			//导出数据
			importData() {
				let params = '';
				this.multipleSelection.forEach((val, index) => {
					params += val.id + ',';
				})
				var param = {
					"userId": this.userInfo.userCode,
					"params": params,
					"shelvesStatus": this.form.shelvesStatus,
					"searchContent": this.form.searchContent
				}
				//				console.log(param);
				this.expoirtDis=true;
				this.tableLoading = true;
				exportData(param)
					.then((res) => {
						//						console.log(JSON.stringify(res) + "导出返回值");
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							this.expoirtDis=false;
							this.tableLoading = false;
							window.location.href = Cookie.get("baseUrl") + data.messageContent;
						} else {
							this.expoirtDis=false;
							this.tableLoading = false;
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.tableLoading = false;
						this.expoirtDis=false;
						// console.log(err);
					});
			},
			// 添加请求后台
			handleAddSellerInfo(formData) {
				//				console.log(JSON.stringify(formData));
				this.tableLoading = true;
				var that = this;
				addStaffManagement(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(data)
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.getPageType = '';
							that.showTable(this.page, this.limit, this.form);
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 修改请求后台
			handleUpdateSellerInfo(formData) {
				this.tableLoading = true;
				var that = this;
				setStaffManagement(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.getPageType = '';
							that.showTable(this.page, this.limit, this.form);
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '员工管理员工管理查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '员工管理员工管理修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 图标 - 登录变更
			iconQueren(index, row) {
				//				console.log(JSON.stringify(row));//所点击行的数据
				this.tableLoading = true;
				this.setLoginDialog = true;
				this.setLogin.id = row.id;
				this.setLogin.version = row.version;
				this.setLogin.oldLoginId = row.loginId;
			},
			//登录变更确认
			setLoginFn() {
				$("#getCodeBtn span").html('获取验证码');
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
									that.tableLoading=false;
									that.setLoginDialog = false;
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
									that.tableLoading=false;
									that.setLoginDialoading = false;
									that.$message.warning(data.messageContent);
								}
							})
							.catch((err) => {
								that.setLoginDialoading = false;
								that.setLoginDialog = false;
								that.tableLoading=false;
								// console.log(err);
							});
					}
				})
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				//				console.log(index);
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					delectStaffManagement(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.error(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form);
							}
						})
						.catch((err) => {
								that.tableLoading = false;
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '员工管理员工管理新增员工',
					params: {
						pageType: '添加'
					}
				});
			},
			//角色下拉请求-设置权限
			roleSelect(val) {
				let index = parseInt(val);
				//				console.log(val)
				let data = this.roleOptions[index];
				this.roleForm.roleTypeName = data.key;
				this.roleForm.roleType = data.value;
				//				console.log(JSON.stringify(data))
			},
			//角色下拉请求-查询
			rolesSelect(val) {
//				console.log(val)
//				if(val != "") {
//					let index = parseInt(val);
//					let data = this.roleOptions[index];
//					this.form.roleType = data.value;
//				} else {
//					this.form.roleType = '';
//				}
//								console.log(JSON.stringify(this.roleOptions))
//								console.log(JSON.stringify(this.form))
			},
			//批量设置权限
			setJurisdiction() {
				if(this.multipleSelection.length > 0) {
					this.handleStoreDialog = true;
				} else {
					this.$message.warning('请选择要设置权限的数据');
				}
			},
			//批量设置权限确认
			enterJurisdiction() {
				let ids = '';
				this.setJurisdictionLoading = true;
				this.multipleSelection.forEach((val, index) => {
					ids += val.id + ',';
				});
				let param = {
					"userId": this.userInfo.userCode,
					ids: ids,
					roleType: this.roleForm.roleType,
					roleTypeName: this.roleForm.roleTypeName
				}
				//				console.log(param)
				this.$refs.setJurisdiction.validate((valid) => {
					if(valid) {
						jurisdictionStaff(param)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data));
								if(data.messageType == 'SUCCESS') {
									this.roleForm.roleTypeName = '';
									this.handleStoreDialog = false;
									this.setJurisdictionLoading = false;
									this.$message.success(data.messageContent);
									this.showTable(this.page, this.limit, this.form);
								} else {
									this.handleStoreDialog = false;
									this.setJurisdictionLoading = false;
									this.$message.error(data.messageContent);
								}
							})
							.catch((err) => {
								this.handleStoreDialog = false;
								this.setJurisdictionLoading = false;
								// console.log(err);
							});
					}
				})
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			let param = {
				userId: this.userInfo.userCode
			}
			selectRoleData(param)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					//					console.log(JSON.stringify(data)+"返回值")
					if(data.messageContent.length > 0) {
						this.roleOptions = data.messageContent;
					}
				})
				.catch((err) => {
					// console.log(err);
				});
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化
			let that = this;
			let formData;
			let data;
			if(this.getPageType) {
				formData = JSON.parse(this.getFormData);
				data = {
					"userId": this.userInfo.userCode,
					...formData
				}
			}
			if(this.getPageType == "添加") {
				this.getPageType = '';
				this.handleAddSellerInfo(data);
			} else if(this.getPageType == '修改') {
				this.getPageType = '';
				this.handleUpdateSellerInfo(data);
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			//添加或修改返回的值
			getFormData() {
				return this.$route.params.formData;
			},
			//添加或修改返回的类型
			getPageType() {
				return this.$route.params.pageType;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.input140{
		width: 140px;
	}
	.el-form {
		display: inline-block;
		.setJurisdiction{
			width: 75%;
		}
	}
	
	.el-form--inline .el-form-item {
		margin-right: 8px;
	}
	.el-form-item-Q {
		margin-bottom: 10px;
	}
	.el-dialog {
		width: 40%!important;
	}
	
	.box40 .el-dialog .el-form,
	.box30 .el-dialog .el-form {
		position: inherit;
	}
	
	.box30 .el-dialog .role {
		height: 100px;
		width: 100%;
	}
	
	.setLogin .el-input {
	}
	
	.setLogin .getVerificationCode {
		width: 200px
	}
	
	.setLogin .vCodeForm {
		position: relative;
	}
	
	.setLogin .vCodeForm .el-button {
		position: absolute;
		right: 0;
		top: 1px;
	}
	
	.el-select {
		width: 120px;
	}
	
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}	
</style>