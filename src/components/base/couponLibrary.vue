// 优惠券库 - 组件
<template>
	<el-container class="app-container">
        <el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline dean-form">
                    <el-form-item label="券类型">
                        <el-select v-model="form.couponType" clearable placeholder="请选择券类型">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="邀请券" value="邀请券"></el-option>
                            <el-option label="礼品券" value="礼品券"></el-option>
                            <el-option label="折扣券" value="折扣券"></el-option>
                            <el-option label="代金券" value="代金券"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.coupLibraryKey" placeholder="请输入券名称或券ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-header>
        <!-- <el-card> -->
        <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column type="selection" width="50" label="选择"></el-table-column>
            <el-table-column prop="coupId" label="券ID"></el-table-column>
            <el-table-column prop="couponType" width="80" label="类型"></el-table-column>
            <el-table-column prop="coupTempName" label="券模板"></el-table-column>
            <el-table-column prop="coupName" label="券名称"></el-table-column>
            <el-table-column prop="createdBy" label="创建人"></el-table-column>
            <el-table-column prop="operatorBy" label="审批人"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-footer v-if="count != 0">
            <el-pagination background  class="pagination" layout="total, prev, pager, next, jumper" :page-size="limit" :total="count" @current-change="handleCurrentChange">
            </el-pagination>
        </el-footer>
        <!-- </el-card> -->
	</el-container>
</template>
<script>
	import { selectCouponLibraryJurisdiction,selectAudioCouponLibrary,couponLibraryAudioYes,couponLibraryAudioNo, addCouponLibrary,couponLibraryStop,couponLibraryBegin } from '@/api/member/couponLibrary'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					coupLibraryKey: '', 
					couponType: ''
				},
				// 表格数据
				tableData: [{
					"coupTempId": "",
					"couponType": "",
					"coupTempName": "",
					"operatorBy": "",
					"operationDate": "1"
				}],
				// 表格多选
				multipleSelection: [],
            	multipleSelectionTab: [],
				// 表格是否为加载状态
				tableLoading: false,
				rules: {
	                reasonForRejection: [
	                    { required: true, message: '请输入驳回理由', trigger: 'change' },
	                    { max: 100, message: '最小长度为20', trigger: 'change' }       
	                ]
	            },
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
	            // 审核分页
	            pageTab: 0, // 当前页
	            countTab: 0, // 总条数
	            limitTab: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
				var param = {
					"userId": this.userInfo.userCode,
					"page": this.page,
					"limit":  this.limit,
					"coupLibraryKey": this.form.coupLibraryKey,
					"couponType":  this.form.couponType
				}
				this.showTable(this.page, this.limit, param);
			},
			// 分页
			handleCurrentChange(val) {
//				console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			// 分页
			handleCurrentChangeTab(val) {
//				console.log(val, '当前页');
				this.page = val;
				this.showTableTab(val, this.limit);
			},
			//请求表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": this.limit,
					"coupLibraryKey": this.form.coupLibraryKey,
					"couponType": this.form.couponType
				}
				// console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(data);
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
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
//						console.log(err);
						that.tableLoading = false;
					});
			},
			
			
		},
		created() {
			// this.showTable(this.page, this.limit, this.form);
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
	/*.el-form-item{
		margin: 0;
	}*/
	.dean-form .el-form-item{
		margin: 0;
	}
	.el-button{
		margin-top:0;
	}
	.el-form {
		display: inline-block;
	}
</style>