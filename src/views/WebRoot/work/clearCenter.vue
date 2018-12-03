<!--清算中心-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline">
					<el-form-item label="统计区间">
						<el-date-picker :editable="false" v-model="form.selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
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
					<el-table-column prop="uploadUser" label="门店编码"></el-table-column>
					<el-table-column prop="uploadFiles" label="门店名称"></el-table-column>
					<el-table-column prop="uploadTime" label="所属品牌"></el-table-column>
					<el-table-column prop="fileSize" label="累计发放积分"></el-table-column>
					<el-table-column prop="lineNumber" label="累计积分消耗"></el-table-column>
					<el-table-column prop="processStatus" label="累计积分差额"></el-table-column>
					<el-table-column prop="processDate" label="统计时间"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看明细" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="手工调账" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconChakan1(scope.$index, scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<el-footer v-if="count != 0">
					<el-pagination class="pagination" layout="prev, pager, next, jumper" :total="40"></el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { selectImportInfo } from '@/api/base/importInfo'
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
						let data = JSON.parse(Base64.decode(res.data));
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
			// 图标 - 查看明细
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '清算中心-查看',
					params: {
						formData: data
					}
				});
			},
			// 图标 - 手工调账
			iconChakan1(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '清算中心-手工调账',
					params: {
						formData: data
					}
				});
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