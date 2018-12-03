<!--优惠券-优惠券模板 子页面-->
<template>
	<el-container class="app-container">
		<el-main v-loading="this.tableLoading">
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" :rules="rules" v-if="" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="8">
							<el-form-item label="券类型" prop="couponType">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.couponType" placeholder="请选择券类型"></el-input>
								<el-select v-else v-model="form.couponType" placeholder="请选择" @change="roleSelect">
									<el-option v-for="item in couponTypeData" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="券使用门槛" prop="">
								<el-input v-model="form.useThreshold" :disabled="disabled" placeholder="请输入券使用门槛"></el-input>
							</el-form-item>
							<el-form-item label="享受折扣" prop="couponValue" v-if="form.couponType=='折扣券'">
								<el-input v-model="form.couponValue" :disabled="disabledIndex" placeholder="请输入券面值"></el-input>
								<p class="hint">说明：88=88折，最大值不得超过100</p>
							</el-form-item>
							<el-form-item label="券面值" prop="couponValue"  v-if="form.couponType!='折扣券'">
								<el-input v-model="form.couponValue" :disabled="disabledIndex" placeholder="请输入券面值"></el-input>
							</el-form-item>
							<el-form-item label="优惠券券模板" prop="coupTempName">
								<el-input v-model="form.coupTempName" :disabled="true" placeholder="请输入优惠券券模板"></el-input>
							</el-form-item>
							<!--{{ returnCoupTempName }}-->
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitForm('form')" >确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail,validateFloat } from '@/utils/validate';
	import { addCouponTemplate} from '@/api/member/couponTemplate'
	import Cookie from 'js-cookie'
	import { mapGetters } from 'vuex'
	const isFloat = (rule, value, callback) => {
		if(value != "") {
			if(!validateFloat(value)) {
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
				tableLoading:false,
				disabled: true,//查看的时候的只读标识
				disabledIndex:true,
				couponType:'',
				qType:'',
				// form表单数据
				form: {
					couponType: '',//couponType
					useThreshold: '',  //券使用门槛
					couponValue: '',  //券面值
					coupTempName: ''//优惠券券模板
				},
				// 门店分类
				couponTypeData: [{
					index: '0',
					value: '代金券',
					key: '代金券'
				}, {
					index: '1',
					value: '折扣券',
					key: '折扣券'
				}, {
					index: '2',
					value: '礼品券',
					key: '礼品券'
				}, {
					index: '3',
					value: '邀请券',
					key: '邀请券'
				}],
				rules:{},
				rulesFloat: {
					couponType: [
						{ required: true, message: '请选择券类型', trigger: 'change' },
					],
					useThreshold: [
						{ required: true, message: '请输入券使用门槛', trigger: 'change' },
						,{
							validator: isFloat
						}
					],
					couponValue: [
						{ required: true, message: '请输入券面值', trigger: 'change' },
						,{
							validator: isFloat
						}
					]
				},
				rulesText: {
					couponType: [
						{ required: true, message: '请选择券类型', trigger: 'change' },
					],
					useThreshold: [
						{ required: true, message: '请输入券使用门槛', trigger: 'change' },
					],
					couponValue: [
						{ required: true, message: '请输入券面值', trigger: 'change' },
					]
				},
				rulesFloatZk: {
					couponType: [
						{ required: true, message: '请选择券类型', trigger: 'change' },
					],
					useThreshold: [
						{ required: true, message: '请输入券使用门槛', trigger: 'change' },
						,{
							validator: isFloat
						}
					],
					couponValue: [
						{ required: true, message: '请输入享受折扣', trigger: 'change' },
						,{
							validator: isFloat
						}
					]
				},
			}
		},
		methods: {
			//		监听下拉框事件：
			roleSelect(val) {
				this.form.useThreshold="";
				this.form.couponValue="";
				this.form.coupTempName="";
				
				let index = parseInt(val);
				let data = this.couponTypeData[index];
				this.form.couponType=data.key;
				this.qType=data.key;
				this.disabled = false;
				this.disabledIndex = false;
				if(data.key=="礼品券"){
					this.disabledIndex = true;
					this.form.couponValue = "礼品券";
					this.rules=this.rulesText;
				}else{
					this.rules=this.rulesFloat;
				}
				if(data.key=="折扣券"){
					this.rules=this.rulesFloatZk;
				}
			},
			// 方法
			submitForm(formName) {
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '优惠券模板'
					});
					return false;
				}
				let that =this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.getPageType == '添加') {
							let params  ={
								userId:this.userInfo.userCode,
								...this.form
							}
							if(params.couponType=="折扣券"&&params.couponValue>100){
			                    that.$message.warning('最大享受折扣值不得超过100');
			                    return false;
							}
//							console.log(JSON.stringify(params));
//							return false;
							that.tableLoading=true;
					        addCouponTemplate(params)
					            .then((res) => {
					             	let data = JSON.parse(Base64.decode(res.data));
//					             	console.log(data);
									if(data.messageType == 'SUCCESS') {
										that.tableLoading=false;
					                    that.$message.success(data.messageContent);
										that.$router.push({name: '优惠券模板'});
					                }else {
										that.tableLoading=false;
					                    that.$message.warning(data.messageContent);
					                }
					            })
					            .catch((err) => {
									that.tableLoading=false;
//					                 console.log(err);
					            });
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			//返回按钮   
			handleBack() {
				this.$router.push({
					name: '优惠券模板'
				});
			}
		},
		created() {
			this.rules=this.rulesFloat;
			// 钩子函数 -- 初始化
			this.uploadActUrl = Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action';
//			console.log(this.getFormData)
			this.form.brandName = this.$route.params.brandName;
			if(this.getPageType == '查看') {
				this.disabled = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				this.rules={};
				// console.log(res)
			} else if(this.getPageType == '修改') {
				this.disabled = false;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// console.log(res)
			}
		},
//      components: {
//          merchantManagerUserDD
//      },
		computed: {
			// 计算属性
	        //登录时候缓存的用户类型和用户代码
	        ...mapGetters([
	            'userInfo',
	        ]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getpageTypeOther() {
				return this.$route.params.pageTypeOther;
			},
			pageTypes() {
				return this.$route.params.pageTypes;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getMainData(){
				return this.$route.params.mainData;
			}
		},
		watch: {
			form:{
				handler(curVal,oldVal){
					if(this.qType=="代金券"||this.qType=="邀请券"){
						if(curVal.useThreshold!=""&&curVal.couponValue!=""){
							this.form.coupTempName = "满"+curVal.useThreshold+"元价值"+curVal.couponValue+"元代金券";
						}
						if(curVal.useThreshold==""&&curVal.couponValue!=""){
							this.form.coupTempName = curVal.couponValue+"元代金券";
						}
						if(curVal.useThreshold!=""&&curVal.couponValue==""){
							this.form.coupTempName = "满"+curVal.useThreshold+"元价值";
						}
					}
					if(this.qType=="折扣券"){
						if(curVal.useThreshold!=""&&curVal.couponValue!=""){
							this.form.coupTempName = "满"+curVal.useThreshold+"元价值"+curVal.couponValue+"%折扣券";
						}
						if(curVal.useThreshold==""&&curVal.couponValue!=""){
							this.form.coupTempName = curVal.couponValue+"%折扣券";
						}
						if(curVal.useThreshold!=""&&curVal.couponValue==""){
							this.form.coupTempName = "满"+curVal.useThreshold+"元价值";
						}
					}
					if(this.qType=="礼品券"){
						this.form.coupTempName = "礼品券";
					}
//					console.log(curVal.useThreshold)
//					console.log(curVal.label)
　　　　　　　　　　},
　　　　　　　　　　deep:true
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
		/*width: rem(940px);
		min-width: 500px;*/
	}
	.el-select {
		width: 100%;
	}
	.el-button{
		margin-bottom: 5px;
	}
	.margin10 {
		margin-bottom: 10px;
	}
	
	.middle-input {
		width: 65%;
	}
	
	.el-form--inline .el-form-item{
		margin: 10px;
	}
	.labelOter {
		position: absolute;
		width: 45px;
		margin-left: 10px;
		right: 0px;
		text-align: right;
	}
	/*级联选择器*/
	
	.el-cascader {
		width: 100%;
	}
	.hint{
		text-align: left;
		color: #e73839;
	}
</style>