<!--常量管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addConstantInfo || roleBtn.deleteConstantInfo || roleBtn.selectConstantInfo">
				<!-- 查询功能 -->
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectConstantInfo">
					<el-form-item class="flaotLeft">
						<el-button type="primary" @click="handleAdd" v-if="roleBtn.addConstantInfo">添加</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="">
							<el-input v-model="form.searchContent" placeholder="请输入常量名称或常量编码"></el-input>
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
				<!-- 表格 -->
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="id" label="常量组ID"></el-table-column>
					<el-table-column prop="constantGroupName" label="常量组名称"></el-table-column>
					<el-table-column prop="constantCode" label="常量编码"></el-table-column>
					<el-table-column prop="constantName" label="常量名称"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateConstantInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteConstantInfo">
								<!-- 删除 -->
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
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
	//        显示表格数据                          编辑表格数据                        
	import { selectCommonManage, addCommonManage, setCommonManage, deleteCommonManage, showDownSelect } from '@/api/platform/commonManage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectConstantInfo: false,
					addConstantInfo: false,
					updateConstantInfo: false,
					deleteConstantInfo: false
				},
				// 搜索数据
				form: {
					searchContent: ''
				},
				// table数据
				tableData: [],
				//				{
				//					//              isEdit: false, // 判断是否处于编辑状态
				//					id: '',
				//					constantGroupName: '',
				//					constantCode: '',
				//					constantName: '',
				//					constantValue1: '',
				//					constantValue2: ''
				//
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

			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form.searchContent);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchContent);
			},
			// 显示表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				//				console.log(params)
				// 查询接口
				selectCommonManage(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data) + "查询返回值");
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
						// console.log(err, 'err');
						that.tableLoading = false;
					});
			},
			// 添加请求后台
			handleSubmit(formData) {
				this.tableLoading = true;
				addCommonManage(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data)+"添加返回值");
						if(data.messageType == 'SUCCESS') {
							this.$message.success(data.messageContent);
							this.getPageType = '';
							this.showTable(this.page, this.limit, this.form.searchContent);
						} else {
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error('系统错误！');
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 修改请求后台
			handleSetSubmit(formData) {
				this.tableLoading = true;
				setCommonManage(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data)+"修改返回值");
						if(data.messageType == 'SUCCESS') {
							this.$message.success(data.messageContent);
							this.getPageType = '';
							this.showTable(this.page, this.limit, this.form.searchContent);
						} else {
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error('系统错误！');
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 搜索数据
			handleSearch() {
				this.showTable('', this.limit, this.form.searchContent);
			},
			// 按钮 - 添加
			handleAdd() {
				// 跳转添加页面，需要在路由中添加页面
				this.$router.push({
					name: '常量管理新增',
					params: {
						pageType: '添加'
					}
				});
			},
			// 按钮 - 删除
			handleDelete() {
				let that = this;
				let ids = '';
				if(this.multipleSelection.length == 0) {
					this.$message.warning('请选择数据');
					return false;
				}
				this.multipleSelection.forEach((val, index) => {
					ids += val.id + ',';
				});
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						"params": ids
					}
					// console.log(data);
					// 删除接口
					deleteCommonManage(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit, this.form.searchContent);
							} else {
								that.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '常量管理查询',
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
					name: '常量管理修改',
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
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.pageType = '';
					var params = {
						"userId": this.userInfo.userCode,
						"params": row.id
					}
					deleteCommonManage(params)
						.then((res) => {
							//  	        		console.log(JSON.stringify(res)+"返回值");
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = true;
								that.showTable(that.page, that.limit, that.form.searchContent);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading = true;
								that.showTable(that.page, that.limit, that.form.searchContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = true;
				});
			},

		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			// 用于显示表格数据，并提供查询功能
			let data = this.getFormData;
			let pageType = this.getPageType;
			let res = '';
			// console.log(this.getFormData+"?")
			if(data) {
				res = JSON.parse(data);
				delete(res["constantGroup"]);
			}
			if(pageType == '添加') {
				// console.log(JSON.stringify(res)+"入参");
				let params = {
					"userId": this.userInfo.userCode,
					...res
				}
				this.handleSubmit(params);
			}
			if(pageType == '修改') {
				// console.log(JSON.stringify(res)+"入参");
				let params = {
					"userId": this.userInfo.userCode,
					...res
				}
				this.handleSetSubmit(params);
			}
			if(data) {
				let res = JSON.parse(data);
			}
			this.showTable(this.page, this.limit, this.form.searchContent);
		},
		computed: {
			...mapGetters([
				'userInfo',
			]),
			// 获取 添加页面传递过来的数据
			getFormData() {
				return this.$route.params.formData;
			},
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
			margin-bottom: 0;
			.el-input{
				width: 220px;
			}
		}
	}
</style>