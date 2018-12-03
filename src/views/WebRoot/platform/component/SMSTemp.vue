// 模板管理 - 短信模板 - 无用
<template>
	<el-container>
		<el-header>
			<el-card>
				<el-button type="primary" @click="addTable">创建新模版</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange" v-loading="tableLoading">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="templateId" label="模板编号"></el-table-column>
					<el-table-column prop="templateName" label="模板名称"></el-table-column>
					<el-table-column prop="createdBy" label="创建人"></el-table-column>
					<el-table-column prop="createdOn" label="创建时间"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top">
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
	import { selectTemplateData, addTemplateData, setTemplateData, deleteTemplateData } from '@/api/platform/SMSTemp'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 表格数据
				tableData: [],
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
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 方法
			onSubmit() {
				this.showTable(this.page, this.limit);
				//          console.log(this.form.activityType);
				//          console.log(this.form.templateName);
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
				selectTemplateData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(data)
						let count = data.count;
						let msg = data.data;
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.count = count;
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
					name: '模板管理短信模板查询',
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
					name: '模板管理短信模板修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"params": row.id
					}
					//	            console.log(param)
					var that = this;
					this.tableLoading = true;
					deleteTemplateData(param)
						.then((res) => {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit);
							} else {
								that.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
					that.tableLoading = false;
				}).catch(() => {});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '模板管理短信模板新增',
					params: {
						pageType: '添加'
					}
				});
			},
		},
		created() {
			this.showTable(this.page, this.limit);
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
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
		position: absolute;
		margin-left: rem(20px);
	}
</style>