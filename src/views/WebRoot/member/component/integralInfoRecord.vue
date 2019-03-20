// 会员查询-会员信息详情-积分记录
<template>
	<el-card>
		<span class="el-title paddingLR10">积分记录</span>
		<div class="overHidden paddingLR10">
			<table border="0" class="el-tableThree" cellspacing="0">
				<thead>
					<tr>
						<th>累计积分</th>
						<th>可用积分</th>
						<th>已兑换积分</th>
						<th>即将过期积分</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{integralInfo.totalIntegral}}</td>
						<td>{{integralInfo.availableIntegral}}</td>
						<td>{{integralInfo.convertibilityIntegral}}</td>
						<td>{{integralInfo.forthcomIntegral}}</td>
					</tr>
					<tr>
						<td colspan="4" class="el-tableThree-td">消费：{{integralInfo.spend}}&nbsp;&nbsp;&nbsp;&nbsp;其他：{{integralInfo.otherSpend}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<span class="el-title paddingLR10">会员积分明细表</span>
		<div class="width100 paddingLR10">
			<el-table :data="detailArray">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="orderNum" label="流水"></el-table-column>
				<el-table-column prop="integralDate" width="150"label="日期"></el-table-column>
				<el-table-column prop="integralType" width="100" label="渠道"></el-table-column>
				<el-table-column prop="integralDir" width="100" label="类别"></el-table-column>
				<el-table-column prop="integralDeac" label="积分描述"></el-table-column>
				<el-table-column prop="integralValue" label="积分"></el-table-column>
				<el-table-column prop="status" label="状态"></el-table-column>
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
	import { selectMember662} from '@/api/member/memberSelectInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				integralInfo: {
					"totalIntegral":"",//累计积分
					"availableIntegral":"",//可用积分
					"convertibilityIntegral":"",//已兑换积分
			        "forthcomIntegral":"",//即将过期积分
			        "spend":"",
			        "otherSpend":""
				},
			    detailArray: [],
//			    {
//					"orderNum": "流水",
//					"integralDate": "日期",
//					"integralType": "渠道",
//					"goodName": "商品",
//					"integralDir": "类别",
//					"integralDeac": "积分描述",
//					"integralValue": "积分"
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
				let that=this;
				selectMember662(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(data)
						that.integralInfo = data.msg;
						that.count=data.count;
						that.detailArray=data.data;
					})
					.catch(function(err) {
	//					 console.log(err);
					});
			}
		},
		created() {
//			this.showTable(this.page, this.limit);
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
	
	.el-title {
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
</style>