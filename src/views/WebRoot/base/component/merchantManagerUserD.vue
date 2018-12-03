// 基础设置 - 业务规则 - 会员权益 - 积分新增pos模式弹窗(品牌管理员)
<template>
    <div class="container">
        <el-card>
            <el-tabs type="border-card">
                <el-tab-pane label="POS模式" ref="POS" v-if="isPOS">
                    <el-form :model="formPOS" ref="formPOS" :rules="rules" label-width="120px" v-loading="posLoading">
                        <el-form-item label="积分小数规则" prop="decimalRule">
                            <el-radio-group v-model="formPOS.decimalRule">
                                <el-radio label="四舍五入">四舍五入</el-radio>  
                                <el-radio label="抹零">抹零</el-radio>  
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="积分有效期" prop="integralValidity.msg">
                            <el-radio-group v-model="formPOS.integralValidity.msg" @change="handleRadioChange">
                                <el-radio label="永久有效" class="blockRadio">永久有效</el-radio> 
                                <el-radio label="相对有效" class="blockRadio">
                                    相对有效
                                    <el-form class="formPOSIVrelative" label-width="120px" :inline="true" v-if="this.formPOS.integralValidity.msg == '相对有效'">
                                        <el-radio-group v-model="formPOS.integralValidity.timeSelect" @change="getTimeDate">
                                            <el-radio label="年">
                                                <el-input class="widthInline" v-model="formPOS.integralValidity.year" :disabled="timeYear"></el-input>
                                                <div class="formText">年</div>    
                                            </el-radio>  
                                            <el-radio label="月">
                                                <el-input class="widthInline" v-model="formPOS.integralValidity.month" :disabled="timeMonth"></el-input>
                                                <div class="formText">月</div>   
                                            </el-radio>
                                            <el-radio label="日">
                                                <el-input class="widthInline" v-model="formPOS.integralValidity.day" :disabled="timeDay"></el-input>
                                                <div class="formText">日</div>  
                                            </el-radio>  
                                        </el-radio-group>
                                    </el-form>
                                </el-radio>  
                                <el-radio label="绝对有效" class="blockRadio">
                                    绝对有效
                                    <el-form class="formPOSIVrelative" label-width="120px" :inline="true" v-if="this.formPOS.integralValidity.msg == '绝对有效'">
                                        <el-input class="widthInline" v-model="formPOS.integralValidity.yearAfter"></el-input>
                                        <div class="formText">（年）后的</div>  
                                        <el-select class="widthInline" v-model="formPOS.integralValidity.overdueMonth" placeholder="请选择">
                                            <el-option
                                            v-for="item in monthDate"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <div class="formText">月</div>  
                                        <el-select class="widthInline" v-model="formPOS.integralValidity.overdueDay" placeholder="请选择">
                                            <el-option
                                            v-for="item in dayDate"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <div class="formText">号过期</div>  
                                    </el-form>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="过期预警天数" prop="overdueWarnDays">
                            <div class="formText">积分到期前</div>
                            <el-input class="widthInline" v-model="formPOS.overdueWarnDays"></el-input>
                            <div class="formText">天通知会员</div>
                        </el-form-item>
                        <el-form-item class="marginTop10">
                            <el-button type="primary" @click="handleSavePOS">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="SCRM模式" ref="SCRM" v-if="isSCRM">
                    <merchant-manager-user-d-c v-show="!isHidden" @handleAdd="handleAdd" @iconChakan="iconChakan"></merchant-manager-user-d-c>
                    <merchant-manager-user-d-d v-show="isHidden" @handleSure="handleSure"></merchant-manager-user-d-d>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- <el-button type="primary" class="handleSure" ref="handleSure" @click="handleSure">确定</el-button> -->
    </div>
</template>
<script>
    /**
     * 查询品牌信息
     * 
     */
	import { selectIntegralRuleInfo, saveIntegralRuleInfo, editIntegralRuleInfo } from '@/api/base/merchantManagerUser'
	import { mapGetters } from 'vuex'
	import merchantManagerUserDC from './merchantManagerUserDC'
	import merchantManagerUserDD from './merchantManagerUserDD'
	export default {
		data() {
			return {
                posLoading: false,
                idPOS: '',
                versionPOS: '',
                isSCRM: '',
                versionSCRM: '',
                isPOS: false, // 是否属于POS模式，还是SCRM模式
                isSCRM: false,
                formPOS: {
                    integralModel: '',// 积分模式 (POS模式/scrm模式)
                    decimalRule: '', // 积分小数规则(四舍五入/抹零)
                    integralValidity: {
                        msg: '', // 积分有效期(永久有效/相对有效/绝对有效)
                        timeSelect: '', // 选择有限时间(年/月/日)
                        year: '', // 年
                        month: '', // 月
                        day: '', // 日
                        yearAfter: '', // 多少年后
                        overdueMonth: '', // 过期月
                        overdueDay: '', // 过期日
                    }, // 积分有效期
                    overdueWarnDays: '', // 过期预警天数
                    freezingDays: '', // 消费积分冻结天数
                    discountLower: '', // 折扣下限
                    integralType: '', // 积分类型
                    giveCriterion: '', // 赠送标准
                    integralDesc: '' // 积分说明
                },
                
                rules: {
                    "decimalRule": [
                        { required: true, message: '请选择积分小数规则', trigger: 'change'  }     
                    ],
                    "overdueWarnDays": [
                        { required: true, message: '请输入过期预警天数', trigger: 'change'  }     
                    ],
                },
                timeYear: true, // 年
                timeMonth: true, // 月
                timeDay: true, // 日
                monthDate: [
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                    {label: '11', value: '11'},
                    {label: '12', value: '12'}
                ],// 月份 - 绝对有效期
                dayDate: [
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                    {label: '11', value: '11'},
                    {label: '12', value: '12'},
                    {label: '13', value: '13'},
                    {label: '14', value: '14'},
                    {label: '15', value: '15'},
                    {label: '16', value: '16'},
                    {label: '17', value: '17'},
                    {label: '18', value: '18'},
                    {label: '19', value: '19'},
                    {label: '20', value: '20'},
                    {label: '21', value: '21'},
                    {label: '22', value: '22'},
                    {label: '23', value: '23'},
                    {label: '24', value: '24'},
                    {label: '25', value: '25'},
                    {label: '26', value: '26'},
                    {label: '27', value: '27'},
                    {label: '28', value: '28'},
                    {label: '29', value: '29'},
                    {label: '30', value: '30'},
                ], // 日期 - 绝对有效期

				formSearch: {
					searchInfo: '' // scrm搜索信息
				},
				tableLoading: false, // 搜索状态
				// table数据
				tableData: [{
					storeName: '', // 门店名称
					decimalRule: '', // 积分小数规则
					integralValidity: '', // 积分有效期
					overdueWarnDays: '', // 过期预警天数
					freezingDays: '', // 消费积分冻结天数
					integralDesc: '' // 积分说明
				}],
				// 表格多选
				multipleSelection: [],

				isHidden: false, // 显示隐藏操作页面
			}
		},
		components: {
			merchantManagerUserDC,
			merchantManagerUserDD
		},
		methods: {
            handleRadioChange(str) {
                if(str == '永久有效') {
                    this.formPOS.integralValidity.year = '';
                    this.formPOS.integralValidity.month = '';
                    this.formPOS.integralValidity.day = '';
                    this.formPOS.integralValidity.yearAfter = '';
                    this.formPOS.integralValidity.overdueMonth = '';
                    this.formPOS.integralValidity.overdueDay = '';
                }else if (str == '相对有效') {
                    this.formPOS.integralValidity.yearAfter = '';
                    this.formPOS.integralValidity.overdueMonth = '';
                    this.formPOS.integralValidity.overdueDay = '';
                }else if (str == '绝对有效') {
                    this.formPOS.integralValidity.year = '';
                    this.formPOS.integralValidity.month = '';
                    this.formPOS.integralValidity.day = '';
                }
            },
            // 查询品牌信息
            handleSelectIntegralRuleInfo () {
                this.posLoading = true;
                let params = {
                    userId: this.userInfo.userCode
                }
                selectIntegralRuleInfo(params)
                    .then((res) => {
                        let data = JSON.parse(Base64.decode(res.data)),
                            code = data.messageType,
                            msg = data.messageContent;
                        if(code == 'SUCCESS') {
                            let integralModel = msg.integralModel;
//                          localStorage.setItem('merchantManagerUser', Base64.encode(JSON.stringify(merchantManagerUser)));
                            this.isPOS = integralModel == 'POS模式' ? true : false;
                            this.isSCRM = integralModel === 'scrm模式' ? true : false;
                            if (integralModel === 'POS模式') {
                                this.isPOS = true;
                                this.formPOS.decimalRule = msg.decimalRule;
                                if(!msg.integralValidity === false) {
                                    this.formPOS.integralValidity = msg.integralValidity;
                                }
                                this.formPOS.overdueWarnDays = msg.overdueWarnDays;
                                this.idPOS = msg.id;
                                this.versionPOS = msg.version;
                                this.posLoading = false;
                                // console.log(this.idPOS, this.versionPOS, 'this.formPOS');
                            }
                            if(integralModel === 'scrm模式'){
	                            let brandRule = msg.brandRule; // {}
	                            let storeRule = msg.storeRule; // []
	                            // 查询时缓存默认配置
	                            let merchantManagerUser = {
	                                storeId: brandRule.storeId,
	                                storeName: brandRule.storeName,
	                                integralModel: brandRule.integralModel,
	                                decimalRule: brandRule.decimalRule,
	                                integralValidity: brandRule.integralValidity,
	                                overdueWarnDays: brandRule.overdueWarnDays,
	                                freezingDays: brandRule.freezingDays,
	                                discountLower: brandRule.discountLower
	                            }
                            	
                            }
                        }else {
                            this.posLoading = false;
                            this.$message.error(msg);
                        }
                    })
                    .catch((err) => {
//                      console.log(err + 'err');
                        this.posLoading = false;
                        // this.$message.error('系统繁忙！请稍后重试！');
                    });
            },  
            handleSavePOS () {
                this.$refs.formPOS.validate((valid) => {
                    if (valid) {
                        
                        if(this.idPOS.length == 0 && this.versionPOS.length == 0) {
                            // 新增
                            let params = {
                                "userId": this.userInfo.userCode,
                                "integralModel": "POS模式",//是页签的名字
                                "decimalRule": this.formPOS.decimalRule,
                                "integralValidity": this.formPOS.integralValidity,
                                "overdueWarnDays": this.formPOS.overdueWarnDays
                            }
                            // console.log(JSON.stringify(params));
                            saveIntegralRuleInfo(params)
                                .then((res) => {
                                    // console.log(res);
                                    let data = JSON.parse(Base64.decode(res.data)),
                                        code = data.messageType,
                                        msg = data.messageContent,
                                        val = data.valueObj;
                                    if(code == 'SUCCESS') {
                                        this.$message.success(msg);
                                    }else {
                                        this.$message.error(msg);
                                    }
                                })
                                .catch((err) => {
                                    this.$message.error('系统繁忙！请稍后重试！');
                                });
                        }else {
                            // 修改
                            let params = {
                                id: this.idPOS,
                                version: this.versionPOS,
                                "userId": this.userInfo.userCode,
                                "integralModel": "POS模式",//是页签的名字
                                "decimalRule": this.formPOS.decimalRule,
                                "integralValidity": this.formPOS.integralValidity,
                                "overdueWarnDays": this.formPOS.overdueWarnDays
                            }
                            // console.log(params, '修改');
                            editIntegralRuleInfo(params) 
                                .then((res) => {
                                    let data = JSON.parse(Base64.decode(res.data)),
                                        code = data.messageType,
                                        msg = data.messageContent,
                                        val = data.valueObj;
                                    if(code == 'SUCCESS') {
                                        this.$message.success(msg);
                                        this.handleSelectIntegralRuleInfo();
                                    }else {
                                        this.$message.error(msg);
                                    }
                                })
                                .catch((err) => {
                                    this.$message.error('系统繁忙！请稍后重试！');
                                });
                        }
                        
                        
                    } else {
                        return false;
                    }
                });
                
            },
            // 确认时间
            getTimeDate(str) {
                // console.log(str);
                if(str == '年') {
                    this.timeYear = false;
                    this.timeMonth = true;
                    this.timeDay = true;
                    this.formPOS.integralValidity.month = '';
                    this.formPOS.integralValidity.day = '';
                }
                if(str == '月') {
                    this.timeYear = true;
                    this.timeMonth = false;
                    this.timeDay = true;
                    this.formPOS.integralValidity.year = '';
                    this.formPOS.integralValidity.day = '';
                }
                if(str == '日') {
                    this.timeYear = true;
                    this.timeMonth = true;
                    this.timeDay = false;
                    this.formPOS.integralValidity.year = '';
                    this.formPOS.integralValidity.month = '';
                }
            },

			handleAdd(boolean) {
				this.isHidden = boolean;
			}, // 添加
			handleSearch() {

				this.showTable('', '', this.formSearch.searchInfo);
			}, // 查询
			handleSelectionChange () {}, // 多选
			// // 显示表格数据
			// showTable(start, limit, searchContent) {
			// 	let that = this;
			// 	let params = {
			// 		start: start,
			// 		limit: limit,
			// 		searchContent: searchContent
			// 	}
			// 	// 使表格加载
			// 	this.tableLoading = true;
			// 	// 查询接口
			// 	gerTableData(params)
			// 		.then(function(res) {
			// 			// let data = JSON.parse(Base64.decode(res.data.data));
			// 			let data = res.data;
			// 			//                      console.log(data);
			// 			if(data.messageType == 'SUCCESS') {
			// 				let result = [];
			// 				data.messageContent.forEach((val, index) => {
			// 					result.push({
			// 						isEdit: false,

			// 						...val
			// 					});
			// 				})
			// 				that.tableData = result;
			// 				that.tableLoading = false;
			// 			} else {
			// 				that.$message.error(data.messageContent);
			// 				that.tableLoading = false;
			// 			}
			// 		})
			// 		.catch(function(err) {
			// 			console.log(err);
			// 			that.tableLoading = false;
			// 		});
			// },
			handleSure(boolean) {
				// 确认
				this.isHidden = boolean;
			},
			// 图标查看
			iconChakan(boolean) {
				this.isHidden = boolean;
			}
		},
		created() {
			// 钩子函数 -- 初始化
            this.handleSelectIntegralRuleInfo();
		},
		computed: {
            // 计算属性
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
        // position: absolute;
        margin-left: rem(20px);
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .el-select {
        width: 100%;
    }
    // 行内文本 span
    .formText {
        display: inline;
        line-height: rem(30px);
    }
    .el-header {
        padding: rem(10px);
        background: #EEE;
        position: relative;
    }
    .el-main {
        padding: rem(10px);
    }
    .widthInline {
        width: rem(90px);
        margin: 0 rem(10px);
    }
    .container .handleSure {
        margin: 0 auto;
    }
    .blockRadio {
        display: block;
        margin: 20px 0;
    }

    // 相对有效
    .formPOSIVrelative {
        position: absolute;
        top: -10px;
        left: 100px;
    }

    

    
</style>