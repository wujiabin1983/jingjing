<!--门店券库- 添加-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handClick" v-if="this.getPageType=='查看'" class="mrgBottom10">返  回</el-button>
			<el-card class="centerInfo">
				<el-form :inline="true" v-loading="enterLoading" :rules="this.getPageType=='查看'?noRules:rules" label-width="80px" :model="form" ref="form" class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-form-item label="券名称"  prop="storeLibName">
								<el-input v-model="form.storeLibName" :disabled="disabled" placeholder="请输入券名称"></el-input>
							</el-form-item>
							<el-form-item label="关联门店" prop="relationSotre" v-if="this.getPageType!='查看'">
								<el-input v-model="relationSotre"  class="selectInfo" :readonly="true" placeholder="请选择"></el-input><el-button type="primary" @click="storeInput()">选择</el-button>
							</el-form-item>
							<el-form-item label="关联门店" prop="relationSotre" v-else>
								<el-input v-model="relationSotre" :readonly="true" placeholder="请选择"></el-input>
							</el-form-item>
							<el-form-item label="优惠券" prop="relationCoup" v-if="this.getPageType!='查看'" >
								<el-input v-model="relationCoupName"  class="selectInfo" :readonly="true" placeholder="请选择"></el-input></el-input><el-button type="primary"  @click="coupInput()">选择</el-button>
							</el-form-item>
							<el-form-item label="优惠券" prop="relationCoup" v-else>
								<el-input v-model="relationCoupName" :readonly="true" placeholder="请选择"></el-input></el-input>
							</el-form-item>
						</el-col>
					</el-row>
	                <div v-if="this.getPageType != '查看'">
						<div class="el-footer-btn-con">
							<el-button @click="handClick">返  回</el-button>
							<el-button type="primary" @click="enterData" >确 定</el-button>
						</div>
					</div>
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
			
			<el-dialog title="" :visible.sync="handleTabDialogCoup" class="dialogOne">
				<template>
					<div class="search">
						<el-select v-model="formDialog.couponType" class="searchContent" clearable placeholder="请选择券类型">
							<el-option label="礼品券" value="礼品券"></el-option>
							<el-option label="折扣券" value="折扣券"></el-option>
							<el-option label="代金券" value="代金券"></el-option>
						</el-select>
						<el-input v-model="formDialog.coupLibraryKey" class="searchContent" placeholder="请输入券ID或券名称"></el-input>
						<el-button type="primary" id="search" @click="searchLibrary">搜索</el-button>
					</div>
					<el-table ref="tableDataTab" v-loading="tableSelectLoading" :data="coupDataTab" class="el-tableRadio" highlight-current-row  border @current-change="handleSelectionChangeTab">
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
	                        layout="prev, pager, next, jumper" 
	                        :page-size="limit"
	                        :total="count" 
	                        @current-change="handleCoupChange">
	                    </el-pagination>
	                </el-footer>
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
	import { addStoreVoucherLibrary ,storeVoucherLibraryInfo} from '@/api/member/storeVoucherLibrary'
	import { mapGetters } from 'vuex'
	import { selectProCityArea ,selectStoreData,selectTabData} from '@/api/public'
	import { selectCouponLibraryJurisdiction} from '@/api/member/couponLibrary'
	export default {
		data() {
			return {
				relationSotre:'',
				relationCoupName:'',
				disabled:false,
				// 数据
				tableSelectLoading:false,
				enterLoading:false,
				form:{
					"storeLibName":"",//门店券名称
					"relationSotre":"",//关联门店(json格式字符串)
					"relationCoup":""//关联优惠券(json格式字符串)
				},
	            limit: this.GLOBAL.limitDialog, // 条/页
				noRules:{},
				rules: {//新增修改form表单验证
					storeLibName: [{
							required: true,
							message: '请输入券名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					relationSotre: [{
							required: true,
							message: '请选择门店',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					relationCoup: [{
							required: true,
							message: '请选择优惠券',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
				},
				count:0,
				tableData:[],
				coupPackDataTab:[],//弹窗券包
				//弹窗
				handleTabDialogCoup:false,
				handleTabDialog:false,
				activeName:'first',
				activeName1:'first',
				tabType:'门店',
				titleData:['未选择优惠券','已选择优惠券'],//穿梭框的左右两侧的标题
				titleDataStore:['未选择门店','已选择门店'],//穿梭框的左右两侧的标题
				titleDataGroup:['未选择店组','已选择店组'],//穿梭框的左右两侧的标题
				titleDataArea:['未选择区域','已选择区域'],//穿梭框的左右两侧的标题
				coupDataTab:[],
				formDialog:{//弹窗内的搜索条件
					couponType:'',
					coupLibraryKey:''
				},
				selectInfo:{},
				coupPackInfo:'',//券包
				couponTypeData: [{
					index: '0',
					value: '代金券',
					key: '代金券'
				}, {
					index: '1',
					value: '折扣券',
					key: '折扣券'
				}, {
					index: '2',
					value: '礼品券',
					key: '礼品券'
				}],
				dataIndex2:[],//穿梭框右侧的值
				data2:[],//搜索门店的值
				value2: [],//选择的值
				
				dataIndex:[],//穿梭框右侧的值
				data:[],//搜索优惠券的值
				value: [],//选择的值
				optionsProCityAreaPop: [],//级联选择器省市区数据
				provinceId:'',//弹窗搜索省代码
				cityId:'',//弹窗搜索市代码
				areaId:'',//弹窗搜索区代码
				storeArr:'',
				coupArr:'',
				flag:false,
				searchContent:''
			}
		},
		methods: {
			// 分页
			handleCoupChange(val) {
				this.page = val;
				this.showCouponLibrary(val,this.limit);
			},
			//监听tab页
			handleClick(tab ,event){
//				console.log(tab.label)
				this.tabType=tab.label;
				this.data2=[];
				this.value2=[];
				this.dataIndex2=[];
				this.searchStoreTab();
			},
			//选择表格数据优惠券
			handleSelectionChangeTab(val){
//	        	console.log(JSON.stringify(val))
	        	this.selectInfo=val;
	        },
			//点击左侧input框
			storeInput(index){
				//请求省市区下拉框
				let params = {
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
				this.handleTabDialog = true;
				this.searchStoreTab();
			},
			//点击优惠券选择按钮
			coupInput(index){
				this.handleTabDialogCoup = true;
				this.showCouponLibrary(this.page,this.limit);
			},
			//点击搜索优惠券库
			searchLibrary(){
				this.showCouponLibrary('',this.limit);
			},
			//查询优惠券库
			showCouponLibrary(start,limit){
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"coupLibraryKey": this.formDialog.coupLibraryKey,
					"couponType": this.formDialog.couponType
				}
	//			console.log(params)
				// 使表格加载
				that.tableSelectLoading=true;
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
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
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
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
				this.handleTabDialog = false;
			},
			//监听穿梭框事件
			storeArray(data){
				let idArray='';
				let nameArray='';
				let that = this;
				that.data2.forEach((value, index) => {
					data.forEach((val, ind) => {
						if(that.data2[index].storeId==val){
							idArray+=that.data2[index].storeId+",";
							nameArray+=that.data2[index].storeName+",";
						}
					})
				})
				idArray=idArray.substr(0,idArray.length-1);
				nameArray=nameArray.substr(0,nameArray.length-1);
				this.relationSotre=nameArray;
				let params={
					storeId:idArray,
					storeName:nameArray
				}
				this.form.relationSotre=JSON.stringify(params);
			},
			//门店搜索（tab）
			searchStoreTab() {
				let params = {
					"userId": this.userInfo.userCode,
					"searchContent":this.searchContent,
					"provinceId":this.provinceId,
					"cityId":this.cityId,
					"areaId":this.areaId
				}
//				console.log(this.tabType);
				if(this.tabType=="门店"){
					params.flag="1";
				}
				if(this.tabType=="店组"){
					params.flag="2";
				}
				if(this.tabType=="区域"){
					params.flag="3";
				}
//				console.log(params)
				selectTabData(params)
					.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
//		        		console.log(data)
						this.data2=[];
//						this.value2=[];
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
//							console.log(this.data2)
						}
//						console.log(this.value2)
//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
		        	})
		        	.catch((err) => {
						// console.log(err)   		
		        	})
			},
			enterCoup(){
				this.relationCoupName=this.selectInfo.coupName;
				let params={
					coupId:this.selectInfo.coupId,
					coupName:this.selectInfo.coupName
				}
				this.form.relationCoup=JSON.stringify(params);
				this.handleTabDialogCoup = false;
			},
			handClick(){
				this.$router.push({
					name: '门店券库'
				});
			},
			enterData(){
//				 console.log(JSON.stringify(this.form));return false;
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let params = {
							userId:this.userInfo.userCode,
							...this.form
						}
						this.enterLoading=true;
						// console.log(JSON.stringify(params)+"入参")
						addStoreVoucherLibrary(params)
							.then((res) => {
				        		let data = JSON.parse(Base64.decode(res.data));
				        		// console.log(JSON.stringify(data))
								this.enterLoading=false;
				        		if(data.messageType == 'SUCCESS') {
									this.$message.success(data.messageContent);
									this.$router.push({name: '门店券库'});
								} else {
									this.$message.warning(data.messageContent);
								}
				        	})
				        	.catch((err) => {
								this.enterLoading=false;
								// console.log(err)   		
				        	})
						// console.log(JSON.stringify(this.form))
					}
				})
			}
		},
		created() {
			// 钩子函数 -- 初始化
			//console.log(this.getPageType)
			//console.log(this.getFormData)
				if(this.getPageType=="查看"){
					this.disabled=true;
					var params = {
						userId:this.userInfo.userCode,
						id:JSON.parse(this.getFormData).id
					}
					storeVoucherLibraryInfo(params)
						.then((res) => {
			        		let data = JSON.parse(Base64.decode(res.data));
			        		if(data.messageType == 'SUCCESS') {
			        			this.form=data.messageContent;
			        			this.relationCoupName=this.form.relationCoup.coupName;
			        			this.relationSotre=this.form.relationSotre.storeName;
			        		}else{
								this.$message.warning(data.messageContent);
			        		}
						})
			        	.catch((err) => {
							// console.log(err)   		
			        	})
				}
		},
		computed: {
			// 计算属性
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
	.el-form-item {
		width: 100%;
		margin-bottom: 20px;
		display: block;
		.el-input{
			width:230px
		}
		.selectInfo{
			width:69%;
			margin-left: 1%;
		}
		.el-button{
			min-width: 30%;
		}
	}
	.icon {
		font-size: 20px;
		cursor: pointer;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.iconAdd {
		cursor: pointer;
		font-size: 20px;
	}
</style>