<!--设置会员奖励规则 - 邀请有礼-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button class="mrgBottom10" @click="handleBack">返回</el-button>
			<el-card>
				<el-form :model="form" ref="form" :rules="rules" label-width="120px" class="demo-form">
					<el-form-item label="状态(是否启用)">
						<el-switch v-model="form.status"></el-switch>
					</el-form-item>
					<div v-if="form.status">
						<el-form-item label="奖励类型">
							<el-radio-group v-model="form.type" @change="handleRadioType">
								<el-radio label="优惠券"></el-radio>
								<el-radio label="积分"></el-radio>
							</el-radio-group>
						</el-form-item>
						<div v-if="form.type == '优惠券'">
							<el-form-item label="优惠券" prop="card">
								<el-select v-model="form.cardName" multiple placeholder="请选择" :disabled="true"></el-select>
								<el-popover placement="right" trigger="click" width="900" v-model="popoverVisible" @show="handleActivityManageMentShow">
									<!-- <activityManagement ref="activityManageMent"></activityManagement> -->
									<couponLibrary ref="couponLibrary"></couponLibrary>
									<el-button slot="reference" type="primary">选择</el-button>
									<div class="dsh-btns">
										<el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
										<el-button type="primary" size="mini" @click="handlePopoverSure">确定</el-button>
									</div>
								</el-popover>
							</el-form-item>
							<el-form-item label="券有效期" class="is-required">
								<!-- <el-input v-model="form.expiryDate"></el-input> -->
								<el-radio-group v-model="form.expiryDate.value" class="expiry-date" @change="handleRadioValue">
									<el-radio label="时间段" v-if="isLongDate">
										<el-form-item prop="" class="cleanElFormItem">
											<el-date-picker v-model="form.expiryDate.slot.start" type="date" :editable="false" placeholder="选择日期时间" value-format="yyyy-MM-dd" :disabled="form.expiryDate.value != '时间段'">
											</el-date-picker>
										</el-form-item>
										<span>至</span>
										<el-form-item prop="" class="cleanElFormItem">
											<el-date-picker v-model="form.expiryDate.slot.end" type="date" :editable="false" placeholder="选择日期时间" value-format="yyyy-MM-dd" :disabled="form.expiryDate.value != '时间段'">
											</el-date-picker>
										</el-form-item>
									</el-radio>
									<el-form-item prop="expiryDate.point">
										<el-radio label="时间点">
											<span>自</span>
											<el-form-item prop="" class="cleanElFormItem">
												<el-select v-model="form.expiryDate.point.type" placeholder="请选择" :disabled="form.expiryDate.value != '时间点'">
													<el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</el-form-item>
											<span>之日起</span>
											<el-form-item prop="" class="cleanElFormItem" prop="expiryDate.point.day">
												<el-input v-model="form.expiryDate.point.day" class="input-point" :disabled="form.expiryDate.value != '时间点'"></el-input>
											</el-form-item>
											<span>天内有效</span>
										</el-radio>
									</el-form-item>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="使用说明">
								<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.instructions" resize="none"></el-input>
							</el-form-item>
						</div>
						<div v-if="form.type == '积分'">
							<el-form-item label="赠送积分值" prop="presentExp">
								<el-input v-model="form.presentExp"></el-input>
							</el-form-item>
						</div>
					</div>
					<el-button type="primary" @click="handleSave('form')">确定</el-button>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import { mapGetters } from 'vuex'
	import couponLibrary from '@/components/base/couponLibrary'
	import { selectRuleSet } from "@/api/mobile/perfectInformation";
	import { validateInt } from '@/utils/validate';
	const isInt = (rule, value, callback) => {
		if (!validateInt(value)) {
			callback(new Error('请输入整数'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				// 优惠券查看
				popoverVisible: false,
				isLongDate:true,
				// 数据
				form: {
					status: '', // 状态
					type: '优惠券', // 奖励类型
					card: [], // 优惠券
					cardName: [], // 优惠券名称
					expiryDate: { // 券有效期
						value: '时间点', // 选择
						slot: { // 时间段
							start: '',
							end: '',
						},
						point: { // 时间点
							type: '领取',
							day: ''
						}
					},
					instructions: '', // 使用说明
					presentExp: '' // 积分值
				},
				pointTypeOptions: [{
					label: '领取',
					value: '领取'
				}],
				rules: {
					card: [{
						type: 'array',
						required: true,
						message: '请选择优惠券',
						trigger: 'change'
					}],
					presentExp: [
						{ required: true, message: '请输入赠送积分值', trigger: 'change' },
						{ validator: isInt, trigger: 'change' }
					],
					'expiryDate.point.day': [
						{ validator: isInt }
					]
				}
			}
		},
		components: {
			couponLibrary
		},
		methods: {
			// 方法
			// 优惠券显示
			handleActivityManageMentShow() {
				this.$refs.couponLibrary.showTable(1);
			},
			// 优惠券确定
			handlePopoverSure() {
				this.popoverVisible = false
				let val = [];
				val = this.$refs.couponLibrary.multipleSelection;
				let arrayObj = [];
				let arrayObjName = [];
				val.forEach((val, index) => {
					arrayObj.push(val.coupId);
					arrayObjName.push(val.coupName);
				});
				this.form.card = arrayObj;
				this.form.cardName = arrayObjName;
			},
			handleBack() {
				// console.log(this.getPageType);
				// console.log(JSON.stringify(this.form))
				// console.log(this.getReadyFormData)
				this.$router.push({
					name: this.getPageName,
					params: {
						pageType: '返回',
						pageItem: this.getPageType,
						formData: JSON.stringify(this.form),
						readyFormData: this.getReadyFormData
					}
				});
			},
			// 保存
			handleSave(formName) {
//				console.log(JSON.stringify(this.form));
//				return false;
				let flag =true;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.form.expiryDate.value=='时间段'){
							if(this.form.expiryDate.slot.begin==""||this.form.expiryDate.slot.end==""){
								this.$message.warning('请选择券有效期！');
								return false;
							}
						}	
						if(JSON.parse(sessionStorage.getItem('inviteGiftAdd')).activityDate.value!='长期'&&this.form.expiryDate.value=='时间段'){
							var activityDate = JSON.parse(sessionStorage.getItem('inviteGiftAdd')).activityDate.short[1];
							var coupDate = this.form.expiryDate.slot.end;
							var activityDate = new Date(activityDate).getTime();
							var coupDate = new Date(coupDate).getTime();
							if(!this.form.status){
								flag = true;
							}else{
								if(activityDate<=coupDate){
									flag = true;
								}else{
									flag = false;
									this.$message.warning('优惠券有效期不能小于活动日期！');
								}
							}
						}
						if(flag){
							if(this.getPageType == 'inviterAwardSet') {
								sessionStorage.setItem('inviterAwardSetRuleSet', JSON.stringify(this.form));
							} else if(this.getPageType == 'invitedAwardSet') {
								sessionStorage.setItem('invitedAwardSetRuleSet', JSON.stringify(this.form));
							}
							this.$router.push({
								name: this.getPageName,
								params: {
									pageType: '设置会员奖励规则',
									pageItem: this.getPageType,
									formData: JSON.stringify(this.form),
									readyFormData: this.getReadyFormData
								}
							});
						}
					}
				});
			},
			// 奖励类型 切换
			handleRadioType(type) {
				if(type == '优惠券') {
					this.form.presentExp = '';
				}
				if(type == '积分') {
					this.form.card = [];
					this.form.cardName = [];
					this.form.expiryDate.slot.start = '';
					this.form.expiryDate.slot.end = '';
					this.form.expiryDate.point.type = '';
					this.form.expiryDate.point.day = '';
					this.form.instructions = '';
				}
			},
			// 券有效期切换
			handleRadioValue(type) {
				if(type == '时间段') {
					this.form.expiryDate.point.type = '';
					this.form.expiryDate.point.day = '';
				}
				if(type == '时间点') {
					this.form.expiryDate.slot.start = '';
					this.form.expiryDate.slot.end = '';
				}
			},
			showTable() {
				if(this.getPageType == 'inviterAwardSet') {
					// 邀请者				
					this.form = !sessionStorage.getItem('inviterAwardSetRuleSet') || sessionStorage.getItem('inviterAwardSetRuleSet') === 'null' ? this.form : JSON.parse(sessionStorage.getItem('inviterAwardSetRuleSet'));
				}else if (this.getPageType == 'invitedAwardSet') {
					// 被邀请者
					this.form = !sessionStorage.getItem('invitedAwardSetRuleSet') || sessionStorage.getItem('invitedAwardSetRuleSet') === 'null' ? this.form : JSON.parse(sessionStorage.getItem('invitedAwardSetRuleSet'));
				}

			}
		},
		created() {
			if(sessionStorage.getItem('inviteGiftAdd')){
				this.isLongDate = JSON.parse(sessionStorage.getItem('inviteGiftAdd')).activityDate.value!='长期';
			}
			this.showTable();
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				let pageType = this.$route.params.pageType;
				// this.$route.params.pageType = '';
				return pageType;
			},
			getPageName() {
				// let pageName = this.$route.params.pageName;
				// this.$route.params.pageName = '';
				return this.$route.params.pageName;
			},
			getFormData() {
				let formData = this.$route.params.formData;
				// this.$route.params.formData = '';
				return formData;
			},
			getReadyFormData() {
				let readyFormData = this.$route.params.readyFormData;
				// this.$route.params.readyFormData = '';
				return readyFormData;
			},
			getFormRewardRule() {
				let formRewardRule = this.$route.params.formRewardRule;
				// this.$route.params.formRewardRule = '';
				return formRewardRule;
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
		width: 60%;
	}
	
	.expiry-date {
		.el-radio {
			margin-bottom: 10px;
			margin-left: 0;
		}
		.el-date-editor {
			width: 100%;
		}
		.el-select,
		.input-point {
			width: 100%;
		}
	}
	
	.cleanElFormItem {
		display: inline-block;
		width: 35%;
		margin-bottom: 0;
	}
	.dsh-btns{
		text-align: right;
		margin: 0
	}
</style>