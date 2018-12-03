<!-- 门店摇一摇活动 - 奖品设置-->
<template>
    <div>
        <el-card>
            <el-form :model="form" ref="form" :rules="rules" label-width="80px" class="demo-form">
				<el-form-item label="优惠券" prop="coupName">
					<el-input v-model="form.coupName" :readonly="true" placeholder="选择券模板" class="width64"></el-input>
					<el-button type="primary" id="search" @click="coupTempClick">选择</el-button>
				</el-form-item>
				<el-form-item label="奖品数量" prop="draw">
					<el-select class="inlineFormItem drawNo" v-model="draw.drawNo" @change="drawNoChange" placeholder="请选择" prop="drawNo">
                        <el-option label="每日" value="每日"></el-option>
                    </el-select>
                    <el-input class="inlineFormItem" v-model="draw.drawNum" @change="drawNumChange" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
				</el-form-item>

				<el-form-item label="中奖率" prop="winRate" class="activityInputOther activityInputRea">
					<el-input v-model="form.winRate" :readonly="true"></el-input><span>%</span>
				</el-form-item>
				<el-form-item label="券有效期" prop="coupNo">
		            <el-radio-group v-model="coupNo" @change="radioTimeHandle" class="marginTop10">
		            	<div>
		                    <el-radio label="长期" class="radio"> 
		                    	<div class="radioInfo">
		                    		<span class="formText">自领取之日起</span>
		                            <el-input class="inlineFormItem" v-model="form.coupNo" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
		                            <span class="formText">天内有效</span>
		                    	</div>
		                    </el-radio>
		            	</div>
		            	<div class="activityContainerM">
		                    <el-radio label="时间段">
		                         <el-date-picker
		                          :editable="false" 
		                          :disabled="datePickerDisabled"
							      v-model="timeRangeArr"
							      @change="selectDate"
							      format="yyyy 年 MM 月 dd 日" 
							      value-format="yyyy-MM-dd"
							      type="daterange"
							      range-separator="至"
							      start-placeholder="开始日期"
							      end-placeholder="结束日期">
							    </el-date-picker>
		                    </el-radio>
		            	</div>
		            </el-radio-group>
		        </el-form-item>
				<el-form-item label="券说明" prop="coupDesc" class="activiteDesc">
					<el-input type="textarea" resize="none" v-model="form.coupDesc" placeholder="请输入备注说明"></el-input>
				</el-form-item>
            </el-form>
        </el-card>
        <el-dialog title="选择优惠券" :visible.sync="handleStoreDialog" class="dialogOne">
			<el-form :model="couponLibraryForm" :rules="roleRules" class="role">
				<el-form-item label="券类型" prop="role">
					<el-select v-model="couponLibraryForm.couponType" clearable placeholder="选择券类型" class="width32">
                        <el-option label="代金券" value="代金券"></el-option>
                        <el-option label="折扣券" value="折扣券"></el-option>
                        <el-option label="礼品券" value="礼品券"></el-option>
					</el-select>
					<el-input v-model="couponLibraryForm.coupTempName" class="width32" placeholder="请输入券模板名称"></el-input>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table ref="tableDataTab" v-loading="tableLoading" :data="tableDataTab" class="el-tableRadio" highlight-current-row  border @current-change="handleSelectionChangeTab">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="couponType" label="类型"></el-table-column>
				<el-table-column prop="coupTempName" label="券名称"></el-table-column>
			</el-table>
			<el-footer v-if="count != 0">
				<el-pagination background class="pagination" layout="total,prev, pager, next, jumper" :page-size="limit" :total="count" @current-change="handleCurrentChangeTab">
				</el-pagination>
			</el-footer>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleStoreDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterJurisdiction">确 定</el-button>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import { selectMessageInfo } from '@/api/member/activityManagement'
import { selectAudioUser} from '@/api/public'
import { validateFloat } from '@/utils/validate';
import { selectCouponLibraryJurisdiction} from '@/api/member/couponLibrary'
import { mapGetters } from 'vuex'
const isFloat = (rule, value, callback) => {
	if(value != "") {
		if(!validateFloat(value)) {
			callback(new Error('请输入有效浮点数'))
		} else {
			callback()
		}
	}
}
export default {
    data() {
        return {
        	tableLoading:false,
			handleStoreDialog: false,//弹窗标识
			datePickerDisabled:true,
			dateInputDisabled:false,
			couponLibraryForm:{
				couponType:'',
				coupTempName:''
			},
			coupNo:'长期',
            form: {
            	"coupId":"",//优惠券Id
				"coupName":"",//优惠券名称
				"coupNo":"",//券有效期
				"coupDesc":"",//券说明
				"draw":"",
				"winRate":""//中奖率
			},
			norules:{},
			tableDataTab:[],
			multipleSelectionTab:[],//选择的数据
			rules: {
                coupName: [
                    { required: true, message: '请选择优惠券', trigger: 'change' },
                    { max: 100, message: '最大长度为100', trigger: 'change' }       
                ],
                draw: [
                    { required: true, message: '请输入奖品数量', trigger: 'change' },
                    { max: 100, message: '最大长度为100', trigger: 'change' }       
                ],
                coupNo: [
                    { required: true, message: '请选择券有效期', trigger: 'change' },
                    { max: 100, message: '最大长度为100', trigger: 'change' }       
                ],
            },
            timeRangeArr:[],
			"draw":{
				"drawNo":"",//抽奖时间
				"drawNum":""//抽奖次数
			},
            roleRules:{},
            // 组件数量
            count: 1,
            loading: false,
			// 分页
			page: 0, // 当前页
			count: 0, // 总条数
			limit: this.GLOBAL.limitDialog, // 条/页
        }
    },
    props: ['data','index','winRateSum'],
    methods: {
		//抽奖次数-抽奖时间
		drawNoChange(val){
			// console.log(val)
			if(this.draw.drawNum!=""){
				this.form.draw = JSON.stringify(this.draw);
			}
		},
		//抽奖次数-抽奖次数
		drawNumChange(val){
			if(this.draw.drawNo!=""){
				this.form.draw = JSON.stringify(this.draw);
			}
		},
        // 奖品设置 -  券有效期 -单选
        radioTimeHandle(str) {
        	this.coupNo=str;
            if(this.coupNo == '时间段') {
                this.datePickerDisabled = false;
                this.dateInputDisabled = true;
            }else if(this.coupNo == '长期') {
                this.datePickerDisabled = true;
                this.dateInputDisabled = false;
            }
        },
        //选择时间监听
        selectDate(val){
//      	console.log(val)
        	var params  = {
        		activityDateBegin:val[0],
        		activityDateEnd:val[1]
        	}
            this.form.coupNo=JSON.stringify(params);
        },
        //奖品设置 - 选择优惠券
		coupTempClick(){
			this.handleStoreDialog=true;
			this.showTable(this.page, this.limit, this.couponLibraryForm);
		},
		//选择券模板的查询
		onSubmit(){
			this.showTable('', this.limit, this.couponLibraryForm);
		},
		//请求优惠券信息
		showTable(start, limit,couponLibraryForm) {
			let that = this;
			let params = {
				"userId": this.userInfo.userCode,
				couponType:couponLibraryForm.couponType,
				coupTempName:couponLibraryForm.coupTempName,
				page: start,
				limit: limit
			}
			// 使表格加载
			this.tableLoading = true;
			// 查询接口
//				console.log(params)
			selectCouponLibraryJurisdiction(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					// console.log(data)
					let result = [];
					data.data.forEach((val, index) => {
						result.push({
							isEdit: false,
							...val
						});
					})
					that.count = data.count;
					that.tableDataTab = result;
					that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
		},
		handleSelectionChangeTab(val){
            this.multipleSelectionTab = val;
		},
		// 分页
		handleCurrentChangeTab(val) {
			// console.log(val, '当前页');
			this.page = val;
			this.showTable(val, this.limit, this.couponLibraryForm);
		},
		handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit, this.couponLibraryForm);
		},
		//弹窗确认
		enterJurisdiction(){
			let val = this.multipleSelectionTab;
//			console.log(JSON.stringify(val));
			this.form.coupId= val.coupId;
			this.form.coupName=	val.coupName;
			this.handleStoreDialog=false;
		},
    },
    created() {
    	if(this.getPageType=="修改"){
//  		console.log(this.data)
	        if(this.data!=""){
	        	this.form=this.data;
		      	// console.log()
		        this.draw=JSON.parse(this.form.draw);
		       	if(JSON.parse(this.form.coupNo).activityDateBegin){
		       		this.coupNo="时间段";
					this.datePickerDisabled=false,
					this.dateInputDisabled=true,
		       		this.timeRangeArr.push(JSON.parse(this.form.coupNo).activityDateBegin);
		       		this.timeRangeArr.push(JSON.parse(this.form.coupNo).activityDateEnd);
		       	}else{
		       		this.coupNo="长期";
		       	}
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
        getFormData() {
            return this.$route.params.formData;
        }
    },
	watch: {
		"draw.drawNum": function(val) {
			this.form.draw = JSON.stringify(this.draw);
 			this.$emit('message', val);
		}
	}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/_function.scss";
.el-card {
    width: 100%;
}
/*// 行内文本*/
.formText {
	float: left;
	margin-top: 10px;
}
.activityContainerM{
	margin-top: 20px;
}
/*// 行内form*/
.inlineFormItem {
    width: 130px;
	float: left;
	margin: 0 10px;
}
.el-table-filter {
    max-height: 300px;
    overflow: auto;
}
.block{
	float:left;
	margin-right: 10px;
}
.radio{
	position: relative;
	width: 100%;
}
.radioInfo{
	position: absolute;
	left: 24px;
	top: -8px;
}

.activityInputOther {
	width: 360px;
}

.activityInputOther .el-input {
	margin-left: 0px;
}
	
.activityInputRea {
	position: relative;
}

.activityInputRea span {
	position: absolute;
	right: -20px;
}
.drawNo{
	margin-left: 0;
}
.width32{
	width: 32%;
}
.width64{
	width: 64%;
}
</style>