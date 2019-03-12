<!--员工管理-角色权限-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addEmplRoleInfo || roleBtn.selectEmplRoleInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectEmplRoleInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="addTable" v-if="roleBtn.addEmplRoleInfo">新增角色</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item>
							<el-input v-model="form.searchContent" placeholder="请输入角色ID或角色名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="userRoleName" label="角色名称"></el-table-column>
					<el-table-column prop="isEnable" label="是否启用"></el-table-column>
					<el-table-column prop="remarks" label="备注"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateEmplRoleInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.updateEmplRoleInfo && scope.row.isEdit">
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteEmplRoleInfo">
								<!-- 删除 -->
								<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="设置权限" placement="top" v-if="roleBtn.anthorEmplRoleInfo">
								<!-- 设置权限 -->
								<i class="iconfont icon-setting" @click.prevent="iconSetRole(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="rule" id="icon-rule" @click.native.prevent="iconSetRole(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="设置APP权限" placement="top" v-if="roleBtn.anthorAppRoleInfo">
								<!-- 设置权限 -->
								<i class="iconfont icon-shoujishezhi" @click.prevent="iconSetRole2(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="setMobile" id="icon-setMobile" @click.native.prevent="iconSetRole2(scope.$index, scope.row)" /> -->
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
	import { selectRoleData, addRoleInfo, setRoleInfo, deleteRoleInfo } from '@/api/base/rolePrivileges'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleBtn: {
					selectEmplRoleInfo: false,
					addEmplRoleInfo: false,
					updateEmplRoleInfo: false,
					deleteEmplRoleInfo: false,
					anthorEmplRoleInfo: false,
					anthorAppRoleInfo: false
				},
				// 搜索数据
				form: {
					searchContent: ''
				},
				// 表格数据
				tableData: [],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				// 分页
				page: 0, // 当前页
				count: 0, // 总页数
				limit: this.GLOBAL.limit // 分页
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页
			handleCurrentChange(val) {
				//          console.log(val);
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit);
			},
			showTable(start, limit) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					userRole: this.form.searchContent
				}
				//          console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectRoleData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(data);
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.count = data.count;
						that.tableData = result;
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
					name: '员工管理角色权限查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			//图标 - 权限分配
			iconSetRole(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '员工管理角色权限设置',
					params: {
						pageType: '权限分配',
						formData: data
					}
				});
			},
			//图标 - 权限APP分配
			iconSetRole2(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '员工管理角色权限设置',
					params: {
						pageType: '权限分配APP',
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '员工管理角色权限修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 图标 - 确认
			iconQueren(index, row) {

			},
			// 图标 - 删除
			iconShanchu(index, row) {
				let that = this;
				this.tableLoading=true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//	            console.log(index);
					let params = {
						userId: this.userInfo.userCode,
						params: row.id,
					}
					//	            console.log(params)
					this.tableLoading = true;
					// 查询接口
					deleteRoleInfo(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							let code = data.messageType;
							let msg = data.messageContent;
							//	                    console.log(data);
							if(code == 'SUCCESS') {
								that.$message.success(msg);
							} else {
								that.$message.warning(msg);
							}
							that.showTable(that.page, that.limit);
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading=true;
				});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '员工管理角色权限新增角色',
					params: {
						pageType: '添加'
					}
				});
			},
			// 添加请求后台
			handleAddSellerInfo(formData) {
				this.tableLoading = true;
				addRoleInfo(formData)
					.then((res) => {
						//					console.log(res)
						let data = JSON.parse(Base64.decode(res.data.data));
						//					console.log(data)
						if(data.messageType == 'SUCCESS') {
							this.$message.success(data.messageContent);
							this.showTable(this.page, this.limit, this.form.searchContent);
						} else {
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 修改请求后台
			handleUpdateSellerInfo(formData) {
				this.tableLoading = true;
				//          console.log(JSON.stringify(formData)+"入参")
				setRoleInfo(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data.data));
						if(data.messageType == 'SUCCESS') {
							this.$message.success(data.messageContent);
							this.showTable(this.page, this.limit, this.form.searchContent);
						} else {
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						//                  console.log(err);
					});
				this.tableLoading = false;
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit);
			// 钩子函数 -- 初始化
			let that = this;
			let formData;
			let data;
			if(this.getPageType) {
				formData = JSON.parse(this.getFormData);
				data = {
					"userId": this.userInfo.userCode,
					...formData
				}
			}
			//      console.log(data)
			if(this.getPageType == "添加") {
				this.getPageType = '';
				this.handleAddSellerInfo(data);
			} else if(this.getPageType == '修改') {
				this.getPageType = '';
				this.handleUpdateSellerInfo(data);
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			//添加或修改返回的值
			getFormData() {
				return this.$route.params.formData;
			},
			//添加或修改返回的类型
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
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
		}
		.el-input{
			width: 200px;
		}
	}
</style>