<!----优惠券-优惠券库-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card>
				<el-form :model="form" v-loading="this.tableLoading" :rules="this.getPageType=='查看' ? norules : rules" v-if="" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="10" class="col-container">
							<el-form-item label="券模板" prop="coupTempName" v-if="this.getPageType!='查看'" placeholder="选择券模板">
								<el-input v-model="form.coupTempName" :disabled="true" placeholder="选择券模板" class="dsh-input"></el-input>
								<el-button type="primary" id="search" @click="coupTempClick" class="dsh-input-button">选择</el-button>
							</el-form-item>
							<el-form-item label="券模板" prop="coupTempName" v-else>
								<el-input v-model="form.coupTempName" :disabled="disabled" placeholder="请输入券模板"></el-input>
							</el-form-item>
							<el-form-item label="券名称" prop="coupName">
								<el-input v-model="form.coupName" :disabled="disabled" placeholder="请输入券名称"></el-input>
							</el-form-item>
							<el-form-item label="审核人" prop="operatorBy">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.operatorBy" placeholder="审核人"></el-input>
			                    <el-select v-model="form.operatorBy" clearable placeholder="请选择审核人" @change="roleSelect" v-else>
									<el-option v-for="item in audioUserData" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
			                    </el-select>
							</el-form-item>
							<el-form-item label="适用系统" prop="applySystem">
			                    <el-select v-model="applySystem" multiple @change="applySystemChange" :disabled="disabled" placeholder="请选择">
			                    	<el-option
								      v-for="item in options"
								      :key="item.value"
								      :label="item.label"
								      :value="item.value">
								    </el-option>
			                    </el-select>
							</el-form-item>
							<el-form-item label="季节" prop="season">
								<el-input v-model="form.season" :disabled="disabled" placeholder="请输入季节"></el-input>
							</el-form-item>
							<el-form-item label="同步发布至" prop="isSynchr">
								<el-checkbox v-model="form.isSynchr" :disabled="disabled">微信卡包（请先在业务规则-电子券维护页面配置基础信息）</el-checkbox>
							</el-form-item>
							<el-form-item label="是否可转赠" prop="isDonation">
								<el-checkbox v-model="form.isDonation" :disabled="disabled">允许转赠给其他人</el-checkbox>
							</el-form-item>
							<el-form-item label="使用说明" prop="useDesc">
								<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入使用说明" v-model="form.useDesc">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10" v-if="this.getPageType!='查看'">
						<el-col :span="24" class="el-footer-btn-con">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitFormSave">保存</el-button>
							<el-button type="primary" @click="submitForm">提交</el-button>
						</el-col>
					</el-row>
				</el-form>
				<el-dialog title="选择券模板" :visible.sync="handleStoreDialog" class="dialogOne">
					<el-form :model="couponLibraryForm" ref="setJurisdiction" :rules="roleRules" class="role">
						<el-form-item label="券类型" prop="role">
							<el-select v-model="couponLibraryForm.couponType" clearable @change="couponChange" placeholder="选择券类型" class="width150">
		                        <el-option label="代金券" value="代金券"></el-option>
		                        <el-option label="折扣券" value="折扣券"></el-option>
		                        <el-option label="礼品券" value="礼品券"></el-option>
							</el-select>
							<el-input v-model="couponLibraryForm.coupTempName" class="width150" placeholder="请输入券模板名称"></el-input>
							<el-button type="primary" @click="onSubmit">查询</el-button>
						</el-form-item>
					</el-form>
					<el-table ref="tableDataTab" v-loading="tableSelectLoading" :data="tableDataTab" class="el-tableRadio" highlight-current-row  border @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="couponType" label="类型"></el-table-column>
						<el-table-column prop="coupTempName" label="券名称"></el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="total, prev, pager, next, jumper" :page-size="limit" :total="count" @current-change="handleCurrentChangeTab">
						</el-pagination>
					</el-footer>
					<div slot="footer" class="dialog-footer overHidden">
						<el-button @click="handleStoreDialog = false">取 消</el-button>
						<el-button type="primary" @click="enterJurisdiction">确 定</el-button>
					</div>
				</el-dialog>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { addCouponLibrary,setCouponLibrary} from '@/api/member/couponLibrary'
	import { selectAudioUser,getBrandInfo } from '@/api/public'
	import { selectCouponTemplate} from '@/api/member/couponTemplate'
	import Cookie from 'js-cookie'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableSelectLoading:false,
				handleStoreDialog: false,//弹窗标识
				disabled: false,//查看的时候的只读标识
				tableLoading:false,
				couponLibraryForm:{
					couponType:'',
					coupTempName:''
				},
				applySystem:[],
				options:[{
		          value: 'SCRM系统',
		          label: 'SCRM系统'
		        },{
		          value: 'POS系统',
		          label: 'POS系统'
		        }],
				pattern:'',
				// form表单数据
				form: {
					"masterId":"",//优惠券模板表记录ID
					"coupTempId":"",//优惠券模板ID
					"coupTempName":"",//优惠券模板名称
					"coupName":"",//优惠券库名称
					"couponType":"",
					"operatorId":"",//审核人ID
					"operatorBy":"",//审核人
					"applySystem":"",//适用系统（POS系统/SCRM系统）
					"season":"",//季节
					"isSynchr":"",//是否同步微信卡包
					"isDonation":"",//是否可转赠
					"useDesc":""//使用说明
				},
				tableDataTab:[],
				multipleSelectionTab:[],//选择的数据
				// 	审核人
				audioUserData: [],
				roleRules:{},
				norules: {},
				rules: {
					coupTempName: [{
							required: true,
							message: '请选择券模板',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					coupName: [{
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
					operatorBy: [{
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
					applySystem: [{
							required: true,
							message: '请选择适用系统',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				},
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limitDialog, // 条/页
			}
		},
		methods: {
			applySystemChange(val){
				let str = '';
				val.forEach((val,index)=>{
					str+=val+",";
				})
				str=str.substr(0,str.length-1);
				this.form.applySystem=str;
			},
			coupTempClick(){
				this.handleStoreDialog=true;
				this.showTable(this.page, this.limit, this.couponLibraryForm);
			},
			showTable(start, limit,couponLibraryForm) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					couponType:couponLibraryForm.couponType,
					coupTempName:couponLibraryForm.coupTempName,
					page: start,
					limit: limit
				}
				// 使表格加载
				this.tableSelectLoading = true;
				// 查询接口
//				console.log(params)
				selectCouponTemplate(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data)
						that.tableSelectLoading=false;
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.count = data.count;
							that.tableDataTab = result;
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableSelectLoading = false;
					});
			},
			roleSelect(val) {
				let index = parseInt(val);
				let data = this.audioUserData[index];
				this.form.operatorBy = data.key;
				this.form.operatorId = data.value;
//				console.log(JSON.stringify(data))
			},
			handleSelectionChangeTab(val){
	            this.multipleSelectionTab = val;
			},
			// 分页
			handleCurrentChangeTab(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.couponLibraryForm);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(val, this.limit, this.couponLibraryForm);
			},
			//弹窗确认
			enterJurisdiction(){
				let val = this.multipleSelectionTab;
				this.form.coupTempId= val.coupTempId;
				this.form.masterId=	val.id;
				this.form.coupTempName=	val.coupTempName;
				this.form.couponType=val.couponType;
				this.handleStoreDialog=false;
			},
			//选择券模板的查询
			onSubmit(){
				this.showTable('', this.limit, this.couponLibraryForm);
			},
			couponChange(val){
				if(val==""){
					this.couponLibraryForm.couponType='';
				}
			},
			// 方法
			submitForm() {
				var that = this;
				this.$refs['form'].validate((valid) => {
					if(valid) {
						this.tableLoading=true;
						var params = {
							userId:this.userInfo.userCode,
							operFlag:1,
							...this.form
						}
						
						if(this.getPageType == '复制'){
							params.systemStatus='审核中';
						}
						if(this.getPageType == '添加'||this.getPageType == '复制') {
//							console.log("复制|添加——提交")
							addCouponLibrary(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
//									console.log(data)
				                    if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '优惠券库'
										});
				                        that.$message.success(data.messageContent);
				                        that.tableLoading = false;
				                    }else {
				                        that.$message.error(data.messageContent);
				                        that.tableLoading = false;
				                    }
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}else{
//							console.log("修改——提交")
							params.operFlag="1";
//						console.log(JSON.stringify(params))
							setCouponLibrary(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
//									console.log(data)
				                    if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '优惠券库'
										});
				                        that.$message.success(data.messageContent);
				                        that.tableLoading = false;
				                    }else {
				                        that.$message.error(data.messageContent);
				                        that.tableLoading = false;
				                    }
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			// 方法
			submitFormSave() {
				this.tableLoading=true;
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '优惠券库'
					});
					return false;
				}
				var that = this;
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var params = {
							userId:this.userInfo.userCode,
							operFlag:"0",
							...this.form
						}
						if(this.getPageType == '复制'){
							params.systemStatus='未审核';
						}
						if(this.getPageType == '添加'||this.getPageType == '复制') {
//							console.log(JSON.stringify(params))
							addCouponLibrary(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
//									console.log(data)
				                    if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '优惠券库'
										});
				                        that.$message.success(data.messageContent);
				                        that.tableLoading = false;
				                    }else {
				                        that.$message.error(data.messageContent);
				                        that.tableLoading = false;
				                    }
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}else{
//							console.log("修改——保存")
							params.operFlag="0";
//							console.log(JSON.stringify(params))
							setCouponLibrary(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
//									console.log(data)
				                    if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '优惠券库'
										});
				                        that.$message.success(data.messageContent);
				                        that.tableLoading = false;
				                    }else {
				                        that.$message.error(data.messageContent);
				                        that.tableLoading = false;
				                    }
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			handleBack() {
				if(this.getPageTypes == '审核'){
					this.$router.push({
						name: '优惠券库',
						params: {
							pageType: '审核查看'
						}
					});
				}else{
					this.$router.push({
						name: '优惠券库',
						params: {
							pageType: '查看'
						}
					});
				}
			},
		},
		created() {
			if(this.getPageType == '查看') {
				this.disabled = true;
				let res = JSON.parse(this.getFormData);
//				console.log(JSON.stringify(res))
				this.form = {
					...res
				}
				this.applySystem=res.applySystem.split(",");
				if(res.isSynchr=="true"){
					this.form.isSynchr=true; 
				}else{
					this.form.isSynchr=false; 
				}
				if(res.isDonation=="true"){
					this.form.isDonation=true; 
				}else{
					this.form.isDonation=false; 
				}
			} else if(this.getPageType == '修改'||this.getPageType == '复制') {
				this.disabled = false;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				this.applySystem=res.applySystem.split(",");
				// console.log(JSON.stringify(res))
				if(res.isSynchr=="true"){
					this.form.isSynchr=true; 
				}else{
					this.form.isSynchr=false; 
				}
				if(res.isDonation=="true"){
					this.form.isDonation=true; 
				}else{
					this.form.isDonation=false; 
				}
			}
			var that = this;
			let params = {
				userId:this.userInfo.userCode
			}
			selectAudioUser(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(JSON.stringify(data))
					that.audioUserData = data.data;
                    that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
//			getBrandInfo(params)
//				.then(function(res) {
//					let data = JSON.parse(Base64.decode(res.data));
//					console.log(JSON.stringify(data))
//					that.pattern=data.messageContent.pattern;
//					if(data.messageContent.pattern.indexOf('scrm')!=-1){
//						that.form.applySystem="scrm系统";
//					}
//                  that.tableLoading = false;
//				})
//				.catch(function(err) {
//					// console.log(err);
//					that.tableLoading = false;
//				});
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
			getPageTypes() {
				return this.$route.params.pageTypes;
			},
			getpageTypeOther() {
				return this.$route.params.pageTypeOther;
			},
			pageTypes() {
				return this.$route.params.pageTypes;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getMainData(){
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
	.el-form {
		/*width: rem(940px);
		min-width: 500px;*/
	}
	.el-form-item{
		margin-bottom: 18px;
	}
	.el-select {
		width: 100%;
	}
	.el-button{
		margin-bottom: 5px;
	}
	.width150{
		width: 150px;
	}
	.col-container{
		float: none;
		margin: 0 auto;
	}
</style>