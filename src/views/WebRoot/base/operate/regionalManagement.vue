<!--区域管理-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? noRules : rules" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-form-item label="区域编码" prop="storeAreaId">
								<el-input v-model="form.storeAreaId" :disabled="disabledSet" placeholder="请输入区域编码"></el-input>
							</el-form-item>
							<el-form-item label="区域名称" prop="storeAreaName">
								<el-input v-model="form.storeAreaName" :disabled="disabled" placeholder="请输入区域名称"></el-input>
							</el-form-item>
							<el-form-item label="区域描述" prop="areaDesc">
								<el-input type="textarea" :rows="2" :disabled="disabled" placeholder="请输入区域描述" resize="none" v-model="form.areaDesc">
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
								<el-table ref="tableData" :data="tableData" v-loading="tableLoading1" border>
									<el-table-column type="index" width="50" label="序号"></el-table-column>
									<el-table-column prop="storeGroupName" label="店组名称"></el-table-column>
								</el-table>
								<!-- 分页 -->
								<el-footer v-if="count != 0">
									<el-pagination background class="pagination"layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
									</el-pagination>
								</el-footer>
							</el-form-item>

							<el-form-item label="选择店组" class="formItem" v-if="this.getPageType!='查看'" placeholder="选择店组" prop="storesGroups">
								<el-input v-model="storeArr" :readonly="true" placeholder="选择店组" class="dsh-input"></el-input>
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

			<el-dialog title="选择店组" :visible.sync="handleStoreDialog" class="transfer">
				<div class="search">
					<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
					</el-cascader>
					<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
					<el-button type="primary" id="search" @click="searchStore">搜索</el-button>
				</div>
				<el-transfer :filterable="false" :titles="titleData" @change="storeArray" v-model="value2" :props="{key: 'storeGroupId',label: 'storeGroupName'}" :data="data2">
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
	import { selectProCityArea, selectStoreData, selectTabData, selectAreaInfo } from '@/api/public'
	import { addRegionalManagement, setRegionalManagement } from '@/api/base/regionalManagement'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				add: '',
				titleData: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				disabled: false,
				disabledSet: false,
				tableLoading:false,
				tableLoading1:false,
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityArea: [], //主页面省市区数据
				optionsProCityAreaPop: [], //级联选择器省市区数据
				handleStoreDialog: false, //弹窗
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				storeArr: '',
				optionsPro:[],
				optionsCity:[],
				optionsArea:[],
				province:'',
				city:'',
				area:'',
				// form表单数据
				form: {
					storeAreaId: '', // 区域编码
					storeAreaName: '', // 区域名称
					provinceId: '', //省代码
					provinceName: '', //省名称
					cityId: '', //市代码
					cityName: '', //市名称
					areaId: '', //区代码
					areaName: '', //区名称
					areaDesc: '' // 区域描述
				},
				// 表格数据
				tableData: [],
				noRules: {},
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
				rules: {
					storeAreaId: [{
							required: true,
							message: '请输入区域编码',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeAreaName: [{
							required: true,
							message: '请输入区域名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storesGroups: [{
							type: 'array',
							required: true,
							message: '请选择店组',
							trigger: 'change'
						}
					]
				}
			}
		},
		methods: {
			// 分页
			handleCurrentChange(val) {
				//	            console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 方法
			submitForm(formName) {
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '区域管理'
					});
					return false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.tableLoading = true;
						let params = {};
						if(this.getPageType == '添加') {
							params = {
								userId: this.userInfo.userCode,
								...this.form
							}
//							console.log(params)
							addRegionalManagement(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data.data));
									this.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										this.$router.push({
											name: '区域管理'
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
							params = {
								userId: this.userInfo.userCode,
								...this.form
							}
							//							console.log(params)
							setRegionalManagement(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data.data));
									//				                    console.log(data)
									this.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										this.$router.push({
											name: '区域管理'
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
			showTable(page, limit) {
				let that = this;
				var params = {
					userId: this.userInfo.userCode,
					page: page,
					limit: limit,
					storeAreaIdList: this.form.storeAreaId
				}
				//				console.log(JSON.stringify(params)+"入参")
				that.tableLoading1 = true;
				selectAreaInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						//						console.log(JSON.stringify(data)+"出参")
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
						that.tableLoading1 = false;
					})
					.catch((err) => {
//						console.log('err');
						that.tableLoading1 = false;
					})
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
				this.searchStore();
				this.handleStoreDialog = true;
			},
			//弹窗确认
			enterStore(val) {
				this.handleStoreDialog = false;
			},
			//监听穿梭框事件
			storeArray(data) {
				var array = [];
				var that = this;
				var nameArray = '';
				that.data2.forEach((val, index) => {
					data.forEach((value, ind) => {
						if(val.storeGroupId==value){
							array.push({
								storeGroupId: val.storeGroupId,
								version: val.version
							});
							nameArray += val.storeGroupName + ",";
						}
					})
				})
				nameArray = nameArray.substr(0, nameArray.length - 1);
				this.storeArr = nameArray;
				this.form.storesGroups = array;
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
					"areaId": this.areaId,
					"flag": "2"
				}
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//									        		console.log(JSON.stringify(data));
						this.data2 = [];
						data.data.forEach((val, index) => {
							//								console.log(val)
							this.data2.push({
								index: index,
								id: val.id,
								version: val.version,
								storeGroupName: val.storeGroupName,
								storeGroupId: val.storeGroupId
							});
						})
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
//						console.log('err');
					})
				$("#transfer").show();
			},
			handleBack() {
				this.$router.push({
					name: '区域管理'
				});
			}
		},
		created() {
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
			// 			console.log(this.getPageType);
			//			console.log(this.getPageType);
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				//				console.log(JSON.stringify(this.form));
				this.showTable(this.page, this.limit);
				//查询所属门店

				// this.form.status
			} else if(this.getPageType == '修改') {
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				var params = {
					userId: this.userInfo.userCode,
					page: 0,
					limit: 1000,
					storeAreaIdList: this.form.storeAreaId
				}
				//				console.log(JSON.stringify(params)+"入参")
				selectAreaInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.data) {
//							console.log(JSON.stringify(data.data))
							let idArray='';
							let nameArray='';
							this.data2=[];
							this.value2=[];
							data.data.forEach((val, index) => {
								result.push({
									storeGroupId: val.storeGroupId,
									version: val.version
								})
								this.data2.push({
									index: index,
									id: val.id,
									version: val.version,
									storeGroupName: val.storeGroupName,
									storeGroupId: val.storeGroupId
								});
								idArray+=val.storeGroupId+',';
								nameArray+=val.storeGroupName+',';
							})
							idArray = idArray.substr(0, idArray.length - 1);
							nameArray = nameArray.substr(0, nameArray.length - 1);
							this.storeArr=nameArray;
							this.value2=idArray.split(",");
							this.form.storesGroups = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableLoading = false;
					})
					.catch((err) => {
//						console.log(err);
						that.tableLoading = false;
					})
				// this.form.status
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