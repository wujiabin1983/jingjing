<!--员工-数据定义-维度设置-->
<template>
	<div>
		<el-collapse v-model="activeNames">
			<h4>会员维度</h4>
			<el-card>
				<el-collapse-item title="年龄（单位：岁，最多可添加6项）" name="1" v-loading="tableLoading">
					<dataDefineBComponent ref="formAge" childRef="formAge" :childForm="formAge" childName="年龄" :childMax="6" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<h4>会员指标</h4>
			<el-card>
				<el-collapse-item title="会员二次销售周期（单位：天，最多可添6项）" name="2" v-loading="tableLoading">
					<dataDefineBComponent ref="formPeriod" childRef="formPeriod" :childForm="formPeriod" childName="会员二次销售周期" :childMax="6" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formTime handleTimeDelete -->
				<el-collapse-item title="会员RFM-最近一次消费时间（单位：天，最多可添加6项）" name="3" v-loading="tableLoading">
					<dataDefineBComponent ref="formTime" childRef="formTime" :childForm="formTime" childName="会员RFM-最近一次消费时间" :childMax="6" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formFrequency handleFrequencyDelete -->
				<el-collapse-item title="会员RFM-累计消费频次（单位：次，最多可添加8项）" name="4" v-loading="tableLoading">
					<dataDefineBComponent ref="formFrequency" childRef="formFrequency" :childForm="formFrequency" childName="会员RFM-累计消费频次" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formAccruingAmounts handleAccruingAmountsDelete -->
				<el-collapse-item title="会员RFM-累计消费金额（单位：元，最多可添加8项）" name="5" v-loading="tableLoading">
					<dataDefineBComponent ref="formAccruingAmounts" childRef="formAccruingAmounts" :childForm="formAccruingAmounts" childName="会员RFM-累计消费金额" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formSalesDiscount handleSalesDiscountDelete -->
				<el-collapse-item title="会员平均销售折扣（单位：%，最多可添加8项）" name="6" v-loading="tableLoading">
					<dataDefineBComponent ref="formSalesDiscount" childRef="formSalesDiscount" :childForm="formSalesDiscount" childName="会员平均销售折扣" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formPerCustomerTransaction handlePerCustomerTransactionDelete -->
				<el-collapse-item title="客单价（单位：元，最多可添加8项）" name="7" v-loading="tableLoading">
					<dataDefineBComponent ref="formPerCustomerTransaction" childRef="formPerCustomerTransaction" :childForm="formPerCustomerTransaction" childName="客单价" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formGuestPiece handleGuestPieceDelete -->
				<el-collapse-item title="客单件（最多可添加8项）" name="8" v-loading="tableLoading">
					<dataDefineBComponent ref="formGuestPiece" childRef="formGuestPiece" :childForm="formGuestPiece" childName="客单件" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formUnitPrice handleUnitPriceDelete -->
				<el-collapse-item title="件单价（单位：元，最多可添加8项）" name="9" v-loading="tableLoading">
					<dataDefineBComponent ref="formUnitPrice" childRef="formUnitPrice" :childForm="formUnitPrice" childName="件单价" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formTradingSingular handleTradingSingularDelete -->
				<el-collapse-item title="交易单数（最多可添加8项）" name="10" v-loading="tableLoading">
					<dataDefineBComponent ref="formTradingSingular" childRef="formTradingSingular" :childForm="formTradingSingular" childName="交易单数" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formSalesQuantity handleSalesQuantityDelete -->
				<el-collapse-item title="销售数量（最多可添加8项）" name="11" v-loading="tableLoading">
					<dataDefineBComponent ref="formSalesQuantity" childRef="formSalesQuantity" :childForm="formSalesQuantity" childName="销售数量" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formSalesAmount handleSalesAmountDelete -->
				<el-collapse-item title="销售金额（单位：元，最多可添加8项）" name="12" v-loading="tableLoading">
					<dataDefineBComponent ref="formSalesAmount" childRef="formSalesAmount" :childForm="formSalesAmount" childName="销售金额" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
			<el-card>
				<!-- formEffectiveIntegral handleEffectiveIntegralDelete -->
				<el-collapse-item title="会员有效积分（最多可添加8项）" name="13" v-loading="tableLoading">
					<dataDefineBComponent ref="formEffectiveIntegral" childRef="formEffectiveIntegral" :childForm="formEffectiveIntegral" childName="会员有效积分" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>

			<el-card>
				<!-- formMembershipNumber handleMembershipNumberDelete -->
				<el-collapse-item title="会员天数（最多可添加8项）" name="14" v-loading="tableLoading">
					<dataDefineBComponent ref="formMembershipNumber" childRef="formMembershipNumber" :childForm="formMembershipNumber" childName="会员天数" :childMax="8" @parentDelete="handleParentDelete"></dataDefineBComponent>
				</el-collapse-item>
			</el-card>
		</el-collapse>
		<el-button type="primary" @click="handleSave" v-if="roleBtn.addDimensionConfigInfo">保存</el-button>
	</div>
</template>
<script>
import { permission } from '@/utils'
	/**
	 * 接口信息撒旦法
	 */
	let formArray = {
		"年龄": 'formAge',
		"会员二次销售周期": 'formPeriod',
		"会员RFM-最近一次消费时间": 'formTime',
		"会员RFM-累计消费频次": 'formFrequency',
		"会员RFM-累计消费金额": 'formAccruingAmounts',
		"会员平均销售折扣": 'formSalesDiscount',
		"客单价": 'formPerCustomerTransaction',
		"客单件": 'formGuestPiece',
		"件单价": 'formUnitPrice',
		"交易单数": 'formTradingSingular',
		"销售数量": 'formSalesQuantity',
		"销售金额": 'formSalesAmount',
		"会员有效积分": 'formEffectiveIntegral',
		"入会天数": 'formMembershipNumber'
	}
	import { mapGetters } from 'vuex'
	import { dimensionSettingShow, dimensionSettingAdd, dimensionSettingDelete } from '@/api/base/dataDefine'
	import dataDefineBComponent from './dataDefineBComponent.vue'
	export default {
		components: { dataDefineBComponent },
		data() {
			return {
				roleBtn: {
					selectDimensionConfigInfo: false,
					addDimensionConfigInfo: false,
					updateDimensionConfigInfo: false
				},
				activeNames: ['1'],
				// 年龄  formAge
				ageAdd: true,
				formAge: {
					id: '',
					version: '',
					main: []
				},
				// 会员二次销售周期  formPeriod
				periodAdd: true,
				formPeriod: {
					id: '',
					version: '',
					main: []
				},
				// 会员RFM-最近一次消费时间  formTime
				timeAdd: true,
				formTime: {
					id: '',
					version: '',
					main: []
				},
				// 会员RFM-累计消费频次  formFrequency
				frequencyAdd: true,
				formFrequency: {
					id: '',
					version: '',
					main: []
				},
				// 会员RFM-累计消费金额  formAccruingAmounts
				accruingAmountsAdd: true,
				formAccruingAmounts: {
					id: '',
					version: '',
					main: []
				},
				// 会员平均销售折扣（单位：%，最多可添加8项）  formSalesDiscount
				salesDiscountAdd: true,
				formSalesDiscount: {
					id: '',
					version: '',
					main: []
				},
				// 客单价（单位：元，最多可添加8项）  formPerCustomerTransaction
				perCustomerTransactionAdd: true,
				formPerCustomerTransaction: {
					id: '',
					version: '',
					main: []
				},
				// 客单件（最多可添加8项）  formGuestPiece
				guestPieceAdd: true,
				formGuestPiece: {
					id: '',
					version: '',
					main: []
				},
				// 件单价（单位：元，最多可添加8项）  formUnitPrice
				unitPriceAdd: true,
				formUnitPrice: {
					id: '',
					version: '',
					main: []
				},
				// 交易单数（最多可添加8项）  formTradingSingular
				tradingSingularAdd: true,
				formTradingSingular: {
					id: '',
					version: '',
					main: []
				},
				// 销售数量（最多可添加8项）  formSalesQuantity
				salesQuantityAdd: true,
				formSalesQuantity: {
					id: '',
					version: '',
					main: []
				},
				// 销售金额（单位：元，最多可添加8项）  formSalesAmount
				salesAmountAdd: true,
				formSalesAmount: {
					id: '',
					version: '',
					main: []
				},
				// 会员有效积分（最多可添加8项）  formEffectiveIntegral
				effectiveIntegralAdd: true,
				formEffectiveIntegral: {
					id: '',
					version: '',
					main: []
				},
				// 入会天数（最多可添加8项）  formMembershipNumber
				membershipNumberAdd: true,
				formMembershipNumber: {
					id: '',
					version: '',
					main: []
				},
				flag: true, // 验证
				tableLoading: false,
				validateAge: (rule, value, callback) => {
					//                  console.log(value);
					let index = '';
					this.formAge.main.forEach((val, valIndex) => {
						if(val = value) {
							index = valIndex
						}
					})
					if(value <= this.formAge.main[index - 1].value) {
						callback(new Error('请输入正确的维度'));
					} else {
						callback();
					}
				}
			}
		},
		methods: {
			handleSave() {
				//年龄
				let formAgeData = this.$refs.formAge.handleSave();
//				console.log(formAgeData)
            	if(formAgeData=='1'){
                    this.$message.warning('请输入年龄的维度值');
                    return false;
            	}
				//会员二次销售周期（单位：天，最多可添6项）
				let formPeriodData = this.$refs.formPeriod.handleSave();
            	if(formPeriodData=='1'){
                    this.$message.warning('请输入会员二次销售周期的维度值');
                    return false;
            	}
				//会员RFM-最近一次消费时间（单位：天，最多可添6项）
				let formTimeData = this.$refs.formTime.handleSave();
            	if(formTimeData=='1'){
                    this.$message.warning('请输入最近一次消费时间的维度值');
                    return false;
            	}
				//会员RFM-累计消费频次（单位：次，最多可添8项）
				let formFrequencyData = this.$refs.formFrequency.handleSave();
            	if(formFrequencyData=='1'){
                    this.$message.warning('请输入累计消费频次的维度值');
                    return false;
            	}
				//会员RFM-累计消费金额（单位：元，最多可添8项）
				let formAccruingAmountsData = this.$refs.formAccruingAmounts.handleSave();
            	if(formAccruingAmountsData=='1'){
                    this.$message.warning('请输入累计消费金额的维度值');
                    return false;
            	}
				//会员平均销售折扣（单位：%，最多可添8项）
				let formSalesDiscountData = this.$refs.formSalesDiscount.handleSave();
            	if(formSalesDiscountData=='1'){
                    this.$message.warning('请输入会员平均销售折扣的维度值');
                    return false;
            	}
				//客单价（单位：元，最多可添8项）
				let formPerCustomerTransactionData = this.$refs.formPerCustomerTransaction.handleSave();
            	if(formPerCustomerTransactionData=='1'){
                    this.$message.warning('请输入客单价的维度值');
                    return false;
            	}
				//客单件（单位：天，最多可添8项）
				let formGuestPieceData = this.$refs.formGuestPiece.handleSave();
            	if(formGuestPieceData=='1'){
                    this.$message.warning('请输入客单件的维度值');
                    return false;
            	}
				//件单价（单位：元，最多可添8项）
				let formUnitPriceData = this.$refs.formUnitPrice.handleSave();
            	if(formUnitPriceData=='1'){
                    this.$message.warning('请输入件单价的维度值');
                    return false;
            	}
				//交易单数（最多可添加8项）
				let formTradingSingularData = this.$refs.formTradingSingular.handleSave();
            	if(formTradingSingularData=='1'){
                    this.$message.warning('请输入交易单数的维度值');
                    return false;
            	}
				//销售数量（最多可添加8项）
				let formSalesQuantityData = this.$refs.formSalesQuantity.handleSave();
            	if(formSalesQuantityData=='1'){
                    this.$message.warning('请输入销售数量的维度值');
                    return false;
            	}
				//销售金额（单位：元，最多可添加8项）
				let formSalesAmountData = this.$refs.formSalesAmount.handleSave();
            	if(formSalesAmountData=='1'){
                    this.$message.warning('请输入销售金额的维度值');
                    return false;
            	}
				//会员有效积分（最多可添加8项）
				let formEffectiveIntegralData = this.$refs.formEffectiveIntegral.handleSave();
            	if(formEffectiveIntegralData=='1'){
                    this.$message.warning('请输入会员有效积分的维度值');
                    return false;
            	}
				// "入会天数": 'formMembershipNumber'
				let formMembershipNumberData = this.$refs.formMembershipNumber.handleSave();
            	if(formMembershipNumberData=='1'){
                    this.$message.warning('请输入维度值');
                    return false;
            	}
//				this.tableLoading = true;
				let params = {
					userId: this.userInfo.userCode,
					paramArrary: [{
							"id": this.formAge.id,
							"version": this.formAge.version,
							"dimensionName": "会员维度",
							"subItemName": '年龄',
							"subItem": formAgeData
						},
						{
							"id": this.formPeriod.id,
							"version": this.formPeriod.version,
							"dimensionName": "会员指标",
							"subItemName": '会员二次销售周期',
							"subItem": formPeriodData
						},
						{
							"id": this.formTime.id,
							"version": this.formTime.version,
							"dimensionName": "会员指标",
							"subItemName": '会员RFM-最近一次消费时间',
							"subItem": formTimeData
						},
						{
							"id": this.formFrequency.id,
							"version": this.formFrequency.version,
							"dimensionName": "会员指标",
							"subItemName": '会员RFM-累计消费频次',
							"subItem": formFrequencyData
						},
						{
							"id": this.formAccruingAmounts.id,
							"version": this.formAccruingAmounts.version,
							"dimensionName": "会员指标",
							"subItemName": '会员RFM-累计消费金额',
							"subItem": formAccruingAmountsData
						},
						{
							"id": this.formSalesDiscount.id,
							"version": this.formSalesDiscount.version,
							"dimensionName": "会员指标",
							"subItemName": '会员平均销售折扣',
							"subItem": formSalesDiscountData
						},
						{
							"id": this.formPerCustomerTransaction.id,
							"version": this.formPerCustomerTransaction.version,
							"dimensionName": "会员指标",
							"subItemName": '客单价',
							"subItem": formPerCustomerTransactionData
						},
						{
							"id": this.formGuestPiece.id,
							"version": this.formGuestPiece.version,
							"dimensionName": "会员指标",
							"subItemName": '客单件',
							"subItem": formGuestPieceData
						},
						{
							"id": this.formUnitPrice.id,
							"version": this.formUnitPrice.version,
							"dimensionName": "会员指标",
							"subItemName": '件单价',
							"subItem": formUnitPriceData
						},
						{
							"id": this.formTradingSingular.id,
							"version": this.formTradingSingular.version,
							"dimensionName": "会员指标",
							"subItemName": '交易单数',
							"subItem": formTradingSingularData
						},
						{
							"id": this.formSalesQuantity.id,
							"version": this.formSalesQuantity.version,
							"dimensionName": "会员指标",
							"subItemName": '销售数量',
							"subItem": formSalesQuantityData
						},
						{
							"id": this.formSalesAmount.id,
							"version": this.formSalesAmount.version,
							"dimensionName": "会员指标",
							"subItemName": '销售金额',
							"subItem": formSalesAmountData
						},
						{
							"id": this.formEffectiveIntegral.id,
							"version": this.formEffectiveIntegral.version,
							"dimensionName": "会员指标",
							"subItemName": '会员有效积分',
							"subItem": formEffectiveIntegralData
						},
						{
							"id": this.formMembershipNumber.id,
							"version": this.formMembershipNumber.version,
							"dimensionName": "会员指标",
							"subItemName": '入会天数',
							"subItem": formMembershipNumberData
						},
					]
				}
//				console.log(JSON.stringify(params)+"----");
//				return false;
//				console.log(JSON.stringify(params));
				dimensionSettingAdd(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.showTable();
						} else {
							this.$message.error(msg);
							this.showTable();
						}
					})
					.catch((err) => {
//						console.log(err);
					});
				// "dimensionName": "维度名称",
				// "subItemName": "维度设置子项名称",
				// "seq": "序号",
				// "subItem": "维度设置子项（json字符串）",

			},
			showTable() {
				if(this.roleBtn.selectDimensionConfigInfo) {
					this.tableLoading = true;
					let params = {
						userId: this.userInfo.userCode
					}
					dimensionSettingShow(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							if(code == 'SUCCESS') {
//	                            console.log(JSON.stringify(msg));
								msg.forEach((val, index) => {
									this[formArray[val.subItemName]] = {
										id: val.id,
										version: val.version,
										main: val.subItem
									}
									if(val.subItem != "") {
										let array = [];
										val.subItem.forEach((data, index) => {
											if(!data.value) {
												if(index == 0) {
													if(data.length > 1) {
														array.push({
															value: data.substr(1, data.length - 1)
														})
													}
												} else {
													if(data.split('-')[1] != '' && data.split('-')[1] != undefined) {
														array.push({
															value: data.split('-')[1]
														})
													} else {
														array.push({
															value: ''
														})
													}
												}
											}
										})
										if(array.length == 1 && array[0].value == '') {
											array.pop();
										}
//										console.log(JSON.stringify(array), 'sdfasf');
										this[formArray[val.subItemName]].main = array;
									}
								});
								// this.$message.success(msg);
								this.tableLoading = false
							} else {
								this.$message.error(msg);
								this.tableLoading = false;
							}
						})
						.catch((err) => {
//							console.log(err);
						})
				}
			},

			handleParentDelete(str) {
				let type = str.type;
				let index = str.index;
				this.handleDelete(type, index);
			},
			// 删除
			handleDelete(formName, index) {
				//              console.log(JSON.stringify(this[formName].main));
				//              console.log(formName,index);
				this[formName].main.splice(index, 1);
			},
			
		},
		created() {
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable();
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			])
		},
		watch: {
			// 'age': function(val, oldVal) {
			//     this.form.age = JSON.parse(JSON.stringify(val));
			// },
			deep: true
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
		min-width: 500px;
	}

	.el-form-item {
		display: block;
		padding: 10px 0;
		padding-bottom: 15px;
		margin-bottom: 0;
		text-align: center;
	}

	.el-select {
		width: 100%;
	}

	// 行内文本 span
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

	.noPadding .el-card__body {
		padding: 0!important;
	}

	p {
		text-align: center;
	}

	.textInfo {
		height: 53px;
		line-height: 53px;
	}

	.btnAdd {
		width: 100%;
		height: 40px;
		border: 1px solid #D2d2d2;
		text-align: center;
		line-height: 40px;
		cursor: pointer;
	}


	.el-collapse-item {
		position: relative;
		.centerTitle {
			position: absolute;
			top: 0;
			left: 50%;
			margin-left: -22px;
			line-height: 48px;
		}
	}
</style>
