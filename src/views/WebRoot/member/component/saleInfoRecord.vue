// 会员查询-会员信息详情-消费记录
<template>
	<el-card>
		<span class="el-title paddingLR10">消费记录</span>
		<div class="overHidden paddingLR10">
			<table border="0" class="el-tableThree" cellspacing="0">
				<thead>
					<tr>
						<th>购买次数</th>
						<th>消费金额</th>
						<th>客单价</th>
						<th>客单件</th>
						<th>件单价</th>
						<th>最后一次购买时间</th>
						<th>最后一次购买金额</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{saleInfo.orderCount}}</td>
						<td>{{saleInfo.orderAmoutSum}}</td>
						<td>{{saleInfo.orderCustomerPrice}}</td>
						<td>{{saleInfo.orderNo}}</td>
						<td>{{saleInfo.unitPrice}}</td>
						<td>{{saleInfo.lastOrderDate}}</td>
						<td>{{saleInfo.lastOrderAmout}}</td>
					</tr>
					<tr>
						<td colspan="7" class="el-tableThree-td">消费：{{saleInfo.orderAmoutSum}}&nbsp;&nbsp;&nbsp;&nbsp;平均消费金额：{{saleInfo.avgOrderAmout}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--<span class="el-title">会员变更记录</span>-->
		<div class="saleInfoContainer paddingLR10">
			<el-table :data="saleInfoData">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="orderNum" label="订单编号"></el-table-column>
				<el-table-column prop="orderTagAmount" width="150" label="订单吊牌金额"></el-table-column>
				<el-table-column prop="orderPayableAmount" label="订单金额"></el-table-column>
				<el-table-column prop="discount" label="折扣(%)"></el-table-column>
				<el-table-column prop="orderRealpayAmount" label="实付金额"></el-table-column>
				<el-table-column prop="orderDate" width="150" label="销售时间"></el-table-column>
				<el-table-column prop="orderStatus" label="订单状态"></el-table-column>
				<el-table-column prop="storeName" label="所属门店"></el-table-column>
				<el-table-column prop="guideName" label="专属导购"></el-table-column>
			</el-table>
	        <!-- 分页 -->
	        <el-footer v-if="count != 0">
	            <el-pagination 
	                background 
	                class="pagination"
	                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" 
	                :page-size="limit"
	                :total="count" 
	                @current-change="handleCurrentChange">
	            </el-pagination>
	        </el-footer>
		</div>
	</el-card>
</template>
<script>
	import { TemplateFour } from '@/views/WebRoot/platform'
	import { selectMember863,selectMember864} from '@/api/member/memberSelectInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				//消费记录-累计消费
				saleInfo: {
					"orderCount":"",//购买次数
					"orderAmoutSum":"",//消费金额
					"orderCustomerPrice":"",//客单价
			        "orderNo":"",//客单件
					"unitPrice":"",//件单价
					"lastOrderDate":"",//最后一次购买时间
			        "lastOrderAmout":"",//最后一次购买金额
				    "avgOrderAmout":""//平均消费金额
				},
				saleInfoData: [],
//				{
//					"coupId": "券码",
//					"coupName": "券内容",
//					"validityDateBegin": "发放时间",
//					"source": "发券渠道",
//					"useDate": "核销时间",
//					"useStoreName": "核销门店",
//					"status": "券状态 "
//				}
	            // 活动分页
	            page: 0, // 当前页
	            count: 0, // 总条数
	            limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
	    	// 活动列表分页
	        handleCurrentChange(val) {
	            this.page = val;
	            this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			showTable(page,limit){
				let that =this;
				let params={
					"userId":this.userInfo.userCode,
					"page":page,
					"limit":limit,
					"memCode" : this.getFormData
				}
				selectMember864(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						let result = [];
						if(!data.messageType) {
							if(data.data) {
								data.data.forEach((val, index) => {
									result.push({
										...val
									});
									if(result[index].orderStatus=="S"){
										result[index].orderRealpayAmount="+"+result[index].orderRealpayAmount;
									}
									if(result[index].orderStatus=="R"){
										result[index].orderRealpayAmount="-"+result[index].orderRealpayAmount;
									}
								})
								that.count = data.count;
								that.saleInfoData = result;
							}
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
			showOther(){
				let params={
					"userId":this.userInfo.userCode,
					"memCode" : this.getFormData
				}
				let that =this;
	//			console.log(params);
				selectMember863(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//					console.log(JSON.stringify(data));
						if(data.messageType == "SUCCESS") {
							that.saleInfo=data.messageContent;
						} else {
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
			}
		},
		created() {
//			this.showTable(this.page, this.limit);
//			this.showOther();
		},
		computed: {
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getFlag() {
				return this.$route.params.flag;
			}
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-title{
		height: 40px;
		line-height: 40px;
		text-align: left;
		margin: 10px 0;
		font-size: 16px;
		display: block;
		border-bottom:1px solid #00a0e9;
	}
	.el-tableThree {
		width: 79%;
		float: left;
		border: 1px solid #CBCBCB;
		th {
			height: 40px;
			border-right: 1px solid #CBCBCB;
			text-align: center;
		}
		td {
			border-right: 1px solid #CBCBCB;
			border-top: 1px solid #CBCBCB;
			height: 35px;
			text-align: center;
		}
		th:last-child {
			border-right: none;
		}
		td:last-child {
			border-right: none;
		}
	}
	
	.el-tableThree-td{
		text-align: left;
		padding-left:10px;
	}
	.saleInfoContainer{
		width:100%;
		margin-top: 20px;
	}
</style>