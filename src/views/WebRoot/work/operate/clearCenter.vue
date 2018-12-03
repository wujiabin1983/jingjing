<!--清算中心-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline">
					<el-form-item label="统计区间">
						<el-input v-model="form.brandName" placeholder="请输入会员姓名或会员ID"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="uploadUser" label="会员ID"></el-table-column>
					<el-table-column prop="uploadFiles" label="会员姓名"></el-table-column>
					<el-table-column prop="uploadTime" label="消费总金额"></el-table-column>
					<el-table-column prop="fileSize" label="消费赚取积分"></el-table-column>
					<el-table-column prop="lineNumber" label="是否使用"></el-table-column>
					<el-table-column prop="processStatus" label="使用门店"></el-table-column>
					<el-table-column prop="processDate" label="使用积分"></el-table-column>
					<el-table-column prop="processDate" label="积分兑换"></el-table-column>
					<el-table-column prop="processDate" label="剩余积分"></el-table-column>
				</el-table>
				<el-footer v-if="count != 0">
					<el-pagination class="pagination" layout="prev, pager, next, jumper" :total="40"></el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { shopImportInfo } from '@/api/base/importInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					selectDate: '' // 品牌名称
				},
				// 表格数据
				tableData: [{
					"uploadUser": "",
					"uploadFiles": "",
					"uploadTime": "",
					"fileSize": "",
					"lineNumber": "",
					"processStatus": "",
					"processDate": "",
					"returnMsg": ""
				}],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
				var param = {
					processDateBegin: this.form.selectDate[0],
					processDateEnd: this.form.selectDate[1]
				}
				this.showTable('', '', param);
				// console.log(JSON.stringify(param) + "!");
			},
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					start: start,
					limit: limit,
					searchContent: searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectImportInfo(params)
					.then(function(res) {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							let result = [];
							data.messageContent.forEach((val, index) => {
								result.push({
									isEdit: false,

									...val
								});
							})
							that.tableData = result;
							that.tableLoading = false;
						} else {
							that.$message.error(data.messageContent);
							that.tableLoading = false;
						}
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
					name: '数据导入员工信息查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 导入
			upload() {

			},
			//下载模板
			download() {

			},
		},
		created() {
			this.showTable('', '', '');
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-header{
	}
	.el-form-item--small.el-form-item{
		margin: 0;
	}
	.el-form {
		margin-left: rem(20px);
	}
</style>