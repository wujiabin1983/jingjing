// // 营销活动 - 活动管理 - 新建活动/查看详情/修改 - 执行计划
<template>
	<div v-loading="this.tableLoading">
		<div>
			<el-button type="primary" class="mrgBottom10" @click="handleAddStep" v-if="this.getPageType!='查看'">添加步骤</el-button>
		</div>
		<!--<div is="TemplateCard"></div>-->
		<div class="component" v-for="(item, index) in templateItems" :key="templateItems.id">
			<div :is="item.component" :text="templateItems.id" :index="index" :data="item.data" ref="child"></div>

			<el-tooltip class="iconItem" content="删除" placement="top" v-if="item.delect">
				<icon-svg icon-class="shanchu" @click.native.prevent="handleDelete(index)" />
			</el-tooltip>
		</div>

		<el-dialog title="模板名称" :visible.sync="handleStoreDialog" class="Store">
			<div class="search">
				<el-input v-model="templateName" class="templateName" placeholder="请输入模板名称"></el-input>
			</div>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleStoreDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>
		<el-button type="primary" class="marginTop10" @click="back">上一步</el-button>
		<el-button type="primary" class="marginTop10" @click="saveTemplate" v-if="this.getPageType!='查看'">存为模板</el-button>
		<el-button type="primary" class="marginTop10" @click="save" v-if="this.getPageType!='查看'">暂存</el-button>
		<el-button type="primary" class="marginTop10" @click="finish" v-if="this.getPageType!='查看'">执行活动</el-button>
		<el-button class="marginTop10" @click="finishInfo" v-if="this.getPageType=='查看'">返回</el-button>
	</div>
</template>
<script>
	import { TemplateCard } from '@/views/WebRoot/platform'
	import { creatActivityData, selectActivityInfo, setActivityData } from '@/api/member/activityManagement'
	import { selectTemplateInfo, creatTemplateData } from '@/api/member/activeTemplate'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableLoading: false,
				templateName: '',
				handleStoreDialog: false,
				// 发送模板
				formTemplateInfo: [{
						id: '01',
						label: '短信模板',
						value: '短信模板'
					},
					{
						id: '02',
						label: '微信消息模版',
						value: '微信消息模版'
					}
				],
				// 模板的数量
				count: 1,
				activeTempDtl: [],
				templateItems: [], // 动态添加的组件
				submitFlag: false
			}
		},
		components: {
			TemplateCard
		},
		methods: {
			handleDelete(index) {
				if(this.getPageType != '查看') {
					this.templateItems.splice(index, 1);
				}
			},
			//存为模板
			saveTemplate() {
				this.handleStoreDialog = true;
			},
			//存为模板弹窗确认
			enterStore() {
				this.tableLoading = true;
				var params = {};
				this.$refs.child.forEach((val, index) => {
					this.activeTempDtl.push(val.form)
				})
				let that = this;
				//			console.log(this.getFormData)
				if(this.templateName == "") {
					that.$message.success('请输入模板名称');
					return false;
				}
				params = {
					userId: this.userInfo.userCode,
					activeTempMas: {
						templateName: this.templateName,
						...JSON.parse(sessionStorage.getItem("dataOne")),
						...JSON.parse(sessionStorage.getItem("dataTwo")),
						...JSON.parse(sessionStorage.getItem("dataThree")),
					},
					activeTempDtl: this.activeTempDtl
				}
				//			console.log(JSON.stringify(params))
				creatTemplateData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						//							console.log(JSON.stringify(data)+"?");
						if(code == 'SUCCESS') {
							that.$message.success('存为模板成功');
							sessionStorage.removeItem("dataOne");
							sessionStorage.removeItem("dataTwo");
							sessionStorage.removeItem("dataThree");
							that.$router.push({
								name: '活动模板'
							});
						} else {
							that.$message.error(msg);
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			handleAddStep() {
				//      	this.$refs.otherData="false";
				if(this.count == 1) {
					this.count++;
				} else {
					this.count == 1
				}
				//          this.$emit('content', this.content);

				let length = this.templateItems.length;
				this.templateItems.push({
					'id': length++,
					'component': 'TemplateCard',
					'data': this.activeTempDtl[length],
					'delect': this.getPageType!='查看'
				});
				this.$emit('content', this.activeTempDtl.length - 1);
				//          console.log(JSON.stringify(this.templateItems));
			},
			back() {
				this.$emit('message3', '2');
				this.templateItems = [];
			},
			//保存
			save() {
				this.tableLoading = true;
				var params = {};
				this.$refs.child.forEach((val, index) => {
					this.activeTempDtl.push(val.form)
				})
				let that = this;
				if(this.getPageType == "修改") {
					//				console.log(this.getFormData)
					if(sessionStorage.getItem("dataTwo")!=""){
						params = {
							userId: this.userInfo.userCode,
							activityStatus: "暂存",
							marketingActivitie: {
								id: JSON.parse(this.getFormData).marketingActivitie.id,
								version: JSON.parse(this.getFormData).marketingActivitie.version,
								activityId: JSON.parse(this.getFormData).marketingActivitie.activityId,
								...JSON.parse(sessionStorage.getItem("dataOne")),
								...JSON.parse(sessionStorage.getItem("dataTwo")),
								...JSON.parse(sessionStorage.getItem("dataThree")),
							},
							activeTempDtl: this.activeTempDtl
						}
					}else{
						params = {
							userId: this.userInfo.userCode,
							activityStatus: "暂存",
							marketingActivitie: {
								id: JSON.parse(this.getFormData).marketingActivitie.id,
								version: JSON.parse(this.getFormData).marketingActivitie.version,
								activityId: JSON.parse(this.getFormData).marketingActivitie.activityId,
								...JSON.parse(sessionStorage.getItem("dataOne")),
								...JSON.parse(sessionStorage.getItem("dataThree")),
							},
							activeTempDtl: this.activeTempDtl
						}
					}
//					console.log(JSON.stringify(params));
					setActivityData(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							//							console.log(JSON.stringify(data)+"?");
							if(code == 'SUCCESS') {
								that.$message.success('暂存成功');
								sessionStorage.removeItem("dataOne");
								sessionStorage.removeItem("dataTwo");
								sessionStorage.removeItem("dataThree");
								that.$router.push({
									name: '活动管理'
								});
							} else {
								that.$message.error(msg);
							}
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				} else {
					if(sessionStorage.getItem("dataTwo")!=""){
						params = {
							userId: this.userInfo.userCode,
							activityStatus: "暂存",
							...JSON.parse(sessionStorage.getItem("dataOne")),
							...JSON.parse(sessionStorage.getItem("dataTwo")),
							...JSON.parse(sessionStorage.getItem("dataThree")),
							activeTempDtl: this.activeTempDtl
						}
					}else{
						params = {
							userId: this.userInfo.userCode,
							activityStatus: "暂存",
							...JSON.parse(sessionStorage.getItem("dataOne")),
							...JSON.parse(sessionStorage.getItem("dataThree")),
							activeTempDtl: this.activeTempDtl
						}
					}
//					console.log(JSON.stringify(params));
					creatActivityData(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							//							console.log(JSON.stringify(data)+"?");
							if(code == 'SUCCESS') {
								that.$message.success('暂存成功');
								sessionStorage.removeItem("dataOne");
								sessionStorage.removeItem("dataTwo");
								sessionStorage.removeItem("dataThree");
								that.$router.push({
									name: '活动管理'
								});
							} else {
								that.$message.error(msg);
							}
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}
			},
			//查看详情-下一步
			finishInfo() {
				this.$router.push({
					name: '活动管理',
					params: {
	                    pageType: this.getPageTypes,
	                }
				});
			},
			//完成
			finish() {
				var params = {};
				let that = this;
				that.$refs.child.forEach((val, index) => {
					let params = val.form;
					that.$refs.child[index].$refs['form'].validate((valid) => {
						if(valid) {
							that.activeTempDtl.push(params);
							that.submitFlag = true;
						} else {
							that.submitFlag = false;
							// console.log("验证失败");
						}
					})
				})
				if(this.submitFlag) {
//					this.tableLoading = true;
					if(this.activeTempDtl.length == 0) {
						that.$message.error('最少添加一条执行计划');
						return false;
					}
					if(this.getPageType == "修改") {
						if(sessionStorage.getItem("dataTwo")!=""){
							params = {
								marketingActivitie: {
									id: JSON.parse(this.getFormData).marketingActivitie.id,
									version: JSON.parse(this.getFormData).marketingActivitie.version,
									activityId: JSON.parse(this.getFormData).marketingActivitie.activityId,
									...JSON.parse(sessionStorage.getItem("dataOne")),
									...JSON.parse(sessionStorage.getItem("dataTwo")),
									...JSON.parse(sessionStorage.getItem("dataThree")),
								},
								activityStatus: "未审核",
								userId: this.userInfo.userCode,
								activeTempDtl: this.activeTempDtl
							}
						}else{
							
							params = {
								marketingActivitie: {
									id: JSON.parse(this.getFormData).marketingActivitie.id,
									version: JSON.parse(this.getFormData).marketingActivitie.version,
									activityId: JSON.parse(this.getFormData).marketingActivitie.activityId,
									...JSON.parse(sessionStorage.getItem("dataOne")),
									...JSON.parse(sessionStorage.getItem("dataThree")),
								},
								activityStatus: "未审核",
								userId: this.userInfo.userCode,
								activeTempDtl: this.activeTempDtl
							}
						}
//									 console.log(JSON.stringify(params));
//									 return false;
											// console.log(JSON.stringify(params))
						setActivityData(params)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								//							console.log(JSON.stringify(data)+"?");
								if(code == 'SUCCESS') {
									that.$message.success(msg);
									sessionStorage.removeItem("dataOne");
									sessionStorage.removeItem("dataTwo");
									sessionStorage.removeItem("dataThree");
									that.$router.push({
										name: '活动管理'
									});
								} else {
									that.$message.error(msg);
								}
								that.tableLoading = false;
							})
							.catch(function(err) {
								// console.log(err);
								that.tableLoading = false;
							});
					} else {
						if(sessionStorage.getItem("dataTwo")!=""){
							params = {
								...JSON.parse(sessionStorage.getItem("dataOne")),
								...JSON.parse(sessionStorage.getItem("dataTwo")),
								...JSON.parse(sessionStorage.getItem("dataThree")),
								activityStatus: "未审核",
								userId: this.userInfo.userCode,
								activeTempDtl: this.activeTempDtl
							}
						}else{
							params = {
								...JSON.parse(sessionStorage.getItem("dataOne")),
								...JSON.parse(sessionStorage.getItem("dataThree")),
								activityStatus: "未审核",
								userId: this.userInfo.userCode,
								activeTempDtl: this.activeTempDtl
							}
						}
//					 	console.log(JSON.stringify(params));
//					 	return false;
						//					console.log(sessionStorage.getItem("dataOne"))
						//					console.log(sessionStorage.getItem("dataTwo"))
						//					console.log(sessionStorage.getItem("dataThree"))
						creatActivityData(params)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
									// console.log(JSON.stringify(data)+"?");
			                 	if(code == 'SUCCESS') {
			                        that.$message.success(msg);
			                        sessionStorage.removeItem("dataOne");
			                        sessionStorage.removeItem("dataTwo");
			                        sessionStorage.removeItem("dataThree");
									that.$router.push({
										name: '活动管理'
									});
			                    }else {
			                        that.$message.error(msg);
								}
			                    that.tableLoading = false;
							})
							.catch(function(err) {
								// console.log(err);
								that.tableLoading = false;
							});
					}
				}
			}

		},
		created() {
			this.handleAddStep();
			// 钩子函数 -- 初始化
			//         console.log(this.getPageType);
			if(this.getPageType == '查看') {
				this.disabled = "true";
				let res = JSON.parse(this.getFormData);

				var that = this;
				var params = {
					userId: this.userInfo.userCode,
					id: res.marketingActivitie.id
				};
				selectActivityInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data)+"查看详情");
						let result = [];
						if(data.messageType == 'SUCCESS') {
							that.form = {
								...data.messageContent
							}
						} else {
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
				this.templateItems = [];
				res.activeTempDtl.forEach((val, index) => {
					this.templateItems.push({
						'id': index,
						'component': 'TemplateCard',
						'data': res.activeTempDtl[index],
						'delect': this.getPageType!='查看'
					});
				})
				//          console.log(JSON.stringify(this.templateItems))
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				var that = this;
				var params = {
					userId: this.userInfo.userCode,
					id: res.marketingActivitie.id
				};
				selectActivityInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//		                console.log(JSON.stringify(data)+"修改");
						let result = [];
						if(data.messageType == 'SUCCESS') {
							that.form = {
								...data.messageContent
							}
							that.form.sendDate = JSON.stringify(that.form.sendDate);
						} else {
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
				//          console.log(res)
				this.templateItems = [];
				if(res.activeTempDtl.length == 0) {
					this.templateItems.push({
						'id': 0,
						'component': 'TemplateCard',
						'data': res.activeTempDtl[0],
						'delect': this.getPageType!='查看'
					});
				} else {
					res.activeTempDtl.forEach((val, index) => {
						this.templateItems.push({
							'id': index,
							'component': 'TemplateCard',
							'data': res.activeTempDtl[index],
							'delect': this.getPageType!='查看'
						});
					})
				}
			} else if(this.getPageType == '创建') {
				let res = JSON.parse(this.getFormData);
				var that = this;
				var params = {
					userId: this.userInfo.userCode,
					id: res.activeTempMas.id
				};
				selectTemplateInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						                  console.log(JSON.stringify(data)+"审核列表");
						let result = [];
						if(data.messageType == 'SUCCESS') {
							that.form = {
								...data.messageContent
							}
							res = data.messageContent;
						} else {
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
				//          console.log(JSON.stringify(res))
				this.templateItems = [];
				if(res.activeTempDtl.length == 0) {
					this.templateItems.push({
						'id': 0,
						'component': 'TemplateCard',
						'data': res.activeTempDtl[0],
						'delect': this.getPageType!='查看'
					});
				} else {
					res.activeTempDtl.forEach((val, index) => {
						this.templateItems.push({
							'id': index,
							'component': 'TemplateCard',
							'data': res.activeTempDtl[index],
							'delect': this.getPageType!='查看'
						});
					})
				}
			}
			//      console.log(JSON.stringify(sessionStorage.getItem("dataOne")))
			//      console.log(JSON.stringify(sessionStorage.getItem("dataTwo")))
			//      console.log(typeof sessionStorage.getItem("dataThree"))
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
			getPageTypes() {
				return this.$route.params.pageTypes;
			},
			getFormData() {
				return this.$route.params.formData;
			}
		},
		mounted() {

		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.Store .el-dialog .el-form {
		position: inherit;
	}
	
	.Store .el-dialog .role {
		height: 400px;
		width: 100%;
	}
	.search{
		width: 50%;	
	}
	
	.store {
		width: 230px
	}
	
	.el-form {
		// width: rem(700px);
		// min-width: 500px;
	}
	
	.el-select {
		// width: 100%;
	}
	
	.el-table-filter {
		max-height: 300px;
		overflow: auto;
	}
</style>