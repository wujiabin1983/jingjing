// 会员查询-会员信息详情-服务记录
<template>
	<el-card>
		<span class="el-title paddingLR10">服务记录</span>
		<div class="overHidden paddingLR10">
			<table border="0" class="el-tableThree" cellspacing="0">
				<thead>
					<tr>
						<th>服务次数</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{count}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--<span class="el-title">会员变更记录</span>-->
		<div class="serviceInfoContainer paddingLR10">
			<el-table :data="serviceInfoData">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="serviceNum" label="服务单据号"></el-table-column>
				<el-table-column prop="answerDate" width="140" label="服务时间"></el-table-column>
				<el-table-column prop="questionType" width="80" label="服务类型"></el-table-column>
				<el-table-column prop="storeName" label="服务门店"></el-table-column>
				<el-table-column prop="storeName" width="120" label="专属导购"></el-table-column>
				<el-table-column prop="status" width="80" label="服务状态"></el-table-column>
				<el-table-column prop="wechatStatus" width="80" label="微信推送"></el-table-column>
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
	import { selectMember663} from '@/api/member/memberSelectInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				//消费记录-累计消费
				serviceInfo: {
					"serviceCount": "" 
				},
				serviceInfoData: [],
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
				selectMember663(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//					console.log(JSON.stringify(data)+"服务")
						let result = [];
						if(data.data) {
							if(data.data) {
								data.data.forEach((val, index) => {
									result.push({
										...val
									});
								})
								that.count = data.count;
								that.serviceInfoData = result;
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
		width: 10%;
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
	.serviceInfoContainer{
		width:100%;
		margin-top: 20px;
	}
</style>