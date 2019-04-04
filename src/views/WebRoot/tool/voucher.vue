<!--积分兑券-->
<template>
	<el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="积分兑换" name="first">
				<el-header>
					<el-card>
						<el-form :inline="true" :model="form" class="demo-form-inline">
							<el-form-item class="floatLeft">
								<el-button type="primary" @click="shoppingGuide" v-if="roleBtn.addInteExcConfigInfo">新建积分兑换规则</el-button>
							</el-form-item>
							<div class="floatRight">
								<el-form-item label="状态">
									<el-select v-model="form.status" clearable placeholder="请选择状态">
										<el-option label="未提交" value="未提交"></el-option>
										<el-option label="未审核" value="未审核"></el-option>
										<el-option label="已驳回" value="已驳回"></el-option>
										<el-option label="执行中" value="执行中"></el-option>
										<el-option label="已停止" value="已停止"></el-option>
										<el-option label="已结束" value="已结束"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-input v-model="form.exchangeName" placeholder="请输入兑换名称"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="onSubmit">查询</el-button>
									<el-button type="primary" @click="onReset">重置</el-button>
								</el-form-item>
							</div>
						</el-form>
					</el-card>
				</el-header>
				<el-card>
					<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
                    	<el-table-column prop="exchangeName" label="兑换名称"></el-table-column>
						<el-table-column prop="integralValue" width="80" label="兑换积分"></el-table-column>
						<el-table-column prop="restrictNum" width="110" label="每人限兑个数"></el-table-column>
						<el-table-column prop="exchangeDate.exchangeDateBegin" width="110" label="兑换开始时间"></el-table-column>
						<el-table-column prop="exchangeDate.exchangeDateEnd" width="110" label="兑换结束时间"></el-table-column>
						<el-table-column prop="activityId" width="150" label="券库编号"></el-table-column>
						<el-table-column prop="grantNum" width="110" label="券可兑换总数"></el-table-column>
						<el-table-column prop="exchangeNum" label="已兑换个数"></el-table-column>
						<el-table-column prop="status" label="状态"></el-table-column>
						<el-table-column prop="action" label="操作" >
							<template slot-scope="scope">
								<!-- 功能图标 -->
								<!-- 查看 -->
								<el-tooltip class="item" content="查看" placement="top">
									<i class="iconfont icon-view" @click.prevent="iconShow(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconShow(scope.$index, scope.row)" /> -->
								</el-tooltip>
								<!-- 启用 -->
								<el-tooltip class="item" content="启用" placement="top" v-if="scope.row.status == '已停止'&&roleBtn.enableInteExcConfigInfo">
									<i class="iconfont icon-shezhiqiyong" @click.prevent="iconBegin(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconBegin(scope.$index, scope.row)" /> -->
								</el-tooltip>
								<!-- 停止 -->
								<el-tooltip class="item" content="停止 " placement="top" v-if="scope.row.status == '执行中'&&roleBtn.disableInteExcConfigInfo">
									<i class="iconfont icon-forbidden" @click.prevent="iconStop(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconStop(scope.$index, scope.row)" /> -->
								</el-tooltip>
								<!-- 修改 -->
								<el-tooltip class="item" content="修改" placement="top" v-if="(scope.row.status == '未提交'||scope.row.status == '已驳回') && roleBtn.updateInteExcConfigInfo">
									<i class="iconfont icon-edit" @click.prevent="iconEdit(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconEdit(scope.$index, scope.row)" /> -->
								</el-tooltip>
								<!-- 复制 -->
								<el-tooltip class="item" content="复制" placement="top" v-if="roleBtn.copyExcConfigInfo">
									<i class="iconfont icon-icon_fuzhi" @click.prevent="iconCopyTemplate(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="copy" id="icon-copy" @click.native.prevent="iconCopyTemplate(scope.$index, scope.row)" /> -->
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="审核列表" name="second">
				<el-card>
					<el-table ref="tableDataTab" v-loading="this.tableLoading" :data="tableDataTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="exchangeName" label="兑换名称"></el-table-column>
						<el-table-column prop="integralValue" label="兑换积分"></el-table-column>
						<el-table-column prop="restrictNum" width="110" label="每人限兑个数"></el-table-column>
						<el-table-column prop="exchangeDate.exchangeDateBegin" width="110" label="兑换开始时间"></el-table-column>
						<el-table-column prop="exchangeDate.exchangeDateEnd" width="110" label="兑换结束时间"></el-table-column>
						<el-table-column prop="activityId" width="150" label="券库编号"></el-table-column>
						<el-table-column prop="grantNum" width="110" label="券可兑换总数"></el-table-column>
						<el-table-column prop="exchangeNum" width="110" label="已兑换个数"></el-table-column>
						<el-table-column prop="status" label="状态"></el-table-column>
						<el-table-column prop="action" label="操作">
							<template slot-scope="scope">
								<!-- 功能图标 -->
								<!-- 查看详情 -->
								<el-tooltip class="item" content="查看详情" placement="top">
									<i class="iconfont icon-view" @click.prevent="iconInfo(scope.$index,  scope.row)" ></i>
									<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index,  scope.row)" /> -->
								</el-tooltip>
								<!-- 通过 -->
								<el-tooltip class="item" content="通过" placement="top">
									<i class="iconfont icon-shenhetongguo" @click.prevent="iconAudioYes(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="audioYes" id="icon-audioYes" @click.native.prevent="iconAudioYes(scope.$index, scope.row)" /> -->
								</el-tooltip>
								<!-- 驳回 -->
								<el-tooltip class="item" content="驳回" placement="top">
									<i class="iconfont icon-shenhebutongguo" @click.prevent="iconAudioNo(scope.$index, scope.row)" ></i>
									<!-- <icon-svg icon-class="audioNo" id="icon-audioNo" @click.native.prevent="iconAudioNo(scope.$index, scope.row)" /> -->
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limitTab" :total="countTab" @size-change="handleSizeChangeTab" @current-change="handleCurrentChangeTab">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
		</el-tabs>
		<el-dialog title="驳回" :visible.sync="handleStoreDialog">
			<el-form :model="formAudio" ref="formName" :rules="rules" class="width80">
				<el-form-item label="驳回理由" prop="reasonForRejection" :label-width="formLabelWidth">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入驳回理由" v-model="formAudio.reasonForRejection">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleStoreDialog = false">取 消</el-button>
				<el-button type="primary" @click="addLabelFn">确 定</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>
<script>
	import { selectVoucherData, selectAudioData, aduioVoucherStop, aduioVoucherBegin, noVoucherData, yesVoucherData, deleteData } from '@/api/tool/voucher'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				formAudio: {
					reasonForRejection: '', //驳回理由
				},
				// 权限
				roleBtn: {
					"addInteExcConfigInfo": false,
					"updateInteExcConfigInfo":false,
					"enableInteExcConfigInfo": false,
					"disableInteExcConfigInfo": false,
					"copyExcConfigInfo": false
				},
				handleStoreDialog: false, //驳回弹窗
				activeName: 'first',
				formLabelWidth: '120px',
				selectData: {},
				// 搜索数据
				form: {
					status: '', //状态
					exchangeName: '' // 兑换名称
				},
				// 表格数据
				tableData: [],
				// 表格数据
				tableDataTab: [],
				// 表格多选
				multipleSelection: [],
				multipleSelectionTab: [],
				// 表格是否为加载状态
				tableLoading: false,
				// 活动分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页

				rules: {
					reasonForRejection: [{
							required: true,
							message: '请输入驳回理由',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					]
				},
				// 审核分页
				pageTab: 0, // 当前页
				countTab: 0, // 总条数
				limitTab: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			//tab切换
			handleClick(tab, event) {
				this.showTableTab(this.pageTab, this.limitTab);
			},
			// 活动列表表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 活动列表分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			// 审核列表分页
			handleCurrentChangeTab(val) {
				this.page = val;
				this.showTableTab(val, this.limit);
			},
	        handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit,this.formTab);
			},
			handleSizeChangeTab(val) {
				this.limitTab = val;
				this.showTableTab(this.pageTab, this.limitTab);
			},
			// 活动列表查询按钮
			onSubmit() {
				this.showTable('', this.limit, this.form);
			},
			onReset(){
				this.form={
					status: '', //状态
					exchangeName: '' // 兑换名称
				};
			},
			// 审核列表查询按钮
			onSubmitTab() {
				this.showTable('', this.limitTab);
			},
			//活动列表查询方法
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					status: searchContent.status,
					exchangeName: searchContent.exchangeName
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(params)
				selectVoucherData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						//              	console.log(JSON.stringify(data));
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						} else if(data.messageType != 'SUCCESS') {
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
			//审核列表查询方法
			showTableTab(start, limit, searchContent) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectAudioData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(JSON.stringify(data)+"审核列表");
						let result = [];
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.countTab = data.count;
							that.tableDataTab = result;
						} else if(data.messageType != 'SUCCESS') {
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
			// 活动列表图标 - 修改
			iconEdit(index, row) {
				var that = this;
				that.$router.push({
					name: '积分兑券 - 修改',
					params: {
						pageType: '修改',
						formData: JSON.stringify(row)
					}
				});
			},
			iconCopyTemplate(index, row) {
				var that = this;
				that.$router.push({
					name: '积分商城积分兑券复制',
					params: {
						pageType: '复制',
						formData: JSON.stringify(row)
					}
				});
			},
			iconEdit(index, row) {
				var that = this;
				that.$router.push({
					name: '积分商城积分兑券修改',
					params: {
						pageType: '修改',
						formData: JSON.stringify(row)
					}
				});
			},
			// 活动列表图标 - 开启
			iconBegin(index, row) {
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: this.userInfo.userCode,
						id: row.id,
						version: row.version
					};
					aduioVoucherBegin(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							// console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 活动列表图标 - 停止
			iconStop(index, row) {
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要停用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: this.userInfo.userCode,
						id: row.id,
						version: row.version
					};
					// console.log(params)
					aduioVoucherStop(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							// console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 活动列表图标 - 删除
			iconDelete(index, row) {
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: this.userInfo.userCode,
						id: row.id
					};
					// console.log(params)
					deleteData(params)
						.then(function(res) {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 积分兑换列表图标 - 查看详情
			iconShow(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '积分商城积分兑券查询',
					params: {
						pageTypes: '积分兑换',
						pageType: '查看',
						formData: data
					}
				});
			},
			// 审核列表图标 - 查看详情
			iconInfo(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '积分商城积分兑券查询',
					params: {
						pageTypes: '审核',
						pageType: '查看',
						formData: data
					}
				});
			},
			// 审核列表图标 - 通过
			iconAudioYes(index, row) {
				let that = this;
				that.tableLoading = true;
				this.$confirm('您确定要审核通过这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: this.userInfo.userCode,
						version: row.version,
						id: row.id,
						status: '待执行'
					};
					// console.log(params)
					yesVoucherData(params)
						.then(function(res) {
							//                  console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
								that.tableLoading = false;
							} else {
								that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
								that.$message.warning(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			//审核列表图标 - 驳回
			iconAudioNo(index, row) {
				let that = this;
				that.tableLoading = true;
				this.$confirm('您确定要审核通过这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: this.userInfo.userCode,
						id: row.id,
						version: row.version,
						status: '驳回'
					};
					// console.log(JSON.stringify(params))
					noVoucherData(params)
						.then(function(res) {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
								that.tableLoading = false;
							} else {
								that.$message.warning(data.messageContent);
								that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 审核列表图标 - 驳回
			addLabelFn(index, row) {
				//       	this.selectData=this.tableDataTab[index];
				//          this.handleStoreDialog=true;
			},
			// 新建活动
			shoppingGuide() {
				this.$router.push({
					name: '积分商城积分兑券新增',
					params: {
						pageType: '添加'
					}
				});
			},
			// 模板创建活动
			templateCreatActivity() {
				this.$router.push({
					name: '活动模板'
				});
			},
		},
		created() {
			console.log(this);
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化.
			if(this.getPageType){
				if(this.getPageType=="审核"){
					this.activeName= 'second';
					this.showTableTab(this.pageTab, this.limitTab);
				}else{
					this.activeName= 'first';
				}
			}
			// 权限
			this.roleBtn = permission(this.roleBtn);
//			console.log(JSON.stringify(this.roleBtn))
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-form--inline .el-form-item {
		margin-bottom: 0px;
	}
	.form .el-form--inline .el-form-item {
		margin-bottom: 18px;
	}
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
		}
	}
	.width80{
		width: 80%;
	}
</style>