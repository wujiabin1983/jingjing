<!--扫码领券-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" class="marginBottom10" v-if="this.getPageType == '查看'">返回</el-button>
			<el-card>
				<el-form :model="form" v-loading="this.tableLoading"  :rules="this.getPageType=='查看'?noRules:rules" ref="form" label-width="80px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item label="活动名称" prop="activityName">
                                <el-input v-model="form.activityName" :disabled="disabled" class="inlineInput" placeholder="请输入活动名称"></el-input>
                            </el-form-item>
                            <el-form-item label="活动时间" prop="activiteDateBegin">
								<el-date-picker
									v-model="timeRangeArr"
									@change="selectDate"
									:editable="false" 
									:picker-options="pickerOptions0" 
									format="yyyy 年 MM 月 dd 日" 
									value-format="yyyy-MM-dd"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									:disabled="disabled"
									end-placeholder="结束日期">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="领取次数" prop="receiveType" class="recTime">
			                    <el-select class="inlineFormItem" :disabled="disabled" v-model="form.receiveType" placeholder="请选择" prop="recTime.type">
			                        <el-option label="活动期间" value="活动期间"></el-option>
			                        <el-option label="每日" value="每日"></el-option>
			                    </el-select>
							</el-form-item>	
							<el-form-item label="" prop="receiveMax" class="recTimeCount">
				                <span class="formText">可领取</span>
			                    <el-input class="inlineFormItem" :disabled="disabled" v-model="form.receiveMax" placeholder="请输入"  prop="recTime.time"></el-input>
				                <span class="formText">次</span>
							</el-form-item>	
							<el-form :model="form" ref="form" label-width="80px" class="demo-form"> 
								<el-form-item label="参与门槛" prop="partiCondition">
									<el-checkbox-group v-model="form.joinType" @change="handleSelectType">
										<el-checkbox label="需关注公众号" :disabled="disabled"></el-checkbox>
										<el-checkbox label="需激活手机" :disabled="disabled"></el-checkbox>
										<el-checkbox label="需激活手机且绑卡时间为" :disabled="disabled"></el-checkbox>
										<el-checkbox label="当月生日" :disabled="disabled"></el-checkbox>
										<el-checkbox label="需消费金额区间" :disabled="disabled"></el-checkbox>
										<el-checkbox label="按会员等级领券" :disabled="disabled"></el-checkbox>
				                    </el-checkbox-group>
				                </el-form-item>
				                <el-form-item label="绑卡时间" class="is-required" v-if="timeTied" >
									<el-date-picker
										v-model="timeTiedCard"
										:disabled="disabled"
										@change="selectTiedCardDate"
										format="yyyy 年 MM 月 dd 日" 
										:editable="false" 
										value-format="yyyy-MM-dd"
										type="daterange"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期">
									</el-date-picker>
				                </el-form-item>
				                <el-form-item label="消费时间" class="is-required" v-if="membersPrice">
		                    		近<el-input v-model="membersPriceDay" :disabled="disabled" @change="recDay" placeholder="消费天数" class="membersPriceDay"></el-input>天
				                </el-form-item>
				                <el-form-item label="需消费金额区间" class="is-required" v-if="membersPrice">
				                    <el-input v-model="membersPriceBegin" :disabled="disabled" @change="recBegin" placeholder="需消费金额区间(起)" class="width175"></el-input>
				                    <el-input v-model="membersPriceEnd" :disabled="disabled" @change="recEnd" placeholder="需消费金额区间（止）" class="width175"></el-input>
				                </el-form-item>
			                </el-form>
			                <el-form-item label="奖品设置" prop="" class="notWin">
								<div class="component" v-for="(item, index) in templateItems"  :key="templateItems.id">
									<div :is="item.component" class="overHidden" :data="item.data" :index="index" :isLevel="item.isLevel" ref = "child"></div>
									<div class="deteleBtn"  @click="handleDelete(index)" v-if="item.delect&&index>0">
										<el-tooltip class="iconItem" content="删除" placement="top" >
											<icon-svg icon-class="shanchu"  @click.native.prevent="handleDelete(index)"/>
										</el-tooltip> 
									</div>
								</div>
								<div class="addBtn" @click="iconAddTr" v-if="this.getPageType != '查看'">
									<i class="el-icon-plus iconAdd"></i>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10" v-if="this.getPageType != '查看'">
						<el-col :span="24" class="el-footer-btn-con">
							<el-button @click="handleBack">取消</el-button>
							<el-button type="primary" @click="submitForm('form')">确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>// 手机号、固定电话、邮箱
import { validateMobile, validateTel, validateEmail, validateInt, validateFloat } from '@/utils/validate';
import { creatScavengingVoucherData, setScavengingVoucherData } from '@/api/tool/scavengingVoucher'
import { selectLevalInfo } from '@/api/public'
import { mapGetters } from 'vuex'
import scavengingVoucher from '@/views/WebRoot/tool/component/scavengingVoucher'
const isInt = (rule, value, callback) => {
	if(value != "") {
		if(!validateInt(value)) {
			callback(new Error('请输入有效数字'))
		} else {
			callback()
		}
	}
}
export default {
	data() {
		return {
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			templateItems: [{
				id: '1',
				isLevel: false,
				'component': 'scavenging-voucher',
				'delect': this.getPageType != '查看'
			}], // 动态添加的组件
			// 弹窗优惠券分页
			tableLoading: false,
			timeTied: false,
			membersPrice: false,
			page: 0, // 
			pagePack: 0, // 当前页
			count: 0, // 
			countPack: 0, // 总条数
			limit: this.GLOBAL.limit, // 条/页
			// form表单数据
			validityDate: '长期',
			disabled: false,
			form: {
				activityName: '', // 活动名称
				activiteDateBegin: '', // 
				activiteDateEnd: '', // 活动时间
				activityRuleJson: '', // 活动规则设置
				prizeJson: '', // 奖品设置
				grantObj: '', //发送对象
				joinType: [],
				joinCond: {},
				receiveType: '',
				receiveMax: '',
			},
			storeTypeData: [],
			timeRangeArr: [], //活动时间-时间段容器

			timeTiedCard: [], //参与门槛 - 绑卡时间区间
			membersPriceBegin: '', //参与门槛 - 需消费金额区间
			membersPriceEnd: '', //参与门槛 - 需消费金额区间
			membersPriceDay: '', //参与门槛 - 需消费金额区间
			noRules: {},
			rules: {
				activityName: [{
					required: true,
					message: '请输入门店名称',
					trigger: 'change'
				}],
				receiveType: [{
					required: true,
					message: '请选择领取类型',
					trigger: 'change'
				}],
				receiveMax: [{
					required: true,
					message: '请输入领取次数',
					trigger: 'change'
				}, {
					validator: isInt
				}],
				activiteDateBegin: [{
					required: true,
					message: '请选择活动时间',
					trigger: 'change'
				}],
				activityRuleJson: [{
					required: true,
					message: '请输入活动规则设置',
					trigger: 'change'
				}],
				prizeJson: [{
					required: true,
					message: '请选择奖品设置',
					trigger: 'change'
				}],
				grantObj: [{
					required: true,
					message: '请选择发送对象',
					trigger: 'change'
				}],
				partiCondition: [{
					required: true,
					message: '请选择参与门槛',
					trigger: 'change'
				}]
			}
		}
	},
	components: {
		scavengingVoucher
	},
	methods: {
		recDay() {
			this.form.joinCond.membersPriceBegin = this.membersPriceBegin;
			this.form.joinCond.membersPriceEnd = this.membersPriceEnd;
			this.form.joinCond.membersPriceDay = this.membersPriceDay;
		},
		recBegin(val) {
			if(val != "" && this.membersPriceEnd != "" && this.membersPriceDay) {
				this.form.joinCond.membersPriceBegin = this.membersPriceBegin;
				this.form.joinCond.membersPriceEnd = this.membersPriceEnd;
				this.form.joinCond.membersPriceDay = this.membersPriceDay;
			}
		},
		recEnd(val) {
			if(val != "" && this.membersPriceBegin != "" && this.membersPriceDay) {
				this.form.joinCond.membersPriceBegin = this.membersPriceBegin;
				this.form.joinCond.membersPriceEnd = this.membersPriceEnd;
				this.form.joinCond.membersPriceDay = this.membersPriceDay;
			}
		},
		//参与门槛多选
		handleSelectType(selected) {
			let timeTied = 0;
			let membersPrice = 0;
			let memberLevel = 0;
			selected.forEach((val, index) => {
				if(val == "需激活手机且绑卡时间为") {
					timeTied++;
				}
				if(val == "需消费金额区间") {
					membersPrice++;
				}
				if(val == "按会员等级领券") {
					memberLevel++;
				}
			})
			if(timeTied > 0) {
				this.timeTied = true;
			} else {
				this.timeTied = false;
			}
			if(membersPrice > 0) {
				this.membersPrice = true;
			} else {
				this.membersPrice = false;
			}
			if(memberLevel > 0) {
				this.templateItems.forEach((val, index) => {
					this.templateItems[index].isLevel = true;
				})
			} else {
				this.templateItems.forEach((val, index) => {
					this.templateItems[index].isLevel = false;
				})
			}
		},
		//删除
		handleDelete(index) {
			if(this.templateItems.length != 1) {
				this.templateItems.splice(index, 1);
			} else {
				this.templateItems = [];
			}
		},
		iconAddTr() { // 添加
			//				let setTableData = this.templateItems[this.count];
			//				this.count++;
			//				if(this.count>5){
			//					this.$message.warning('最多可添加5张');
			//					return false;
			//				}
//			console.log(this.form.joinType)
			let isAdd = false;
			this.form.joinType.forEach((val, index) => {
				if(val == "按会员等级领券") {
					isAdd = true;
				}
			})
			let length = this.templateItems.length;
			this.templateItems.push({
				'id': length++,
				'isLevel': isAdd,
				'component': 'scavenging-voucher',
				'data': '',
				'delect': this.getPageType != '查看'
			});
		},
		//选择活动时间监听
		selectDate(val) {
			//      	console.log(val)
			this.form.activiteDateBegin = val[0];
			this.form.activiteDateEnd = val[1];
		},
		//绑卡时间区间
		selectTiedCardDate(val) {
			//      	console.log(val)
			this.form.joinCond.tiedCardDateBegin = this.timeTiedCard[0];
			this.form.joinCond.tiedCardDateEnd = this.timeTiedCard[1];
		},
		// 方法
		submitForm(formName) {
			let that = this;
			let prizeArray = [];
			that.$refs.child.forEach((val, index) => {
				prizeArray.push(val.form);
			})
			this.form.prizeJson = JSON.stringify(prizeArray);
			let joinCondStr = JSON.stringify(this.form.joinCond);
			var joinTypeStr = '';
			this.form.joinType.forEach((val, index) => {
				joinTypeStr += val + ",";
			})
			joinTypeStr = joinTypeStr.substr(0, joinTypeStr.length - 1);
			this.$refs[formName].validate((valid) => {
				if(valid) {
					let activityRuleJson = {
						receiveType: this.form.receiveType,
						receiveMax: this.form.receiveMax,
						grantObj: this.form.grantObj,
						joinType: joinTypeStr,
						joinCond: joinCondStr
					}
					let conut = 0;
					this.form.joinType.forEach((val, index) => {
						if(val == "需激活手机且绑卡时间为") {
							if(JSON.stringify(this.form.joinCond) == "{}" || !this.form.joinCond.tiedCardDateBegin || !this.form.joinCond.tiedCardDateEnd) {
								conut++;
								this.$message.warning('请选择绑卡时间！');
							}
						}
						if(conut > 0) {
							return false;
						}
						if(val == "需消费金额区间") {
							if(!this.form.joinCond.membersPriceDay) {
								this.$message.warning('请输入消费时间！');
							}
						}
						if(conut > 0) {
							return false;
						}
						if(val == "需消费金额区间") {
							if(!this.form.joinCond.membersPriceBegin || !this.form.joinCond.membersPriceEnd) {
								this.$message.warning('请输入需消费金额区间！');
							}
						}
						if(conut > 0) {
							return false;
						}
					})
					let flag = true;
					that.$refs.child.forEach((val, index) => {
						that.$refs.child[index].$refs['form'].validate((valid) => {
							if(valid) {
								if(JSON.parse(val.form.coupDays).begin&&that.timeRangeArr.length>0){
									var activityDate = new Date(that.timeRangeArr[1]).getTime();
									var coupDate = new Date(JSON.parse(val.form.coupDays).end).getTime();
									if(activityDate<=coupDate){
										flag = true;
									}else{
										flag = false;
										that.$message.warning('优惠券有效期不能小于活动日期！');
									}
								}
//								console.log(JSON.stringify(val.form))
							}else{
								flag=false;
							}
						})
					})
					if(!flag){
						return false;
					}
					let param = {
						userId: this.userInfo.userCode,
						scanActivityJson: {
							activityName: 　this.form.activityName,
							activiteDateBegin: 　this.form.activiteDateBegin,
							activiteDateEnd: 　this.form.activiteDateEnd,
							activityRuleJson: JSON.stringify(activityRuleJson)
						},
						prizeJson: this.form.prizeJson
					}
					this.tableLoading = true;
					if(this.getPageType == '添加') {
						//										console.log(JSON.stringify(param));
//																return false;
						creatScavengingVoucherData(param)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data));
								//    console.log(JSON.stringify(data)+"返回值");
								if(data.messageType == 'SUCCESS') {
									that.tableLoading = false;
									that.$message.success(data.messageContent);
									that.$router.push({
										name: '扫码领券'
									});
								} else {
									that.tableLoading = false;
									that.$message.warning(data.messageContent);
								}
							})
							.catch((err) => {
								that.tableLoading = false;
								// console.log(err);
							});
					} else if(this.getPageType == '修改') {
						param.id = this.form.id;
						param.version = this.form.version;
						//										console.log(JSON.stringify(param))
						setScavengingVoucherData(param)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data));
								//    console.log(JSON.stringify(data)+"返回值");
								if(data.messageType == 'SUCCESS') {
									that.tableLoading = false;
									that.$message.success(data.messageContent);
									that.$router.push({
										name: '扫码领券'
									});
								} else {
									that.tableLoading = false;
									that.$message.error(data.messageContent);
								}
							})
							.catch((err) => {
								that.tableLoading = false;
								// console.log(err);
							});
					}
				}
			});
		},
		handleBack() {
			this.$router.push({
				name: '扫码领券'
			});
		},
	},
	created() {
		//钩子函数 -- 初始化
		//console.log(this.getPageType);
		//console.log(this.getFormData);
		if(this.getPageType == '修改') {
			let res = JSON.parse(this.getFormData);
			//				console.log(res);
			let isLevel = false;
			this.timeRangeArr.push(res.activiteDateBegin);
			this.timeRangeArr.push(res.activiteDateEnd);
			this.form = {
				id: res.id,
				version: res.version,
				activityName: res.activityName, // 活动名称
				activiteDateBegin: res.activiteDateBegin, // 
				activiteDateEnd: res.activiteDateEnd, // 活动时间
				activityRuleJson: JSON.stringify(res.activityRuleJson), // 活动规则设置
				prizeJson: JSON.stringify(res.prizeJson), // 奖品设置
				grantObj: res.activityRuleJson.grantObj, //发送对象
				joinType: res.activityRuleJson.joinType.split(","),
				joinCond: res.activityRuleJson.joinCond,
				receiveType: res.activityRuleJson.receiveType,
				receiveMax: res.activityRuleJson.receiveMax
			};
			res.activityRuleJson.joinType.split(",").forEach((val, index) => {
				if(val == "需激活手机且绑卡时间为") {
					this.timeTied = true;
					this.timeTiedCard.push(res.activityRuleJson.joinCond.tiedCardDateBegin);
					this.timeTiedCard.push(res.activityRuleJson.joinCond.tiedCardDateEnd);
				}
				if(val == "需消费金额区间") {
					this.membersPrice = true;
					this.membersPriceBegin = res.activityRuleJson.joinCond.membersPriceBegin;
					this.membersPriceEnd = res.activityRuleJson.joinCond.membersPriceEnd;
					this.membersPriceDay = res.activityRuleJson.joinCond.membersPriceDay;
				}
				if(val == "按会员等级领券") {
					isLevel = true;
				}
			})
			//				console.log(res.prizeJson)
			this.templateItems = [];
			res.prizeJson.forEach((val, index) => {
				this.templateItems.push({
					'id': index,
					'isLevel': isLevel,
					'component': 'scavenging-voucher',
					'data': res.prizeJson[index],
					'delect': this.getPageType != '查看'
				});
			})
		}
		if(this.getPageType == '查看') {

			let res = JSON.parse(this.getFormData);
			this.disabled = true;
			let isLevel = false;
			this.timeRangeArr.push(res.activiteDateBegin);
			this.timeRangeArr.push(res.activiteDateEnd);
//			console.log(JSON.stringify(res));
			this.form = {
				id: res.id,
				version: res.version,
				activityName: res.activityName, // 活动名称
				activiteDateBegin: res.activiteDateBegin, // 
				activiteDateEnd: res.activiteDateEnd, // 活动时间
				activityRuleJson: JSON.stringify(res.activityRuleJson), // 活动规则设置
				prizeJson: JSON.stringify(res.prizeJson), // 奖品设置
				//					grantObj: res.activityRuleJson.grantObj,//发送对象
				joinType: res.activityRuleJson.joinType.split(","),
				joinCond: res.activityRuleJson.joinCond,
				receiveType: res.activityRuleJson.receiveType,
				receiveMax: res.activityRuleJson.receiveMax
			};
			res.activityRuleJson.joinType.split(",").forEach((val, index) => {
				if(val == "需激活手机且绑卡时间为") {
					this.timeTied = true;
					this.timeTiedCard.push(res.activityRuleJson.joinCond.tiedCardDateBegin);
					this.timeTiedCard.push(res.activityRuleJson.joinCond.tiedCardDateEnd);
				}
				if(val == "需消费金额区间") {
					this.membersPrice = true;
					this.membersPriceBegin = res.activityRuleJson.joinCond.membersPriceBegin;
					this.membersPriceEnd = res.activityRuleJson.joinCond.membersPriceEnd;
					this.membersPriceDay = res.activityRuleJson.joinCond.membersPriceDay;
				}
				if(val == "按会员等级领券") {
					isLevel = true;
				}
			})
			//				console.log(res.prizeJson)
			this.templateItems = [];
			res.prizeJson.forEach((val, index) => {
				this.templateItems.push({
					'id': index,
					'isLevel': isLevel,
					'component': 'scavenging-voucher',
					'data': res.prizeJson[index],
					'delect': this.getPageType != '查看'
				});
			})
		}
	},
	computed: {
		//登录时候缓存的用户类型和用户代码
		...mapGetters([
			'userInfo',
		]),
		// 计算属性
		getPageType() {
			return this.$route.params.pageType;
		},
		getFormData() {
			return this.$route.params.formData;
		}
	}
};</script>
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width: 100%;
}

.el-select {
	width: 100%;
}

.radio {
	position: relative;
	width: 100%;
}

.radioInfo {
	position: absolute;
	left: 24px;
	top: -8px;
}


/*弹出窗*/

.searchContent {
	width: 202px;
	margin-bottom: 10px;
}

.Store .el-dialog .el-form {
	position: inherit;
}

.Store .el-dialog .role {
	height: 400px;
	width: 100%;
}

.search {
	position: relative;
}

.activityContainerM {
	margin-top: 20px;
}


/*// 行内form*/

.el-table-filter {
	max-height: 300px;
	overflow: auto;
}


/*// 行内form*/

.inlineFormItem {
	width: 130px;
	float: left;
	margin-right: 10px;
}

.inlineInput {
	width: 350px;
}

.formText {
	float: left;
	margin-right: 10px;
}

.addBtn {
	cursor: pointer;
	border: 1px solid #d9d9d9;
	border-radius: 5px;
	text-align: center;
	/*background: #009ee2;*/
}

.deteleBtn {
	margin-bottom: 10px;
	cursor: pointer;
	border: 1px solid #d9d9d9;
	border-radius: 5px;
	text-align: center;
	/*background: #d9d9d9;*/
}

.notWin {
	/*width: 1000px;*/
}

.recTime {
	width: 270px;
	display: inline-block;
}

.recTimeCount {
	width: 350px;
	display: inline-block;
}
.membersPriceDay{
	width:100px;
	margin: 0 10px;
}
.width175{
	width: 175px;
}
</style>