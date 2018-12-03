// 基础设置 - 业务规则 - 会员权益 - 会员卡
<template>
	<el-card class="noPadding">
		<el-header class="header">
			<h4>会员卡片设置</h4>
		</el-header>
		<el-form class="membershipCardForm" :model="membershipCardForm" :rules="rules" ref="form" label-width="120px" :inline="true">
			<el-form-item label="类型" prop="cardType">
				<el-select v-model="membershipCardForm.cardType" @change="cardTypeChange" clearable placeholder="请选择" class="width170">
					<el-option label="线上" value="线上"></el-option>
					<el-option label="线下" value="线下"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="卡号位数" prop="cardDigitNumber">
				<el-input v-model="membershipCardForm.cardDigitNumber" placeholder="请输入卡号位数"></el-input>
				<span class="formText">位（卡号不能超过20位）</span>
			</el-form-item>
			<el-form-item label="校验码位数" prop="attribute1">
				<el-input v-model="membershipCardForm.attribute1" placeholder="请输入校验码位数"></el-input>
			</el-form-item>
			<el-form-item label="卡号起始位" prop="cardDigitBegin">
				<el-input v-model="membershipCardForm.cardDigitBegin" placeholder="请输入卡号起始位"></el-input>
			</el-form-item>
			<el-form-item label="编码前缀字符" prop="charPrefixBegin">
				<el-input v-model="membershipCardForm.charPrefixBegin" placeholder="请输入编码前缀字符"></el-input>
			</el-form-item>
			<el-form-item label="编码后缀字符" prop="charPrefixEnd">
				<el-input v-model="membershipCardForm.charPrefixEnd" placeholder="请输入编码后缀字符"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch v-model="membershipCardForm.status"></el-switch>
			</el-form-item>
			<el-button type="primary" @click="handleSave" v-if="roleBtn.addCardConfigInfo">保存</el-button>
		</el-form>
	</el-card>
</template>
<script>
	/**
	 * 接口信息
	 * 保存商户管理员
	 */
	import { permission } from '@/utils'
	import { I_SCRM_INTERFACE_101, I_SCRM_INTERFACE_102 } from '@/api/base/merchantManagerUser'
	import { mapGetters } from 'vuex'
	import { validateInt } from '@/utils/validate';

	const isInt = (rule, value, callback) => {
		if(!validateInt(value)) {
			callback(new Error('请输入整数'))
		} else {
			callback()
		}
	}
	const max20IsInt = (rule, value, callback) => {
		if(!validateInt(value)){
			callback(new Error('请输入整数'))
		}else if(value.length > 20) {
			callback(new Error('卡号不能超过20位'))
		}else {
			callback()
		}
	}
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectCardConfigInfo: false,
					addCardConfigInfo: false
					// updateCardConfigInfo: false
				},
				membershipCardForm: {
					cardDigitNumber: '', // 卡号位数
					cardDigitBegin: '', // 卡号起始位
					charPrefixBegin: '', // 编码前缀字符
					charPrefixEnd: '', // 编码后缀字符
					cardType: '', // 类型
					status: '', // 状态
					attribute1:''
				},
				rules: {
					cardDigitNumber: [ // 卡号位数
						{
							required: true,
							message: '请选择卡号位数',
							trigger: 'change'
						},
						{
							validator: max20IsInt,
							trigger: 'change'
						}
					],
					cardDigitBegin: [ // 卡号起始位
						{
							required: true,
							message: '请选择卡号起始位',
							trigger: 'change'
						},
						{
							validator: isInt,
							trigger: 'change'
						}
					],
					attribute1: [ // 卡号起始位
						{
							required: true,
							message: '请输入校验码位数',
							trigger: 'change'
						},
						{
							validator: isInt,
							trigger: 'change'
						}
					],
					// charPrefixBegin: [ // 编码前缀字符
					//     { required: true, message: '请选择编码前缀字符', trigger: 'change'  },
					//     { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					// ],
					// charPrefixEnd: [ // 编码后缀字符
					//     { required: true, message: '请选择编码后缀字符', trigger: 'change'  },
					//     { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					// ],
					cardType: [ // 类型
						{
							required: true,
							message: '请选择类型',
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
			cardTypeChange(val) {
//				console.log(val)
				let params = {
					userId: this.userInfo.userCode,
					cardType: val
				}
				I_SCRM_INTERFACE_101(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
//						console.log(JSON.stringify(data))
						if(code == 'SUCCESS') {
							this.membershipCardForm.id = msg.id,
							this.membershipCardForm.cardDigitNumber = msg.cardDigitNumber,
							this.membershipCardForm.cardDigitBegin = msg.cardDigitBegin,
							this.membershipCardForm.charPrefixBegin = msg.charPrefixBegin,
							this.membershipCardForm.charPrefixEnd = msg.charPrefixEnd,
							this.membershipCardForm.status = msg.status,
							this.membershipCardForm.version = msg.version,
							this.membershipCardForm.attribute1 = msg.attribute1,
							this.membershipCardForm.status = msg.status == '启用' ? true : false;
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			selectData(){
				let params = {
					userId: this.userInfo.userCode
				}
				I_SCRM_INTERFACE_101(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
//						console.log(JSON.stringify(data))
						if(code == 'SUCCESS') {
							this.membershipCardForm = {
								"id": msg.id,
								"cardDigitNumber": msg.cardDigitNumber,
								"cardDigitBegin": msg.cardDigitBegin,
								"charPrefixBegin": msg.charPrefixBegin,
								"charPrefixEnd": msg.charPrefixEnd,
								"status": msg.status,
								"cardType": msg.cardType,
								"attribute1": msg.attribute1,
								"version": msg.version,
							};
							this.membershipCardForm.status = msg.status == '启用' ? true : false;
//							console.log(JSON.stringify(this.membershipCardForm))
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			// 保存
			handleSave() {
				if(this.roleBtn.addCardConfigInfo) {
					// console.log(this.membershipCardForm);
					this.$refs.form.validate((valid) => {
//						 console.log(valid);
						if(valid) {
							let params = {
								userId: this.userInfo.userCode,
								...this.membershipCardForm
							}
							
//							console.log(JSON.stringify(params)+"保存入参");
							if(params.attribute1 <=0){
								this.$message.warning('校验码位数需大于0！');
								return false;
							}
							if(parseInt(params.attribute1) >=parseInt(params.cardDigitNumber)){
								this.$message.warning('校验码位数需小于卡号位数！');
								return false;
							}
//							console.log(JSON.stringify(params)+"保存入参");
//							return false;
							I_SCRM_INTERFACE_102(params) // 保存
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										this.selectData();
									} else {
										this.$message.warning(msg);
									}
								})
								.catch((err) => {
									// console.log(err);
								});
						}
					});
				}
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			if(this.roleBtn.selectCardConfigInfo) {
				this.selectData();
			}
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		width: 50%;
		margin:0 25%;
	}
	
	.el-form-item {
		display: block;
		position: relative;
	}
	
	.el-select {
		width: 100%;
	}
	
	// 行内文本 span
	.formText {
		width: 200px;
		height: 35px;
		line-height: 35px;
		position: absolute;
		right: -190px;
	}
	
	.header {
		padding: 0.5rem;
		background: #EEE;
		position: relative;
	}
	
	.noPadding .el-card__body {
		padding: 0!important;
	}
	
	.membershipCardForm {
		padding: 10px;
	}
	.width170{
		width: 170px;
	}
</style>