// 查看邀请记录
<template>
	<el-container class="app-container">
		<el-header>
			<!-- 查询功能 -->
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item label="" class="floatLeft">
					<el-button @click="handleBack">返回</el-button>
				</el-form-item>
				<div class="floatRight">
					<el-form-item label="">
						<el-input v-model="form.searchContent" placeholder="请输入邀请人姓名和手机号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">查询</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-header>
		<el-main>
			<el-card>
				<!-- 表格 -->
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<!--<el-table-column type="selection" width="50" label="选择"></el-table-column><--></-->
					<el-table-column prop="userName" label="邀请人"></el-table-column>
					<el-table-column prop="storeName" label="所属门店"></el-table-column>
					<el-table-column prop="mobile" label="手机号码"></el-table-column>
					<el-table-column prop="inviteCount" label="邀请人数"></el-table-column>
					<el-table-column prop="count" label="奖励次数"></el-table-column>
					<el-table-column prop="desc" label="奖励内容"></el-table-column>
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
	import { inviteGiftInfoShow } from '@/api/mobile/inviteGift'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					searchContent: ''
				},
				// table数据
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
			handleBack(){
				this.$router.push({
					name: '邀请有礼'
				});
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form.searchContent);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchContent);
			},
			// 查询
			handleSearch() {

			},
			// 显示表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: searchContent,
					activityId:JSON.parse(this.getFormData).activityId
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				inviteGiftInfoShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							// code = data.returnCode,
							// msg = data.returnMsg;
							count = data.count,
							msg = data.data;
						this.count = count;
//						console.log(JSON.stringify(msg))
						if(count >= 0) {
							let result = [];
							msg.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							this.tableData = result;
							this.tableLoading = false;
						} else {
							this.$message.error(msg);
							this.tableLoading = false;
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			}

		},
		created() {
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, this.form.searchContent);
		},
		computed: {
			...mapGetters([
				'userInfo',
			]),
			getFormData() {
				return this.$route.params.formData;
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
		width: 100%;
		margin: 0;
		.el-form-item {
			margin-bottom: 0;
			.el-input{
				width:220px
			}
		}
	}
</style>