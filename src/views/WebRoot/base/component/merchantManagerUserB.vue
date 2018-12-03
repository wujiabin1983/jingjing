<!--基础设置 - 业务规则 - 会员权益 - 等级  - 商户-->
<template>
	<div class="container"  v-loading="saveLoading">
		<el-card>
			<!-- <h4>会员卡片设置</h4> -->
			<el-form :model="form" ref="form" label-width="120px" :inline="true" :rules="rules">
				<el-form-item label="订单范围">
					<!-- <el-input v-model="form.orderScope" placeholder="请输入卡号位数"></el-input> -->
					<el-radio-group v-model="form.orderScope.type" @change="handleOrderScopeSelect">
						<el-radio label="all">全部订单</el-radio>
						<el-radio label="part">
							<span class="formText">只统计</span>
							<el-input class="orderScopeNum" type="text" v-model="form.orderScope.num" :disabled="form.orderScope.type == 'all'"></el-input> <span class="formText">折及以上订单（0-100）</span>
						</el-radio>
						<div ref="orderScopeErr" class="el-form-item__error"></div>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</el-card>
		<!--<merchant-manager-user-b-c ref="memLevel"></merchant-manager-user-b-c>-->

		<div class="component" v-for="(item, index) in items" :key="items.id">
			<div :is="item.component"  ref="memLevelList"  v-on:message="recieveMessage" :isDefault="item.isDefault" :saleType="item.saleType" :text="items.id"></div>
        <!--  v-if="roleBtn.addMemLevelConfigInfo" -->

			<el-tooltip class="iconItem" content="删除" placement="top">
				<!-- 删除 -->
				<icon-svg icon-class="shanchu" @click.native.prevent="handleDelete(index)" />
			</el-tooltip>
		</div>
		<el-button @click="handleAdd" type="primary" v-if="roleBtn.addMemLevelConfigInfo" class="width100">添加</el-button>
		<el-button @click="handleDetermine" type="primary" v-if="roleBtn.updateMemLevelConfigInfo" class="enterBtn">确定</el-button>

		<!-- 分页 -->
		<el-footer v-if="count != 0">
			<el-pagination background  class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
			</el-pagination>
		</el-footer>
    </div>
</template>
<script>
	/**
	 * 接口信息
	 * 
	 */
	import { permission } from '@/utils'
	import { I_SCRM_INTERFACE_601, I_SCRM_INTERFACE_602 } from '@/api/base/merchantManagerUser'
	import { mapGetters } from 'vuex'
	import merchantManagerUserBC from './merchantManagerUserBC'
	export default {
		data() {
			return {
				saveLoading:false,
				roleBtn: {
					selectMemLevelConfigInfo: false,
					addMemLevelConfigInfo: false,
					updateMemLevelConfigInfo: false
				},
				parentData: 'parentData...',
				orderScopeIsDisabled: false, // 输入框判断是否能能够输入
				form: {
					orderScope: {
						type: 'all', // type:all/part(all：全部订单;part:折扣订单）
						num: '' // （0-100）num:66
					},
				},
				msg:[],
				rules: {
					orderScope: [ // 卡号位数
						{
							required: true,
							message: '请选择卡号位数',
							type: 'boolean'
						}
					]

				},
				memLevel: '',
				memLevelList: '',

				items: [], // 动态添加的组件
				submitFlag:false,
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		components: {
			merchantManagerUserBC
		},
		methods: {
			recieveMessage(value){
				this.$refs.memLevelList.forEach((val, index) => {
					if(index>0){
						this.$refs.memLevelList[index].form.upgradRequire.checkbox=value;
						this.items.forEach((itemVal,itemIndex)=>{
							if(itemIndex>1){
								this.items[itemIndex].saleType=value.length==2?0:value[0]=='amountMoney'?1:2
							}
						})
						if(value.length<2&&value.length>0){
							if(value[0]=='unitMoney'){
								this.$refs.memLevelList[index].form.upgradRequire.amountMoney='';
							}else if(value[0]=='amountMoney'){
								this.$refs.memLevelList[index].form.upgradRequire.unitMoney='';
							}
						}
						if(value.length==0){
							this.$refs.memLevelList[index].form.upgradRequire.amountMoney='';
							this.$refs.memLevelList[index].form.upgradRequire.unitMoney='';
							this.items.forEach((itemVal,itemIndex)=>{
								if(itemIndex>1){
									this.items[itemIndex].saleType=4
								}
							})
						}
						
					}
//					console.log(JSON.stringify(this.$refs.memLevelList[index].form))
				})
			},
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
			// 显示表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start, //可为空
					"limit": limit, //可为空
				}
				this.saveLoading=true;
				// 使表格加载
				// this.tableLoading = true;
				if(this.roleBtn.selectMemLevelConfigInfo) {
					I_SCRM_INTERFACE_601(params)
						.then((res) => {
							this.saveLoading=false;
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							if(code == 'SUCCESS') {
								this.items=[];
								this.msg=msg;
//								console.log(JSON.stringify(msg)+"返回值");
								if(msg.length === 0) {
									this.handleAdd();
									return false;
								}
//								if(msg.length>1){
//									console.log(msg[1].upgradRequire)
//								}
//								console.log(msg.length)
								msg.forEach((val, index) => {
									this.handleAdd();
									let that = this;
									this.$nextTick(() => {
										if(msg.length>1){
											that.$refs.memLevelList[index].form.type = msg[index].levelName;
											that.$refs.memLevelList[index].form.upgradRequire = msg[index].upgradRequire;
											that.$refs.memLevelList[index].form.extendCondite = msg[index].extendCondite;
											that.$refs.memLevelList[index].form.levalExpDate = msg[index].levalExpDate;
										}else{
											that.$refs.memLevelList[index].form.type = msg[index].levelName;
											that.$refs.memLevelList[index].form.upgradRequire = msg[index].upgradRequire;
											that.$refs.memLevelList[index].form.extendCondite = msg[index].extendCondite;
											that.$refs.memLevelList[index].form.levalExpDate = msg[index].levalExpDate;
										}
									});
								});
							} else {
								this.$message.warning(msg);
							}
						})
						.catch((err) => {
							this.saveLoading=false;
//							console.log(err);
						});
				}
			},

			// 订单范围选择
			handleOrderScopeSelect(val) {
				if(val == 'all') {
					this.form.orderScope.num = '';
					this.orderScopeIsDisabled = true;
				}
				if(val == 'part') {
					this.orderScopeIsDisabled = false;
				}
			},

			// 保存
			handleDetermine() {
				let that = this;
				let memLevelList = [];
				let reg = /^[0-9]+\.?[0-9]*$/;
				if(this.$refs.memLevelList != null) {
					this.$refs.memLevelList.forEach((val, index) => {
						this.$refs.memLevelList[index].$refs['form'].validate((valid) => {
							if(valid) {
								if(index==0){
									memLevelList.push({
										"orderScope": this.form.orderScope, // 订单范围
										"levelName": val.form.type, // 等级名称
										"upgradRequire": val.form.upgradRequire, // 升级条件
										"extendCondite": val.form.extendCondite, // 续会条件
										"levalExpDate": val.form.levalExpDate, // 等级有效期
										"isDefault": true // 是否初始等级
									});
								}else{
									memLevelList.push({
										"orderScope": this.form.orderScope, // 订单范围
										"levelName": val.form.type, // 等级名称
										"upgradRequire": val.form.upgradRequire, // 升级条件
										"extendCondite": val.form.extendCondite, // 续会条件
										"levalExpDate": val.form.levalExpDate, // 等级有效期
										"isDefault": false // 是否初始等级
									});
								}
								this.submitFlag = true;
								if(index>0){
//									console.log(val.form.upgradRequire.checkbox.length+"长度");
									if(val.form.upgradRequire.checkbox.length==0){
							   	 		this.$message.warning('请选择升级条件！');
										this.submitFlag = false;
									}else if(val.form.upgradRequire.checkbox.length==1){
										if(val.form.upgradRequire.checkbox[0]=='unitMoney'&&val.form.upgradRequire.unitMoney==''){
								   	 		this.$message.warning('请输入单笔消费金额！');
											this.submitFlag = false;
										} 
										if(val.form.upgradRequire.checkbox[0]=='unitMoney'&&!reg.test(val.form.upgradRequire.unitMoney)){
											this.$message.warning('请输入有效的单笔消费金额！');
											this.submitFlag = false;
										}
										if(val.form.upgradRequire.checkbox[0]=='amountMoney'&&val.form.upgradRequire.amountMoney==''){
								   	 		this.$message.warning('请输入累计消费金额！');
											this.submitFlag = false;
										}
									    if(val.form.upgradRequire.checkbox[0]=='amountMoney'&&!reg.test(val.form.upgradRequire.amountMoney)){
											this.$message.warning('请输入有效的累计消费金额！');
											this.submitFlag = false;
										}
									}else{
										if(val.form.upgradRequire.unitMoney==''){
								   	 		this.$message.warning('请输入单笔消费金额！');
											this.submitFlag = false;
										}
										if(!reg.test(val.form.upgradRequire.unitMoney)){
											this.$message.warning('请输入有效的单笔消费金额！');
											this.submitFlag = false;
										}
										if(val.form.upgradRequire.amountMoney==''){
								   	 		this.$message.warning('请输入累计消费金额！');
											this.submitFlag = false;
										}
										if(!reg.test(val.form.upgradRequire.amountMoney)){
											this.$message.warning('请输入有效的累计消费金额！');
											this.submitFlag = false;
										}
									}
								}
							} else {
								this.submitFlag = false;
							}
						})
						// console.log(val.form);
						// console.log(val, index)
					});
				}
				if(!this.submitFlag){
					return false;
				}
				
				this.memLevelList = memLevelList;
				let params = {
					"userId": that.userInfo.userCode,
					"memLevelList": [
						...this.memLevelList
					]
				}
//				console.log(JSON.stringify(params));
				this.saveLoading=true;
//				return false;
				I_SCRM_INTERFACE_602(params)
					.then((res) => {
						this.saveLoading=false;
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data)
						if(data.messageType == 'SUCCESS') {
						    this.$message.success(data.messageContent);
							this.showTable(this.page, this.limit);
						}else {
						    this.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
						this.saveLoading=false;
						// console.log(err);
					});
			},
			// 添加
			handleAdd() {
				let length = this.items.length;
				if(this.msg.length==0){
					if(length==0){
						this.items.push({
							'id': length++,
							'component': 'merchant-manager-user-b-c',
							'isDefault':true,
							'saleType':''
						});
					}else if(length==1){
						this.items.push({
							'id': length++,
							'component': 'merchant-manager-user-b-c',
							'isDefault':false,
							'saleType':3
						});	 
					}else if(length==2){
						if(this.$refs.memLevelList[1].form.upgradRequire.checkbox.length==0){
						    this.$message.warning('请选择升级条件！');
						    return false;
						}else{
							this.items.push({
								'id': length++,
								'component': 'merchant-manager-user-b-c',
								'isDefault':false,
								'saleType':this.$refs.memLevelList[1].form.upgradRequire.checkbox.length==2?0:this.$refs.memLevelList[1].form.upgradRequire.checkbox[0]=='amountMoney'?1:2
							});	 
						}
					}else{
						this.items.push({
							'id': length++,
							'component': 'merchant-manager-user-b-c',
							'isDefault':false,
							'saleType':this.$refs.memLevelList[1].form.upgradRequire.checkbox.length==2?0:this.$refs.memLevelList[1].form.upgradRequire.checkbox[0]=='amountMoney'?1:2
						});	 
					}
				}else{
					if(length==0){
						this.items.push({
							'id': length++,
							'component': 'merchant-manager-user-b-c',
							'isDefault':true,
							'saleType':''
						});
					}else if(length==1){
						this.items.push({
							'id': length++,
							'component': 'merchant-manager-user-b-c',
							'isDefault':false,
							'saleType':3
						});	 
					}else if(length==2){
						if(this.msg[1].upgradRequire.checkbox.length==0){
						    this.$message.warning('请选择升级条件！');
						    return false;
						}else{
							this.items.push({
								'id': length++,
								'component': 'merchant-manager-user-b-c',
								'isDefault':false,
								'saleType':this.msg[1].upgradRequire.checkbox.length==2?0:this.msg[1].upgradRequire.checkbox[0]=='amountMoney'?1:2
							});	 
						}
					}else{
						this.items.push({
							'id': length++,
							'component': 'merchant-manager-user-b-c',
							'isDefault':false,
							'saleType':this.msg[1].upgradRequire.checkbox.length==2?0:this.msg[1].upgradRequire.checkbox[0]=='amountMoney'?1:2
						});	 
					}
				}
			},
			// 删除
			handleDelete(index) {
				if(this.items.length>1){
					if(index!=0){
						this.items.splice(index, 1);
					}else{
					    this.$message.warning('初始等级不能删除！');
					}
				}
			}
		},
		created() {
            // 权限
            this.handleAdd();
			this.roleBtn = permission(this.roleBtn);
            // 钩子函数 -- 初始化
            this.showTable(this.page, this.limit);
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
		position: relative;
	}
	
	.el-form {
		min-width: 500px;
		.el-form-item {
			display: block;
			margin: 0;
		}
	}
	
	
	.el-select {
		width: 100%;
	}
	
	// 行内文本 span
	.formText {
		display: inline;
		line-height: rem(30px);
	}
	
	.iconItem {
		position: absolute;
		top: 20px;
		right: rem(20px);
	}
	
	#shanchu {
		font-size: 20px!important;
	}
	
	.component {
		clear: both;
		position: relative;
	}
	.orderScopeNum{
		width: 120px;
		margin: 0 10px;
	}
	.enterBtn{
		margin-left: 0;
		margin-top: 10px;
	}
</style>