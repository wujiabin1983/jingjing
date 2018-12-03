<!--商户注册-->
<template>
	<el-container class="app-container">
		<el-header v-loading="statusLoading">
			<el-card v-if="roleBtn.addSellerInfo || roleBtn.disableSellerInfo || roleBtn.activeSellerInfo || roleBtn.deleteSellerInfo || roleBtn.selectSellerInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectSellerInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="handleRegister" v-if="roleBtn.addSellerInfo">注册</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="">
							<el-input v-model="form.roleInfo" placeholder="请输入商户名称或商户编码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch(page, limit, form.roleInfo)">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="nameCommerc" label="商户名称">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.nameCommerc" size="mini"></el-input>
							<span v-else>{{scope.row.nameCommerc}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="dateRegister" label="注册日期" width="100"></el-table-column>
					<el-table-column prop="indateStart" label="有效期起" width="100"></el-table-column>
					<el-table-column prop="indateEnd" label="有效期止" width="100"></el-table-column>
					<el-table-column prop="status" label="状态" width="60"></el-table-column>
					<el-table-column prop="industry" label="所属行业" ></el-table-column>
					<el-table-column prop="numCredit" label="企业信用证号码" width="155"></el-table-column>
					<el-table-column prop="numLicence" label="营业执照号码" width="155"></el-table-column>
					<el-table-column prop="action" label="操作" width="120">
						<template slot-scope="scope">
							<!-- 查看 -->
							<el-tooltip class="iconItem" content="查看" placement="top">
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 激活 -->
							<el-tooltip class="iconItem" content="激活" placement="top" v-if="roleBtn.activeSellerInfo && scope.row.status == '停用'">
								<icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 停用 -->
							<el-tooltip class="iconItem" content="停用" placement="top" v-if="roleBtn.disableSellerInfo && scope.row.status == '启用'">
								<icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateSellerInfo && !scope.row.isEdit">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 确认 -->
							<el-tooltip class="iconItem" content="确认" placement="top" v-if="roleBtn.updateSellerInfo && scope.row.isEdit">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 删除 -->
							<!--<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.deleteSellerInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>-->
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
	import { selectSellerInfo, addSellerInfo, updateSellerInfo, deleteSellerInfo, activeSellerInfo, inactiveSellerInfo } from '@/api/platform/commercRegister';
	// 获取vuex
	import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectSellerInfo: false,
					addSellerInfo: false,
					updateSellerInfo: false,
					activeSellerInfo: false,
					disableSellerInfo: false,
					deleteSellerInfo: false
				},
				// 搜索数据
				form: {
					roleInfo: ''
				},
				// 表格数据
				tableData: [],
				// 表格加载loading
				statusLoading: false,
				tableLoading: false,
				// 多选的数据
				multipleSelection: [],

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 方法
			// 搜索
			handleSearch(start, limit, searchContent) {
				this.showTable('', limit, searchContent);
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.roleInfo);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.roleInfo);
			},
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start, //可为空
					"limit": limit, //可为空
					searchContent: searchContent //可为空
				}
				this.tableLoading = true;
				selectSellerInfo(params)
					.then(function(res) {
//												console.log(res);
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						//						console.log(data);
						// if(data.returnCode == 0) {
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								codeCommerc: val.sellerId, // 商户编码
								nameCommerc: val.sellerMan, // 商户名称
								numCredit: val.estaCreditNum, // 企业信用证号码
								numLicence: val.businessNumber, // 营业执照号码
								industry:val.industry, // 所属行业
								dateRegister: val.registeDate, // 注册日期
								indateStart: val.validityDateBegin, // 有效期起
								indateEnd: val.validityDateEnd, // 有效期止
								status: val.status, // 状态
								...val
							});
						})
						that.count = data.count;
						that.tableData = result;
						that.tableLoading = false;
						// }else {
						//     that.$message(data.returnMsg);
						// }
					})
					.catch(function(err) {
//						 console.log(err);
					});
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(val);
			},
			// 注册按钮 添加
			handleRegister() {
				this.$router.push({
					name: '商户管理商户注册管理新增',
					params: {
						pageType: '注册'
					}
				});
			},
			// 注册按钮 - 操作
			handleAddSellerInfo(formData) {
				//				console.log(formData);
				this.tableLoading = true;
				addSellerInfo(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							this.$message.success(data.messageContent);
							this.showTable(this.page, this.limit, this.form.roleInfo);
						} else {
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 删除按钮 - 操作
			handleDeleteSellerInfo(formData) {
				let that = this;
				let ids = '';
				if(this.multipleSelection.length == 0) {
					this.$message.warning('请选择数据');
					return false;
				}
				this.multipleSelection.forEach((data, index) => {
					if(data.status != "启用") {
						this.$message.warning('请选择禁用状态的数据');
						return false;
					}
				})
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach((val, index) => {
						ids += val.id + ',';
					});
					let data = {
						"userId": this.userInfo.userCode,
						"params": ids
					}
					//					console.log(data);
					deleteSellerInfo(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit, this.form.roleInfo);
							} else {
								that.$message.warning(data.messageContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			},
			// 启用按钮 - 操作
			handleActiveSellerInfo(formData) {
				let that = this;
				let params = [];
				let selected = this.multipleSelection.filter((item) => {
					return item.status == '未启用';
				})
				//				console.log(selected);
				if(selected.length == 0) {
					this.$message.warning('请选择未启用的数据');
					return false;
				}
				if(selected.length != this.multipleSelection.length) {
					this.$message.warning('请您确认选择的数据全部为未启用状态');
					return false;
				}
				selected.forEach((val, index) => {
					params.push({
						id: val.id,
						version: val.version
					});
				});
				this.statusLoading = true;
				let data = {
					"userId": this.userInfo.userCode,
					"params": params
				}
				activeSellerInfo(data)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(data);
						if(data.messageType == 'SUCCESS') {
							that.statusLoading = false;
							that.$message.success(data.messageContent);
							that.showTable(this.page, this.limit, this.form.roleInfo);
						} else {
							that.statusLoading = false;
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						that.statusLoading = false;
						// console.log(err);
					});
			},
			// 停用按钮 - 操作
			handleInactiveSellerInfo(formData) {
				let that = this;
				let params = [];
				let selected = this.multipleSelection.filter((item) => {
					return item.status == '启用';
				})
				if(selected.length == 0) {
					this.$message.warning('请选择启用的数据');
					return false;
				}
				if(selected.length != this.multipleSelection.length) {
					this.$message.warning('请您确认选择的数据全部为启用状态');
					return false;
				}
				// console.log(selected);return false;
				selected.forEach((val, index) => {
					params.push({
						id: val.id,
						version: val.version
					});
				});
				that.statusLoading = true;
				let data = {
					"userId": this.userInfo.userCode,
					"params": params
				}
				// console.log(data);
				inactiveSellerInfo(data)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(data);
						if(data.messageType == 'SUCCESS') {
							that.statusLoading = false;
							that.$message.success(data.messageContent);
							that.showTable(this.page, this.limit, this.form.roleInfo);
						} else {
							that.statusLoading = false;
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						that.statusLoading = false;
						// console.log(err);
					});
			},
			// 功能图标 - 查看
			iconChakan(index, row) {
				let paramsData = {
					pageType: '查看',
					formData: JSON.stringify(row[index])
				}
				this.$router.push({
					name: '商户管理商户注册管理新增',
					params: paramsData
				});
			},
			// 功能图标 - 启用
			iconQiyong(index, row) {
				let that = this;
				this.tableLoading=true;
				this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						"params": [{
							"id": row[index].id,
							"version": row[index].version
						}]
					}
					//				console.log(data);
					activeSellerInfo(data)
						.then((res) => {
							//						console.log(res)
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading=false;
								that.showTable(that.page, that.limit, that.form.roleInfo);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading=false;
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 功能图标 - 停用
			iconTingzhi(index, row) {
				let that = this;
				this.tableLoading=true;
				this.$confirm('您确定要停用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						"params": [{
							"id": row[index].id,
							"version": row[index].version
						}]
					}
					//				console.log(data);
					inactiveSellerInfo(data)
						.then((res) => {
							//						console.log(res)
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.tableLoading=false;
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.form.roleInfo);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading=false;
							}
						})
						.catch((err) => {
							// console.log(err);
							that.tableLoading=false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 功能图标 - 修改
			iconXiugai(index, row) {
				// console.log(row);
				// row.isEdit = true;
				let paramsData = {
					pageType: '修改',
					formData: JSON.stringify(row)
				}
				this.$router.push({
					name: '商户管理商户注册管理新增',
					params: paramsData
				});
			},
			// 修改 - 功能
			handleUpdateSellerInfo(formData) {
				let that = this;
				this.tableLoading = true;
				//				console.log(JSON.stringify(formData) + "入参")
				updateSellerInfo(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data) + "出参")
						if(data.messageType == 'SUCCESS') {
							this.showTable(this.page, this.limit, this.form.roleInfo);
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 功能图标 - 确认
			iconQueren(index, row) {
				row.isEdit = false;
			},
			// 功能图标 - 删除
			iconShanchu(index, row) {
				if(row.status == "启用") {
					this.$message.warning('请选择禁用状态的数据');
					return false;
				}
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//					console.log(row.id);
					let data = {
						"userId": this.userInfo.userCode,
						"params": '' + row.id + ','
					}
					deleteSellerInfo(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(data);
							if(data.messageType == 'SUCCESS') {
				  				that.tableLoading = false;
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit, this.form.roleInfo);
							} else {
								that.$message.error(data.messageContent);
								that.tableLoading = false;
								that.showTable(this.page, this.limit, this.form.roleInfo);
							}
						})
						.catch((err) => {
				  				that.tableLoading = false;
							// console.log(err);
						});
				}).catch(() => {
	  				that.tableLoading = false;
				});
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			let that = this;
			// console.log(this.userInfo);
			let formData;
			let data;
			if(this.getPageType) {
				formData = JSON.parse(this.getFormData);
				data = {
					"userId": this.userInfo.userCode,
					...formData
				}
			}
			// console.log(data);
			if(this.getPageType == "注册") {
				this.handleAddSellerInfo(data);
			} else if(this.getPageType == '修改') {
				this.handleUpdateSellerInfo(data);
			}

			// 初始化表格数据
			that.showTable(this.page, this.limit, this.form.roleInfo);
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getFormData() {
				let formData = this.$route.params.formData;
				this.$route.params.formData = '';
				return formData;
			},
			getPageType() {
				let pageType = this.$route.params.pageType;
				this.$route.params.pageType = '';
				return pageType;
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
			.el-input{
				width: 220px;
			}
		}
	}
</style>