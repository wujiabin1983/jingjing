<!-- 会员信息   会员信息调整 -->
<template>
	<el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="会员信息调整" name="first">
				<el-header>
					<el-card>
						<el-form :inline="true" :model="form" class="demo-form-inline dean-form">
							<el-form-item>
								<el-input v-model="form.nameOrPhone" placeholder="请输入会员姓名或手机号" class="width200"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="onSubmit">查询</el-button>
							</el-form-item>
						</el-form>
					</el-card>
				</el-header>
				<el-card>
					<el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="userName" label="会员姓名"></el-table-column>
						<el-table-column prop="sex" label="性别"></el-table-column>
						<el-table-column prop="mobile" label="手机号"></el-table-column>
						<el-table-column prop="memberLevel" label="等级"></el-table-column>
						<el-table-column prop="action" label="操作" v-if="roleBtn.updateMemberDataModificationInfo">
							<!-- 功能图标 -->
							<template slot-scope="scope">
							    <!-- 修改 -->
	                        	<el-tooltip class="item" content="修改" placement="top">
	                        		<i class="iconfont icon-edit" @click.prevent="iconEdit(scope.$index, scope.row)" ></i>
	                                <!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconEdit(scope.$index, scope.row)"/> -->
	                            </el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="count" @size-change="handleSizeChange"  @current-change="handleCurrentChange">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="会员信息调整记录" name="second">
				<el-header>
					<el-card>
						<el-form :inline="true" :model="formInfo" class="demo-form-inline dean-form">
							<el-form-item label="选择日期">
								<el-date-picker v-model="formInfo.selectDate" :editable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="onSubmitTab">查询</el-button>
							</el-form-item>
						</el-form>
					</el-card>
				</el-header>
				<el-card>
					<el-table ref="tableDataTab" v-loading="this.tableLoading" :data="tableDataTab" @selection-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="menName" label="会员姓名"></el-table-column>
						<el-table-column prop="mobile" label="手机号"></el-table-column>
						<el-table-column prop="changeBy" label="更改人"></el-table-column>
						<el-table-column prop="changeDate" label="更改日期"></el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="countTab!=0">
						<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="countTab" @size-change="handleSizeChangeTab" @current-change="handleCurrentChangeTab">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
		</el-tabs>
	</el-container>
</template>
<script>
	import { selectMemberData ,selectMemberInfo} from '@/api/member/memberDataModification'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				roleBtn:{
					updateMemberDataModificationInfo:false
				},
	        	formAudio:{
		        	reasonForRejection:'',//驳回理由
	        	},
        		handleStoreDialog:false,//驳回弹窗
	        	activeName: 'first',
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					nameOrPhone : '' 
				},
				formInfo: {
					selectDate: []
				},
				// 表格数据
				tableData: [{
					"coupTempId": "",
					"couponType": "",
					"coupTempName": "",
					"operatorBy": "",
					"operationDate": ""
				}],
				
	            // 表格数据
	            tableDataTab: [],
//	            {	"id": "记录ID",
//		"coupId": "劵Id",
//		"couponType": "代金券",
//		"coupTempName": "劵模板",
//		"coupName": "劵名称",
//		"wechatAuditStatus": "微信审核状态",
//		"systemStatus": "系统状态",
//		"createdBy": "创建人",
//		"modifiedOn": "最后编辑时间",
//		"operatorBy": "审批人",
//		"version": 1,}
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
	    	//tab切换
	    	handleClick(tab, event) {
//	    		console.log(tab.label)
	    		if(this.tableDataTab.length==0&&tab.label=="会员信息调整记录"){
	    			this.showTableTab('', this.limitTab);
	    		}else{
					this.showTable('', this.limit);
	    		}
	    	},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
	    	// 审核列表表格选择数据
	        handleSelectionChangeTab(val) {
	            this.multipleSelectionTab = val;
	        },
			// 会员调整记录查询
			onSubmit() {
				this.showTable('', this.limit);
			},
			// 会员调整记录查询
			onSubmitTab() {
				var param = {
					"userId": this.userInfo.userCode,
					"page": this.page,
					"limit":  this.limit,
					"changeDateBegin":'',
					"changeDateEnd":''
				}
//				console.log(JSON.stringify(this.formInfo))
				if(this.formInfo.selectDate){
					param.changeDateBegin=this.formInfo.selectDate[0];
					param.changeDateEnd=this.formInfo.selectDate[1];
				}
				this.showTableTab('', this.limit);
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit);
			},
			// 分页
			handleCurrentChangeTab(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTableTab(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			handleSizeChangeTab(val) {
				this.limitTab = val;
				this.showTableTab(this.pageTab, this.limitTab);
			},
			//请求表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"nameOrPhone": this.form.nameOrPhone
				}
				// console.log(params)
				// 使表格加载
				that.tableLoading = true;
				// 查询接口
				selectMemberData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
						let result = [];
						if(data.data){
							if(data.data){
								data.data.forEach((val, index) => {
									result.push({
										isEdit: false,
										...val
									});
								})
								that.count = data.count;
								that.tableData = result;
							}
						}else if(data.messageType!="SUCCESS"){
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
			},
			//请求审核表格数据
			showTableTab(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"changeDateBegin":'',
					"changeDateEnd":''
				}
				if(this.formInfo.selectDate){
					if(this.formInfo.selectDate.length>0){
						params.changeDateBegin=this.formInfo.selectDate[0];
						params.changeDateEnd=this.formInfo.selectDate[1];
					}
				}
//				console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectMemberInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(JSON.stringify(data))
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.countTab = data.count;
							that.tableDataTab = result;
						}else if(data.messageType!="SUCCESS"){
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
			//修改详情
			iconEdit(index ,row){
            	var data = JSON.stringify(row);
				this.$router.push({
					name: '会员信息会员资料修改会员信息调整会员信息调整',
					params: {
						pageType: '修改',
                    	formData: data
					}
				});
			},
		},
		created() {
			this.showTable(this.page, this.limit);
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);
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
		padding: 0;
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
		text-align: right;
	}
	.width200{
		width: 200px;
	}
</style>