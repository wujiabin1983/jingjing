// 基础设置 - 业务规则 - 会员权益 - 等级
<template>
	<div class="container">
		<el-card class="noPadding">
			<el-header>
				<el-form :model="form" ref="form" label-width="90px" :inline="true" :rules="rules">
					<el-form-item label="等级名称" prop="type">
						<el-input v-model="form.type" class="type-input"></el-input>
					</el-form-item>
				</el-form>
			</el-header>
			<el-main v-if="!isDefault">
				<el-form :model="form" label-width="90px" :inline="true" :rules="rules">
					<el-form-item label="升级条件" v-if="!isPOS" class="is-required">
						<el-checkbox-group v-model="form.upgradRequire.checkbox" @change="upgradChange">
							<el-checkbox label="amountMoney" @change="handleURACheckbox" :disabled="saleType!=3">
								<div class="formText">累计消费</div>
								<el-input class="widthInline" v-model="form.upgradRequire.amountMoney" :disabled="saleType==2||saleType==4" @change="handleChangeAmountMoney"></el-input>
								<div class="formText">元</div>
							</el-checkbox>
							<el-checkbox label="unitMoney" @change="handleURUCheckbox" :disabled="saleType!=3">
								<div class="formText">单笔消费</div>
								<el-input class="widthInline" v-model="form.upgradRequire.unitMoney" :disabled="saleType==1||saleType==4" @change="handleChangeUnitMoney"></el-input>
								<div class="formText">元</div>
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="等级有效期">
						<el-radio-group v-model="form.levalExpDate.type" @change="handleLERadio" >
							<el-radio label="永久有效">
								<div class="formText">永久有效</div>
							</el-radio>
							<el-radio label="有效期N月">
								<div class="formText">有效期</div>
								<el-input class="widthInline" v-model="form.levalExpDate.month" :disabled="form.levalExpDate.type != '有效期N月'"></el-input>
								<div class="formText">月</div>
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="续会条件" v-if="form.levalExpDate.type != '永久有效'">
						<el-radio-group v-model="form.extendCondite.radio" @change="handleECRadio">
							<el-radio label="累计金额">
								<div class="formText">累计金额</div>
								<el-input class="widthInline" v-model="form.extendCondite.amountMoney" :disabled="form.extendCondite.radio != '累计金额'"></el-input>
								<div class="formText">元</div>
							</el-radio>
							<el-radio label="消费">
								<div class="formText">消费</div>
								<el-input class="widthInline" v-model="form.extendCondite.unitMoney" :disabled="form.extendCondite.radio != '消费'"></el-input>
								<div class="formText">元</div>
							</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</el-main>
		</el-card>
	</div>
</template>
<script>
	/**
	 * 接口信息
	 * 
	 */
	import { getModel } from '@/api/base/merchantManagerUser'
	import { mapGetters } from 'vuex'
	import { validateJsonObj ,validateInt} from '@/utils/validate';
	const isValidateJsonObj = (rule, value, callback) => {
		// console.log(typeof value);
		if(!validateJsonObj(value)) {
			callback(new Error('请正确填写'))
		} else {
			callback()
		}
	}
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
				isPOS: false, // 是否属于POS模式，还是SCRM模式
				form: {
					type: '', // 类型
					upgradRequire: { // 升级条件
						checkbox: [], // 多选
						amountMoney: '', // 累计消费
						unitMoney: '' // 单笔消费
					},
					extendCondite: { // 续会条件
						radio: '累计金额', // 单选
						amountMoney: '', // 累计金额
						unitMoney: '' // 消费
					},
					levalExpDate: { // 等级有效期
						type: '永久有效', // 永久有效
						month: '' // 有限时效
					},
					isDefault:false
				},
				upgradRequireDisabled1: false, // 升级条件 - 累计消费 - 禁止
				upgradRequireDisabled2: false, // 升级条件 - 单笔消费 - 禁止
				ECADisabled: false, // 续会条件 - 累计金额 - 禁用
				ECUdisabled: false, // 续会条件 - 消费 - 禁用
				LEDisabled: false, // 等级有效期 - 禁用
				rules: {
					type: [{
						required: true,
						message: '请输入等级名称',
						trigger: 'change'
					}],
					upgradRequire: [{
						validator: isValidateJsonObj
					}],
					extendCondite: [{
						validator: isValidateJsonObj
					}],
					levalExpDate: [{
						validator: isValidateJsonObj
					}],
				}
			}
		},
		props:['isDefault','saleType'],
		methods: {
			upgradChange(val){
				this.$emit('message', val);
			},
			// 升级条件，累计消费激活
			handleChangeAmountMoney() {
				if(this.form.upgradRequire.checkbox.indexOf('amountMoney') < 0) {
					this.form.upgradRequire.checkbox.push('amountMoney');
				}
			},
			// 升级条件，单笔消费激活
			handleChangeUnitMoney() {
				if(this.form.upgradRequire.checkbox.indexOf('unitMoney') < 0) {
					this.form.upgradRequire.checkbox.push('unitMoney');
				}
			},
			// 升级条件 - 累计消费选中事件
			handleURACheckbox(val) {
				if(!val) {
					// this.upgradRequireDisabled1 = true;
					this.form.upgradRequire.amountMoney = '';
				} else {
					this.upgradRequireDisabled1 = false;
				}
			},
			// 升级条件 - 单笔消费选中事件
			handleURUCheckbox(val) {
				if(!val) {
					// this.upgradRequireDisabled2 = true;
					this.form.upgradRequire.unitMoney = '';
				} else {
					this.upgradRequireDisabled2 = false;
				}
			},
			// 续会条件 - 单选
			handleECRadio(val) {
				// this.ECADisabled = true;
				// this.ECUdisabled = true;
				if(val == '累计金额') {
					this.ECADisabled = false;
					this.form.extendCondite.unitMoney = '';
				}
				if(val == '消费') {
					this.ECUdisabled = false;
					this.form.extendCondite.amountMoney = '';
				}
			},
			// 等级有效期 - 单选
			handleLERadio(val) {
				//              console.log(val)
				if(val == '永久有效') {
					// this.LEDisabled = true
					this.form.levalExpDate.month = '';

					this.form.extendCondite.radio = '累计金额';
					this.form.extendCondite.amountMoney = '';
					this.form.extendCondite.unitMoney = '';
				}
				if(val == '有效期N月') {
					this.LEDisabled = false
				}
			},
			// 保存
			handleDetermine() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						return true;
					} else {
						this.$message.error('错误');
						return false;
					}
				});
			},

		},
		created() {
				
//			if(this.saleType!=3){
//				this.upgradRequireDisabled1= true; // 升级条件 - 累计消费 - 禁止
//				this.upgradRequireDisabled2= true; // 升级条件 - 单笔消费 - 禁止
//			}
			if(this.saleType==0){
				this.form.upgradRequire.checkbox=["amountMoney","unitMoney"];
//				this.upgradRequireDisabled1= false; // 升级条件 - 累计消费 - 禁止
//				this.upgradRequireDisabled2= false; // 升级条件 - 单笔消费 - 禁止
			}
			if(this.saleType==1){
				this.form.upgradRequire.checkbox=["amountMoney"];
				this.upgradRequireDisabled1= false; // 升级条件 - 累计消费 - 禁止
			}
			if(this.saleType==2){
				this.form.upgradRequire.checkbox=["unitMoney"];
				this.upgradRequireDisabled2= false; // 升级条件 - 单笔消费 - 禁止
			}
		},
		computed: {
			// 计算属性
		},
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
		padding: 0;
	}
	
	.el-form-item {
		display: block;
		margin-bottom: 0;
	}
	
	.el-select {
		width: 100%;
	}
	.type-input{
		width:140px;
		display: block;
	}
	// 行内文本 span
	.formText {
		display: inline;
		line-height: rem(30px);
	}
	
	.el-header {
		padding: rem(10px);
		background: #EEE;
		position: relative;
	}
	
	.el-main {
		padding: rem(10px);
	}
	
	.widthInline {
		width: rem(90px);
		margin: 0 rem(10px);
	}
	
	.noPadding{
		padding: 0!important;
	}
</style>