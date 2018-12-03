<!--店组管理-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? noRules : rules" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-form-item label="店组编码" prop="storeGroupId">
								<el-input v-model="form.storeGroupId" :disabled="disabledSet" placeholder="请输入店组编码"></el-input>
							</el-form-item>
							<el-form-item label="店组名称" prop="storeGroupName">
								<el-input v-model="form.storeGroupName" :disabled="disabled" placeholder="请输入店组名称"></el-input>
							</el-form-item>
							<el-form-item label="店组描述" prop="storeGroupDesc">
								<el-input type="textarea" :rows="2" :disabled="disabled" placeholder="请输入店组描述" resize="none" v-model="form.storeGroupDesc">
								</el-input>
							</el-form-item>
							<el-form-item label="选择省" prop="provinceName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="" :value="form.provinceName"></el-input>
								<el-select v-model="form.provinceName" clearable v-else filterable placeholder="请选择" @change="provinceChange">
									<el-option v-for="item in optionsPro" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择市" prop="cityName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="" :value="form.cityName"></el-input>
								<el-select v-model="form.cityName" clearable filterable v-else placeholder="请选择" @change="cityChange">
									<el-option v-for="item in optionsCity" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择区" prop="areaName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="" :value="form.areaName"></el-input>
								<el-select v-model="form.areaName" clearable filterable v-else placeholder="请选择" @change="areaChange">
									<el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="店组" v-if="this.getPageType=='查看'">
								<el-table ref="tableData" :data="tableData" border >
									<el-table-column type="index" width="50" label="序号"></el-table-column>
									<el-table-column prop="storeName" label="门店名称"></el-table-column>
								</el-table>
								<!-- 分页 --> 
								<el-footer v-if="count != 0">
									<el-pagination background class="pagination"layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
									</el-pagination>
								</el-footer>
							</el-form-item>
							<el-form-item label="选择门店" class="formItem" v-if="this.getPageType!='查看'" placeholder="请选择门店" prop="storesIdList">
								<el-input v-model="storeArr" :readonly="true" placeholder="请选择门店" class="dsh-input"></el-input>
								<el-button type="primary" id="search" @click="searchStorePop" class="dsh-input-button">选择</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10" v-if="this.getPageType!='查看'">
						<el-col :span="24">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitForm('form')">确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>

			<el-dialog title="选择门店" :visible.sync="handleStoreDialog" class="transfer">
				<div class="search">
					<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
					</el-cascader>
					<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
					<el-button type="primary" id="search" @click="searchStore">搜索</el-button>
				</div>
				<el-transfer :filterable="false" :titles="titleData" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
				</el-transfer>
				<div slot="footer" class="dialog-footer">
					<el-button @click="handleStoreDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { selectProCityArea, selectStoreData, selectGroupInfo } from '@/api/public'
	import { addStoreGroupManagementInfo, setStoreGroupManagementInfo } from '@/api/base/storeGroupManagement'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				add: '',
				titleData: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				disabled: false, //查看只读
				disabledSet: false, //添加，修改的只读
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityArea: [], //主页面省市区数据
				optionsProCityAreaPop: [], //级联选择器省市区数据
				handleStoreDialog: false, //弹窗
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				optionsPro:[],
				optionsCity:[],
				optionsArea:[],
				province:'',
				city:'',
				area:'',
				searchContent: '', //门店名称或编码
				storeArr: '',
				// form表单数据
				form: {
					storeGroupId: '', // 店组名称
					storeGroupName: '', // 店组名称
					storeGroupDesc: '', // 店组描述
					provinceId: '', //省代码
					provinceName: '', //省名称
					cityId: '', //市代码
					cityName: '', //市名称
					areaId: '', //区代码
					areaName: '', //区名称
					storesIdList: '' //选择门店数组
				},
				parentData:'',
				tableLoading: false,
				// 表格数据
				tableData: [],
				noRules: {}, //查看的时候去掉form表单验证
				rules: { //新增修改form表单验证
					storeGroupId: [{
							required: true,
							message: '请输入店组编码',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeGroupName: [{
							required: true,
							message: '请输入店组名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storesIdList: [{
							required: true,
							message: '请选择门店',
							trigger: 'change'
						}
					]
				},
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {

			// 分页
			handleCurrentChange(val) {
				//	            console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form.storeGroupId);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.storeGroupId);
			},
			showTable(page, limit, storeGroupId) {
				let that = this;
				//查询所属门店
				var params = {
					userId: this.userInfo.userCode,
					page: page,
					limit: limit,
					storeGroupId: storeGroupId
				}
//				console.log(params)
				selectGroupInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
//						console.log('err');
					})
			},
			// 方法
			submitForm(formName) {
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '店组管理'
					});
					return false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						if(this.getPageType == '添加') {
							var params = {
								userId: this.userInfo.userCode,
								baseStoreGroupVO: this.form,
								storesIdList: this.form.storesIdList
							}
							if(params.baseStoreGroupVO.province){
								delete params.baseStoreGroupVO.province;
							}
//							console.log(JSON.stringify(params))
							addStoreGroupManagementInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//				                    console.log(JSON.stringify(data)+"添加返回值");
									this.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										this.$router.push({
											name: '店组管理'
										});
										this.$message.success(data.messageContent);
									} else {
										this.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									this.tableLoading = false;
//									console.log(err);
								});
						} else if(this.getPageType == '修改') {
							var params = {
								userId: this.userInfo.userCode,
								baseStoreGroupVO: this.form,
								storesIdList: this.form.storesIdList
							}
							if(params.baseStoreGroupVO.province){
								delete params.baseStoreGroupVO.province;
							}
//							console.log(JSON.stringify(params))
//							console.log(JSON.stringify(params))
							setStoreGroupManagementInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//	                    console.log(JSON.stringify(data)+"添加返回值");
									this.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										this.$router.push({
											name: '店组管理'
										});
										this.$message.success(data.messageContent);
									} else {
										this.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									this.tableLoading = false;
//									console.log(err);
								});
						}

					} else {
//						console.log('error submit!!');
						return false;
					}
				});
			},
			//点击弹窗
			searchStorePop() {
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.optionsProCityAreaPop=[];
						data.forEach((val, index) => {
							if(val.label == "未知") {
								this.optionsProCityAreaPop.push({
									...val
								});
							} else {
								this.optionsProCityAreaPop.push({
									children: [],
									...val
								});
							}
						})
					})
					.catch((err) => {
//						console.log('err');
					})
//				this.searchStore();
				this.handleStoreDialog = true;
			},
			//弹窗确认
			enterStore(val) {
				this.handleStoreDialog = false;
			},
			//监听穿梭框事件
			storeArray(data) {
				var that = this;
				var idArray = '';
				var nameArray = '';
				that.data2.forEach((val, index) => {
					data.forEach((value, ind) => {
						if(val.storeId==value){
							idArray += val.id + ",";
							nameArray += val.storeName + ",";
						}
					})
				})
				idArray=idArray.substr(0,idArray.length-1);
				nameArray=nameArray.substr(0,nameArray.length-1);
				this.storeArr = nameArray;
				this.form.storesIdList = idArray;
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
			//省
			provinceChange(val){
				var data = this.optionsPro[val-1];
				if(data.label!=this.form.provinceName){
					this.form.cityName="";
					this.form.cityId="";
					this.form.areaName="";
					this.form.areaId="";
				}
				this.form.provinceName=data.label;
				this.form.provinceId=data.key;
				this.focusSelect(data.key,'city');
			},
			//市
			cityChange(val){
				var data = this.optionsCity[val-1];
				if(data.label!=this.form.cityName){
					this.form.areaName="";
					this.form.areaId="";
				}
				this.form.cityName=data.label;
				this.form.cityId=data.key;
				this.focusSelect(data.key,'area');
			},
			//区
			areaChange(val){
				var data = this.optionsArea[val-1];
				this.form.areaName=data.label;
				this.form.areaId=data.key;
			},
			focusSelect(parentId,type) {
				//请求省市区下拉框
				var params = {
					parentId: parentId
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
		        		if(type=="pro"){
		        			this.optionsPro=[];
		        			data.forEach((val, index) => {
		        				if(val.label!="未知"){
			        				this.optionsPro.push({
			        					...val
			        				});
		        				}
		        			})
		        		}
		        		if(type=="city"){
		        			this.optionsCity=[];
		        			data.forEach((val, index) => {
		        				if(val.label!="未知"){
			        				this.optionsCity.push({
			        					...val
			        				});
		        				}
		        			})
		        		}
		        		if(type=="area"){
		        			this.optionsArea=[];
		        			if(data.length>1){
		        				data.forEach((val, index) => {
		        					if(val.label!="未知"){
		        						this.optionsArea.push({
		        							...val
		        						});
		        					}
		        				})
		        			}else{
        						this.optionsArea=[{"value":1,"key":"","label":"未知"}]
		        			}
		        		}
					})
					.catch((err) => {
//						console.log('err');
					})
			},
			//门店搜索
			searchStore() {
				var params = {
					"userId": this.userInfo.userCode,
					"searchContent": this.searchContent,
					"provinceId": this.provinceId,
					"cityId": this.cityId,
					"areaId": this.areaId
				}
				//				console.log(params)
				selectStoreData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//		        		console.log(JSON.stringify(data))
						this.data2 = [];
						if(data != "" && data.data) {
							data.data.forEach((val, index) => {
								this.data2.push({
									...val
								});
							})
//							console.log(JSON.stringify(this.data2))
						}
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
//						console.log(err)
					})
				$("#transfer").show();
			},
			handleBack() {
				if(this.getPageTypeOther){
					if(this.getPageTypeOther=="导入详情"){
						this.$router.push({
							name: '数据导入店组信息查询',
							params: {
								pageType: '查看',
								formData:this.parentData
							}
						});
					}
				}else{
					this.$router.push({
						name: '店组管理'
					});
				}
			}
		},
		created() {
			this.parentData=this.getMainData;
			this.focusSelect('1','pro');
			// 钩子函数 -- 初始化
			let that = this;
			//请求省市区下拉框
			var params = {
				parentId: '1'
			}
			selectProCityArea(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					//	        		console.log(JSON.stringify(data));
					data.forEach((val, index) => {
						if(val.label != "未知") {
							this.optionsProCityArea.push({
								children: [],
								...val
							});
						}
					})
				})
				.catch((err) => {
//					console.log('err');
				})
			// console.log(this.getPageType);
			//			console.log(this.getFormData);
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				this.add = res.provinceName + res.cityName + res.areaName;
				//				console.log(JSON.stringify(this.form)+"查看详情")
				//查询所属门店
				var params = {
					userId: this.userInfo.userCode,
					page: 0,
					limit: 5,
					storeGroupId: res.storeGroupId
				}
//								console.log(params)
				that.tableLoading = true;
				selectGroupInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(data)
						that.tableLoading = false;
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
//						console.log(err);
						that.tableLoading = false;
					})
			} else if(this.getPageType == '修改') {
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
//				console.log(this.getFormData)
				this.form = {
					storeGroupId: res.storeGroupId, // 店组名称
					storeGroupName: res.storeGroupName, // 店组名称
					storeGroupDesc: res.storeGroupDesc, // 店组描述
					provinceId: res.provinceId, //省代码
					provinceName: res.provinceName, //省名称
					cityId: res.cityId, //市代码
					cityName: res.cityName, //市名称
					areaId: res.areaId, //区代码
					areaName: res.areaName, //区名称
					storesIdList: res.storesIdList, //选择门店数组
					id: res.id,
					version: res.version
				};
				//查询所属门店
				var params = {
					userId: this.userInfo.userCode,
					page: 0,
					limit: 1000,
					storeGroupId: res.storeGroupId
				}
				//				console.log(params)
				that.tableLoading = true;
				selectGroupInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let nameArray = '';
						let codeArray='';
						that.tableLoading = false;
						if(data.data) {
//							console.log(JSON.stringify(data.data)+"返回值")
							this.data2=[];
							this.value2=[];
							data.data.forEach((val, index) => {
								nameArray += val.storeName + ",";
								codeArray += val.storeId + ",";
								this.data2.push({
									storeName:val.storeName,
									storeId:val.storeId
								})
							})
							nameArray = nameArray.substr(0, nameArray.length - 1);
							codeArray = codeArray.substr(0, codeArray.length - 1);
							this.form.storesIdList=codeArray;
							this.storeArr = nameArray;
							this.value2=codeArray.split(",");
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
//						console.log(err);
						that.tableLoading = false;
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
			},
			getPageTypeOther() {
				return this.$route.params.pageTypeOther;
			},
			getMainData() {
				return this.$route.params.mainData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-button {
		margin-bottom: 5px;
	}
	
	.el-select {
		width: 100%;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.el-form-item{
		width:400px
	}
	#transfer {
		display: none;
	}
</style> 