<!-- 群发消息 - 群发消息 -->
<template>
	<el-container class="app-container">
		<el-header v-if="roleBtn.selectCustomizeMenuInfo1">
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item label="状态">
					<el-select v-model="form.status" placeholder="请选择状态" @change="handleChange">
						<el-option label="全部" value="全部"></el-option>
						<el-option label="已发送" value="已发送"></el-option>
						<el-option label="待发送" value="待发送"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table ref="tableData" :data="tableData" v-loading="tableLoading">
				<el-table-column prop="type" label="群发对象"></el-table-column>
				<el-table-column prop="lastExecuteDate" label="发送时间"></el-table-column>
				<el-table-column prop="sendNumber" label="发送人数"></el-table-column>
				<el-table-column prop="status" label="状态"></el-table-column>
				<el-table-column prop="action" label="操作">
					<template slot-scope="scope">
						<!-- 修改 -->
						<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateCustomizeMenuInfo && !scope.row.isEdit && scope.row.status!='已发送'" >
							<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
							<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)"/> -->
						</el-tooltip>
						<!-- 确认 -->
						<el-tooltip class="iconItem" content="确认" placement="top" v-if="roleBtn.updateCustomizeMenuInfo && scope.row.isEdit">
							<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
						</el-tooltip>
						<!-- 删除 -->
						<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.CustomizeMenuInfo">
							<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
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
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import { mapGetters } from 'vuex'
	import { groupMsgMasterShow, groupMsgMasterDelete } from '@/api/mobile/groupMsgMaster'
	export default {
		data() {
			return {
				roleBtn: {
					selectCustomizeMenuInfo1: false,
					updateCustomizeMenuInfo: false,
					CustomizeMenuInfo: false

				},
				// 数据
				form: {
					status: ''
				},

				tableData: [],

				tableLoading: false,
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 方法
			// <!-- 分页方法 -->
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.status);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.status);
			},
			showTable(start, limit, searchContent) {
				this.tableLoading = true;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"type":this.getType,
					"status": searchContent
				}
				groupMsgMasterShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						this.count = count;
//						console.log(data);
						this.tableData = msg;
						this.tableLoading = false;

					})
					.catch((err) => {
						// console.log(err)
						this.tableLoading = false;
					})
			},
			handleChange(str) {
				this.showTable(this.page, this.limit, this.form.status);
			},
			iconXiugai(index, row) { // 修改
				// console.log(index, row);
				let params = {
					index: 'first',
					data: {
						...row
					}
				}
				this.$emit('tabIndex', params);
			},
			iconShanchu(index, row) { // 删除群发消息
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.tableLoading=true;
					let params = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					groupMsgMasterDelete(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// count = data.count,
							this.tableLoading=false;
							// msg = data.data;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.showTable(this.page, this.limit, this.form.status);
							} else {
								this.$message.warning(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				});
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, this.form.status)
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getType() {
				return this.$route.params.type;
			},
			getPageData() {
				return this.$route.params.pageData;
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
		// margin-left: rem(20px);
	}
</style>