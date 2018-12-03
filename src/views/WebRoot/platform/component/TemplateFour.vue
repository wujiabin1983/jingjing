<!--活动管理  - 第四步-->
<template>
	<div>
		<el-card>
			<el-form :model="form" ref="form" :rules="this.getPageType=='查看' ? norules : rules" label-width="120px" class="demo-form">
				<el-form-item label="执行动作" prop="implementAction">
					<el-input v-model="form.implementAction" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
					<el-select v-model="form.implementAction" :disabled="giveTypeDis" placeholder="请选择执行动作" v-else @change="implementAction">
						<el-option label="送券" value="送券"></el-option>
						<el-option label="消息提醒" value="消息提醒"></el-option>
						<el-option label="送积分" value="送积分"></el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item label="执行方式" prop="implementMode">
					<el-radio-group v-model="form.implementMode">
						<el-radio label="单次手动" :disabled="disabled">单次手动</el-radio>
						<el-radio label="多次自动" :disabled="disabled">多次自动</el-radio>
					</el-radio-group>
				</el-form-item>-->
				<el-form-item label="执行计划" prop="implementType">
					<el-input v-model="form.implementType" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
					<el-select v-model="form.implementType" placeholder="请选择执行计划" :disabled="isEvent"  @change="planInfo" v-else>
						<el-option label="指定时间" value="指定时间"></el-option>
						<el-option label="每天" value="每天"></el-option>
						<el-option label="每周" value="每周"></el-option>
						<el-option label="每月" value="每月"></el-option>
						<el-option label="活动开始时间" value="活动开始时间"></el-option>
						<el-option label="活动结束时间" value="活动结束时间" v-if="flagEndDate"></el-option>
						<el-option label="自动执行" value="自动执行" v-if="isAutomatic"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="执行日期" v-if="flag=='指定时间'" prop="implementTime">
					<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
					<!--选择时间-->
					<div v-else>
						<el-date-picker v-model="selectDate" :picker-options="pickerOptions0"  :editable="false" :clearable="false" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" @change="assignDate" value-format="yyyy-MM-dd"></el-date-picker>
						<!--<el-time-picker arrow-control v-model="selectTime" :clearable="false" format="HH ： mm ： ss " value-format="HH:mm:ss" @change="assignTime" :picker-options="{ selectableRange: '0:00:00 - 23:59:59' }" placeholder="请选择"></el-time-picker>-->
					</div>
				</el-form-item>
				<el-form-item label="周期选择" v-if="flag=='每周'" prop="implementTime">
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
				<el-form-item label="执行日期" v-if="flag=='每月'" prop="implementTime">
					<el-input v-model="sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
					<!--选择天-->
					<el-select v-model="implementTime" multiple placeholder="请选择" @change="dayChange" v-else>
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="执行日期" v-if="flag=='活动开始时间'" prop="implementTime">
					<el-input v-model="otherDate" :disabled="true" :clearable="false"></el-input>
				</el-form-item>
				<el-form-item label="执行日期" v-if="flag=='活动结束时间'" prop="implementTime">
					<el-input v-model="otherDate" :disabled="true" :clearable="false"></el-input>
				</el-form-item>

				<el-form-item label="执行条件" v-if="this.index!=0">
					<el-input v-model="implementInfo" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
					<el-radio-group v-model="implement" v-else @change="implementChange">
						<el-radio label="无条件"></el-radio>
						<el-radio label="自定义条件">
							<el-select v-model="formImplement" multiple filterable :disabled="disabledImplement" placeholder="请选择执行条件" @change="implementSelect">
								<el-option label="会员生日当天" value="会员生日当天"></el-option>
								<el-option label="未核销" value="未核销"></el-option>
							</el-select>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="执行时间" prop="sendDate" v-if="flag!='自动执行'">
					<el-input v-model="form.sendDate" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
					<el-time-picker
					    v-model="form.sendDate" v-else
					    :picker-options="{
					      selectableRange: '00:00:00 - 23:59:59'
					    }"
					    value-format="HH:mm" format="HH:mm"
					    placeholder="选择时间">
					</el-time-picker>
				</el-form-item>
				<el-form-item label="发送渠道">
					<el-radio-group v-model="form.sendChannel" @change="sendChannelFn" class="sendChannel">
						<el-radio label="短信发送" :disabled="disabledImplementActive">短信发送</el-radio>
						<el-radio label="微信直接发送" :disabled="disabledImplementActive">微信直接发送</el-radio>
					</el-radio-group>
					<el-card class="width50" v-if="form.sendChannel=='短信发送'">
						<el-form :model="form" label-width="120px">
							<el-form-item label="请选择模板">
								<el-input v-model="form.tempName" :disabled="disabled" v-if="this.getPageType=='查看'"></el-input>
								<el-select v-model="form.tempName" placeholder="请选择模板" @change="template" v-else>
									<el-option v-for="item in formTemplateInfo" :key="item.key" :label="item.key" :value="item.index"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="消息内容">
								<el-input type="textarea" :rows="2" resize='none' :disabled="true" v-model="form.messageContent" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
							</el-form-item>
						</el-form>
					</el-card>
				</el-form-item>
				<el-form-item label="抄送对象">
					<el-input v-model="carbonCopyObj" :readonly="disabled" v-if="this.getPageType=='查看'"></el-input>
					<el-select v-model="carbonCopyObj" multiple filterable placeholder="请选择抄送对象" v-else @change="carbonCopyObjChange">
						<el-option v-for="item in levalInfo" :key="item.key" :label="item.key" :value="item.index">
						</el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item >
                    <el-button type="primary" @click="onSubmit" id="submit">确认</el-button>
                </el-form-item>-->
			</el-form>
		</el-card>
	</div>
</template>
<script>
	import { selectMessageInfo,selectMessageInfoContent } from '@/api/member/activityManagement'
	import { selectAudioUser,selectMessageWechatInfo,selectMessageWechatInfoContent } from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				isAutomatic:true,//自动执行
				isShow:false,
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        }, 
				flagEndDate:true,
				giveTypeDis:false,
				implement: '无条件',
				implementInfo: '', //查看详情
				formImplement: [], //执行条件
				disabledImplementActive: false,
				disabledImplement: true,
				otherDate: '', //活动开始或者结束时间
				selectDate: '', //指定时间-日期
				selectTime: '', //指定时间-时间
				sendDate: '', //查看显示的时间赋值
				carbonCopyObj: '',
				disabled: false,
				flag: '指定时间',
				implementDate: '', //每天- 时间容器
				implementTime: [], //每月，每周   数组容器
				transmissionTime: ['0:0:0','23:00:00'], //发送时间段数据容器
				planType: '', //执行计划数据容器
				// 抄送对象
				isEvent:false,
				form: {
					"implementAction": "", //执行动作
//					"implementMode": "单次手动", //执行方式
					"implementType": "指定时间", //执行计划类型
					"implementTime": "", //执行日期(json字符串)
					"cycleSelect": '', //周期选择（周一对应1，周二对应2，以此类推）
					"sendChannel": "短信发送", //发送渠道
					"tempId": "", //模板ID
					"tempName": "", //模板名称
					"implement": "", //执行条件
					"messageContent": "", //消息内容
					"sendDate": "", //发送时间段（json字符串）
					"carbonCopyObj": "" //抄送对象(json字符串)
				},
				norules: {},
				rules: {
					implementAction: [{
							required: true,
							message: '请选择执行动作',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					implementType: [{
							required: true,
							message: '请选择计划类型',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					implementTime: [{
							required: true,
							message: '请选择执行日期',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					sendChannel: [{
							required: true,
							message: '请选择发送渠道',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					sendDate: [{
							required: true,
							message: '请选择发送时间段',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					],
					carbonCopyObj: [{
							required: true,
							message: '请选择抄送对象',
							trigger: 'change'
						},
						{
							max: 2000,
							message: '最小长度为2000',
							trigger: 'change'
						}
					]
				},
				// 发送模板
				formTemplateInfo: [{
						id: '01',
						label: '短信模板',
						value: '短信模板'
					},
					{
						id: '02',
						label: '微信消息模版',
						value: '微信消息模版'
					}
				],
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
				count: 1,
				levalInfo: [],
				value9: [],
				list: [],
				loading: false,
				states: ["Alabama", "Alaska", "Arizona",
					"Arkansas", "California", "Colorado",
					"Connecticut", "Delaware", "Florida",
					"Georgia", "Hawaii", "Idaho", "Illinois",
					"Indiana", "Iowa", "Kansas", "Kentucky",
					"Louisiana", "Maine", "Maryland",
					"Massachusetts", "Michigan", "Minnesota",
					"Mississippi", "Missouri", "Montana",
					"Nebraska", "Nevada", "New Hampshire",
					"New Jersey", "New Mexico", "New York",
					"North Carolina", "North Dakota", "Ohio",
					"Oklahoma", "Oregon", "Pennsylvania",
					"Rhode Island", "South Carolina",
					"South Dakota", "Tennessee", "Texas",
					"Utah", "Vermont", "Virginia",
					"Washington", "West Virginia", "Wisconsin",
					"Wyoming"
				]
			}
		},
		props: ['data', 'index'],
		methods: {
			//监听执行动作-控制发送渠道
			implementAction(val) {
				//  		console.log(val);
				if(val == "消息提醒") { //发送渠道-短信
					this.disabledImplementActive = true;
					this.form.sendChannel = "短信发送";
				} else if(val == "送积分") { //发送渠道-微信
					this.disabledImplementActive = true;
					this.form.sendChannel = "微信直接发送";
				} else {
					this.disabledImplementActive = false;
				}
			},
			onSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {}
				})
			},
			//指定时间-时间
			assignTime(val) {
				let date = {
//					selectTime: this.selectTime,
					selectDate: this.selectDate
				}
				this.form.implementTime = JSON.stringify(date);
			},
			implementChange(val) { //执行条件单选
				//  		console.log(val);
				if(val == "无条件") {
					this.disabledImplement = true;
					this.form.implement = '无条件';
				} else {
					this.disabledImplement = false;
					this.form.implement = JSON.stringify(this.formImplement);
				}
			},
			implementSelect(val) { //执行条件自定义条件下拉
				//  		console.log(this.formImplement)
				this.form.implement = JSON.stringify(this.formImplement);
			},
			//指定时间-日期
			assignDate(val) {
				let date = {
//					selectTime: this.selectTime,
					selectDate: this.selectDate
				}
				this.form.implementTime = JSON.stringify(date);
			},
			//选择周  每周  周
			weekChange(val) {
				//  		console.log(val)
				let params = {
					selectTime: JSON.stringify(val)
				}
				this.form.cycleSelect = JSON.stringify(params);
				this.form.implementTime = JSON.stringify(params);
			},
			//选择天 每月  天
			dayChange(val) {
				//  		console.log(val)
				let params = {
					selectTime: JSON.stringify(val)
				}
				this.form.implementTime = JSON.stringify(params);
			},
			//选择时间   每天  时分秒
			dateChange(val) {
				let params = {
					selectTime: val
				}
				this.form.implementTime = JSON.stringify(params);
			},
			//选择抄送对象监听
			carbonCopyObjChange(val) {
				//      	console.log(val)
				var that = this;
				let idArray = '';
				let nameArray = '';
				let indexArray = '';
				val.forEach((val, index) => {
					idArray += that.levalInfo[val].value + ",";
					nameArray += that.levalInfo[val].key + ",";
					indexArray += that.levalInfo[val].index + ",";
				})
				idArray = idArray.substr(0, idArray.length - 1);
				nameArray = nameArray.substr(0, nameArray.length - 1);
				indexArray = indexArray.substr(0, indexArray.length - 1);
				let params = {
					idArray: idArray,
					nameArray: nameArray,
					indexArray: indexArray
				}
				this.form.carbonCopyObj = JSON.stringify(params);
			},
			//选择模板监听
			template(val) {
				//      	console.log(val)
				this.form.tempId = this.formTemplateInfo[val].value;
				this.form.tempName = this.formTemplateInfo[val].key;
				let params = ''
				let that= this;
				if(this.form.sendChannel=="短信发送"){
					params={
						"userId": this.userInfo.userCode,
						"templateId":this.form.tempId,
						"templateName":this.form.tempName
					}
					selectMessageInfoContent(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
	//											console.log(JSON.stringify(data));
							that.form.messageContent = data.messageContent[0].smsContent;
						})
						.catch(function(err) {
							// console.log(err);
						});
				}
				if(this.form.sendChannel=="微信直接发送"){
					params={
						"userId": this.userInfo.userCode,
						"value": this.form.tempId,
					}
					selectMessageWechatInfoContent(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//							console.log(JSON.stringify(data));
							that.form.messageContent = data.messageContent;
						})
						.catch(function(err) {
//							 console.log(err);
						});
				}
			},
			sendChannelFn(val){
//				console.log(val)
				let params={
					userId:this.userInfo.userCode
				}
				let that= this;
				this.form.tempName='';
				this.form.messageContent='';
				if(val=="短信发送"){
					selectMessageInfo(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//							console.log(JSON.stringify(data));
							that.formTemplateInfo = data.data;
						})
						.catch(function(err) {
//							 console.log(err);
						});
				}
				if(val=="微信直接发送"){
					selectMessageWechatInfo(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//							console.log(JSON.stringify(data));
							that.formTemplateInfo = data.data;
						})
						.catch(function(err) {
							// console.log(err);
						});
				}
			},
			//选择模板下拉数据请求、、选择模板请求消息内容
			seleteData(params, type) {
				let that = this;
				this.tableLoading = true;
				if(this.form.sendChannel=="短信发送"){
					selectMessageInfo(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
	//											console.log(JSON.stringify(data));
							that.formTemplateInfo = data.data;
						})
						.catch(function(err) {
							// console.log(err);
						});
				}
				if(this.form.sendChannel=="微信直接发送"){
					selectMessageWechatInfo(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
	//											console.log(JSON.stringify(data));
							that.formTemplateInfo = data.data;
						})
						.catch(function(err) {
							// console.log(err);
						});
				}
			},
			//监听执行计划
			planInfo(val) {
				this.planType = val;
				this.implementDate = '';
				this.implementTime = [];
				this.form.implementTime='';
//				console.log(JSON.stringify(this.form))
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
				if(this.planType == "自动执行") {
					this.flag = "自动执行";
				}
				if(this.planType == "活动开始时间") {
					let str = JSON.parse(sessionStorage.getItem("dataOne")).activityDate;
					if(str == "长期") {
						this.otherDate = '长期';
						this.form.implementTime = '长期';
					} else {
						this.otherDate = JSON.parse(str).activityDateBegin;
						let params = {
							selectTime: JSON.parse(str).activityDateBegin
						}
						this.form.implementTime = JSON.stringify(params);
					}
					this.flag = "活动开始时间";
				}
				if(this.planType == "活动结束时间") {
					let str = JSON.parse(sessionStorage.getItem("dataOne")).activityDate;
					if(str == "长期") {
						this.otherDate = '长期';
						this.form.implementTime = '长期';
					} else {
						this.otherDate = JSON.parse(str).activityDateEnd;
						let params = {
							selectTime: JSON.parse(str).activityDateEnd
						}
						this.form.implementTime = JSON.stringify(params);
					}
					this.flag = "活动结束时间";
				}
			}
		},
		created() {
			let that = this;
			//      console.log(this.data)
//			console.log(JSON.parse(sessionStorage.getItem("dataOne")).activityType);
			if(this.getPageType != '查看') {
				if(sessionStorage.getItem("dataOne")){
					if(JSON.parse(sessionStorage.getItem("dataOne")).activityDate=="长期"){
						this.flagEndDate=false;
					}
					if(JSON.parse(sessionStorage.getItem("dataOne")).activityType=="会员权益类"||JSON.parse(sessionStorage.getItem("dataOne")).activityType=="生命周期类"){
						this.isAutomatic=false;
					}
				}
				if(JSON.parse(sessionStorage.getItem("dataOne")).activityType=="事件触发"){
					this.isEvent=true;
					this.form.implementType="自动执行";
					this.flag="自动执行";
				}else{
					this.form.implementType="指定时间";
					this.flag="指定时间";
					this.isEvent=false;
				}
			
				let giveTypeInfo=JSON.parse(sessionStorage.getItem("dataThree"));
				if(giveTypeInfo){
					if(giveTypeInfo.radiusType=="发消息"){
						this.giveTypeDis=true;
						this.form.implementAction='消息提醒';
						this.disabledImplementActive = true;
						this.form.sendChannel = "短信发送";
					}
					if(giveTypeInfo.radiusType=="送积分"){
						this.giveTypeDis=true;
						this.form.implementAction='送积分';
						this.disabledImplementActive = true;
						this.form.sendChannel = "微信直接发送";
					}
				}
			}
			// 钩子函数 -- 初始化
			//请求活动对象
			$("#submit").click();
			let param = {
				userId: this.userInfo.userCode
			}
			that.tableLoading = true;
			selectAudioUser(param) //请求会员等级
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					that.levalInfo = data.data;
					that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
			// console.log(this.getPageType);
			if(this.getPageType == '查看') {
				let res = this.data;
//				      	console.log(JSON.stringify(res))
				//      	res.implementTime=JSON.stringify(res.implementTime);
//				res.sendDate = res.sendDate.sendDateBegin + " ~ " + res.sendDate.sendDateEnd;
				//          let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				if(this.form.implement != "") {
					if(this.form.implement != "无条件") {
						this.implement = "自定义条件";
						this.formImplement = this.form.implement;
						this.disabledImplement = false;
					}
				}
				this.disabledImplementActive=true;
				this.planType = this.form.implementType;
				let str = '';
				if(this.form.implement != '') {
					this.form.implement.forEach((index, val) => {
						str += index + ","
					})
					this.implementInfo = str.substr(0, str.length - 1);
				}
				//     	    console.log(JSON.stringify(this.form))
				if(this.planType == "指定时间") {
					this.flag = "指定时间";
					this.sendDate = this.form.implementTime.selectDate;
				}
				if(this.planType == "自动执行") {
					this.flag = "自动执行";
				}
				if(this.planType == "每天") {
					this.flag = "每天";
					this.sendDate = this.form.implementTime.selectTime;
				}
				if(this.planType == "每月") {
					this.flag = "每月";
					let str = ''
					this.form.implementTime.selectTime.forEach((index, val) => {
						str += index + '号,'
					})
					this.sendDate = str.substr(0, str.length - 1);
				}
				if(this.planType == "每周") {
					this.flag = "每周";
					let str = ''
					this.form.cycleSelect.selectTime.forEach((index, val) => {
						str += '星期' + index + ','
					})
					this.sendDate = str.substr(0, str.length - 1);
				}
				if(this.planType == "活动开始时间") {
					this.flag = "活动开始时间";
					this.otherDate=this.form.implementTime;
					this.sendDate = this.form.implementTime.selectTime;
				}
				if(this.planType == "活动结束时间") {
					this.flag = "活动结束时间";
					this.otherDate=this.form.implementTime;
					this.sendDate = this.form.implementTime.selectTime;
				}
				this.disabled = true;
				this.carbonCopyObj = this.form.carbonCopyObj.nameArray;
			} else if(this.getPageType == '修改') {
				let res = this.data;
				if(!res) {
					return false;
				}
//				           console.log(JSON.stringify(res))
				this.transmissionTime = [];
//				if(res.sendDate != "") {
//					this.transmissionTime.push(res.sendDate.sendDateBegin);
//					this.transmissionTime.push(res.sendDate.sendDateEnd);
//				} 
//				console.log(this.transmissionTime)
				//      	res.sendDate=res.sendDate.sendDateBegin+" - "+res.sendDate.sendDateEnd;
				this.form = {
					...res
				}
				if(this.form.implement != "") {
					if(this.form.implement != "无条件") {
						this.implement = "自定义条件";
						this.formImplement = this.form.implement;
						this.disabledImplement = false;
					}
				}
				this.planType = this.form.implementType;
				if(this.form.carbonCopyObj != "") {
					let array = this.form.carbonCopyObj.indexArray.split(",");

					let array1 = [];
					array.forEach((val, index) => {
						array1.push(parseInt(val))
					})
					this.carbonCopyObj = array1;
					this.form.carbonCopyObj = JSON.stringify(this.form.carbonCopyObj);
				} else {
					this.form.carbonCopyObj = '';
				}
				this.form.sendDate = this.form.sendDate;
//				console.log(this.form.sendDate)
				if(this.planType == "指定时间") {
					this.flag = "指定时间";
					this.selectDate = this.form.implementTime.selectDate;
					let date = {
						selectDate: this.form.implementTime.selectDate
					}
					this.form.implementTime = JSON.stringify(date);
				}
				if(this.planType == "自动执行") {
					this.flag = "自动执行";
				}
				if(this.planType == "每天") {
					this.flag = "每天";
					this.implementDate = this.form.implementTime.selectTime;
					let params = {
						selectTime: this.form.implementTime.selectTime
					}
					this.form.implementTime = JSON.stringify(params);
				}
				if(this.planType == "每月") {
					this.flag = "每月";
					let params = {
						selectTime: JSON.stringify(this.form.implementTime.selectTime)
					}
					this.implementTime = this.form.implementTime.selectTime;
					this.form.implementTime = JSON.stringify(params);
				}
				if(this.planType == "每周") {
					this.flag = "每周";
					let params = {
						selectTime: JSON.stringify(this.form.cycleSelect.selectTime)
					}
					this.implementTime = this.form.implementTime.selectTime;
					this.form.cycleSelect = JSON.stringify(params);
					this.form.implementTime = JSON.stringify(params);
				}
				if(this.planType == "活动开始时间") {
					this.flag = "活动开始时间";
					if(this.form.implementTime=="长期"){
						this.otherDate = '长期';
						this.form.implementTime = '长期';
					}else{
						this.otherDate = this.form.implementTime.selectTime;
						let params = {
							selectTime: this.form.implementTime.selectTime
						}
						this.form.implementTime = JSON.stringify(params);
					}
				}
				if(this.planType == "活动结束时间") {
					if(this.form.implementTime=="长期"){
						this.otherDate = '长期';
						this.form.implementTime = '长期';
					}else{
						this.flag = "活动结束时间";
						this.otherDate = this.form.implementTime.selectTime;
						let params = {
							selectTime: this.form.implementTime.selectTime
						}
						this.form.implementTime = JSON.stringify(params);
					}
				}
			} else if(this.getPageType == '创建') {
				let res = this.data;
				if(!res) {
					return false;
				}
				this.form = {
					...res
				}
//				console.log(JSON.stringify(this.form))
				this.planType = this.form.implementType;
				if(this.form.carbonCopyObj!=""){
					let array = this.form.carbonCopyObj.indexArray.split(",");
					if(this.form.implement != "") {
						if(this.form.implement != "无条件") {
							this.implement = "自定义条件";
							this.formImplement = this.form.implement;
							this.disabledImplement = false;
						}
					}
					let array1 = [];
					array.forEach((val, index) => {
						array1.push(parseInt(val))
					})
					this.carbonCopyObj = array1;
					this.form.carbonCopyObj = JSON.stringify(this.form.carbonCopyObj);
				}

				if(this.planType == "自动执行") {
					this.flag = "自动执行";
				}
				if(this.planType == "指定时间") {
					this.flag = "指定时间";
					if(this.form.implementTime!=""){
						this.selectDate = this.form.implementTime.selectDate;
						let date = {
							selectDate: this.form.implementTime.selectDate
						}
						this.form.implementTime = JSON.stringify(date);
					}
				}
				if(this.planType == "每天") {
					this.flag = "每天";
					if(this.form.implementTime!=""){
						this.implementDate = this.form.implementTime.selectTime;
						let params = {
							selectTime: this.form.implementTime.selectTime
						}
						this.form.implementTime = JSON.stringify(params);
					}
				}
				if(this.planType == "每月") {
					this.flag = "每月";
					if(this.form.implementTime!=""){
					let params = {
							selectTime: JSON.stringify(this.form.implementTime.selectTime)
						}
						this.implementTime = this.form.implementTime.selectTime;
						this.form.implementTime = JSON.stringify(params);
					}
				}
				if(this.planType == "每周") {
					this.flag = "每周";
					if(this.form.implementTime!=""){
						let params = {
							selectTime: JSON.stringify(this.form.cycleSelect.selectTime)
						}
						this.implementTime = this.form.implementTime.selectTime;
						this.form.cycleSelect = JSON.stringify(params);
						this.form.implementTime = JSON.stringify(params);
					}
				}
				if(this.planType == "活动开始时间") {
					this.flag = "活动开始时间";
					if(this.form.implementTime!=""){
						if(this.form.implementTime=="长期"){
							this.otherDate = '长期';
							this.form.implementTime = '长期';
						}else{
							this.otherDate = this.form.implementTime.selectTime;
							let params = {
								selectTime: this.form.implementTime.selectTime
							}
							this.form.implementTime = JSON.stringify(params);
						}
					}
				}
				if(this.planType == "活动结束时间") {
					this.flag = "活动结束时间";
					if(this.form.implementTime!=""){
						if(this.form.implementTime=="长期"){
							this.otherDate = '长期';
							this.form.implementTime = '长期';
						}else{
							this.otherDate = this.form.implementTime.selectTime;
							let params = {
								selectTime: this.form.implementTime.selectTime
							}
							this.form.implementTime = JSON.stringify(params);
						}
					}
				}
				if(giveTypeInfo){
					if(giveTypeInfo.radiusType=="发消息"){
						this.giveTypeDis=true;
						this.form.implementAction='消息提醒';
						this.disabledImplementActive = true;
						this.form.sendChannel = "短信发送";
					}
					if(giveTypeInfo.radiusType=="送积分"){
						this.giveTypeDis=true;
						this.form.implementAction='送积分';
						this.disabledImplementActive = true;
						this.form.sendChannel = "微信直接发送";
					}
				}
			}

			let params = {
				"userId": this.userInfo.userCode
			}
			this.seleteData(params, 'select');
			//		console.log(params)
			// 查询接口

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
		mounted() {
			this.list = this.states.map(item => {
				return {
					value: item,
					label: item
				};
			});
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		// width: rem(700px);
		// min-width: 500px;
	}
	
	.el-select {
		width: 220px;
	}
	.el-input{
		width: 220px;
	}
	
	.el-table-filter {
		max-height: 300px;
		overflow: auto;
	}
	
	.width50{
		width: 50%;
	}
	.block {
		float: left;
		margin-right: 10px;
	}
	
	.sendChannel{
		display: block;
		margin-bottom: 10px;
		margin-top: 10px;
	}
</style>