<!--基础设置 - 业务规则 - 会员权益 - 等级 - 品牌-->
<template>
    <div class="container">
        <el-card>
        	<el-main>
				<h4>
					默认配置
					<el-button type="primary" class="floatRight" @click="handleBrandAdd">添加</el-button>
				</h4>
				<!-- <el-card> --><!--v-if="tableDataBrand == 0"-->
				<!-- 表格 -->
				<el-table ref="tableDataBrand" :data="tableDataBrand" v-loading="tableBrandLoading">
					<el-table-column prop="levelName" label="等级"></el-table-column>
					<el-table-column prop="discount" label="折扣（%）"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakanBrand(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakanBrand(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugaiBrand(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugaiBrand(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top">
								<!-- 删除 -->
								<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- </el-card> -->
				<h4 class="marginTop10">
					按门店配置
					<el-button type="primary" class="floatRight" @click="handleStoreAdd">添加</el-button>
				</h4>
	
				<el-table ref="tableDataStore" :data="tableDataStore" v-loading="tableStoreLoading">
					<el-table-column prop="storeName" label="门店"></el-table-column>
					<el-table-column prop="levelName" label="等级"></el-table-column>
					<el-table-column prop="discount" label="折扣（%）"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakanStore(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakanStore(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugaiStore(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugaiStore(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top">
								<!-- 删除 -->
								<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog :title="this.pageType" v-loading="addLoading" :visible.sync="dialogVisible" width="35%" >
                    <el-form :model="form" ref="form" :rules="this.pageType!='查看'?rules:noRules" label-width="60px" v-loading="posLoading">
						<el-form-item label="门店" prop="storeName" v-if="clickType!='默认'&&this.pageType!='查看'">
							<el-input v-model="storeArr" class="dsh-input" placeholder="请选择" readonly="readonly"></el-input>
							<el-button @click="storeClick" class="dsh-input-button" type="primary">选择</el-button>
						</el-form-item>
						<el-form-item label="门店" prop="storeName" v-if="clickType!='默认'&&this.pageType=='查看'">
							<el-input v-model="form.storeName" placeholder="请输入" readonly="readonly"></el-input>
						</el-form-item>
                    	<el-form-item label="等级" prop="levelName">
							<el-input v-if="this.pageType=='查看'" :disabled="this.pageType=='查看'" placeholder="请输入等级" :value="form.levelName"></el-input>
							<el-select v-model="form.levelName" v-else filterable placeholder="请选择" @change="levalChange" class="width100">
								<el-option v-for="item in levalOption" :key="item.key" :label="item.key" :value="item.index">
								</el-option>
							</el-select>
						</el-form-item>
                        <el-form-item label="折扣" prop="discount">
                        	<el-input v-model="form.discount" placeholder="请输入折扣" :disabled="this.pageType=='查看'"></el-input>
                        </el-form-item>
                    </el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false" v-if="pageType == '查看'">关 闭</el-button>
						<el-button @click="dialogVisible = false" v-if="pageType == '修改' || pageType == '添加'">取 消</el-button>
						<el-button type="primary" @click="handleSure('form')" v-if="pageType == '修改' || pageType == '添加'">确 定</el-button>
					</span>
				</el-dialog>
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
					<div slot="footer" class="dialog-footer">
						<el-button @click="handleTabDialog = false">取 消</el-button>
						<el-button type="primary" @click="enterStore">确 定</el-button>
					</div>
				</el-dialog>
			</el-main>
        </el-card>
    </div>
</template>
<script>
    /**
     * 查询品牌信息
     * 
     */
	import { validateFloat} from '@/utils/validate';
	import { selectBrandLeval,addBrandLeval,setBrandLeval,deleteBrandLeval } from '@/api/base/merchantManagerUserC'
	import { mapGetters } from 'vuex'
	import { selectProCityArea, selectRoleData, selectTabData,selectLevalInfo } from '@/api/public'
	const isFloat = (rule, value, callback) => {
		if(value != "") {
			if(!validateFloat(value)) {
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
				handleTabDialog: false,
				storeArr: '',
				tabType: '门店',
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				activeName: 'first',
				pageType:"添加",
				clickType:"默认",
				//默认表格
				tableDataBrand:[],
				//门店表格
				tableDataStore:[],
				tableBrandLoading:false,
				tableStoreLoading:false,
				addLoading:false,
				dialogVisible:false,
				posLoading:false,
				form:{
					discount:'',
					levelName:'',
					levelId:'',
					storeName:'',
					storeId:''
				},
				noRules:{},
				rules:{
					storeName: [{
							required: true,
							message: '请选择门店',
							trigger: 'change'
						}
					],
					levelName: [{
							required: true,
							message: '请选择等级',
							trigger: 'change'
						}
					],
					discount: [{
							required: true,
							message: '请输入折扣',
							trigger: 'change'
						},{
						validator: isFloat
					}],
				},
				levalOption:[],
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			//默认添加
			handleBrandAdd(){
				this.form={
					discount:'',
					levelName:'',
					levelId:'',
					storeName:'',
					storeId:''
				};
				this.selectLevalInfo();
				this.clickType='默认';
				this.pageType="添加";
				this.dialogVisible=true;
			},
			//门店添加
			handleStoreAdd(){
				this.form={
					discount:'',
					levelName:'',
					levelId:'',
					storeName:'',
					storeId:''
				};
				this.selectLevalInfo();
				this.clickType='门店';
				this.pageType="添加";
				this.storeArr='';
				this.data2=[];
				this.value2=[];
				this.dialogVisible=true;
			},
			//门店表格
			showTable(start, limit) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit
				}
				// 使表格加载
				this.tableStoreLoading = true;
				this.tableBrandLoading = true;
				// 查询接口
				selectBrandLeval(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						let result1 = [];
//						console.log(JSON.stringify(data))
						if(data.messageType == "SUCCESS") {
							data.messageContent.forEach((val, index) => {
								if(val.storeName!=''){
									result.push({
										...val
									});
								}else{
									result1.push({
										...val
									});
								}
							})
							that.clickType='门店';
							that.tableDataStore = result;
							that.tableDataBrand = result1;
						} else {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableStoreLoading = false;
						that.tableBrandLoading = false;
					})
					.catch(function(err) {
//						console.log(err);
						that.tableStoreLoading = false;
						that.tableBrandLoading = false;
					});
			},
			//弹窗确认
			handleSure(formName){
				let that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addLoading=true;
						if(this.pageType == '添加') {
							var formData = {
								userId: this.userInfo.userCode,
								...this.form
							}
//							console.log(formData);
							addBrandLeval(formData)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.addLoading = false;
										that.dialogVisible=false;
										that.showTable(that.page, that.limit);
										that.$message.success(data.messageContent);
									} else {
										that.addLoading = false;
//										that.showTable(that.page, that.limit);
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
//									console.log(err);
									that.addLoading = false;
									that.dialogVisible=false;
								});
						} else if(this.pageType == '修改') {
							var formData = {
								userId: this.userInfo.userCode,
								...this.form
							}
							setBrandLeval(formData)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									if(data.messageType == 'SUCCESS') {
										that.addLoading = false;
										that.showTable(that.page, that.limit);
										that.$message.success(data.messageContent);
										that.dialogVisible=false;
									} else {
										that.addLoading = false;
//										that.showTable(that.page, that.limit);
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
//									console.log(err);
									that.addLoading = false;
								});
						}
					}
				})
			},
			//删除
			iconShanchu(index,row){
				let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					deleteBrandLeval(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit);
							} else {
								that.$message.error(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit);
							}
						})
						.catch((err) => {
								that.tableLoading = false;
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			//修改默认
			iconXiugaiBrand(index,row){
				this.form=row;
				this.pageType="修改";
				this.clickType='默认';
				this.dialogVisible=true;
			},
			//修改门店
			iconXiugaiStore(index,row){
				this.form=row;
				this.pageType="修改";
				this.clickType='门店';
				this.dialogVisible=true;
				this.storeArr=this.form.storeName;
				let arr = this.form.storeId.split(",");
				let arrName = this.form.storeName.split(",");
				this.value2=arr;
				this.data2=[];
				arr.forEach((val,index)=>{
					this.data2.push({
						storeName: '',
						storeId: val
					});
				})
				arrName.forEach((val,index)=>{
					this.data2[index].storeName=val;
				})
			},
			//查看默认
			iconChakanBrand(index,row){
				this.form=row;
				this.pageType="查看";
				this.clickType='默认';
				this.dialogVisible=true;
			},
			selectLevalInfo(){
				//等级下拉
				var params = {
					userId: this.userInfo.userCode
				}
				//			console.log(params)
				selectLevalInfo(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(data)
						if(data != "") {
							this.levalOption = data.data;
						}
					})
					.catch((err) => {
//						 console.log(err)
					})
			},
			//查看门店
			iconChakanStore(index,row){
				this.form=row;
				this.pageType="查看";
				this.clickType='门店';
				this.dialogVisible=true;
			},
			//监听等级下拉
			levalChange(val){
				var data = this.levalOption[val];
				this.form.levelName=data.key;
				this.form.levelId=data.value;
			},
			//点击查询的 选择组织
			storeClick() {
				this.handleTabDialog = true;
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
						// console.log('err');
					})
//				this.searchStoreTab();
			},
			//监听tab页
			handleClick(tab, event) {
				this.tabType = event.target.firstChild.data;
				this.data2 = [];
				this.value2 = [];
				this.dataIndex = [];
				this.searchStoreTab();
			},
			//监听父级选项动态加载省市区数据(弹窗内)
			cascaderSelect(val) {
				if(val.length == 1) {
					let proIndex = val[0];
					let parentId = this.optionsProCityAreaPop[proIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
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
							//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
						})
						.catch((err) => {
							// console.log('err');
						})
				}
				if(val.length == 2) {
					let proIndex = val[0];
					let cityIndex = val[1];
					let parentId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							let array = [];
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
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
			enterStore(val) {
				this.handleTabDialog = false;
			},
			//监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				this.data2.forEach((value,index)=>{
					val.forEach((val, ind) => {
						if(value.storeId==val){
							idArray += value.storeId + ",";
							nameArray += value.storeName + ",";
						}
					})
				})
				nameArray=nameArray.substr(0,nameArray.length-1);
				idArray=idArray.substr(0,idArray.length-1);
				this.form.storeId = idArray;
				this.storeArr = nameArray;
				this.form.storeName=nameArray;
			},
			//门店搜索（tab）
			searchStoreTab() {
				var params = {
					"userId": this.userInfo.userCode,
					"searchContent": this.searchContent,
					"provinceId": this.provinceId,
					"cityId": this.cityId,
					"areaId": this.areaId
				}
				//				console.log(this.tabType);
				if(this.tabType == "门店") {
					params.flag = "1";
				}
				if(this.tabType == "店组") {
					params.flag = "2";
				}
				if(this.tabType == "区域") {
					params.flag = "3";
				}
				//				console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//		        		console.log(JSON.stringify(data)+"返回值")
						this.data2 = [];
						if(data != "") {
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
									this.data2.push({
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
//							console.log(JSON.stringify(this.data2))
						}
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
						// console.log(err)
					})
				$("#transfer").show();
			},
		},
		created() {
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit);
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
        margin-left: rem(20px);
        width: 90%;
    }
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}	
	.marginTop10{
		margin-top: 10px;
	}
    

    
</style>