<!--平台用户管理-->
<template>
	<el-container class="app-container">
		<el-header v-loading="statusLoading">
			<el-card v-if="roleBtn.addUserInfo || roleBtn.deleteUserInfo || roleBtn.activeUserInfo || roleBtn.inactiveUserInfo || roleBtn.selectUserInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectUserInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="handleAdd" v-if="roleBtn.addUserInfo">添加</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="" prop="searchInfo">
							<el-input v-model="form.searchInfo" placeholder="请输入用户姓名或用户登录名"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<!-- 表格sdsdf -->
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="realName" label="用户真实姓名"></el-table-column>
					<el-table-column prop="userName" label="用户登录名"></el-table-column>
					<el-table-column prop="departmentName" label="部门名称"></el-table-column>
					<el-table-column prop="userGroupName" label="用户组名称"></el-table-column>
					<el-table-column prop="userRoleName" label="角色名称"></el-table-column>
					<el-table-column prop="mobile" width="100" label="手机号"></el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
					<el-table-column prop="remarks" label="备注"></el-table-column>
					<el-table-column prop="action" width="130" label="操作">
						<template slot-scope="scope">
							<!-- 查看 -->
							<el-tooltip class="iconItem" content="查看" placement="top">
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateUserInfo">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 确认 -->
							<!-- <icon-svg icon-class="queren" id="icon-queren" v-else @click.native.prevent="iconQueren(scope.$index, scope.row)"/> -->
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.deleteUserInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 启用 -->
							<el-tooltip class="iconItem" content="激活" placement="top" v-if="roleBtn.activeUserInfo && scope.row.status != '激活'">
								<icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 停用 -->
							<el-tooltip class="iconItem" content="停用" placement="top" v-if="roleBtn.inactiveUserInfo && scope.row.status != '停用'">
								<icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, tableData)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectUserInfo, addUserInfo, updateUserInfo, deleteUserInfo, stopUserInfo, startUserInfo } from '@/api/platform/userManage';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectUserInfo: false,
					addUserInfo: false,
					updateUserInfo: false,
					deleteUserInfo: false,
					activeUserInfo: false,
					inactiveUserInfo: false
				},
				// 表格的加载
				tableLoading: false,
				statusLoading: false,
				// 搜索数据
				form: {
					searchInfo: ''
				},
				// 多选
				multipleSelection: [],
				// table数据
				tableData: [
					//     {
					//     "isEdit": false,
					//     "id" : "记录ID(修改用)",
					//     "realName" : "真实姓名",
					//     "userName" : "用户登录名",
					//     "departmentId" : "部门ID",
					//     "departmentName" : "部门名称",
					//     "userGroupId" : "用户组ID",
					//     "userGroupName" : "用户组名称",
					//     "userRoleId" : "角色ID",
					//     "userRoleName" : "角色名称",
					//     "mobile" : "手机号",
					//     "status" : "状态",
					//     "age" : "年龄",
					//     "sex" : "性别",
					//     "email" : "邮箱",
					//     "tel" : "固定电话",
					//     "documentCode" : "证件号",
					//     "addr" : "详细地址",
					//     "remarks" : "备注",
					//     "version" : "版本记录(修改用)"
					// }
				],
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 搜索
			handleSearch() {
				this.showTable('', this.limit, this.form.searchInfo);
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.searchInfo);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchInfo);
			},
			// 显示表格数据
			showTable(page, limit, searchContent) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": page, //可为空
					"limit": limit, //可为空
					"queryCode": searchContent, //可为空
				}
				// console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectUserInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						// if(data.code == 0) {
						let result = []
						msg.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						});
						// console.log(msg);
						this.tableData = result;
						this.tableLoading = false;
						this.count = data.count;
						// }else {
						//     this.$message.error(data.returnMsg);
						//     this.tableLoading = false;
						// }
					})
					.catch((err) => {
						// console.log(err);
						this.tableLoading = false;
					});
			},
			// 按钮 - 添加
			handleAdd() {
				// 跳转添加页面，需要在路由中添加页面
				this.$router.push({
					name: '平台系统管理用户管理新增',
					params: {
						pageType: '添加'
					}
				});
			},
			// 按钮 - 添加 - 操作
			//      add(str) {
			//          let res = JSON.parse(str);
			//          let params = {
			//              userId: this.userInfo.userCode,
			//              ...res
			//          }
			//          this.tableLoading = true;
			//          addUserInfo(params)
			//              .then((res) => {
			//                  let data = JSON.parse(Base64.decode(res.data));
			//                  if(data.messageType == 'SUCCESS') {
			//                      this.$message.success(data.messageContent);
			//                      this.showTable(this.page, this.limit, this.form.searchInfo); 
			//                  }else {
			//                      this.$message.error(data.messageContent);
			//                  }
			//              })
			//              .catch((err) => {
			//                  // console.log(err);
			//              });
			//      },
			// 按钮 - 删除
			handleDelete() {
				let that = this;
				let ids = '';
				this.multipleSelection.forEach((val, index) => {
					ids += val.id + ',';
				});
				if(ids.length == 0) {
					this.$message.warning('请选择数据');
					return false;
				}
				let selected = this.multipleSelection.filter((item) => {
					return item.status == '激活';
				})
				// 如果未选择状态为停用的数据
				// console.log()
				if(selected.length > 0) {
					this.$message.warning('请选择状态为停用的数据');
					return false;
				}
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						"idArray": ids
					}
					// 删除接口
					deleteUserInfo(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								this.showTable(this.page, this.limit, this.form.searchInfo);
							} else {
								that.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			},
			// 按钮 - 激活
			handleActive(index, row) {
				let that = this;
				let ids = '';
				var flag = 0;
				this.multipleSelection.forEach((val, index) => {
					if(val.status == '停用') {
						ids += val.id + ',';
						flag++;
					} else {
						this.$message.warning('请您确认选择的数据全部为停用状态');
						return false;
					}
				});
				if(this.multipleSelection.length != flag) {
					return false;
				}
				if(ids.length == 0) {
					this.$message.warning('请选择状态为停用的数据');
					return false;
				}
				this.statusLoading = true;
				// console.log(ids);
				let params = {
					"userId": this.userInfo.userCode,
					"params": ids
				}
				// console.log(data);return false;
				// 启用接口
				startUserInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);
						// console.log(data, data.returnCode, data.returnMsg); return false;
						if(data.messageType == 'SUCCESS') {
							this.statusLoading = false;
							this.$message.success(data.messageContent);
							this.showTable(this.page, this.limit, this.form.searchInfo);
						} else {
							this.statusLoading = false;
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.statusLoading = false;
						// console.log(err);
					});
			},
			// 按钮 - 停用
			handleInactive(index, row) {
				let that = this;
				let ids = '';
				var flag = 0;
				this.multipleSelection.forEach((val, index) => {
					if(val.status == '激活') {
						ids += val.id + ',';
						flag++;
					} else {
						this.$message.warning('请您确认选择的数据全部为激活状态');
						return false;
					}
				});
				if(this.multipleSelection.length != flag) {
					return false;
				}
				if(ids.length == 0) {
					this.$message.warning('请选择状态为激活的数据');
					return false;
				}
				this.statusLoading = true;
				let params = {
					"userId": this.userInfo.userCode,
					"params": ids
				}
				// console.log(params);return false;
				// 停用接口
				stopUserInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(res); return false;
						// console.log(data);
						// console.log(data, data.returnCode, data.returnMsg);
						if(data.messageType == 'SUCCESS') {
							this.statusLoading = false;
							this.$message.success(data.messageContent);
							this.showTable(this.page, this.limit, this.form.searchInfo);
						} else {
							this.statusLoading = false;
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.statusLoading = false;
						// console.log(err);
					});

			},
			// 图标 - 查看
			iconChakan(index, row) {
				let data = JSON.stringify(row);
				this.$router.push({
					name: '平台系统管理用户管理新增',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				let data = JSON.stringify(row);
				this.$router.push({
					name: '平台系统管理用户管理新增',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 修改 - 操作
			//      handleEdit(data) {
			//          let res = JSON.parse(data);
			//          let params = {
			//              'userId': this.userInfo.userCode,
			//              ...res
			//          }
			//          // console.log(params);return false;
			//          updateUserInfo(params)
			//              .then((res) => {
			//                  let data = JSON.parse(Base64.decode(res.data));
			//                  if(data.messageType == 'SUCCESS') {
			//                      this.$message.success(data.messageContent);
			//                      this.showTable(this.page, this.limit, this.form.searchInfo); 
			//                  }else {
			//                      that.$message.error(data.messageContent);
			//                  }
			//              })
			//              .catch((err) => {
			//                  // console.log(err);
			//              });
			//      },
			// 图标 - 确认
			iconQueren(index, row) {

			},
			// 图标 - 删除
			iconShanchu(index, row) {
				if(row.status == '激活') {
					this.$message.warning('请选择状态为停用的数据');
					return false;
				}
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"idArray": row.id
					}
					// console.log(params);return false;
					deleteUserInfo(params)
						.then((res) => {
							// console.log(res); return false;
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								this.tableData.splice(index, 1);
								this.$message.success(data.messageContent);
								this.showTable(this.page, this.limit, this.form.searchInfo);
							} else {
								this.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			},
			// 图标 - 启用
			iconQiyong(index, row) {
				this.tableLoading=true;
				this.$confirm('您确定要激活这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"params": row[index].id
					}
					// 启用接口
					startUserInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							// console.log(res); return false;
							// console.log(data);
							// console.log(data, data.returnCode, data.returnMsg);
							if(data.messageType == 'SUCCESS') {
								this.$message.success(data.messageContent);
								this.tableLoading=false;
								this.showTable(this.page, this.limit, this.form.searchInfo);
							} else {
								this.$message.warning(data.messageContent);
								this.tableLoading=false;
							}
						})
						.catch((err) => {
							this.tableLoading=false;
							// console.log(err);
						});
				}).catch(() => {
					this.tableLoading = false;
				});
			},
			// 图标 - 停止
			iconTingzhi(index, row) {
				this.tableLoading=true;
				this.$confirm('您确定要停用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"params": row[index].id
					}
					// 停用接口
					stopUserInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							// console.log(res); return false;
							// console.log(data);
							// console.log(data, data.returnCode, data.returnMsg);
							if(data.messageType == 'SUCCESS') {
								row[index].status = "停用";
								this.$message.success(data.messageContent);
								this.showTable(this.page, this.limit, this.form.searchInfo);
								this.tableLoading = false;
							} else {
								this.$message.warning(data.messageContent);
								this.tableLoading = false;
							}
						})
						.catch((err) => {
							this.tableLoading = false;
							// console.log(err);
						});
				}).catch(() => {
					this.tableLoading = false;
				});
			},

		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			if(this.getPageType == '添加') {
				let data = this.getFormData;
				this.add(data);
			} else if(this.getPageType == '修改') {
				let data = this.getFormData;
				this.handleEdit(data);
			}
			this.showTable(this.page, this.limit, this.form.searchInfo);
		},
		computed: {
			// 计算属性
			getFormData() {
				let data = this.$route.params.formData;
				this.$route.params.formData = '';
				return data;
			},
			getPageType() {
				let data = this.$route.params.pageType;
				this.$route.params.pageType = '';
				return data;
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
	
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
			.el-input{
				width: 220px;
			}
		}
	}
</style>