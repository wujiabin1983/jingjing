<!--优惠券礼包-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="this.tableLoading" :rules="this.getPageType=='查看' ? noRules : rules" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-form-item label="券包名称" prop="coupPackName">
								<el-input v-model="form.coupPackName" :disabled="disabled" placeholder="请输入券包名称"></el-input>
							</el-form-item>
							<el-form-item label="优惠券" v-if="this.getPageType=='查看'">
								<el-table ref="tableData" :data="tableData" border class="coupTable">
									<el-table-column type="index" width="50" label="序号"></el-table-column>
									<el-table-column prop="coupName" label="优惠券名称"></el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item label="选择优惠券" class="formItem" v-if="this.getPageType!='查看'" placeholder="请选择优惠券" prop="coupList">
								<el-input v-model="storeArr" :readonly="true" class="inputButton" placeholder="请选择优惠券"></el-input>
								<el-button type="primary" id="search" @click="searchStorePop">选择</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitForm('form')">确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			
			<el-dialog title="选择优惠券" :visible.sync="handleStoreDialog" class="transfer">
				<div class="search">
					<el-select v-model="formDialog.couponType" clearable @change="couponChange" placeholder="请选择券类型" class="width210">
						<el-option label="代金券" value="代金券"></el-option>
                        <el-option label="折扣券" value="折扣券"></el-option>
                        <el-option label="礼品券" value="礼品券"></el-option>
					</el-select>
					<el-input v-model="formDialog.coupLibraryKey" class="searchContent" placeholder="请输入券名称或ID"></el-input>
					<el-button type="primary" id="search" @click="searchStore">搜索</el-button>
				</div>
				<el-transfer :filterable="false" :titles="titleData" @change="storeArray" v-model="value2" :props="{key: 'coupId',label: 'coupName'}" :data="data2">
				</el-transfer>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleStoreDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { selectCouponLibraryJurisdiction} from '@/api/member/couponLibrary'
	import { addCouponPackage,setCouponPackage} from '@/api/member/couponPackage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableLoading:false,
				titleData:['未选择优惠券','已选择优惠券'],//穿梭框的左右两侧的标题
				disabled:false,//查看只读
				disabledSet:false,//添加，修改的只读
				dataIndex:[],//穿梭框右侧的值
				data2:[],//搜索门店的值
				value2: [],//选择的值
				handleStoreDialog: false,//弹窗
				formDialog:{//弹窗内的搜索条件
					couponType:'',
					coupLibraryKey:''
				},
				form:{
					coupPackName:"",//券名称
					coupList:""//优惠券集合
				},
				couponTypeData: [{
					value: '代金券',
					key: '代金券'
				}, {
					index: '1',
					value: '折扣券',
					key: '折扣券'
				}, {
					value: '礼品券',
					key: '礼品券'
				}],
				storeArr:'',
				// 表格数据
				tableData: [],
				noRules:{},//查看的时候去掉form表单验证
				rules: {//新增修改form表单验证
					coupPackName: [{
							required: true,
							message: '请输入券包名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					coupList: [{
							required: true,
							message: '请选择优惠券',
							trigger: 'change'
						},
						{
							max: 10000,
							message: '最大长度不能超过10000',
							trigger: 'change'
						}
					]
				},
	            // 分页
	            page: 0, // 当前页
	            count: 0, // 总条数
	            limit: this.GLOBAL.limitDialog // 条/页
			}
		},
		methods: {
        	// 分页
	        handleCurrentChange(val) {
	            // console.log(val, '当前页');
	            this.page = val;
	            this.showTable(val, this.limit, this.form.storeGroupId);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.storeGroupId);
			},
			// 方法
			submitForm(formName) {
				var that = this; 
				if(this.getPageType == '查看') {
					that.$router.push({
						name: '优惠券礼包'
					});
					return false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.tableLoading=true;
						var data = {
							userId:this.userInfo.userCode,
							...this.form
						}
						// console.log(JSON.stringify(data))
						if(that.getPageType == '添加') {
							addCouponPackage(data)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading=false;
									if(data.messageType == 'SUCCESS') {
										that.getPageType = '';
										that.$router.push({
											name: '优惠券礼包',
										});
										that.$message.success(data.messageContent);
									} else {
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									// console.log(err);
								});
						} else if(that.getPageType == '修改') {
							setCouponPackage(data)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading=false;
									if(data.messageType == 'SUCCESS') {
										that.getPageType = '';
										that.$router.push({
											name: '优惠券礼包',
										});
										that.$message.success(data.messageContent);
									} else {
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									// console.log(err);
								});
						}

					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			//点击弹窗
			searchStorePop(){
				this.searchInfo();
				this.handleStoreDialog = true;
			},
			//弹窗确认
			enterStore(val){
				this.handleStoreDialog = false;
			},
			//监听穿梭框事件
			storeArray(val){
				var idArray='';
				var nameArray='';
				var that = this;
				// console.log(val)
				that.data2.forEach((data, index) => {
					val.forEach((value, ind) => {
						if(value == data.coupId) {
							idArray += data.coupId + ",";
							nameArray += data.coupName + ",";
						}
					})
				})
				// console.log(nameArray)
    			var params = {
					idArray:idArray.substr(0, idArray.length - 1),
					nameArray:nameArray.substr(0, nameArray.length - 1)
				};
				this.form.coupList=JSON.stringify(params);
				this.storeArr = nameArray.substr(0, nameArray.length - 1);
			},
			//优惠券搜索
			searchStore() {
				this.searchInfo();
			},
			couponChange(val){
				if(val==""){
					this.formDialog.couponType='';
				}
			},
			//优惠券搜索
			searchInfo() {
				var that = this;
				var params = {
					"userId": this.userInfo.userCode,
					"page": 0,
					"limit": 100,
					"systemStatus":"已生效",
					"coupLibraryKey": this.formDialog.coupLibraryKey,
					"couponType": this.formDialog.couponType
				}
//				console.log(params)
				selectCouponLibraryJurisdiction(params)
					.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
//		        		 console.log(JSON.stringify(data))
						that.data2=[];
						if(data!=""){
							data.data.forEach((val, index) => {
								that.data2.push({
									coupName : val.coupName,
									coupId : val.coupId
								});
							})
//							console.log(JSON.stringify(that.data2))
						}
		        	})
		        	.catch((err) => {
						// console.log(err)   		
		        	})
			},
			handleBack() {
				this.$router.push({
					name: '优惠券礼包'
				});
			}
		},
		created() {
			// 钩子函数 -- 初始化
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				var str =res.coupList.nameArray.substr(0,res.coupList.nameArray.length-1);
				var array = str.split(",");
				array.forEach((val, index) => {
					this.tableData.push({
						coupName :val
					});
				})
				// console.log(JSON.stringify(res)+"返回值")
				// console.log(this.tableData)
			} else if(this.getPageType == '修改') {
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
//				 console.log(res.coupList)
				this.form = {
					...res
				}
				this.form.coupList =JSON.stringify(res.coupList);
				this.storeArr =res.coupList.nameArray;
				this.value2 = res.coupList.idArray.split(",");
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
	.el-button{
		margin-bottom: 5px;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-select {
		width: 225px;
	}
	
	.formItem #search {
		min-width:30%;
		float: left;
	}
	.formItem .inputButton{
		width: 69%;
		margin-right: 1%;
		float: left;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	#transfer {
		display: none;
	}
	.coupTable{
		margin-left: 0px;
		margin-bottom: 20px;
	}
	.width210{
		width: 210px;
	}
</style>