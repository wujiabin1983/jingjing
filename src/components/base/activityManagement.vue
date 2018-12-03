// 活动管理 - 组件
<template>
    <div>
        <el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline form">
                    <el-form-item label="活动类型">
                        <el-select v-model="form.activiteType" clearable placeholder="请选择活动类型">
                            <el-option label="会员权益类" value="会员权益类"></el-option>
                            <el-option label="生命周期类" value="生命周期类"></el-option>
                            <el-option label="消费鼓励类" value="消费鼓励类"></el-option>
                            <el-option label="消费享N倍积分" value="消费享N倍积分"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动状态">
                        <el-select v-model="form.activityStatus" clearable placeholder="请选择活动状态">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="未审核" value="未审核"></el-option>
                            <el-option label="正在执行" value="正在执行"></el-option>
                            <el-option label="已结束" value="已结束"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="">
                        <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-header>
        <el-card>
            <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column type="selection" width="50" label="选择"></el-table-column>
                <el-table-column prop="activityName" label="活动名称"></el-table-column>
                <el-table-column prop="activityType" label="活动类型"></el-table-column>
                <el-table-column prop="createdBy" label="创建人"></el-table-column>
                <el-table-column prop="activityDate" label="活动时间">
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
                <el-table-column prop="operationPersopn" label="审批人"></el-table-column>
                <el-table-column prop="operationDate" label="审批时间"></el-table-column>
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
    </div>
</template>
<script>
import {selectActivityData,selectAudioData,BeginData,stopData,deleteData,audioYesData,audioNoData,creatActivityData,selectActivityInfo} from '@/api/member/activityManagement'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
        	formLabelWidth:'120px',
        	selectData:{},
        	// 搜索数据
            form: {
                activiteType: '', //活动类型
                activityStatus: '', // 活动状态
                activityName:''//活动名称
            },
            // 表格数据
            tableData: [],
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
        	this.showTable(this.page, this.limit,this.form);
        },
        //活动列表查询方法
        showTable(start, limit, searchContent) {
            let that = this;
            let params = {
                userId: this.userInfo.userCode,
                page: start,
                limit: limit,
                activiteType: this.form.activiteType,
                activityStatus: this.form.activityStatus,
                activityName: this.form.activityName
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
//                  console.log(err);
                    that.tableLoading = false;
                });
        },
        
        
        // 新建活动
        creatActivity() {
            this.$router.push({
                name: '活动管理-添加',
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
		this.showTable(this.page, this.limit, this.form);
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
    display: block;
    // display: inline-block;
    // margin-left: rem(20px);
}
.el-form--inline .el-form-item{
	margin-bottom: 0px;
}
.form .el-form--inline .el-form-item{
	margin-bottom: 18px;
}
</style>