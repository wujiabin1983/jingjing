<!--营销活动 - 活动模板-->
<template>
    <el-container class="app-container">
		<el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline form">
	                <el-form-item class="floatLeft">
                     	<el-button type="primary" @click="creatActivity" v-if="roleBtn.addActiveTemplate">新建模板</el-button>
					</el-form-item>
	                <div class="floatRight">
	                	<el-form-item label="活动类型">
		                    <el-select v-model="form.activityType" clearable placeholder="请选择活动类型">
		                        <el-option label="会员权益类" value="会员权益类"></el-option>
		                        <el-option label="生命周期类" value="生命周期类"></el-option>
		                        <el-option label="消费激励类" value="消费激励类"></el-option>
		                        <el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
		                        <el-option label="其他" value="其他"></el-option>
		                    </el-select>
		                </el-form-item>
		                <el-form-item label="模板类型">
		                    <el-select v-model="form.tempType" clearable placeholder="请选择活动状态">
		                        <el-option label="全部" value=""></el-option>
		                        <el-option label="预置模板" value="预置模板"></el-option>
		                        <el-option label="我的模板" value="我的模板"></el-option>
		                    </el-select>
		                </el-form-item>
	                    <el-form-item  label="">
	                        <el-input v-model="form.templateName" placeholder="请输入模板名称"></el-input>
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
            <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="templateName" label="模板名称"></el-table-column>
                <el-table-column prop="tempType" label="模板类型"></el-table-column>
                <el-table-column prop="activityType" label="活动类型"></el-table-column>
                <el-table-column prop="templateDesc" label="模板简介"></el-table-column>
                <el-table-column prop="createdBy" label="创建人"></el-table-column>
                <el-table-column prop="createdOn" label="创建时间"></el-table-column>
                <el-table-column prop="action" label="操作">
                    <template slot-scope="scope">
                            <!-- 查看 -->
                    	<el-tooltip class="item" content="查看" placement="top">
                            <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index, scope.row)"/>
                        </el-tooltip>
                            <!-- 修改--> 
                        <el-tooltip class="item" content="修改" placement="top" v-if="scope.row.tempType != '预置模板'&&roleBtn.updateActiveTemplate">
                            <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconEdit(scope.$index, scope.row)"/>
                        </el-tooltip>
                            <!-- 复制模板 -->
                        <el-tooltip class="item" content="复制模板" placement="top" v-if="roleBtn.copyActiveTemplate">
                            <icon-svg icon-class="copy" id="icon-copy" @click.native.prevent="iconCopyTemplate(scope.$index, scope.row)"/>
                        </el-tooltip>
                            <!-- 创建活动 -->
                        <el-tooltip class="item" content="创建活动" placement="top" v-if="roleBtn.addActivityManagementInfo1">
                            <icon-svg icon-class="creatActivity" id="icon-creatActivity" @click.native.prevent="iconCreateActivity(scope.$index, scope.row)"/>
                        </el-tooltip>
                            <!-- 删除 -->
                        <el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteActiveTemplate&&scope.row.tempType != '预置模板'">
                            <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconDelete(scope.$index, scope.row)"/>
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
  </el-container>
</template>
<script>
import {selectTemplateData,deleteData,selectTemplateInfo} from '@/api/member/activeTemplate'
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
	            "addActiveTemplate":false,
	            "updateActiveTemplate":false,
	            "copyActiveTemplate":false,
	            "deleteActiveTemplate":false,
	            "addActivityManagementInfo1":false
			},
        	handleStoreDialog:false,//驳回弹窗
        	activeName: 'first',
        	formLabelWidth:'120px',
        	selectData:{},
        	// 搜索数据
            form: {
                activityType: '', //活动类型
                tempType: '', // 活动状态
                templateName:''//活动名称
            },
            formTab: {
                activityType: '', //活动类型
                activityName:''//活动名称
            },
            // 表格数据
            tableData: [],
//          {
//          	id:'12313',
//              activityType: '2', //活动类型
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
//              activityType: '1', //活动类型
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
            // 审核分页
            pageTab: 0, // 当前页
            countTab: 0, // 总条数
            limitTab: this.GLOBAL.limit // 条/页
        }
    },
    methods: {
    	onReset(){
    		this.form= {
                activityType: '', //活动类型
                tempType: '', // 活动状态
                templateName:''//活动名称
            };
    	},
    	//tab切换
    	handleClick(tab, event) {
            this.showTableTab(this.pageTab, this.limitTab, this.formTab);
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
        handleSizeChange(val) {
            this.limit = val;
            this.showTable(this.page, this.limit, this.form);
        },
        // 活动列表查询按钮
        onSubmit() {
        	this.showTable('', this.limit,this.form);
        },
        //活动列表查询方法
        showTable(start, limit, searchContent) {
            let that = this;
            let params = {
                userId: this.userInfo.userCode,
                page: start,
                limit: limit,
                tempType: searchContent.tempType,
                activityType: searchContent.activityType,
                templateName: searchContent.templateName
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
//             console.log(params)
            selectTemplateData(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
                	// console.log(JSON.stringify(data)+"模板");
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
        // 活动列表图标 - 查看详情
        iconInfo(index, row) {
        	var that = this;
            var params =  {
            	userId : this.userInfo.userCode,
            	id : row.id
            };
            selectTemplateInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
					if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
					}else{
//						console.log(JSON.stringify(data.returnMsg))
			            that.$router.push({
			                name: '营销活动活动模板查询',
			                params: {
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
            selectTemplateInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
					if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
					}else{
			            that.$router.push({
			                name: '营销活动活动模板修改',
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
	//          console.log(params)
	        	deleteData(params)
	                .then(function(res) {
	//                  console.log(res);
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
	            this.tableLoading = true;
            });
        },
        // 审核列表图标 - 查看详情
        iconChakan(index, row) {
            var data = JSON.stringify(row);
            this.$router.push({
                name: '活动模板 - 查看',
                params: {
                    pageType: '查看',
                    formData: data
                }
            });
        },
        // 新建活动
        creatActivity(index,row) {
            this.$router.push({
                name: '营销活动活动模板添加',
                params: {
                    pageType: '添加'
                }
            });
        },
        //创建活动
        iconCreateActivity(index,row){
            var that = this;
            var params =  {
            	userId : this.userInfo.userCode,
            	id : row.id
            };
            selectTemplateInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
//                  console.log(JSON.stringify(data))
					if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
					}else{
			            that.$router.push({
			                name: '营销活动活动模板创建活动',
			                params: {
			                    pageType: '创建',
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
        //复制模板
        iconCopyTemplate(index,row){
            var that = this;
            var params =  {
            	userId : this.userInfo.userCode,
            	id : row.id
            };
            selectTemplateInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
//                  console.log(JSON.stringify(data))
					if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
					}else{
			            that.$router.push({
			                name: '营销活动活动模板复制',
			                params: {
			                    pageType: '复制',
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
        }
    },
    created() {
		this.showTable(this.page, this.limit,this.form);
		// 权限
		this.roleBtn = permission(this.roleBtn);
		// console.log(JSON.stringify(this.roleBtn))
        // 钩子函数 -- 初始化
        sessionStorage.removeItem("dataOne");
        sessionStorage.removeItem("dataTwo");
        sessionStorage.removeItem("dataThree");
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
	display: unset;
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>