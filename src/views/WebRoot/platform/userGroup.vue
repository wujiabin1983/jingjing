<!--平台用户组管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addUserGroupInfo || roleBtn.updateUserGroupInfo || roleBtn.selectUserGroupInfo">
				<el-form id="selectUserGroupInfo" v-if="roleBtn.selectUserGroupInfo" :inline="true" :model="formSearch" class="form-search" @selection-change="handleSelectionChange">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="handleAdd" id="addUserGroupInfo" v-if="roleBtn.addUserGroupInfo">添加</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="">
							<el-input v-model="formSearch.searchMsg" placeholder="请输入用户组名称或用户组代码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch(null, null, formSearch.searchMsg)">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>

		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="userGroupId" label="用户组代码"></el-table-column>
					<el-table-column prop="userGroupName" label="用户组名称"></el-table-column>
					<el-table-column prop="userGroupDesc" label="描述">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.userGroupDesc"></el-input>
	                    	<el-popover trigger="hover" v-else placement="top">
					          <p> {{ scope.row.userGroupDesc }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.userGroupDesc }}</el-tag>
					          </div>
					        </el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="byOwn" width="80px" label="所属用户" v-if="roleBtn.selectUserByUserGroupId">
						<template slot-scope="scope">
							<!-- 查看 -->
							<el-tooltip class="iconItem" content="查看" placement="top">
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="action" label="操作" width="80px" v-if="roleBtn.updateUserGroupInfo || roleBtn.deleteUserGroupInfo">
						<template slot-scope="scope">
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateUserGroupInfo && !scope.row.isEdit" @click.native.prevent="iconXiugai(scope.$index, scope.row)">
								<icon-svg icon-class="xiugai" id="icon-xiugai" />
							</el-tooltip>
							<!-- 确认 -->
							<el-tooltip class="iconItem" content="确认" placement="top" v-if="roleBtn.updateUserGroupInfo && scope.row.isEdit">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.deleteUserGroupInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<el-footer v-if="count || limit">
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
		<!-- 分页 -->

	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleBtn: {
					selectUserGroupInfo: false, // 查询
					addUserGroupInfo: false, // 新增
					updateUserGroupInfo: false, // 修改
					deleteUserGroupInfo: false, // 删除
					selectUserByUserGroupId: false // 所属用户
				},

				// 搜索栏
				formSearch: {
					searchMsg: ""
				},
				//   序号 id 
				//   选择 select 
				//   用户组代码 userGroupId 
				//   用户组名称 userGroupName 
				//   描述 userGroupDesc 
				//   所属用户 byOwn 
				//   操作 action

				tableData: [],
				multipleSelection: [],
				loading: false,

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			};
		},
		methods: {
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.handleSearch(this.page, this.limit, this.formSearch.searchMsg);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.handleSearch(this.page, this.limit, this.formSearch.searchMsg);
			},
			handleSearch(page, limit, userGroupName) {
				page = !page ? "" : page;
				limit = !limit ? "" : limit;
				userGroupName = !userGroupName ? "" : userGroupName;
				this.loading = true;
				let that = this;
				let searchData = {
					"userId": this.userInfo.userCode,
					"page": page, //可为空
					"limit": this.limit, //可为空
					"userGroupName": userGroupName //可为空
				}
				selectUserGroupInfo(searchData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						//                      console.log(JSON.stringify(data))
						res = [];
						msg.forEach((val, index) => {
							res.push({
								isEdit: false,
								userGroupId: val.userGroupId,
								userGroupName: val.userGroupName,
								userGroupDesc: val.userGroupDesc,
								id: val.id,
								version: val.version
							});
						});
						that.count = data.count;
						this.tableData = res;
						this.loading = false;
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			// 添加用户组 - 跳页
			handleAdd() {
				this.$router.push({
					name: '平台系统管理用户组新增',
					params: {
						pageType: '添加'
					}
				});
			},
			// 添加用户组 - 执行
			handleAddUserGroupInfo() {
				this.loading = true;
				let that = this;
				let formData = JSON.parse(this.getFormData);
				//          console.log(formData);
				let params = {
					"userId": this.userInfo.userCode,
					...formData
				}
				addUserGroupInfo(params)
					.then((res) => {
						// console.log(res)
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
						} else {
							that.$router.push({
								name: '用户组 - 添加',
								params: {
									pageType: '添加',
									formData: this.getFormData
								}
							});
							that.$message.error(data.messageContent);
						}
						that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleSelectionChange(val) {
				// 多选
				this.multipleSelection = val;
			},
			iconChakan(index, row) {
				// 查看
				this.$router.push({
					name: '平台系统管理用户组所属用户',
					params: {
						formData: JSON.stringify(row)
					}
				});
			},
			iconXiugai(index, row) {
				// 修改
				row.isEdit = true;
			},
			iconQueren(index, row) {
				let that = this;
				// 确认
				row.isEdit = false;
				let data = {
					"userId": this.userInfo.userCode,
					"id": row.id,
					"userGroupDesc": row.userGroupDesc, //可为空
					"version": row.version
				}
				//          console.log(data)
				updateUserGroupInfo(data)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(data);
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
						} else {
							that.$message.error(data.messageContent);
							that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			iconShanchu(index, row) {
				let that = this;
				// 删除
				that.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						idArray: row.id
					};
					deleteUserGroupInfo(data)
						.then((res) => {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
								that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
							}
						})
						.catch((err) => {
							that.tableLoading = false;
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			deleteMultiple(row) {
				let that = this;
				// let idArray = [];
				if(this.multipleSelection.length == 0) {
					that.$message.warning('请选择您要删除的数据');
					return false;
				}
				let idArray = [];

				this.multipleSelection.forEach((val, index) => {
					idArray += val.id + ',';
					// 删除
				});
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						idArray: idArray
					};
					this.$refs.tableData.clearSelection();
					deleteUserGroupInfo(data)
						.then((res) => {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$route.params.pageType = '';
								that.$message.success(data.messageContent);
								that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
							} else {
								that.$message.error(data.messageContent);
								that.handleSearch(that.page, that.limit, that.formSearch.searchMsg);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			}
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getFormData() {
				let msg = this.$route.params.formData;
				return msg;
			},
			getPageType() {
				let msg = this.$route.params.pageType;
				return msg;
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			let that = this;
			if(this.getPageType == '添加') {
				this.handleAddUserGroupInfo();
			} else {

			}
			this.handleSearch(this.page, this.limit, this.formSearch.searchMsg);

		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.el-header {
		//  搜索栏 解决水平对齐
	}
	
	.form-search {
		display: unset;
		.el-form-item {
			margin-bottom: 0;
		}
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
	.el-card {
		width: 100%;
	}
</style>