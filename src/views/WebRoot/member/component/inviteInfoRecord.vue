// 会员查询-会员信息详情-邀请记录
<template>
	<el-card>
		<span class="el-title paddingLR10">邀请记录</span>
		<div class="overHidden paddingLR10">
			<table border="0" class="el-tableThree" cellspacing="0">
				<thead>
					<tr>
						<th>邀请人数</th>
						<th>邀请积分</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{inviteInfo.inviteNum}}</td>
						<td>{{inviteInfo.sendIntegralTotal}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="inviteInfoContainer paddingLR10">
			<el-table :data="inviteInfoData">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="invitedName" label="姓名"></el-table-column>
				<el-table-column prop="responseDate" label="关注时间"></el-table-column>
				<el-table-column prop="palyTime" label="互动次数"></el-table-column>
				<el-table-column prop="sendIntegral" label="获赠积分"></el-table-column>
				<el-table-column prop="memberLevel" label="会员等级"></el-table-column>
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
	import { selectMember664} from '@/api/member/memberSelectInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				//消费记录-累计消费
				inviteInfo: {
					"inviteNum":"",//购买次数
			        "sendIntegralTotal":"",//最后一次购买金额
				},
				inviteInfoData: [],
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
				selectMember664(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//					console.log(JSON.stringify(data))
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								...val
							});
						})
						that.inviteInfo=data.msg;
						that.count = data.count;
						that.inviteInfoData = result;
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
		width: 20%;
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
	.inviteInfoContainer{
		width:79%;
		margin-top: 20px;
	}
</style>