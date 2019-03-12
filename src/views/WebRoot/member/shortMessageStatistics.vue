<!--短信统计-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="activityName" label="活动标题"></el-table-column>
					<el-table-column prop="sendNum" label="发送人数"></el-table-column>
					<el-table-column prop="tempDesc" label="活动模板内容"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" /> -->
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
                <!-- 分页 -->
                <el-footer  v-if="count != 0">
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
	import { selectMessageData } from '@/api/member/shortMessageStatistics'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				// 表格数据
				tableData: [],
				// 表格多选
				multipleSelection: [],
				userCode:'',
				// 表格是否为加载状态
				tableLoading: false,
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
			// 方法
			onSubmit() {
        		this.showTable(this.page, this.limit);
			},
	    	// 分页
	        handleCurrentChange(val) {
	            // console.log(val+'当前页');
	            this.page = val;
	            this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			showTable(start, limit) {
				let that = this;
				let params = {
	                userId : this.userInfo.userCode,
	                page : start,
	                limit : limit
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectMessageData(params)
					.then(function(res) {
//						console.log(res)
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(data)
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
	            			that.count = data.count;
							that.tableData = result;
						}else if(data.messageType != 'SUCCESS') {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							}
						that.tableLoading = false;
					})
					.catch(function(err) {
//						 console.log(err);
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '营销活动短信统计查看',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
		},
		created() {
            this.showTable(this.page, this.limit);
			this.userCode = this.userInfo.userCode;
			
	        let that = this;
	        let formData;
	        let data;
	        if(this.getPageType) {
	            formData = JSON.parse(this.getFormData);
	            data = {
	                "userId": this.userInfo.userCode,
	                ...formData
	            }
	        }
		},
		computed: {
			// 计算属性
	        //登录时候缓存的用户类型和用户代码
	        ...mapGetters([
	            'userInfo',
	        ]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: inline-block;
		margin-left: rem(20px);
	}
	.el-form-item{
		margin:0;
		margin-right:10px;
	}
</style>