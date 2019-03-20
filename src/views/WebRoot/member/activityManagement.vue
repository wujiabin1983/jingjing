<!--营销活动 - 活动管理-->
<template>
    <el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="活动列表" name="first">
				<el-header>
		            <el-card class="overHidden">
		              <el-form :inline="true" :model="form" class="demo-form-inline form">
			                <div class="floatRight">
			               		<el-form-item label="活动类型">
				                    <el-select v-model="form.activiteType" clearable placeholder="请选择活动类型">
				                        <el-option label="会员权益类" value="会员权益类"></el-option>
				                        <el-option label="生命周期类" value="生命周期类"></el-option>
				                        <el-option label="消费激励类" value="消费激励类"></el-option>
				                        <el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
				                        <el-option label="事件触发" value="事件触发"></el-option>
				                    </el-select>
				                </el-form-item>
				                <el-form-item label="活动状态">
				                    <el-select v-model="form.activityStatus" clearable placeholder="请选择活动状态">
				                        <el-option label="全部" value=""></el-option>
				                        <el-option label="暂存" value="暂存"></el-option>
				                        <el-option label="未审核" value="未审核"></el-option>
				                        <el-option label="正在执行" value="正在执行"></el-option>
				                        <el-option label="已结束" value="已结束"></el-option>
				                        <el-option label="已停止" value="已停止"></el-option>
				                        <el-option label="未通过" value="未通过"></el-option>
				                        <el-option label="待执行" value="待执行"></el-option>
				                    </el-select>
				                </el-form-item>
			                    <el-form-item  label="">
			                        <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
			                    </el-form-item>
			                    <el-form-item>
			                        <el-button type="primary" @click="onSubmit">查询</el-button>
									<el-button type="primary" @click="onReset">重置</el-button>
			                    </el-form-item>
			                </div>
		                </el-form>
		            </el-card>
		            <el-card class="overHidden">
	            		<el-button type="primary" @click="creatActivity" v-if="roleBtn.addActivityManagementInfo">新建活动</el-button>
                		<el-button type="primary" @click="templateCreatActivity" v-if="roleBtn.createActiveTemplateInfo">模板创建活动</el-button>
		            </el-card>
		        </el-header>
	            <el-card>
	                <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
	                    <el-table-column type="index" width="50" label="序号"></el-table-column>
<!--	                    <el-table-column type="selection" width="50" label="选择"></el-table-column>
-->	                    <el-table-column prop="activityId" label="活动ID"></el-table-column>
						<el-table-column prop="activityName" label="活动名称"></el-table-column>
	                    <el-table-column prop="activityType" label="活动类型"></el-table-column>
	                    <el-table-column prop="createdBy" label="创建人"></el-table-column>
	                    <el-table-column prop="activityDate" width="180" label="活动时间">
	                    	<template slot-scope="scope" >
	                    		<div v-if="scope.row.activityDate!='长期'">
	                    			{{scope.row.activityDate.activityDateBegin+" ~ "+scope.row.activityDate.activityDateEnd}}
	                    		</div>
	                    		<div v-else>
	                    			{{scope.row.activityDate}}
	                    		</div>
	                    	</template>
	                    </el-table-column>
	                    <el-table-column prop="activityStatus" label="活动状态"></el-table-column>
	                    <el-table-column prop="auditBy" label="审批人"></el-table-column>
	                    <el-table-column prop="auditDate" width="160" label="审批时间"></el-table-column>
	                    <el-table-column prop="action" label="操作">
	                        <template slot-scope="scope">
	                                <!-- 查看 -->
	                        	<el-tooltip class="item" content="查看" placement="top">
	                        		<i class="iconfont icon-view" @click.prevent="iconInfo(scope.$index, scope.row)" ></i>
	                                <!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index, scope.row)"/> -->
	                            </el-tooltip>
	                                <!-- 修改--> 
	                            <el-tooltip class="item" content="修改" placement="top" v-if="scope.row.activityStatus == '暂存'&&roleBtn.updateActivityManagementInfo">
	                            	<i class="iconfont icon-edit" @click.prevent="iconEdit(scope.$index, scope.row)" ></i>
	                                <!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconEdit(scope.$index, scope.row)"/> -->
	                            </el-tooltip>
	                                <!-- 开启 -->
	                            <el-tooltip class="item" content="启用" placement="top" v-if="scope.row.activityStatus == '已停止'&&roleBtn.enableActivityManagementInfo">
	                            	<i class="iconfont icon-shezhiqiyong" @click.prevent="iconBegin(scope.$index, tableData)" ></i>
	                                <!-- <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconBegin(scope.$index, tableData)"/> -->
	                            </el-tooltip>
	                                <!-- 停用 -->
	                            <el-tooltip class="item" content="停止" placement="top" v-if="scope.row.activityStatus == '正在执行'&&roleBtn.disableActivityManagementInfo">
	                            	<i class="iconfont icon-forbidden" @click.prevent="iconStop(scope.$index, tableData)" ></i>
	                                <!-- <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconStop(scope.$index, tableData)"/> -->
	                            </el-tooltip>
	                                <!-- 删除 -->
	                            <el-tooltip class="item" content="删除" placement="top" v-if="scope.row.activityStatus == '暂存'||scope.row.activityStatus == '未通过'&&roleBtn.deleteActivityManagementInfo">
	                            	<i class="iconfont icon-delete" @click.prevent="iconDelete(scope.$index, scope.row)" ></i>
	                                <!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconDelete(scope.$index, scope.row)"/> -->
	                            </el-tooltip>
	                        </template>
	                    </el-table-column>
	                </el-table>
	                <!-- 分页 -->
	                <el-footer v-if="count != 0">
	                    <el-pagination 
	                        background 
	                        class="pagination" 
	                        layout="total, sizes,prev, pager, next, jumper" 
	                        :page-size="limit"
	                        :total="count" 
	                        @size-change="handleSizeChange" 
	                        @current-change="handleCurrentChange">
	                    </el-pagination>
	                </el-footer>
	            </el-card>
			</el-tab-pane>
			<el-tab-pane label="审核列表" name="second" v-if="roleBtn.checkActivityManagementInfo">
				<el-header>
		            <el-card>
						<el-form :inline="true" :model="formTab" class="demo-form-inline">
			                <div class="floatRight">
				                <el-form-item label="活动类型">
				                    <el-select v-model="formTab.activiteType" clearable placeholder="请选择活动类型">
				                        <el-option label="会员权益类" value="会员权益类"></el-option>
				                        <el-option label="生命周期类" value="生命周期类"></el-option>
				                        <el-option label="消费激励类" value="消费激励类"></el-option>
				                        <el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
				                        <el-option label="其他" value="其他"></el-option>
				                    </el-select>
				                </el-form-item>
			                    <el-form-item  label="">
			                        <el-input v-model="formTab.activityName" placeholder="请输入活动名称"></el-input>
			                    </el-form-item>
			                    <el-form-item>
			                        <el-button type="primary" @click="onSubmitTab">查询</el-button>
									<el-button type="primary" @click="onResetTab">重置</el-button>
			                    </el-form-item>
			                   </div>
		                </el-form>
		            </el-card>
		        </el-header>
	            <el-card>
	                <el-table ref="tableDataTab" v-loading="this.tableLoading" :data="tableDataTab" @selection-change="handleSelectionChangeTab">
	                    <el-table-column type="index" width="50" label="序号"></el-table-column>
<!--	                    <el-table-column type="selection" width="50" label="选择"></el-table-column>-->
	                    <el-table-column prop="activityId" label="活动ID"></el-table-column>
	                    <el-table-column prop="activityName" label="活动名称"></el-table-column>
	                    <el-table-column prop="activityType" label="活动类型"></el-table-column>
	                    <el-table-column prop="createdBy" label="创建人"></el-table-column>
	                    <el-table-column prop="createdOn" label="创建时间"></el-table-column>
	                    <el-table-column prop="activityStatus" label="活动状态"></el-table-column>
	                    <el-table-column prop="auditBy" label="审批人"></el-table-column>
	                    <!--<el-table-column prop="auditDate" label="审批时间"></el-table-column>-->
	                    <el-table-column prop="action" label="操作">
	                        <template slot-scope="scope">
	                            <!-- 功能图标 -->
	                                <!-- 查看详情 -->
	                            <el-tooltip class="item" content="查看详情" placement="top">
	                            	<i class="iconfont icon-view" @click.prevent="iconInfo(scope.$index,  scope.row)" ></i>
	                                <!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index,  scope.row)"/> -->
	                            </el-tooltip>
	                                <!-- 通过 -->
	                            <el-tooltip class="item" content="通过" placement="top">
	                            	<i class="iconfont icon-shenhetongguo" @click.prevent="iconAudioYes(scope.$index, scope.row)" ></i>
	                                <!-- <icon-svg icon-class="audioYes" id="icon-audioYes" @click.native.prevent="iconAudioYes(scope.$index, scope.row)"/> -->
	                            </el-tooltip>
	                                <!-- 驳回 -->
	                            <el-tooltip class="item" content="驳回" placement="top">
	                            	<i class="iconfont icon-shenhebutongguo" @click.prevent="iconAudioNo(scope.$index, tableData)" ></i>
	                                <!-- <icon-svg icon-class="audioNo" id="icon-audioNo" @click.native.prevent="iconAudioNo(scope.$index, tableData)"/> -->
	                            </el-tooltip>
	                        </template>
	                    </el-table-column>
	                </el-table>
	                <!-- 分页 -->
	                <el-footer v-if="count != 0">
	                    <el-pagination 
	                        background 
	                        class="pagination" 
	                        layout="total, sizes,prev, pager, next, jumper" 
	                        :page-size="limitTab"
	                        :total="countTab" 
	                        @size-change="handleSizeChangeTab" 
	                        @current-change="handleCurrentChangeTab">
	                    </el-pagination>
	                </el-footer>
	            </el-card>
			</el-tab-pane>
		</el-tabs>
		<el-dialog title="驳回" :visible.sync="handleStoreDialog">
			<el-form :model="formAudio" ref="formName" :rules="rules"  class="width80">
				<el-form-item label="驳回理由" prop="reasonForRejection" :label-width="formLabelWidth">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入驳回理由" v-model="formAudio.reasonForRejection">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleStoreDialog = false,tableLoading = false">取 消</el-button>
				<el-button type="primary" @click="addLabelFn">确 定</el-button>
			</div>
		</el-dialog>
  </el-container>
</template>
<script>
import {selectActivityData,selectAudioData,BeginData,stopData,deleteData,audioYesData,audioNoData,creatActivityData,selectActivityInfo} from '@/api/member/activityManagement'
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
				"addActivityManagementInfo":false,
				"updateActivityManagementInfo":false,
				"deleteActivityManagementInfo":false,
				"disableActivityManagementInfo":false,
				"enableActivityManagementInfo":false,
				"createActiveTemplateInfo":false,
				"checkActivityManagementInfo":false
			},
        	handleStoreDialog:false,//驳回弹窗
        	activeName: 'first',
        	formLabelWidth:'120px',
        	selectData:{},
        	// 搜索数据
            form: {
            	activityId: '',//活动ID
                activiteType: '', //活动类型
                activityStatus: '', // 活动状态
                activityName:''//活动名称
            },
            formTab: {
                activiteType: '', //活动类型
                activityName:''//活动名称
            },
            // 表格数据
            tableData: [],
//          {
//          	id:'12313',
//              activiteType: '2', //活动类型
//              activityStatus: '正在执行', // 活动状态
//              creater:'',//创建人
//              activityDate:'',//活动时间
//              operationPersopn:'',//审核人
//              operationDate:'',//审核时间
//              activityName:''//活动名称
//          }
            // 表格数据
            tableDataTab: [],
//          {
//          	id:'12313',
//              activiteType: '1', //活动类型
//              activityStatus: '', // 活动状态
//              creater:'',//创建人
//              activityDate:'',//活动时间
//              operationPersopn:'',//审核人
//              operationDate:'',//审核时间
//              activityName:''//活动名称
//          }
            // 表格多选
            multipleSelection: [],
            multipleSelectionTab: [],
            // 表格是否为加载状态
            tableLoading: false,
            // 活动分页
            page: 0, // 当前页
            count: 0, // 总条数
            limit: this.GLOBAL.limit, // 条/页
			rules: {
                reasonForRejection: [
                    { required: true, message: '请输入驳回理由', trigger: 'change' },
                    { max: 100, message: '最小长度为20', trigger: 'change' }       
                ]
            },
            tabType:'',
            // 审核分页
            pageTab: 0, // 当前页
            countTab: 0, // 总条数
            limitTab: this.GLOBAL.limit // 条/页
        }
    },
    methods: {
    	onReset(){
    		this.form= {
                activiteType: '', //活动类型
                activityStatus: '', // 活动状态
                activityName:'',//活动名称
                activityId:''//活动ID
           };
    	},
    	onResetTab(){
            this.formTab= {
                activiteType: '', //活动类型
                activityName:'',//活动名称
                activityId:''//活动ID
            };
    	},
    	//tab切换
    	handleClick(tab, event) {
    		this.tabType = event.target.firstChild.data;
			if(this.tabType=="活动列表"){
				this.showTable(this.page, this.limit,this.form);
			}else{
				this.showTableTab(this.pageTab, this.limitTab, this.formTab);
			}
    	},
    	// 活动列表表格选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    	// 审核列表表格选择数据
        handleSelectionChangeTab(val) {
            this.multipleSelectionTab = val;
        },
    	// 活动列表分页
        handleCurrentChange(val) {
            this.page = val;
            this.showTable(val, this.limit, this.form);
        },
    	// 审核列表分页
        handleCurrentChangeTab(val) {
            this.page = val;
            this.showTableTab(val, this.limit, this.formTab);
        },
        // 活动列表查询按钮
        onSubmit() {
        	this.showTable('', this.limit,this.form);
        },
        // 审核列表查询按钮
        onSubmitTab() {
        	this.showTableTab('', this.limitTab,this.formTab);
        },
        handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit,this.form);
		},
		handleSizeChangeTab(val) {
			this.limitTab = val;
			this.showTableTab(this.pageTab, this.limitTab,this.formTab);
		},
        //活动列表查询方法
        showTable(start, limit, searchContent) {
            let that = this;
            let params = {
                userId: this.userInfo.userCode,
                page: start,
                limit: limit,
                activiteType: searchContent.activiteType,
                activityStatus: searchContent.activityStatus,
                activityName: searchContent.activityName,
                activityId: searchContent.activityId
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
//          console.log(params)
            selectActivityData(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
                	// console.log(JSON.stringify(data)+"列表");
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
                    // console.log(err);
                    that.tableLoading = false;
                });
        },
        //审核列表查询方法
        showTableTab(start, limit, searchContent) {
            let that = this;
            let params = {
                userId: this.userInfo.userCode,
                page: start,
                limit: limit,
                listType:"审核列表",
                activiteType: searchContent.activiteType,
                activityName:searchContent.activityName,
                activityId:searchContent.activityId
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
//          console.log(params)
            selectAudioData(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    // console.log(JSON.stringify(data)+"审核列表");
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
					}else if(data.messageType != 'SUCCESS'){
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
        // 活动列表图标 - 查看详情
        iconInfo(index, row) {
        	var that = this;
            var params =  {
            	userId : this.userInfo.userCode,
            	id : row.id
            };
            selectActivityInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
//                  console.log(JSON.stringify(data))
					if(data.messageType!="SUCCESS"){
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
					}else{
			            that.$router.push({
			                name: '营销活动活动管理查询',
			                params: {
                   			 	pageTypes: '活动列表',
			                    pageType: '查看',
			                    formData: JSON.stringify(data.messageContent)
			                }
			            });
					}
                    that.tableLoading = false;
                })
                .catch(function(err) {
                    // console.log(err);
                    that.tableLoading = false;
                });
        },
        // 活动列表图标 - 修改
        iconEdit(index, row) {
        	var that = this;
            var params =  {
            	userId : this.userInfo.userCode,
            	id : row.id
            };
            selectActivityInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
					if(data.messageType!="SUCCESS"){
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
					}else{
			            that.$router.push({
			                name: '营销活动活动管理修改',
			                	params: {
			                    pageType: '修改',
			                    formData: JSON.stringify(data.messageContent)
			                }
			            });
					}
                    that.tableLoading = false;
                })
                .catch(function(err) {
                    // console.log(err);
                    that.tableLoading = false;
                });
		    },
        // 活动列表图标 - 开启
        iconBegin(index, row) {
            let that = this;
            this.tableLoading = true;
        	this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	id:row[index].id,
		            	version:row[index].version
		            };
		        	BeginData(params)
		                .then(function(res) {
		                    let data = JSON.parse(Base64.decode(res.data));
		                    // console.log(data);
							if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		                        that.tableLoading = false;
		        				that.showTable(that.page, that.limit,that.form);
		                    }else {
		                        that.$message.error(data.messageContent);
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
        // 活动列表图标 - 停止
        iconStop(index, row) {
            let that = this;
            this.tableLoading = true;
        	this.$confirm('您确定要停止这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	id:row[index].id,
		            	version:row[index].version
		            };
		            // console.log(params)
		        	stopData(params)
		                .then(function(res) {
		                    let data = JSON.parse(Base64.decode(res.data));
		                    // console.log(data);
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		                        that.tableLoading = false;
		        				that.showTable(that.page, that.limit,that.form);
		                    }else {
		                        that.$message.error(data.messageContent);
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
        // 活动列表图标 - 删除
        iconDelete(index, row) {
            let that = this;
            this.tableLoading = true;
            this.$confirm('您确定要删除吗, 是否继续?', '提示', {
            	confirmButtonText: '确定',
            	cancelButtonText: '取消',
            	type: 'warning'
            }).then(() => {
	            var params = {
	                userId: this.userInfo.userCode,
	            	id:row.id
	            };
	            // console.log(params)
	        	deleteData(params)
	                .then(function(res) {
	                    // console.log(res);
	                    let data = JSON.parse(Base64.decode(res.data));
	                    if(data.messageType == 'SUCCESS') {
	                        that.$message.success(data.messageContent);
	                        that.tableLoading = false;
	        				that.showTable(that.page, that.limit,that.form);
	                    }else {
	                        that.$message.error(data.messageContent);
	                        that.tableLoading = false;
	                    }
	                })
	                .catch(function(err) {
	                    // console.log(err);
	                    that.tableLoading = false;
	                });
            }).catch(() => {
	            this.tableLoading = false;
            });
        },
        // 审核列表图标 - 查看详情
        iconChakan(index, row) {
            var data = JSON.stringify(row);
            this.$router.push({
                name: '营销活动活动管理查询',
                params: {
                    pageTypes: '审核',
                    pageType: '查看',
                    formData: data
                }
            });
        },
        // 审核列表图标 - 通过
        iconAudioYes(index, row) {
            let that = this;
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
	            // console.log(params)
	        	audioYesData(params)
	                .then(function(res) {
	//                  console.log(res);
	                    let data = JSON.parse(Base64.decode(res.data));
	                    if(data.messageType == 'SUCCESS') {
	                        that.$message.success(data.messageContent);
	        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
	        				that.showTable(that.page, that.limit,that.form);
	                        that.tableLoading = false;
	                    }else {
	        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
	        				that.showTable(that.page, that.limit,that.form);
	                        that.$message.error(data.messageContent);
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
        //驳回弹窗确定
        addLabelFn(){
            this.handleStoreDialog=false;
			this.$refs['formName'].validate((valid) => {
				if(valid) {
		        	var params = {
		                userId: this.userInfo.userCode,
		            	id:this.selectData.id,
            			version:this.selectData.version,
		            	reclaimRemark :this.formAudio.reasonForRejection
		            };
		            // console.log(JSON.stringify(params))
		            let that = this;
		        	audioNoData(params)
		                .then(function(res) {
		                    // console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
		        				that.showTable(that.page, that.limit,that.form);
		                        that.tableLoading = false;
		                    }else {
		                        that.$message.error(data.messageContent);
		        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
		        				that.showTable(that.page, that.limit,that.form);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }
			});
        },
        // 审核列表图标 - 驳回
        iconAudioNo(index, row) {
            let that = this;
            this.tableLoading = true;
            this.$confirm('您确定要审核通过这条数据吗?', '提示', {
            	confirmButtonText: '确定',
            	cancelButtonText: '取消',
            	type: 'warning'
            }).then(() => {
	         	this.selectData=this.tableDataTab[index];
	            this.handleStoreDialog=true;
            }).catch(() => {
				that.tableLoading = false;
			});
        },
        // 新建活动
        creatActivity() {
            this.$router.push({
                name: '营销活动活动管理添加',
                params: {
                    pageType: '添加'
                }
            });
        },
        // 模板创建活动
        templateCreatActivity() {
            this.$router.push({
                name: '活动模板'
            });
        },
    },
    created() {
        // 钩子函数 -- 初始化
		// 权限
		this.roleBtn = permission(this.roleBtn);
		this.showTable(this.page, this.limit,this.form);
        sessionStorage.removeItem("dataOne");
        sessionStorage.removeItem("dataTwo");
        sessionStorage.removeItem("dataThree");
        sessionStorage.removeItem("memberSelect");
        if(this.getPageType){
        	if(this.getPageType=="审核"){
        		this.activeName="second";
        	}else{
        		this.activeName="first";
        	}
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
.width80{
	width: 80%;
}
.el-form {
	display: unset;
	overflow: hidden;
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>