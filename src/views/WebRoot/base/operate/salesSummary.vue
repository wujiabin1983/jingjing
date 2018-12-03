<!--销售汇总-导入信息-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack">返回</el-button>
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="form.searchContent" placeholder="请输入门店编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="storeId" label="门店编码"></el-table-column>
					<el-table-column prop="uploadDateBegin" label="销售时间"></el-table-column>
					<el-table-column prop="orderQty" label="订单数量"></el-table-column>
					<el-table-column prop="goodsQty" label="订购商品数量合计"></el-table-column>
					<el-table-column prop="brandName" label="订购商品品牌"></el-table-column>
					<el-table-column prop="accountTotal" label="订购商品金额合计"></el-table-column>
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
	import { importSalesSummary } from '@/api/base/salesSummary'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				form: {
					searchContent: ''
				},
				// 表格数据
				tableData: [],
				//          {
				//		    	"uploadDateBegin":"",
				//		    	"uploadDateEnd":"",
				//		    	"orderQty":"",
				//		    	"goodsQty":"",
				//		    	"brandName":"",
				//		    	"accountTotal":""
				//          }
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
			onSubmit() {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				// 钩子函数 -- 初始化
				this.showTable('', this.limit, res);
			},

			// 分页
			handleCurrentChange(val) {
				//          console.log(val, '当前页');
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
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
				//          console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				importSalesSummary(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//              	console.log(JSON.stringify(data));
						let result = [];
						//                  if(data.data){
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.count = data.count;
						that.tableData = result;
						//                  }
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			handleBack() {
				this.$router.push({
					name: '销售汇总'
				});
			},
		},
		created() {
			// 钩子函数 -- 初始化
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
	
	.el-form-item--small.el-form-item {
		margin-bottom: 0px;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-button {
		float: left;
		margin: 0 0 10px 0;
	}
</style>