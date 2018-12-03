<!--常量管理-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="resetForm()" v-if="this.getPageType == '查看'" class="mrgBottom10">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" ref="form" label-width="120px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="常量组名称" prop="constantGroup">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.constantGroupName" placeholder="常量组名称"></el-input>
								<el-select v-else v-model="form.constantGroup" placeholder="请选择常量组名称" class="width100" @change="roleSelect">
									<el-option v-for="item in roleOptions" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="常量编码" prop="constantCode">
								<el-input v-model="form.constantCode" :disabled="disabledSet" placeholder="请输入常量编码" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="常量名称" prop="constantName">
								<el-input v-model="form.constantName" :disabled="disabled" placeholder="请数常量名称" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div v-if="this.getPageType!='查看'">
						<el-button @click="resetForm()">返回</el-button>
						<el-button type="primary" @click="handleForm()">确 定</el-button>
					</div>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { showDownSelect } from '@/api/platform/commonManage'
	import { addCommonManage, setCommonManage } from '@/api/platform/commonManage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 数据
				constantGroup: [],
				disabled: false,
				rulesData: '',
				disabledSet: false,
				form: {
					id: '',
					constantCode: '',
					constantName: '',
					constantGroupName: '',
					constantGroupCode: '',
					constantGroup: ''
				},
				showDownSelectOption: [],
				roleOptions: [],
				merchantOptions: [],
				propoverVisible1: false, // popover 是否可见 - 可管理商户
				// 表单数据验证
				norules: {},
				rules: {
					id: [{
							required: true,
							message: '请输入常量组ID',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					constantGroup: [{
						required: true,
						message: '请选择常量组名称',
						trigger: 'change'
					}],
					constantCode: [{
							required: true,
							message: '请输入常量编码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					constantName: [{
							required: true,
							message: '请输入常量名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			// 弹出框显示
			handlePopoverShow() {
				// alert(1);
			},
			// 确认
			handleForm() {
				//          console.log(this.constantGroup);
				this.$refs.form.validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						if(this.getPageType == "添加") {
							var params = {
								userId: this.userInfo.userCode,
								...this.form
							}
							addCommonManage(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//                  console.log(JSON.stringify(data)+"添加返回值");
									if(data.messageType == 'SUCCESS') {
										this.tableLoading = false;
										this.$message.success(data.messageContent);
										this.$router.push({
											name: '常量管理'
										});
									} else {
										this.tableLoading = false;
										this.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									this.tableLoading = false;
									this.$message.error('系统错误！');
									// console.log(err);
								});
						}
						if(this.getPageType == "修改") {
							var params = {
								userId: this.userInfo.userCode,
								...this.form
							}
							setCommonManage(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//                  console.log(JSON.stringify(data)+"添加返回值");
									if(data.messageType == 'SUCCESS') {
										this.tableLoading = false;
										this.$message.success(data.messageContent);
										this.$router.push({
											name: '常量管理'
										});
									} else {
										this.tableLoading = false;
										this.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									this.tableLoading = false;
									this.$message.error('系统错误！');
									// console.log(err);
								});
						}
					} else {
						return false;
					}
				})
			},
			//       <!-- 监听下拉框事件： -->
			roleSelect(val) {
				let index = parseInt(val);
				//			console.log(val)
				let data = this.roleOptions[index];
				this.form.constantGroup = data.key;
				this.form.constantGroupName = data.key;
				this.form.constantGroupCode = data.value;
				//			console.log(JSON.stringify(data));
			},
			// 取消
			resetForm() {
				this.$router.push({
					name: '常量管理'
				});
			}
		},
		created() {
			// 钩子函数 -- 初始化
			if(this.getPageType == '添加') {
				this.rulesData = "rules";
				// let res = JSON.parse(this.getFormData);
				//          console.log(this.getPageType);
			} else if(this.getPageType == '修改') {
				this.disabledSet = true;
				this.rulesData = "rules";
				let res = JSON.parse(this.getFormData);
				//          console.log(JSON.stringify(res))
				this.form = {
					...res
				}
				this.form.constantGroup = this.form.constantGroupName;
			} else if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				this.rulesData = "";
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
			}
			if(this.getPageType != '查看') {
				//      显示常量组下拉框
				showDownSelect()
					.then((res) => {
						//	        		console.log(res);
						let data = JSON.parse(Base64.decode(res.data));
						this.roleOptions = data.data;
						//	        		console.log(JSON.stringify(data)+ '下拉常量组');
					})
					.catch((err) => {
						// console.log(err);
					})
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
			]),
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
	
	.el-form-item {
		width: 380px;
	}
</style>