<!--用户组添加-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="centerInfo">
				<el-form :model="ruleForm" v-loading="tableLoading" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="所属部门" prop="departmentName" v-if="this.getPageType != '查看'">
								<el-input v-model="ruleForm.departmentName" placeholder="请选择部门名称" :disabled="true" class="dsh-input"></el-input>
								<el-popover ref="popover4" placement="right" trigger="click" v-model="propoverVisible" width="400" @show="handlePopoverShow">
									<treeDepartmentName v-if="propoverVisible" @childSubmit="handleChildSubmit"></treeDepartmentName>
								</el-popover>
								<el-button type="primary" v-popover:popover4 class="dsh-input-button">选择</el-button>
							</el-form-item>
							<el-form-item label="用户组代码" prop="userGroupId">
								<el-input v-model="ruleForm.userGroupId" placeholder="请输入用户组代码"></el-input>
							</el-form-item>
							<el-form-item label="用户组名称" prop="userGroupName">
								<el-input v-model="ruleForm.userGroupName" placeholder="请输入用户组名称"></el-input>
							</el-form-item>
							<el-form-item label="用户组描述" prop="userGroupDesc">
								<el-input type="textarea" resize="none" v-model="ruleForm.userGroupDesc" placeholder="请输入用户组描述"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div>
						<el-button @click="handleBack">返回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { treeDepartmentName } from '@/views/WebRoot/platform' // 组件
	import { addUserGroupInfo } from '@/api/platform/userGroup'
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				// 数据
				ruleForm: {
					departmentId: '',
					departmentName: '',
					userGroupId: '',
					userGroupName: '',
					userGroupDesc: ''
				},
				tableLoading: false,
				propoverVisible: false,
				rules: {
					departmentName: [{
							required: true,
							message: '请输入所属部门',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					userGroupId: [{
							required: true,
							message: '请输入用户组代码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					userGroupName: [{
							required: true,
							message: '请输入用户组名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					userGroupDesc: [
						// { required: true, message: '请输入用户组描述', trigger: 'blur' },
						{
							max: 4000,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					]
				}
			}
		},
		components: {
			treeDepartmentName
		},
		methods: {
			// 弹出框显示
			handlePopoverShow() {
				// alert(1);
			},
			// 显示节点被选中
			handleChildSubmit(str) {
				//			console.log(str.departmentId)
				this.propoverVisible = false;
				this.ruleForm.departmentId = str.departmentId;
				this.ruleForm.departmentName = str.departmentName;
			},
			// 方法
			submitForm(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						let params = {
							"userId": this.userInfo.userCode,
							...this.ruleForm
						}
						addUserGroupInfo(params)
							.then((res) => {
								// console.log(res)
								let data = JSON.parse(Base64.decode(res.data));
								if(data.messageType == 'SUCCESS') {
									that.tableLoading = false;
									that.$message.success(data.messageContent);
									that.$router.push({
										name: '用户组'
									});
								} else {
									that.tableLoading = false;
									that.$message.warning(data.messageContent);
								}
							})
							.catch((err) => {
								that.tableLoading = false;
								// console.log(err);
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
			if(this.getPageType == '添加') {
				if(this.getFormData) {
					this.ruleForm = JSON.parse(this.getFormData);
				}
			}
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				let msg = this.$route.params.formData;
				return msg;
			},
			...mapGetters([
				'userInfo',
			])
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form-item {
		width: 350px
	}
</style>