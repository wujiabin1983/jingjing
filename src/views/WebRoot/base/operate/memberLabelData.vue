<!--会员积分-导入信息-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack">返回</el-button>
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="form.searchContent" placeholder="请输入线下卡号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="lineCard" label="线下卡号">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.lineCard"></el-input>
							<span v-else>{{scope.row.lineCard}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="inavailableIntegraltegralValue" label="可用积分">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.availableIntegral"></el-input>
							<span v-else>{{scope.row.availableIntegral}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="validityDate" label="有效期"></el-table-column>
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
	import { memberLabelDetail } from '@/api/base/memberLabel'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				form: {
					searchContent: ''
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
			// 分页
			handleCurrentChange(val) {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				//	            console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, res);
			},
			handleSizeChange(val) {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				this.limit = val;
				this.showTable(this.page, this.limit, res);
			},
			onSubmit() {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				// 钩子函数 -- 初始化
				this.showTable('', this.limit, res);
			},
			// 方法
			showTable(start, limit, res) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: this.form.searchContent,
					masterId: res.id
				}
				// 使表格加载
				//				console.log(params)
				this.tableLoading = true;
				// 查询接口
				memberLabelDetail(params)
					.then(function(res) {
						//						console.log(res);
						let data = JSON.parse(Base64.decode(res.data));
//												console.log(JSON.stringify(data)+"返回");
						let result = [];
						if(!data.messageType) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count=data.count;
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
						// console.log(err);
						that.tableLoading = false;
					});
			},
			//取消
			handleBack() {
				this.$router.push({
					name: '会员积分'
				});
			},
		},
		created() {
			let res = '';
			if(this.getFormData) {
				res = JSON.parse(this.getFormData);
			}
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, res);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
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
		float: right;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-form-item--small.el-form-item {
		margin-bottom: 0px;
	}
	
	.el-button {
		float: left;
		margin: 0 0 10px 0;
	}
</style>