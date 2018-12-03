// 平台管理 - 模板管理 - 会员分组模板 - 无用  看groupInfoHandle.vue
<template>
	<el-container>
		<el-header>
			<el-card>
				<el-button type="primary" @click="addTable">新建分组</el-button>
				<el-form :inline="true" :model="form" class="demo-form-inline">
					<el-form-item>
						<el-input v-model="form.groupName" placeholder="请输入分组名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange" v-loading="tableLoading">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="groupName" label="分组名称"></el-table-column>
					<el-table-column prop="createdBy" label="创建人"></el-table-column>
					<el-table-column prop="createdOn" label="创建日期"></el-table-column>
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
							<el-tooltip class="item" content="确认" placement="top" v-else>
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
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
	/**
	 * selectInfo 分页查询会员分组模板信息
	 * addInfo 新增会员分组模板信息
	 * editInfo 修改会员分组模板信息
	 * deleteInfo 删除会员分组模板信息
	 */
	import { selectMemberGroupInfo, addMemberGroupInfo, editMemberGroupInfo, deleteMemberGroupInfo } from '@/api/platform/groupTemp'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					groupName: '' // 分组名称
				},
				// 表格数据
				tableData: [{
					groupName: '', // 分组名称
					createdBy: '', // 创建人
					createdOn: '' // 创建日期
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
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.groupName);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.groupName);
			},
			// 方法
			onSubmit() {
				this.showTable(this.page, this.limit, this.form.groupName);
			},
			showTable(page, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					"page": page,
					"limit": limit,
					"groupName": searchContent // (可以为空)
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				//          console.log(JSON.stringify(params)+"入参")
				selectMemberGroupInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data)+"返回值")
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
				this.$router.push({
					name: '模板管理会员分组模板查询',
					params: {
						pageType: '查看',
						id: row.id,
						version: row.version
					}

				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				this.$router.push({
					name: '模板管理会员分组模板修改',
					params: {
						pageType: '修改',
						id: row.id,
						version: row.version
					}
				});
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				//          console.log(row);
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"id": row.id,
						"groupName": row.groupName
					}
					//          console.log(params)
					deleteMemberGroupInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							let code = data.messageType,
								msg = data.messageContent;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.showTable(this.page, this.limit, this.form.groupName);
							} else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err)
						})
				}).catch(() => {});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '模板管理会员分组模板新增',
					params: {
						pageType: '添加'
					}
				});
			},
		},
		created() {
			this.showTable(this.page, this.limit, this.form.groupName); // 钩子函数 -- 初始化
			if(this.getPageType == '添加') {
				this.$emit('activeNav', 3);
				let data = JSON.parse(this.getFormData);
				let params = {
					"userId": this.userInfo.userCode,
					"memGroupTemp": data
				}
				// console.log(params);return false;
			}
			if(this.getPageType == '修改') {
				let data = JSON.parse(this.getFormData);
				let params = {
					"userId": this.userInfo.userCode,
					"memGroupTemp": data
				}
				// console.log(params);return false;
				editMemberGroupInfo(params)
					.then((res) => {
						let data = res.data,
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
						this.$message.error(msg);
					})
			}
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				let pageType = this.$route.params.pageType;
				this.$route.params.pageType = '';
				return pageType;
			},
			getFormData() {
				let formData = this.$route.params.formData;
				this.$route.params.formData = '';
				return formData;
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
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
</style>