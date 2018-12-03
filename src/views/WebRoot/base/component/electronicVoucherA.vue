// 预置活动模板 - 新建模板 - 设置基本信息
<template>
	<el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form" v-loading="formLoading">
		<!--<el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型">
                <el-option v-for="item in typeInfo" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>-->
		<el-form-item label="券流水号位数" prop="serialNumDigif">
			<el-input v-model="form.serialNumDigif" placeholder="请输入券流水号位数"></el-input>
		</el-form-item>
		<el-form-item label="劵号起始位" prop="beginDigif">
			<el-input v-model="form.beginDigif" placeholder="请输入劵号起始位"></el-input>
		</el-form-item>
		<el-form-item label="劵号前缀字符" prop="prefixChar">
			<el-input v-model="form.prefixChar" placeholder="请输入劵号前缀字符"></el-input>
		</el-form-item>
		<el-form-item label="劵号后缀长度" prop="endPrefixLength">
			<el-input v-model="form.endPrefixLength" placeholder="请输入劵号后缀长度"></el-input>
		</el-form-item>
		<el-form-item label="代金券背景">
			<el-color-picker size="small" v-model="bgColor.bgVoucher.begin" class="marginRight10"></el-color-picker>
			<el-color-picker size="small" v-model="bgColor.bgVoucher.end"></el-color-picker>
		</el-form-item>
		<el-form-item label="折扣券背景">
			<el-color-picker size="small" v-model="bgColor.bgDeductedVocucher.begin" class="marginRight10"></el-color-picker>
			<el-color-picker size="small" v-model="bgColor.bgDeductedVocucher.end"></el-color-picker>
		</el-form-item>
		<el-form-item label="礼品券背景">
			<el-color-picker size="small" v-model="bgColor.bgGiftVoucher.begin" class="marginRight10"></el-color-picker>
			<el-color-picker size="small" v-model="bgColor.bgGiftVoucher.end"></el-color-picker>
		</el-form-item>
		<el-form-item label="邀请券背景">
			<el-color-picker size="small" v-model="bgColor.invitationVoucher.begin" class="marginRight10"></el-color-picker>
			<el-color-picker size="small" v-model="bgColor.invitationVoucher.end"></el-color-picker>
		</el-form-item>
		<el-button type="primary" @click="next" v-if="roleBtn.selectElectronicRuleInfo">保存</el-button>
	</el-form>

</template>
<script>
	import { permission } from '@/utils'
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail ,validateInt} from '@/utils/validate';
	import { getBrandInfo } from '@/api/public'
	import { addElectronic, setElectronic ,selectElectronic} from '@/api/base/electronic'
	import { mapGetters } from 'vuex'
	const isInt = (rule, value, callback) => {
		if(value != "") {
//			console.log(value)
			if(!validateInt(value)) {
//			console.log(value)
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
				roleBtn: {
					selectElectronicRuleInfo: false,
					addElectronicRuleInfo: false,
					updateElectronicRuleInfo: false
				},
				brandId: '',
				brandName: '',
				formLoading:true,
				enterType:'添加',
				// form表单数据
				form: {
					//              type: '', // 类型（基本设置、代金券、折扣劵、礼品劵...)
					serialNumDigif: '', // 劵流水号位数（劵号不超过18位）
					beginDigif: '', // 劵号起始位
					prefixChar: '', // 劵号前缀字符
					endPrefixLength: '', // 劵号后缀长度
					bgColor: {}, // 背景色(json格式字符串)
				},
				bgColor: {
					"bgVoucher": {
						"begin": "#FF4961",
						"end": "#FF4961"
					},
					"bgDeductedVocucher": {
						"begin": "#FF8C1F",
						"end": "#FF8C1F"
					},
					"bgGiftVoucher": {
						"begin": "#3994FF",
						"end": "#3994FF"
					},
					"invitationVoucher":{
						"begin": "#0DFF00",
						"end": "#0DFF00"
					}
				},
				// 时间范围
				timeRange: '',
				// 时间范围选择禁用
				datePickerDisabled: true,
				rules: {
					serialNumDigif: [{
							required: true,
							message: '请输入劵流水号位数',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},{
							validator: isInt
						}
					],
					beginDigif: [{
							required: true,
							message: '请输入劵号起始位',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},{
							validator: isInt
						}
					],
					prefixChar: [{
							required: true,
							message: '请输入劵号前缀字符',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					endPrefixLength: [{
							required: true,
							message: '请输入劵号后缀长度',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},{
							validator: isInt
						}
					],
					status: [{
							required: true,
							message: '请选择状态',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					time: [{
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
					// sex: [
					//     { required: true, message: '请输入性别', trigger: 'change' },
					//     { validator: isRadioSelected, type: 'change' },       
					// ],
				}
			}
		},
		methods: {
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			// 单选
			radioTimeHandle(str) {
				if(str == '时间段') {
					this.datePickerDisabled = false;
				} else if(str == '长期') {
					this.datePickerDisabled = true;
				}
			},
			// 时间选择器
			datePickerTime(str) {
				this.timeRange = str;
			},
			next() {
				//      	console.log(this.bgColor.bgVoucher==null)
				let that = this;
				this.form.bgColor = JSON.stringify(this.bgColor);
				this.$refs['form'].validate((valid) => {
					if(valid) {
						this.formLoading=true;
						if(that.enterType == "添加"){
							let params = {
								userId: this.userInfo.userCode,
								electronicRule: {
									brandId: this.brandId,
									brandName: this.brandName,
									serialNumDigif:this.form.serialNumDigif, // 劵流水号位数（劵号不超过18位）
									beginDigif: this.form.beginDigif, // 劵号起始位
									prefixChar: this.form.prefixChar, // 劵号前缀字符
									endPrefixLength: this.form.endPrefixLength, // 劵号后缀长度
									bgColor: this.form.bgColor // 背景色(json格式字符串)
								}
							}
							addElectronic(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									// console.log(data)
									that.formLoading=false;
									if(data.messageType == 'SUCCESS') {
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										let param = {
											userId: that.userInfo.userCode
										}
										that.getElectronic(param);
									} else {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
									//								console.log(data)
								})
								.catch(function(err) {
									this.formLoading=false;
									// console.log(err);
								});
						}else{
							let params = {
								userId: this.userInfo.userCode,
								electronicRule: {
									brandId: this.brandId,
									brandName: this.brandName,
									serialNumDigif:this.form.serialNumDigif, // 劵流水号位数（劵号不超过18位）
									beginDigif: this.form.beginDigif, // 劵号起始位
									prefixChar: this.form.prefixChar, // 劵号前缀字符
									endPrefixLength: this.form.endPrefixLength, // 劵号后缀长度
									bgColor: this.form.bgColor, // 背景色(json格式字符串)
									version:this.form.version,
									id:this.form.id
								}
							}		
							setElectronic(params)
								.then(function(res) {
									//								console.log(res)
									let data = JSON.parse(Base64.decode(res.data));
									that.formLoading=false;
																	// console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										let param = {
											userId: that.userInfo.userCode
										}
										that.getElectronic(param);
									} else {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
								})
								.catch(function(err) {
									that.formLoading=false;
									// console.log(err);
								});
						}
					}
				})
			},
			getElectronic(param) {
				//          console.log(param)
				if(this.roleBtn.selectElectronicRuleInfo) {
					let that = this;
					this.formLoading=true;
					selectElectronic(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
//	                      	console.log(JSON.stringify(data.messageContent)+"查询返回值")
							if(data.messageType == 'SUCCESS') {
								if(JSON.stringify(data.messageContent) == "{}") {
									that.enterType = "添加";
								} else {
									that.enterType = "修改";
									sessionStorage.setItem("data", JSON.stringify(data.messageContent));
									that.form = data.messageContent.electronicRule;
									if(that.form.bgColor != '') {
										that.bgColor = that.form.bgColor;
									}
									if(sessionStorage.getItem("dataOnes")) {
										let data = sessionStorage.getItem("dataOnes");
										that.form = JSON.parse(data);
										that.bgColor = JSON.parse(that.form.bgColor);
									}
								}
							} else {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							}
							this.formLoading=false;
						})
						.catch((err) => {
							// console.log(err);
							this.formLoading=false;
						});
				}
			},
			getBrand(params) { 
				//      	console.log(params)
				let that = this;
				getBrandInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data)+"品牌");
						that.brandName = data.messageContent.brandName;
						that.brandId = data.messageContent.brandId;
						let param = {
							userId: that.userInfo.userCode
						}
						that.getElectronic(param);
					})
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			if(sessionStorage.getItem("dataOnes")) {
				var params = sessionStorage.getItem("dataOnes");
				this.form = JSON.parse(params);
				this.bgColor = JSON.parse(this.form.bgColor);
			}
			sessionStorage.removeItem("dataOnes");
			sessionStorage.removeItem("dataTwos");
			var params = {
				userId: this.userInfo.userCode
			}
			this.getBrand(params);

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
	.el-select {
		width: 100%;
	}
	
	.el-form-item {
		width: rem(340px);
	}
	
	.el-color-picker--small .el-color-picker__icon, .el-color-picker--small .el-color-picker__empty {
		display: none!important;
	}
</style>