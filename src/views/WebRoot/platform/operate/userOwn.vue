<!--平台用户组所属用户-->
<template>
	<div class="app-container">
		<el-header>
			<el-button @click="handleBack" class="mrgBottom10">返回</el-button>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column prop="realName" label="用户真实姓名"></el-table-column>
					<el-table-column prop="userName" label="用户登录名"></el-table-column>
					<el-table-column prop="departmentName" label="部门名称"></el-table-column>
					<el-table-column prop="userGroupName" label="用户组名称"></el-table-column>
					<el-table-column prop="userRoleName" label="角色名称"></el-table-column>
					<el-table-column prop="mobile" label="手机号"></el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
					<el-table-column prop="remarks" label="备注"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer  v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-header>
	</div>
</template>
<script>
	import { selectPlatGroupUser } from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableData: [],
				multipleSelection: [],
				tableLoading: false,
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			handleBack() {
				this.$router.push({
					name: '用户组'
				});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			showTable(page, limit) {
				let params = {
					userId: this.userInfo.userCode,
					page: page,
					limit: limit,
					"userGroupId": JSON.parse(this.getFormData).userGroupId
				}
				let that = this;
				//	    	console.log(params)
				selectPlatGroupUser(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//	                console.log(JSON.stringify(data));
						let result = []
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						});
						that.tableData = result;
						that.count = data.count;
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			}
		},
		created() {
			//  	console.log(this.getFormData);
			this.showTable(this.page, this.limit);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			// 
			getFormData() {
				return this.$route.params.formData;
			}
		}
	}
</script>
<style rel="stylesheet" lang="scss" scoped>
	.el-card {
		width: 100%;
	}
</style>