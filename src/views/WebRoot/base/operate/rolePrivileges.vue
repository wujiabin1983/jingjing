<!--员工管理-角色权限-子页面-->
<template>
	<el-container class="app-container">
		<el-main v-if="!nextPageShow">
			<el-card class="centerInfo">
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item label="角色名称" prop="userRoleName">
								<el-input v-model="form.userRoleName" :disabled="disabled"></el-input>
							</el-form-item>
							<el-form-item label="描述" prop="roleDesc">
								<el-input type="textarea" :rows="2" :disabled="disabled" placeholder="请输入角色描述" resize="none" v-model="form.roleDesc">
								</el-input>
							</el-form-item>

							<!--<el-form-item label="用户类型" prop="userType">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.userType" placeholder="所属角色"></el-input>
								<el-select v-else v-model="form.userType" placeholder="请选择">
									<el-option v-for="item in userSelect" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>-->

							<el-form-item label="是否启用" prop="isEnable">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.isEnable" placeholder="性别"></el-input>
								<el-radio-group v-else v-model="form.isEnable">
									<el-radio label="是">是</el-radio>
									<el-radio label="否">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="备注" prop="remarks">
								<el-input type="textarea" :rows="2" :disabled="disabled" placeholder="请输入角色描述" resize="none" v-model="form.remarks">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitForm('form')">下一步</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-main>
		<rolePrivilegesSet v-if="nextPageShow" :getFormData="childFormData" :getPageType="childPageType"></rolePrivilegesSet>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import rolePrivilegesSet from '@/views/WebRoot/base/operate/rolePrivilegesSet'
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
					isEnable: '是', //是否启用
					remarks: '' //备注
				},
				// 用户类型
				// 门店分类
				userSelect: [{
					value: '品牌用户',
					label: '品牌用户'
				}, {
					value: '片区用户',
					label: '片区用户'
				}, {
					value: '店群用户',
					label: '店群用户'
				}, {
					value: '门店用户-店长',
					label: '门店用户-店长'
				}, {
					value: '门店用户-导购',
					label: '门店用户-导购'
				}, {
					value: '门店用户-收银员',
					label: '门店用户-收银员'
				}, {
					value: '门店用户-其他',
					label: '门店用户-其他'
				}],
				norules: {},
				rules: {

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
					userType: [{
							required: true,
							message: '请输入用户类型',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				},

				// 下一页传参
				nextPageShow: false,
				childFormData: '',
				childPageType: ''
			}
		},
		methods: {
			// 方法
			submitForm(formName) {
				if(this.getPageType == '查看') {
					let data = this.getFormData;
					// this.$router.push({ name: '员工管理权限设置', params: {
					// 	formData: data,
					// 	pageType: '查看'
					// } });
//					console.log(JSON.stringify(data))
					this.childFormData = data;
					this.childPageType = '查看';
					this.nextPageShow = true;
					return false;
				}
				this.$refs.form.validate((valid) => {
					if(valid) {
						let data = JSON.stringify(this.form);
						//                  console.log(data)
						if(this.getPageType == '添加') {
							// this.$router.push({ name: '员工管理权限设置', params: {
							//     formData: data,
							//     pageType: '添加'
							// }});
							this.childFormData = data;
							this.childPageType = '添加';
							this.nextPageShow = true;
						} else if(this.getPageType == '修改') {
							// this.$router.push({ name: '员工管理权限设置', params: {
							//     formData: data,
							//     pageType: '修改'
							// }});
							this.childFormData = data;
							this.childPageType = '修改';
							this.nextPageShow = true;
						}

					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '角色权限'
				});
			},
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			// 选择用户类型
			handleUserType() {
				this.userSelect.forEach((val, index) => {
					if(val.label == this.form.userSelect) {
						this.form.userSelect = val.value;
					}
				});
			},

		},
		components: {
			rolePrivilegesSet
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
			} else if(this.getPageType == '权限分配') {
				this.childFormData = this.getFormData;
				this.childPageType = '权限分配';
				this.nextPageShow = true;
			} else if(this.getPageType == '权限分配APP') {
				this.childFormData = this.getFormData;
				this.childPageType = '权限分配APP';
				this.nextPageShow = true;
			}
		},
		computed: {
			// 计算属性
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
	
	.el-form .el-form-item{
		text-align: left
	}
	
	.el-select {
		width: 100%;
	}
</style>