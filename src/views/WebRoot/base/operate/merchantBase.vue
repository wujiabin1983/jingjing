<!--商品基本设置   - 子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card  class="centerInfo" v-if="roleBtn.addSellerBasicInfo">
				<el-form ref="form" :model="form" v-loading="this.tableLoading" :rules="this.getPageType=='查看'?norules:rules" label-width="120px">
					<el-row :gutter="10">
						<el-col :span="10">
						<el-form-item label="所属会员体系" prop="memberSystemName">
							<el-input type="textarea" v-model="form.memberSystemName" placeholder="请输入所属会员体系" :disabled="disabled" resize="none"></el-input>
						</el-form-item>
						<el-form-item label="积分值" prop="integralValue">
							<el-input v-model="form.integralValue" :disabled="disabled" placeholder="请输入积分值"></el-input>
						</el-form-item>
						<el-form-item label="现金兑换值" prop="cashExchangeValue">
							<el-input v-model="form.cashExchangeValue" :disabled="disabled" placeholder="请输入现金兑换值"></el-input>
						</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div v-if="this.getPageType != '查看'" class="el-footer-btn">
					<!--<div class="el-footer-btn-con">-->
						<el-button @click="handleBack">返  回</el-button>
						<el-button type="primary" @click="handleSubmit">确定</el-button>
					<!--</div>-->
				</div>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { mapGetters } from 'vuex'
	import { validateInt } from '@/utils/validate';
	import { selectMerChantBase,addMerChantBase,setMerChantBase } from '@/api/base/merchantBase'
	const isInt = (rule, value, callback) => {
		if(!validateInt(value)) {
			callback(new Error('请输入整数'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				disabled:false,
				// 权限
				roleBtn: {
					selectSellerBasicInfo: false,
					addSellerBasicInfo: false,
					updateSellerBasicInfo: false,
					deleteSellerBasicInfo: false
				},
				norules:{},
				type:'新增',
				// 表单
				tableLoading:false,
				form: {
					memberSystemName: "",
					integralValue: "",
					cashExchangeValue: ""
				},
				// 表单验证
				rules: {
					memberSystemName: [{
							required: true,
							message: '请输入所属会员体系',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						},
						{
							validator: isInt
						}
					],
					integralValue: [{
							required: true,
							message: '请输入积分值',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					cashExchangeValue: [{
							required: true,
							message: '请输入现金兑换值',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					]

				},
			}
		},
		methods: {
			handleBack() {
				this.$router.push({
					name: '商户基本设置'
				});
			},
			// 确认提交
			handleSubmit() {
				let that = this;
				this.$refs.form.validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						var params = {
							userId:this.userInfo.userCode,
							...this.form
						}
						if(this.getPageType=="添加"){
							// 查询接口
							addMerChantBase(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									let result = [];
//									console.log(data)
									if(data.messageType == 'SUCCESS'){
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										that.$router.push({
											name: '商户基本设置'
										});
									}else{
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
									that.tableLoading = false;
								})
								.catch(function(err) {
									that.tableLoading = false;
								});
						}else{
//							console.log(params)
							setMerChantBase(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									let result = [];
//									console.log(data)
									if(data.messageType == 'SUCCESS'){
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
										that.$router.push({
											name: '商户基本设置'
										});
									}else{
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
									that.tableLoading = false;
								})
								.catch(function(err) {
									that.tableLoading = false;
								});
						}
					} else {
						return false;
					}
				})
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			if(this.getPageType=="查看"||this.getPageType=="修改"){
				let res = JSON.parse(this.getFormData);
				this.form={
					integralValue:res.integralValue+'',
					cashExchangeValue:res.cashExchangeValue+'',
					memberSystemName:res.memberSystemName,
					id:res.id,
					version:res.version
				}
			}
			if(this.getPageType=="查看"){
				this.disabled=true;
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
</style>