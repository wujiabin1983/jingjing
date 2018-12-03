<!--扫码领券-新增-->
<template>
	<el-container>
		<el-main>
			<el-card>
				<el-form :model="form" v-loading="this.tableLoading" ref="form" label-width="86px" :rules="this.getPageType=='查看'?rules:rulesFormCustom" class="demo-form">
					<div class="activityInfo minH">
						<el-row :gutter="24">
							<el-col :span="24">
								<el-form-item label="类型" prop="activityJson">
									<el-radio-group v-model="form.giveType" @change="radioHandle">
										<el-radio label="送优惠券" :disabled="disabled">送优惠券</el-radio>
										<el-radio label="送门店券" :disabled="disabled">送门店券</el-radio>
										<el-radio label="送券包" :disabled="disabled">送券包</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="发送对象" prop="grantObj" v-if="this.isLevel">
									<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="grantObj" placeholder="请选择发送对象"></el-input>
									<el-select v-else v-model="grantObj" multiple class="inlineInput" placeholder="请选择" @change="roleSelect">
										<el-option v-for="item in storeTypeData" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-card v-show="form.giveType=='送优惠券'">
									<el-form-item label="优惠券" prop="coupName">
										<el-input v-model="form.coupName" :disabled="true" placeholder="选择优惠券" class="width260"></el-input>
										<el-button type="primary" id="search" @click="coupLibraryClick" v-if="this.getPageType != '查看'">选择</el-button>
									</el-form-item>
									<el-form-item label="券有效期" prop="coupDays">
										<el-radio-group v-model="coupDays" @change="radioTimeHandle" class="marginTop10">
											<div>
												<el-radio label="长期" class="radio" :disabled="disabled">
													<div class="radioInfo">
														<span class="formText">自领取之日起</span>
														<el-input class="inlineFormItem" v-model="form.coupDays" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
														<span class="formText">天内有效</span>
													</div>
												</el-radio>
											</div>
											<div class="activityContainerM">
												<el-radio label="时间段" :disabled="disabled">
													<el-date-picker :editable="false" :picker-options="pickerOptions0" :disabled="datePickerDisabled" v-model="timeRangeArr" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
													</el-date-picker>
												</el-radio>
											</div>
										</el-radio-group>
									</el-form-item>
									<el-form-item label="券说明" prop="coupDesc" class="activiteDesc width460">
										<el-input type="textarea" resize="none" v-model="form.coupDesc" :disabled="disabled" placeholder="请输入券说明"></el-input>
									</el-form-item>
								</el-card>
								<el-card v-show="form.giveType=='送门店券'">
									<el-form-item label="门店券" prop="coupName">
										<el-input v-model="form.coupName" :disabled="true" placeholder="选择门店券" class="width70"></el-input>
										<el-button type="primary" id="search" @click="coupStoreClick" v-if="this.getPageType != '查看'">选择</el-button>
									</el-form-item>
									<el-form-item label="券有效期" prop="coupDays">
										<el-radio-group v-model="coupDays" @change="radioTimeHandle" class="marginTop10">
											<div>
												<el-radio label="长期" class="radio" :disabled="disabled">
													<div class="radioInfo">
														<span class="formText">自领取之日起</span>
														<el-input class="inlineFormItem" v-model="form.coupDays" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
														<span class="formText">天内有效</span>
													</div>
												</el-radio>
											</div>
											<div class="activityContainerM">
												<el-radio label="时间段" :disabled="disabled">
													<el-date-picker :editable="false" :picker-options="pickerOptions0" :disabled="datePickerDisabled" v-model="timeRangeArr" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
													</el-date-picker>
												</el-radio>
											</div>
										</el-radio-group>
									</el-form-item>
									<el-form-item label="券说明" prop="coupDesc" class="activiteDesc">
										<el-input type="textarea" resize="none" v-model="form.coupDesc" :disabled="disabled" placeholder="请输入券说明"></el-input>
									</el-form-item>
									<el-table ref="tableDataTab" :data="coupDataInfoTab" highlight-current-row  border>
										<el-table-column type="index" width="50" label="序号"></el-table-column>
										<el-table-column prop="coupId" label="券ID"></el-table-column>
										<el-table-column prop="coupName" label="券名称"></el-table-column>
										<el-table-column prop="couponType" label="券类型"></el-table-column>
									</el-table>
					                <!-- 分页 -->
					                <el-footer v-if="count != 0">
					                    <el-pagination 
					                        background 
					                        class="pagination" 
					                        layout="prev, pager, next, jumper" 
					                        :page-size="limit"
					                        :total="counts" 
					                        @current-change="handleCoupsChange">
					                    </el-pagination>
					                </el-footer>
								</el-card>
								<el-card v-show="form.giveType=='送券包'">
									<el-form-item label="门店券包" prop="coupName">
										<el-input v-model="form.coupName" :disabled="true" placeholder="选择门店券包" class="width70"></el-input>
										<el-button type="primary" id="search" @click="coupPackageClick" v-if="this.getPageType != '查看'">选择</el-button>
									</el-form-item>
									<el-form-item label="券有效期" prop="coupDays">
										<el-radio-group v-model="coupDays" @change="radioTimeHandle" class="marginTop10">
											<div>
												<el-radio label="长期" class="radio" :disabled="disabled">
													<div class="radioInfo">
														<span class="formText">自领取之日起</span>
														<el-input class="inlineFormItem" v-model="form.coupDays" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
														<span class="formText">天内有效</span>
													</div>
												</el-radio>
											</div>
											<div class="activityContainerM">
												<el-radio label="时间段" :disabled="disabled">
													<el-date-picker :editable="false" :picker-options="pickerOptions0" :disabled="datePickerDisabled" v-model="timeRangeArr" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
													</el-date-picker>
												</el-radio>
											</div>
										</el-radio-group>
									</el-form-item>
									<el-form-item label="券说明" prop="coupDesc" class="activiteDesc">
										<el-input type="textarea" resize="none" v-model="form.coupDesc" :disabled="disabled" placeholder="请输入备注说明"></el-input>
									</el-form-item>
									<el-table ref="tableDataTab" :data="coupDataInfoTab" highlight-current-row  border>
										<el-table-column type="index" width="50" label="序号"></el-table-column>
										<el-table-column prop="coupId" label="券ID"></el-table-column>
										<el-table-column prop="coupName" label="券名称"></el-table-column>
										<el-table-column prop="couponType" label="券类型"></el-table-column>
									</el-table>
					                <!-- 分页 -->
					                <el-footer v-if="count != 0">
					                    <el-pagination 
					                        background 
					                        class="pagination" 
					                        layout="prev, pager, next, jumper" 
					                        :page-size="limit"
					                        :total="counts" 
					                        @current-change="handleCoupsChange">
					                    </el-pagination>
					                </el-footer>
								</el-card>
							</el-col>
						</el-row>
					</div>
				</el-form>
			</el-card>
			<el-dialog title="选择优惠券" :visible.sync="handleTabDialogCoup" class="dialogOne">
				<template>
					<div class="search">
						<el-select v-model="couponType" class="searchContent" clearable placeholder="请选择券类型">
							<el-option label="礼品券" value="礼品券"></el-option>
							<el-option label="折扣券" value="折扣券"></el-option>
							<el-option label="代金券" value="代金券"></el-option>
						</el-select>
						<el-input v-model="coupLibraryKey" class="searchContent" placeholder="请输入券ID或券名称"></el-input>
						<el-button type="primary" id="search" @click="searchLibrary">搜索</el-button>
					</div>
					<el-table ref="tableDataTab" v-loading="tableSelectLoading" :data="coupDataTab" class="el-tableRadio" highlight-current-row  border @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="couponType" label="类型"></el-table-column>
						<el-table-column prop="coupName" label="券名称"></el-table-column>
					</el-table>
	                <!-- 分页 -->
	                <el-footer v-if="countCoup!=0">
	                    <el-pagination 
	                        background 
	                        class="pagination" 
	                        layout="total, prev, pager, next, jumper" 
	                        :page-size="limit"
	                        :total="countCoup" 
	                        @current-change="handleCoupChange">
	                    </el-pagination>
	                </el-footer>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialogCoup = false">取 消</el-button>
					<el-button type="primary" @click="enterCoup">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="选择券包" :visible.sync="handlePackageDialog" class="dialogOne">
				<template>
					<div class="search">
						<el-input v-model="coupPackInfo" class="searchContent" placeholder="请输入券包名称"></el-input>
						<el-button type="primary" id="search" @click="searchPackage">搜索</el-button>
					</div>
					<el-table ref="tableDataTab" v-loading="tableSelectLoading" :data="coupPackDataTab" class="el-tableRadio" highlight-current-row border @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="coupPackName" label="券包名称"></el-table-column>
					</el-table>
	                <el-footer v-if="packageCount != 0">
	                    <el-pagination 
	                        background 
	                        class="pagination" 
	                        layout="total, prev, pager, next, jumper" 
	                        :page-size="limit"
	                        :total="packageCount"
	                        @current-change="handleCoupPackChange">
	                    </el-pagination>
	                </el-footer>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handlePackageDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterCoup">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="选择门店券" :visible.sync="handleStoreDialogCoup" class="dialogOne">
				<template>
					<div class="search">
						<el-input v-model="storeLibName" class="searchContent" placeholder="请输入门店券包名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreLibrary">搜索</el-button>
					</div>
					<el-table ref="tableDataTab" v-loading="tableSelectLoading" :data="coupDataTab" class="el-tableRadio" highlight-current-row border @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="storeLibId" label="券ID"></el-table-column>
						<el-table-column prop="storeLibName" label="券名称"></el-table-column>
						<el-table-column prop="enableBy" label="创建人"></el-table-column>
					</el-table>
	                <!-- 分页 -->
	                <el-footer v-if="counts!=0">
	                    <el-pagination 
	                        background 
	                        class="pagination" 
	                        layout="total, prev, pager, next, jumper" 
	                        :page-size="limit"
	                        :total="counts" 
	                        @current-change="handleStoreChange">
	                    </el-pagination>
	                </el-footer>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleStoreDialogCoup = false">取 消</el-button>
					<el-button type="primary" @click="enterCoup">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { returnSelectedFile } from '@/api/upload'
	import { award } from '@/views/WebRoot/tool'
	import { uploadImg } from '@/api/base/brandInfo'
//	优惠券库
	import { selectCouponLibraryJurisdiction} from '@/api/member/couponLibrary'
//	门店券库
	import { selectStoreVoucherLibraryJurisdiction} from '@/api/member/storeVoucherLibrary'
//	门店券包
	import { selectCouponPackageJurisdiction} from '@/api/member/couponPackage'
	import { getCoupInfo,selectLevalInfo,getCoupPackageInfo} from '@/api/public'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
		        tableLoading:false,
		        tableSelectLoading:false,
				disabled:false,
				storeLibName:'',
				handleTabDialogCoup:false,//优惠券弹窗
				handleStoreDialogCoup:false,//门店券
				handlePackageDialog:false,//券包
				couponType:'',
				coupLibraryKey:'',
				coupPackInfo:'',
				coupDataTab:[],
				coupDataInfoTab:[],
				coupPackDataTab:[],
				activityFlag: false,
				dialogImageUrl: '',
				templateItems: [{
					'id': 1,
					'isLevel':this.isLevel,
					'component': 'award',
					'data': this.activeTempDtl
				}],
				activeTempDtl: [],
				tableLoading: false,
				dialogVisible: false,
				handleTabDialog: false,
				datePickerDisabled:true,
				dateInputDisabled:false,
				submitFlag: false,
				dataIndex: [], //穿梭框右侧的值
				value2: [], //选择的值
				storeArr: '',
				storeArrOther: '',
				activeName: 'first',
				tabType: '门店',
				form: {
					"giveType": '送优惠券',
					"grantObj":"",
					"coupId": "", //优惠券Id
					"coupName": "", //优惠券名称
					"coupDays": "", //券有效期
					"coupDate": "",
					"coupDesc": "" //券说明
				},
				"coupDays": "长期", //券有效期
				"grantObj":[],
				storeTypeData:[],
				rules: {
				},
				timeRangeArr: [],
				rulesFormCustom: {
					coupName: [{
						required: true,
						message: '请选择优惠券',
						trigger: 'change'
					}],
					coupDays: [{
							required: true,
							message: '请选择时间',
							trigger: 'change'
						}
					]
				},
				count: 1,
				multipleSelectionTab:[],//优惠券选择
	            page: 0, // 
	            counts: 0, // 
	            startCoup:0,
	            countCoup:0,
	            packageCount:0,
	            packagePage:0,
	            limit: this.GLOBAL.limitDialog, // 条/页
			}
		},
		components: {
			award
		},
		props: ['data', 'index','isLevel'],
		methods: {
			roleSelect(val){
				let str = val.join(",");
				this.form.grantObj=str;
			},
			// 弹窗选择优惠券分页
	        handleCoupChange(val) {
	            this.page = val;
	            this.showCouponLibrary(val, this.limit);
	        },
	        // 弹窗选择门店券分页
	        handleStoreChange(val){
	            this.page = val;
	            this.showStoreLibrary(val, this.limit);
	        },
	        // 弹窗选择券包分页
	        handleCoupPackChange(val){
	        	this.packagePage=val;
				this.showCouponPackage(val,this.limit);
	        },
        	//门店券页面表格分页
	        handleCoupsChange(val){
	            this.startCoup = val;
				this.coupInfo(val,this.limit);
	        },
			//优惠券弹窗确认
			enterCoup(val){
//				console.log(JSON.stringify(this.multipleSelectionTab))
				if(this.multipleSelectionTab){
					if(this.form.giveType=="送优惠券"){
						this.form.coupId=this.multipleSelectionTab.coupId;
						this.form.coupName=this.multipleSelectionTab.coupName;
					}
					if(this.form.giveType=="送门店券"){
						this.form.coupId=this.multipleSelectionTab.storeLibId;
						this.form.coupName=this.multipleSelectionTab.storeLibName;
						this.coupInfo(this.page,this.limit);
					}
					if(this.form.giveType=="送券包"){
						this.form.coupId=this.multipleSelectionTab.coupPackId;
						this.form.coupName=this.multipleSelectionTab.coupPackName;
						this.coupPackageInfo(this.page,this.limit);
					}
				}
				this.handleTabDialogCoup = false;
				this.handlePackageDialog=false;
				this.handleStoreDialogCoup = false;
			},
			//门店券的优惠券列表查询
			coupInfo(start,limit){
				let that = this;
				let params = {
					userId:this.userInfo.userCode,
					page:start,
					limit:limit,
					storeLibId:this.form.coupId
				}
				getCoupInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(JSON.stringify(data));
						if(data.data){
							that.coupDataInfoTab = data.data;
							that.counts = data.count;
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
			//门店券的优惠券列表查询
			coupPackageInfo(start,limit){
				let that = this;
				let params = {
					userId:this.userInfo.userCode,
					page:start,
					limit:limit,
					coupPackId:this.form.coupId
				}
				getCoupPackageInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(JSON.stringify(data));
						if(data.data){
							that.coupDataInfoTab = data.data;
							that.counts = data.count;
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
			//点击选择券模板
			coupLibraryClick(){
				this.showCouponLibrary(this.page,this.limit);
	    		this.handleTabDialogCoup=true;
	    	},
			//点击选择券模板
			coupStoreClick(){
				this.showStoreLibrary(this.page,this.limit);
	    		this.handleStoreDialogCoup=true;
	    	},
	    	//点击选择券包
	    	coupPackageClick(){
				this.showCouponPackage(this.packagePage,this.limit);
				this.handlePackageDialog=true;
	    	},
	    	//弹出表格选择监听
			handleSelectionChangeTab(val){
	            this.multipleSelectionTab = val;
			},
	    	//点击搜索优惠券库
			searchLibrary(){
				this.showCouponLibrary('',this.limit);
			},
	    	//点击搜索优惠券包
			searchPackage(){
				this.showCouponPackage('',this.limit);
			},
	    	//点击搜索门店券库
			searchStoreLibrary(){
				this.showStoreLibrary('',this.limit);
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
				this.tableSelectLoading=true;
	//			console.log(params)
				// 使表格加载
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data)+"优惠券");
						that.tableSelectLoading=false;
						if(data.data){
							let array = [];
							that.coupDataTab = data.data;
							that.countCoup = data.count;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
//						 console.log(err);
					});
			},
			//查询门店券包
			showCouponPackage(start,limit){
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"coupPackInfo": this.coupPackInfo
				}
				// 使表格加载
//				console.log(params)
				this.tableSelectLoading=true;
				// 查询接口
				selectCouponPackageJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data)+"券包");
						that.tableSelectLoading=false;
						if(data.data){
							let array = [];
							that.coupPackDataTab = data.data;
							that.packageCount = data.count;
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
				this.tableSelectLoading=true;
				// 查询接口
				selectStoreVoucherLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data)+"门店券");
						that.tableSelectLoading=false;
						if(data.data){
							let array = [];
							that.coupDataTab = data.data;
							that.counts = data.count;
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
			loadingLevel(){
				var param={
					userId:this.userInfo.userCode
				}
				selectLevalInfo(param)
	                .then((res) => {
	                    let data = JSON.parse(Base64.decode(res.data));
//	                          console.log(JSON.stringify(data)+"返回值");
	                    if(data.data) {
	                    	data.data.forEach((val,index)=>{
	                    		this.storeTypeData.push({
	                    			value:val.key,
	                    			label:val.key
	                    		})
	                    	})
	                    }
	                })
	                .catch((err) => {
	                    // console.log(err);
	                });
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
				let setTableData = this.templateItems[this.count];
				this.count++;
				if(this.count > 5) {
					this.$message.warning('最多可添加5张');
					return false;
				}
				let length = this.templateItems.length;
				this.templateItems.push({
					'id': length++,
					'isLevel':this.isLevel,
					'component': 'award',
					'data': this.activeTempDtl[length]
				});
			},
			//监听单选
			radioHandle(str) {
				this.timeRangeArr=[];
				this.coupDataInfoTab=[];
				if(str == "送门店券") {
					this.form={
						"giveType": '送门店券',
						"coupId": "", //优惠券Id
						"coupName": "", //优惠券名称
						"grantObj":"",
						"coupDays": "", //券有效期
						"coupDate": "",
						"coupDesc": "" //券说明
					};
				}
				if(str == "送券包") {
					this.form={
						"giveType": '送券包',
						"coupId": "", //优惠券Id
						"coupName": "", //优惠券名称
						"grantObj":"",
						"coupDays": "", //券有效期
						"coupDate": "",
						"coupDesc": "" //券说明
					};
				}
				if(str == "送优惠券") {
					this.form={
						"giveType": '送优惠券',
						"coupId": "", //优惠券Id
						"coupName": "", //优惠券名称
						"grantObj":"",
						"coupDays": "", //券有效期
						"coupDate": "",
						"coupDesc": "" //券说明
					};
				}
			},
			// 奖品设置 -  券有效期 -单选
			radioTimeHandle(str) {
				this.coupDays = str;
				this.timeRangeArr='';
				if(this.coupDays == '时间段') {
					this.datePickerDisabled = false;
					this.dateInputDisabled = true;
					this.form.coupDays ='';
				} else if(this.coupDays == '长期') {
					this.form.coupDays ='';
					this.datePickerDisabled = true;
					this.dateInputDisabled = false;
				}
			},
			//选择时间监听
			selectDate(val) {
				var params = {
					begin: val[0],
					end: val[1]
				}
				this.form.coupDays = JSON.stringify(params);
			},
		},
		created() {
			this.loadingLevel();
		 	this.pickerOptions0={
                disabledDate: (time) => {
                    return time.getTime() <= new Date().getTime();
                }
		 	}
			// 钩子函数 -- 初始化
			if(this.getPageType) {
				if(this.getPageType == "修改") {
//					console.log(JSON.stringify(this.data));
					if(this.data!=""){
						this.form=this.data;
						if(this.form.coupDays.begin){
							this.timeRangeArr=[];
							this.timeRangeArr.push(this.form.coupDays.begin);
							this.timeRangeArr.push(this.form.coupDays.end);
							this.form.coupDays=JSON.stringify(this.form.coupDays);
							this.datePickerDisabled = false;
							this.dateInputDisabled = true;
							this.coupDays="时间段";
						}else{
							this.coupDays="长期";
							this.datePickerDisabled = true;
							this.dateInputDisabled = false;
						}
						this.grantObj = this.form.grantObj.split(",");
						if(this.data.giveType=="送券包"){
							this.coupPackageInfo(this.page,this.limit);
						}
						if(this.data.giveType=="送门店券"){
							this.coupInfo(this.page,this.limit);
						}
					}
				} else if(this.getPageType == "查看"){
					this.disabled=true;
					this.datePickerDisabled=true;
					this.dateInputDisabled=true;
					this.form=this.data;
					if(this.form.coupDays.begin){
						this.timeRangeArr=[];
						this.timeRangeArr.push(this.form.coupDays.begin);
						this.timeRangeArr.push(this.form.coupDays.end);
						this.form.coupDays=JSON.stringify(this.form.coupDays);
						this.coupDays="时间段";
					}else{
						this.coupDays="长期";
					}
					this.grantObj = this.form.grantObj;
					if(this.data.giveType=="送券包"){
						this.coupPackageInfo(this.page,this.limit);
					}
					if(this.data.giveType=="送门店券"){
						this.coupInfo(this.page,this.limit);
					}
				}else{
					// console.log(1)
					this.iconAddTr();
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
	
	.el-form {
		width: 100%;
		display: inline-block;
		padding: 0 rem(20px);
	}
	
	.el-tabs {
		margin-bottom: 10px;
	}
	
	.minH {
		min-height: 285px;
	}
	
	.activityContainer {
		width: 100%;
		overflow: hidden;
	}
	
	.leftBox {
		width: 34%;
		float: left;
	}
	
	.rightBox {
		width: 66%;
		float: left;
	}
	
	.rightBoxBorder {
		border-left: 1px solid #C8C8C8;
	}
	
	.leftBoxBorder {
		border: none
	}
	
	.title {
		width: 100%;
		height: 40px;
		line-height: 40px;
		padding-left: 15px;
		background: #F2F2F2;
		color: #000000;
	}
	
	.activityInput {
		width: 52%;
		margin: 5px 10px;
		float: left;
	}
	
	.activityInputRea {
		position: relative;
	}
	
	.activityInputRea span {
		position: absolute;
		right: -20px;
	}
	
	.activitySpan {
		color: #AEAEAE;
		margin-left: 20px;
	}
	
	.activityInputOther {
		width: 360px;
	}
	
	.activityInfo {
		padding-top: 10px;
		padding-left: 15px;
		padding-right: 15px;
		margin-bottom: 10px;
	}
	
	.activityLink {
		width: 40%;
		float: left;
		padding-left: 15px;
		padding-top: 15px;
	}
	
	.activityContainerM {
		margin-top: 20px;
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
	
	.search #search {
		position: absolute;
		/*right: 130px;*/
	}
	
	/*上传图片*/
	
	.avatar-uploader {
		height: 133px;
	}
	
	.avatar-uploader .el-upload {
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		border: 1px dashed #d9d9d9;
		width: 134px;
		height: 133px;
		line-height: 133px;
		text-align: center;
	}
	
	.avatar {
		width: 120px;
		height: 120px;
		float: left;
		margin-bottom: 15px;
	}
	/*// 行内文本*/
	
	.formText {
		float: left;
		margin-top: 10px;
	}
	/*// 行内form*/
	
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
	
	.block {
		float: left;
		margin-right: 10px;
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
	.width260{
		width: 260px;
	}
	.width460{
		width: 460px;
	}
	.width70{
		width: 70%;
	}
</style>