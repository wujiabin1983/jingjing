<!--优惠券-详情-->
<template>
    <el-container class="app-container" >
        <el-main>
        	<el-button @click="handleBack" class="mrgBottom10">返回</el-button>
            <el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline">
                	<el-form-item label="发放时间">
                		<el-date-picker
					      v-model="form.grantDate"
					      type="date"
					       value-format="yyyy-MM-dd"
					      :editable="false"
					      placeholder="选择日期">
					    </el-date-picker>
					</el-form-item>
                	<el-form-item label="使用状态">
                        <el-select v-model="form.useStatus" clearable placeholder="请选择使用状态">
                            <el-option label="已使用" value="已使用"></el-option>
                            <el-option label="未使用" value="未使用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.menName" placeholder="请输入会员姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="coupName" label="券名称"></el-table-column>
                    <el-table-column prop="couponType" label="券类型 "></el-table-column>
                    <el-table-column prop="coupId" label="券ID"></el-table-column>
                    <el-table-column prop="grantDate" width="140" label="发放时间"></el-table-column>
                    <el-table-column prop="menName" label="会员姓名"></el-table-column>
                    <el-table-column prop="mobile" width="105" label="会员电话"></el-table-column>
                    <el-table-column prop="useStoreName" label="使用门店"></el-table-column>
                    <el-table-column prop="useDate" width="140" label="使用时间"></el-table-column>
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
	import { selectCouponInfo} from '@/api/member/statistics'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					masterId:'',
					grantDate:'',
					useStatus: '',
					menName:''
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
				this.showTable('',this.limit, this.form);
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
					masterId: searchContent.masterId,
					grantDate: searchContent.grantDate,
					useStatus:searchContent.useStatus,
					menName:searchContent.menName
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
//				console.log(params)
				selectCouponInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
						if(data.data) {
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
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
//						 console.log(err);
						that.tableLoading = false;
					});
			},
			handleBack() {
				this.$router.push({
					name: '优惠券使用统计查询',
					params: {
						pageType: '查看',
						formData: this.getFormDatas
					}
				});
			},
		},
		created() {
//			console.log(this.getFormDatas)
			this.showTable(this.page,this.limit,this.form);
			this.form.masterId=JSON.parse(this.getFormData).id;
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
	        ...mapGetters([
	            'userInfo',
	        ]),
	        getFormData() {
	            return this.$route.params.dataInfo;
	        },
	        getFormDatas() {
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
		float: right;
	}
	
	.el-form-item--small.el-form-item {
		margin-bottom: 10px;
	}
	.el-input{
		width: 200px;
	}
	.el-select {
		width: 100%;
	}
	
	.el-button {
		float: left;
		margin: 0 0 10px 0;
	}
</style>