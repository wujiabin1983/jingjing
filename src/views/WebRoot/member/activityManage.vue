<!--营销活动-活动监控-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item label="活动类型">
                        <el-select v-model="form.activiteType" clearable placeholder="请选择活动类型">
                            <el-option label="会员权益类" value="会员权益类"></el-option>
							<el-option label="生命周期类" value="生命周期类"></el-option>
							<el-option label="消费激励类" value="消费激励类"></el-option>
							<el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
							<el-option label="事件触发" value="事件触发"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="活动日期">
						<el-date-picker v-model="form.activiteDate" :editable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
                    <el-form-item  label="">
                        <el-input v-model="form.activiteName" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
					<el-form-item class="select-btn-style marginTop10">
						<el-button type="primary" @click="onSubmit">查询</el-button>
						<el-button type="primary" @click="onReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="activityName" label="活动名称"></el-table-column>
					<el-table-column prop="activityType" label="活动类型"></el-table-column>
					<el-table-column prop="activityObject" label="活动对象"></el-table-column>
					<el-table-column prop="activityDate" label="活动时间">
                    	<template slot-scope="scope">
                    		<div v-if="scope.row.activityDate!='长期'">
	                			{{scope.row.activityDate.activityDateBegin+" - "+scope.row.activityDate.activityDateEnd}}
	                		</div>
	                		<div v-else>
	                			{{scope.row.activityDate}}
	                		</div>
                    	</template>
					</el-table-column>
					<el-table-column prop="action" width="80" label="操作">
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
import {selectActivityData} from '@/api/member/activityManagement'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					activiteType:'',
					activiteName:'',
					activiteDate: [] // 日期区间
				},
				// 表格数据
				tableData: [],
//				{
//						activityName:"1",
//						activityType:"1",
//						presetGroup:"1",
//						activityDate:"1"
//					}
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
			onReset(){
				this.form= {
					activiteType:'',
					activiteName:'',
					activiteDate: [] // 日期区间
				};
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
        		this.showTable('', this.limit);
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
	                userId: this.userInfo.userCode,
	                page: start,
	                limit: limit,
	                activiteType: this.form.activiteType,
	                activityName: this.form.activiteName,
	                activityNameDateBegin:this.form.activiteDate[0],
	                activityNameDateEnd:this.form.activiteDate[1]
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(JSON.stringify(params))
				selectActivityData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
	            			that.count = data.count;
							that.tableData = result;
						}else if(data.messageType!= 'SUCCESS') {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(JSON.stringify(err));
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '营销活动活动监控查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
		},
		created() {
            this.showTable(this.page, this.limit);
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
		margin-bottom:10px;
		margin-right:10px;
	}
</style>