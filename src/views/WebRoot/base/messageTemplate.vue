<!--短信模板-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addSmsTemplateInfo1">
				<el-button type="primary" @click="addTable">创建新模板</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
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
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateSmsTemplateInfo1 && !scope.row.isEdit && scope.row.templateType=='品牌'">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.updateSmsTemplateInfo1 && scope.row.isEdit && scope.row.templateType=='品牌'">
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteSmsTemplateInfo1 && scope.row.templateType=='品牌'">
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
	import { selectTemplateData, addTemplateData, setTemplateData, deleteTemplateData } from '@/api/base/messageTemplate'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				roleBtn: {
					selectSmsTemplateInfo1: false,
					addSmsTemplateInfo1: false,
					updateSmsTemplateInfo1: false,
					deleteSmsTemplateInfo1: false
				},
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
			// 方法
			onSubmit() {
				this.showTable(this.page, this.limit);
			},
			// 分页
			handleCurrentChange(val) {
				//          console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			//查询表格数据
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
//						console.log(JSON.stringify(data)+"返回值");
						let result = [];
						if(data.data) {
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
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '业务规则短信模板查询',
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
					name: '业务规则短信模板修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				let that = this;
				this.tableLoading = true;
				// console.log(JSON.stringify(row));
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
					deleteTemplateData(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//	                    console.log(JSON.stringify(data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit);
								that.tableLoading = false;
							} else {
								that.$message.error(data.messageContent);
								that.showTable(that.page, that.limit);
								that.tableLoading = false;
							}
						})
						.catch((err) => {
//							console.log(err);
						});
				}).catch(() => {
					this.tableLoading = false;
				});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '业务规则短信模板新增',
					params: {
						pageType: '添加'
					}
				});
			},
		},
		created() {
			this.showTable(this.page, this.limit);
			this.roleBtn = permission(this.roleBtn);
		},
		computed: {
			//计算属性
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
		position: absolute;
		margin-left: rem(20px);
	}
</style>