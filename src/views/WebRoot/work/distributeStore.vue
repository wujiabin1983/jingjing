<!--分配服务门店-->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <div class="floatRight">
                    	<el-form-item label="专属导购:">
							<el-radio v-model="form.radio" @change="radioNoStore" label="无服务门店">无服务门店</el-radio>
							<el-radio v-model="form.radio" @change="radioStore" label="组织">组织
								<el-input v-model="storeArr" class="width200" placeholder="请选择" readonly="readonly"></el-input>
								<el-button @click="selectOrganization" type="primary" :disabled="disabled">选择</el-button>
							</el-radio>
	                    </el-form-item>
	                    <el-form-item label="消费者:">
							<el-radio v-model="form.radio1" @change="allUser" label="全部消费者">全部消费者</el-radio>
							<el-radio v-model="form.radio1" @change="fence" label="粉丝">粉丝</el-radio>
							<el-radio v-model="form.radio1" @change="user" label="会员">会员<el-input placeholder="请输入姓名、手机号" class="nameOrPhone" :disabled="userInfoDisabled" v-model="form.nameOrPhone"></el-input></el-radio>
	                    </el-form-item>
                    </div>
                    <el-form-item class="select-btn-style">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card>
                <el-button type="primary" @click="allocation" v-if="roleBtn.addServiceStoreInfo">分配门店</el-button>
            </el-card>
        </el-header>
            <el-main>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column type="selection" width="50" label="选择"></el-table-column>
                    <el-table-column prop="onlineCardNum" label="会员卡号"></el-table-column>
                    <el-table-column prop="userName" label="会员姓名"></el-table-column>
                    <el-table-column prop="sex" label="性别"></el-table-column>
                    <el-table-column prop="memberLevel" label="等级"></el-table-column>
                    <el-table-column prop="memberLevel" label="手机号"></el-table-column>
                    <el-table-column prop="serviceStoreName" label="服务门店"></el-table-column>
                    <el-table-column prop="registeDate" label="入会时间"></el-table-column>
                </el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" @size-change="handleSizeChange"  :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
            </el-card>
        </el-main>
        <el-dialog title="分配门店" :visible.sync="setDistributeStore" v-loading="setDistributeStoreloading" class="box50 dialogOne">
		    <el-form :inline="true" :model="formStore" class="demo-form-inline marginTop10">
	            <el-form-item class="floatRight">
	                <el-button type="primary" @click="onSubmitStore">查询</el-button>
	            </el-form-item>
			    <el-form-item label="" class="floatRight marginRight10">
					<el-input placeholder="请输入门店名称或门店编码" class="width200" v-model="formStore.searchContent"></el-input>
	            </el-form-item>
            </el-form>
			<el-table ref="tableDataStore" :data="tableDataStore" v-loading="storeLoading" class="el-tableRadio" highlight-current-row border @current-change="handleSelectionStoreChange">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="storeId" label="门店编码"></el-table-column>
                <el-table-column prop="storeName" label="门店名称"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>
			<!-- 分页 -->
			<el-footer v-if="count != 0">
				<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit1" :total="countStore" @current-change="handleGroupChange">
				</el-pagination>
			</el-footer>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="setDistributeStore = false,formStore.searchContent=''">取 消</el-button>
				<el-button type="primary" @click="setDistributeEnter">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="" :visible.sync="handleTabDialog" class="transfer">
			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="门店" name="first">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" :clearable=true change-on-select @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="店组" name="second">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" :clearable=true change-on-select @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="区域" name="third">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" :clearable=true change-on-select @change="selectChange">
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
  </el-container>
</template>
<script>
import { selectDistributeStore ,distributeStore} from '@/api/work/distributeStore'
import { permission } from '@/utils'
import { mapGetters } from 'vuex'
import { selectProCityArea, selectRoleData, selectTabData,selectStoreData } from '@/api/public'
	
export default {
    data() {
        return {
        	disabled:true,
        	// 权限
			roleBtn: {
				addServiceStoreInfo:false
			},
			storeLoading:false,
			userInfoDisabled:true,
			storeArr:'',
			handleTabDialog: false,
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
            // 数据
            form:{
            	radio:'',
            	radio1:'全部消费者',
            	nameOrPhone:''
            },
            formStore:{
            	searchContent:'',
            },
            setDistributeStoreloading:false,
            setDistributeStore:false,
            tableLoading:false,
            tableData:[],
            tableDataStore:[],
            multipleSelection:[],
            multipleSelectionStore:{},
			// 活动分页
			page: 0, // 
			pageStore: 0, // 当前页
			count: 0, // 总条数
			countStore: 0, // 当前页
			limit: this.GLOBAL.limit, // 条/页
			limit1: this.GLOBAL.limitDialog, // 条/页
        }
    },
    methods: {
    	radioStore(val){
    		if(val=="组织"){
    			this.disabled=false;
    		}
    	},
    	radioNoStore(val){
    		if(val=="无服务门店"){
    			this.disabled=true;
    		}
    	},
		handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit, this.formInline.searchInfo);
		},
    	//粉丝
    	fence(val){
    		if(val=="粉丝"){
//  		console.log(val)
    			this.userInfoDisabled=true;
    		}
    	},
    	//会员
    	user(val){
    		if(val=="会员"){
    			this.userInfoDisabled=false;
    		}
    	},
    	//全部消费者
    	allUser(val){
    		if(val=="全部消费者"){
    			this.userInfoDisabled=true;
    		}
    	},
    	onReset(){
    		this.form={
            	radio:'',
            	radio1:'全部消费者',
            };
            this.storeArr='';
            this.form.nameOrPhone='';
			this.userInfoDisabled=true;
    	},
    	// 表格选择数据会员
        handleSelectionChange(val) {
        	if(val){
          	  this.multipleSelection = val;
        	}
        },
    	// 表格选择数据门店
        handleSelectionStoreChange(val) {
        	if(val){
	            this.multipleSelectionStore = val;
        	}
        },
		// 会员列表分页
		handleCurrentChange(val) {
			this.page = val;
			this.showTable(val, this.limit);
		},
		// 门店列表分页
		handleGroupChange(val) {
			this.pageStore = val;
			this.showTableStore(val, this.limit1);
		},
		showTable(start,limit){
    		let that = this;
        	let params={
        		userId:this.userInfo.userCode,
        		page:start,
        		limit:limit,
        		nameOrPhone:this.form.radio1
        	}
        	if(this.form.radio=="无服务门店"){
        		params.storeId='';
        	}
        	if(this.form.radio=="组织"){
        		params.storeId=this.form.storeId;
        	}
        	if(this.form.radio1=="全部消费者"){
        		params.nameOrPhone='';
        	}
        	if(this.form.radio1=="会员"){
        		params.nameOrPhone=this.form.nameOrPhone;
        	}
//      	console.log(JSON.stringify(params))
        	this.tableLoading = true;
				// 查询接口
			selectDistributeStore(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(data);
					if(data.data) {
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								...val
							});
						})
						that.tableData = result;
						that.tableLoading = false;
						that.count=data.count;
					} else if(data.messageType != 'SUCCESS') {
						that.$message.warning(data.messageContent);
						that.tableLoading = false;
					}
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
    	},
    	showTableStore(start,limit){
    		let params ={
    			userId:this.userInfo.userCode,
    			page:start,
    			limit:limit,
    			searchContent:this.formStore.searchContent
    		}
    		let that =this;
    		this.storeLoading=true;
//  		console.log(params)
    		selectStoreData(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
    				that.storeLoading=false;
					if(data.data) {
//						console.log(JSON.stringify(data))
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								...val
							});
						})
						that.tableDataStore = result;
						that.countStore=data.count;
					} else if(data.messageType != 'SUCCESS') {
						that.$message.warning(data.messageContent);
					}
				})
				.catch(function(err) {
    				that.storeLoading=false;
					// console.log(err);
				});
    	},
        //查询会员
        onSubmit(){
			this.showTable('', this.limit);
        },
        //查询门店
        onSubmitStore(){
			this.showTableStore(this.pageStore, this.limit1);
        },
        //点击查询的 选择组织
		selectOrganization() {
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
			this.searchStoreTab();
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
//						console.log(err);
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
//						console.log(err);
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
			var that = this;
			this.dataIndex = val;
			that.data2.forEach((data, index) => {
				val.forEach((value, ind) => {
					if(value == data.storeId) {
						idArray += data.storeId + ",";
						nameArray += data.storeName + ",";
					}
				})
			})
			idArray = idArray.substr(0, idArray.length - 1);
			nameArray = nameArray.substr(0, nameArray.length - 1);
			this.storeArr = nameArray;
			this.form.storeId = idArray;
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
//							        		console.log(JSON.stringify(data)+"返回值")
					this.data2 = [];
					if(data != "") {
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
					//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
				})
				.catch((err) => {
					// console.log(err)
				})
			$("#transfer").show();
		},
        //分配门店按钮
        allocation(){
        	this.setDistributeStore=true;
        	this.showTableStore(this.pageStore,this.limit1);
        },
        //分配门店弹窗确认
        setDistributeEnter(){
        	if(!this.multipleSelectionStore.storeId){
				this.$message.warning('请选择您要分配的门店！');
        		return false;
        	}
        	let param= '';
        	let that =this;
        	this.multipleSelection.forEach((val,index)=>{
        		param+=val.id+",";
        	})
        	let params ={
        		"userId": this.userInfo.userCode,
				"nameOrPhone":this.form.radio1,
				"serviceStoreId":this.multipleSelectionStore.storeId,
				"serviceStoreName":this.multipleSelectionStore.storeName,
				"params":param
        	}
        	if(this.form.radio=="无服务门店"){
        		params.storeId='';
        	}
        	if(this.form.radio=="组织"){
        		params.storeId=this.form.storeId;
        	}
        	this.setDistributeStoreloading=true;
//      	console.log(JSON.stringify(params))
        	distributeStore(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//	        		console.log(JSON.stringify(data));
	        		if(data.messageType == 'SUCCESS') {
        				that.setDistributeStore=false;
						that.$message.success(data.messageContent);
						that.showTable(that.page, that.limit);
        				that.setDistributeStoreloading=false;
					} else {
						that.$message.warning(data.messageContent);
        				that.setDistributeStoreloading=false;
					}
				})
				.catch((err) => {
    				that.setDistributeStoreloading=false;
					// console.log('err');
				})
        }
    },
    created() {
        // 钩子函数 -- 初始化
		this.showTable(this.page, this.limit);
		// 权限
		this.roleBtn = permission(this.roleBtn);
//		console.log(JSON.stringify(this.roleBtn))
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
	display: unset;
	.el-form-item {
		margin-bottom: 10px;
	}
}
.searchContent {
	width: 160px;
	margin-bottom: 10px;
}
.el-form-item--small.el-form-item{
	margin-right: 0;
}
.width200{
	width:200px
}
.nameOrPhone{
	width:150px;
	margin-left:10px;
}
.marginTop10{
	margin-top: 10px;
}
.marginRight10{
	margin-right: 10px;
}
</style>