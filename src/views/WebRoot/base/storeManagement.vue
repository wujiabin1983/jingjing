<!--门店管理-门店管理-->
<template>
	<el-container class="app-container">
        <div class="transitionArea">
            <transition name="el-zoom-in-top">
                <el-card v-show="show2" class="transition-box" :style="{'background-color': auditStatus.color}">{{auditStatus.txt}}</el-card>
            </transition>
        </div>
		<el-header>
			<el-card v-if="roleBtn.addStoresInfo || roleBtn.exportStoresInfo || roleBtn.synchroStoresInfo || roleBtn.selectStoresInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectStoresInfo">
					<div class="floatRight">
						<el-form-item label="是否为默认门店">
							<el-select v-model="form.isDefault"  clearable placeholder="请选择">
								<el-option label="是" value="是"></el-option>
								<el-option label="否" value="否"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否启用">
							<el-select v-model="form.shelvesStatus" clearable placeholder="请选择">
								<el-option label="是" value="是"></el-option>
								<el-option label="否" value="否"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-input v-model="form.searchContent" placeholder="请输入代码或关键字"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
			<el-card v-if="roleBtn.addStoresInfo || roleBtn.exportStoresInfo || roleBtn.synchroStoresInfo || roleBtn.selectStoresInfo">
				<el-button type="primary" @click="addStore" v-if="roleBtn.addStoresInfo">新增门店</el-button>
				<el-button type="primary" @click="exportDataFn" :disabled="exportDis" v-if="roleBtn.exportStoresInfo">导出Excel</el-button>
				<el-button type="primary" @click="synchroStores" :disabled="synchroDis" v-if="roleBtn.synchroStoresInfo">同步到微信</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="storeId" label="门店编码"></el-table-column>
					<el-table-column prop="storeName" label="门店名称"></el-table-column>
					<el-table-column prop="contactNumber1" label="服务电话">
						<template slot-scope="scope">
							<div v-if="scope.row.contactNumber1!=''&&scope.row.contactNumber2!=''">{{scope.row.contactNumber1+", "+scope.row.contactNumber2}}</div>
							<div v-if="scope.row.contactNumber1!=''&&scope.row.contactNumber2==''">{{scope.row.contactNumber1}}</div>
							<div v-if="scope.row.contactNumber1==''&&scope.row.contactNumber2!=''">{{scope.row.contactNumber2}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="templatePersonal" label="地理位置">
						<template slot-scope="scope">
	                    	<el-popover trigger="hover" placement="top" v-if="scope.row.longitude!=''">
					          <p> {{scope.row.longitude+", "+scope.row.latitude}}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{scope.row.longitude+", "+scope.row.latitude}}</el-tag>
					          </div>
					        </el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="addr" label="详细地址">
						<template slot-scope="scope" >
	                    	<el-popover trigger="hover" placement="top">
					          <p> {{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.areaName }}{{ scope.row.addr }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.areaName }}</el-tag>
					          </div>
					        </el-popover>
			            </template>
					</el-table-column>
					<el-table-column prop="shelvesStatus" width="85" label="是否启用"></el-table-column>
					<el-table-column prop="auditStatus" width="90" label="同步到微信"></el-table-column>
					<el-table-column prop="isDefault" width="120" label="是否为默认门店"></el-table-column>
					<el-table-column prop="action" width="85" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateStoresInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.updateStoresInfo && scope.row.isEdit">
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 启用 -->
							<el-tooltip class="item" content="启用" placement="top" v-if="roleBtn.onlineStoresInfo && scope.row.shelvesStatus != '是'">
								<icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 停用 -->
							<el-tooltip class="item" content="停用" placement="top" v-if="roleBtn.onlineStoresInfo && scope.row.shelvesStatus == '是'">
								<icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, tableData)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background  class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectStoreManagement, addStoreManagement, putawayStatus, setStoreManagement, deleteStoreManagement, exportData ,synchroStoresInfo,getStoreManagement } from '@/api/base/storeManagement'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				show2:true,//顶部默认门店的显示
                auditStatus: {//顶部默认门店的样式
                    txt: '',
                    color: '#FFF'
                },
				synchroDis:false,//同步到微信
				exportDis:false,//导出
				// 权限
				roleBtn: {//按钮权限
					selectStoresInfo: false,//查询
					addStoresInfo: false,//新增门店
					updateStoresInfo: false,//修改门店
					deleteStoresInfo: false,//删除门店
					exportStoresInfo: false,//导出Excel
					synchroStoresInfo: false,//同步到微信
					onlineStoresInfo: false,//停用
					downlineStoresInfo: false
				},
				// 搜索数据
				form: {
					isDefault:'',
					searchContent: '', //代码或名称关键字
					shelvesStatus: '' //上架状态
				},
				brandName: '品牌名称', //品牌名称
				// 表格数据
				tableData: [],
				//			{
				//				id: '',
				//				storeId: '', //门店编码
				//				storeName: '', //门店名称		--------
				//				storeAliasName: '', //门店别名
				//				storeUrl: '', //门店照片url
				//				storeType: '', //门店分类	
				//				addr: '', //详细地址				---------
				//				storeManager: '', //负责人
				//				contactNumber1: '', //联系电话1		--------
				//				contactNumber2: '', //联系电话2
				//				storeArea: '', //门店面积
				//				storePerNumber: '', //门店人数
				//				businessTimeBegin: '', //起始时间
				//				businessTimeEnd: '', //结束时间
				//				storeDesc: '', //门店简介
				//				remarks: '', //备注
				//				"longitude": "",
				//				"latitude": "",
				//				label: '', //标签
				//				isChat: '',
				//				shelvesStatus: '' //上架状态
				//			}
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//重置
			onReset() {
				this.form = {
					searchContent: '', //代码或名称关键字
					shelvesStatus: '' //上架状态
				};
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form);
			},
			// 分页
			handleCurrentChange(val) {
				//			console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form);
			},
			//修改分页limit
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			//请求表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					...this.form
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectStoreManagement(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//							              	console.log(JSON.stringify(data)+"查询门店数据");
						let result = [];
						if(!data.messageType) {
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
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
//			同步到微信
			synchroStores(){
				let that = this;
				if(this.multipleSelection.length==0){
					this.$message.warning('请选择数据！');
					return false;
				}
				let flag=0;
				let storesArray =[];
				this.multipleSelection.forEach((val,index)=>{
//					console.log(val.auditStatus)
					storesArray.push(val);
					if(val.auditStatus=="是"){
						flag++;
					}
				})
				if(flag>0){
					this.$message.warning('请选择未同步到微信的数据！');
					return false;
				}
				that.tableLoading=true;
				that.synchroDis=true;
				let params={
					userId:this.userInfo.userCode,
					storesArray:storesArray
				}
//				console.log(params)
				synchroStoresInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
//			                console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.synchroDis=false;
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.form);
								that.tableLoading=false;
							} else {
								that.synchroDis=false;
								that.$message.warning(data.messageContent);
								that.tableLoading=false;
							}
						})
						.catch((err) => {
							that.synchroDis=false;
							that.tableLoading=false;
//							 console.log(err);
						});
			},
			//启用
			iconQiyong(index, row) {
				let that = this;
				this.tableLoading=true;
				this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						"id": row[index].id,
						"version": row[index].version,
						"shelvesStatus": "是"
					}
					// console.log(data);
					// 停用接口
					putawayStatus(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//                  console.log(data);
							if(data.messageType == 'SUCCESS') {
								row[index].shelvesStatus = "是";
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit, this.form);
								that.tableLoading=false;
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading=false;
							}
						})
						.catch((err) => {
							that.tableLoading=false;
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			//停用
			iconTingzhi(index, row) {
				let that = this;
				this.tableLoading=true;
				this.$confirm('您确定要停用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						"userId": this.userInfo.userCode,
						"id": row[index].id,
						"version": row[index].version,
						"shelvesStatus": "否"
					}
					// console.log(data);
					// 停用接口
					putawayStatus(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//                  console.log(data);
							if(data.messageType == 'SUCCESS') {
								row[index].shelvesStatus = "否";
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit, this.form);
								that.tableLoading=false;
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading=false;
							}
						})
						.catch((err) => {
							that.tableLoading=false;
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			//导出数据
			exportDataFn() {
				let params = '';
				this.multipleSelection.forEach((val, index) => {
					params += val.id + ',';
				})
				this.exportDis=true;
				var param = {
					"userId": this.userInfo.userCode,
					"params": params,
					"shelvesStatus": this.form.shelvesStatus,
					"searchContent": this.form.searchContent
				}
				//			console.log(param);
				this.tableLoading = true;
				exportData(param)
					.then((res) => {
						//					console.log(JSON.stringify(res) + "导出返回值");
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							this.exportDis=false;
							window.location.href = Cookie.get("baseUrl") + data.messageContent;
						} else {
							this.exportDis=false;
							this.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
						this.exportDis=false;
						// console.log(err);
					});
				this.tableLoading = false;
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '门店管理门店管理查询',
					params: {
						pageType: '查看',
						brandName: this.brandName,
						pageTypes: '',
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '门店管理门店管理修改',
					params: {
						pageType: '修改',
						brandName: this.brandName,
						pageTypes: this.pageTypeOther,
						formData: data
					}
				});
			},
			// 添加表格数据
			addStore() {
				this.$router.push({
					name: '门店管理门店管理新增',
					params: {
						pageType: '添加',
						pageTypes: ''
					}
				});
			},
		},
		created() {
			//获取顶部默认门店信息
			var param = {
				"userId": this.userInfo.userCode
			}
			getStoreManagement(param)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					if(data.messageType == 'SUCCESS') {
//						console.log(data)
						this.auditStatus.color='#009ee2';
						this.auditStatus.txt=data.messageContent;
					} else {
						this.show2=false;
						this.$message.warning(data.messageContent);
					}
				})
				.catch((err) => {
//					 console.log(err);
				});
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化
			let that = this;
			let formData;
			let data;
			//		if(this.getPageType) {
			//			formData = JSON.parse(this.getFormData);
			//			data = {
			//				"userId": this.userInfo.userCode,
			//				...formData
			//			}
			//			delete(data["province"]);
			//		}
			//		if(this.getPageType == "添加") {
			//			this.getPageType = '';
			//			this.handleAddSellerInfo(data);
			//		} else if(this.getPageType == '修改') {
			//			this.getPageType = '';
			//			this.handleUpdateSellerInfo(data);
			//		}
		},
		computed: {
			//计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			//添加或修改返回的值
			getFormData() {
				return this.$route.params.formData;
			},
			//添加或修改返回的类型
			getPageType() {
				return this.$route.params.pageType;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
    .transitionArea {
        display: flex;
    }
    .transition-box {	
    	color: #fff;
        height: 40px;
        margin-right: 0;
        text-align: center;
	}
	
	.main-mobile {
		positiion: relative;
		.main-mobile-container {
			margin: 0 10px;
		}
	}
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom:10px;
		}
		.el-select{
			width:140px	
		}
	}
</style>