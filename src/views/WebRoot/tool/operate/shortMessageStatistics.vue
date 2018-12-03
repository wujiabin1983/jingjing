
<!--活动短信统计-子表-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" class="marginBottom10">返回</el-button>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column prop="menId" label="会员ID"></el-table-column>
                    <el-table-column prop="menName" label="会员姓名"></el-table-column>
                    <el-table-column prop="sendBy" label="发送人"></el-table-column>
                    <el-table-column prop="sendDate" label="发送时间"></el-table-column>
                    <el-table-column prop="status" label="发送状态"></el-table-column>
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
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { selectShortMessageInfo } from '@/api/tool/shortMessageStatistics'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
				// 表格数据
				tableData: [{
					"activityTitle": "",
					"menId": "",
					"menName": "",
					"sendDate": "",
					"status": ""
				}],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
	            // 活动分页
	            page: 0, // 当前页
	            count: 0, // 总条数
	            limit: this.GLOBAL.limitDialog, // 条/页
			}
		},
		methods: {
			handleBack(){
				this.$router.push({
					path: "/mar/mar-3-2" 
				});
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
	    	// 活动列表分页
	        handleCurrentChange(val) {
	            this.page = val;
	            this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 方法
			onSubmit() {
				this.showTable(this.page,this.limit);
			},
			showTable(start, limit) {
				let that = this;
				let params = {
					userId:this.userInfo.userCode,
					page: start,
					limit: limit,
					storeActMsgMasterId:JSON.parse(this.getFormData).id
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
//				console.log(params)
				selectShortMessageInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(data);
						if(data.data) {
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.tableData = result;
							that.tableLoading = false;
						}else if(data.messageType != 'SUCCESS'){
							that.$message.error(data.messageContent);
							that.tableLoading = false;
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			
		},
		created() {
			this.showTable(this.page,this.limit);
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
	        //登录时候缓存的用户类型和用户代码
	        ...mapGetters([
	            'userInfo',
	        ]),
			getFormData() {
				let msg = this.$route.params.formData;
				return msg;
			},
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