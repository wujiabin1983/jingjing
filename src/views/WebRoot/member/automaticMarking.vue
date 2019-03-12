<!--会员信息-自动打标签 -->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addAutomaticMarkingInfo">
				<el-button type="primary" @click="addMarking">新建标签</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="labelName" label="标签名称"></el-table-column>
					<el-table-column prop="labelValue" label="标签值"></el-table-column>
					<el-table-column prop="menNumber" label="会员人数"></el-table-column>
					<el-table-column prop="activityDate" width="180" label="统计周期">
						<template slot-scope="scope">
							{{scope.row.statisticsBegin+" ~ "+scope.row.statisticsEnd}}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
					<el-table-column prop="updateDate" label="更新时间"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<!-- 修改 -->
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateAutomaticMarkingInfo&&scope.row.status=='准备中'">
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<!-- 删除 -->
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteAutomaticMarkingInfo">
								<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<!-- 启用 -->
							<el-tooltip class="item" content="启用" placement="top" v-if="scope.row.status=='停止'&&roleBtn.enableAutomaticMarkingInfo">
								<i class="iconfont icon-forbidden" @click.prevent="iconBegin(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconBegin(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<!-- 停止 -->
							<el-tooltip class="item" content="停止" placement="top" v-if="scope.row.status=='启用'||scope.row.status=='准备中'&&roleBtn.disableAutomaticMarkingInfo">
								<i class="iconfont icon-shezhiqiyong" @click.prevent="iconStop(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconStop(scope.$index, scope.row)" /> -->
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
	import { selectAutomaticMarking, deleteAutomaticMarking, stopAutomaticMarking } from '@/api/member/automaticMarking'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					activiteType: '',
					activiteName: '',
					activiteDate: [] // 日期区间
				},
				// 权限
				roleBtn: {
					addAutomaticMarkingInfo:false,
					updateAutomaticMarkingInfo:false,
					deleteAutomaticMarkingInfo:false,
					disableAutomaticMarkingInfo:false,
					enableAutomaticMarkingInfo:false
				},
				// 表格数据
				tableData: [],
				//				{
				//						activityName:"1",
				//						activityType:"1",
				//						presetGroup:"1",
				//						activityDate:"1"
				//					}
				// 表格多选
				multipleSelection: [],
				userCode: '',
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
			// 方法
			onSubmit() {
				this.showTable(this.page, this.limit);
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val+'当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			showTable(start, limit) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(JSON.stringify(params)+"入参")
				selectAutomaticMarking(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						// console.log(JSON.stringify(data)+"出参")
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
						// console.log(JSON.stringify(err));
						that.tableLoading = false;
					});
			},
			iconShanchu(index, row) {
				let that = this;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						userId: this.userInfo.userCode,
						id: row.id
					}
					// 使表格加载
					this.tableLoading = true;
					// 查询接口
					deleteAutomaticMarking(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							let result = [];
							if(data.messageType != 'SUCCESS') {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							} else {
								that.$message({
									message: data.messageContent,
									type: 'success'
								});
							}
							that.showTable(that.page, that.limit);
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(JSON.stringify(err));
							that.tableLoading = false;
						});
				}).catch(() => {});
			},
			//新增标签
			addMarking() {
				this.$router.push({
					name: '会员信息自动打标签新增',
					params: {
						pageType: '添加'
					}
				});
			},
			//停止
			iconStop(index, row) {
				let that = this;
				this.$confirm('您确定要停止吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						userId: this.userInfo.userCode,
						flag: 0,
						id: row.id
					}
					let that = this;
					that.tableLoading = true;
					stopAutomaticMarking(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							let result = [];
//							console.log(JSON.stringify(data)+"出参")
							if(data.messageType != 'SUCCESS') {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							} else {
								that.$message({
									message: data.messageContent,
									type: 'success'
								});
								that.showTable(that.page, that.limit);
							}
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(JSON.stringify(err));
							that.tableLoading = false;
						});
				})
			},
			//启用
			iconBegin(index, row) {
				let that = this;
				this.$confirm('您确定要启用吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						userId: this.userInfo.userCode,
						flag: 1,
						id: row.id
					}
					let that = this;
					that.tableLoading = true;
					stopAutomaticMarking(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							let result = [];
//											console.log(JSON.stringify(data)+"出参")
							if(data.messageType != 'SUCCESS') {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							} else {
								that.$message({
									message: data.messageContent,
									type: 'success'
								});
								that.showTable(that.page, that.limit);
							}
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(JSON.stringify(err));
							that.tableLoading = false;
						});
				})
			},
			//修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '会员信息自动打标签修改',
					params: {
						formData: data,
						pageType: '修改'
					}
				});
			}
		},
		created() {
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: inline-block;
		margin-left: rem(20px);
	}
	
	.el-form-item {
		margin: 0;
		margin-right: 10px;
	}
</style>