<!--组织架构管理-->
<template>
	<div class="app-container">
		<el-main class="overHidden">
			<el-card class="centerInfo">
				<h4>组织架构信息</h4>
				<el-form ref="form" v-loading="tableLoading" :model="form" label-width="140px" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="当前组织架构代码" prop="codeCurrent">
								<el-input v-model="form.codeCurrent" placeholder="请输入当前组织架构代码"></el-input>
							</el-form-item>
							<el-form-item label="当前组织架构名称" prop="nameCurrent">
								<el-input v-model="form.nameCurrent" placeholder="请输入当前组织架构名称"></el-input>
							</el-form-item>
							<el-form-item label="组织架构描述" prop="desc">
								<el-input type="textarea" resize="none" placeholder="请输入组织架构描述" v-model="form.desc"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div>
					<el-button @click="btnBack">返回</el-button>
					<el-button type="primary" @click="submitForm()">确定</el-button>
				</div>
			</el-card>
		</el-main>
	</div>
</template>
<script>
	import { validateInt } from "@/utils/validate";
	import { addContOrgInfo } from '@/api/platform/organization'
	import { mapGetters } from 'vuex';
	export default {
		data() {
			const isInt = (rule, value, callback) => {
				if(!validateInt(value)) {
					callback(new Error("请输入整数"));
				} else {
					callback();
				}
			};
			return {
				formHigher: {
					codeHigher: '',
					nameHigher: '',
					departmentIdFull: '',
					departmentNameFull: ''
				},
				//   表单数据
				form: {
					codeCurrent: "", // 当前组织架构代码
					nameCurrent: "", // 当前组织架构名称
					desc: "" // 组织架构描述
				},
				tableLoading: false,
				rules: {
					codeCurrent: [{
							required: true,
							message: "请输入当前组织架构代码",
							trigger: "blur"
						},
						// { validator: isInt },
						{
							max: 100,
							message: "最大长度不能超过100",
							trigger: "blur"
						}
					],
					nameCurrent: [{
							required: true,
							message: "请输入当前组织架构名称",
							trigger: "blur"
						},
						{
							max: 100,
							message: "最大长度不能超过100",
							trigger: "blur"
						}
					],
					desc: [
						// { required: true, message: "请输入组织架构描述", trigger: "blur" },
						{
							max: 4000,
							message: "最大长度不能超过4000",
							trigger: "blur"
						}
					]
				}
			}
		},
		methods: {
			submitForm() {
				this.$refs["form"].validate(valid => {
					if(valid) {
						this.tableLoading = true;
						let params = {
							"userId": this.userInfo.userCode,
							"parentId": this.formHigher.codeHigher,
							"parentName": this.formHigher.nameHigher,
							"parentIdFull": this.formHigher.departmentIdFull,
							"parentNameFull": this.formHigher.departmentNameFull,
							"departmentId": this.form.codeCurrent,
							"departmentName": this.form.nameCurrent,
							"departmentDesc": this.form.desc, //可为空
						}
						let that = this;
						//					 console.log(params);return false;
						addContOrgInfo(params)
							.then(function(res) {
								that.tableLoading = false;
								let data = JSON.parse(Base64.decode(res.data));
								//							console.log(data)
								if(data.messageType == 'SUCCESS') {
									that.$message.success(data.messageContent);
									that.$router.push({
										name: '组织架构'
									});
								} else {
									that.$message.warning(data.messageContent);
								}
							})
							.catch(function(err) {
								// console.log(err);
							});
					} else {
						// console.log("error submit!!");
						return false;
					}
				});
			},
			btnBack() {
				this.$router.push({
					name: '组织架构'
				});
			}
		},
		computed: {
			isEdit() {
				return this.$route.meta.isEdit;
			},
			treeData() {
				return this.$route.params.treeData;
			},
			getPageType() {
				return this.$route.params.pageType;
			},
			getPageTypes() {
				return this.$route.params.type;
			},
			...mapGetters([
				'userInfo',
			])
		},
		created() {
			if(this.getPageTypes) {
				this.$router.push({
					name: '组织架构'
				});
				this.getPageTypes = '';
				this.$route.params.type = '';
			}
			if(this.getPageType == '添加') {
				let res = JSON.parse(this.treeData);
				this.formHigher.codeHigher = res.codeHigher;
				this.formHigher.nameHigher = res.nameHigher;
				this.formHigher.departmentIdFull = res.departmentIdFull;
				this.formHigher.departmentNameFull = res.departmentNameFull;
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
		width: 370px;
	}
</style>