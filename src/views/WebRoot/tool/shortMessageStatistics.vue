<!--活动短信统计-主表-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="activityTitle" label="标题"></el-table-column>
                    <el-table-column prop="sendObj" label="发送对象">
                    	<template slot-scope="scope">
					          <p v-if="scope.row.sendObj!='全部'">条件筛选</p>
					          <p v-else>{{scope.row.sendObj}}</p>
			            </template>
                    </el-table-column>
                    <el-table-column prop="sendNum" width="80" label="发送人数"></el-table-column>
                    <el-table-column prop="msgDesc" min-width="160" label="发送内容">
                    	<template slot-scope="scope" >
	                    	<el-popover trigger="hover" placement="top">
					          <p> {{ scope.row.msgDesc }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.msgDesc }}</el-tag>
					          </div>
					        </el-popover>
			            </template>
                    </el-table-column>
                    <el-table-column prop="isExecute" width="80" label="是否已执行"></el-table-column>
                    <el-table-column prop="sendDate" width="145" label="发送时间"></el-table-column>
                    <el-table-column prop="status" width="80" label="发送状态"></el-table-column>
					<el-table-column prop="action" width="60" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看明细" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" /> -->
							</el-tooltip>
						</template>
					</el-table-column>
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
	import { selectShortMessageStatistics } from '@/api/tool/shortMessageStatistics'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
				// 表格数据
				tableData: [],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
	            // 活动分页
	            page: 0, // 当前页
	            count: 0, // 总条数
	            limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
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
				var param = {
					processDateBegin: this.form.selectDate[0],
					processDateEnd: this.form.selectDate[1]
				}
				this.showTable(this.page,this.limit);
				// console.log(JSON.stringify(param) + "!");
			},
			showTable(start, limit) {
				let that = this;
				let params = {
					userId:this.userInfo.userCode,
					page: start,
					limit: limit
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectShortMessageStatistics(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
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
			// 图标 - 查看明细
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '门店活动短信统计查询',
					params: {
						formData: data
					}
				});
			},
			// 导入
			upload() {

			},
			//下载模板
			download() {

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
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.name-wrapper{
		cursor: pointer;
	}
	.el-header{
	}
	.el-form-item--small.el-form-item{
		margin: 0;
	}
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom: 0;
		}
	}

</style>