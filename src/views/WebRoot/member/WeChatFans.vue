<!-- 会员信息   微信粉丝 -->
<template>
	<el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="关注统计" name="first">
				<el-card>
					<table class="width100" border="0" cellspacing="0" v-loading="tableLoading">
						<thead>
							<tr>
								<th colspan="4">昨日关键指标</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>新增关注（人）</td>
								<td>取消关注（人）</td>
								<td>累计关注（人）</td>
								<td>粉丝转换率</td>
							</tr>
							<tr>
								<td>{{target[0].num}}</td>
								<td>{{target[1].num}}</td>
								<td>{{target[2].num}}</td>
								<td>{{target[3].num}}</td>
							</tr>
							<tr>
								<td><span>日</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[0].day=='负'"></i><i class="el-icon-minus" v-else-if="target[0].day=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[0].day=='正'"></i></span><span>{{target[0].dayNum}}</span></td>
								<td><span>日</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[1].day=='负'"></i><i class="el-icon-minus" v-else-if="target[1].day=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[1].day=='正'"></i></span><span>{{target[1].dayNum}}</span></td>
								<td><span>日</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[2].day=='负'"></i><i class="el-icon-minus" v-else-if="target[2].day=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[2].day=='正'"></i></span><span>{{target[2].dayNum}}</span></td>
								<td><span>日</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[3].day=='负'"></i><i class="el-icon-minus" v-else-if="target[3].day=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[3].day=='正'"></i></span><span>{{target[3].dayNum}}</span></td>
							</tr>
							<tr>
								<td><span>周</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[0].week=='负'"></i><i class="el-icon-minus" v-else-if="target[0].week=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[0].week=='正'"></i></span><span>{{target[0].weekNum}}</span></td>
								<td><span>周</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[1].week=='负'"></i><i class="el-icon-minus" v-else-if="target[1].week=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[1].week=='正'"></i></span><span>{{target[1].weekNum}}</span></td>
								<td><span>周</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[2].week=='负'"></i><i class="el-icon-minus" v-else-if="target[2].week=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[2].week=='正'"></i></span><span>{{target[2].weekNum}}</span></td>
								<td><span>周</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[3].week=='负'"></i><i class="el-icon-minus" v-else-if="target[3].week=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[3].week=='正'"></i></span><span>{{target[3].weekNum}}</span></td>
							</tr>
							<tr>
								<td><span>月</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[0].mouth=='负'"></i><i class="el-icon-minus" v-else-if="target[0].mouth=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[0].mouth=='正'"></i></span><span>{{target[0].mouthNum}}</span></td>
								<td><span>月</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[1].mouth=='负'"></i><i class="el-icon-minus" v-else-if="target[1].mouth=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[1].mouth=='正'"></i></span><span>{{target[1].mouthNum}}</span></td>
								<td><span>月</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[2].mouth=='负'"></i><i class="el-icon-minus" v-else-if="target[2].mouth=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[2].mouth=='正'"></i></span><span>{{target[2].mouthNum}}</span></td>
								<td><span>月</span><span class="sortIcon"><i class="el-icon-arrow-down" v-if="target[3].mouth=='负'"></i><i class="el-icon-minus" v-else-if="target[3].mouth=='0'"></i><i class="el-icon-arrow-up" v-else-if="target[3].mouth=='正'"></i></span><span>{{target[3].mouthNum}}</span></td>
							</tr>
						</tbody>
					</table>
					<el-tabs v-model="attentionType" id="tabPane" @tab-click="attentionChange" class="attentionType">
						<el-tab-pane label="新增关注" name="新增关注" class="tabPane"></el-tab-pane>
						<el-tab-pane label="取消关注" name="取消关注" class="tabPane"></el-tab-pane>
						<el-tab-pane label="累计关注" name="累计关注" class="tabPane"></el-tab-pane>
					</el-tabs>
					<div class="echart-box">
						<el-form :inline="true" :model="echartForm"  label-width="40px" class="demo-form">
							<el-form-item label="最近" v-show="!isContrastShow">
								<el-select v-model="echartForm.day" placeholder="请选择" class="width98" @change="contrastShow">
									<el-option v-for="item in echartDay" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="" v-show="!isContrastShow" id="date-inline">
								<el-date-picker
									v-model="datechartFollowDate"
									type="daterange"
									@change="handleFollowDateChange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="" v-show="!isContrastShow">
								<el-select v-model="echartForm.entryPlatform" placeholder="请选择" class="width130" @change="contrastShow">
									<el-option v-for="item in echartEntryPlatform" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="" v-show="isContrastShow" id="date-inline">
								<el-date-picker
									v-model="datechartFollowDate"
									type="daterange"
									@change="handleFollowDateChange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="yyyy-MM-dd">
								</el-date-picker>
								对比
								<el-date-picker
									v-model="datechartFollowContrastDate"
									type="daterange"
									@change="handleFollowContrastDateChange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="yyyy-MM-dd">
								</el-date-picker>
									<!-- <el-date-picker
									v-model="echartForm.followContrastDateBegin"
									type="date"
									placeholder="选择日期"
									@change="handleFollowContrastDateBegin"
									value-format="yyyy-MM-dd">
								</el-date-picker> -->
								<!-- 对比
								<el-date-picker
									v-model="echartForm.followContrastDateEnd"
									type="date"
									placeholder="选择日期"
									
									value-format="yyyy-MM-dd">
								</el-date-picker> -->
							</el-form-item>
							<el-form-item label="" class="textCenter">
								<el-button type="primary" class="floatRight" @click="handleContrast">{{isContrastShow ? '取消' : '按时间对比'}}</el-button>
								<el-button type="primary" class="resetBtn" @click="handleReset">重置</el-button>
							</el-form-item>
						</el-form>
						<div class="group-echart" v-loading="echartLoading">
							<groupEchart childId="aa" :childOption="optionA" class="group-echart" v-if="!echartLoading"></groupEchart>
						</div>
					</div>
					<el-form :inline="true" :model="formFoll" class="demo-form-inline dean-follow">
						<el-form-item>
							<el-date-picker
						      	v-model="followDate"
						      	value-format="yyyy-MM-dd"
						     	type="daterange"
						     	@change="followDateChange"
							    range-separator="至"
							    start-placeholder="开始日期"
							    end-placeholder="结束日期">
						    </el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="exportFn" :disabled="exportDis">下载表格</el-button>
						</el-form-item>
					</el-form>
					<el-table :data="tableData" class="tableSort" @sort-change="tableSortChange" :default-sort = "{prop: 'date', order: 'descending'}"  v-loading="tableLoading" >
					    <el-table-column prop="sum0" label="时间" sortable="custom" width="180"></el-table-column>
					    <el-table-column prop="sum1" label="新关注人数" sortable="custom"></el-table-column>
					    <el-table-column prop="sum2" label="取消关注人数" sortable="custom"></el-table-column>
					    <el-table-column prop="sum3" label="净增关注人数" sortable="custom"></el-table-column>
					    <el-table-column prop="sum4" label="累积关注人数" sortable="custom"></el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="未领卡粉丝" name="second">
				<el-header>
					<el-card>
						<el-form :inline="true" :model="formInfo" class="demo-form-inline dean-form">
							<el-form-item class="floatLeft">
								<el-button type="primary" @click="groupMessage">群发信息</el-button>
								<el-button type="primary" @click="groupMessageInfo">已发送信息记录</el-button>
							</el-form-item>
							<div class="floatRight">
								<el-form-item>
									<el-input v-model="form.nickName" placeholder="请输入昵称" class="width130"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="onSubmitTab">查询</el-button>
								</el-form-item>
							</div>
						</el-form>
					</el-card>
				</el-header>
				<el-card>
					<el-table ref="tableDataTab" v-loading="this.tableLoading" :data="tableDataTab"  @selection-change="noMemberSelectionChange">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column type="selection" width="50" label="选择"></el-table-column>
						<el-table-column prop="nickName" label="昵称"></el-table-column>
						<el-table-column prop="source" label="来源"></el-table-column>
						<el-table-column prop="userUrl" label="头像">
							<template slot-scope="scope">
								<div class="pageImg"><img :src="scope.row.userUrl" /></div>
							</template>
						</el-table-column>
						<el-table-column prop="sex" label="性别"></el-table-column>
						<el-table-column prop="followDate" label="关注时间"></el-table-column>
						<el-table-column prop="addr" label="地区"></el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="countTab != 0">
						<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChangeTab" :page-size="limitTab" :total="countTab" @current-change="handleCurrentChangeTab">
						</el-pagination>
					</el-footer>
				</el-card>
			</el-tab-pane>
		</el-tabs>
	</el-container>
</template>
<script>
	import { selectWeChatFans,selectWeChatFansData,selectWeChatFansDataInfo,ImportWeChatFans,selectWeChatFansDataAnalyse,selectWeChatFansNoData} from '@/api/member/WeChatFans'
	// echarts组件
	import { groupEchart } from '@/views/WebRoot/member' 
	import { getBrandInfo} from '@/api/public'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		components: { groupEchart },
		data() {
			return {
				exportDis:false,
				formFoll:{},
				followDate:[],
//				brandName:'',
				target:[{
					num:'',
					day:true,
					week:false,
					mouth:false,
					dayNum:"",
					weekNum:"",
					mouthNum:""
				},{
					num:'',
					day:false,
					week:false,
					mouth:true,
					dayNum:"",
					weekNum:"",
					mouthNum:""
				},{
					num:'',
					day:false,
					week:true,
					mouth:false,
					dayNum:"",
					weekNum:"",
					mouthNum:""
				},{
					num:'',
					day:true,
					week:false,
					mouth:false,
					dayNum:"",
					weekNum:"",
					mouthNum:""
				}],
	        	formAudio:{
		        	reasonForRejection:'',//驳回理由
	        	},
        		handleStoreDialog:false,//驳回弹窗
	        	activeName: 'first',
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					nickName : '' 
				},
				formInfo: {
					selectDate: []
				},
				followDateBegin:'',
				followDateEnd:'',
				desc:'',//排序类型 desc/asc  降/顺
				dir:'',//排序条件
				// 表格数据
				tableData: [],
				brandData:[],
	            // 表格数据
	            tableDataTab: [],
				// 表格多选
				multipleSelection: [],
            	multipleSelectionTab: [],
				// 表格是否为加载状态
				tableLoading: false,
				rules: {
	                reasonForRejection: [
	                    { required: true, message: '请输入驳回理由', trigger: 'change' },
	                    { max: 100, message: '最小长度为20', trigger: 'change' }       
	                ]
	            },
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
	            // 审核分页
	            pageTab: 0, // 当前页
	            countTab: 0, // 总条数
				limitTab: this.GLOBAL.limit, // 条/页
				noMemberMultipleSelection:[],

				tabIndex: 0,
				echartLoading: false,
				attentionType:"",
				isContrastShow: false,
				datechartFollowDate: [],
				datechartFollowContrastDate: [],
				// 相差天数
				DateDiff: '',
				DateDiff1: '',
				echartForm: {
					day: '7',
					followDateBegin: '',
					followDateEnd: '',
					entryPlatform: '',
					followContrastDateBegin: '',
					followContrastDateEnd: ''
				},
				echartDay: [
					{ value: '7', label: '7天'},
					{ value: '15', label: '15天'},
					{ value: '30', label: '30天'},
					{ value: '60', label: '60天'},
					{ value: '90', label: '90天'},
				],
				echartEntryPlatform: [
					{ value: '全部来源', label: '全部来源'},
					{ value: '主动搜索', label: '主动搜索'},
					{ value: '邀请入会', label: '邀请入会'},
					{ value: '券关注', label: '券关注'},
					{ value: '扫码领取', label: '扫码领取'},
				],
				optionA: {
					title: {
						left: 'center',
						text: '会员趋势图(日)',
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						data: []
					},
					yAxis: {
						type: 'value'
					},
					series: []
				}, 
			}
		},
		methods: {
			noMemberSelectionChange(val){
				this.noMemberMultipleSelection = val;
			},
			//重置
			handleReset(){
				this.echartForm = {
					day: '',
					followDateBegin: '',
					followDateEnd: '',
					entryPlatform: '',
					followContrastDateBegin: '',
					followContrastDateEnd: ''
				};
				this.datechartFollowDate=[];
				this.contrastShow();
			},
			//群发消息记录
			groupMessageInfo(){
				if(this.tableDataTab.length==0){
					this.$message.warning('当前没有未领卡粉丝！');
					return false;
				}
				if(this.noMemberMultipleSelection.length>0){
					let idList='';
					this.noMemberMultipleSelection.forEach((val,index)=>{
						idList+=val.id+',';
					})
					idList=idList.substr(0,idList.length-1);
//					console.log(idList)
					this.$router.push({
						name: '群发信息',
						params:{
							clickType:"群发消息记录",
							type:'未入会粉丝',
							pageData:JSON.stringify({
								idList:idList
							}),
						}
					});
				}else{
					this.$router.push({
						name: '群发信息',
						params:{
							clickType:"群发消息记录",
							type:'未入会粉丝',
							pageData:JSON.stringify(this.form),
						}
					});
				}
			},
			//群发消息
			groupMessage(){
				if(this.tableDataTab.length==0){
					this.$message.warning('当前没有未领卡粉丝！');
					return false;
				}
				if(this.noMemberMultipleSelection.length>0){
					let idList='';
					this.noMemberMultipleSelection.forEach((val,index)=>{
						idList+=val.id+',';
					})
					idList=idList.substr(0,idList.length-1);
//					console.log(idList)
					this.$router.push({
						name: '群发信息',
						params:{
							type:'未入会粉丝',
							pageData:JSON.stringify({
								idList:idList
							}),
						}
					});
				}else{
					this.$router.push({
						name: '群发信息',
						params:{
							type:'未入会粉丝',
							pageData:JSON.stringify(this.form),
						}
					});
				}
			},
	        onSubmitTab(){
    			this.showTableNoInfo('',this.limitTab);
	        },
			//新增关注/取消关注/累计关注
			attentionChange(str){
				this.tabIndex = str.index;
				this.contrastShow();
			},
	    	//tab切换关注统计/未领卡粉丝
	    	handleClick(tab, event) {
	    		if(event.explicitOriginalTarget.nodeValue=="未领卡粉丝"){
	    			this.showTableNoInfo(this.pageTab,this.limitTab);
	    		}
	    	},
			//昨日关键指标
			keyIndicatorsYesterday() {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode
				}
				// 查询接口
				selectWeChatFans(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(JSON.stringify(data));
						let result = [];
						if(data.messageType=="SUCCESS"){
							let num='';
							let num1='';
							let num2='';
							data.messageContent.forEach((val,index)=>{
								num = val.sum1.substr(1,val.sum1.length);
								num1 = val.sum2.substr(1,val.sum2.length);
								num2 = val.sum3.substr(1,val.sum3.length);
								that.target[index]={
									day:val.sum1.indexOf("-")<0?val.sum1!="0%"?'负':'0':'正',
									week:val.sum2.indexOf("-")<0?val.sum2!="0%"?'负':'0':'正',
									mouth:val.sum3.indexOf("-")<0?val.sum3!="0%"?'负':'0':'正',
									dayNum:val.sum1.indexOf("-")<0?val.sum1:num,
									weekNum:val.sum2.indexOf("-")<0?val.sum2:num1,
									mouthNum:val.sum3.indexOf("-")<0?val.sum3:num2
								}
							})
							that.target[0].num=data.messageContent[0].total1;
							that.target[1].num=data.messageContent[1].total2;
							that.target[2].num=data.messageContent[2].total3;
							that.target[3].num=data.messageContent[3].total4;
//							console.log(JSON.stringify(that.target))
							that.attentionType="新增关注";
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			//导出
			exportFn(){
				this.exportDis=true;
				var param = {
					"userId": this.userInfo.userCode,
					"dir":this.dir,
					"desc":this.desc,
					"followDateBegin":this.followDateBegin,
					"followDateEnd":this.followDateEnd,
					"page": this.page,
					"limit": this.limit
				}
				ImportWeChatFans(param)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
//							console.log(JSON.stringify(data) + "导出返回值");
							this.exportDis=false;
							window.location.href = Cookie.get("baseUrl") + data.messageContent;
//							console.log(Cookie.get("baseUrl") + data.messageContent)
						} else {
							this.exportDis=false;
							this.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
						this.exportDis=false;
//						 console.log(err);
					});
			},
			//时间查询
			followDateChange(val){
				this.followDateBegin=val[0];
				this.followDateEnd=val[1];
				this.showTableInfo();
			},
			//关注信息分页设置
			handleSizeChange(val){
				this.limit = val;
				this.showTableInfo(this.page, this.limit);
			},
			//未领卡分页设置
			handleSizeChangeTab(val){
				this.limitTab = val;
				this.showTableNoInfo(this.pageTab, this.limitTab);
			},
			//关注信息分页查询
			handleCurrentChange(val){
				this.page = val;
				this.showTableInfo(val, this.limit);
			},
			//未领卡分页查询
			handleCurrentChangeTab(val){
				this.pageTab = val;
				this.showTableNoInfo(val, this.limitTab);
			},
			//排序
			tableSortChange(data){
				this.desc=data.order=='ascending'?'ASC':'DESC';
				this.dir=data.prop;
				this.showTableInfo(this.page,this.limit);
			},
			//请求表格数据
			showTableInfo(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"dir":this.dir,
					"desc":this.desc,
					"followDateBegin":this.followDateBegin,
					"followDateEnd":this.followDateEnd,
					"page": start,
					"limit": limit
				}
//				console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectWeChatFansDataInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						}else if(data.messageType!="SUCCESS"){
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
			//请求表格数据
			showTableNoInfo(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"nickName":this.form.nickName
				}
//				console.log(params)
				// 使表格加载
				that.tableLoading = true;
				// 查询接口
				selectWeChatFansNoData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.countTab = data.count;
							that.tableDataTab = result;
						}else if(data.messageType!="SUCCESS"){
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
			//修改详情
			iconInfo(index ,row){
            	var data = JSON.stringify(row);
				this.$router.push({
					name: '会员资料修改-会员信息调整',
					params: {
						pageType: '修改',
                    	formData: data
					}
				});
			},

			/* 图表 ****************************** */
			// /计算天数差的函数，通用  
			handleDateDiff(sDate){    //sDate1和sDate2是2002-12-18格式  
				if(!sDate || sDate.length == 0) {
					return 0;
				}else {
					let oDate1,  oDate2,  iDays; 
					oDate1  =  new  Date(sDate[0])    //转换为12-18-2002格式  
					oDate2  =  new  Date(sDate[1])  
					iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
					return  iDays
				}
			},
			// 开始结束时间
			handleFollowDateChange(res) {
//				console.log(res)
				if(!res) {
					this.datechartFollowDate = [];
					this.echartForm.followDateBegin = '';
					this.echartForm.followDateEnd = '';
				}else {
					this.echartForm.followDateBegin = res[0];
					this.echartForm.followDateEnd = res[1];

					this.datechartFollowContrastDate = [];
					this.echartForm.followContrastDateBegin = '';
					this.echartForm.followContrastDateEnd = '';
					this.DateDiff = this.handleDateDiff(res);
				}
				this.contrastShow();
			},
			// 开始结束时间
			handleFollowContrastDateChange(res) {
				if(!res) {
					this.datechartFollowContrastDate = [];
					this.echartForm.followContrastDateBegin = '';
					this.echartForm.followContrastDateEnd = '';
				}else {
					this.DateDiff1 = this.handleDateDiff(res);
					if(this.datechartFollowDate.length == 0) {
						this.$message.warning('请选选参考时间段');
						this.datechartFollowContrastDate = [];
						this.echartForm.followContrastDateBegin = '';
						this.echartForm.followContrastDateEnd = '';
						return false;
					}else if(this.DateDiff1 != this.DateDiff) {
						this.$message.warning(`请选择${this.DateDiff}天对比时间段, 当前选择天数${this.DateDiff1}`);
						this.datechartFollowContrastDate = [];
						this.echartForm.followContrastDateBegin = '';
						this.echartForm.followContrastDateEnd = '';
						return false;
					}else {
						this.echartForm.followContrastDateBegin = res[0];
						this.echartForm.followContrastDateEnd = res[1];
					}
				}
				this.contrastShow();
			},
			handleFollowContrastDateBegin(res) {
				if(!res) {
					this.echartForm.followContrastDateBegin = '';
				}else {
					this.echartForm.followContrastDateBegin = res;
				}
				this.contrastShow();
			},
			handleFollowContrastDateEnd(res) {
				if(!res) {
					this.echartForm.followContrastDateEnd = '';
				}else {
					this.echartForm.followContrastDateEnd = res;
				}
				this.contrastShow();
			},
			// 按时间对比
			handleContrast() {
				this.isContrastShow = !this.isContrastShow;
				if(this.isContrastShow) {
					this.datechartFollowDate = [];
					this.echartForm.day = '';
					this.echartForm.followDateBegin = '';
					this.echartForm.followDateEnd = '';
					this.echartForm.entryPlatform = '';
				}else {
					this.datechartFollowDate = [];
					this.echartForm.followDateBegin = '';
					this.echartForm.followDateEnd = '';

					this.datechartFollowContrastDate = [];
					this.echartForm.followContrastDateBegin = '';
					this.echartForm.followContrastDateEnd = '';
				}
			},
			contrastShow() {
				this.echartLoading = true;
				let echartsParams = {
					"userId": this.userInfo.userCode, // 当前登录用户账号
					"tip": this.tabIndex, // "0/1/2"("新增关注"/"取消关注"/"累计关注")
					"entryPlatform": this.echartForm.entryPlatform == '全部来源' ? '' : this.echartForm.entryPlatform, // 来源("全部来源"传'',主动搜索,邀请入会,券关注,扫码领取)
					"day": this.echartForm.day, // 最近N天(传数字)
					"followDateBegin": this.echartForm.followDateBegin, // 开始时间
					"followDateEnd": this.echartForm.followDateEnd, // 结束时间
					"followContrastDateBegin": this.echartForm.followContrastDateBegin, // 对比的开始时间
					"followContrastDateEnd": this.echartForm.followContrastDateEnd // 对比的结束时间
				}
				selectWeChatFansData(echartsParams)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							let yDate = msg.yAxis[0].yData;
							let yContrast = msg.yAxis[0].yContrast;
							let carchYDate = [];
							let carchYContrast = [];
							carchYDate.push({
								data: yDate,
								type: 'line',
								name: this.tabIndex == 0 ? '新增关注人数' : this.tabIndex == 1 ? '取消关注人数' : '累计关注人数'
							});
							carchYContrast.push({
								data: yContrast,
								type: 'line',
								name: this.tabIndex == 0 ? '新增关注人数[对比]' : this.tabIndex == 1 ? '取消关注人数[对比]' : '累计关注人数[对比]'
							});
							this.optionA.xAxis.data = msg.xAxis;
							this.optionA.series = [
								...carchYDate,
								...carchYContrast
							];
							// console.log(this.optionA.series)
							this.echartLoading = false;
						}
					}) 
			},
			
		},
		created() {
			this.contrastShow();
			let that =this;
//			let params={
//				userId:this.userInfo.userCode
//			}
//			getBrandInfo(params)
//				.then(function(res) {
//					let data = JSON.parse(Base64.decode(res.data));
//					that.brandName=data.messageContent.brandName;
//				})
//				.catch(function(err) {
////					console.log(err)
//				});
			this.$nextTick(function(){
				this.keyIndicatorsYesterday();
				this.showTableInfo(this.page,this.limit);
			})
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.attentionType{
		width:100%;
		margin-top: 20px;
	}
	.dean-form .el-form-item{
		margin: 0;
	}
	.el-button{
		margin-top:0;
	}
	.sortIcon{
		width: 30px;
		display: inline-block;
	}
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
		}
	}
	.tabPane{
		// border:1px solid #ebebeb;
		// border-top: none;
		// padding: 10px 20px;
	}
	table {
		border-top: 1px solid #ebebeb;
		border-left: 1px solid #ebebeb;
		thead {
			background: #f5f7fa;
		}
		th{
			height: 40px;
			border-bottom: 1px solid #ebebeb;
			border-right: 1px solid #ebebeb;
			text-align: left;
			padding-left: 20px;
			background-color: #1992ff;
			color: #fff;
		}
		td {
			width:25%;
			height: 40px;
			border-bottom: 1px solid #ebebeb;
			border-right: 1px solid #ebebeb;
			text-align: center;
		}
		.el-input {
			width: 60%;
		}
	}
	.dean-follow{
		display: block;
		margin-top:20px
	}

	.pageImg{
		width:40px;
		height:40px;
	}
	.pageImg img {
		width: 100%;
		height:100%
		
	}
	.group-echart {
		display: inline-block;
		width: 100%;
		height: 300px;
	}
	.echart-box {
		width:100%;
		// margin-top: 20px;
		border: 1px solid #ebebeb;
		border-top: none;
		padding: 10px 20px;
	}
	.width98{
		width: 98px;
	}
	.width130{
		width: 130px;
	}
	.resetBtn{
		float: right;
		margin-right:6px;
	}
	.tableSort{
		width: 90%;
		margin-top: 0px;
	}
	.textCenter{
		text-align: center;
	}
</style>