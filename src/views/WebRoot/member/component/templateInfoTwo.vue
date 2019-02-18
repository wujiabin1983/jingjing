// // 营销活动 - 活动管理 - 新建活动/查看详情/修改 - 活动对象
<template>
	<el-main>
	<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" v-loading="this.uploadLoading" ref="form" label-width="120px" class="demo-form">
		<el-form-item label="选择门店" v-if="this.getPageType!='查看'" placeholder="请选择门店">
			<el-input v-model="form.relationObj" :disabled="true" v-show=""></el-input>
			<el-input v-model="storeArr" :disabled="true" placeholder="请选择门店" class="store"></el-input>
			<el-button type="primary" id="search" @click="searchStorePop" v-if="this.getPageType!='查看'">选择门店</el-button>
		</el-form-item>
		<el-form-item label="门店" v-else>
			<el-table ref="tableData" :data="storeData" class="storeTable">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="storeName" label="门店名称"></el-table-column>
			</el-table>
		</el-form-item>
		<el-form-item label="活动对象" prop="data">
			<el-radio-group v-model="activeObject" @change="radioActiveObjectHandle" class="marTop10">
				<el-radio label="预置分组" :disabled="disabledMemberSelect" class="radioGroup">预置分组</el-radio>
				<el-radio label="会员分组" :disabled="disabledMemberSelect" class="radioGroup">会员分组</el-radio>
				<el-radio label="自定义条件" :disabled="disabledMemberSelect" class="radioGroup">自定义条件</el-radio>
				<el-radio label="选择用户" :disabled="disabledMemberSelect" class="radioGroup">选择用户</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-col class="activeObj">
			<el-card v-show="activeObject == '预置分组'">
				<el-form :inline="true" :model="presetGroupForm" class="demo-form-inline" v-if="this.getPageType!='查看'">
					<!--<el-form-item label="分组类型">
						<el-select v-model="presetGroupForm.groupType" clearable placeholder="请选择">
							<el-option v-for="item in userGroupNameData" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>-->
					<el-form-item>
						<el-input v-model="presetGroupForm.groupName" placeholder="请输入分组名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchHandle">查询</el-button>
						<el-button type="primary" @click="clickSelet" v-show id="returnData">回显</el-button>
					</el-form-item>
				</el-form>
				<!-- 表格 -->
				<el-table ref="multipleTable" v-if="this.getPageType!='查看'"  border :data="tableDataPreset" @selection-change="handleCurrentChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="groupName" label="分组名称"></el-table-column>
				</el-table>
				<el-table ref="multipleTable" v-else :data="tableDataPresetInfo" v-loading="this.prestGroupLoading" border>
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="groupName" label="分组名称"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="countPreset!=0">
					<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countPreset" @current-change="presetChange">
					</el-pagination>
				</el-footer>
			</el-card>
			<el-card v-show="activeObject == '会员分组'">
				<el-form :inline="true" :model="groupForm" class="demo-form-inline" v-if="this.getPageType!='查看'">
					<el-form-item>
						<el-input v-model="groupForm.groupName" placeholder="请输入分组名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchGroupHandle">查询</el-button>
						<el-button type="primary" @click="clickSeletGroup" v-show id="returnDataGroup">回显</el-button>
					</el-form-item>
				</el-form>
				<!-- 表格 -->
				<el-table ref="tableDataGroup" :data="tableDataPresetUser" v-if="this.getPageType!='查看'"  v-loading="this.groupLoading" border @selection-change="handleCurrentUserChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="groupName" label="分组名称"></el-table-column>
				</el-table>
				<el-table ref="multipleTable" v-else :data="tableDataPresetUserInfo" v-loading="this.groupLoading" border>
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="groupName" label="分组名称"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="countGroup!=0">
					<el-pagination background class="pagination"layout="prev, pager, next, jumper" :page-size="limit" :total="countGroup" @current-change="groupChange">
					</el-pagination>
				</el-footer>
			</el-card>
			<el-card v-show="activeObject == '自定义条件'">
				<el-form :model="customConditionForm" :rules="this.getPageType=='查看' ? norules : rules1" ref="customConditionForm" label-width="110px">
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="customConditionForm.sex" class="radioGroup">
							<el-radio label="不限" :disabled="disabled" class="radioSex">不限</el-radio>
							<el-radio label="女" :disabled="disabled" class="radioSex">女</el-radio>
							<el-radio label="男" :disabled="disabled" class="radioSex">男</el-radio>
							<el-radio label="未知" :disabled="disabled" class="radioSex">未知</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="会员等级" prop="levalName">
						<!-- <el-input v-model="customConditionForm.levalName" :disabled="true" placeholder="请输入会员等级" v-if="this.getPageType=='查看'" class="width220"></el-input> -->
						<el-input v-model="memberLevelStr" multiple :disabled="true" placeholder="请输入会员等级" v-if="this.getPageType=='查看'" class="width220"></el-input>
						<!-- <el-select v-model="customConditionForm.levalName" placeholder="请选择" v-else @change="levalSelect" class="width220">  -->
						<el-select v-model="memberLevel" multiple placeholder="请选择" v-else @change="memLevel" class="width220">
							<el-option v-for="item in levalInfo" :key="item.value" :label="item.key" :value="item.key">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员消费" prop="memberConsume">
						<el-radio-group v-model="consumption" @change="consumptionHandle">
							<el-form :inline="true" class="demo-form-inline paddingTop0">
								<el-form-item label="">
									<el-radio label="单笔消费" :disabled="disabled" >单笔消费</el-radio>
								</el-form-item>
								<el-input v-model="memberConsume.operator" class="memberConsumeOperator" :disabled="true" v-if="this.getPageType=='查看'"></el-input>
								<el-form-item label="" v-else>
									<el-select v-model="memberConsume.operator" placeholder="请选择" :disabled="compareDisabled1">
										<el-option label="大于" value="大于"></el-option>
										<el-option label="等于" value="等于"></el-option>
										<el-option label="小于" value="小于"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="">
									<el-input v-model="memberConsume.money" placeholder="请输入金额" :disabled="compareDisabled1"></el-input>
								</el-form-item>
								<el-form-item label="元"></el-form-item>
							</el-form>
							<el-form :inline="true" class="demo-form-inline">
								<el-form-item label="">
									<el-radio label="累计消费" :disabled="disabled" >累计消费</el-radio>
								</el-form-item>
								<el-input v-model="memberConsume1.operator" class="memberConsumeOperator" :disabled="true" v-if="this.getPageType=='查看'"></el-input>
								<el-form-item label="" v-else>
									<el-select v-model="memberConsume1.operator" placeholder="请选择" :disabled="compareDisabled2">
										<el-option label="大于" value="大于"></el-option>
										<el-option label="等于" value="等于"></el-option>
										<el-option label="小于" value="小于"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="">
									<el-input v-model="memberConsume1.money" placeholder="请输入金额" :disabled="compareDisabled2"></el-input>
								</el-form-item>
								<el-form-item label="元"></el-form-item>
							</el-form>
							<el-radio label="不限" :disabled="disabled" >不限</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="入会时长" prop="langTime">
						<el-form :inline="true" class="demo-form-inline padding0">
							<span>入会</span>
							<el-input v-model="customConditionForm.langTime" :disabled="disabled"  placeholder="请输入入会时长" class="width140"></el-input>
							<span>周年会员</span>
						</el-form>
					</el-form-item>
					<el-form-item label="生日当天会员" prop="birthdayDay">
						<el-radio-group v-model="customConditionForm.birthdayDay">
							<el-radio label="是" :disabled="disabled" >是</el-radio>
							<el-radio label="否" :disabled="disabled" >否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="生日当月会员" prop="birthdayMonth">
						<el-radio-group v-model="customConditionForm.birthdayMonth">
							<el-radio label="是" :disabled="disabled" >是</el-radio>
							<el-radio label="否" :disabled="disabled" >否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card v-show="activeObject == '选择用户'">
				<el-form :inline="true" :model="selectUserForm" class="demo-form-inline mrgBottom10">
					<el-button type="primary" @click="upload" v-if="this.getPageType!='查看'&&this.memberSelect==''">选择文件导入</el-button>
					<el-button type="primary" @click="download" v-if="this.getPageType!='查看'&&this.memberSelect==''">下载模板</el-button>
				</el-form>
				<el-table ref="tableDataUser" :data="tableDataUser" v-loading="tableLoading" highlight-current-row>
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="lineCardNum" label="会员卡号"></el-table-column>
					<el-table-column prop="userName" label="会员姓名"></el-table-column>
					<el-table-column prop="mobile" label="电话"></el-table-column>
					<el-table-column prop="sex" label="性别"></el-table-column>
					<el-table-column prop="memberLevel" label="等级"></el-table-column>
					<el-table-column prop="storeName" label="服务门店"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination"layout="prev, pager, next, jumper" :page-size="limit" :total="count" @current-change="userPageChange">
					</el-pagination>
				</el-footer>
				<form ref="uploadForm" :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
					<input type="text" name="userId" :value="userCode" />
					<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
					<input type="submit" value="上传" ref="uploadSubmit" />
				</form>
				<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
			</el-card>
		</el-col>
		<!--选择门店-->
		<!--<el-dialog title="选择门店" :visible.sync="handleStoreDialog" class="transfer">
			<div class="search">
				<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
				</el-cascader>
				<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
				<el-button type="primary" id="search" @click="searchStore">搜索</el-button>
			</div>
			<el-transfer :filterable="false" :titles="titleData" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
			</el-transfer>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleStoreDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>-->
		<el-dialog title="" :visible.sync="handleStoreDialog" class="transfer">
			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="门店" name="first">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" :clearable=true change-on-select  @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="店组" name="second">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" :clearable=true change-on-select @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="区域" name="third">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" :clearable=true change-on-select  @change="selectChange">
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
				<el-button @click="handleStoreDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>
	</el-form>
	<div class="el-footer-btn">
		<div class="el-footer-btn-con">
			<el-button type="primary" class="floatLeft" @click="back">上一步</el-button>
			<el-button type="primary" class="floatLeft" @click="next">下一步</el-button>
		</div>
	</div>
	</el-main>
</template>
<script>
	import { validateInt, validateFloat } from '@/utils/validate';
	import { selectPresetGroupInfo } from '@/api/member/activityManagement';
	import { selectProCityArea, selectStoreData, selectTabData,selectGroupInfo, selectLevalInfo ,selectUserGroupName} from '@/api/public'
	import { Store } from '@/views/WebRoot/platform'
	import { memberImportInfo, memberImportDownload, memberImportFile } from '@/api/member/importInfo'
	import { selectMemberGroup } from '@/api/member/group'
	import { selectMemberSelect} from '@/api/member/memberSelect'
	import { mapGetters } from 'vuex'
	import { importMemberInfo } from '@/api/base/memberInfo'
	import { selectMemberGroupInfoJurisdiction } from '@/api/platform/groupTemp'
	import Cookie from 'js-cookie'
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				prestGroupLoading:true,//预置分组
				groupLoading:false,//会员分组加载窗
				tabType: '门店',
				uploadLoading: false,
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				disabled: false, //查看只读
				memberSelect:'',
				disabledMemberSelect:false,//会员查询进来
				disabledSet: false, //添加，修改的只读
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				activeName: 'first',
				optionsProCityArea: [], //主页面省市区数据
				optionsProCityAreaPop: [], //级联选择器省市区数据
				handleStoreDialog: false, //弹窗
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				storeArr: '',
				levalInfo: [], //会员等级
				memberLevel:[], //等级容器
				memberLevelStr:'', //查看等级
				tableLoading: '', // 等待框
				activeObject: '预置分组', // 活动对象
				// form表单数据
				form: {
					data:'',
					relationObj: '', // 适用门店
					presetGroup:'',//预置分组
					memberGroup:'',//会员分组
					customConditions:'',//自定义条件
					chooseUser:''//活动对象 - 选择用户
				},
				groupForm:{
					groupName:''
				},
				storeData: [],
				norules: {},
				rules: {
					relationObj: [{
							required: true,
							message: '请选择门店',
							trigger: 'change'
						},
						{
							max: 500,
							message: '最大长度不能超过500',
							trigger: 'change'
						}
					],
//					data: [{
//							required: true,
//							message: '请输入活动对象信息',
//							trigger: 'change'
//						}
//					],
				},
				userCode: '',
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_623.action', // 导入路径
				// 适用门店 的dialog弹窗框
				handleStoreDialog: false,
				userGroupNameData:[],//分组类型
				// 预置分组table数据
				tableData: [],
				tableDataPreset:[],
				tableDataPresetInfo:[],
				tableDataPresetUser:[],
				tableDataPresetUserInfo:[],
				// 预置分组form表单数据
				presetGroupForm: {
					groupType: '', // 分组类型
					groupName: '' // 请输入分组名称
				},
				// 选择用户form表单数据
				selectUserForm: {
					name: '' // 用户姓名
				},
				customConditionForm: {
					sex: '不限', // 性别
					levalName: '', // 会员等级
					levalId: '', // 会员等级
					memLevalList: '',//等级多选
					memberConsume: '',
					langTime: '', // 入会时长
					birthdayDay: '否', // 生日当天会员
					birthdayMonth: '否' // 生日当月会员
				},
				memberConsume: {
					operator: '',
					money: ''
				},
				consumption: '不限', // 会员消费
				memberConsume1: {
					operator: '',
					money: ''
				},
				rules1: {
				},
				// 单笔消费禁用
				compareDisabled1: true,
				// 累计消费禁用
				compareDisabled2: true,
				tableDataUser: [], //导入会员信息
				masterId: '', //导入信息的masterId
				multipleSelectionGroup: [], //预置分组
				multipleSelectionUser: [], //会员表格所选中的行信息
				radiusType: '预置分组', //活动对象
				// 会员分页
				pageUser: 0, // 当前页
				count: 0, // 总条数
				// 预置分组分页
				pagePreset: 0, // 当前页
				countPreset: 0, // 总条数
				limit: 6, // 条/页
				//会员分组
				pageGroup:0,
				countGroup:0
			}
		},
		components: {
			Store
		},
		methods: {
			//点击查询的 选择组织
			searchStorePop() {
				this.handleStoreDialog = true;
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
				this.handleStoreDialog = false;
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
				let params = {
					idArray: idArray,
					nameArray: nameArray
				}
				this.storeArr = nameArray;
				this.form.relationObj = JSON.stringify(params);
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
			// 会员信息分页
			userPageChange(val) {
				this.page = val;
				if(this.memberSelect==""){
					this.showTableUser(val, this.limit, JSON.parse(this.masterId));
				}else{
					this.showTableMemberUser(val,this.limit,JSON.parse(sessionStorage.getItem("memberSelect")));
				}
			},
			presetChange(val){
				this.pagePreset = val;
				this.showTable(val, this.limit);
			},
			//点击按钮  弹窗显示
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			//查询导入会员信息
			showTableUser(start, limit, msg) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					onLineCardList: msg.onLineCardList,
					lineCardList: msg.lineCardList
				}
				// console.log(params)
				memberImportInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						that.uploadLoading = false;
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							// console.log(JSON.stringify(data))
							that.count = data.count;
							that.tableDataUser = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
						// console.log(err);
					})
			},
			//查询导入会员信息-会员查询
			showTableMemberUser(start, limit, msg) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					...msg
				}
				// console.log(params)
				selectMemberSelect(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						that.uploadLoading = false;
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							// console.log(JSON.stringify(data))
							that.count = data.count;
							that.tableDataUser = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
						// console.log(err);
					})
			},
			// 导入
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				let formData = new FormData(this.$refs.uploadForm); // 可以增加表单数据
				memberImportFile(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						that.masterId = JSON.stringify(msg);
						that.form.activeObjectInfo = JSON.stringify(msg);
						that.form.data='data';
//						console.log(JSON.stringify(data)+"?")
						if(code == 'SUCCESS') {
							that.uploadLoading = true;
							that.$message.success({
								message: '导入成功',
								duration: 2000,
								onClose() {
									that.showTableUser(that.pageUser, that.limit, msg); //根据导入返回值查询所导入的用户数据
								}
							});
						} else {
							that.$message.warning({
								dangerouslyUseHTMLString: true,
								message: msg,
								duration: 5000,
								onClose() {}
							});
						}
						this.$refs.uploadForm.reset();
					})
					.catch((err) => {
						// console.log(err);
					})
			},
			upload() {
				// 点击测试
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			//下载模板
			download() {
				memberImportDownload()
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let code = data.messageType;
						let msg = data.messageContent;
						if(code == 'SUCCESS') {
							//						console.log(Cookie.get('baseUrl') + msg);
							window.location.href = Cookie.get('baseUrl') + msg;
						}
					})
					.catch((err) => {
						// console.log(err);
					})
			},
			//等级下拉监听
			levalSelect(val) {
				//      	console.log(val);
				this.customConditionForm.levalId = this.levalInfo[val].value;
				this.customConditionForm.levalName = this.levalInfo[val].key;
			},
			//等级多选
			memLevel(val) {
		  		let str = '';
		  		val.forEach((value,index)=>{
					str += value + ",";
		  		})
		  		this.customConditionForm.memLevalList = str.substr(0, str.length - 1);
		  		//console.log(JSON.stringify(this.customConditionForm.memLevalList))
			},
			// 单选
			radioActiveObjectHandle(str) {
//				          console.log(str);
				this.radiusType = str;
				let that = this;
				this.form.data='';
				if(str == "自定义条件") {
					let params = {
						userId: this.userInfo.userCode
					}
					that.tableLoading = true;
					selectLevalInfo(params) //请求会员等级
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							let result = [];
//							console.log(JSON.stringify(data)+"会员等级")
							that.levalInfo = data.data;
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}
				if(str == "预置分组"){
					this.showTable(this.pagePreset, this.limit);
				}
				if(str == "会员分组"){
					this.memberGroupTable(this.pageGroup, this.limit);
				}
			},
			// 会员消费单选选中事件
			consumptionHandle(str) {
				if(str == '单笔消费') {
					this.compareDisabled1 = false;
					this.compareDisabled2 = true;
					this.customConditionForm.operator = '';
					this.customConditionForm.money = '';
				} else if(str == '累计消费') {
					this.compareDisabled1 = true;
					this.compareDisabled2 = false;
					this.customConditionForm.operator = '';
					this.customConditionForm.money = '';
				}
			},
			// 预置分组搜索
			searchHandle() {
				this.showTable(this.pagePreset, this.limit);
			},
			// 显示表格 预置分组
			showTable(page, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": page,
					"limit": limit,
					"groupType":this.presetGroupForm.groupType,
					"groupName":this.presetGroupForm.groupName
				}
				// 使表格加载
				this.prestGroupLoading = true;
				// 查询接口
//				          console.log(JSON.stringify(params)+"入参")
				selectMemberGroupInfoJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						                  console.log(JSON.stringify(data)+"返回值")
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								"index":index,
								...val
							});
						})
						that.countPreset =data.count;
						that.tableDataPreset = result;
						that.prestGroupLoading = false;
						if(that.getPageType != "查看") {
							that.$nextTick(function(){
								document.getElementById('returnData').dispatchEvent(new MouseEvent('click'));
							})
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.prestGroupLoading = false;
					});
			},
			//预置分组 中的数据
			handleCurrentChange(val) {
				if(val.length==0){
					this.form.data='';
				}else{
					this.form.data=JSON.stringify(val);
				}
				this.multipleSelectionGroup=[];
				val.forEach((val,index)=>{
					this.multipleSelectionGroup.push({
						page:this.pagePreset,
						...val
					})
				})
			},
			//会员分组选中的数据
			handleCurrentUserChange(val){
				this.multipleSelectionUser = val;
			},
			//分页
			groupChange(val){
				this.pageGroup=val;
				this.memberGroupTable(this.pageGroup, this.limit);
			},
			// 会员分组搜索
			searchGroupHandle() {
				this.memberGroupTable(this.pageGroup, this.limit);
			},
			memberGroupTable(page,limit){
				var params = {
					userId: this.userInfo.userCode,
					"page": page,
					"limit": limit,
					"groupName":this.groupForm.groupName
				}
				this.groupLoading=true;
				//			console.log(params)
				selectMemberGroup(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								"index":index,
								...val
							});
						})
						this.tableDataPresetUser=result;
						this.countGroup = data.count;
//						console.log(data);
						this.groupLoading=false;
						if(this.getPageType != "查看") {
							this.$nextTick(function(){
								document.getElementById('returnDataGroup').dispatchEvent(new MouseEvent('click'));
							})
						}
					})
					.catch((err) => {
//						console.log(err);
					})
			},
			back() { //上一步
				this.$emit('message1', '0');
			},
			//回显会员分组
			clickSeletGroup(){
				let array=[];
				let that=this;
//				console.log(that.multipleSelectionUser);
				if(that.multipleSelectionUser.length>0){
					that.multipleSelectionUser.forEach((val,ind)=>{
						that.pageGroup=val.page;
						array.push(that.tableDataPresetUser[val.index]);
					})
					array.forEach(row => {
			            that.$refs.tableDataGroup.toggleRowSelection(row);
		            });
//					console.log(that.multipleSelectionUser);
				}
			},
			//回显预置分组
			clickSelet(){
				let array=[];
				let that=this;
				if(that.multipleSelectionGroup.length>0){
					that.multipleSelectionGroup.forEach((val,ind)=>{
						that.pagePreset=val.page;
						array.push(that.tableDataPreset[val.index]);
					})
					array.forEach(row => {
			            that.$refs.multipleTable.toggleRowSelection(row);
		            });
//					console.log(that.multipleSelectionGroup);
				}
			},
			next() { //下一步
				let that = this;
				if(this.getPageType == "查看"){
					that.$emit('message1', '2');
					return false;
				}
				if(this.radiusType == "自定义条件") {
					if(this.consumption == "单笔消费") {
						this.memberConsume.type = "单笔消费";
						this.customConditionForm.memberConsume = JSON.stringify(this.memberConsume);
					} else if(this.consumption == "累计消费"){
						this.memberConsume1.type = "累计消费";
						this.customConditionForm.memberConsume = JSON.stringify(this.memberConsume1);
					}else{
						this.customConditionForm.memberConsume = JSON.stringify({type:""});
					}
					this.$refs['customConditionForm'].validate((valid) => {
						if(valid) {
							this.form.customConditions = JSON.stringify(this.customConditionForm);
							this.form.data='data';
//							console.log(JSON.stringify(this.customConditionForm))
							this.$refs['form'].validate((valid) => {
								if(valid) {
									if(this.getPageType != "查看") {
										this.form.radiusType = "自定义条件";
										let params = {
											relationObj: this.form.relationObj,
											customConditions: this.customConditionForm,
											radiusType: "自定义条件"
										}
//										console.log(params)
										sessionStorage.setItem("dataTwo", JSON.stringify(params));
										
									}
									this.$emit('message1', '2');
								} else {
									// console.log('验证失败！')
								}
							});
						}
					})
				}else{
					this.$refs['form'].validate((valid) => {
						if(valid) {
							if(this.getPageType != "查看") {
								if(this.radiusType == "预置分组") {
									if(this.multipleSelectionGroup.length>0){
										this.form.radiusType = "预置分组";
										let params={
											relationObj: this.form.relationObj,
											presetGroup:JSON.stringify(this.multipleSelectionGroup),
											radiusType: "预置分组"
										}
										sessionStorage.setItem("dataTwo",JSON.stringify(params));
									}else{
										that.$message({
											message: '请选择预置分组信息！',
											type: 'warning'
										});
										return false;
									}
								}
								if(this.radiusType == "会员分组") {
									if(this.multipleSelectionUser.length>0){
										this.form.radiusType = "会员分组";
										let params={
											relationObj: this.form.relationObj,
											memberGroup:JSON.stringify(this.multipleSelectionUser),
											radiusType: "会员分组"
										}
										sessionStorage.setItem("dataTwo", JSON.stringify(params));
									}else{
										that.$message({
											message: '请选择会员分组信息！',
											type: 'warning'
										});
										return false;
									}
								}
								if(this.radiusType == "选择用户") {
									if(this.tableDataUser.length>0){
										let params = {
											relationObj: this.form.relationObj,
											chooseUser: {
												queryUser:'',
												userCodeList: this.masterId
											},
											radiusType: "选择用户"
										}
										if(sessionStorage.getItem("memberSelect")){
											params.chooseUser.queryUser=sessionStorage.getItem("memberSelect");
										}
//										console.log(JSON.stringify(params))
										sessionStorage.setItem("dataTwo", JSON.stringify(params));
									}else{
										that.$message({
											message: '请选择导入用户信息！',
											type: 'warning'
										});
										return false;
									}
								}
							}
								this.$emit('message1', '2');
						} else {
							// console.log('验证失败！')
						}
					});
				}
				
			},
		},
		created() {
			// 钩子函数 -- 初始化
			let that =this;
			if(sessionStorage.getItem("memberSelect")){
				this.radiusType="选择用户";
				this.activeObject="选择用户";
				this.memberSelect="memberSelect";
				this.disabledMemberSelect=true;
//				console.log(sessionStorage.getItem("memberSelect"))
				this.showTableMemberUser(this.pageUser,this.limit,JSON.parse(sessionStorage.getItem("memberSelect")));
			}
			if(sessionStorage.getItem("dataTwo")) {
				let data = sessionStorage.getItem("dataTwo");
				//回显数据
//				console.log(JSON.parse(data))
				this.form.relationObj = JSON.parse(data).relationObj;
				this.form.activeObjectInfo = JSON.parse(data).activeObjectInfo;
				//门店数据回显
				if(this.form.relationObj!=""){
					this.value2 = this.form.relationObj.idArray;
					this.form.relationObj = JSON.parse(data).relationObj;
					this.storeArr = JSON.parse(JSON.parse(data).relationObj).nameArray;
					this.form.data="data";
				}
				//根据提交的活动对象类型回显
				this.activeObject = JSON.parse(data).radiusType;
				this.radiusType= JSON.parse(data).radiusType;
				//预置分组数据回显
				if(JSON.parse(data).radiusType == "预置分组") {
					let msg = JSON.parse(data).presetGroup;
					this.multipleSelectionGroup=JSON.parse(msg);
				}
				//会员分组数据回显
				if(JSON.parse(data).radiusType == "会员分组") {
					this.memberGroupTable(this.pageGroup, this.limit);
					let msg = JSON.parse(data).memberGroup;
					this.multipleSelectionUser=JSON.parse(msg);
				}
				//选择用户数据回显
				if(JSON.parse(data).radiusType == "选择用户") {
					let msg = JSON.parse(data).chooseUser.userCodeList;
					this.showTableUser(this.pageUser, this.limit, JSON.parse(msg)); //请求选择用户数据
					this.form.activeObjectInfo = JSON.stringify(msg); //选择用户参数
				}
				if(JSON.parse(data).radiusType == "自定义条件") {
					let msg = JSON.parse(data).customConditions;
					if(JSON.parse(data).customConditions){
						this.customConditionForm=msg
//						console.log(this.customConditionForm.memberConsume)
						this.consumption =JSON.parse(this.customConditionForm.memberConsume).type;
						if(this.consumption == "单笔消费") {
							this.memberConsume =JSON.parse(this.customConditionForm.memberConsume);
						} else if(this.consumption == "累计消费"){
							this.memberConsume1 =JSON.parse(this.customConditionForm.memberConsume);
						}
					}
				}
			}
			this.userCode = this.userInfo.userCode;
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledMemberSelect = true;
				this.compareDisabled1=true;
				this.compareDisabled2=true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					relationObj: res.marketingActivitie.relationObj, // 适用门店
					activeObjectInfo: res.marketingActivitie.activeObjectInfo
				}
				res = res.marketingActivitie;
				if(res.relationObj!=""){
					let str = res.relationObj.nameArray;
					let array = str.split(",");
					array.forEach((val, index) => {
						this.storeData.push({
							storeName: val
						});
					})
				}
				if(res.presetGroup != "") {
					this.prestGroupLoading = false;
					this.activeObject = "预置分组";
					this.radiusType = "预置分组";
					this.tableDataPresetInfo=res.presetGroup;
				}
				if(res.memberGroup != "") {
					this.activeObject = "会员分组";
					this.radiusType = "会员分组";
					this.tableDataPresetUserInfo=res.memberGroup;
				}
				if(res.customConditions != "") {
					this.activeObject = "自定义条件";
					this.radiusType = "自定义条件";
					// console.log(res)
					let msg = res.customConditions;
					this.customConditionForm=msg
					this.consumption = this.customConditionForm.memberConsume.type;
					if(this.consumption == "单笔消费") {
						this.memberConsume =this.customConditionForm.memberConsume;
					} else if(this.consumption == "累计消费"){
						this.memberConsume1 =this.customConditionForm.memberConsume;
					}
				}

				//debugger查看等级回写
				if(res.customConditions.memLevalList!=""){
					that.memberLevelStr = res.customConditions.memLevalList;
				}

				if(res.chooseUser != "") {
					this.activeObject = "选择用户";
					this.radiusType = "选择用户";
					let msg = '';
					if(res.chooseUser.queryUser!=""){
						msg = res.chooseUser.queryUser;
						this.disabledMemberSelect=true;
						this.memberSelect="memberSelect";
						this.showTableMemberUser(this.pageUser, this.limit, msg); //请求选择用户数据
					}else{
						this.memberSelect="";
						msg = res.chooseUser.userCodeList;
						this.masterId = msg;
						this.showTableUser(this.pageUser, this.limit, msg); //请求选择用户数据
					}
					this.form.activeObjectInfo = JSON.stringify(msg); //选择用户参数
				}
			} else if(this.getPageType == '修改' && !sessionStorage.getItem("dataTwo")) {
				let res = JSON.parse(this.getFormData);
				this.form = {
					relationObj: res.marketingActivitie.relationObj, // 适用门店
					activeObjectInfo: res.marketingActivitie.activeObjectInfo
				}
				res = res.marketingActivitie;
//	          	console.log(JSON.stringify(res))
				//回显已选择的门店			
				if(res.relationObj!=""){
					this.value2 = res.relationObj.idArray;
					//回显选择门店input值
					this.storeArr = res.relationObj.nameArray;
					this.form.relationObj = JSON.stringify(res.relationObj);
				}

				if(res.presetGroup != "") {
					this.activeObject = "预置分组";
					this.radiusType = "预置分组";
					let msg =res.presetGroup;
					this.multipleSelectionGroup=msg;
				}
				if(res.memberGroup != "") {
					this.multipleSelectionUser=res.memberGroup;
					this.memberGroupTable(this.pageGroup, this.limit);
					this.activeObject = "会员分组";
					this.radiusType = "会员分组";
				}

				if(res.customConditions != "") {
					//debugger
					this.activeObject = "自定义条件";
					this.radiusType = "自定义条件";
					let msg = res.customConditions;
					this.customConditionForm=msg
					this.consumption = this.customConditionForm.memberConsume.type;
					if(this.customConditionForm.memLevalList!=""){//等级回显
						//请求会员等级
						this.levalInfo = JSON.parse(sessionStorage.getItem("levelOption")).data
						that.memberLevel = this.customConditionForm.memLevalList.split(",")
					}
					if(this.consumption == "单笔消费") {
						this.compareDisabled1=false;
						this.compareDisabled2=true;
						this.memberConsume =this.customConditionForm.memberConsume;
					} else if(this.consumption == "累计消费"){
						this.compareDisabled1=true;
						this.compareDisabled2=false;
						this.memberConsume1 =this.customConditionForm.memberConsume;
					}
				}
				if(res.chooseUser != "") {
					this.activeObject = "选择用户";
					this.radiusType = "选择用户";
					let msg = '';
					if(res.chooseUser.queryUser!=""){
						msg = res.chooseUser.queryUser;
						this.disabledMemberSelect=true;
						this.memberSelect="memberSelect";
						this.showTableMemberUser(this.pageUser, this.limit, msg); //请求选择用户数据
					}else{
						this.memberSelect="";
						msg = res.chooseUser.userCodeList;
						this.masterId = msg;
						this.showTableUser(this.pageUser, this.limit, msg); //请求选择用户数据
					}
					this.form.activeObjectInfo = JSON.stringify(msg); //选择用户参数
				}
			} else if(this.getPageType == '创建' && !sessionStorage.getItem("dataTwo")) {
				let res = JSON.parse(this.getFormData);
				this.form = {
					relationObj: res.activeTempMas.relationObj, // 适用门店
					activeObjectInfo: res.activeTempMas.activeObjectInfo
				}
				res = res.activeTempMas;
				// console.log(JSON.stringify(res))
				//回显已选择的门店				
				if(res.relationObj!=""){
					this.value2 = res.relationObj.idArray;
					//回显选择门店input值
					this.storeArr = res.relationObj.nameArray;
					this.form.relationObj = JSON.stringify(res.relationObj);
				}

				if(res.presetGroup != "") {
					this.activeObject = "预置分组";
					this.radiusType = "预置分组";
					let msg =res.presetGroup;
					this.multipleSelectionGroup=msg;
				}
				if(res.memberGroup != "") {
					this.activeObject = "会员分组";
					this.radiusType = "会员分组";
				}
				if(res.customConditions != "") {
					this.activeObject = "自定义条件";
					this.radiusType = "自定义条件";
					let msg = res.customConditions;
					this.customConditionForm=msg
					this.consumption = this.customConditionForm.consumption;
					if(this.consumption == "单笔消费") {
						this.compareDisabled1=false;
						this.compareDisabled2=true;
						
						this.memberConsume={
							operator: this.customConditionForm.compare1,
							money:this.customConditionForm.yuan1
						};
					} else {
						this.compareDisabled1=true;
						this.compareDisabled2=false;
						
						this.memberConsume1={
							operator: this.customConditionForm.compare2,
							money:this.customConditionForm.yuan2
						};
					}
				}
				if(res.chooseUser != "") {
					this.activeObject = "选择用户";
					this.radiusType = "选择用户";
					let msg = res.chooseUser.userCodeList;
					this.masterId = msg;
					this.showTableUser(this.pageUser, this.limit, msg); //请求选择用户数据
					this.form.activeObjectInfo = JSON.stringify(msg); //选择用户参数
				}
			}
			
			if(this.getPageType != '查看') {
				// 初始加载表格预置分组
				this.showTable(this.pagePreset, this.limit);
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.paddingTop0{
		padding: 0;
	}
	.padding0{
		padding: 0;
	}
	.el-form {
		overflow: hidden;
		width: 100%;
	}
	
	.iptStores {
		width: rem(400px);
	}
	
	.el-select {
		width: 60%;
	}
	
	.radiogroup .el-radio {
		display: block;
	}
	
	.store {
		width: 230px
	}
	/*.el-radio-group{
		margin-top: 10px;
	}*/
	.radioSex{
		margin-top: 10px;
	}
	.radioGroup{
		display: block;
		margin: 0;
		margin-bottom: 10px;
	}
	div.el-dialog__body {
		padding: 10px 10px!important;
	}
	.demo-form{
		position: relative;
		min-height:600px;
	}
	.activeObj{
		position: absolute;
		left: 300px;
		top: 60px;
		width: 60%;
		height:300px;
		padding-left: 60px;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.storeTable{
		width:200px;
		margin-left: 0px;
		margin-bottom: 20px;
	}
	.marTop10{
		margin-top: 10px;
	}
	.width220{
		width: 220px;
	}
	.memberConsumeOperator{
		width:130px;
		margin-right: 95px;
	}
	.width140{
		width: 140px;
	}
</style>