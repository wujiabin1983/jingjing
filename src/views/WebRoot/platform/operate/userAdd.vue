<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" class="mrgBottom10" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card>
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" v-loading="tableLoading" ref="form" label-width="120px" class="demo-form">
					<!--<el-row :gutter="10">
                        <el-col :span="12">-->
					<el-form-item label="部门名称" prop="departmentName" v-if="this.getPageType != '查看'">
						<el-input v-model="form.departmentName" :disabled="true" placeholder="请选择部门名称" class="dsh-input"></el-input>
						<el-popover ref="popover4" placement="right" trigger="click" v-model="propoverVisible" width="400" @show="handlePopoverShow">
							<treeDepartmentName v-if="propoverVisible" @childSubmit="handleChildSubmit"></treeDepartmentName>
						</el-popover>
						<el-button type="primary" v-popover:popover4 class="dsh-input-button">选择</el-button>
					</el-form-item>
					<el-form-item label="部门名称" prop="departmentName" v-if="this.getPageType == '查看'">
						<el-input v-model="form.departmentName" :disabled="true" placeholder="请选择部门名称"></el-input>
					</el-form-item>
					<el-form-item label="用户真实姓名" prop="realName">
						<el-input v-model="form.realName" placeholder="请输入用户真实姓名" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="用户登录名" prop="userName">
						<el-input v-model="form.userName" placeholder="请输入用户登录名" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" v-if="this.getPageType=='添加'">
						<el-input v-model="form.password" type="text" @focus="passChange" placeholder="请输入密码" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="角色名称" prop="userRoleName">
						<el-input v-model="form.userRoleName" v-if="this.getPageType=='查看'" :disabled="disabled"></el-input>
						<el-select v-model="userRoleName" v-else placeholder="请选择角色名称" @change="handleUserRoleName">
							<el-option v-for="item in roleSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="用户组名称" prop="userGroupName">
						<el-input v-model="form.userGroupName" v-if="this.getPageType=='查看'" :disabled="disabled"></el-input>
						<el-select v-model="userGroupName" placeholder="请选择用户组名称" v-else @change="handleUserGroupName">
							<el-option v-for="item in userGroupSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="年龄" prop="age">
						<el-input v-model="form.age" :disabled="disabled" placeholder="请输入年龄"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="form.mobile" placeholder="请输入手机号" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="form.email" :disabled="disabled" placeholder="请输入邮箱"></el-input>
					</el-form-item>
					<!--</el-col>
                        <el-col :span="12">-->
					<el-form-item label="固定电话" prop="tel">
						<el-input v-model="form.tel" :disabled="disabled" placeholder="请输入固定电话"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="">
						<el-radio-group v-model="form.status">
							<el-radio label="激活" :disabled="disabled">激活</el-radio>
							<el-radio label="停用" :disabled="disabled">停用</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio label="男" :disabled="disabled">男</el-radio>
							<el-radio label="女" :disabled="disabled">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="证件号" prop="documentCode">
						<el-input v-model="form.documentCode" :disabled="disabled" placeholder="请输入证件号"></el-input>
					</el-form-item>
					<el-form-item label="详细地址" prop="addr">
						<el-input v-model="form.addr" type="textarea" placeholder="请输入详细地址" resize="none" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="remarks">
						<el-input v-model="form.remarks" type="textarea" placeholder="请输入备注" resize="none" :disabled="disabled"></el-input>
					</el-form-item>
					<!--</el-col>
                    </el-row>
                    <el-row :gutter="10" v-if="this.getPageType!='查看'">
                        <el-col :span="24">-->
					<div v-if="this.getPageType != '查看'" class="el-footer-btn">
						<div class="el-footer-btn-con">
							<el-button @click="handleBack">返  回</el-button>
							<el-button type="primary" @click="submitForm('form')">确  定</el-button>
						</div>
					</div>
					<!--</el-col>
                    </el-row>-->
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateInt, validateEmail, validateIdCard, validatePassword } from '@/utils/validate';
	import { selectUserplatGroupName, selectPlatUserName, selectDepartmentName } from '@/api/public'
	import { treeDepartmentName } from '@/views/WebRoot/platform' // 组件
	import { addUserInfo, updateUserInfo } from '@/api/platform/userManage';
	import { mapGetters } from 'vuex'
	const isMobile = (rule, value, callback) => {
		if(value != "") {
			if(!validateMobile(value)) {
				callback(new Error('请输入正确的手机号码'))
			} else {
				callback()
			}
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
	const isTel = (rule, value, callback) => {
		if(!validateTel(value)) {
			callback(new Error('请输入正确的固定电话号码'))
		} else {
			callback()
		}
	}
	const isEmail = (rule, value, callback) => {
		if(value != "") {
			if(!validateEmail(value)) {
				callback(new Error('邮箱格式错误'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	const isPassword = (rule, value, callback) => {
		if(!validatePassword(value)) {
			callback(new Error('密码为至少6位的数字或字母'))
		} else {
			callback()
		}
	}
	const isIdCard = (rule, value, callback) => {
		if(value != "") {
			if(!validateIdCard(value)) {
				callback(new Error('请输入正确的身份证号码'))
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
				userGroupName: '',
				userRoleName: '',
				disabled: false,
				// form表单数据
				form: {
					"departmentId": "",
					departmentName: '', // 部门名称
					realName: '', // 用户真实姓名
					userName: '', // 用户登录名
					mobile: '', // 手机号
					status: '激活', // 状态
					"userGroupId": "用户组ID",
					userGroupName: '', // 用户组名称
					"userRoleId": "",
					userRoleName: '', // 角色名称
					age: '', // 年龄
					sex: '男', // 性别
					email: '', // 邮箱
					tel: '', // 固定电话
					documentCode: '', // 证件号
					addr: '', // 详细地址
					remarks: '' // 备注
				},
				tableLoading: false,
				propoverVisible: false, // popover 是否可见 - 可查看部门
				// 部门名称
				departmentSelect: [],
				//              {
				//              value: 'SCRM',
				//              label: 'SCRM'
				//              }
				// 用户组名称
				userGroupSelect: [],
				//              {
				//                  value: '用户组名称',
				//                  label: '用户组名称'
				//              }

				// 角色名称
				roleSelect: [],
				//              {
				//                  value: '角色名称',
				//                  label: '角色名称'
				//              }
				norules: {},
				rules: {
					departmentName: [{
							required: true,
							message: '请选择部门名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					realName: [{
							required: true,
							message: '请输入用户真实姓名',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					userName: [{
							required: true,
							message: '请输入用户登录名',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						{
							validator: isPassword
						}
					],
					mobile: [
						{
							validator: isMobile
						}
					],
					status: [{
						required: true,
						message: '请输入状态',
						trigger: 'change'
					}, ],
					userGroupName: [{
							required: true,
							message: '请输入用户组名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					userRoleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					age: [{
						validator: isInt
					}],
					sex: [
						// { required: true, message: '请输入性别', trigger: 'change' },
						// { validator: isRadioSelected, type: 'change' },       
					],
					email: [
						// { required: true, message: '请输入邮箱', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						{
							validator: isEmail,
							type: 'change'
						}
					],
					tel: [
						// { required: true, message: '请输入固定电话', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						// { validator: isTel, type: 'change' }       
					],
					documentCode: [
						// { required: true, message: '请输入证件号', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						{
							validator: isIdCard
						}
					],
					addr: [
						// { required: true, message: '请输入详细地址', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					remarks: [
						// { required: true, message: '请输入备注', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过4000',
							trigger: 'change'
						}
					]
				}
			}
		},
		components: {
			treeDepartmentName
		},
		methods: {
			passChange(event){
				if(event.target.attributes[5].value=="text"){
					event.target.attributes[5].value='password';
				}else if(event.target.attributes[2].value=="text"){
					event.target.attributes[2].value='password';
				}
			},
			// 弹出框显示
			handlePopoverShow() {
				// alert(1);
			},
			// 显示节点被选中
			handleChildSubmit(str) {
				//			console.log(str.departmentId)
				this.propoverVisible = false;
				this.form.departmentId = str.departmentId;
				this.form.departmentName = str.departmentName;
			},
			// 方法
			submitForm(formName) {
				let that = this;
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '用户管理'
					});
				}
				//          console.log(this.form.userRoleName)
				this.$refs[formName].validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						if(this.getPageType == '添加') {
							let params = {
								userId: this.userInfo.userCode,
								...this.form
							}
							//			            console.log(JSON.stringify(params));
							addUserInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '用户管理'
										});
									} else {
										that.tableLoading = false;
										that.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
									// console.log(err);
								});
						} else if(this.getPageType == '修改') {

							let data = JSON.parse(this.getFormData);
							let params = {
								"userId": this.userInfo.userCode,
								"id": data.id,
								"version": data.version,
								...this.form
							};
							//                      console.log(JSON.stringify(params))
							updateUserInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '用户管理'
										});
									} else {
										that.tableLoading = false;
										that.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									// console.log(err);
									that.tableLoading = false;
								});
						}
						this.tableLoading = false;
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '用户管理'
				});
			},
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			// 选择部门名称
			handleDepartmentName() {
				this.departmentSelect.forEach((val, index) => {
					if(val.label == this.form.departmentName) {
						this.form.departmentId = val.value;
					}
				});
			},
			// 选择用户组名称
			handleUserGroupName() {
				this.userGroupSelect.forEach((val, index) => {
					if(val.value == this.userGroupName) {
						this.form.userGroupId = val.value;
						this.form.userGroupName = val.label;
					}
				});
			},
			// 选择角色名称
			handleUserRoleName() {
				this.roleSelect.forEach((val, index) => {
					if(val.value == this.userRoleName) {
						this.form.userRoleId = val.value;
						this.form.userRoleName = val.label;
					}
				});
			},
		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			if(this.getPageType == '查看') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				this.disabled = true;
				// this.form.status
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					"departmentId": res.departmentId,
					departmentName: res.departmentName, // 部门名称
					realName: res.realName, // 用户真实姓名
					userName: res.userName, // 用户登录名
					mobile: res.mobile, // 手机号
					status: res.status, // 状态
					"userGroupId": res.userGroupId,
					userGroupName: res.userGroupName, // 用户组名称
					"userRoleId": res.userRoleId,
					userRoleName: res.userRoleName, // 角色名称

					age: res.age, // 年龄
					sex: res.sex, // 性别
					email: res.email, // 邮箱
					tel: res.tel, // 固定电话
					documentCode: res.documentCode, // 证件号
					addr: res.addr, // 详细地址
					remarks: res.remarks // 备注
				}
				this.userRoleName = res.userRoleName;
				this.userGroupName = res.userGroupName;
				// this.form.status
			}
			// 用户组名称
			let params = {
				userId: this.userInfo.userCode
			}
			selectUserplatGroupName(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;

					//                 console.log(data)
					if(code == 'SUCCESS') {
						if(msg != "") {
							msg.forEach((val, index) => {
								this.userGroupSelect.push({
									label: val.key,
									value: val.value
								});
							})
						}
						// this.$message.success(msg);
					} else {
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
			// 用户组名称
			selectDepartmentName(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;

					//                 console.log(data)
					if(code == 'SUCCESS') {
						if(msg != "") {
							msg.forEach((val, index) => {
								this.departmentSelect.push({
									label: val.key,
									value: val.value
								});
							})
						}
						// this.$message.success(msg);
					} else {
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
			// 角色名称
			selectPlatUserName(params)
				.then((res) => {
					//              console.log(res);
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					if(code == 'SUCCESS') {
						msg.forEach((val, index) => {
							this.roleSelect.push({
								label: val.key,
								value: val.value
							});
						})
						// this.$message.success(msg);
					} else {
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
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
		min-width: 500px;
		overflow: hidden;
	}
	.el-form-item {
		width: 33%;
		float: left;
		height: 32px;
	}
	@media only screen  
	and (min-device-width : 768px)  
	and (max-device-width : 1024px){  
		.el-form-item {
			width: 50%;
			float: left;
		}
	}  
	.el-select {
		width: 100%;
	}
</style>