<!--门店管理-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" v-if="" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="8">
							<el-form-item label="调账" prop="storeId">
								<el-input-number v-model="form.num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number> <span class="el-span"> 积分</span>
							</el-form-item>
							<el-form-item label="财务经办人" prop="storeManager">
								<el-input v-model="form.storeManager" :disabled="disabled" placeholder="请输入负责人/店长"></el-input>
							</el-form-item>
							<el-form-item label="备注" prop="remarks">
								<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入备注" v-model="form.remarks">
								</el-input>
							</el-form-item>
							<el-form-item label="尚未结算积分：" prop="remarks">
							    <div>1000</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item>
								<el-button @click="handleBack">返回</el-button>
								<el-button type="primary" @click="submitForm('form')" v-if="this.getPageType!='查看'">确定</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>// 手机号、固定电话、邮箱
import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
const isMobile = (rule, value, callback) => {
	if(!validateMobile(value)) {
		callback(new Error('请输入正确的手机号码'))
	} else {
		callback()
	}
}
//	const isTel = (rule, value, callback) => {
//		if(!validateTel(value)) {
//			callback(new Error('请输入正确的固定电话号码'))
//		} else {
//			callback()
//		}
//	}
//	const isEmail = (rule, value, callback) => {
//		if(!validateEmail(value)) {
//			callback(new Error('请输入正确的邮箱号码'))
//		} else {
//			callback()
//		}
//	}
export default {
	data() {
		return {
			disabled: false,
			// form表单数据
			businessTimeBegin: '',
			form: {
				num1:'1',//积分
				brandName: '', //品牌名称
				storeId: '', //门店编码
				storeName: '', //门店名称
				storeAliasName: '', //门店别名
				storeUrl: '', //门店照片url
				storeType: '', //门店分类
				addr: '', //详细地址
				storeManager: '', //负责人
				contactNumber1: '', //联系电话1
				contactNumber2: '', //联系电话2
				storeArea: '', //门店面积
				pca: [],
				longitude: '', //经度
				latitude: '', //纬度
				storePerNumber: '', //门店人数
				businessTimeBegin: this.businessTimeBegin, //起始时间
				businessTimeEnd: '', //结束时间
				storeDesc: '', //门店简介
				remarks: '', //备注
				label: '', //标签
				provinceName: "",
				cityName: "",
				shelvesStatus: "",
				isChat: "",
				areaName: ""
			},
			// 门店分类
			storeTypeData: [{
				value: '线上',
				label: '线上'
			}, {
				value: '线下',
				label: '线下'
			}],
			norules: {}
		}
	},
	methods: {
		methods() {
			var add = '';
			if(this.form.pca) { //选择器 选择之后的值
				if(this.form.pca == "") {
					this.$message({
						message: '请选择省市区！',
						type: 'warning'
					});
					return false;
				} else if(this.form.addr == "") {
					this.$message({
						message: '请输入详细地址！',
						type: 'warning'
					});
					return false;
				} else {
					add = this.form.pca[0] + this.form.pca[1] + this.form.pca[2] + this.form.addr;
				}
			} else if(this.form.provinceName && this.form.cityName && this.form.areaName) { //查看详情
				this.$message({
					message: '地址没有解析到结果！',
					type: 'warning'
				});
				add = this.form.provinceName + this.form.cityName + this.form.areaName + this.form.addr;
			}
		},
		// 方法
		submitForm(formName) {
			var proCity = this.form.pca;
			this.form.pca = '1';
			this.form.provinceId = proCity[0];
			this.form.cityId = proCity[1];
			this.form.areaId = proCity[2];
			// console.log(this.formData);
			if(this.getPageType == '查看') {
				this.$router.push({
					name: '清算中心'
				});
				return false;
			}
			this.$refs[formName].validate((valid) => {
				if(valid) {
					let data = JSON.stringify(this.form);
					// console.log(data + "提交数据")
					// console.log(this.getPageType)
					if(this.getPageType == '添加') {
						this.$router.push({
							name: '清算中心',
							params: {
								formData: data,
								pageType: '添加'
							}
						});
					} else if(this.getPageType == '修改') {
						let params = JSON.stringify({
							...data
						});
						// console.log(params)
						this.$router.push({
							name: '清算中心',
							params: {
								formData: params,
								pageType: '修改'
							}
						});
					}

				} else {
					// console.log('error submit!!');
					return false;
				}
			});
		},
		handleBack() {
			this.$router.push({
				name: '清算中心'
			});
		},
	},
	created() {
		// 钩子函数 -- 初始化
		// console.log(this.getPageType);
		if(this.getPageType == '查看') {
			this.disabled = true;
			let res = JSON.parse(this.getFormData);
			this.form = {
				...res
			}
			// this.form.status
		} else if(this.getPageType == '修改') {
			this.disabled = false;
			let res = JSON.parse(this.getFormData);
			this.form = {
				...res
			}
			// this.form.status
		}
	},
	computed: {
		// 计算属性
		getPageType() {
			return this.$route.params.pageType;
		},
		getpageTypeOther() {
			return this.$route.params.pageTypeOther;
		},
		getFormData() {
			return this.$route.params.formData;
		}
	}
};</script>
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width: 100%;
}

.el-form {
	width: rem(1100px);
	min-width: 500px;
}

.el-select {
	width: 100%;
}
.el-span{
	width: 100px;
	text-align: right;
	display: inline-block;
}
.margin10 {
	margin-bottom: 10px;
}

.middle-input {
	width: 180px;
}
</style>