<!--订单信息-导入信息-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack">返回</el-button>
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="form.searchContent" placeholder="请输入门店编码或订单编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-card>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="会员销售信息" name="first">
						<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column type="selection" width="50" label="选择"></el-table-column>
							<el-table-column prop="storeId" label="门店编码"></el-table-column>
							<el-table-column prop="orderNum" label="订单编码"></el-table-column>
							<el-table-column prop="relationOrderNum" label="关联单号"></el-table-column>
							<el-table-column prop="orderStatus" label="订单状态"></el-table-column>
							<el-table-column prop="offlineCardNum" label="线下卡号"></el-table-column>
							<el-table-column prop="orderDate" label="订单时间"></el-table-column>
							<el-table-column prop="qty" label="订单件数"></el-table-column>
							<el-table-column prop="action" label="操作" width="80">
								<template slot-scope="scope">
									<!-- 功能图标 -->
									<el-tooltip class="item" content="查看" placement="top">
										<!-- 查看 -->
										<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="销售商品明细" name="second">
						<el-table ref="tableDataInfo" :data="tableDataInfo">
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column prop="storeId" label="门店编码"></el-table-column>
							<el-table-column prop="orderNum" label="订单编码"></el-table-column>
							<el-table-column prop="commodityCode" label="商品编码"></el-table-column>
							<el-table-column prop="commodityTagPrice" label="商品吊牌价"></el-table-column>
							<el-table-column prop="commodityActualSellPrice" label="商品实际售价"></el-table-column>
							<el-table-column prop="qty" label="销售件数"></el-table-column>
							<el-table-column prop="commodityTotalAmount" label="商品总金额"></el-table-column>
							<el-table-column prop="guidesWorkNumber" label="导购工号"></el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
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
	import { selectOrderInfo } from '@/api/base/orderInfo'
	import { selectOrderDetail } from '@/api/base/orderInfoData'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				activeName: "first",
				disabled: true,
				form: {
					searchContent: ''
				},
				// 表格数据
				tableData: [],
				/*{
            	id:'',//记录id
				storeId: '', //门店编码
				orderNum: '', //订单编码		--------
				relationOrderNum: '', //关联单号
				orderStatus: '', //订单状态
				offlineCardNum: '', //线下卡号	
				orderDate: '', //订单时间				---------
				qty: '', //订单件数
				orderTagAmount: '', //订单吊牌金额		--------
				orderPayableAmount: '', //订单应付金额
				orderRealpayAmount: '' //订单实付金额
            }*/
				tableDataInfo: [
					//	            {
					//		        	"storeId":"",// 门店编码
					//		        	"orderNum":"", // 订单编码
					//		            "commodityCode": "", // 商品编码
					//		            "commodityTagPrice": "", //商品吊牌价
					//		            "commodityActualSellPrice": "", //商品实际售价
					//		            "qty": "", // 销售件数
					//		            "commodityTotalAmount":"", //商品总金额
					//		            "guidesWorkNumber":"" // 导购工号
					//	            }
				],
				multipleSelection: [],
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
				//          console.log(JSON.stringify(this.multipleSelection))
			},
			onSubmit() {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				// 钩子函数 -- 初始化
				this.showTable(this.page, this.limit, res);
			},
			//tab标签切换
			handleClick(tab, event) {
//				console.log(event.target.innerHTML)
				let textContent='';
				if(event.explicitOriginalTarget){
					textContent=event.explicitOriginalTarget.textContent;
				}else{
					textContent=event.target.innerHTML;
				}
				if(textContent== "销售商品明细") {
					if(this.multipleSelection.length > 1) {
						this.$message.warning({
							message: '只能选择一条数据'
						});
						this.tableDataInfo = [];
					}
					if(this.multipleSelection.length == 0) {
						this.$message.warning({
							message: '请选择一条数据'
						});
						this.tableDataInfo = [];
					}
					if(this.multipleSelection.length == 1) {
						let orderNum = this.multipleSelection[0].id;
						this.showTableDetail('', '', orderNum);
					}
				}
			},
			// 分页
			handleCurrentChange(val) {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				//          console.log(val, '当前页');
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
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectOrderInfo(params)
					.then(function(res) {
						//                  console.log(res);
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data))
						let result = [];
						if(!data.messageType) {
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
						// console.log(err);
						that.tableLoading = false;
					});
			},
			//门店明细
			showTableDetail(start, limit, orderNum) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					masterId: orderNum
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectOrderDetail(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						                  console.log(JSON.stringify(data))
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.tableDataInfo = result;
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(this.tableData[index]);
				this.$router.push({
					name: '数据导入订单信息查看详情',
					params: {
						pageType: '查看详情',
						detail: data,
						formData: this.getFormData
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '订单信息'
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
	
	.el-input {
		width: 200px;
	}
	
	.el-button {
		float: left;
		margin: 0 0 10px 0;
	}
</style>