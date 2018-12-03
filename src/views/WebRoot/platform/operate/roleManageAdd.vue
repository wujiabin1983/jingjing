<!-- 平台系统管理角色管理新增-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="centerInfo">
				<el-form ref="form" :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? norules : rules" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="10">
							<el-form-item label="角色代码" prop="userRoleId">
								<el-input v-model="form.userRoleId" :disabled="userRoleIdDisabled" placeholder="请输入角色代码"></el-input>
							</el-form-item>
							<el-form-item label="角色名称" prop="userRoleName">
								<el-input v-model="form.userRoleName" placeholder="请输入角色名称"></el-input>
							</el-form-item>
							<el-form-item class="is-required posiRela" label="可查看部门" prop="department">
								<el-select v-model="form.department" multiple disabled class="selectMultiple dsh-input">
									<el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
								<el-button type="primary" v-popover:popover4 class="dsh-input-button">选择</el-button>
								<el-popover ref="popover4" placement="right" trigger="click" v-model="propoverVisible" width="400" @show="handlePopoverShow">
									<treeDepartment v-if="propoverVisible" @childSubmit="handleChildSubmit" :childCode="cardArr"></treeDepartment>
								</el-popover>
							</el-form-item>
							<el-form-item label="描述" prop="describe">
								<el-input type="textarea" v-model="form.describe" placeholder="请输入描述" resize="none"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div>
						<el-button @click="handleBack">返回</el-button>
						<el-button type="primary" @click="handleSubmit">确定</el-button>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { validateInt } from '@/utils/validate'; // 正则
	import { lazyTree } from '@/api/platform/organization' // 接口
	import { treeDepartment } from '@/views/WebRoot/platform' // 组件
	import { addUserRoleInfo, updateUserRoleInfo } from '@/api/platform/roleManage'
	import { mapGetters } from 'vuex'
	const isInt = (rule, value, callback) => {
		if(!validateInt(value)) {
			callback(new Error('请输入整数'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			var validateRequired = (rule, value, callback) => {
				// console.log(value, 'validateRequired')
				if(value.length <= 0) {
					callback(new Error('请输入可查看部门'));
				} else {
					callback();
				}
			};
			var validateMerchantRequired = (rule, value, callback) => {
				// console.log(value, 'validateRequired')
				if(value.length <= 0) {
					callback(new Error('请输入可管理商户'));
				} else {
					callback();
				}
			};
			return {

				// 表单
				/**"userRoleId" : "角色代码",
				    "userRoleName" : "角色代码",
				    "departmentListCode" : "可查看部门ID1,ID2,....",
				    "departmentListDesc" : "可查看部门Name1,Name2,....",
				    "sellerIdList" : "可查看商户ID1,ID2,....",
				    "sellerNameList" : "可查看商户Name1,Name2,....",
				    "userRoleDesc" : "描述"//可为空 */
				form: {
					userRoleId: "",
					userRoleName: "",
					department: "",
					//              commercial: "",
					describe: ""
				},
				tableLoading: false,
				userRoleIdDisabled: false, // 用户代码是否不允许修改
				norules: {},
				// 表单验证
				rules: {
					userRoleId: [{
							required: true,
							message: '请输入角色代码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						},
					],
					userRoleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					department: [{
						validator: validateRequired,
						trigger: 'blur'
					}],
					//              commercial: [
					//                  { validator: validateMerchantRequired, trigger: 'blur' }
					//              ],
					describe: [
						// { required: true, message: '请输入描述', trigger: 'blur' },
						{
							max: 4000,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					]

				},
				departmentOptions: [],
				propoverVisible: false, // popover 是否可见 - 可查看部门

				cardArr: [],
				descArr: [],
				departmentListCode: '', // 可查看部门ID
				departmentListDesc: '', // 可查看部门Name

				merchantOptions: [],
				propoverVisible1: false, // popover 是否可见 - 可管理商户
				sellerIdList: '',
				sellerNameList: ''
			}
		},
		methods: {
			// 确认提交
			handleSubmit() {
				let that = this;
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						if(this.getPageType == '添加') {
							var params = {
								"userId": this.userInfo.userCode,
								userRoleId: this.form.userRoleId,
								userRoleName: this.form.userRoleName,
								departmentListCode: this.departmentListCode,
								departmentListDesc: this.departmentListDesc,
								"sellerIdList": this.sellerIdList,
								"sellerNameList": this.sellerNameList,
								userRoleDesc: this.form.describe
							}
							addUserRoleInfo(params)
								.then((res) => {
									// console.log(res);return false;
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									if(code == 'SUCCESS') {
										that.tableLoading = false;
										that.$message.success(msg);
										that.$router.push({
											name: '角色管理'
										});
									} else {
										that.tableLoading = false;
										that.$message.error(msg);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
									// console.log(err);
								});
						}
						if(this.getPageType == '修改') {
							var params = {
								"userId": this.userInfo.userCode,
								userRoleName: this.form.userRoleName,
								departmentListCode: this.departmentListCode,
								departmentListDesc: this.departmentListDesc,
								"sellerIdList": this.sellerIdList,
								"sellerNameList": this.sellerNameList,
								userRoleDesc: this.form.describe,
								id: this.form.id,
								version: this.form.version,
							}
							updateUserRoleInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data)),
										code = data.messageType,
										msg = data.messageContent;
									// console.log(data, code, msg);
									if(code == 'SUCCESS') {
										that.$message.success(msg);
										that.$router.push({
											name: '角色管理'
										});
										that.tableLoading = false;
									} else {
										that.$message.error(msg);
										that.tableLoading = false;
									}
								})
								.catch((err) => {
									that.tableLoading = false;
								});
						}
					}
				})
			},
			// 取消
			handleBack() {
				this.$router.push({
					name: '角色管理'
				});
			},
			// 弹出框显示
			handlePopoverShow() {
				// alert(1);
			},
			// 显示节点被选中
			handleChildSubmit(str) {
				this.propoverVisible = false;
				// this.form.department = [];
				// this.departmentOptions = [];

				// let code = [];
				// let desc = [];
				this.departmentListCode = '';
				this.departmentListDesc = '';
				str.forEach((val, index) => {
					this.form.department.push(val.label);
					this.departmentOptions.push(val);
					this.cardArr.push(val.departmendIdFull);
					this.descArr.push(val.label);
				});
				this.form.department = Array.from(new Set(this.form.department));
				this.departmentOptions = Array.from(new Set(this.departmentOptions));
				this.cardArr = Array.from(new Set(this.cardArr));
				this.descArr = Array.from(new Set(this.descArr));
				this.cardArr.forEach((val, index) => {
					this.departmentListCode += val + ',';
				});
				this.descArr.forEach((val, index) => {
					this.departmentListDesc += val + ',';
				});
			},

		},
		components: {
			treeDepartment
			//      merchantManage
		},
		created() {
			//      console.log(this.getPageType);
			if(this.getPageType == "修改") {
				this.userRoleIdDisabled = true;
				let data = JSON.parse(this.getFormData);
				// console.log(this.getFormData);

				this.form = {
					...data
				}

				this.departmentListCode = data.departmentListCode;
				this.departmentListDesc = data.departmentListDesc;
				this.form.department = data.departmentListDesc.split(',');
				this.form.department.pop();

				this.sellerIdList = data.sellerIdList;
				this.sellerNameList = data.sellerNameList;
				this.form.commercial = data.sellerNameList.split(',');
				this.form.commercial.pop();
				// departmentOptions
				// departmentListCode
				// departmentListDesc

				// merchantOptions
				// sellerIdList
				// sellerNameList

			}
		},
		computed: {
			getFormData() {
				return this.$route.params.formData;
			},
			getPageType() {
				return this.$route.params.pageType;
			},
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.mimosisIpt {
		position: absolute;
		left: 5px;
		top: 0;
		display: inline-block;
		// 模拟input输入框
		width: rem(400px);
		height: 30px;
	}
	
	.el-form-item__label[for="department"]:after {
		content: '*'!important;
		color: #fa5555!important;
		margin-right: 4px!important;
	}
	.posiRela{
		position: relative;
	}
</style>