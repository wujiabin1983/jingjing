<!--活动监控 - 查看详情-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" class="mrgBottom10">返回</el-button>
			<el-card>
				<span class="title" v-model="form.coupPackName">{{form.coupPackName}}</span>
				<el-table ref="tableData" :data="tableData" class="width60">
					<el-table-column prop="activityIncome" label="活动收入"></el-table-column>
					<el-table-column prop="partNum" label="参与人数"></el-table-column>
					<el-table-column prop="grantNum" label="发放人数"></el-table-column>
					<el-table-column prop="pickNum" label="领用人数"></el-table-column>
					<el-table-column prop="writeNum" label="核销人数"></el-table-column>
				</el-table>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="收入趋势" name="first">
						<div ref="echartBox" class="tabs-echarts"></div>
					</el-tab-pane>
					<el-tab-pane label="领用趋势" name="second">
						<div ref="receive" class="tabs-echarts"></div>
					</el-tab-pane>
					<el-tab-pane label="使用趋势" name="third">
						<div ref="employ" class="tabs-echarts"></div>
					</el-tab-pane>
				</el-tabs>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	let echarts = require('echarts');
	import { selectActivityInfo, selectActivityViewData } from '@/api/member/activityManage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				activeName: 'first',
				form: {
					coupPackName: ''
				},
				// 表格数据
				tableData: [],
				xAxis: {},
				yAxis: {},
				series: []
			}
		},
		methods: {
			handleBack() {
				this.$router.push({
					name: '活动监控'
				});
			},
			handleClick(data) {
				let val = data.label;
				if(val == "收入趋势") {
					this.selectViewData(0);
				}
				if(val == "领用趋势") {
					this.selectViewData(1);
				}
				if(val == "使用趋势") {
					this.selectViewData(2);
				}
			},
			selectViewData(type) {
				let activityId = JSON.parse(this.getFormData).activityId;
				let id = JSON.parse(this.getFormData).id;
				let params = {
					userId: this.userInfo.userCode,
					id:id,
					activityId: activityId,
					chartType: type
				}
				var that = this;
				selectActivityViewData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						} else {
							that.xAxis = data.messageContent.xAxis;
							that.yAxis = data.messageContent.yAxis;
							that.series = data.messageContent.series;
//							console.log(JSON.stringify(data)+"视图");
							that.echarts(type);
						}
					})
					.catch(function(err) {
//						console.log(JSON.stringify(err));
					});
			},
			echarts(type) {
				//				console.log(type)
				let myChart = '';
				if(type == "0") {
					myChart = echarts.init(this.$refs.echartBox);
				}
				if(type == "1") {
					myChart = echarts.init(this.$refs.receive);
				}
				if(type == "2") {
					myChart = echarts.init(this.$refs.employ);
				}
				let option = {
					xAxis: this.xAxis,
					yAxis: this.yAxis,
				    tooltip: {
				        trigger: 'axis',
				        formatter: "{b}<br/> {c}人"
				    },
					series: this.series
				};
				myChart.setOption(option);
			}
		},
		created() {
//						console.log(this.getFormData)
			this.form.coupPackName = JSON.parse(this.getFormData).activityName;
			this.selectViewData(0);
			let that = this;
			let activityId = JSON.parse(this.getFormData).activityId;
			let id = JSON.parse(this.getFormData).id;
			let params = {
				userId: this.userInfo.userCode,
				id:id,
				activityId: activityId
			}
			selectActivityInfo(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					if(data.messageType != 'SUCCESS') {
						that.$message({
							message: data.messageContent,
							type: 'warning'
						});
					} else {
						that.tableData = [{
							activityIncome: data.messageContent.activityIncome,
							grantNum: data.messageContent.grantNum,
							partNum: data.messageContent.partNum,
							pickNum: data.messageContent.pickNum,
							writeNum: data.messageContent.writeNum
						}]
					}
				})
				.catch(function(err) {
					//					console.log(JSON.stringify(err)); category
				});
		},
		computed: {
			// 计算属性
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
	.width60{
		width: 60%;
	}
	.el-form {
		display: inline-block;
		margin-left: rem(20px);
	}
	
	.el-tabs {
		margin-bottom: 10px;
	}
	.tabs-echarts{
		width: 400px; 
		height: 400px;
	}
	.title {
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		font-weight: bold;
		color: #000000;
		width: 100%;
		text-align: left;
		margin: 0;
	}
</style>