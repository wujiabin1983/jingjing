<!--优惠券-详情-->
<template>
    <el-container class="app-container" >
        <el-main>
            <el-card>
	        	<el-form :inline="true" :model="form" class="demo-form-inline">
                    <div class="floatRight">
		            	<el-form-item label="活动类型">
		                    <el-select v-model="form.activiteType" clearable placeholder="请选择活动类型">
		                         <el-option label="会员权益类" value="会员权益类"></el-option>
								<el-option label="生命周期类" value="生命周期类"></el-option>
								<el-option label="消费激励类" value="消费激励类"></el-option>
								<el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
								<el-option label="其他" value="其他"></el-option>
		                    </el-select>
		                </el-form-item>
		                <el-form-item>
		                    <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
		                </el-form-item>
		                <el-form-item>
		                    <el-button type="primary" @click="onSubmit">查询</el-button>
		                </el-form-item>
	                </div>
	            </el-form>
            </el-card>
            <el-card>	
            	<el-button type="primary" @click="exportDataFn" :disabled="exportDis">导出Excel</el-button>
	        	<el-button @click="handleBack">返回</el-button>
            </el-card>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="activiteType" label="活动类型"></el-table-column>
                    <el-table-column prop="activityName" label="活动名称"></el-table-column>
                    <el-table-column prop="activiteDateBegin" width="160" label="开始时间"></el-table-column>
                    <el-table-column prop="activiteDateEnd" label="结束时间"></el-table-column>
                    <el-table-column prop="grantQty" label="发送量"></el-table-column>
                    <el-table-column prop="receiveQty" label="领取数量"></el-table-column>
                    <el-table-column prop="receiveRate" label="领取率"></el-table-column>
                    <el-table-column prop="useQty" label="核销数量"></el-table-column>
                    <el-table-column prop="useRate" label="核销率"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                             <el-tooltip class="item" content="查看" placement="top">
                                <!-- 查看 -->
                                <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)"/>
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
	import { selectCouponStatisticsInfo,exportDataInfo} from '@/api/member/statistics'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				exportDis:false,
				// 搜索数据
				form: {
					activiteType: '',
					activityName: '',
					coupId:''
				},
				// 表格数据
				tableData: [],
				
				// 表格多选
				multipleSelection: [],
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
				this.showTable('', this.limit, this.form);
				// console.log(JSON.stringify(param) + "!");
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			//请求表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId:this.userInfo.userCode,
					page: start,
					limit: limit,
					coupId:searchContent.coupId,
					activiteType:searchContent.activiteType,
					activityName:searchContent.activityName
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectCouponStatisticsInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
						if(data.data) {
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,

									...val
								});
							})
							that.tableData = result;
							that.tableLoading = false;
						} else if(data.messageType != 'SUCCESS'){
							that.$message.warning(data.messageContent);
							that.tableLoading = false;
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '使用统计-查看详情',
					params: {
						pageType: '查看',
						dataInfo: data ,
						formData:this.getFormData
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '使用统计'
				});
			},
			//导出数据
			exportDataFn() {
				let params = '';
				this.multipleSelection.forEach((val, index) => {
					params += val.id + ',';
				})
				this.exportDis=true;
				var param = {
					"userId": this.userInfo.userCode,
					"params": params,
					"shelvesStatus": this.form.shelvesStatus,
					"searchContent": this.form.searchContent
				}
				//			console.log(param);
				this.tableLoading = true;
				exportDataInfo(param)
					.then((res) => {
						//					console.log(JSON.stringify(res) + "导出返回值");
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							this.exportDis=false;
							window.location.href = Cookie.get("baseUrl") + data.messageContent;
						} else {
							this.exportDis=false;
							this.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
						this.exportDis=false;
						// console.log(err);
					});
				this.tableLoading = false;
			},
		},
		created() {
//			console.log(this.getFormData)
			this.form.coupId=JSON.parse(this.getFormData).coupId;
			this.showTable(this.page,this.limit,this.form);
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
	        ...mapGetters([
	            'userInfo',
	        ]),
	        //添加或修改返回的值
	        getFormData() {
	            return this.$route.params.formData;
	        },
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: unset;
		overflow: hidden;
		.el-form-item {
			margin-bottom: 10px;
		}
	}
</style>