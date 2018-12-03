<!--员工信息-导入信息-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack">返回</el-button>
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="form.searchContent" placeholder="请输入员工编码或员工名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="loginId" label="登录账号"></el-table-column>
					<el-table-column prop="userCode" label="员工编号"></el-table-column>
					<el-table-column prop="userName" label="员工姓名"></el-table-column>
					<el-table-column prop="birthDate" label="出生日期"></el-table-column>
					<el-table-column prop="entryDate" label="入职日期"></el-table-column>
					<el-table-column prop="userType" label="员工类型"></el-table-column>
					<el-table-column prop="roleTypeName" label="所属角色"></el-table-column>
					<el-table-column prop="brandName" label="所属品牌"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background  class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { importStaffManagement } from '@/api/base/staffManagement'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				form: {
					searchContent: ''
				},
				// 表格数据
				tableData: [],
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
				//          {
				//				loginId: '', //登录账号
				//				password: '', //密码
				//              userCode: '', //员工编号
				//				userName: '', //员工姓名
				//				userHeaderUrl: '', //员工头像URL	--------
				//				storeAliasName: '', //所属门店
				//				storeUrl: '', //状态
				//				age: '', //年龄	
				//				sex: '', //性别				---------
				//				birthDate: '', //出生日期
				//				entryDate: '', //入职日期		--------
				//				userType: '', //员工类型
				//				roleTypeName: '', //所属角色名称
				//				storeId: '', //门店编码
				//				storeName: '', //门店名称
				//				specialSignature: '', //个性签名
				//				documentType: '', //证件类型
				//				idNumber: '', //证件号码
				//				status: '', //状态
				//				workAddress:'',//工作地址
				//				brandId:'',//品牌编码
				//				brandName:''//品牌名称
				//          }
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			onSubmit() {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				// 钩子函数 -- 初始化
				this.showTable('', this.limit, res);
			},

			// 分页
			handleCurrentChange(val) {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				this.page = val;
				this.showTable(val, this.limit, res);
			},
			handleSizeChange(val) {
				this.limit = val;
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				this.showTable(this.page, this.limit, res);
			},
			// 方法
			showTable(start, limit, res) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: this.form.searchContent,
					masterId: res.id
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				//          console.log(params)
				importStaffManagement(params)
					.then(function(res) {
						//                  console.log(JSON.stringify(res.data)+"返回值");
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '员工管理员工管理查询',
					params: {
						pageTypeOther: '导入详情',
						pageType: '查看',
						formData: data,
						mainData: this.getFormData
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '员工信息'
				});
			},
		},
		created() {
			let res = '';
			if(this.getFormData) {
				res = JSON.parse(this.getFormData);
			}
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, res);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
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
		float: right;
	}
	
	.el-form-item--small.el-form-item {
		margin-bottom: 0px;
	}
	
	.el-input {
		width: 200px;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-button {
		float: left;
		margin: 0 0 10px 0;
	}
</style>