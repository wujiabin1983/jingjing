<!--门店送券  - 子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="this.tableLoading"  :rules="rules" ref="form" label-width="130px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="14">
							<el-form-item label="选择门店" placeholder="请选择门店" prop="useObject">
								<el-input v-model="storeArr" :readonly="true" placeholder="请选择门店" class="width220">
								</el-input>
								<el-button type="primary" id="search" v-if="this.getPageType!='查看'" @click="searchStorePop">选择</el-button>
							</el-form-item>
							<el-form-item label="发送电子券" prop="giveJson">
								<el-input v-model="coupTempName" :readonly="true" placeholder="选择券模板" class="width220"></el-input>
								<el-button type="primary" id="search" @click="coupTempClick" v-if="this.getPageType!='查看'">选择</el-button>
		                    </el-form-item>
							<el-form-item label="券有效期" prop="validityDate">
					            <el-radio-group v-model="validityDate" @change="radioTimeHandle" class="marginTop10">
				                    <el-radio label="长期" class="radio"> 
				                    	<div class="radioInfo">
				                    		<span class="formText">自领取之日起</span>
				                            <el-input class="inlineFormItem" v-model="form.validityDate" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
				                            <span class="formText">天内有效</span>
				                    	</div>
				                    </el-radio>
					            	<div class="activityContainerM">
					                    <el-radio label="时间段">
					                         <el-date-picker
					                         :disabled="datePickerDisabled"
										      v-model="timeRangeArr"
										      :editable="false" 
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
							<el-form-item label="使用说明">
								<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入使用说明" v-model="form.instructions">
								</el-input>
							</el-form-item>
							<el-form-item label="每月最大发放量" prop="maxNum">
								<el-input v-model="form.maxNum" type="number" min="1"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-button @click="handleBack">取消</el-button>
							<el-button type="primary" @click="submitForm('form')">确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-dialog title="" :visible.sync="handleTabDialog" class="transfer">
				<template>
				    <el-tabs v-model="activeName" @tab-click="handleClick">
					    <el-tab-pane label="门店" name="first">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
					    </el-tab-pane>
					    <el-tab-pane label="店组" name="second">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
					    </el-tab-pane>
					    <el-tab-pane label="区域" name="third">
							<div class="search">
								<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
								</el-cascader>
								<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
								<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
							</div>
							<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
							</el-transfer>
					    </el-tab-pane>
				    </el-tabs>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="" :visible.sync="handleTabDialogCoup" class="dialogTab">
				<template>
				    <el-tabs v-model="activeName1" @tab-click="handleClickCoup">
					    <el-tab-pane label="选择优惠券" name="first" v-loading="tableSelectLoading">
							<div class="search">
								<el-select v-model="couponType" class="searchContent" clearable placeholder="请选择券类型">
									<el-option label="礼品券" value="礼品券"></el-option>
									<el-option label="折扣券" value="折扣券"></el-option>
									<el-option label="代金券" value="代金券"></el-option>
								</el-select>
								<el-input v-model="coupLibraryKey" class="searchContent" placeholder="请输入券ID或券名称"></el-input>
								<el-button type="primary" id="search" @click="searchLibrary">搜索</el-button>
							</div>
							<el-table ref="tableDataTab" :data="coupDataTab" class="el-tableRadio" highlight-current-row  border @current-change="handleSelectionChangeTab">
								<el-table-column type="index" width="50" label="序号"></el-table-column>
								<el-table-column prop="couponType" label="类型"></el-table-column>
								<el-table-column prop="coupName" label="券名称"></el-table-column>
							</el-table>
							<!--<el-transfer :filterable="false" :titles="titleDataStore" @change="coupArray" v-model="value2" :props="{key: 'index',label: 'coupName'}" :data="data2">
							</el-transfer>-->
			                <!-- 分页 -->
			                <el-footer v-if="count != 0">
			                    <el-pagination 
			                        background 
			                        class="pagination" 
			                        layout="total,prev, pager, next, jumper" 
			                        :page-size="limit"
			                        :total="count" 
			                        @current-change="handleCoupChange">
			                    </el-pagination>
			                </el-footer>
					    </el-tab-pane>
					    <el-tab-pane label="选择门店券" name="third" v-loading="tableSelectLoading">
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
			                <el-footer v-if="countStore!=0">
			                    <el-pagination 
			                        background 
			                        class="pagination" 
			                        layout="prev, pager, next, jumper" 
			                        :page-size="limit"
			                        :total="countStore" 
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
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { selectCouponLibraryJurisdiction} from '@/api/member/couponLibrary'
	import { selectCouponPackageJurisdiction} from '@/api/member/couponPackage'
	import { addStoreVoucherData,setStoreVoucherData} from '@/api/tool/storeVoucher'
	import { selectStoreVoucherLibraryJurisdiction} from '@/api/member/storeVoucherLibrary'
	import { selectAudioUse,selectLevalInfo,selectProCityArea ,selectStoreData,selectTabData} from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				storeLibName:'',
	            // 弹窗优惠券分页
	            tableLoading:false,//表单
	            tableSelectLoading:false,//表格
	            page: 0, // 
	            pagePack: 0, // 当前页
	            pageStore: 0, // 当前页
	            count: 0, // 
	            countPack: 0, // 
	            countStore: 0, // 总条数
	            limit: this.GLOBAL.limitDialog, // 条/页
				// form表单数据
				validityDate:'长期',
				disabled:false,
				form: {
					useObject: '', // 选择门店
					giveJson: '', // 选择赠送券
					validityDate: '', // 活动时间
					instructions: '', // 使用说明
					maxNum: '' //每月最大发放量
				},
				datePickerDisabled:true,//券有效期-几天有效
				dateInputDisabled:false,//券有效期-时间段
				handleTabDialogCoup:false,//优惠券弹窗
				handleTabDialog:false,//门店弹窗
				timeRangeArr:[],//券有效期-时间段容器
				titleDataStore:['未选择门店','已选择门店'],//穿梭框的左右两侧的标题
				titleDataGroup:['未选择店组','已选择店组'],//穿梭框的左右两侧的标题
				titleDataArea:['未选择区域','已选择区域'],//穿梭框的左右两侧的标题
				coupPackInfo:'',//券包
				coupLibraryKey:'',//优惠券库 id 和 name
				couponType:'',//优惠券库类型
				dataIndex:[],//穿梭框右侧的值
				data2:[],//搜索门店的值
				value2: [],//选择的值
				optionsProCityAreaPop: [],//级联选择器省市区数据
				provinceId:'',//弹窗搜索省代码
				cityId:'',//弹窗搜索市代码
				areaId:'',//弹窗搜索区代码
				searchContent:'',//门店名称或编码
				storeArr:'',//门店input容器
				coupTempName:'',//优惠券input容器
				activeName:'first',
				activeName1:'first',
				tabType:'门店',
				coupDataTab:[],//弹窗优惠券
				coupPackDataTab:[],//弹窗券包
				rules: {
					useObject: [{
							required: true,
							message: '请选择门店',
							trigger: 'change'
						}
					],
					giveJson: [{
							required: true,
							message: '请选择电子券',
							trigger: 'change'
						}
					],
					validityDate: [{
							required: true,
							message: '请输入有效期',
							trigger: 'change'
						}
					],
					instructions: [{
							required: true,
							message: '请输入使用说明',
							trigger: 'change'
						}
					],
					maxNum: [{
							required: true,
							message: '请输入最大发放量',
							trigger: 'change'
						}
					]
				}
			}
		},
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
				this.tableSelectLoading=true;
//				console.log(params)
				// 查询接口
				selectStoreVoucherLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						if(data.data){
							that.coupDataTab = data.data;
							that.countStore = data.count;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableSelectLoading=false;
					});
			},
	    	// 弹窗优惠券分页
	        handleCoupChange(val) {
	        	if(val){
	        		this.page = val;
	        		this.showCouponLibrary(val, this.limit);
	        	}
	        },
	        handleSelectionChangeTab(val){
	            if(val){
		        	let params = {
		        		type:'优惠券',
			        	coupName:val.coupName,
			        	coupId:val.coupId
		        	}
					this.coupTempName=val.coupName;
	        		this.form.giveJson=JSON.stringify(params);
	            }
	        },
//	        handleCoupPackChange(val){
//	            this.pagePack = val;
//	            this.showCouponLibrary(val, this.limit);
//	        },
//	        handlePackSelectionChangeTab(val){
//	        	if(val){
//	        		this.form.couponType=val.couponType;
//		        	let params = {
//		        		type:'优惠券',
//			        	coupName:val.coupPackName,
//			        	coupId:val.id
//		        	}
//					this.coupTempName=val.coupPackName;
//		        	this.form.giveJson=JSON.stringify(params);
//	        	}
//	        },
			handleSelectionChangeTab2(val){
	            if(val){
		        	let params = {
		        		type:'门店券',
			        	coupName:val.storeLibName,
			        	coupId:val.storeLibId
		        	}
					this.coupTempName=val.storeLibName;
	        		this.form.giveJson=JSON.stringify(params);
	        	}
			},
	        //  券有效期 -单选
	        radioTimeHandle(str) {
	        	this.validityDate=str;
	            if(this.validityDate == '时间段') {
	                this.datePickerDisabled = false;
	                this.dateInputDisabled = true;
	            }else if(this.validityDate == '长期') {
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
	            this.form.validityDate=JSON.stringify(params);
	        },
			// 方法
			submitForm(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.tableLoading=true;
						let param = {
							userId:this.userInfo.userCode,
							...this.form
						}
						if(this.getPageType == '添加') {
//							console.log(JSON.stringify(param));
//							return false;
							addStoreVoucherData(param)
				                .then((res) => {
				                    let data = JSON.parse(Base64.decode(res.data));
				                    //    console.log(JSON.stringify(data)+"返回值");
				                    if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
				                        that.$message.success(data.messageContent);
										that.$router.push({
											name: '门店送券'
										});
				                    }else {
										that.tableLoading = false;
				                        that.$message.warning(data.messageContent);
				                    }
				                })
				                .catch((err) => {
									that.tableLoading = false;
				                    // console.log(err);
				                });
						} else if(this.getPageType == '修改') {
							// console.log(param)
							setStoreVoucherData(param)
				                .then((res) => {
				                    let data = JSON.parse(Base64.decode(res.data));
				                    //    console.log(JSON.stringify(data)+"返回值");
				                    if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
				                        that.$message.success(data.messageContent);
										that.$router.push({
											name: '门店送券'
										});
				                    }else {
										that.tableLoading = false;
				                        that.$message.error(data.messageContent);
				                    }
				                })
				                .catch((err) => {
									that.tableLoading = false;
				                    // console.log(err);
				                });
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '门店送券'
				});
			},
			// 状态单选框改变
			radioStatusChange(val) {
				// console.log(val);
			},
			//点击选择券模板
			coupTempClick(){
				if(this.activeName1=="first"){
					this.showCouponLibrary(this.page,this.limit);
				}else{
					this.showStoreLibrary(this.pageStore,this.limit);	
				}
				this.handleTabDialogCoup=true;
	    	},
	    	//监听弹窗tab页
			handleClickCoup(tab ,event){
	//			console.log(tab.label)
				this.coupDataTab=[];
				this.tabType = tab.label;
				if(tab.label == "选择优惠券"){
					this.showCouponLibrary(this.page,this.limit);	
				}
				if(tab.label == "选择券包"){
					this.showCouponPackage(this.pagePack,this.limit);	
				}
				if(tab.label == "选择门店券"){
					this.showStoreLibrary(this.pageStore,this.limit);	
				}
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
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"coupLibraryKey": this.coupLibraryKey,
					"couponType": this.couponType
				}
	//			console.log(params)
				// 使表格加载
				this.tableSelectLoading=true;
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						if(data.data){
							that.coupDataTab = data.data;
							that.count = data.count;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
			},
			//查询券包
			showCouponPackage(start,limit){
				let that = this;
				let params = {
					userId :this.userInfo.userCode,
					page: start,
					limit: limit,
					coupPackName: this.coupPackInfo
				}
				// 使表格加载
				// 查询接口
				this.tableSelectLoading=true;
				selectCouponPackageJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						if(data.data){
							that.countPack = data.count;
							that.coupPackDataTab = data.data;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
			},
			//监听穿梭框事件
//			coupArray(val){
//				var idArray='';
//				var nameArray='';
//				let indexArray='';
//				var that = this;
//				console.log(val)
//				this.dataIndex=val;
//				val.forEach((val, index) => {
//					indexArray+=index+",";
//					idArray+=that.data2[val].coupId+",";
//					nameArray+=that.data2[val].coupName+",";
//				})
//				let params={
//					indexArray:indexArray,
//					idArray:idArray,
//					nameArray:nameArray
//				}
//				this.coupTempName=nameArray;
//				this.form.giveJson=JSON.stringify(params);
//			},
			//弹窗确认
			enterCoup(val){
				this.handleTabDialogCoup = false;
			},
			//下面的门店  上面的优惠券//
			//监听tab页
			handleClick(tab ,event){
				this.tabType=event.target.firstChild.data;
				this.data2=[];
				this.value2=[];
				this.dataIndex=[];
				this.searchStoreTab();
			},
			//点击所属门店弹窗显示
			searchStorePop(){
				//请求省市区下拉框
				var params = {
					parentId :'1'
				}
		        selectProCityArea(params)
		        	.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
	//	        		console.log(JSON.stringify(data));
	        			this.optionsProCityAreaPop=[];
	        			data.forEach((val, index) => {
	        				if(val.label=="未知"){
		        				this.optionsProCityAreaPop.push({
		        					...val
		        				});
	        				}else{
	        					this.optionsProCityAreaPop.push({
	        						children:[],
	        						...val
	        					});
	        				}
	        			})
		        	})
		        	.catch((err) => {
						// console.log('err');        		
		        	})
	        	this.searchStoreTab();
				this.handleTabDialog = true;
			},
			//监听穿梭框事件
			storeArray(val){
				var idArray='';
				var nameArray='';
				var that = this;
//				console.log(val)
				that.data2.forEach((value, index) => {
					val.forEach((val, ind) => {
						if(value.storeId==val){
							idArray+=value.storeId+",";
							nameArray+=value.storeName+",";
						}
					})
				})
				idArray=idArray.substr(0,idArray.length-1);
				nameArray=nameArray.substr(0,nameArray.length-1);
//				console.log(nameArray)
				this.storeArr=nameArray;
				let params={
					idArray:idArray,
					nameArray:nameArray
				}
				if(this.activeName=="first"){
					params.type="门店";
				}
				if(this.activeName=="second"){
					params.type="店组";
				}
				if(this.activeName=="third"){
					params.type="区域";
				}
//					this.storeArr=nameArray;
				this.form.useObject=JSON.stringify(params);
			},
			//门店搜索（tab）
			searchStoreTab() {
				var params = {
					"userId": this.userInfo.userCode,
					"searchContent":this.searchContent,
					"provinceId":this.provinceId,
					"cityId":this.cityId,
					"areaId":this.areaId
				}
				// console.log(this.tabType);
				if(this.tabType=="门店"){
					params.flag="1";
				}
				if(this.tabType=="店组"){
					params.flag="2";
				}
				if(this.tabType=="区域"){
					params.flag="3";
				}
				// console.log(params)
				selectTabData(params)
					.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
	//	        		console.log(data)
						this.data2=[];
						if(data!=""){
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
						}
		        	})
		        	.catch((err) => {
						// console.log(err)   		
		        	})
				$("#transfer").show();
			},
	    	//监听父级选项动态加载省市区数据(弹窗内)
			cascaderSelect(val){
				if(val.length==1){
					let proIndex = val[0];
					let parentId = this.optionsProCityAreaPop[proIndex].key;
					let params = {
						parentId:parentId
					}
			        selectProCityArea(params)
			        	.then((res) => {
				        		let data = JSON.parse(Base64.decode(res.data));
	//					        		console.log(JSON.stringify(data));
				        		this.optionsProCityAreaPop[proIndex].children=[];
								data.forEach((val, index) => {
			        				if(val.label=="未知"){
										this.optionsProCityAreaPop[proIndex].children.push({
											...val
										});
			        				}else{
										this.optionsProCityAreaPop[proIndex].children.push({
											children:[],
											...val
										});
			        				}
								})
		//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
			        	})
			        	.catch((err) => {
							// console.log('err');        		
			        	})
				}
				if(val.length==2){
					let proIndex = val[0];
					let cityIndex = val[1];
					let parentId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					let params = {
						parentId:parentId
					}
			        selectProCityArea(params)
			        	.then((res) => {
				        		let data = JSON.parse(Base64.decode(res.data));
	//					        		console.log(JSON.stringify(data));
								let array = [];
				        		this.optionsProCityAreaPop[proIndex].children[cityIndex].children=[];
								data.forEach((val, index) => {
									array.push({
										...val
									});
								})
				        		this.optionsProCityAreaPop[proIndex].children[cityIndex].children=array;
	//				        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex].children[cityIndex].children))
			        	})
			        	.catch((err) => {
							// console.log('err');        		
			        	})
				}
			},
			//监听省市区返回值（弹窗）
			selectChange(val) {
				if(val.length == 0) {
					this.provinceId = '';
					this.cityId = '';
					this.areaId = '';
				}
				let proIndex = '';
				let cityIndex = '';
				let areaIndex = '';
				if(val.length == 1) {
					proIndex = val[0];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = '';
					this.areaId = '';
					let params = {
						parentId: this.provinceId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							this.optionsProCityAreaPop[proIndex].children = [];
							data.forEach((val, index) => {
								if(val.label == "未知") {
									this.optionsProCityAreaPop[proIndex].children.push({
										...val
									});
								} else {
									this.optionsProCityAreaPop[proIndex].children.push({
										children: [],
										...val
									});
								}
							})
						})
						.catch((err) => {
//							console.log(err);
						})
				}
				if(val.length == 2) {
					proIndex = val[0];
					cityIndex = val[1];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					this.areaId = '';
					let params = {
						parentId: this.cityId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							let array = [];
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
						})
						.catch((err) => {
//							console.log(err);
						})
				}
				if(val.length == 3) {
					proIndex = val[0];
					cityIndex = val[1];
					areaIndex = val[2];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					this.areaId = this.optionsProCityAreaPop[proIndex].children[cityIndex].children[areaIndex].key;
				}
			},
			//弹窗确认
			enterStore(val){
//				var nameArray='';
//				var that = this;
//				this.dataIndex.forEach((val, index) => {
//					nameArray+=that.data2[val].storeName+",";
//					this.storeArr=nameArray;
//				})
				this.handleTabDialog = false;
			},
		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			// console.log(this.getFormData);
			if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res,
					useObject:JSON.stringify(res.useObject), // 选择门店
					giveJson: JSON.stringify(res.giveJson), // 选择赠送券
					instructions: res.instructions, // 使用说明
					maxNum: res.maxNum
				}
				this.storeArr=res.useObject.nameArray;
				this.coupTempName=res.giveJson.coupName;
				if(res.validityDate.activityDateBegin){
					this.form.validityDate=JSON.stringify(res.validityDate);
					this.timeRangeArr.push(res.validityDate.activityDateBegin);
					this.timeRangeArr.push(res.validityDate.activityDateEnd);
					this.validityDate="时间段";
					this.datePickerDisabled=false;//券有效期-几天有效
					this.dateInputDisabled=true;//券有效期-时间段
				}else{
					this.form.validityDate=res.validityDate;
					this.validityDate="长期";
				}
				let coupArray = JSON.parse(this.form.useObject).idArray.split(",");
				this.value2=coupArray;
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
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-select {
		width: 100%;
	}
	.radio{
		position: relative;
		width: 100%;
		text-align: left;
	}
	.radioInfo{
		position: absolute;
		left: 0px;
		top: -8px;
		padding-left: 20px;
	}
	/*弹出窗*/
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.activityContainerM{
		margin-top: 20px;
	}
		
	/*行内form*/
	.inlineFormItem {
	    width: 130px;
	}
	.el-table-filter {
	    max-height: 300px;
	    overflow: auto;
	}
	#search{
		margin: 0;
	}
	.width220{
		width: 220px;
	}
</style>