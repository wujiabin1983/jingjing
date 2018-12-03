 <!--平台管理- 模板管理 - 预置活动模板-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addActiveTemplateInfo || roleBtn.selectActiveTemplateInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectActiveTemplateInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="addTable" v-if="roleBtn.addActiveTemplateInfo">新建模板</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="活动类型">
							<el-select v-model="form.activityType" placeholder="请选择活动类型">
								<el-option label="会员权益类" value="会员权益类"></el-option>
								<el-option label="生命周期类" value="生命周期类"></el-option>
								<el-option label="消费激励类" value="消费激励类"></el-option>
								<el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
								<el-option label="其他" value="其他"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-input v-model="form.templateName" placeholder="请输入模板名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange" v-loading="tableLoading">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="templateName" label="模板名称"></el-table-column>
					<el-table-column prop="activityType" label="活动类型"></el-table-column>
					<el-table-column prop="templateDesc" label="模板简介"></el-table-column>
					<el-table-column prop="createdBy" label="创建人"></el-table-column>
					<el-table-column prop="createdOn" label="创建日期"></el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateActiveTemplateInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.updateActiveTemplateInfo && scope.row.isEdit">
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteActiveTemplateInfo">
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
	import { selectTemplateData, selectTemplateInfo, deleteData } from '@/api/member/activeTemplate'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectActiveTemplateInfo: false,
					addActiveTemplateInfo: false,
					updateActiveTemplateInfo: false,
					deleteActiveTemplateInfo: false
				},
				// 搜索数据
				form: {
					activityType: '', // 活动类型
					templateName: '' // 模板名称
				},
				// 表格数据
				tableData: [{
					templateName: '', // 模板名称
					activiteType: '', // 活动类型
					templateDesc: '', // 模板简介
					createdBy: '', // 创建人
					createdOn: '', // 创建日期
					status: '' // 状态
				}],
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
			//重置
			onReset() {
				this.form = {
					activityType: '', // 活动类型
					templateName: '' // 模板名称
				};
			},
			// 表格选择数据 - 多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val; // 获取当前页 activiteType templateName
				this.showTable(this.page, this.limit, this.form);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form);
				//          console.log(this.form.activiteType);
				//          console.log(this.form.templateName);
			},
			showTable(page, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					"page": page,
					"limit": limit,
					"tempType": "",
					"activityType": this.form.activityType, // (可以为空)
					"templateName": this.form.templateName // (可以为空)
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				//        console.log(JSON.stringify(params));
				selectTemplateData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						//              	console.log(JSON.stringify(data)+"模板");
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						}else if(data.messageType != 'SUCCESS'){
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
				var that = this;
				var params = {
					userId: this.userInfo.userCode,
					id: row.id
				};
				selectTemplateInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.messageType == 'SUCCESS') {
							that.$router.push({
								name: '模板管理预置活动模板查询',
								params: {
									pageType: '查看',
									flag: '平台',
									formData: JSON.stringify(data.messageContent)
								}
							});
						} else {
							//						console.log(JSON.stringify(data.returnMsg))
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
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				var that = this;
				var params = {
					userId: this.userInfo.userCode,
					id: row.id
				};
				selectTemplateInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.messageType == 'SUCCESS') {
							that.$router.push({
								name: '模板管理预置活动模板查询',
								params: {
									pageType: '修改',
									flag: '平台',
									formData: JSON.stringify(data.messageContent)
								}
							});
						} else {
							//						console.log(JSON.stringify(data.returnMsg))
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
			// 图标 - 确认
			iconQueren(index, row) {

			},
			// 图标 - 删除
			iconShanchu(index, row) {
				//          console.log(index);
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: this.userInfo.userCode,
						id: row.id
					};
					this.tableLoading = true;
					let that = this;
					//          console.log(params)
					deleteData(params)
						.then(function(res) {
							//                  console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.error(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}).catch(() => {});
			},
			// 添加表格数据
			addTable() {
				// alert(1);
				this.$router.push({
					name: '模板管理预置活动模板新增',
					params: {
						flag: '平台',
						pageType: '添加'
					}
				});
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化
			sessionStorage.removeItem("dataOne");
			sessionStorage.removeItem("dataTwo");
			sessionStorage.removeItem("dataThree");
		},
		computed: {
			// 计算属性
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
		}
	}
</style>