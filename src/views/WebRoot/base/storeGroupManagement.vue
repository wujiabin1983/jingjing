<!--门店管理-店组管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addStoreGroupInfo || roleBtn.exportStoreGroupInfo || roleBtn.selectStoreGroupInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectStoreGroupInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="addTable" v-if="roleBtn.addStoreGroupInfo">新建店组</el-button>
						<el-button type="primary" @click="exportData" :disabled="exportDis" v-if="roleBtn.exportStoreGroupInfo">导出Excel</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item>
							<el-input v-model="form.searchContent" placeholder="请输入店组名称或编码"></el-input>
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
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="storeGroupId" label="店组编码"></el-table-column>
					<el-table-column prop="storeGroupName" label="店组名称"></el-table-column>
					<el-table-column prop="storeGroupDesc" label="店组描述"></el-table-column>
					<el-table-column prop="storeQty" label="门店数量"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateStoreGroupInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.updateStoreGroupInfo && scope.row.isEdit">
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteStoreGroupInfo">
								<!-- 删除 -->
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
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
	import { permission } from '@/utils'
	import { selectStoreGroupManagementInfo, addStoreGroupManagementInfo, setStoreGroupManagementInfo, delectStoreGroupManagementInfo, exportData, getURLPath } from '@/api/base/storeGroupManagement'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				exportDis:false,//导出
				// 权限
				roleBtn: {
					selectStoreGroupInfo: false,
					addStoreGroupInfo: false,
					updateStoreGroupInfo: false,
					deleteStoreGroupInfo: false,
					exportStoreGroupInfo: false
				},
				// 搜索数据
				form: {
					searchContent: '' // 活动类型
				},
				// 表格数据
				tableData: [],
				//				{
				//					id:'',
				//					version:'',
				//					storeGroupId: '',
				//					storeGroupName: '',
				//					storeGroupDesc: '',
				//					storeQty: ''
				//				}
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,

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
			// 查询方法
			onSubmit() {
				this.showTable('', this.limit, this.form.searchContent);
			},
			// 分页
			handleCurrentChange(val) {
				//	            console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form.searchContent);
			},
			//修改每页条数
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchContent);
			},
			//请求数据
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				//				console.log(JSON.stringify(params))
				// 查询接口
				selectStoreGroupManagementInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data)+"店组")
						let result = [];
						if(!data.messageType) {
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
			// 添加请求后台
			handleAddSellerInfo(formData) {
					        	// console.log(JSON.stringify(formData)+"入参")
				this.tableLoading = true;
				addStoreGroupManagementInfo(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	                    console.log(JSON.stringify(data)+"添加返回值");
						if(data.messageType == 'SUCCESS') {
							this.getPageType = '';
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
				setStoreGroupManagementInfo(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	                    console.log(JSON.stringify(data)+"修改返回值");
						if(data.messageType == 'SUCCESS') {
							this.getPageType = '';
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
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '门店管理店组管理查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '门店管理店组管理修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				//				console.log(index);
				let that = this;
				that.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"id": row.id,
						"storeGroupId": row.storeGroupId,
						"storeGroupName": row.storeGroupName
					}
					delectStoreGroupManagementInfo(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//	                    console.log(JSON.stringify(data)+"删除返回值");
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form.searchContent);
							} else {
								that.$message.error(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form.searchContent);
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
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '门店管理店组管理新增',
					params: {
						pageType: '添加'
					}
				});
			},
			//导出数据
			exportData() {
				let params = '';
				this.multipleSelection.forEach((val, index) => {
					params += val.id + ',';
				})
				var param = {
					"userId": this.userInfo.userCode,
					"params": params,
					"searchContent": this.form.searchContent
				}
				this.tableLoading = true;
				this.exportDis=true;
				exportData(param)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	                    console.log(JSON.stringify(data)+"导出返回值");
						if(data.messageType == 'SUCCESS') {
							this.exportDis=false;
							window.location.href = Cookie.get("baseUrl") + data.messageContent;
						} else {
							this.exportDis=false;
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.exportDis=false;
						// console.log(err);
					});
				this.tableLoading = false;
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit, this.form.searchContent);
			// 钩子函数 -- 初始化
			let that = this;
			let formData;
			if(this.getFormData) {
				formData = JSON.parse(this.getFormData);
			}
			if(this.getPageType == "添加") {
				this.getPageType = '';
				this.handleAddSellerInfo(formData);
			} else if(this.getPageType == '修改') {
				this.getPageType = '';
				this.handleUpdateSellerInfo(formData);
			}
		},
		computed: {
			//计算属性
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
	}
</style>