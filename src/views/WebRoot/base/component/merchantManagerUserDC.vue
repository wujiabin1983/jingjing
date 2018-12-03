// 基础设置 - 业务规则 - 会员权益 - 积分新增(品牌管理员)
<template>
	<el-container class="app-container">
		<el-main>
			<h4>
				默认配置
				<el-button type="primary" class="floatRight" @click="handleBrandAdd" v-if="tableDataBrand == 0">添加</el-button>
			</h4>
			<!-- <el-card> -->
			<!-- 表格 -->
			<el-table ref="tableDataBrand" :data="tableDataBrand" v-loading="tableBrandLoading" @selection-change="handleSelectionChange">
				<el-table-column prop="integralType" label="消费积分类型">
					<template slot-scope="scope">
						{{scope.row.integralType.msg === '固定' ? `固定积分 每笔消费，送 ${!scope.row.integralType.ipt1 ? '' : scope.row.integralType.ipt1} 分` : `订单金额 消费满 ${!scope.row.integralType.ipt2 ? '' : scope.row.integralType.ipt2} 元，送1积分`}}
					</template>
				</el-table-column>
				<el-table-column prop="giveCriterionData" label="消费赠送标准"></el-table-column>
				<el-table-column prop="action" label="操作">
					<template slot-scope="scope">
						<!-- 功能图标 -->
						<el-tooltip class="item" content="查看" placement="top">
							<!-- 查看 -->
							<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakanBrand(scope.$index, scope.row)" />
						</el-tooltip>
						<el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit">
							<!-- 修改 -->
							<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugaiBrand(scope.$index, scope.row)" />
						</el-tooltip>

					</template>
				</el-table-column>
			</el-table>
			<!-- </el-card> -->
			<h4 class="marginTop10">
				按门店配置
				<el-button type="primary" class="floatRight" @click="handleStoreAdd">添加</el-button>
			</h4>

			<el-table ref="tableDataStore" :data="tableDataStore" v-loading="tableStoreLoading" @selection-change="handleSelectionChange">
				<el-table-column prop="storeName" label="门店"></el-table-column>
				<el-table-column prop="integralType" label="消费积分类型">
					<template slot-scope="scope">
						{{scope.row.integralType.msg === '固定' ? `固定积分 每笔消费，送 ${!scope.row.integralType.ipt1 ? '' : scope.row.integralType.ipt1} 分` : `订单金额 消费满 ${!scope.row.integralType.ipt2 ? '' : scope.row.integralType.ipt2} 元，送1积分`}}
					</template>
				</el-table-column>
				<el-table-column prop="giveCriterionData" label="消费赠送标准"></el-table-column>
				<el-table-column prop="action" label="操作">
					<template slot-scope="scope">
						<!-- 功能图标 -->
						<el-tooltip class="item" content="查看" placement="top">
							<!-- 查看 -->
							<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakanStore(scope.$index, scope.row)" />
						</el-tooltip>
						<el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit">
							<!-- 修改 -->
							<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugaiStore(scope.$index, scope.row)" />
						</el-tooltip>
						<el-tooltip class="item" content="删除" placement="top">
							<!-- 删除 -->
							<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchuBrand(scope.$index, scope.row)" />
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-footer  v-if="count != 0">
				<el-pagination 
					background 
					 class="pagination" 
					layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" 
					:page-size="limit"
					:total="count" 
					@current-change="handleCurrentChange">
				</el-pagination>
			</el-footer>
		</el-main>
		<el-dialog
			title="配置"
			:visible.sync="dialogVisible"
			width="79%"
			:before-close="handleClose"
			 :modal-append-to-body='false'
			v-if="dialogVisible"
			>
			<merchant-manager-user-d-d ref="merchantManagerUserDD" :childPageType="pageType" :childAddType="addType" :childType="iconActionType" :childFormData="childFormData" :childBrandFormData="JSON.stringify(tableDataBrand)"></merchant-manager-user-d-d>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" v-if="pageType == '查看'">关 闭</el-button>
				<el-button @click="dialogVisible = false" v-if="pageType == '修改' || pageType == '添加'">取 消</el-button>
				<el-button type="primary" @click="handleSure" v-if="pageType == '修改' || pageType == '添加'">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>
<script>
	//        显示表格数据                          编辑表格数据                                   激活-按钮                                                     停用-按钮
	// import { selectUserInfo, selectUserInfoEdit, selectUserInfoActive, selectUserInfoStop } from '@/api/platform/commercUserManage'
	// import { gerTableData } from '@/api/base/merchantManagerUser'
	import { selectIntegralRuleInfo, saveIntegralRuleInfo, editIntegralRuleInfo, deleteIntegralRuleInfo } from '@/api/base/merchantManagerUser'
	import { mapGetters } from 'vuex'
	import Bus from '@/utils/eventBus.js'
	import merchantManagerUserDD from './merchantManagerUserDD'
	export default {
		data() {
			return {
				childFormData: {},
				pageType: '', // 按钮类型（查看、修改）
				addType: '', // 添加类型
				iconActionType: '', // 图标按钮操作类型（默认配置、按门店配置）
				dialogVisible: false,
				formSearch: {
					searchInfo: '' // scrm搜索信息
				},
				tableBrandLoading: false, // 加载
				// table数据
				tableDataBrand: [
					// {
					// 	integralType: '', // 门店名称
					// 	decimalRule: '', // 积分小数规则
					// }
				],
				tableStoreLoading: false, // 加载
				tableDataStore: [
					// {
					// 	storeName: '', // 门店名称
					// 	integralType: '', // 积分小数规则
					// 	giveCriterion: '' // 消费赠送标准
					// }
				],
				// 表格多选
				multipleSelection: [],

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		components: {
			merchantManagerUserDD
		},
		methods: {
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit); 
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			handleSure() {
				let formScrm = this.$refs.merchantManagerUserDD.formScrm;
				formScrm.giveCriterion.msgData=formScrm.giveCriterion.msgData;
				if(this.pageType == '添加') {
					// 添加
					let params;
					if(this.addType == '按门店配置') {
						params = {
							"userId": this.userInfo.userCode,
							"integralModel": "SCRM模式",//是页签的名字
							"ruleType": "门店",
							...formScrm
						}
						if(params.storeId==""){
							this.$message.warning('请选择门店！');
							return false;
						}
//						console.log(JSON.stringify(params));
//						return false;
						saveIntegralRuleInfo(params)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent,
									val = data.valueObj;
									// console.log(msg, val, '|||||msgvallskdfj');
								if(code == 'SUCCESS') {
									this.$message.success(msg);
									this.tableStoreLoading = true;
									this.showTable(this.page, this.limit); 
								}else {
									this.$message.error(msg);
								}
							})
							.catch((err) => {
								this.$message.error('系统繁忙！请稍后重试！');
							});
					}else if(this.addType == '默认配置') {
						let params = {
							"userId": this.userInfo.userCode,
							"integralModel": "SCRM模式",//是页签的名字
							"ruleType": "品牌",
							...formScrm
						}
						saveIntegralRuleInfo(params)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent,
									val = data.valueObj;
									// console.log(msg, val, '|||||msgvallskdfj');
								if(code == 'SUCCESS') {
									this.$message.success(msg);
									// console.log(msg);
									this.tableStoreLoading = true;
									this.showTable(this.page, this.limit); 
								}else {
									this.$message.error(msg);
								}
							})
							.catch((err) => {
								this.$message.error('系统繁忙！请稍后重试！');
							});
					}
					// console.log(this.iconActionType);return false;
					// let params = {
					// 	"userId": this.userInfo.userCode,
					// 	"integralModel": "SCRM模式",//是页签的名字
					// 	"ruleType": "门店",
					// 	...formScrm
					// }
					// console.log(JSON.stringify(params), '||params');
					this.dialogVisible = false;
					
				}else {
					// 修改
					this.dialogVisible = false;
					let params = {
						"userId": this.userInfo.userCode,
						id: formScrm.id,
						version: formScrm.version,
						"storeId": formScrm.storeId,
						"storeName": formScrm.storeName,
						"integralType": formScrm.integralType,
						"giveCriterion": formScrm.giveCriterion,
						"decimalRule": formScrm.decimalRule,
						"integralValidity": formScrm.integralValidity,
						"overdueWarnDays": formScrm.overdueWarnDays,
						"freezingDays": formScrm.freezingDays,
						"discountLower": formScrm.discountLower,
						"integralType": formScrm.integralType,
						"giveCriterion": formScrm.giveCriterion,
						"integralDesc": formScrm.integralDesc
					}
					// console.log(JSON.stringify(params), '||params修改');
					editIntegralRuleInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent,
								val = data.valueObj;
								// console.log(msg, val, '|||||msgvallskdfj');
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.tableStoreLoading = true;
								this.showTable(this.page, this.limit); 
							}else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							this.$message.error('系统繁忙！请稍后重试！');
						});
					this.dialogVisible = false;
				}
			},
			// 默认配置添加
			handleBrandAdd() {
				this.dialogVisible = true;
				this.addType = '默认配置';
				this.iconActionType = '默认配置';
				this.pageType = '添加';
				this.childFormData = JSON.stringify({});
			},
			// 按门店配置添加
			handleStoreAdd() {
				this.dialogVisible = true;
				this.addType = '按门店配置';
				this.iconActionType = '按门店配置';
				this.pageType = '添加';
				this.childFormData = JSON.stringify({});
			},
			handleClose() {
				this.dialogVisible = false;
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 显示表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					start: start,
					limit: limit,
                    userId: this.userInfo.userCode
                }
				// 查询接口
				// console.log(params, '--params');
				selectIntegralRuleInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data)),
                            code = data.messageType,
                            msg = data.messageContent,
                            val = data.valueObj;
							// console.log(data);
                        if(code == 'SUCCESS') {
//							console.log(JSON.stringify(msg), 'msg, msg, msg, msg');
							let brandRule = msg.brandRule; // 默认配置
							let storeRule = msg.storeRule; // 按门店配置
							that.count = msg.storeRuleCount;
							// console.log(brandRule, '||||||\\\\',   storeRule);
							if(!brandRule === false) {
//								console.log(JSON.stringify(brandRule))
								let data = [];
								data.push(brandRule);
								if(JSON.stringify(brandRule) === '{}') {
									that.tableDataBrand = [];
								}else {
									let giveCriterionData='';
									data[0].giveCriterion.msgData.forEach((val,ind)=>{
										giveCriterionData+=val.name+val.value+'倍,'
									})
									giveCriterionData=giveCriterionData.substr(0,giveCriterionData.length-1);
									data[0].giveCriterionData=giveCriterionData;
									that.tableDataBrand = data;
								}
							}else {
								that.tableDataBrand = [];
							}
//							console.log(JSON.stringify(storeRule))
							if(!storeRule === false) {
								let giveCriterionData='';
								that.tableDataStore=[];
								storeRule.forEach((value,index)=>{
									giveCriterionData='';
									value.giveCriterion.msgData.forEach((val,ind)=>{
										giveCriterionData+=val.name+val.value+'倍,'
									})
									giveCriterionData=giveCriterionData.substr(0,giveCriterionData.length-1);
									value.giveCriterionData=giveCriterionData;
									that.tableDataStore.push(value);
								})
							}else {
								that.tableDataStore = [];
							}
							that.tableBrandLoading = false;
							that.tableStoreLoading = false;
                        }else {
                            that.tableBrandLoading = false;
                            that.tableStoreLoading = false;
                            that.$message.error(msg);
                        }
					})
					.catch(function(err) {
//						 console.log(err);
						that.tableBrandLoading = false;
						that.tableStoreLoading = false;
					});
			},
			// 搜索数据
			handleSearch() {
				this.showTable(this.page, this.limit); 
			},
			// 添加表格数据
			handleSubmit() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						// this.$message('submit!');
						var data = JSON.stringify(this.form);
						this.$router.push({
							name: '角色管理',
							params: {
								'formData': data
							}
						});
					} else {
						this.$message.error('填写内容错误');
						return false;
					}
				})
			},
			iconShanchuBrand (index, row) {
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					// console.log(params); return false;
					deleteIntegralRuleInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent,
								val = data.valueObj;
								// count = data.count,
								// msg = data.data;
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.showTable(this.page, this.limit); 
							}else {
								this.$message.error(msg);
								this.showTable(this.page, this.limit); 
							}
						})
						.catch((err) => {
							// console.log(err);
							this.showTable(this.page, this.limit); 
						});
				});
			},
			// iconChakanBrand
			// iconXiugaiBrand
			// 图标 - 查看
			iconChakanBrand(index, row) {
				this.dialogVisible = true;
				this.iconActionType = '默认配置';
				this.pageType = '查看';
				this.childFormData = JSON.stringify(row);
			},
			// 图标 - 修改
			iconXiugaiBrand(index, row) {
				this.dialogVisible = true;
				this.iconActionType = '默认配置';
				this.pageType = '修改';
				this.childFormData = JSON.stringify(row);
			},
			iconChakanStore(index, row) {
				this.dialogVisible = true;
				this.iconActionType = '按门店配置';
				this.pageType = '查看';
				this.childFormData = JSON.stringify(row);
			},
			// 图标 - 修改
			iconXiugaiStore(index, row) {
				this.dialogVisible = true;
				this.iconActionType = '按门店配置';
				this.pageType = '修改';
				this.childFormData = JSON.stringify(row);
			},
			// 图标 - 确认
			iconQueren(index, row) {

			},
			// 图标 - 删除
			iconShanchu(index, row) {
				//          console.log(index);
				this.tableDataBrand.splice(index, 1);
			},
			// 图标 - 启用
			iconQiyong(index, row) {
				this.tableDataBrand[index].status = '激活';
			},
			// 图标 - 停止
			iconTingzhi(index, row) {
				this.tableDataBrand[index].status = '停用';
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// 用于显示表格数据，并提供查询功能
			let data = this.getFormData;
			let pageType = this.getPageType;
			if(pageType == '修改') {
				let res = JSON.parse(data);
				//          console.log(res);
				let params = {
					...res
				}
				selectUserInfoEdit(params)
					.then((res) => {
						let code = res.data.messageType;
						let data = res.data.messageContent;
						if(code == 'SUCCESS') {
							this.$message.success(data);
						}
					})
					.catch((err) => {
						// console.log(err)
					})
			}
			if(data) {
				let res = JSON.parse(data);
			}
			// 使表格加载
			// this.tableBrandLoading = true;
			this.tableStoreLoading = true;
			this.showTable(this.page, this.limit); 

			Bus.$off('showTableData');
			Bus.$off('showTableDataEdit');
		},
		computed: {
			...mapGetters([
				'userInfo',
			]),
			// 获取 添加页面传递过来的数据
			getFormData() {
				return this.$route.params.formData;
			},
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
	
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
	
	.dsh-main {
		display: block;
	}
	.marginTop10{
		margin-top: 10px;
	}
</style>