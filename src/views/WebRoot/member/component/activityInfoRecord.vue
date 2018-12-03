// 会员查询-会员信息详情-活动记录
<template>
	<el-card>
		<span class="el-title paddingLR10">活动记录</span>
		<div class="activityContainer paddingLR10">
			<el-table :data="activityData">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="activityName" label="活动内容"></el-table-column>
				<el-table-column prop="joinDate" label="活动时间"></el-table-column>
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
	import { selectMember867} from '@/api/member/memberSelectInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				activityData: [],
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
				let that = this;
				selectMember867(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	//					console.log(JSON.stringify(data))
						let result = [];
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.count = data.count;
							that.activityData = result;
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
	.activityContainer{
		width: 30%;
	}
</style>