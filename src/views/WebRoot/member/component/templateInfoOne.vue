// 营销活动 - 活动管理 - 新建活动/查看详情/修改 - 设置基本信息
<template>
	<el-form :model="form" :rules="nav==='event'&&this.getPageType!='查看' ? eventRules : this.getPageType=='查看' ? norules : rules" ref="form1" label-width="120px" class="demo-form">
		<el-form-item label="活动类型" prop="activityType">
			<el-input v-model="form.activityType" :disabled="disabled" v-if="this.getPageType=='查看'" placeholder="请输入活动名称"></el-input>
			<el-select v-model="form.activityType" placeholder="请选择活动类型" @change="activityTypeChange" v-else>
				<el-option v-for="item in activityTypeSelInfo" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="触发事件" v-if="nav==='event'" prop="setEvent.event">
			<el-select v-model="form.setEvent.event" placeholder="请选择触发事件" v-if="this.getPageType!='查看'">
				<el-option label="关注" value="关注"></el-option>
				<el-option label="升级 " value="升级"></el-option>
				<el-option label="入会 " value="入会"></el-option>
			</el-select>
			<el-input v-model="form.setEvent.event" v-else :disabled="disabled"></el-input>
		</el-form-item>
		<el-form-item label="等级" v-if="this.form.setEvent.event=='升级'" prop="setEvent.level">
			<el-select v-model="form.setEvent.level" placeholder="请选择等级" @change="setEventChange"  v-if="this.getPageType!='查看'">
				<el-option v-for="item in levelOption" :key="item.key" :label="item.label" :value="item.label">
				</el-option>
			</el-select>
			<el-input v-model="form.setEvent.level" v-else :disabled="disabled"></el-input>
		</el-form-item>
		<el-form-item label="活动名称" prop="activityName">
			<el-input v-model="form.activityName" :disabled="disabled" placeholder="请输入活动名称"></el-input>
		</el-form-item>
		<el-form-item label="活动时间" prop="activityDate" v-if="this.getPageType=='查看'&&this.form.activityDate=='长期'">
			<el-input v-model="form.activityDate" :disabled="disabled" placeholder=""></el-input>
		</el-form-item>
		<el-form-item label="活动时间" prop="activityDate" v-if="this.getPageType=='查看'&&this.form.activityDate!='长期'">
			<el-input v-model="timeRange" :disabled="disabled" placeholder=""></el-input>
		</el-form-item>
		<el-form-item label="活动时间" prop="activityDate" v-if="this.getPageType!='查看'">
			<el-radio-group v-model="activityDate" @change="radioTimeHandle">
				<div class="mrgBottom10">
					<el-radio label="时间段">
						<el-date-picker :disabled="datePickerDisabled"  :picker-options="pickerOptions0" v-model="timeRangeArr" @change="selectDate" :editable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-radio>
				</div>
				<div>
					<el-radio label="长期">长期<el-input v-model="form.activityDate" v-show></el-input></el-radio>
				</div>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="驳回理由" v-if="this.status=='未通过'">
			<el-input type="textarea" :rows="2" resize='none' :disabled="disabled" placeholder="请输入内容" v-model="reclaimRemark" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
		</el-form-item>
		<el-button @click="back">返回</el-button>
		<el-button type="primary"  @click="next">下一步</el-button>
	</el-form>
</template>
<script>
	// 手机号、固定电话、邮箱
	import {  selectLevalInfo } from '@/api/public'
	import { mapGetters } from 'vuex'
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	export default {
		data() {
			return {
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
				levelOption:[],
				disabled: false,
				nav: '',
				timeRangeArr: [],
				type: '',
				status: '',
				reclaimRemark: '',
				// form表单数据
				activityDate: '时间段',
				form: {
					activityType: '', // 活动类型
					activityName: '', // 活动名称
					activityDate: '', // 活动时间
					setEvent: {
						event:'',
						level:''
					}// 触发事件
				},
				// 活动类型
				activityTypeSelInfo: [{
						value: '会员权益类',
						label: '会员权益类'
					},
					{
						value: '生命周期类',
						label: '生命周期类'
					},
					{
						value: '消费激励类',
						label: '消费激励类'
					},
					{
						value: '消费享N倍积分',
						label: '消费享N倍积分'
					},
					{
						value: '事件触发',
						label: '事件触发'
					}
				],
				// 时间范围
				timeRange: '',
				// 时间范围选择禁用
				datePickerDisabled: false,
				norules: {},
				rules: {
					activityType: [{
							required: true,
							message: '请选择活动类型',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					activityName: [{
							required: true,
							message: '请输入活动名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					activityDate: [{
							required: true,
							message: '请选择活动时间',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				},
				eventRules: {
					activityType: [{
							required: true,
							message: '请选择活动类型',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					'setEvent.event': [{
							required: true,
							message: '请选择触发事件',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					activityName: [{
							required: true,
							message: '请输入活动名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					activityDate: [{
							required: true,
							message: '请选择活动时间',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					'setEvent.level': [{
							required: true,
							message: '请选择等級',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				},
			}
		},
		methods: {
			setEventChange(val){
			},
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			//选择时间监听
			selectDate(val) {
				//      	console.log(val)
				var params = {
					activityDateBegin: val[0],
					activityDateEnd: val[1]
				}
				this.form.activityDate = JSON.stringify(params);
			},
			// 单选
			radioTimeHandle(str) {
				this.type = str;
			    if(this.type == '长期') {
					this.datePickerDisabled = true;
					this.form.activityDate = "长期";
					this.timeRangeArr = [];
				}else if(this.type == '时间段') {
					this.datePickerDisabled = false;
					this.form.activityDate = "";
				}
			},
			back() {
				if(this.getType){
					if(this.getType=="memberSelect"){
						this.$router.push({
							name: '会员查询',
		                    params: {
		                        isMemeber: true
		                    }
						});
					}
				}else if(this.getPageType != '创建') {
					this.$router.push({
						name: '活动管理',
						params: {
		                    pageType: this.getPageTypes,
		                }
					});
				} else {
					this.$router.push({
						name: '活动模板'
					});
				}
				sessionStorage.removeItem("dataOne");
				sessionStorage.removeItem("dataTwo");
				sessionStorage.removeItem("dataThree");
			},
			next() {
				var that = this;
//	     		console.log(JSON.stringify(this.form));
			    if(this.form.activityType=="消费享N倍积分"){
			    	sessionStorage.setItem("activityType", '消费享N倍积分');
			    }else{
			    	sessionStorage.setItem("activityType", '');
			    }
				this.$refs['form1'].validate((valid) => {
					if(valid) {
						if(this.getPageType != "查看") {
							sessionStorage.setItem("dataOne", JSON.stringify(this.form));
						}
					    if(this.form.activityType=="事件触发"){
							this.$emit('message', '2');
							sessionStorage.setItem("dataTwo",'');
					    }else{
					    	this.$emit('message', '1');
					    }
					} else {
						// console.log('验证失败')
					}
				});
			},
			activityTypeChange(val) {
				if(val == "事件触发") {
					this.nav = "event";
				}else{
					this.nav = "";
					this.form.setEvent = "";
				}
			}
		},
		created() {
			if(this.getPageData){
				sessionStorage.setItem("memberSelect",this.getPageData);
			}
//			console.log(this.getType);
			//等级
			var params = {
				userId: this.userInfo.userCode
			}
//			console.log(this.userInfo.userType)
			selectLevalInfo(params)	
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(JSON.stringify(data) + "等级")
					if(data != "") {
						data.data.forEach((val,index)=>{
							this.levelOption.push({
								key:val.key,
								label:val.key
							})
						})
					}
				})
				.catch((err) => {
				})
			// 钩子函数 -- 初始化
			if(sessionStorage.getItem("dataOne")) {
//				console.log('创建')
				var data = sessionStorage.getItem("dataOne");
				this.form = JSON.parse(data);
//				console.log(data);
				if(this.form.activityType == '事件触发') {
					this.nav = "event";
				}
				if(this.form.activityDate != "长期"&&JSON.parse(this.form.activityDate) != "长期") {
					this.type = '时间段';
					let array = [];
					let date = JSON.parse(this.form.activityDate);
					array.push(date.activityDateBegin);
					array.push(date.activityDateEnd);
					this.timeRangeArr = array;
					var params = {
						activityDateBegin: date.activityDateBegin,
						activityDateEnd: date.activityDateEnd
					}
					this.form.activityDate = JSON.stringify(params);
				} else {
					this.type = '长期';
					this.activityDate = "长期";
					this.datePickerDisabled=true;
				}
			}
//				            console.log(JSON.stringify(this.getPageType))
			if(this.getPageType == '查看') {
//				console.log('查看')
				this.disabled = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res.marketingActivitie
				}
				        //   console.log(JSON.stringify(this.form))
				if(res.marketingActivitie.activityType == "事件触发") {
					this.nav = "event";
				}
				if(res.marketingActivitie.activityDate != "长期") {
					this.form.activityDate = JSON.stringify(res.marketingActivitie.activityDate);
					this.type = '时间段';
					this.timeRange = res.marketingActivitie.activityDate.activityDateBegin + " ~ " + res.marketingActivitie.activityDate.activityDateEnd;
				} else {
					this.type = '长期';
					this.activityDate = "长期";
					this.form.activityDate = "长期";
				}
				this.status = res.marketingActivitie.activityStatus;
				this.reclaimRemark = res.marketingActivitie.reclaimRemark;
			} else if(this.getPageType == '修改') {
//				console.log('修改')
				let res = '';
				if(!sessionStorage.getItem("dataOne")) {
					res = JSON.parse(this.getFormData);
//					      		console.log(res)
					this.form = {
						activityType: res.marketingActivitie.activityType, // 活动类型
						activityName: res.marketingActivitie.activityName, // 活动名称
						activityDate: res.marketingActivitie.activityDate, // 活动时间
						setEvent: res.marketingActivitie.setEvent // 触发事件
					}

					//	            console.log(JSON.stringify(this.form))
					if(res.marketingActivitie.activityType == "事件触发") {
						this.nav = "event";
					}
					if(res.marketingActivitie.activityDate != "长期") {
						this.type = '时间段';
						let array = [];
						array.push(res.marketingActivitie.activityDate.activityDateBegin);
						array.push(res.marketingActivitie.activityDate.activityDateEnd);
						this.timeRangeArr = array;
						var params = {
							activityDateBegin: res.marketingActivitie.activityDate.activityDateBegin,
							activityDateEnd: res.marketingActivitie.activityDate.activityDateEnd
						}
						this.form.activityDate = JSON.stringify(params);
					} else {
						this.type = '长期';
						this.activityDate = "长期";
					}
					this.form.activityDate = JSON.stringify(res.marketingActivitie.activityDate);
				}
			} else if(this.getPageType == '创建') {
//				console.log('创建')
				let res = '';
				if(!sessionStorage.getItem("dataOne")) {
					res = JSON.parse(this.getFormData);
					res.marketingActivitie = res.activeTempMas;
//					      		 console.log(res)
					this.form = {
						activityType: res.marketingActivitie.activityType, // 活动类型
						activityName: res.marketingActivitie.templateName, // 活动名称
						activityDate: res.marketingActivitie.activityDate, // 活动时间
						setEvent: res.marketingActivitie.setEvent // 触发事件
					}

					//	            console.log(JSON.stringify(this.form))
					if(res.marketingActivitie.activityType == "事件触发") {
						this.nav = "event";
					}
					if(res.marketingActivitie.activityDate!=""){
						if(res.marketingActivitie.activityDate != "长期") {
							this.type = '时间段';
							let array = [];
							array.push(res.marketingActivitie.activityDate.activityDateBegin);
							array.push(res.marketingActivitie.activityDate.activityDateEnd);
							this.timeRangeArr = array;
							var params = {
								activityDateBegin: res.marketingActivitie.activityDate.activityDateBegin,
								activityDateEnd: res.marketingActivitie.activityDate.activityDateEnd
							}
							this.form.activityDate = JSON.stringify(params);
						} else {
							this.type = '长期';
							this.activityDate = "长期";
						}
						this.form.activityDate = JSON.stringify(res.marketingActivitie.activityDate);	
					}
				}
			}
		},
		computed: {
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			// 计算属性
			getType() {
				return this.$route.params.type;
			},
			getPageType() {
				return this.$route.params.pageType;
			},
			getPageTypes() {
				return this.$route.params.pageTypes;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getPageData() {
				return this.$route.params.pageData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		width: rem(700px);
		min-width: 500px;
	}
	
	.el-select {
		width: 100%;
	}
	.el-button{
		margin-top: 12px;
	}
</style>