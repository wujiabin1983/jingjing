//活动模板 - 新建模板 - 设置基本信息
<template>
	<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" ref="form1" label-width="120px" class="demo-form">
		<el-form-item label="活动类型" prop="activityType">
			<el-input v-model="form.activityType" :disabled="disabled" v-if="this.getPageType=='查看'" placeholder="请输入活动名称"></el-input>
			<el-select v-model="form.activityType" placeholder="请选择活动类型" v-else>
				<el-option v-for="item in activityTypeSelInfo" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="活动模板名称" prop="templateName">
			<el-input v-model="form.templateName" :disabled="disabled" placeholder="活动模板名称"></el-input>
		</el-form-item>
		<el-form-item label="模板简介" prop="templateDesc">
			<el-input type="textarea" :rows="2" resize='none' :disabled="disabled" placeholder="请输入模板简介" v-model="form.templateDesc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
		</el-form-item>
		<el-form-item label="活动时间" prop="" v-if="this.getPageType=='查看'&&this.form.activityDate=='长期'">
			<el-input v-model="form.activityDate" :disabled="disabled" placeholder="请输入"></el-input>
		</el-form-item>
		<el-form-item label="活动时间" prop="" v-if="this.getPageType=='查看'&&this.form.activityDate!='长期'">
			<el-input v-model="timeRange" :disabled="disabled" placeholder="请输入"></el-input>
		</el-form-item>
		<el-form-item label="活动时间" prop="" v-if="this.getPageType!='查看'">
			<el-radio-group v-model="activityDate" @change="radioTimeHandle">
				<div class="mrgBottom10">
					<el-radio label="时间段">
						<el-date-picker :editable="false"  :picker-options="pickerOptions0" :disabled="datePickerDisabled" v-model="timeRangeArr" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-radio>
				</div>
				<div>
					<el-radio label="长期">长期</el-radio>
				</div>
			</el-radio-group>
		</el-form-item>
		<el-button @click="back">返回</el-button>
		<el-button type="primary" @click="next">下一步</el-button>
	</el-form>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	export default {
		data() {
			return {
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
				disabled: false,
				nav: '',
				timeRangeArr: [],
				type: '',
				// form表单数据
				activityDate: '时间段',
				form: {
					activityType: '', // 活动类型
					templateName: '', // 模板名称
					templateDesc: '', // 模板简介
					activityDate: '' // 活动时间
				},
				norules: {},
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
						value: '其他',
						label: '其他'
					}
				],
				// 时间范围
				timeRange: '',
				// 时间范围选择禁用
				datePickerDisabled: false,
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
					templateName: [{
							required: true,
							message: '请输入模板名称',
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
				}
			}
		},
		methods: {
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
				if(this.type == '时间段') {
					this.datePickerDisabled = false;
					this.form.activityDate = "";
				} else if(this.type == '长期') {
					this.datePickerDisabled = true;
					this.form.activityDate = "长期";
					this.timeRangeArr = [];
				}
			},
			back() {
				if(this.getFlag) {
					if(this.getFlag == "平台") {
						this.$router.push({
							name: '预置活动模板'
						});
					} else {
						this.$router.push({
							name: '活动模板'
						});
					}
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
			    if(this.form.activityType=="消费享N倍积分"){
			    	sessionStorage.setItem("activityType", '消费享N倍积分');
			    }else{
			    	sessionStorage.setItem("activityType", '');
			    }
				//     		console.log(JSON.stringify(this.form))
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
		},
		created() {
			// 钩子函数 -- 初始化
			if(sessionStorage.getItem("dataOne")) {
				var data = sessionStorage.getItem("dataOne");
				this.form = JSON.parse(data);
				//      	console.log(this.form.activityDate);
				if(this.form.activityDate!=""){
					if(this.form.activityDate != '长期') {
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
					}
				}
			}
			if(this.getPageType == '查看') {
				this.disabled = true;
				let res = JSON.parse(this.getFormData);
//				           console.log(res)
				this.form = {
					activityType: res.activeTempMas.activityType, // 活动类型
					templateName: res.activeTempMas.templateName, // 模板名称
					templateDesc: res.activeTempMas.templateDesc, // 模板简介
					activityDate: res.activeTempMas.activityDate // 活动时间
				}
				if(res.activeTempMas.activityDate!=""){
					if(res.activeTempMas.activityDate != "长期") {
						this.type = '时间段';
						this.timeRange = res.activeTempMas.activityDate.activityDateBegin + " ~ " + res.activeTempMas.activityDate.activityDateEnd;
					} else {
						this.type = '长期';
					}
				}
			} else if(this.getPageType == '修改' || this.getPageType == '复制') {
				let res = '';
				if(!sessionStorage.getItem("dataOne")) {
					res = JSON.parse(this.getFormData);
					//      		console.log(res)
					this.form = {
						activityDate: res.activeTempMas.activityDate, // 活动时间
						activityType: res.activeTempMas.activityType, // 活动类型
						templateName: res.activeTempMas.templateName, // 模板名称
						templateDesc: res.activeTempMas.templateDesc // 模板简介
					}

					if(res.activeTempMas.activityDate!=""){
						if(res.activeTempMas.activityDate != "长期") {
							this.type = '时间段';
							this.activityDate = "时间段";
							let array = [];
							array.push(res.activeTempMas.activityDate.activityDateBegin);
							array.push(res.activeTempMas.activityDate.activityDateEnd);
							this.timeRangeArr = array;
							var params = {
								activityDateBegin: res.activeTempMas.activityDate.activityDateBegin,
								activityDateEnd: res.activeTempMas.activityDate.activityDateEnd
							}
							this.form.activityDate = JSON.stringify(params);
						} else {
							this.type = '长期';
							this.activityDate = "长期";
						}
						this.form.activityDate = JSON.stringify(res.activeTempMas.activityDate);
					}
				}
			}
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getFlag() {
				return this.$route.params.flag;
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
	.el-button{
		margin-top: 12px;
	}
	
	.el-select {
		width: 100%;
	}
</style>