// 活动模板 - 新建模板 - 执行计划
<template>
	<div>
		<div>
			<el-button type="primary" class="mrgBottom10" @click="handleAddStep" v-if="this.getPageType!='查看'">添加步骤</el-button>
		</div>
		<!--<div is="TemplateFour"></div>-->
		<div class="component" v-for="(item, index) in templateItems" :key="templateItems.id">
			<div :is="item.component" :text="templateItems.id" :index="index" :data="item.data" ref="child"></div>

			<el-tooltip class="iconItem" content="删除" placement="top" v-if="deleteFlag">
				<icon-svg icon-class="shanchu" @click.native.prevent="handleDelete(index)" />
			</el-tooltip>
		</div>
		<el-button type="primary" class="marginTop10" @click="back">上一步</el-button>
		<el-button type="primary" class="marginTop10" @click="finish" v-if="this.getPageType!='查看'">完成</el-button>
		<el-button class="marginTop10"  @click="next" v-if="this.getPageType=='查看'">返回</el-button>
	</div>
</template>
<script>
	import { TemplateFour } from '@/views/WebRoot/platform'
	import { creatTemplateData, selectTemplateInfo, setTemplateData } from '@/api/member/activeTemplate'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 发送模板
				tableLoading: false,
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
				deleteFlag: true,
				// 模板的数量
				count: 1,
				activeTempDtl: [],
				templateItems: [], // 动态添加的组件
				submitFlag: true
			}
		},
		components: {
			TemplateFour
		},
		methods: {

			handleDelete(index) {
				if(this.getPageType != '查看') {
					this.templateItems.splice(index, 1);
				}
			},
			handleAddStep() {
				this.count++;
				this.$emit('content', this.content);

				let length = this.templateItems.length;
				this.templateItems.push({
					'id': length++,
					'component': 'TemplateFour',
					'data': this.activeTempDtl[length]
				});
				//          console.log(JSON.stringify(this.templateItems));
			},
			back() {
				this.$emit('message3', '2');
			},
			next() {
				if(this.getFlag) {
					if(this.getFlag == "平台") {
						this.$router.push({
							name: '预置活动模板'
						});
					} else {
						this.$router.push({
							name: '活动模板'
						});
					}
				} else {
					this.$router.push({
						name: '活动模板'
					});
				}
			},
			finish() {
				this.tableLoading = true;
				let params = {};
				let that = this;
				this.$refs.child.forEach((val, index) => {
					let params = val.form;
//							if(params.implementType == "指定时间") {
//								if(params.implementTime) {
//									if(JSON.parse(params.implementTime).selectTime == "") {
////										that.$message.warning("请选择指定时间！");
////										return false;
//									}
//								}
//							}
							if(params.implementType == "每周") {
								params.implementTime = '';
							}
							that.activeTempDtl.push(params);
							that.submitFlag = true;
				})
				if(this.submitFlag) {
					//      console.log(sessionStorage.getItem("dataOne"))
					//      console.log(sessionStorage.getItem("dataTwo"))
					//      console.log(sessionStorage.getItem("dataThree"))
					params = {
						activeTempMas: {
							...JSON.parse(sessionStorage.getItem("dataOne")),
							...JSON.parse(sessionStorage.getItem("dataTwo")),
							...JSON.parse(sessionStorage.getItem("dataThree")),
							activityStatus: "未审核"
						},
						userId: this.userInfo.userCode,
						activeTempDtl: this.activeTempDtl
					}
//					console.log(JSON.stringify(params))
					if(this.getPageType != '修改' || this.getPageType == '复制') {
						creatTemplateData(params)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								//							console.log(JSON.stringify(data)+"?");
								if(code == 'SUCCESS') {
									if(that.getPageType == "复制") {
										that.$message.success('复制模板成功');
									} else {
										that.$message.success(msg);
									}
									sessionStorage.removeItem("dataOne");
									sessionStorage.removeItem("dataTwo");
									sessionStorage.removeItem("dataThree");
									if(that.getFlag) {
										if(that.getFlag == "平台") {
											that.$router.push({
												name: '预置活动模板'
											});
										} else {
											that.$router.push({
												name: '活动模板'
											});
										}
									} else {
										that.$router.push({
											name: '活动模板'
										});
									}
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
						params.activeTempMas.version = JSON.parse(this.getFormData).activeTempMas.version;
						params.activeTempMas.id = JSON.parse(this.getFormData).activeTempMas.id;
						//				console.log(JSON.stringify(params)+"如此那")
						setTemplateData(params)
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
									if(that.getFlag) {
										if(that.getFlag == "平台") {
											that.$router.push({
												name: '预置活动模板'
											});
										} else {
											that.$router.push({
												name: '活动模板'
											});
										}
									} else {
										that.$router.push({
											name: '活动模板'
										});
									}
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
				}
			}

		},
		created() {
			this.handleAddStep();
			// 钩子函数 -- 初始化
			//         console.log(this.getPageType);
			if(this.getPageType == '查看') {
				this.disabled = "true";
				this.deleteFlag = false;
				let res = JSON.parse(this.getFormData);

				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					id: res.activeTempMas.id
				};
				selectTemplateInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data)+"审核列表");
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
				this.$emit('content', res.activeTempDtl.length - 1);
				this.templateItems = [];
				res.activeTempDtl.forEach((val, index) => {
					this.templateItems.push({
						'id': index,
						'component': 'TemplateFour',
						'data': res.activeTempDtl[index]
					});
				})
				//          console.log(JSON.stringify(this.templateItems))
			} else if(this.getPageType == '修改' || this.getPageType == '复制') {
				let res = JSON.parse(this.getFormData);
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					id: res.activeTempMas.id
				};
				selectTemplateInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//                  console.log(JSON.stringify(data)+"审核列表");
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
							//			            console.log(JSON.stringify(that.form)+"form")
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
				//          console.log(res)
				this.$emit('content', res.activeTempDtl.length - 1);
				this.templateItems = [];
				res.activeTempDtl.forEach((val, index) => {
					this.templateItems.push({
						'id': index,
						'component': 'TemplateFour',
						'data': res.activeTempDtl[index]
					});
				})
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
			getFormData() {
				return this.$route.params.formData;
			},
			getFlag() {
				return this.$route.params.flag;
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