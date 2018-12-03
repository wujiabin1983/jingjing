<!--优惠券-优惠券库-->
<template>
	<el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="优惠券库列表" name="first">
				<el-header>
					<el-card>
						<el-form :inline="true" :model="form" class="demo-form-inline dean-form">
							<el-form-item class="floatLeft">
								<el-button type="primary" @click="addStore" v-if="roleBtn.addCouponLibraryInfo">新增优惠券</el-button>
							</el-form-item>
							<div class="floatRight">
								<el-form-item label="券类型">
									<el-select v-model="form.couponType" clearable placeholder="请选择券类型">
										<el-option label="全部" value=""></el-option>
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
									<el-button type="primary" @click="onReset">重置</el-button>
								</el-form-item>
							</div>
						</el-form>
					</el-card>
				</el-header>
				<el-card>
					<el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="coupId" width="145" label="券ID"></el-table-column>
						<el-table-column prop="couponType"  width="70" label="类型"></el-table-column>
						<el-table-column prop="coupTempName" width="160" label="券模板"></el-table-column>
						<el-table-column prop="coupName" label="券名称"></el-table-column>
						<el-table-column prop="wechatAuditStatus" width="110" label="微信审核状态"></el-table-column>
						<el-table-column prop="systemStatus" width="80" label="系统状态"></el-table-column>
						<el-table-column prop="createdBy" width="70" label="创建人"></el-table-column>
						<el-table-column prop="modifiedOn" width="145" label="最后编辑时间"></el-table-column>
						<el-table-column prop="operatorBy" width="70" label="审批人"></el-table-column>
						<el-table-column prop="action" label="操作">
							<!-- 功能图标 -->
							<template slot-scope="scope">
							    <!-- 查看 -->
	                        	<el-tooltip class="item" content="查看" placement="top">
	                                <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)"/>
	                            </el-tooltip>
							    <!-- 复制 -->
	                        	<el-tooltip class="item" content="复制" placement="top" v-if="roleBtn.copyCouponLibraryInfo">
	                                <icon-svg icon-class="copy" id="icon-copy" @click.native.prevent="iconCopy(scope.$index, scope.row)"/>
	                            </el-tooltip>
							    <!-- 修改 -->
	                        	<el-tooltip class="item" content="修改" placement="top" v-if="scope.row.systemStatus=='未审核'&&roleBtn.enableCouponLibraryInfo||scope.row.systemStatus=='已驳回'">
	                                <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconEdit(scope.$index, scope.row)"/>
	                            </el-tooltip>
                                <!-- 开启 -->
	                            <el-tooltip class="item" content="开启" placement="top" v-if="scope.row.systemStatus == '已禁用'&&roleBtn.enableCouponLibraryInfo">
	                                <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconBegin(scope.$index, tableData)"/>
	                            </el-tooltip>
                                <!-- 停用 -->
	                            <el-tooltip class="item" content="禁用" placement="top" v-if="scope.row.systemStatus == '已生效'&&roleBtn.disableCouponLibraryInfo">
	                                <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconStop(scope.$index, tableData)"/>
	                            </el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="审核列表" name="second">
				<el-card>
					<el-table ref="tableDataTab" v-loading="this.tableLoading" :data="tableDataTab" @selection-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="coupId" width="145" label="券ID"></el-table-column>
						<el-table-column prop="couponType" width="70" label="类型"></el-table-column>
						<el-table-column prop="coupTempName" width="160" label="券模板"></el-table-column>
						<el-table-column prop="coupName" label="券名称"></el-table-column>
						<el-table-column prop="wechatAuditStatus" width="110" label="微信审核状态"></el-table-column>
						<el-table-column prop="systemStatus" width="80" label="系统状态"></el-table-column>
						<el-table-column prop="createdBy" width="70" label="创建人"></el-table-column>
						<el-table-column prop="modifiedOn" width="145" label="最后编辑时间"></el-table-column>
						<el-table-column prop="operatorBy" width="70" label="审批人"></el-table-column>
						<el-table-column prop="action" label="操作">
							<template slot-scope="scope">
								<!-- 功能图标 -->
								<!-- 通过 -->
								<el-tooltip class="item" content="通过" placement="top">
									<icon-svg icon-class="audioYes" id="icon-audioYes" @click.native.prevent="iconAudioYes(scope.$index, scope.row)" />
								</el-tooltip>
								<!-- 驳回 -->
								<!--<el-tooltip class="item" content="驳回" placement="top">
									<icon-svg icon-class="audioNo" id="icon-audioNo" @click.native.prevent="iconAudioNo(scope.$index, scope.row)" />
								</el-tooltip>-->
								<!-- 查看详情 -->
								<el-tooltip class="item" content="查看详情" placement="top">
									<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index, scope.row)" />
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="countTab!=0">
						<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limitTab" :total="countTab" @size-change="handleSizeChangeTab" @current-change="handleCurrentChangeTab">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
		</el-tabs>
	</el-container>
</template>
<script>
	import { selectCouponLibrary,selectAudioCouponLibrary,couponLibraryAudioYes,couponLibraryAudioNo, addCouponLibrary,couponLibraryStop,couponLibraryBegin } from '@/api/member/couponLibrary'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
	        	formAudio:{
		        	reasonForRejection:'',//驳回理由
	        	},
				// 权限
				roleBtn: {
		            "addCouponLibraryInfo":false,
		            "disableCouponLibraryInfo":false,
		            "enableCouponLibraryInfo":false,
		            "selectCouponLibraryDtlInfo":false,
		            "copyCouponLibraryInfo":false
				},
        		handleStoreDialog:false,//驳回弹窗
	        	activeName: 'first',
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					coupLibraryKey: '', 
					couponType: ''
				},
				// 表格数据
				tableData: [],// 表格数据
//				{	"id": "记录ID",
//		"coupId": "劵Id",
//		"couponType": "代金券",
//		"coupTempName": "劵模板",
//		"coupName": "劵名称",
//		"wechatAuditStatus": "微信审核状态",
//		"systemStatus": "已禁用",
//		"createdBy": "创建人",
//		"modifiedOn": "最后编辑时间",
//		"operatorBy": "审批人",
//		"version": 1,}
	            tableDataTab: [],
	           
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
			onReset(){
				this.form= {
					coupLibraryKey: '', 
					couponType: ''
				};
			},
	    	//tab切换
	    	handleClick(tab, event) {
//	    		console.log(tab.label)
	    		if(this.tableDataTab.length==0&&tab.label=="审核列表"){
	    			this.showTableTab(this.pageTab, this.limitTab);
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
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form);
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form);
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
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"coupLibraryKey": searchContent.coupLibraryKey,
					"couponType": searchContent.couponType
				}
				// console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectCouponLibrary(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
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
						}else if(data.messageType != 'SUCCESS') {
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
					"limit": limit
				}
//				console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectAudioCouponLibrary(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.countTab = data.count;
							that.tableDataTab = result;
						}else if(data.messageType != 'SUCCESS') {
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
			//启用
			iconBegin(index,row){
	            let that = this;
	            this.tableLoading = true;
				this.$confirm('您确定要启用这条数据吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
		                userId: this.userInfo.userCode,
		            	id:row[index].id,
		            	version:row[index].version
		            };
		        	couponLibraryBegin(params)
		                .then(function(res) {
		                    // console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		                        that.tableLoading = false;
		        				that.showTable(that.page, that.limit,that.form);
		                    }else {
		                        that.$message.warning(data.messageContent);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
			},
			//禁用
			iconStop(index,row){
	            let that = this;
	            this.tableLoading = true;
				this.$confirm('您确定要禁用这条数据吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
		                userId: this.userInfo.userCode,
		            	id:row[index].id,
		            	version:row[index].version
		            };
		            // console.log(row[index])
		        	couponLibraryStop(params)
		                .then(function(res) {
		                    // console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		            			that.tableData.splice(index, 1);
		                        that.$message.success(data.messageContent);
		                        that.tableLoading = false;
		        				that.showTable(that.page, that.limit,that.form);
		                    }else {
		                        that.$message.warning(data.messageContent);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
			},
			//查看详情
			iconChakan(index ,row){
            	var data = JSON.stringify(row);
				this.$router.push({
					name: '优惠券优惠券库查询',
					params: {
						pageType: '查看',
						pageTypes: '查看',
                    	formData: data
					}
				});
			},
			//查看详情
			iconInfo(index ,row){
            	var data = JSON.stringify(row);
				this.$router.push({
					name: '优惠券优惠券库查询',
					params: {
						pageType: '查看',
						pageTypes: '审核',
                    	formData: data
					}
				});
			},
			//修改详情
			iconEdit(index ,row){
            	var data = JSON.stringify(row);
				this.$router.push({
					name: '优惠券优惠券库修改',
					params: {
						pageType: '修改',
                    	formData: data
					}
				});
			},
			//复制
			iconCopy(index ,row){
				var data = JSON.stringify(row);
				this.$router.push({
					name: '优惠券优惠券库复制',
					params: {
						pageType: '复制',
                    	formData: data
					}
				});
			},
			//	删除图标
			iconShanchu(index, row) {
				// console.log(index);
				let that =this;
				this.tableLoading = true;
	            this.$confirm('您确定要删除吗, 是否继续?', '提示', {
	            	confirmButtonText: '确定',
	            	cancelButtonText: '取消',
	            	type: 'warning'
	            }).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					deleteCouponTemplate(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							that.$message.error('系统错误！');
							// console.log(err);
						});
					this.tableLoading = false;
	            }).catch(() => {
	            });
			},
			// 添加表格数据
			addStore() {
				this.$router.push({
					name: '优惠券优惠券库新建优惠券',
					params: {
						pageType: '添加'
					}
				});
			},
			// 审核列表图标 - 通过
	        iconAudioYes(index, row) {
				let that =this;
				this.tableLoading = true;
	            this.$confirm('您确定要审核通过这条数据吗?', '提示', {
	            	confirmButtonText: '确定',
	            	cancelButtonText: '取消',
	            	type: 'warning'
	            }).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	version:row.version,
		            	id:row.id
		            };
		        	couponLibraryAudioYes(params)
		                .then(function(res) {
		                    // console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		    					that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
		                        that.tableLoading = false;
		                    }else {
		                        that.$message.warning(data.messageContent);
		    					that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
	        },
	        // 审核列表图标 - 驳回
	        iconAudioNo(index, row) {
	        	// console.log(JSON.stringify(row))
				let that =this;
				this.tableLoading = true;
	            this.$confirm('您确定要审核驳回这条数据吗?', '提示', {
	            	confirmButtonText: '确定',
	            	cancelButtonText: '取消',
	            	type: 'warning'
	            }).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	version:row.version,
		            	id:row.id
		            };
		            // console.log(params)
		        	couponLibraryAudioNo(params)
		                .then(function(res) {
		                    // console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		    					that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
		                        that.tableLoading = false;
		                    }else {
		                        that.$message.warning(data.messageContent);
		    					that.showTableTab(that.pageTab, that.limitTab);
								that.showTable(that.page, that.limit, that.form);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
	        }
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// console.log(JSON.stringify(this.roleBtn))
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化"
			if(this.getPageType=="审核查看"){
				this.activeName='second';	
    			this.showTableTab(this.pageTab, this.limitTab);
			}else{
				this.activeName='first';	
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
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
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
		}
	}
</style>