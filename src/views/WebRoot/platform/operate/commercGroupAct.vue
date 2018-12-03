<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
					<el-form-item label="角色代码" prop="userRoleId">
						<el-input v-model="form.userRoleId"></el-input>
					</el-form-item>
					<el-form-item label="角色名称" prop="userRoleName">
						<el-input v-model="form.userRoleName"></el-input>
					</el-form-item>
					<el-form-item label="可查看部门名称" prop="departmentListDesc">
						<el-input type="textarea" v-model="form.departmentListDesc"></el-input>
					</el-form-item>
					<el-form-item label="角色描述" prop="userRoleDesc">
						<el-input type="textarea" v-model="form.userRoleDesc"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleBack">取消</el-button>
						<el-button type="primary" @click="submitForm('form')">确定</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	export default {
		data() {
			return {
				// 数据
				form: {
					userRoleId: '',
					userRoleName: '',
					departmentListDesc: '',
					userRoleDesc: ''
				},
				rules: {
					userRoleId: [{
							required: true,
							message: '请输入上级组织架构代码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					userRoleName: [{
							required: true,
							message: '请输入上级组织架构代码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					departmentListDesc: [
						// { required: true, message: '请输入上级组织架构代码', trigger: 'blur' },
						{
							max: 4000,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					],
					userRoleDesc: [
						// { required: true, message: '请输入上级组织架构代码', trigger: 'blur' },
						{
							max: 4000,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					],
				}
			}
		},
		methods: {
			// 方法
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let data = JSON.stringify(this.form);
						this.$router.push({
							name: '用户组',
							params: {
								formData: data,
								pageType: '添加'
							}
						});
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '用户组'
				});
			}
		},
		created() {
			// 钩子函数 -- 初始化
			//      console.log(this.getPageType);
			if(this.getPageType == '添加') {

			}
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
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
</style>