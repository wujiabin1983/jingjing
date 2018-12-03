<!--门店送券-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-button type="primary" @click="shoppingGuide">新建门店送券规则</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="giveJson" label="所属券库">
						<template slot-scope="scope">
							{{scope.row.giveJson.coupName}}
						</template>
					</el-table-column>
					<el-table-column prop="useObject" label="适用渠道">
						<template slot-scope="scope">
							{{scope.row.useObject.nameArray}}
						</template>
					</el-table-column>
					<el-table-column prop="validityDate" label="券有效期">
						<template slot-scope="scope">
							<div v-if="scope.row.validityDate.activityDateBegin">
								{{scope.row.validityDate.activityDateBegin+" ~ "+scope.row.validityDate.activityDateEnd}}
							</div>
							<div v-else>
								{{"自领取之日起"+scope.row.validityDate+"天内有效"}}
							</div>

						</template>
					</el-table-column>
					<el-table-column prop="maxNum" label="月限制发送量"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->

							<!-- 修改 -->
							<el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 删除 -->
							<el-tooltip class="item" content="删除" placement="top">
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
	import { selectstoreVoucherData, deleteData } from '@/api/tool/storeVoucher'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 表格数据
				tableData: [{
					giveJson: '',
					useObject: '',
					validityDate: '',
					cmaxNum: ''
				}],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				// 活动分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
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
			// 活动列表分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			//新建门店送券规则
			shoppingGuide() {
				this.$router.push({
					name: '门店送券新增',
					params: {
						pageType: '添加'
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '门店送券修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
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
				selectstoreVoucherData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(JSON.stringify(data));
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
			//      // 图标 - 删除
			iconShanchu(index, row) {
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					// console.log(JSON.stringify(param)+"入参")
					deleteData(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//    console.log(JSON.stringify(data)+"返回值");
							if(data.messageType == 'SUCCESS') {
								that.tableLoading = false;
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit, this.form);
							} else {
								that.tableLoading = false;
								that.$message.error(data.messageContent);
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
		},
		created() {
			this.showTable(this.page, this.limit);
			// 钩子函数 -- 初始化
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
		display: unset;
		.el-form-item {
			margin-bottom: 0;
		}
	}
</style>