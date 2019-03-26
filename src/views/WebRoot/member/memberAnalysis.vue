<!--会员分析-->
<template>
	<div class="dashboard-editor-container">
		<el-row class="panel-group panel-group-select" :gutter="16">
			<el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
				<el-card>
					<el-form label-width="80px">
						<el-form-item label="" class="floatRight">
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
						<el-form-item label="选择组织" class="floatRight">
							<el-input v-model="storeArr" class="dsh-input" :readonly="true"></el-input>
							<el-button  type="primary" class="dsh-input-button" @click="storeClick('top')">选择</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-row class="panel-group" :gutter="16" v-loading="echartLoading">
			<el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
				<div class='card-panel'>
					<div class="card-panel-icon-wrapper people-box">
						<div class="circle-box">
							<i class="iconfont icon-money-symbol"></i>
						</div>
						<!-- <icon-svg icon-class="salejine" id="icon-salejine" class-name="card-panel-icon" /> -->
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">粉丝<br />数量</div>
						<count-to class="card-panel-num" :startVal="0" :endVal="header.fansCount.value" :duration="2600"></count-to>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper message-box">
						<div class="circle-box">
							<i class="iconfont icon-money-symbol"></i>
						</div>
						<!-- <icon-svg icon-class="salejine" id="icon-salejine" class-name="card-panel-icon" /> -->
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">会员<br/>数量</div>
						<count-to class="card-panel-num" :startVal="0" :endVal="header.memCount.value" :duration="3000"></count-to>
						<div class="card-panel-progress">
							<div class="card-panel-progress-bg">
								<span class="card-panel-progress-pro card-panel-progress-b" :style="memCount"></span>
							</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper money-box">
						<div class="circle-box">
							<i class="iconfont icon-money-symbol"></i>
						</div>
						<!-- <icon-svg icon-class="salejine" id="icon-salejine" class-name="card-panel-icon" /> -->
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">入会<br />已消费</div>
						<count-to class="card-panel-num" :startVal="0" :endVal="header.consumedCount.value" :duration="3200"></count-to>
						<div class="card-panel-progress">
							<div class="card-panel-progress-bg">
								<span class="card-panel-progress-pro card-panel-progress-c" :style="consumedCount"></span>
							</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper shoppingCard-box">
						<div class="circle-box">
							<i class="iconfont icon-money-symbol"></i>
						</div>
						<!-- <icon-svg icon-class="salejine" id="icon-salejine" class-name="card-panel-icon" /> -->
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">入会<br />未消费</div>
						<count-to class="card-panel-num" :startVal="0" :endVal="header.unconsumedCount.value" :duration="3600"></count-to>
						<div class="card-panel-progress">
							<div class="card-panel-progress-bg">
								<span class="card-panel-progress-pro card-panel-progress-d" :style="unconsumedCount"></span>
							</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="16" v-loading="echartLoading">
			<el-col :xs="24" :sm="24" :lg="14">
				<div class="chart-wrapper chart-contanier">
					<el-form label-width="40px">
						<el-form-item label="地区">
							<el-select v-model="provinceName" @change="areaChange" clearable placeholder="请选择">
								<el-option label="按会员地区" value="按会员地区"></el-option>
								<el-option label="按服务门店" value="按服务门店"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="group-echart group-echart-top" id="chinaInfo"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="24" :lg="10">
				<div class="chart-wrapper">
					<groupEchart childId="aa" ref="optionaa" :childOption="optionaa" class="group-echart group-echart-top"></groupEchart>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="16" v-loading="echartLoading">
			<!--新老会员-->
			<el-col :xs="24" :sm="8" :lg="8">
				<div class="chart-wrapper">
					<groupEchart childId="AA" ref="optionAA" :childOption="optionAA" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--年龄分布-->
			<el-col :xs="24" :sm="8" :lg="8">
				<div class="chart-wrapper">
					<groupEchart childId="BB" ref="optionBB" :childOption="optionBB" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--性别占比-->
			<el-col :xs="24" :sm="8" :lg="8">
				<div class="chart-wrapper">
					<groupEchart childId="CC" ref="optionCC" :childOption="optionCC" class="group-echart"></groupEchart>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="16" v-loading="echartLoading">
			<!--入会时长-->
			<el-col :xs="24" :sm="12" :lg="12">
				<div class="chart-wrapper">
					<groupEchart childId="EE" ref="optionEE" :childOption="optionEE" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--会员注册渠道占比-->
			<el-col :xs="24" :sm="12" :lg="12">
				<div class="chart-wrapper">
					<groupEchart childId="GG" ref="optionGG" :childOption="optionGG" class="group-echart"></groupEchart>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="16" v-loading="echartLoading">
			<!--会员等级占比-->
			<el-col :xs="24" :sm="12" :lg="12">
				<div class="chart-wrapper">
					<groupEchart childId="DD" ref="optionDD" :childOption="optionDD" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--会员活跃度占比-->
			<el-col :xs="24" :sm="12" :lg="12">
				<div class="chart-wrapper">
					<groupEchart childId="FF" ref="optionFF" :childOption="optionFF" class="group-echart"></groupEchart>
				</div>
			</el-col>
		</el-row>
		<el-row class="panel-group panel-group-select" :gutter="16">
			<el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
				<el-card>
					<el-form label-width="80px">
						<div class="floatRight">
							<el-button type="primary" @click="onSubmit1">查询</el-button>
							<el-button type="primary" @click="onReset1">重置</el-button>
						</div>
						<el-form-item label="选择组织" class="floatRight width280">
							<el-input v-model="storeArrBottom" class="dsh-input" :readonly="true"></el-input>
							<el-button type="primary" class="dsh-input-button" @click="storeClick('bottom')">选择</el-button>
						</el-form-item>
						<el-form-item label="选择月份" class="floatRight width280">
							<el-select v-model="mouth" clearable placeholder="请选择">
	                            <el-option label="3个月" value="3个月"></el-option>
								<el-option label="6个月" value="6个月"></el-option>
								<el-option label="9个月" value="9个月"></el-option>
								<el-option label="12个月" value="12个月"></el-option>
	                        </el-select>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="16" v-loading="echartLoading1">
			<!--消费时间-->
			<el-col :xs="24" :sm="8" :lg="8">
				<div class="chart-wrapper">
					<groupEchart childId="II" ref="optionII" :childOption="optionII" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--消费次数-->
			<el-col :xs="24" :sm="8" :lg="8">
				<div class="chart-wrapper">
					<groupEchart childId="HH" ref="optionHH" :childOption="optionHH" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--消费金额-->
			<el-col :xs="24" :sm="8" :lg="8">
				<div class="chart-wrapper">
					<groupEchart childId="KK" ref="optionKK" :childOption="optionKK" class="group-echart"></groupEchart>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="16" v-loading="echartLoading1">
			<!--客单价-->
			<el-col :xs="24" :sm="12" :lg="6">
				<div class="chart-wrapper">
					<groupEchart childId="MM" ref="optionMM" :childOption="optionMM" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--件单价-->
			<el-col :xs="24" :sm="12" :lg="6">
				<div class="chart-wrapper">
					<groupEchart childId="NN" ref="optionNN" :childOption="optionNN" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--折扣率-->
			<el-col :xs="24" :sm="12" :lg="6">
				<div class="chart-wrapper">
					<groupEchart childId="OO" ref="optionOO" :childOption="optionOO" class="group-echart"></groupEchart>
				</div>
			</el-col>
			<!--连带率占比-->
			<el-col :xs="24" :sm="12" :lg="6">
				<div class="chart-wrapper">
					<groupEchart childId="PP" ref="optionPP" :childOption="optionPP" class="group-echart"></groupEchart>
				</div>
			</el-col>
		</el-row>
		<el-dialog title="" :visible.sync="handleTabDialog" class="transfer" append-to-body>
			<el-tabs v-model="activeName" @tab-click="handleClick" v-if="clickType=='top'">
				<el-tab-pane label="门店" name="first">
					<div class="search">
						<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
						</el-cascader>
						<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
					</div>
					<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="valueTop" :props="{key: 'storeId',label: 'storeName'}" :data="dataTop">
					</el-transfer>
				</el-tab-pane>
				<el-tab-pane label="店组" name="second">
					<div class="search">
						<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
						</el-cascader>
						<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
					</div>
					<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="valueTop" :props="{key: 'storeId',label: 'storeName'}" :data="dataTop">
					</el-transfer>
				</el-tab-pane>
				<el-tab-pane label="区域" name="third">
					<div class="search">
						<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
						</el-cascader>
						<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
					</div>
					<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="valueTop" :props="{key: 'storeId',label: 'storeName'}" :data="dataTop">
					</el-transfer>
				</el-tab-pane>
			</el-tabs>
			<el-tabs v-model="activeNameBottom" @tab-click="handleClick" v-else>
				<el-tab-pane label="门店" name="first">
					<div class="search">
						<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
						</el-cascader>
						<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
					</div>
					<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="valueBottom" :props="{key: 'storeId',label: 'storeName'}" :data="dataBottom">
					</el-transfer>
				</el-tab-pane>
				<el-tab-pane label="店组" name="second">
					<div class="search">
						<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
						</el-cascader>
						<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
					</div>
					<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="valueBottom" :props="{key: 'storeId',label: 'storeName'}" :data="dataBottom">
					</el-transfer>
				</el-tab-pane>
				<el-tab-pane label="区域" name="third">
					<div class="search">
						<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
						</el-cascader>
						<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
						<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
					</div>
					<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="valueBottom" :props="{key: 'storeId',label: 'storeName'}" :data="dataBottom">
					</el-transfer>
				</el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleTabDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { groupEchart } from '@/views/WebRoot/member'
	import CountTo from 'vue-count-to'
	import { selectProCityArea, selectStoreData, getBrandInfo,selectTabData, selectRoleInfo, selectContentInfo } from '@/api/public'
	import { selectChinaMemberData,  selectChinaMemberDataList,selectMemberAnalysisData ,selectMemberAnalysisData1} from '@/api/member/memberAnalysis'
	export default {
		data() {
			return {
				clickType:'',
				provinceName:'按会员地区',
				mouth:'',
				header: {
					"fansCount": {
						"value": 0
					},
					"memCount": {
						"value": 0
					},
					"consumedCount": {
						"value": 0
					},
					"unconsumedCount": {
						"value": 0
					}
				},
				memCount:{
					width:''
				},
				consumedCount:{
					width:''
				},
				unconsumedCount:{
					width:''
				},
				echartLoading:false,
				echartLoading1:false,
				handleTabDialog: false,
				storeArr: '',
				storeArrId:'',
				storeArrBottom: '',
				storeArrIdBottom:'',
				tabType: '门店',
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndexTop: [], //
				dataIndexBottom: [], //穿梭框右侧的值
				dataTop: [], //搜索门店的值
				valueTop: [], //选择的值
				dataBottom: [], //搜索门店的值
				valueBottom: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				activeName: 'first',
				activeNameBottom: 'first',
				// 数据 
				storeId: '',
				optionAA: {
					title: {
						text: '新老会员占比',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						right: 5,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					color:['#B6A2DE','#2EC7C9'],
					calculable: true,
					series: [{
						name: '新老会员占比',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{d}% \n {b}'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionBB: {
					title: {
						text: '年龄分布',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						align: 'left',
						orient: 'vertical',
						right: 5,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					color:['#2EC7C9','#B6A2DE','#5AB1EF','#FFB980','#D87A80','#8D98B3'],
					calculable: true,
					series: [{
						name: '年龄分布',
						type: 'pie',
						clockWise: false,
						radius: [0, 70],
						center: ['35%', '50%'],
						roseType: 'radius',
						label: {
							normal: {
								show: false,
								position: 'inside',
								formatter: '{d}% \n {b}'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '12',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: true,
								length: 2
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]

				},
				optionCC: {
					title: {
						text: '性别占比',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						right: 5,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					color:['#5AB1EF','#D87A80'],
					calculable: true,
					series: [{
						name: '性别占比',
						type: 'pie',
						radius: [0, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inside',
								formatter: '{b} \n {d}%'
							}
						},
						labelLine: {
							normal: {
								show: true,
								length: 5,
								length2: 5
							},
							emphasis: {
								show: true
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionDD: {
					title: {
						text: '会员等级占比',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					color:['#5AB1EF','#FFB980','#D87A80','#8D98B3'],
					series: [{
						name: '会员活跃占比',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{d}% \n {b}'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionEE: {
					title: {
						text: '入会时长',
						subtext: '',
						itemGap: 5,
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						top: 50,
						left: '2%',
						right: '10%',
						bottom: '3%',
						containLabel: true
					},
					yAxis: [{
						type: 'category',
						data: [],
						axisTick: {
							alignWithLabel: true
						}
					}],
					xAxis: [{
						type: 'value',
						axisTick: {
							show: false
						},
						axisLabel: {
							interval: 0
						}
					}],
					series: [{
						barWidth: 20,
						data: [],
						type: 'bar',
						itemStyle: {
							normal: {
								barBorderRadius: [3, 3, 0, 0],
								color: function(params) {
									// build a color map as your need.
									var colorList = [
										'#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
										'#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
										'#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
										'#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
									]
									return colorList[params.dataIndex]
								},
								label: {
									show: true,
									position: 'right',
									formatter: '{c}'
								}
							}
						},
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionFF: {
					title: {
						text: '会员活跃占比',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					color:['#5AB1EF','#FFB980','#D87A80','#8D98B3','#91C7AE'],
					series: [{
						name: '会员活跃占比',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{d}% \n {b}'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionGG: {
					title: {
						text: '会员注册渠道占比',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						align: 'left',
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					color:['#2EC7C9','#B6A2DE','#5AB1EF','#FFB980','#D87A80','#8D98B3'],
					series: [{
						name: '会员注册渠道占比',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{d}% \n {b}'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionHH: {
					title: {
						text: '消费次数',
						subtext: '',
						itemGap: 5,
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						top: 50,
						left: '2%',
						right: '10%',
						bottom: '3%',
						containLabel: true
					},
					yAxis: [{
							type: 'category',
							data: [],
							axisTick: {
								show: false
							},
							axisLine: {
								show: false
							}
						},
						{
							type: 'category',
							data: [],
							axisTick: {
								show: false
							},
							axisLine: {
								show: false
							}
						}
					],
					xAxis: [{
						type: 'value',
						axisTick: {
							show: false
						},
						axisLabel: {
							show: false
						},
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
						splitArea: {
							show: false
						}
					}],
					series: [{
							name: 'none',
							// stack: 'sum',
							barGap: -1,
							barWidth: 21,
							data: [],
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#ededed'
								}
							},
							animationDuration: 0
						},
						{
							name: 'value',
							barWidth: 21,
							barGap: -1,
							data: [],
							type: 'bar',
							itemStyle: {
								normal: {
									barBorderRadius: [0, 3, 3, 0],
									color: function(params) {
										// build a color map as your need.
										var colorList = [
											'#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
											'#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
											'#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
											'#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
										]
										return colorList[params.dataIndex]
									},
									label: {
										show: false,
										position: 'right',
										formatter: '{c}'
									}
								}
							},
							animationEasing: 'cubicInOut',
							animationDuration: 2600
						}
					]
				},
				optionII: {
					title: {
						text: '消费时间',
						subtext: '',
						itemGap: 5,
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						top: 50,
						left: '2%',
						right: '10%',
						bottom: '3%',
						containLabel: true
					},
					yAxis: [{
						type: 'category',
						data: [],
						axisTick: {
							alignWithLabel: true
						}
					}],
					xAxis: [{
						type: 'value',
						axisTick: {
							show: false
						}
					}],
					series: [{
						barWidth: 25,
						data: [],
						type: 'bar',
						itemStyle: {
							normal: {
								barBorderRadius: [3, 3, 0, 0],
								color: function(params) {
									// build a color map as your need.
									var colorList = [
										'#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
										'#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
										'#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
										'#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
									]
									return colorList[params.dataIndex]
								},
								label: {
									show: true,
									position: 'right',
									formatter: '{c}'
								}
							}
						},
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionKK: {
					title: {
						text: '消费金额',
						subtext: '',
						itemGap: 5,
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						top: 50,
						left: '2%',
						right: '2%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						axisLabel: {
							interval: 0,
							rotate: 45
						},
						data: [],
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value',
						axisTick: {
							show: false
						}
					}],
					series: [{
						barWidth: 23,
						data: [],
						type: 'bar',
						itemStyle: {
							normal: {
								barBorderRadius: [3, 3, 0, 0],
								color: function(params) {
									// build a color map as your need.
									var colorList = [
										'#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
										'#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
										'#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
										'#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
									]
									return colorList[params.dataIndex]
								},
								label: {
									show: true,
									position: 'top',
									formatter: '{c}'
								}
							}
						},
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionMM: {
					title: {
						text: '客单价',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						align: 'left',
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					series: [{
						name: '会员注册渠道占比',
						type: 'pie',
						radius: [0, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{b} \n {d}%'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold',
									color:'#000'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionNN: {
					title: {
						text: '件单价',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						align: 'left',
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					series: [{
						name: '会员注册渠道占比',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{b} \n {d}%'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]

				},
				optionOO: {
					title: {
						text: '折扣率',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						align: 'left',
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					series: [{
						name: '折率',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{b} \n {d}%'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: true
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionPP: {
					title: {
						text: '连带率占比',
						subtext: '',
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						align: 'left',
						orient: 'vertical',
						right: 0,
						y: 'center',
						data: [],
						itemWidth: 15,
						itemHeight: 11,
						textStyle: {
							fontSize: 12
						}
					},
					calculable: true,
					series: [{
						name: '折率',
						type: 'pie',
						radius: [50, 70],
						center: ['35%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: '{b} \n {d}%'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: true
							}
						},
						data: [],
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]

				},
				optionaa: {
					title: {
						text: '各省会员数量排名',
						subtext: '',
						itemGap: 5,
						x: 'center',
						textStyle: {
							color: '#000',
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						top: 50,
						left: '2%',
						right: '10%',
						bottom: '3%',
						containLabel: true
					},
					yAxis: [{
						type: 'category',
						data: [],
						axisTick: {
							alignWithLabel: true
						}
					}],
					xAxis: [{
						type: 'value',
						axisTick: {
							show: false
						}
					}],
					series: [{
						barWidth: 15,
						data: [],
						type: 'bar',
						itemStyle: {
							normal: {
								barBorderRadius: [3, 3, 0, 0],
								color: function(params) {
									// build a color map as your need.
									var colorList = [
										'#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
										'#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
										'#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
										'#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
									]
									return colorList[params.dataIndex]
								},
								label: {
									show: true,
									position: 'right',
									formatter: '{c}'
								}
							}
						},
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}]
				},
				optionChina: {
					title: {
						text: '全国会员分布情况',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: '{b}<br/>{c} (人)'
					},
					visualMap: { //最大值最小值
						min: 100,
						max: 50000,
						text: ['High', 'Low'],
						realtime: false,
						calculable: true,
						inRange: {
							color: ['lightskyblue', 'yellow', 'orangered']
						}
					},
					series: [{
						name: '全国会员分布情况',
						type: 'map',
						mapType: 'HK', // 自定义扩展图表类型
						zoom: 1.2,
						roam: true,
						scaleLimit:{min:1,max:3.5},
						itemStyle: {
							normal: {
								label: {
									show: true
								}
							},
							emphasis: {
								label: {
									show: true
								}
							}
						},
						data: [],
						layoutSize: 1000,
					}]
				},
			}
		},
		components: {
			groupEchart,
			CountTo
		},
		methods: {
			areaChange(val){
				let params={
					userId:this.userInfo.userCode,
					area:val
				}
				if(this.storeArrId!=''){
					params.storeId=this.storeArrId;
					params.flag=this.activeName;
				}
				this.loadingData(params);
			},
			onReset(){
				this.storeArr='';
				this.storeArrId='';
				this.dataTop = [];
				this.valueTop = [];
				this.dataIndexTop = [];
			},
			onSubmit(){
//				console.log(this.registeDate)
				let params={
					userId:this.userInfo.userCode,
					area:this.provinceName
				}
				if(this.storeArrId!=''){
					params.storeId=this.storeArrId;
					params.flag=this.activeName;
				}
				this.loadingData(params);
			},
			onReset1(){
				this.mouth='';
				this.storeArrBottom='';
				this.storeArrIdBottom='';
				this.dataBottom = [];
				this.valueBottom = [];
				this.dataIndexBottom = [];
			},
			onSubmit1(){
//				console.log(this.registeDate)
				let params={
					userId:this.userInfo.userCode
				}
				if(this.mouth!=''){
					params.mouth=this.mouth;
				}
				if(this.storeArrIdBottom!=''){
					params.storeId=this.storeArrIdBottom;
					params.flag=this.activeNameBottom;
				}
				this.loadingData1(params);
			},
			registeDateChange(){},
			// 加载地图方法
			loadingFn(data) {
				// 钩子函数 -- 初始化
				let echarts = require('echarts');
				// 实例化
				let myChart = echarts.init(document.getElementById('chinaInfo'));
				// 绘制图表
				myChart.showLoading();
				$.get('./static/china.json', function(geoJson) {
					myChart.hideLoading();

					echarts.registerMap('HK', geoJson);

					myChart.setOption(data);
				});
			},
			// 穿梭框
			//点击查询的 选择组织
			storeClick(val) {
				this.handleTabDialog = true;
				this.clickType=val;
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.optionsProCityAreaPop = [];
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
				this.dataTop = [];
				this.valueTop = [];
				this.dataIndexTop = [];
				this.dataBottom = [];
				this.valueBottom = [];
				this.dataIndexBottom = [];
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
					// console.log(params, '||params');
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
//							console.log(err);
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
//							console.log(err);
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
				var idArray = '';
				var nameArray = '';
				var that = this;
				if(this.clickType=="top"){
					this.dataIndexTop.forEach((val, index) => {
						idArray += that.dataTop[val].storeId + ",";
						nameArray += that.dataTop[val].storeName + ",";
					})
					idArray = idArray.substr(0, idArray.length - 1);
					nameArray = nameArray.substr(0, nameArray.length - 1);
					this.storeArr = nameArray;
					this.storeArrId = idArray;
				}else{
					this.dataIndexBottom.forEach((val, index) => {
						idArray += that.dataBottom[val].storeId + ",";
						nameArray += that.dataBottom[val].storeName + ",";
					})
					idArray = idArray.substr(0, idArray.length - 1);
					nameArray = nameArray.substr(0, nameArray.length - 1);
					this.storeArrBottom = nameArray;
					this.storeArrIdBottom = idArray;
				}
				this.handleTabDialog = false;
				
			},
			// 监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				that.dataIndexTop = [];
				that.dataIndexBottom = [];
				val.forEach((value, index) => {
					if(that.clickType=="top"){
						that.dataTop.forEach((val, ind) => {
							if(val.storeId == value) {
								that.dataIndexTop.push(ind);
							}
						})
					}else{
						that.dataBottom.forEach((val, ind) => {
							if(val.storeId == value) {
								that.dataIndexBottom.push(ind);
							}
						})
					}
				})
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
						//		        		console.log(JSON.stringify(data)+"返回值")
						this.dataTop = [];
						this.dataBottom = [];
						if(data != "") {
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
									this.dataTop.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
									this.dataBottom.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.dataTop.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
									this.dataBottom.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.dataTop.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
									this.dataBottom.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
						}
					})
					.catch((err) => {
						// console.log(err)
					})
				$("#transfer").show();
			},
			loadingData(params){
//				console.log(JSON.stringify(params))
				this.echartLoading=true;
				selectChinaMemberData(params)//900
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data)+'900');
						if(data.messageType=='SUCCESS'){
							//地图信息
							this.optionChina.series[0].data=data.messageContent.country;
							this.loadingFn(this.optionChina);
							//各省会员数量排名
							if(data.messageContent.province.labelData.length>0){
								this.optionaa.yAxis[0].data=data.messageContent.province.labelData;
								this.optionaa.series[0].data=data.messageContent.province.recordData;
							}else{
								this.optionaa.yAxis[0].data=['暂无数据'];
								this.optionaa.series[0].data=[0];
							}
							this.$refs.optionaa.initEcharts(this.optionaa,'aa');
							//顶部进度条信息百度分
							this.memCount.width=data.messageContent.header.memCount.percentage;
							this.consumedCount.width=data.messageContent.header.consumedCount.percentage;
							this.unconsumedCount.width=data.messageContent.header.unconsumedCount.percentage;
							//顶部数量信息
							this.header.fansCount.value=data.messageContent.header.fansCount.value;
							this.header.memCount.value=data.messageContent.header.memCount.value;
							this.header.unconsumedCount.value=data.messageContent.header.unconsumedCount.value;
							this.header.consumedCount.value=data.messageContent.header.consumedCount.value;
							this.echartLoading=false;
						}else{
							this.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
				if(params.area){
					delete params.area
				}
				selectMemberAnalysisData(params)//688
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data)+'688');
						if(data.messageType=='SUCCESS'){
							//新老会员占比
							this.optionAA.legend.data=data.messageContent.newOld.labelData;
							this.optionAA.series[0].data=data.messageContent.newOld.recordData;
							this.$refs.optionAA.initEcharts(this.optionAA,'AA');
							//年龄分布
							this.optionBB.legend.data=data.messageContent.age.labelData;
							this.optionBB.series[0].data=data.messageContent.age.recordData;
							this.$refs.optionBB.initEcharts(this.optionBB,'BB');
							//性别占比
							this.optionCC.legend.data=data.messageContent.sex.labelData;
							this.optionCC.series[0].data=data.messageContent.sex.recordData;
							this.$refs.optionCC.initEcharts(this.optionCC,'CC');
							//会员等级占比
							this.optionDD.legend.data=data.messageContent.level.labelData;
							this.optionDD.series[0].data=data.messageContent.level.recordData;
							this.$refs.optionDD.initEcharts(this.optionDD,'DD');
							//入会时长
							if(data.messageContent.day.labelData.length>0){
								this.optionEE.yAxis[0].data=data.messageContent.day.labelData;
								this.optionEE.series[0].data=data.messageContent.day.recordData;
							}else{
								this.optionEE.yAxis[0].data=['暂无数据'];
								this.optionEE.series[0].data=[0];
							}
							this.$refs.optionEE.initEcharts(this.optionEE,'EE');
							//会员活跃占比
							this.optionFF.legend.data=data.messageContent.active.labelData;
							this.optionFF.series[0].data=data.messageContent.active.recordData;
							this.$refs.optionFF.initEcharts(this.optionFF,'FF');
							//会员注册渠道占比
							this.optionGG.legend.data=data.messageContent.source.labelData;
							this.optionGG.series[0].data=data.messageContent.source.recordData;
							this.$refs.optionGG.initEcharts(this.optionGG,'GG');
							this.echartLoading=false;
						}else{
							this.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
			},
			loadingData1(params){
				this.echartLoading1=true;
//				console.log(JSON.stringify(params))
				selectMemberAnalysisData1(params)//689
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType=='SUCCESS'){
//							console.log(JSON.stringify(data)+'689');
							//消费次数
							if(data.messageContent.buyTime.labelData.length>0){
								this.optionHH.yAxis[0].data=data.messageContent.buyTime.labelData;
								var maxValue=0;
								this.optionHH.yAxis[1].data=[];
								this.optionHH.series[1].data=[];
								this.optionHH.series[0].data=[];
								data.messageContent.buyTime.recordData.forEach((val,index)=>{
									this.optionHH.yAxis[1].data.push(val.value);
									if(maxValue<val.value){
										maxValue=val.value;
									}
									this.optionHH.series[1].data.push(val.value);
								})
								data.messageContent.buyTime.recordData.forEach((val,index)=>{
									var value='1';
									maxValue=maxValue+'';
									for(var i=0;i<maxValue.length;i++){
										value+='0';
									}
									this.optionHH.series[0].data.push(value);
								})
							}else{
								this.optionHH.yAxis[0].data=['暂无数据'];
								this.optionHH.series[0].data=[0];
							}
							this.$refs.optionHH.initEcharts(this.optionHH,'HH');
							//消费时间
							if(data.messageContent.buyDate.labelData.length>0){
								this.optionII.yAxis[0].data=data.messageContent.buyDate.labelData;
								this.optionII.series[0].data=data.messageContent.buyDate.recordData;
							}else{
								this.optionII.yAxis[0].data=['暂无数据'];
								this.optionII.series[0].data=[0];
							}
							this.$refs.optionII.initEcharts(this.optionII,'II');
							//消费金额
							if(data.messageContent.buyAmount.labelData.length>0){
								this.optionKK.xAxis[0].data=data.messageContent.buyAmount.labelData;
								this.optionKK.series[0].data=data.messageContent.buyAmount.recordData;
							}else{
								this.optionKK.xAxis[0].data=['暂无数据'];
								this.optionKK.series[0].data=[0];
							}
							this.$refs.optionKK.initEcharts(this.optionKK,'KK');
							this.echartLoading1=false;
							
							//客单价
							this.optionMM.legend.data=data.messageContent.avgAmount1.labelData;
							this.optionMM.series[0].data=data.messageContent.avgAmount1.recordData;
							this.$refs.optionMM.initEcharts(this.optionMM,'MM');
							//件单价
							this.optionNN.legend.data=data.messageContent.avgAmount2.labelData;
							this.optionNN.series[0].data=data.messageContent.avgAmount2.recordData;
							this.$refs.optionNN.initEcharts(this.optionNN,'NN');
							//折扣率
							this.optionOO.legend.data=data.messageContent.avgAmount3.labelData;
							this.optionOO.series[0].data=data.messageContent.avgAmount3.recordData;
							this.$refs.optionOO.initEcharts(this.optionOO,'OO');
							//连带率占比
							this.optionPP.legend.data=data.messageContent.avgAmount4.labelData;
							this.optionPP.series[0].data=data.messageContent.avgAmount4.recordData;
							this.$refs.optionPP.initEcharts(this.optionPP,'PP');
						}else{
							this.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
//						 console.log(err)
					})
			}
		},
		created() {
			this.$nextTick(function() {
				let params = {
					userId:this.userInfo.userCode,
					area:'按会员地区'
				}
				this.loadingData(params);
				this.loadingData1(params);
			})
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
.circle-box{
	width: 60px;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	background: #2ec7c9;
	transition: all ease 0.3s;
	.iconfont{
		font-size: 25px;
		color:#fff;
		transition: all ease 0.3s;
	}
	
}
	@import "src/styles/_function.scss";
	.group-echart {
		display: inline-block;
		width: 100%;
		height: 220px;
		text-align: center;
		overflow: hidden;
	}
	
	.dashboard-editor-container {
		padding: 16px;
		background-color: #f0f0f0;
	}
	
	.dashboard-editor-container .chart-wrapper {
		background: #fff;
		padding: 16px 16px 0;
		margin-bottom: 16px;
		border-radius: 8px;
	}
	
	.group-echart-top {
		height: 380px
	}
	.el-form {
		width: 100%;
		display: inline-block;
		padding: 0;
		height: 32px;
		.el-form-item {
			margin-right: 6px;
		}
	}
	.width280{
		width: 280px;
	}
	.panel-group {
		margin-top: 0px;
		.card-panel-col {
			margin-bottom: 16px;
		}
		.card-panel {
			
			border-radius: 8px;
			height: 85px;
			cursor: pointer;
			font-size: 12px;
			position: relative;
			overflow: hidden;
			color: #666;
			background: #fff;
			box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
			border-color: rgba(0, 0, 0, .05);
			&:hover {
				.card-panel-icon-wrapper {
					.circle-box{
						background-color: #fff;
						transition: all ease 0.3s;
					}
					transition: all ease 0.3s;
				}
				.people-box {
					background: #2ec7c9;
					.icon-money-symbol{
						color:#2ec7c9;
					}
				}
				.message-box {
					background: #b6a2d4;
					.icon-money-symbol{
						color:#b6a2d4;
					}
				}
				.money-box {
					background: #5ab1ef;
					.icon-money-symbol{
						color:#5ab1ef;
					}
				}
				.shoppingCard-box {
					background: #ffb980;
					.icon-money-symbol{
						color:#ffb980;
					}
				}
			}
			.people-box {
				.circle-box{
					background: #2ec7c9;
				}
			}
			.message-box {
				.circle-box{
				background: #b6a2d4;
			}
			}
			.money-box {
				.circle-box{
					background: #5ab1ef;
				}
			}
			.shoppingCard-box {
					.circle-box{
					background: #ffb980;
				}
			}
			.card-panel-icon-wrapper {
				width:85px;
				float: left;
				margin: 0;
				padding: 5px;
				--border-radius: 6px;
				height:100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.card-panel-icon-wrapper #icon-salejine {
				transition: all 0.38s ease-out;
			}
			.card-panel-icon {
				float: left;
				font-size: 75px;
			}
			.card-panel-description {
				float: left;
				font-weight: bold;
				margin-top: 25px;
				margin-left: 10px;
				margin-right: 3px;
				.card-panel-text {
					width: 55px;
					float: left;
					line-height: 18px;
					color: rgba(0, 0, 0, 0.45);
					font-size: 10px;
					margin-bottom: 5px;
				}
				.card-panel-num {
					margin-top: 5px;
					font-size: 20px;
					float: right;
				}
				.card-panel-progress {
					margin-top: 40px;
					width: 135px;
					height: 8px;
					z-index:99;
					--background: yellow;
					position: relative;
					.card-panel-progress-bg {
						position: absolute;
						z-index: 1001;
						float: left;
						width: 100%;
						height: 6px;
						margin: 0;
						background: #ebebeb;
						border-left: 1px solid transparent;
						border-right: 1px solid transparent;
						border-radius: 10px;
						overflow: hidden;
						.card-panel-progress-pro {
							position: absolute;
							z-index: 1002;
							float: left;
							margin: 0 -1px;
							height: 6px;
							text-align: right;
							background: #cccccc;
							border-radius: 10px;
						}
						.card-panel-progress-b {
							background: #b6a2d4;
						}
						.card-panel-progress-c {
							background: #5ab1ef;
						}
						.card-panel-progress-d {
							background: #ffb980;
						}
					}
				}
			}
		}
	}
	.panel-group-select .card-panel-col{
		padding: 0 2px 0 2px!important;
	}
	
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.chart-contanier{
		position: relative;
		.el-form{
			position: absolute;
			width:500px;
			z-index: 90;
			.el-form-item{
				width:410px
			}
			.el-select{
				width:140px
			}
		}
		#chinaInfo{
			z-index: 80;
		}
	}
</style>