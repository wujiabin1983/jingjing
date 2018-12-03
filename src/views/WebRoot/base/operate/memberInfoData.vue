<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" class="mrgBottom10">返回</el-button>
			<el-card>
				<el-form :model="form" ref="form" label-width="120px" class="demo-form">
					<!--<el-row :gutter="10">
                        <el-col :span="12">-->
					<el-form-item label="姓名" prop="userName">
						<el-input v-model="form.userName" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-input v-model="form.sex" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="生日" prop="birthDate">
						<el-input v-model="form.birthDate" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="手机" prop="mobile">
						<el-input v-model="form.mobile" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="所在地址" prop="addr">
						<el-input v-model="form.addr" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="学历" prop="education">
						<el-input v-model="form.education" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="身高" prop="height">
						<el-input v-model="form.height" :disabled="disabled"></el-input>
					</el-form-item>
					<!--</el-col>
                        <el-col :span="12">-->
					<el-form-item label="婚姻状况" prop="maritalStatus">
						<el-input v-model="form.maritalStatus" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="form.email" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="证件号" prop="idNumber">
						<el-input v-model="form.idNumber" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="微博ID" prop="weiBoId">
						<el-input v-model="form.weiBoId" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="QQ号码" prop="qqId">
						<el-input v-model="form.qqId" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="淘宝ID" prop="taoBaoId">
						<el-input v-model="form.taoBaoId" :disabled="disabled"></el-input>
					</el-form-item>

					<!--</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="24">-->
					<!--</el-col>
                    </el-row>-->
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	//const isMobile = (rule, value, callback) => {
	//  if (!validateMobile(value)) {
	//      callback(new Error('请输入正确的手机号码'))
	//  } else {
	//      callback()
	//  }
	//}
	//const isTel = (rule, value, callback) => {
	//  if (!validateTel(value)) {
	//      callback(new Error('请输入正确的固定电话号码'))
	//  } else {
	//      callback()
	//  }
	//}
	//const isEmail = (rule, value, callback) => {
	//  if (!validateEmail(value)) {
	//      callback(new Error('请输入正确的邮箱号码'))
	//  } else {
	//      callback()
	//  }
	//}
	export default {
		data() {
			return {
				disabled: false,
				disabledSet: false,
				// form表单数据
				form: {
					userRoleName: '', //角色名称
					roleDesc: '', //描述
					userType: '', //用户类型
					isEnable: '', //是否启用
					remarks: '' //备注

				},
			}
		},
		methods: {
			// 方法
			submitForm(formName) {
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '员工管理权限设置',
						params: {
							pageType: '查看'
						}
					});
					return false;
				}
				this.$refs.form.validate((valid) => {
					if(valid) {
						let data = JSON.stringify(this.form);
						if(this.getPageType == '添加') {
							this.$router.push({
								name: '员工管理权限设置',
								params: {
									formData: data,
									pageType: '添加'
								}
							});
						} else if(this.getPageType == '修改') {
							let data = JSON.parse(this.getFormData);
							let params = JSON.stringify({
								...data
							});
							this.$router.push({
								name: '员工管理权限设置',
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
					name: '数据导入会员信息查询',
					params: {
						formData: this.getMainData
					}
				});
			},
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			// 选择用户类型
			//      handleUserType() {
			//          this.userSelect.forEach((val, index) => {
			//              if(val.label == this.form.userSelect) {
			//                  this.form.userSelect = val.value;
			//              }
			//          });
			//      },

		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			//      console.log(this.getPageType);
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			} else if(this.getPageType == '修改') {
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
			getFormData() {
				return this.$route.params.formData;
			},
			getMainData() {
				return this.$route.params.mainData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form-item {
		width: 350px;
		float: left;
	}
	
	.el-select {
		width: 100%;
	}
</style>