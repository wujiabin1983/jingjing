<!--自动打标签 - 子页面-->
<template>
	<div>
		<el-container class="app-container">
			<el-card v-loading="enterLoading">
				<el-form :model="form" ref="form" :rules="rules" label-width="80px" class="demo-form">
					<el-form-item label="标签名称" prop="labelName">
						<el-input v-model="form.labelName" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<el-select v-model="form.labelName" placeholder="请选择标签名称" v-else @change="labelNameSelect">
							<el-option v-for="item in labelNameArr" :key="item.key" :label="item.key" :value="item.index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="标签值" prop="labelValue">
						<el-input v-model="form.labelValue" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<el-select v-model="form.labelValue" placeholder="请选择标签值" v-else @change="labelValueSelect">
							<el-option v-for="item in labelValueArr" :key="item.key" :label="item.key" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="统计周期" prop="statisticsBegin" class="width220">
						<el-input v-model="form.statisticsBegin" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<el-date-picker v-model="transmissionTime" :picker-options="pickerOptions0"  :editable="false" :clearable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-else @change="timeChange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="执行计划" prop="planType">
						<el-input v-model="form.planType" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<el-select v-model="form.planType" placeholder="请选择执行计划" @change="planInfo" v-else>
							<el-option label="指定时间" value="指定时间"></el-option>
							<el-option label="每天" value="每天"></el-option>
							<el-option label="每周" value="每周"></el-option>
							<el-option label="每月" value="每月"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="执行时间" v-if="flag=='指定时间'" prop="planDate">
						<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<!--选择时间-->
						<div v-else>
							<el-date-picker v-model="selectDate" :editable="false" :picker-options="pickerOptions1" :clearable="false" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" @change="assignDate" value-format="yyyy-MM-dd"></el-date-picker>
							<el-time-picker arrow-control v-model="selectTime"  :clearable="false" format="HH ： mm ： ss " value-format="HH:mm:ss" @change="assignTime" :picker-options="{ selectableRange: '0:00:00 - 23:59:59' }" placeholder="请选择时间"></el-time-picker>
						</div>
					</el-form-item>
					<el-form-item label="执行时间" v-if="flag=='每天'" prop="planDate">
						<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<!--选择时间-->
						<el-time-picker arrow-control v-model="implementDate" :clearable="false" v-else format="HH ： mm ： ss " value-format="HH:mm:ss" @change="dateChange" :picker-options="{ selectableRange: '0:00:00 - 23:59:59' }" placeholder="请选择时间"></el-time-picker>
					</el-form-item>
					<el-form-item label="周期选择" v-if="flag=='每周'" prop="planDate">
						<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<el-select v-model="implementTime" multiple placeholder="请选择周期选择" :clearable="false" v-else @change="weekChange">
							<el-option label="星期一" value="1"></el-option>
							<el-option label="星期二" value="2"></el-option>
							<el-option label="星期三" value="3"></el-option>
							<el-option label="星期四" value="4"></el-option>
							<el-option label="星期五" value="5"></el-option>
							<el-option label="星期六" value="6"></el-option>
							<el-option label="星期日" value="7"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="执行时间" v-if="flag=='每周'" prop="planDate">
						<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<!--选择时间-->
						<el-time-picker arrow-control v-model="implementDate" :clearable="false" v-else format="HH ： mm ： ss " value-format="HH:mm:ss" @change="dateChange" :picker-options="{ selectableRange: '0:00:00 - 23:59:59' }" placeholder="请选择时间"></el-time-picker>
					</el-form-item>					
					<el-form-item label="执行时间" v-if="flag=='每月'" prop="planDate">
						<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<!--选择天-->
						<el-select v-model="implementTime" multiple placeholder="请选择" @change="dayChange" v-else>
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="执行时间" v-if="flag=='每月'" prop="planDate">
						<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
						<!--选择时间-->
						<el-time-picker arrow-control v-model="implementDate" :clearable="false" v-else format="HH ： mm ： ss " value-format="HH:mm:ss" @change="dateChange" :picker-options="{ selectableRange: '0:00:00 - 23:59:59' }" placeholder="请选择时间"></el-time-picker>
					</el-form-item>			
					<el-form-item label="备注">
						<el-input type="textarea" :disabled="disabled" class="width44" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入备注" v-model="form.remarks">
						</el-input>
					</el-form-item>
					<el-form-item label="条件设置">
						<el-form-item label="会员ID" class="elForm">
							<el-input v-model="formOther.userId" placeholder="手机号/会员卡/会员姓名" class="floatLeft"></el-input>
						</el-form-item>
						<el-form-item label="积分存量" class="elForm">
							<el-input v-model="formOther.integralBegin" type="number" min="1" placeholder="最小积分" class="elInputL"></el-input>
							<el-input v-model="formOther.integralEnd" type="number" min="1" placeholder="最大积分" class="elInputR"></el-input>
						</el-form-item>
						<el-form-item label="所属门店" class="elForm">
							<el-input v-model="formOther.storeId" placeholder="请选择" v-show=""></el-input>
							<el-input v-model="storeName" placeholder="请选择" readonly="readonly" class="dsh-input"></el-input>
							<el-button type="primary" @click="searchStorePop()" class="dsh-input-button">选择</el-button>
						</el-form-item>
						<el-form-item label="入会周期" class="elForm">
							<el-date-picker class="width100" v-model="registeDate" :editable="false" :clearable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" @change="registeDateFn" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="会员等级" class="elForm">
							<el-select v-model="memberLevel" multiple placeholder="请选择" class="width100" @change="memLevel">
								<el-option v-for="item in levelInfo" :key="item.key" :label="item.key" :value="item.index"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="消费时间" class="elForm">
							<el-date-picker class="width100" :editable="false" v-model="orderDate" :clearable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" @change="orderDateFn" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="年龄范围" class="elForm">
							<el-input v-model="formOther.ageBegin" type="number" min="1" placeholder="最小年龄" class="elInputL"></el-input>
							<el-input v-model="formOther.ageEnd" type="number" min="1" placeholder="最大年龄" class="elInputR"></el-input>
						</el-form-item>
						<el-form-item label="消费次数" class="elForm">
							<el-input v-model="formOther.consumeMix" type="number" min="1" placeholder="最小次数" class="elInputL"></el-input>
							<el-input v-model="formOther.consumeMax" type="number" min="1" placeholder="最大次数" class="elInputR"></el-input>
						</el-form-item>
						<el-form-item label="会员分组" class="elForm">
							<el-select v-model="memberGroup" multiple placeholder="请选择" class="width100" @change="groupId">
								<el-option v-for="item in memberGroupData" :key="item.key" :label="item.key" :value="item.index"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="消费金额" class="elForm">
							<el-input v-model="formOther.consumeAmountMix" type="number" min="1" placeholder="最小金额" class="elInputL"></el-input>
							<el-input v-model="formOther.consumeAmountMax" type="number" min="1" placeholder="最大金额" class="elInputR"></el-input>
						</el-form-item>
					</el-form-item>
					<div class="el-footer-btn-con">
						<el-button @click="handClick">返回</el-button>
						<el-button type="primary" @click="onSubmit" id="submit">确认</el-button>
					</div>
				</el-form>
			</el-card>
			<el-dialog title="" :visible.sync="handleTabDialog" class="transfer">
				<template>
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="门店" name="门店">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
						<el-tab-pane label="店组" name="店组">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
						</el-tab-pane>
						<el-tab-pane label="区域" name="区域">
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
	</div>
</template>
<script>
	import { addAutomaticMarking, setAutomaticMarking } from '@/api/member/automaticMarking'
	import { selectAudioUse, selectLevalInfo, selectProCityArea, selectStoreData, selectTabData ,selectLabelData,selectMemberGroup} from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
			 	pickerOptions1: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
		        pickerOptions2:{
		        	"selectableRange": '18:30:00 - 20:30:00'
		        },
		        enterLoading:false,
				disabled: false,
				disabledSet: false,
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				storeArr: '',
				activeName: '门店',
				tabType: '门店',

				handleTabDialog: false,
				implementInfo: '', //查看详情
				formImplement: [], //执行条件
				disabledImplement: true,
				otherDate: '', //活动开始或者结束时间
				selectDate: '', //指定时间-日期
				selectTime: '', //指定时间-时间
				sendDate: '', //查看显示的时间赋值
				disabled: false,
				flag: '指定时间',
				registeDate: [], //入会周期
				orderDate: [], //消费时间
				memberLevel:[],//等级选择容器
				memberGroup:[],//等级选择容器
				implementDate: '', //每天- 时间容器
				implementTime: [], //每月，每周   数组容器
				transmissionTime: [], //发送时间段数据容器
				planType: '', //执行计划数据容器
				storeName: '',
				// 抄送对象
				form: {
					searchContent: "",
					"labelCode": "", //labelCode
					"labelName": "", //标签名称
					"labelValue": "", //标签值
					"statisticsBegin": "", //统计周期起
					"statisticsEnd": "", //统计周期止
					"planType": "指定时间", //执行计划
					"planDate": "", //计划时间
					"cycleJson": "", //周期（json格式字符串）
					"conditionJson": {}, //条件设置（json格式字符串）
					"remarks": "" //备注
				},
				formOther: {
					userId:"",
					storeId: "", //门店id
					orderDateBegin: "", //消费时间
					orderDateEnd: "", //消费时间
					consumeMix: "", //消费次数
					consumeMax: "", //消费次数
					consumeAmountMix: "", // 消费金额
					consumeAmountMax: "", //消费金额
					memLevelList: "", //会员等级
					registeDateBegin: "", // 入会日期
					registeDateEnd: "", //入会日期
					ageBegin: "", // 年龄
					ageEnd: "", //年龄
					integralBegin: "", //积分
					integralEnd: "", //积分
					groupName: ""
				},
				levelInfo: [],
				memberGroupData: [],
				rules: {
					labelName: [{
							required: true,
							message: '请选择标签名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					labelValue: [{
							required: true,
							message: '请选择标签值',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					statisticsBegin: [{
							required: true,
							message: '请选择统计周期',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					planType: [{
							required: true,
							message: '请选择执行计划',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					planDate: [{
							required: true,
							message: '请选择执行时间',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					]
				},
				labelNameArr: [],
				labelValueArr: [],
				options: [ //每月-数据
					{
						id: '01',
						label: '1号',
						value: '1'
					},
					{
						id: '02',
						label: '2号',
						value: '2'
					},
					{
						id: '03',
						label: '3号',
						value: '3'
					},
					{
						id: '04',
						label: '4号',
						value: '4'
					},
					{
						id: '05',
						label: '5号',
						value: '5'
					},
					{
						id: '06',
						label: '6号',
						value: '6'
					},
					{
						id: '07',
						label: '7号',
						value: '7'
					},
					{
						id: '08',
						label: '8号',
						value: '8'
					},
					{
						id: '09',
						label: '9号',
						value: '9'
					},
					{
						id: '10',
						label: '10号',
						value: '10'
					},
					{
						id: '11',
						label: '11号',
						value: '11'
					},
					{
						id: '12',
						label: '12号',
						value: '12'
					},
					{
						id: '13',
						label: '13号',
						value: '13'
					},
					{
						id: '14',
						label: '14号',
						value: '14'
					},
					{
						id: '15',
						label: '15号',
						value: '15'
					},
					{
						id: '16',
						label: '16号',
						value: '16'
					},
					{
						id: '17',
						label: '17号',
						value: '17'
					},
					{
						id: '18',
						label: '18号',
						value: '18'
					},
					{
						id: '19',
						label: '19号',
						value: '19'
					},
					{
						id: '20',
						label: '20号',
						value: '20'
					},
					{
						id: '21',
						label: '21号',
						value: '21'
					},
					{
						id: '22',
						label: '22号',
						value: '22'
					},
					{
						id: '23',
						label: '23号',
						value: '23'
					},
					{
						id: '24',
						label: '24号',
						value: '24'
					},
					{
						id: '25',
						label: '25号',
						value: '25'
					},
					{
						id: '26',
						label: '26号',
						value: '26'
					},
					{
						id: '27',
						label: '27号',
						value: '27'
					},
					{
						id: '28',
						label: '28号',
						value: '28'
					},
					{
						id: '29',
						label: '29号',
						value: '29'
					},
					{
						id: '30',
						label: '30号',
						value: '30'
					},
					{
						id: '31',
						label: '31号',
						value: '31'
					}
				],
				// 组件数量
				loading: false,
			}
		},
		props: ['data', 'index'],
		methods: {
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
			storeArray(data) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				that.data2.forEach((val,index)=>{
					data.forEach((value,ind)=>{
						if(val.storeId==value){
							idArray += val.storeId + ",";
							nameArray += val.storeName + ",";
						}
					})
				})
				idArray=idArray.substr(0,idArray.length-1);
				nameArray=nameArray.substr(0,nameArray.length-1);
				this.storeName = nameArray;
				let params = {
					idArray: idArray,
					nameArray: nameArray,
					flag:this.activeName
				}
				this.formOther.storeId = JSON.stringify(params);
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
				//			console.log(this.tabType);
				if(this.tabType == "门店") {
					params.flag = "1";
				}
				if(this.tabType == "店组") {
					params.flag = "2";
				}
				if(this.tabType == "区域") {
					params.flag = "3";
				}
				//			console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//							        		console.log(data)
						this.data2 = [];
						if(data != "") {
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
//														console.log(val)
									this.data2.push({
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
							//						console.log(this.data2)
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
				this.handleTabDialog = false;
			},
			onSubmit() {
				let that = this;
				this.$refs['form'].validate((valid) => {
					if(valid) {
						this.form.conditionJson = this.formOther;
						let params = {
							userId: this.userInfo.userCode,
							...this.form
						}
//											console.log(JSON.stringify(params));
//											return false;
						this.enterLoading=true;
						if(this.getPageType == "添加") {
							addAutomaticMarking(params)
								.then(function(res) {
									//							console.log(res)
									let data = JSON.parse(Base64.decode(res.data));
									let result = [];
									that.enterLoading=false;
									if(data.messageType != 'SUCCESS') {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									} else {
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										that.$router.push({
											name: '自动打标签'
										});
									}
									//							that.showTable(that.page,that.limit);
									//							that.tableLoading = false;
								})
								.catch(function(err) {
									// console.log('err');
									that.enterLoading = false;
								});
						}
						if(this.getPageType == "修改") {
							setAutomaticMarking(params)
								.then(function(res) {
									//							console.log(res)
									let data = JSON.parse(Base64.decode(res.data));
									let result = [];
									that.enterLoading=false;
									if(data.messageType!= 'SUCCESS') {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									} else {
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										that.$router.push({
											name: '自动打标签'
										});
									}
									//							that.showTable(that.page,that.limit);
									//							that.tableLoading = false;
								})
								.catch(function(err) {
									// console.log('err');
									that.enterLoading = false;
								});
						}

					}
				})
			},
			labelNameSelect(val) {
//				  		console.log(JSON.stringify(this.labelNameArr[parseInt(val)]))
				this.form.labelName = this.labelNameArr[parseInt(val)].key;
				this.form.labelCode = this.labelNameArr[parseInt(val)].code;
				this.form.labelValue='';
				let array =[];
				let result=[];
				let str = this.labelNameArr[parseInt(val)].value;
				if(str.indexOf(',')>0){
					array = str.split(",");
				}else if(str.indexOf('，')>0){
					array = str.split("，");
				}else{
					array = str.split(",");
				}
				array.forEach((val,index)=>{
					result.push({
						value:val,
						key:val
					})
				})
				this.labelValueArr=result;
			},
			labelValueSelect(val) {
//		  		console.log(val)
			},
			//条件设-会员分组
			groupId(val) {
		  		let str = '';
		  		this.formOther.groupName=[];
		  		val.forEach((value,index)=>{
		  			this.formOther.groupName.push({
		  				code:this.memberGroupData[value].value,
		  				name:this.memberGroupData[value].key
		  			})
		  		})
		  		this.formOther.groupName=JSON.stringify(this.formOther.groupName);
//		  		console.log(JSON.stringify(this.formOther.groupName))
			},
			//条件设置=入会周期
			registeDateFn(val) {
//				  		console.log(val);
				this.formOther.registeDateBegin = val[0];
				this.formOther.registeDateEnd = val[1];
			},
			//条件设置-会员等级
			memLevel(val) {
		  		let str = '';
		  		this.formOther.memLevelList=[];
		  		val.forEach((value,index)=>{
		  			this.formOther.memLevelList.push({
		  				code:this.levelInfo[value].value,
		  				name:this.levelInfo[value].key
		  			})
		  		})
		  		this.formOther.memLevelList=JSON.stringify(this.formOther.memLevelList);
//		  		console.log(JSON.stringify(this.formOther.memLevelList))
			},
			//条件设置-消费时间
			orderDateFn(val) {
				//  		console.log(val);
				this.formOther.orderDateBegin = val[0];
				this.formOther.orderDateEnd = val[1];
			},
			handClick() {
				this.$router.push({
					name: '自动打标签'
				});
			},
			//指定时间-时间
			assignTime(val) {
				let date = {
					selectTime: this.selectTime,
					selectDate: this.selectDate
				}
				this.form.planDate = JSON.stringify(date);
			},
			//指定时间-日期
			assignDate(val) {
				let date = {
					selectTime: this.selectTime,
					selectDate: this.selectDate
				}
				this.form.planDate = JSON.stringify(date);
			},
			//统计周期起止
			timeChange(val) {
//				console.log(val)
				this.form.statisticsBegin = val[0];
				this.form.statisticsEnd = val[1];
			},
			//选择周  每周  周
			weekChange(val) {
				//  		console.log(val)
				let params = {
					selectTime: JSON.stringify(val)
				}
				this.form.cycleJson = JSON.stringify(params);
			},
			//选择天 每月  天
			dayChange(val) {
				let params = {
					selectTime: JSON.stringify(val)
				}
				this.form.cycleJson = JSON.stringify(params);
			},
			//选择时间   每天  时分秒
			dateChange(val) {
				let params = {
					selectTime: val
				}
				this.form.planDate = JSON.stringify(params);
			},
			//监听执行计划
			planInfo(val) {
				this.planType = val;
				this.implementDate = '';
				this.implementTime = [];
				if(this.planType == "指定时间") {
					this.flag = "指定时间";
				}
				if(this.planType == "每天") {
					this.flag = "每天";
				}
				if(this.planType == "每月") {
					this.flag = "每月";
				}
				if(this.planType == "每周") {
					this.flag = "每周";
				}
			},
			loadingOther(){
				let that = this;
				let params = {
					userId: this.userInfo.userCode
				}
				selectLevalInfo(params) //请求会员等级
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//	                  	console.log(JSON.stringify(data)+"会员等级");
						that.levelInfo = data.data;
					})
					.catch(function(err) {
						// console.log(err);
					});
				selectMemberGroup(params) //请求会员分组
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
	//                	console.log(JSON.stringify(data)+"会员分组");
						that.memberGroupData = data.data;
						that.echoData();
					})
					.catch(function(err) {
						// console.log(err);
					});
				params = {
					userId: this.userInfo.userCode
				}
	//			console.log(params)
				selectLabelData(params) //请求标签列表
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//                  console.log(JSON.stringify(data)+"标签列表");
	                    let result=[];
	                    data.messageContent.forEach((val,index)=>{
	                    	result.push({
	                    		index:index,
	                    		key:val.labelName,
	                    		code:val.labelCode,
	                    		value:val.labelValue
	                    	})
	                    })
	                    that.labelNameArr=result;
						that.tableLoading = false;
					})
					.catch(function(err) {
	//					console.log(err);
						that.tableLoading = false;
					});
			},
			echoData(){
				if(this.getPageType == '修改') {
					let res = JSON.parse(this.getFormData);
					//          console.log(res)
//		            console.log(JSON.stringify(res))
					this.formOther = res.conditionJson;
					if(this.formOther!=""){
						let that =this;
						if(this.formOther.storeId != "") {//门店回显
							this.storeName = this.formOther.storeId.nameArray;
							let storeIdArr = this.formOther.storeId.idArray.split(",");
							let storeNameArr = this.formOther.storeId.nameArray.split(",");
							this.data2=[];
							this.value2=[];
							this.activeName=this.formOther.storeId.flag;
							storeIdArr.forEach((val,index)=>{
								this.data2.push({
									storeId:val,
									storeName:''
								})
							})
							this.value2=storeIdArr;
							storeNameArr.forEach((val,index)=>{
								this.data2[index].storeName=val;
							})
							this.formOther.storeId=JSON.stringify(this.formOther.storeId);
						}
						if(this.formOther.memLevelList!=""){//等级回显
							let memLevelList = that.formOther.memLevelList;
							memLevelList.forEach((val,index)=>{
								that.levelInfo.forEach((v,i)=>{
									if(val.code==v.value){
										that.memberLevel.push(v.index);
									}
								})
							})
						}
						if(this.formOther.groupName!=""){//分组回显
							let groupName = that.formOther.groupName;
							groupName.forEach((val,index)=>{
								that.memberGroupData.forEach((v,i)=>{
									if(val.code==v.value){
										that.memberGroup.push(v.index);
									}
								})
							})
						}
					}
					this.transmissionTime = [];
					this.transmissionTime.push(res.statisticsBegin);
					this.transmissionTime.push(res.statisticsEnd);
					//      	res.sendDate=res.sendDate.sendDateBegin+" - "+res.sendDate.sendDateEnd;
					this.form = {
						...res
					}
					this.planType = this.form.planType;
					if(this.planType == "指定时间") {
						this.flag = "指定时间";
						this.selectDate = this.form.planDate.selectDate;
						this.selectTime = this.form.planDate.selectTime;
						let date = {
							selectTime: this.form.planDate.selectTime,
							selectDate: this.form.planDate.selectDate
						}
						this.form.planDate = JSON.stringify(date);
					}
					if(this.planType == "每天") {
						this.flag = "每天";
						this.implementDate = this.form.planDate.selectTime;
						let params = {
							selectTime: this.form.planDate.selectTime
						}
						this.form.planDate = JSON.stringify(params);
					}
					if(this.planType == "每月") {
						this.flag = "每月";
						this.implementDate = this.form.planDate.selectTime;
						this.form.planDate=JSON.stringify(this.form.planDate);
						this.implementTime=this.form.cycleJson.selectTime;
						let params = {
							selectTime: JSON.stringify(this.form.cycleJson.selectTime)
						}
						this.form.cycleJson = JSON.stringify(params);
					}
					if(this.planType == "每周") {
						this.flag = "每周";
						this.implementDate = this.form.planDate.selectTime;
						this.form.planDate=JSON.stringify(this.form.planDate);
						this.implementTime=this.form.cycleJson.selectTime;
						let params = {
							selectTime: JSON.stringify(this.form.cycleJson.selectTime)
						}
						this.form.cycleJson = JSON.stringify(params);
					}
					this.form.menNumber=this.form.menNumber+''
				}
			}
		},
		created() {
			let that = this;
			// 钩子函数 -- 初始化
			this.loadingOther();

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
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-input{
		width: 220px;
	}
	.el-select{
		width: 220px;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	
	.elForm {
		width: 44%;
		height: 32px;
		float: left;
		.el-input{
			width: 100%;
		}
		.dsh-input{
			width: 69%;
		}
		.width100{
			width: 100%;
		}
		.elInputL {
			width: 45%;
			margin-right: 5%;
			float: left;
		}
		.elInputR {
			width: 50%;
			float: left;
		}
	}
	.elForm:nth-child(2n-1) {
		margin-right: 5%;
	}
	
	.el-table-filter {
		max-height: 300px;
		overflow: auto;
	}
	
	.block {
		float: left;
		margin-right: 10px;
	}
	.width220{
		width: 220px;
	}
	.width44{
		width: 44%;
	}
</style>