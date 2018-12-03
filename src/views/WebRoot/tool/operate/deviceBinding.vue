<!--设备绑定-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="centerInfo">
				<el-form :model="form" v-loading="this.tableLoading" :rules="rules" ref="form" label-width="130px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-form-item label="选择门店" placeholder="请选择门店" prop="storeName">
								<el-input v-model="form.storeName" :disabled="true" placeholder="请选择门店" class="store width174"></el-input>
								<el-button type="primary" id="search" v-if="this.getPageType!='查看'" @click="searchStorePop">选择</el-button>
							</el-form-item>
                            <el-form-item label="绑定设备ID" prop="equipmentId">
                                <el-input v-model="form.equipmentId"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remarks">
                                <el-input v-model="form.remarks"></el-input>
                            </el-form-item>
                            <el-form-item label="状态" prop="status">
                                <el-radio-group v-model="form.status" class="floatLeft marginTop10">
                                    <el-radio label="激活">激活</el-radio>
                                    <el-radio label="停用">停用</el-radio>
                                </el-radio-group>
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
			<el-dialog title="选择门店" :visible.sync="handleTabDialog" class="dialogOne">
				<template>
				    <el-form :inline="true" :model="formStore" class="demo-form-inline marginTop10">
			            <el-form-item class="floatRight">
			                <el-button type="primary" @click="onSubmitStore">查询</el-button>
			            </el-form-item>
					    <el-form-item label="" class="floatRight marginRight10">
							<el-input placeholder="请输入门店名称或门店编码" class="width200" v-model="formStore.searchContent"></el-input>
			            </el-form-item>
		            </el-form>
				    <el-table ref="tableDataTab" v-loading="coupDataTabLoading" :data="coupDataTab" class="noBgColorTable" highlight-current-row border @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="storeId" label="门店ID"></el-table-column>
						<el-table-column prop="storeName" label="门店名称"></el-table-column>
						<el-table-column prop="address" label="门店地址"></el-table-column>
					</el-table>
	                <!-- 分页 -->
	                <el-footer v-if="counts != 0">
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
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { selectStoreData} from '@/api/public'
	import { creatDeviceBindingData,setDeviceBindingData} from '@/api/tool/deviceBinding'
	import { mapGetters } from 'vuex'
	const isRemarks = (rule, value, callback) => {
		if(value != "") {
			if(value.length>15) {
				callback(new Error('设备的备注信息不超过15个字'))
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
				formStore:{
					searchContent:''
				},
				// form表单数据
				tableLoading:false,
				disabled:false,
				form: {
                    storeId: '',
					storeName: '',
					equipmentId: '',
					remarks: '',
					status:'激活'
				},
	            page: 0, // 
	            counts: 0, // 
	            limit: this.GLOBAL.limitDialog, // 条/页
				multipleSelectionTab:[],
				coupDataTabLoading:false,
				handleTabDialog:false,
				coupDataTab:[],//穿梭框右侧的值
				searchContent:'',//门店名称或编码
				storeArr:'',//门店input容器
				activeName:'first',
				tabType:'门店',
				rules: {
					storeName: [{
							required: true,
							message: '请选择门店',
							trigger: 'change'
						}
					],
					equipmentId: [{
							required: true,
							message: '请输入绑定设备',
							trigger: 'change'
						}
					],
					remarks: [{
						validator: isRemarks,
					}]
				}
			}
		},
		methods: {
			handleSelectionChangeTab(val){
	            this.multipleSelectionTab = val;
			},
			searchStorePop(){
				this.handleTabDialog=true;
	            this.searchStoreTab(this.page, this.limit);
			},
			//弹窗确认
			enterStore(val){
				this.form.storeId = this.multipleSelectionTab.storeId;
				this.form.storeName = this.multipleSelectionTab.storeName;
				this.handleTabDialog = false;
			},
	        //查询门店-按钮
	        onSubmitStore(){
	            this.searchStoreTab('', this.limit);
	        },
	        handleStoreChange(val){
	            this.page = val;
	            this.searchStoreTab(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.searchStoreTab(this.page, this.limit);
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
							// console.log(JSON.stringify(param)+"入参")
							creatDeviceBindingData(param)
				                .then((res) => {
				                    let data = JSON.parse(Base64.decode(res.data));
				                    //    console.log(JSON.stringify(data)+"返回值");
				                    if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
				                        that.$message.success(data.messageContent);
										that.$router.push({
											name: '设备绑定'
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
						} else if(this.getPageType == '修改') {
							setDeviceBindingData(param)
				                .then((res) => {
				                    let data = JSON.parse(Base64.decode(res.data));
				                    //    console.log(JSON.stringify(data)+"返回值");
				                    if(data.messageType == 'SUCCESS') {
										that.tableLoading = false;
				                        that.$message.success(data.messageContent);
										that.$router.push({
											name: '设备绑定'
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
					name: '设备绑定'
				});
			},
			// 状态单选框改变
			radioStatusChange(val) {
				// console.log(val);
			},
			//门店搜索（tab）
			searchStoreTab(start,limit) {
				var params = {
					"userId": this.userInfo.userCode,
					"searchContent":this.formStore.searchContent,
					"page":start,
					"limit":limit,
					"shelvesStatus":'是'
				}
				this.coupDataTabLoading=true;
				// console.log(params)
				selectStoreData(params)
					.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
//		        		console.log(JSON.stringify(data))
						this.coupDataTabLoading=false;
						if(data.data){
							this.coupDataTab=data.data;
							this.counts=data.count;
						}
		        	})
		        	.catch((err) => {
						// console.log(err)   		
		        	})
			},
		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			// console.log(this.getFormData);
			if(this.getPageType == '查看') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
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
			// 计算属性
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
	.el-card .el-form-item{
		width:415px
	}
	.width174{
		width: 174px;
	}
	.width200{
		width: 200px;
	}
</style>