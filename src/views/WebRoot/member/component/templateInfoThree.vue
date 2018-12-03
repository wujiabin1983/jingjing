// 营销活动 - 活动管理 - 新建活动/查看详情/修改 - 赠送内容
<template>
	<el-main>
		<el-card>
			<el-form :model="form" ref="form" :rules="this.getPageType=='查看' ? norules : rules" label-width="120px" class="demo-form">
				<el-form-item label="赠送类型" prop="giveType">
					<el-radio-group v-model="type" @change="handleChangeType">
						<el-radio :disabled="disabled" label="送券" v-if="flag1">送券</el-radio>
						<el-radio :disabled="disabled" label="送积分" v-if="flag2">送积分</el-radio>
						<el-radio :disabled="disabled" label="发消息" v-if="flag3">发消息</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="">
					<el-card ref="subForm1" v-show="type=='送券'">
						<el-form :model="sendStamps" :rules="this.getPageType=='查看' ? norules : rules1" ref="form1" label-width="120px" class="demo-form">
							<el-form-item label="发送电子券" prop="couponArray">
								<!--<el-select v-model="subForm1.sendElecCoupon" placeholder="请选择发送电子券">
		                            <el-option label="请选择发送电子券" value="请选择发送电子券"></el-option>
		                        </el-select>
		                        -->
								<el-input v-model="sendStamps.couponArray" :disabled="true" v-show=""></el-input>
								<el-input v-model="coupTempName" :disabled="true" placeholder="选择券模板" class="width40"></el-input>
								<el-button type="primary" id="search" @click="coupTempClick" v-if="this.getPageType!='查看'">选择</el-button>
							</el-form-item>
							<el-form-item label="券有效期" prop="couponDate">
								<el-input v-model="sendStamps.couponDate" :disabled="true" v-show=""></el-input>
								<el-radio-group v-model="subForm1.couponValid" @change="handleChangeCouponValid">
									<el-radio label="有效时段" :disabled="disabled">
										<el-form :inline="true" class="demo-form-inline disInBlock">
											<span class="formText">自</span>
											<el-form-item class="inlineFormItem">
												<el-select v-model="subForm1.validA1" placeholder="请选择" @change="validA1" :disabled="subForm1ValidA">
													<el-option label="领取" value="领取"></el-option>
												</el-select>
											</el-form-item>
											<span class="formText">之日起</span>
											<el-input v-model="subForm1.validA2" class="width120" placeholder="请输入" @change="validA2" type="number" min="1" :disabled="subForm1ValidA"></el-input>
											<span class="formText">天内有效</span>
										</el-form>
									</el-radio>
									<br>
									<el-radio label="同活动起止日期" :disabled="disabled"></el-radio>
									<br>
									<el-radio label="自定义" class="mrgTop15" :disabled="disabled" v-if="isLongDate">
										<el-form :inline="true" class="demo-form-inline disInBlock">
											<span class="formText">自定义</span>
											<el-form-item class="inlineFormItem width170">
												<el-date-picker :editable="false" v-model="subForm1.validB1" :picker-options="pickerOptions0" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" @change="beginDataChange" type="date" placeholder="选择日期" :disabled="subForm1ValidB" class="width170"></el-date-picker>
											</el-form-item>
											<span class="formText">至</span>
											<el-form-item class="inlineFormItem width170">
												<el-date-picker :editable="false" v-model="subForm1.validB2" :picker-options="pickerOptions1" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" @change="endDataChange" type="date" placeholder="选择日期"  :disabled="subForm1ValidB" class="width170"></el-date-picker>
											</el-form-item>
										</el-form>
									</el-radio>
								</el-radio-group>
							</el-form-item>
							<!--<el-form-item label="领券时间" prop="getCouponDate" >
								<el-form :inline="true" class="demo-form-inline">
									<span class="formText">自发放之日起</span>
									<el-form-item class="inlineFormItem">
										<el-input v-model="sendStamps.getCouponDate" :disabled="disabled"  placeholder="请输入"></el-input>
									</el-form-item>
									<span class="formText">天内有效</span>
								</el-form>
							</el-form-item>-->
						</el-form>
					</el-card>
					<el-card ref="subForm2" v-show="type=='送积分'">
						<el-form :model="subForm2" label-width="0px" class="demo-form">
							<el-form-item label="">
								<el-radio-group v-model="subForm2.couponValid" @change="handleChangeCouponValid">
									<el-radio label="赠送" :disabled="subForm2Set">
										<el-form :inline="true" class="demo-form-inline disInBlock">
											<span class="formText">赠送</span>
											<el-form-item class="inlineFormItem">
												<el-input v-model="subForm2.validA" placeholder="请输入" type="number" min="1" class="subFormValid" :disabled="subForm2ValidA"></el-input>积分
											</el-form-item>
										</el-form>
									</el-radio>
									<br>
									<el-radio label="消费送" :disabled="subForm2Set">
										<el-form :inline="true" class="demo-form-inline disInBlock">
											<span class="formText">消费送</span>
											<el-form-item class="inlineFormItem">
												<el-input v-model="subForm2.validB" placeholder="请输入" type="number" min="1" class="subFormValid" :disabled="subForm2ValidB"></el-input>倍积分
											</el-form-item>
										</el-form>
									</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-form>
					</el-card>
				</el-form-item>
				<el-form-item label="审核人" prop="auditBy">
					<el-input v-model="form.auditBy" class="width200" :disabled="disabled" v-if="this.getPageType=='查看'" placeholder="请输入"></el-input>
					<el-select v-model="form.auditBy" placeholder="请选择审核人" @change="audioSelect" v-else>
						<el-option v-for="item in audioUser" :key="item.key" :label="item.key" :value="item.index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发放限制" prop="" v-if="isEvent&&type=='发消息'">
					<el-form :inline="true" class="demo-form-inline">
						<span class="formText">对同一会员的两次发送时间间隔</span>
						<el-input v-model="form.grantLimit" class="width120" :disabled="disabled" placeholder="请输入"></el-input>
						<span class="formText">小时</span>
					</el-form>
				</el-form-item>
				<el-form-item label="活动说明" prop="activiteDesc">
					<el-input type="textarea" :rows="2" placeholder="请输入内容" :disabled="disabled" resize="none" v-model="form.activiteDesc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
				</el-form-item>
				<!--<el-dialog :visible.sync="handleStoreDialog" width="50%">
		            <Store></Store>
		            <span slot="footer" class="dialog-footer">
		                <el-button @click="handleStoreDialog = false">取 消</el-button>
		                <el-button type="primary" @click="handleStoreDialog = false">确 定</el-button>
		            </span>
		        </el-dialog>-->
				<el-button type="primary" class="marginTop12" @click="back">上一步</el-button>
				<el-button type="primary" class="marginTop12" @click="next">下一步</el-button>
			</el-form>
		</el-card>
		<el-dialog title="" :visible.sync="handleTabDialogCoup" class="dialogTab">
			<template>
			    <el-tabs v-model="activeName1" @tab-click="handleClickCoup">
				    <el-tab-pane label="选择优惠券" name="first">
						<div class="search">
							<el-select v-model="couponType" class="searchContent" clearable placeholder="请选择券类型">
								<el-option label="礼品券" value="礼品券"></el-option>
								<el-option label="折扣券" value="折扣券"></el-option>
								<el-option label="代金券" value="代金券"></el-option>
							</el-select>
							<el-input v-model="coupLibraryKey" class="searchContent" placeholder="请输入券ID或券名称"></el-input>
							<el-button type="primary" id="search" @click="searchLibrary">搜索</el-button>
						</div>
						<el-table ref="tableDataTab" class="el-tableRadio" v-loading="couponLoading" :data="coupDataTab" highlight-current-row  border @current-change="handleSelectionChangeTab">
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column prop="couponType" label="类型"></el-table-column>
							<el-table-column prop="coupName" label="券名称"></el-table-column>
						</el-table>
		                <!-- 分页 -->
		                <el-footer v-if="count != 0">
		                    <el-pagination 
		                        background 
		                        class="pagination"
		                        layout="prev, pager, next, jumper" 
		                        :page-size="limit"
		                        :total="count" 
		                        @current-change="handleCoupChange">
		                    </el-pagination>
		                </el-footer>
				    </el-tab-pane>
				    <el-tab-pane label="选择券包" name="second">
						<div class="search">
							<el-input v-model="coupPackInfo" class="searchContent" placeholder="请输入券包名称"></el-input>
							<el-button type="primary" id="search" @click="searchPackage">搜索</el-button>
						</div>
						<el-table ref="tableDataTab" class="el-tableRadio" v-loading="couponLoading" :data="coupPackDataTab" highlight-current-row  border @current-change="handlePackSelectionChangeTab">
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column prop="coupPackName" label="券包名称"></el-table-column>
						</el-table>
		                <!-- 分页 -->
		                <el-footer v-if="count1 != 0">
		                    <el-pagination 
		                        background 
		                        class="pagination"
		                        layout="prev, pager, next, jumper" 
		                        :page-size="limit"
		                        :total="count1" 
		                        @current-change="handleCoupPackChange">
		                    </el-pagination>
		                </el-footer>
				    </el-tab-pane>
				    <el-tab-pane label="选择门店券" name="third">
						<div class="search">
							<el-input v-model="storeLibName" class="searchContent" placeholder="请输入门店券名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreLibrary">搜索</el-button>
						</div>
						<el-table ref="tableDataTab" :data="coupDataTab" class="el-tableRadio" highlight-current-row  border @current-change="handleSelectionChangeTab2">
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column prop="storeLibId" label="券ID"></el-table-column>
							<el-table-column prop="storeLibName" label="券名称"></el-table-column>
							<el-table-column prop="enableBy" label="创建人"></el-table-column>
						</el-table>
		                <!-- 分页 -->
		                <el-footer v-if="count2!=0">
		                    <el-pagination 
		                        background 
		                        class="pagination" 
		                        layout="prev, pager, next, jumper" 
		                        :page-size="limit"
		                        :total="count2" 
		                        @current-change="handleStoreChange">
		                    </el-pagination>
		                </el-footer>
				    </el-tab-pane>
			    </el-tabs>
			</template>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleTabDialogCoup = false">取 消</el-button>
				<el-button type="primary" @click="enterCoup">确 定</el-button>
			</div>
		</el-dialog>
	</el-main>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateInt, validateFloat } from '@/utils/validate';
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { selectAudioUser } from '@/api/public'
	import { selectCouponLibraryJurisdiction } from '@/api/member/couponLibrary'
	import { selectCouponPackageJurisdiction } from '@/api/member/couponPackage'
	import { selectStoreVoucherLibraryJurisdiction} from '@/api/member/storeVoucherLibrary'
	//import { Store } from '@/views/WebRoot/platform'
	import { mapGetters } from 'vuex'
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
	            disabledDateBegin:'',
				pickerOptions0: {
	                disabledDate: (time) => {
	                    if (this.subForm1.validB2 != "") {
	                        return time.getTime() > this.subForm1.validB2;
	                    } else {
	                        return time.getTime() <= Date.now();
	                    }
	                }
	            },
	            pickerOptions1: {
	                disabledDate: (time) => {
	                    if (this.subForm1.validB1 != "") {
	                        return time.getTime() > this.subForm1.validB1;
	                    } else {
	                        return time.getTime() <= Date.now();
	                    }
	                }
	            },
				isLongDate:true,
				isEvent:true,//是否是事件触发
				flag1:true,
				flag2:true,
				flag3:true,
				storeLibName:'',
				couponLoading:false,
				disabled: false,
				subForm2Set: false,
				//弹窗  选择优惠券
				tabType: '选择优惠券',
				activeName1:'first',
				coupTempName: '',
				activeName: 'first',
				data2: [], //搜索门店的值
				value2: [], //选择的值
				handleTabDialog: false,
				coupPackInfo:'',//券包
				coupLibraryKey:'',//优惠券库 id 和 name
				couponType:'',//优惠券库类型
				coupTempName:'',//优惠券input容器
				coupDataTab:[],//弹窗优惠券
				coupPackDataTab:[],//弹窗券包
				handleTabDialogCoup:false,//优惠券弹窗
				// form表单数据
				type: '送券', // 赠送类型
				form: {
					giveType: '', // 赠送类型
					auditPersionId: '', //审核人	
					auditBy: '', //审核人	
					grantLimit: '', // 发放限制
					activiteDesc: '' // 活动说明
				},
				norules: {},
				// 赠送类型 form表单数据
				subForm1: {
					couponArray: '', // 发送电子券   选择的优惠券 或者券包的json串
					couponValid: '有效时段', // 券有效期
					validA1: '领取', // 券有效期 - 限时有效
					validA2: '', // 券有效期 - 限时有效
					validB1: '', // 券有效期 - 自定义
					validB2: '' // 券有效期 - 自定义
				},
				sendStamps: { // 送券
					stampsType: '1',
					couponArray: '', //发送电子券
					couponDate: '', //券有效期
					getCouponDate: '' //领券时间
				},
				awardPoints: '', //送积分
				rules: { //验证整体
					giveType: [{
							required: true,
							message: '请输入赠送类型信息',
							trigger: 'change'
						},
						{
							max: 10000,
							message: '最大长度不能超过2000',
							trigger: 'change'
						}
					],
					auditBy: [{
							required: true,
							message: '请选择审核人',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					grantLimit: [{
							required: true,
							message: '请输入发放时间间隔',
							trigger: 'change'
						},{
							validator: isInt
						}
					],
				},
				rules1: { //验证送券
					couponArray: [{
							required: true,
							message: '请选择电子券',
							trigger: 'change'
						},
						{
							max: 2000,
							message: '最大长度不能超过2000',
							trigger: 'change'
						}
					],
					couponDate: [{
							required: true,
							message: '请选择券有效期',
							trigger: 'change'
						},
						{
							max: 200,
							message: '最大长度不能超过200',
							trigger: 'change'
						}
					],
					getCouponDate: [{
							required: true,
							message: '请输入领券时间',
							trigger: 'change'
						},{
							validator: isInt
						}
					]
				},
				subForm1ValidA: false,
				subForm1ValidB: true,
				subForm2: {
					couponValid: '赠送', // 券有效期
					validA: '', // 券有效期 - 赠送
					validB: '', // 券有效期 - 消费送
				},
				subForm2ValidA: false,
				subForm2ValidB: true,
				// 适用门店 的dialog弹窗框
				handleStoreDialog: false,
				radiusType: '送券',
				audioUser: [],

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				page1: 0, // 当前页
				count1: 0, // 总条数
				page2: 0, // 当前页
				count2: 0, // 总条数
				limit: this.GLOBAL.limitDialog, // 条/页
			}
		},
		//  components: {
		//      Store
		//  },
		methods: {
	        handleStoreChange(val){
	            this.page2 = val;
	            this.showStoreLibrary(val, this.limit);
	        },
	    	//点击搜索门店券库
			searchStoreLibrary(){
				this.showStoreLibrary('',this.limit);
			},
			//查询门店券库
			showStoreLibrary(start,limit){
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"storeLibName": this.storeLibName
				}
				// 使表格加载
//				console.log(params)
				// 查询接口
				selectStoreVoucherLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						if(data.data){
							let array = [];
							that.coupDataTab = data.data;
							that.count2 = data.count;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			handleClickCoup(tab ,event){
				this.tabType = tab.label;
				if(tab.label == "选择优惠券"){
					this.showCouponLibrary(this.page,this.limit);	
				}
				if(tab.label == "选择券包"){
					this.showCouponPackage(this.page1,this.limit);	
				}
				if(tab.label == "选择门店券"){
					this.showStoreLibrary(this.page2,this.limit);	
				}
			},
			// 弹窗优惠券分页
	        handleCoupChange(val) {
	            this.page = val;
	            this.showCouponLibrary(val, this.limit);
	        },
			handleSelectionChangeTab2(val){
	            if(val){
		        	this.form.couponType=val.couponType;
		        	let params = {
			        	coupName:val.storeLibName,
			        	coupId:val.storeLibId,
			        	type:'门店券'
		        	}
					this.coupTempName=val.storeLibName;
		        	this.sendStamps.couponArray=JSON.stringify(params);//@
	        	}
			},
	        handleSelectionChangeTab(val){
//	        	console.log(JSON.stringify(val))
	        	if(val){
		        	this.form.couponType=val.couponType;
		        	let params = {
			        	coupName:val.coupName,
			        	coupId:val.coupId,
			        	type:'券'
		        	}
					this.coupTempName=val.coupName;
		        	this.sendStamps.couponArray=JSON.stringify(params);//@
	        	}
	        },
	        handleCoupPackChange(val){
	            this.page1 = val;
	            this.showCouponPackage(val, this.limit);
	        },
	        handlePackSelectionChangeTab(val){
	        	// console.log(JSON.stringify(val))
	        	if(val){
		        	let params = {
			        	coupName:val.coupPackName,
			        	coupId:val.coupPackId,
			        	type:'包'
		        	}
					this.coupTempName=val.coupPackName;
		        	this.sendStamps.couponArray=JSON.stringify(params);//@
	        	}
	        },
			//点击选择券模板
			coupTempClick() {
				this.showCouponLibrary(this.page, this.limit);
				this.handleTabDialogCoup = true;
			},
			enterStore() {
				this.data2 = [];
				this.value2 = [];
				this.handleTabDialogCoup = false;
			},
			//点击搜索优惠券库
			searchLibrary(){
				this.showCouponLibrary('',this.limit);
			},
			//点击搜索券包
			searchPackage(){
				this.showCouponPackage('',this.limit);
			},
			//查询优惠券库
			showCouponLibrary(start,limit){
				this.couponLoading=true;
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"systemStatus":"已生效",
					"coupLibraryKey": this.coupLibraryKey,
					"couponType": this.couponType
				}
	//			console.log(params)
				// 使表格加载
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(JSON.stringify(data));
						if(data.data){
							let array = [];
							that.coupDataTab = data.data;
							that.count = data.count;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
						that.couponLoading=false;
					})
					.catch(function(err) {
						that.couponLoading=false;
						// console.log(err);
					});
			},
			//查询券包
			showCouponPackage(start,limit){
				this.couponLoading=true;
				let that = this;
				let params = {
					userId :this.userInfo.userCode,
					page: start,
					limit: limit,
					coupStatus:"已生效",
					coupPackName: this.coupPackInfo
				}
				// 使表格加载
				// 查询接口
//				console.log(params)
				selectCouponPackageJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(JSON.stringify(data));
						let array = [];
//						data.data.forEach((val, index) => {
//							array.push({
//								coupName:val.coupPackName,
//								coupId:val.id,
//								index:index
//							});
//						})
						that.countPack = data.count;
						that.coupPackDataTab = data.data;
						that.couponLoading=false;
					})
					.catch(function(err) {
						that.couponLoading=false;
						// console.log(err);
					});
			},
			//弹窗确认
			enterCoup(val){
				this.handleTabDialogCoup = false;
			},
			
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			//选择审核人
			audioSelect(val) {
				//      	console.log(this.audioUser[val].value);
				this.form.auditPersionId = this.audioUser[val].value;
				this.form.auditBy = this.audioUser[val].key;
			},
			// 单选
			radioTimeHandle(str) {
				if(str == '时间段') {
					this.datePickerDisabled = false;
				} else if(str == '长期') {
					this.datePickerDisabled = true;
				}
			},
			leftChange(val) {
				// console.log(val)
			},
			// 时间选择器
			datePickerTime(str) {
				this.timeRange = str;
			},
			// 切换类型
			handleChangeType(str) {
				//      	console.log(str)
				this.radiusType = str;
			},
			// 切换券有效期
			handleChangeCouponValid(str) {
				//      	console.log(str)
				if(str == '有效时段') {
					this.subForm1ValidA = false;
					this.subForm1ValidB = true;
					this.subForm1.validB1 = ''; // 券有效期 - 自定义
					this.subForm1.validB2 = ''; // 券有效期 - 自定义
					this.sendStamps.couponDate = '';
					
					let params = {
						type: 　this.subForm1.validA1,
						day: 　this.subForm1.validA2
					}
					this.sendStamps.couponDate = JSON.stringify(params);
					this.sendStamps.stampsType = '1';
				}
				if(str == '同活动起止日期') {
					this.subForm1ValidA = true;
					this.subForm1ValidB = true;
					this.subForm1.validB1 = ''; // 券有效期 - 自定义
					this.subForm1.validB2 = ''; // 券有效期 - 自定义
					this.subForm1.validA2 = ''; // 券有效期 - 限时有效

					this.sendStamps.couponDate = '同活动起止日期';
					this.sendStamps.stampsType = '2';
				}
				if(str == '自定义') {
					this.subForm1ValidA = true;
					this.subForm1ValidB = false;
					this.subForm1.validA2 = ''; // 券有效期 - 限时有效
					this.sendStamps.couponDate = '';

					this.sendStamps.stampsType = '3';
				}
				if(str == '赠送') {
					this.subForm2ValidA = false;
					this.subForm2ValidB = true;
					this.subForm2.validB = ''; //消费送的倍数值
				}
				if(str == '消费送') {
					this.subForm2ValidA = true;
					this.subForm2ValidB = false;
					this.subForm2.validA = ''; //赠送的倍数值
				}
			},
			validA1(val){
//				console.log(val)
				if(this.subForm1.validA2!=""&&val!=""){
					let params = {
						type: 　this.subForm1.validA1,
						day: 　this.subForm1.validA2
					}
					//		                console.log(params)
					this.sendStamps.couponDate = JSON.stringify(params);
				}
			},
			validA2(val){
//				console.log(val)
				if(this.subForm1.validA1!=""&&val!=""){
					let params = {
						type: 　this.subForm1.validA1,
						day: 　this.subForm1.validA2
					}
					//		                console.log(params)
					this.sendStamps.couponDate = JSON.stringify(params);
				}
			},
			beginDataChange(val){
			 	let begin =new Date(val).getTime();
				let end = new Date(JSON.parse(JSON.parse(sessionStorage.getItem('dataOne')).activityDate).activityDateEnd).getTime();				 	
			 	this.pickerOptions1={
	                disabledDate: (time) => {
	                    return time.getTime() <= begin || time.getTime() >= end
	                }
			 	}
				if(this.subForm1.validB2!=""){
					let params = {
						dataBegin: 　this.subForm1.validB1,
						dataEnd: 　this.subForm1.validB2
					}
					this.sendStamps.couponDate = JSON.stringify(params);
				}
			},
			endDataChange(val){
			 	let begin =new Date(JSON.parse(JSON.parse(sessionStorage.getItem('dataOne')).activityDate).activityDateBegin).getTime();
				let end = new Date(val).getTime();				 	
			 	this.pickerOptions0={
	                disabledDate: (time) => {
	                    return time.getTime() <= begin || time.getTime() >= end
	                }
			 	}
			 	this.pickerOptions1={
	                disabledDate: (time) => {
	                    return time.getTime() <= begin || time.getTime() >= end
	                }
			 	}
				if(this.subForm1.validB1!=""){
					let params = {
						dataBegin: 　this.subForm1.validB1,
						dataEnd: 　this.subForm1.validB2
					}
					this.sendStamps.couponDate = JSON.stringify(params);
				}
			},
			back() {
				if(sessionStorage.getItem("dataTwo")){
					if(sessionStorage.getItem("dataTwo")==""){
						this.$emit('message2', '0');
					}else{
						this.$emit('message2', '1');
					}
				}else{
					this.$emit('message2', '0');
				}
			},
			next() {
				let that = this;
				let count = 0;
				if(this.getPageType == "查看"){
					that.$emit('message2', '3');
					return false;
				}
				if(this.radiusType == "送券") {
					if(this.subForm1.couponValid == "有效时段") {
						if(this.subForm1.validA1!=''&&this.subForm1.validA2!=''){
							let params = {
								type: 　this.subForm1.validA1,
								day: 　this.subForm1.validA2
							}
							this.sendStamps.couponDate = JSON.stringify(params);
						}else{
							count++;
						}
					}
					if(this.subForm1.couponValid == "自定义") {
						if(this.subForm1.validB1!=''&&this.subForm1.validB2!=''){
							let params = {
								dataBegin: 　this.subForm1.validB1,
								dataEnd: 　this.subForm1.validB2
							}
							this.sendStamps.couponDate = JSON.stringify(params);
						}else{
							count++;
						}
					}
					this.$refs['form1'].validate((valid) => { //验证送券里面的必填项
						if(valid) {
							if(count>0){
								if(this.subForm1.validA2==''){
									this.$message({
										message: '请输入天数',
										type: 'warning'
									});
								}
								return false;
							}
							this.form.giveType = JSON.stringify(this.sendStamps);
							this.$refs['form'].validate((valid) => {
								if(valid) {
//									console.log(JSON.stringify(this.form));
									if(this.getPageType != "查看") {
										that.form.radiusType = that.radiusType;
										sessionStorage.setItem("dataThree", JSON.stringify(that.form));
									}
									that.$emit('message2', '3');
								} else {
									// console.log('验证失败！')
								}
							})
						}
					})
				}
				if(this.radiusType == "送积分") {
					if(this.subForm2.couponValid == "赠送") {
						if(this.subForm2.validA != "") {
							let params = {
								type: "赠送",
								value: this.subForm2.validA
							}
							this.awardPoints = JSON.stringify(params);
						}
					}
					if(this.subForm2.couponValid == "消费送") {
						if(this.subForm2.validB != "") {
							let params = {
								type: "消费送",
								value: this.subForm2.validB
							}
							this.awardPoints = JSON.stringify(params);
						}
					}
					//				console.log(this.awardPoints)
					this.form.giveType = this.awardPoints;
					delete(this.form["couponArray"]);
					this.$refs['form'].validate((valid) => {
						if(valid) {
							if(this.getPageType != "查看") {
								that.form.radiusType = that.radiusType;
								sessionStorage.setItem("dataThree", JSON.stringify(that.form));
							}
							that.$emit('message2', '3');
						} else {
							// console.log('验证失败！')
						}
					})
				}
				if(this.radiusType == "发消息") {
					this.form.giveType = '发消息';
					this.$refs['form'].validate((valid) => {
						if(valid) {
							if(this.getPageType != "查看") {
								that.form.radiusType = that.radiusType;
								sessionStorage.setItem("dataThree", JSON.stringify(that.form));
							}
							that.$emit('message2', '3');
						} else {
							// console.log('验证失败！')
						}
					})
				}
			},
		},
		created() {
//	      	console.log(JSON.parse(JSON.parse(sessionStorage.getItem('dataOne')).activityDate).activityDateEnd)
//		    console.log(JSON.stringify(sessionStorage.getItem("dataTwo")))
//  	    console.log(JSON.stringify(sessionStorage.getItem("dataThree")))
			if(sessionStorage.getItem("dataOne")){
				 if(JSON.parse(sessionStorage.getItem('dataOne')).activityDate=='长期'){
				 	this.isLongDate=false;
				 }else{
				 	let begin =new Date(JSON.parse(JSON.parse(sessionStorage.getItem('dataOne')).activityDate).activityDateBegin).getTime();
					let end = new Date(JSON.parse(JSON.parse(sessionStorage.getItem('dataOne')).activityDate).activityDateEnd).getTime();				 	
				 	this.pickerOptions0={
		                disabledDate: (time) => {
	                        return time.getTime() <= begin || time.getTime() >= end
		                }
				 	}
				 	this.pickerOptions1={
		                disabledDate: (time) => {
	                        return time.getTime() <= begin || time.getTime() >= end
		                }
				 	}
				 }
			}
			if(sessionStorage.getItem("activityType")){
				if(sessionStorage.getItem("activityType")=="消费享N倍积分"){
					this.radiusType = "送积分";
					this.flag1=false;
					this.flag3=false;
					this.type="送积分";
				}
			}
			let that = this;
			if(this.getPageType != '查看') {
				if(JSON.parse(sessionStorage.getItem("dataOne")).activityType=="事件触发"){
					this.isEvent=false;
				}else{
					this.isEvent=true;
				}
			}
//		    console.log(sessionStorage.getItem("dataOne"))
			let params = {
				userId: this.userInfo.userCode
			}
			that.tableLoading = true;
			selectAudioUser(params) //请求会员等级
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					//              console.log(JSON.stringify(data)+"审核人")
					that.audioUser = data.data;
					that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
			// 钩子函数 -- 初始化
			if(sessionStorage.getItem("dataThree")) {
				let data = JSON.parse(sessionStorage.getItem("dataThree"));
				this.type = data.radiusType; //回显赠送类型
				this.radiusType = data.radiusType; //回显赠送类型s
				this.form = { //回显数据
					...data
				}
				//送券
				if(data.radiusType == "送券") {
					//电子券回显
					let giveType = JSON.parse(data.giveType);
					// console.log(giveType)
					this.form.couponArray = giveType.couponArray;
					this.sendStamps.couponArray = giveType.couponArray;
					this.coupTempName = JSON.parse(giveType.couponArray).coupName;

					//券有限期
					let stampsType = giveType.stampsType;
					if(stampsType == "1") {
						this.subForm1.validA1 = JSON.parse(giveType.couponDate).type;
						this.subForm1.validA2 = JSON.parse(giveType.couponDate).day;
					}
					if(stampsType == "2") {
						this.subForm1.couponValid = "同活动起止日期";
						this.sendStamps.couponDate = '同活动起止日期';
						this.sendStamps.stampsType = '2';
					}
					if(stampsType == "3") {
						this.subForm1ValidA = true;
						this.subForm1ValidB = false;
						this.subForm1.couponValid = "自定义";
						this.subForm1.validB1 = JSON.parse(giveType.couponDate).dataBegin;
						this.subForm1.validB2 = JSON.parse(giveType.couponDate).dataEnd;
					}
					//回显领券时间
					this.sendStamps.getCouponDate = giveType.getCouponDate;
				}
				if(data.radiusType == "送积分") {
					let giveType = JSON.parse(data.giveType);
					if(giveType.type == "赠送") {
						this.subForm2.validA = giveType.value;
					}
					if(giveType.type == "消费送") {
						this.subForm2ValidA = true,
						this.subForm2ValidB = false,
						this.subForm2.couponValid = "消费送";
						this.subForm2.validB = giveType.value;
					}
				}
				//          console.log(JSON.parse(data.giveType))
				//      	console.log(JSON.stringify(data));
			}
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.subForm1ValidA = true;
//				console.log(this.getFormData)
				let res = JSON.parse(this.getFormData);
				this.form = {
					giveType: res.marketingActivitie.giveType, // 赠送类型
					auditPersionId: res.marketingActivitie.auditPersionId, //审核人	
					auditBy: res.marketingActivitie.auditBy, //审核人	
					grantLimit: res.marketingActivitie.grantLimit, // 发放限制
					activiteDesc: res.marketingActivitie.activiteDesc // 活动说明
				}
				
				if(res.marketingActivitie.activityType=="事件触发"){
					this.isEvent=false;
				}else{
					this.isEvent=true;
				}
				//          console.log(JSON.stringify(this.form))
				if(res.marketingActivitie.giveType == "发消息") { //发消息
					this.type = res.marketingActivitie.giveType;
				} else if(res.marketingActivitie.giveType.type) { //送积分
					this.type = "送积分";
					this.subForm2.couponValid = res.marketingActivitie.giveType.type;
					this.subForm2.validA = res.marketingActivitie.giveType.value;
					this.subForm2ValidA = true;
					this.subForm2ValidB = true;
					this.subForm2Set = true;
				} else { //送券
					//电子券回显
					let giveType = this.form.giveType;
					this.form.couponArray = JSON.stringify(giveType.couponArray);
					this.sendStamps.couponArray = JSON.stringify(giveType.couponArray);
					this.coupTempName = giveType.couponArray.coupName;

					this.type = "送券";
					this.subForm1.couponArray = JSON.stringify(this.form.giveType.couponArray);
					let stampsType = this.form.giveType.stampsType;
					if(stampsType == "1") {
						this.subForm1.validA1 = this.form.giveType.couponDate.type;
						this.subForm1.validA2 = this.form.giveType.couponDate.day;
					}
					if(stampsType == "2") {
						this.subForm1.couponValid = "同活动起止日期";
					}
					if(stampsType == "3") {
						this.subForm1ValidA = true;
						this.subForm1ValidB = false;
						this.subForm1.couponValid = "自定义";
						this.subForm1.validB1 = this.form.giveType.couponDate.dataBegin;
						this.subForm1.validB2 = this.form.giveType.couponDate.dataEnd;
					}
					this.sendStamps.getCouponDate = this.form.giveType.getCouponDate;
				}

				//          sendStamps:{// 送券
				//          	stampsType:'1',
				//          	couponArray:'',//发送电子券
				//          	couponDate:'',//券有效期
				//          	getCouponDate:''//领券时间
				//          },
				//          subForm1: {
				//              couponArray: '', // 发送电子券   选择的优惠券 或者券包的json串
				//              couponValid: '有效时段', // 券有效期
				//              validA1: '', // 券有效期 - 限时有效
				//              validA2: '', // 券有效期 - 限时有效
				//              validB1: '', // 券有效期 - 自定义
				//              validB2: '' // 券有效期 - 自定义
				//          },
				//          that.audioUser.forEach((val, index) => {awardPoints
				//					console.log(val)
				//				})
			} else if(this.getPageType == '修改' && !sessionStorage.getItem("dataThree")) {
				let res = JSON.parse(this.getFormData);
				this.form = {
					giveType: res.marketingActivitie.giveType, // 赠送类型
					auditPersionId: res.marketingActivitie.auditPersionId, //审核人	
					auditBy: res.marketingActivitie.auditBy, //审核人	
					grantLimit: res.marketingActivitie.grantLimit, // 发放限制
					activiteDesc: res.marketingActivitie.activiteDesc // 活动说明
				}
				if(res.marketingActivitie.giveType == "发消息") {
					this.type = res.marketingActivitie.giveType;
					this.radiusType = "发消息";
				} else if(res.marketingActivitie.giveType.type) {
					this.type = "送积分";
					this.radiusType = "送积分";
					this.subForm2.couponValid = res.marketingActivitie.giveType.type;
					this.subForm2.validA = res.marketingActivitie.giveType.value;
					if(res.marketingActivitie.giveType.type == "赠送") {
						this.subForm2ValidA = false;
						this.subForm2ValidB = true;
					} else {
						this.subForm2ValidA = true;
						this.subForm2ValidB = false;
					}
				} else {
					//电子券回显
					let giveType = res.marketingActivitie.giveType;
					this.form.couponArray = JSON.stringify(giveType.couponArray);
					this.sendStamps.couponArray = JSON.stringify(giveType.couponArray);
					this.coupTempName = giveType.couponArray.coupName;
					//券有限期
					let stampsType = giveType.stampsType;
					if(stampsType == "1") {
						this.subForm1.validA1 = giveType.couponDate.type;
						this.subForm1.validA2 = giveType.couponDate.day;
					}
					if(stampsType == "2") {
						this.subForm1.couponValid = "同活动起止日期";
						this.sendStamps.couponDate = '同活动起止日期';
						this.sendStamps.stampsType = '2';
					}
					if(stampsType == "3") {
						this.subForm1ValidA = true;
						this.subForm1ValidB = false;
						this.subForm1.couponValid = "自定义";
						this.subForm1.validB1 = giveType.couponDate.dataBegin;
						this.subForm1.validB2 = giveType.couponDate.dataEnd;
					}
					//回显领券时间
					this.sendStamps.getCouponDate = giveType.getCouponDate;
					this.form.giveType = JSON.stringify(this.form.giveType);
				}
			} else if(this.getPageType == '创建' && !sessionStorage.getItem("dataThree")) {
				let res = JSON.parse(this.getFormData);
				this.form = {
					giveType: res.activeTempMas.giveType, // 赠送类型
					auditPersionId: res.activeTempMas.auditPersionId, //审核人	
					auditBy: res.activeTempMas.auditBy, //审核人	
					grantLimit: res.activeTempMas.grantLimit, // 发放限制
					activiteDesc: res.activeTempMas.activiteDesc // 活动说明
				}
				res.marketingActivitie=res.activeTempMas;
				if(res.marketingActivitie.giveType == "发消息") {
					this.type = res.marketingActivitie.giveType;
					this.radiusType = "发消息";
				} else if(res.marketingActivitie.giveType.type) {
					this.type = "送积分";
					this.radiusType = "送积分";
					this.subForm2.couponValid = res.marketingActivitie.giveType.type;
					this.subForm2.validA = res.marketingActivitie.giveType.value;
					if(res.marketingActivitie.giveType.type == "赠送") {
						this.subForm2ValidA = false;
						this.subForm2ValidB = true;
					} else {
						this.subForm2ValidA = true;
						this.subForm2ValidB = false;
					}
				} else {
					//电子券回显
					let giveType = res.marketingActivitie.giveType;
					this.form.couponArray = JSON.stringify(giveType.couponArray);
					this.sendStamps.couponArray = JSON.stringify(giveType.couponArray);
					this.coupTempName = giveType.couponArray.coupName;
					//券有限期
					let stampsType = giveType.stampsType;
					if(stampsType == "1") {
						this.subForm1.validA1 = giveType.couponDate.type;
						this.subForm1.validA2 = giveType.couponDate.day;
					}
					if(stampsType == "2") {
						this.subForm1.couponValid = "同活动起止日期";
					}
					if(stampsType == "3") {
						this.subForm1ValidA = true;
						this.subForm1ValidB = false;
						this.subForm1.couponValid = "自定义";
						this.subForm1.validB1 = giveType.couponDate.dataBegin;
						this.subForm1.validB2 = giveType.couponDate.dataEnd;
					}
					//回显领券时间
					this.sendStamps.getCouponDate = giveType.getCouponDate;
					this.form.giveType = JSON.stringify(this.form.giveType);
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
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.searchContent {
		width: 190px;
		margin-bottom: 10px;
	}
	
	div.el-dialog__body {
		padding: 10px 10px!important;
	}
	
	.Store .el-dialog .el-form {
		position: inherit;
	}
	
	.Store .el-dialog .role {
		height: 400px;
		width: 100%;
	}
	.el-card .el-form {
	    padding-top: 0px;
	}
	// 行内文本
	.formText {
		display: inline-block;
		line-height: rem(30px);
	}
	
	// 行内form
	.inlineFormItem {
		width: rem(130px);
	}
	
	.el-date-editor.el-input {
		width: auto;
	}
	.width40{
		width: 40%;
	}
	.width120{
		width: 120px;
	}
	.width170{
		width: 170px;
	}
	.width200{
		width: 200px;
	}
	.mrgTop15{
		margin-top: 15px;
	}
	.disInBlock{
		display: inline-block;
	}
	.subFormValid{
		margin: 0 5px;
	}
	.marginTop12{
		margin-top: 12px;
	}
</style>