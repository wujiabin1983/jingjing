<!--门店活动-->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item class="floatLeft">
                        <el-button type="primary" @click="shoppingGuide">新建活动</el-button>
                    </el-form-item>
                    <div class="floatRight">
                    	<el-form-item>
	                        <el-input v-model="form.activityTitle" placeholder="请输入活动标题"></el-input>
	                    </el-form-item>
	                    <el-form-item>
	                		<el-button type="primary" @click="onSubmit">查询</el-button>
	                    </el-form-item>
                    </div>
                </el-form>
            </el-card>
        </el-header>
        <el-main>
            <el-card>
                <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="activityTitle" label="活动标题"></el-table-column>
                    <el-table-column prop="browseCount" label="浏览次数"></el-table-column>
                    <el-table-column prop="shareNum" label="分享次数"></el-table-column>
                    <el-table-column prop="createBy" label="创建人"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            
                            <!-- 修改 -->
                            <el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit">
                                <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)"/>
                            </el-tooltip>
                            <el-tooltip class="item" content="删除" placement="top">
                                <!-- 删除 -->
                                <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)"/>
                            </el-tooltip>
                            <el-tooltip class="item" content="发送" placement="top">
                                <!-- 发送邮件 -->
                                <icon-svg icon-class="email" id="icon-email" @click.native.prevent="iconEmail(scope.$index, scope.row)"/>
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

                <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="60%">
                    <div>
                        <el-form :model="pushForm" ref="pushForm" :rules="pushRules" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="短信内容" prop="msgDesc">
                                <el-input type="textarea" v-model="pushForm.msgDesc" resize="none" placeholder="请输入短信内容"></el-input>
                            </el-form-item>
                            <el-form-item label="发送对象">
                                <div>(活动创建时适用门店的会员)</div>
                               <el-radio-group v-model="type" @change="handleSendObjType">
                                    <el-radio label="全部">全部</el-radio>
                                    <el-radio label="按条件筛选">按条件筛选</el-radio>
                                </el-radio-group>
                                <el-card v-if="type == '按条件筛选'">
                                    <el-form-item label="性别">
                                        <el-radio-group v-model="pushForm.sendObj.gender">
                                            <el-radio label="不限">不限</el-radio>
                                            <el-radio label="女">女</el-radio>
                                            <el-radio label="男">男</el-radio>
                                            <el-radio label="未知">未知</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="会员等级">
                                        <!-- <el-input v-model="pushForm.sendObj.memberLevel" :disabled="true" placeholder="请输入会员等级" class="inline-width"></el-input> -->
                                        <el-select v-model="pushForm.sendObj.memberLevel" placeholder="请选择" @change="levalSelect" class="inline-width">
                                            <el-option v-for="item in levalInfo" :key="item.key" :label="item.key" :value="item.index">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="会员消费">
                                        <el-radio-group class="radioGroupBlock" v-model="pushForm.sendObj.memberConsume.type" @change="consumptionHandle">
                                            <el-radio label="单笔消费">
                                                单笔消费
                                                <span v-if="pushForm.sendObj.memberConsume.type=='单笔消费'">
                                                    <el-select v-model="pushForm.sendObj.memberConsume.operator" placeholder="请选择" class="inline-width" :disabled="pushForm.sendObj.memberConsume.type!='单笔消费'">
                                                        <el-option label="大于" value="大于"></el-option>
                                                        <el-option label="等于" value="等于"></el-option>
                                                        <el-option label="小于" value="小于"></el-option>
                                                    </el-select>
                                                    <el-input v-model="pushForm.sendObj.memberConsume.money" placeholder="请输入金额" class="inline-width" :disabled="pushForm.sendObj.memberConsume.type!='单笔消费'"></el-input>
                                                    <span>元</span>
                                                </span>
                                            </el-radio>
                                            <el-radio label="累计消费">
                                                累计消费
                                                <span v-if="pushForm.sendObj.memberConsume.type=='累计消费'">
                                                    <el-select v-model="pushForm.sendObj.memberConsume.operator" placeholder="请选择" class="inline-width" :disabled="pushForm.sendObj.memberConsume.type!='累计消费'">
                                                        <el-option label="大于" value="大于"></el-option>
                                                        <el-option label="等于" value="等于"></el-option>
                                                        <el-option label="小于" value="小于"></el-option>
                                                    </el-select>
                                                    <el-input v-model="pushForm.sendObj.memberConsume.money" placeholder="请输入金额" class="inline-width" :disabled="pushForm.sendObj.memberConsume.type!='累计消费'"></el-input>
                                                    <span>元</span>
                                                </span>
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="入会时长">
                                        <span>入会</span>
                                        <el-input v-model="pushForm.sendObj.years" placeholder="请输入入会时长" class="inline-width"></el-input>
                                    </el-form-item>
                                    <el-form-item label="生日当天会员">
                                        <el-radio-group v-model="pushForm.sendObj.dBirthday">
                                            <el-radio label="是">是</el-radio>
                                            <el-radio label="否">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="生日当月会员">
                                        <el-radio-group v-model="pushForm.sendObj.mBirthday">
                                            <el-radio label="是">是</el-radio>
                                            <el-radio label="否">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-card>
                            </el-form-item>
                            <el-form-item label="发送时间" class="height80">
                                <el-radio-group v-model="pushForm.executeType" @change="handleSelectExecuteType">
                                    <el-radio label="立即发送">立即发送</el-radio>
                                    <el-radio label="定时发送">定时发送</el-radio>
                                </el-radio-group>
                                <el-form-item v-if="pushForm.executeType == '定时发送'">
                                    <el-date-picker
                                        v-model="pushForm.sendDate"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeDialogVisible">取 消</el-button>
                        <el-button type="primary" @click="handleSure">确 定</el-button>
                    </span>
                </el-dialog>
            </el-card>
        </el-main>
    </el-container>
</template>
<script>
import { selectShopActivitiesData,deleteData, pushSMS} from '@/api/tool/shopActivities'
import {selectLevalInfo} from '@/api/public'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            // 搜索数据
            form: {
                activityTitle: '' // 活动标题
            },
            pushForm: {
                'storeActivityId':'',
                "msgDesc":"",
                "sendObj": { // 发送对象(全部/按条件筛选)
                    'gender' : '不限', // 性别(不限/女/男/未知)
                    'memberLevel' : '', // 会员等级
                    'memberConsume' : { // 会员消费
                        'type' : '', // 单笔/累计
                        'operator' : '', // 大于/等于/小于
                        'money' : '' // 元
                    },
                    'years' : '', // 入会时长
                    'dBirthday' : '否', // 生日当天会员(是/否)
                    'mBirthday' : '否' // 生日当月会员(是/否)
                },
                "executeType":"立即发送", // 执行类型(立即发送、定时发送)
                "sendDate":"" // 发送时间(立即发送时为空)
            },
            'type': '全部', // (全部/按条件筛选)
            pushRules: {
                msgDesc: [
                    { required: true, message: '请输入短信内容', trigger: 'change' },
                ]
            },
            levalInfo: [], //会员等级
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
            dialogVisible: false // 发送邮件
        }
    },
    
    methods: {
    	closeDialogVisible(){
    		this.dialogVisible=false;
    		this.pushForm = {
                'storeActivityId':'',
                "msgDesc":"",
                "sendObj": { // 发送对象(全部/按条件筛选)
                    'gender' : '不限', // 性别(不限/女/男/未知)
                    'memberLevel' : '', // 会员等级
                    'memberConsume' : { // 会员消费
                        'type' : '', // 单笔/累计
                        'operator' : '', // 大于/等于/小于
                        'money' : '' // 元
                    },
                    'years' : '', // 入会时长
                    'dBirthday' : '否', // 生日当天会员(是/否)
                    'mBirthday' : '否' // 生日当月会员(是/否)
                },
                "executeType":"立即发送", // 执行类型(立即发送、定时发送)
                "sendDate":"" // 发送时间(立即发送时为空)
           };
    	},
        handleSure() {
			let type= this.type;
            this.$refs.pushForm.validate((valid) => {
                if (valid) {
//                  this.dialogVisible = false;
                    let form = JSON.parse(JSON.stringify(this.pushForm));
                    if(type == '全部') {
                        this.pushForm.sendObj = '全部';
                    }else{
                    	this.pushForm.sendObj.memberLevel = this.pushForm.sendObj.levalName;
                    }
                    let params = {
                        "userId" : this.userInfo.userCode,
                        ...this.pushForm
                    }
                    if(params.sendObj.memberConsume){
                    	if(params.sendObj.memberConsume.type!=""){
                    		params.sendObj.memberConsume.type=="单笔消费"?params.sendObj.memberConsume.type="单笔":params.sendObj.memberConsume.type="累计";
                    	}
                    }
                    if(params.executeType=="立即发送"){
	                    this.$confirm('即将发送短信,请确认?', '提示', {
	                        confirmButtonText: '确定',
	                        cancelButtonText: '取消',
	                        type: 'warning'
	                    }).then(() => {
	                        pushSMS(params) 
	                            .then((res) => {
	                                let data = JSON.parse(Base64.decode(res.data)),
	                                    code = data.messageType,
	                                    msg = data.messageContent,
	                                    val = data.valueObj;
	                                if(code == 'SUCCESS') {
	                                    this.$message.success(msg);
	                                    this.pushForm={
							                'storeActivityId':'',
							                "msgDesc":"",
							                "sendObj": { // 发送对象(全部/按条件筛选)
							                    'gender' : '不限', // 性别(不限/女/男/未知)
							                    'memberLevel' : '', // 会员等级
							                    'memberConsume' : { // 会员消费
							                        'type' : '单笔消费', // 单笔/累计
							                        'operator' : '', // 大于/等于/小于
							                        'money' : '' // 元
							                    },
							                    'years' : '', // 入会时长
							                    'dBirthday' : '是', // 生日当天会员(是/否)
							                    'mBirthday' : '是' // 生日当月会员(是/否)
							                },
							                "executeType":"立即发送", // 执行类型(立即发送、定时发送)
							                "sendDate":"" // 发送时间(立即发送时为空)
							            },
							            this.type = '全部', // (全部/按条件筛选)
	                                    this.tableLoading = false;
	           				 			this.dialogVisible = false;
	                                }else {
	                                    this.$message.warning(msg);
	                                    this.tableLoading = false;
	                                }
	                            })
	                    })
                    }else{
                    	if(params.sendDate==""){
                            this.$message.warning('请选择定时发送时间！');
                            return false;
                    	}
                    	this.$confirm('短信将于'+params.sendDate+'发送,请确认?', '提示', {
	                        confirmButtonText: '确定',
	                        cancelButtonText: '取消',
	                        type: 'warning'
	                    }).then(() => {
	                        pushSMS(params) 
	                            .then((res) => {
	                                let data = JSON.parse(Base64.decode(res.data)),
	                                    code = data.messageType,
	                                    msg = data.messageContent,
	                                    val = data.valueObj;
	                                if(code == 'SUCCESS') {
	                                    this.$message.success(msg);
	                                    this.pushForm={
							                'storeActivityId':'',
							                "msgDesc":"",
							                "sendObj": { // 发送对象(全部/按条件筛选)
							                    'gender' : '不限', // 性别(不限/女/男/未知)
							                    'memberLevel' : '', // 会员等级
							                    'memberConsume' : { // 会员消费
							                        'type' : '', // 单笔/累计
							                        'operator' : '', // 大于/等于/小于
							                        'money' : '' // 元
							                    },
							                    'years' : '', // 入会时长
							                    'dBirthday' : '否', // 生日当天会员(是/否)
							                    'mBirthday' : '否' // 生日当月会员(是/否)
							                },
							                "executeType":"立即发送", // 执行类型(立即发送、定时发送)
							                "sendDate":"" // 发送时间(立即发送时为空)
							            },
							            this.type = '全部', // (全部/按条件筛选)
	                                    this.tableLoading = false;
	           				 			this.dialogVisible = false;
	                                }else {
	                                    this.$message.warning(msg);
	                                    this.tableLoading = false;
	                                }
	                            })
	                    })
                    }
                }
            }); 
            
        },
        handleSelectExecuteType(str) {
            if(str == '立即发送') {
                this.pushForm.sendDate = '';
            }
        },
        handleSendObjType(type) {
            if(type == '全部') {

            }
        },
        //等级下拉监听
        levalSelect(val) {
            //      	console.log(val);
            this.pushForm.sendObj.levalId = this.levalInfo[val].value;
            this.pushForm.sendObj.levalName = this.levalInfo[val].key;
        },
        consumptionHandle(str) {
            this.pushForm.sendObj.memberConsume.operator = '';
            this.pushForm.sendObj.memberConsume.money = '';
        },		
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
        onSubmit(){
	    	this.showTable('',this.limit);
        },
          //添加
        shoppingGuide(){
            this.$router.push({
                name: '门店活动门店活动新增',
                params: {
                    pageType: '添加',
                }
            });
        },
        iconEmail(index, table) {
        	let that = this;
        	this.pushForm.storeActivityId=table.activityId;
            this.dialogVisible = true;
            let params={
            	userId:this.userInfo.userCode
            }
            selectLevalInfo(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
//                  console.log(JSON.stringify(data))
                    that.levalInfo = data.data;
                })
                .catch(function(err) {
                    // console.log(err);
                });
        },
        // 删除
        iconShanchu(index, table) {
            this.tableLoading = true;
            this.$confirm('您确定要删除吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
            	cancelButtonText: '取消',
            	type: 'warning'
            }).then(() => {
                let params = {
                    userId : this.userInfo.userCode,
                    "id" : table.id,
                    "activityId": table.activityId,
                    "activityTitle": table.activityTitle
	            }
	            // console.log(params);
	            deleteData(params)
	                .then((res) => {
	                    let data = JSON.parse(Base64.decode(res.data)),
	                        code = data.messageType,
                            msg = data.messageContent,
                            val = data.valueObj;
	                 
	                    if(code == 'SUCCESS') {
                            this.$message.success(msg);
                            this.showTable(this.page,this.limit);
                            this.tableLoading = false;
	                    }else {
	                        this.$message.error(msg);
                            this.tableLoading = false;
	                    }
	                })
	                .catch((err) => {
                        this.tableLoading = false;
	                    // console.log(err);
	                });
            }).catch(() => {
                this.tableLoading = false;
            });
        },
        // 图标 - 修改
        iconXiugai(index, row) {
            var data = JSON.stringify(row);
            this.$router.push({
                name: '门店活动门店活动修改',
                params: {
                    pageType: '修改',
                    formData: data
                }
            });
        },
        
        showTable(start, limit) {
        	// console.log(JSON.stringify(this.userInfo));
            let that = this;
            let data = this.form.roleInfo;
            let params = {
            	userId:this.userInfo.userCode,
                page: start,
                limit: limit,
                activityTitle: this.form.activityTitle
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
            selectShopActivitiesData(params)
                 .then(function(res) {
                     let data = JSON.parse(Base64.decode(res.data));
                    // console.log(JSON.stringify(data));
                    let result = [];
                    data.data.forEach((val, index) => {
                        result.push({
                            isEdit: false,
                            
                            ...val
                        });
                    })
                    that.count=data.count;
                    that.tableData = result;
                    that.tableLoading = false;
                })
                .catch(function(err) {
                    // console.log(err);
                    that.tableLoading = false;
                });
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
        // 计算属性
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
.radioGroupBlock {
    .el-radio {
        height: 35px;
        line-height: 35px;
        display: block;
        margin-left: 0;
        // margin-top: 2px;
    }
}
.inline-width {
    width: 160px;
}
.height80{
	height: 80px;
}

</style>