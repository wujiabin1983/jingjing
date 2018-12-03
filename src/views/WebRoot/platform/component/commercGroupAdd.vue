<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline">
					<el-form-item label="">
						<el-input v-model="form.searchContent" class="width200" placeholder="请输入商户名称或商户编码"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch(page, limit, form.searchContent)">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" border highlight-current-row @current-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<!-- <el-table-column type="selection" width="50" label="选择"></el-table-column> -->
					<el-table-column prop="codeCommerc" label="商户编码"></el-table-column>
					<el-table-column prop="nameCommerc" label="商户名称">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.nameCommerc" size="mini"></el-input>
							<span v-else>{{scope.row.nameCommerc}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="industry" label="所属行业"></el-table-column>
					<el-table-column prop="dateRegister" label="注册日期"></el-table-column>
					<el-table-column prop="indateStart" label="有效期起"></el-table-column>
					<el-table-column prop="indateEnd" label="有效期止"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
			<el-button type="primary" @click="handleAdd" class="handleAdd">确&nbsp;&nbsp;&nbsp;&nbsp;定</el-button>
		</el-main>
	</el-container>
</template>
<script>
	import { selectSellerInfo} from '@/api/platform/commercRegister';
	// 获取vuex
	import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
				// 搜索数据
				form: {
					searchContent: ''
				},
				// 表格数据
				tableData: [],
				// 表格加载loading
				tableLoading: false,
				// 多选的数据
				multipleSelection: {},

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			handleAdd() {
				if(!this.multipleSelection.codeCommerc) {
					this.$message.warning('请选择商户');
				} else {
					let params = {
						sellerId: this.multipleSelection.codeCommerc,
						sellerMan: this.multipleSelection.nameCommerc
					}
					this.$emit('childMerchantSubmit', params);
				}
			},
			// 方法
			// 搜索
			handleSearch(start, limit, searchContent) {
				this.showTable('', limit, searchContent);
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.searchContent);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchContent);
			},
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start, //可为空
					"limit": limit, //可为空
					searchContent: searchContent, //可为空
					status: '启用'
				}
				this.tableLoading = true;
				selectSellerInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						//						console.log(data);
						// if(data.returnCode == 0) {
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								isEdit: false,

								codeCommerc: val.sellerId, // 商户编码
								nameCommerc: val.sellerMan, // 商户名称
								numCredit: val.estaCreditNum, // 企业信用证号码
								numLicence: val.businessNumber, // 营业执照号码
								industry: '1111', // 所属行业
								dateRegister: val.registeDate, // 注册日期
								indateStart: val.validityDateBegin, // 有效期起
								indateEnd: val.validityDateEnd, // 有效期止
								status: '121212', // 状态
								...val
							});
						})
						that.count = data.count;
						that.tableData = result;
						that.tableLoading = false;
						// }else {
						//     that.$message(data.returnMsg);
						// }
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(val);
			},
		},
		created() {
			// 钩子函数 -- 初始化
			let that = this;

			// 初始化表格数据
			that.showTable(this.page, this.limit, this.form.searchContent);
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			])
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
		// position: absolute;
		margin-left: rem(20px);
		.el-form-item {
			margin-bottom: 0;
		}
	}
	.handleAdd{
		margin:0 auto;
		display: block;
	}
	.width200{
		width: 200px;
	}
</style>