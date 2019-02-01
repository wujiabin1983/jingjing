// 会员查询-会员信息详情-购买记录
<template>
	<el-card>
		<span class="el-title paddingLR10">购买商品</span>
		<div class="overHidden paddingLR10">
			<table border="0" class="el-tableThree" cellspacing="0">
				<thead>
					<tr>
						<th>购买品类</th>
						<th>客单价</th>
						<th>客单件</th>
						<th>件单价</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{buyInfo.orderCount}}</td>
						<td>{{buyInfo.orderCustomerPrice}}</td>
						<td>{{buyInfo.orderNo}}</td>
						<td>{{buyInfo.unitPrice}}</td>
					</tr>
					<tr>
						<td colspan="4" class="el-tableThree-td">商品分类占比：{{buyInfo.orderCount}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--<span class="el-title">会员变更记录</span>-->
		<div class="buyInfoContainer paddingLR10">
			<el-table :data="buyInfoData">
				<el-table-column type="index" label="序号"></el-table-column>
				<el-table-column prop="goodUrl" label="商品图片">
                	<template slot-scope="scope" >
                		<div class="page"><img :src="scope.row.goodUrl"/></div>
                	</template>
				</el-table-column>
				<el-table-column prop="goodInfo" width="300" label="商品信息"></el-table-column>
				<el-table-column prop="goodColor" label="颜色"></el-table-column>
				<el-table-column prop="goodSize" label="尺码"></el-table-column>
				<el-table-column prop="qty" label="数量"></el-table-column>
				<el-table-column prop="commodityTagPrice" label="吊牌价"></el-table-column>
				<el-table-column prop="createdOn" width="120" label="创建日期"></el-table-column>
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
	import { selectMember865,selectMember866} from '@/api/member/memberSelectInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				//消费记录-累计消费
				buyInfo: {
					"orderCount": "",
					"orderCustomerPrice": "",
					"orderNo": "",
					"unitPrice": "" 
				},
				buyInfoData: [],
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
				let params={
					"userId":this.userInfo.userCode,
					"page":page,
					"limit":limit,
					"memCode" : this.getFormData
				}
				let that =this;
				selectMember866(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//					console.log(JSON.stringify(data));
						let result = [];
						if(!data.messageType) {
							if(data.data) {
								data.data.forEach((val, index) => {
									result.push({
										...val
									});
								})
								that.count = data.count;
								that.buyInfoData = result;
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
					"memCode" :this.getFormData
				}
				let that =this;
	//			console.log(params)
				selectMember865(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//					console.log(JSON.stringify(data));
						if(data.messageType == "SUCCESS") {
							that.buyInfo=data.messageContent;
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
		width: 60%;
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
			width: 25%;
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
	.buyInfoContainer{
		width: 100%;
		margin-top: 20px;
	}
</style>