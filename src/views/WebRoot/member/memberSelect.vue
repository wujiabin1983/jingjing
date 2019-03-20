<!-- 会员信息   会员查询 -->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :model="form" ref="form" label-width="80px" class="demo-form">
					<el-form-item label="会员ID" class="height32">
						<el-input v-model="form.queryParams" placeholder="请输入手机号/会员卡/会员姓名"></el-input>
					</el-form-item>
					<el-form-item label="积分存量" class="height32">
						<el-input v-model="form.integralMin" placeholder="最小积分数" class="sectionBegin"></el-input>
						<el-input v-model="form.integralMax" placeholder="最大积分数" class="sectionEnd"></el-input>
					</el-form-item>
					<el-form-item label="所属门店" class="height32">
						<el-input :readonly="true" v-model="storeArr" class="dsh-input" placeholder="所属门店"></el-input>
						<el-button type="primary" @click="searchStorePop()" class="dsh-input-button">选择</el-button>
					</el-form-item>
					<el-form-item label="入会周期" id="date-inline" class="height32">
						<el-date-picker
					      v-model="registeDate"
					      type="daterange"
					      class="width100"
					      @change="registeDateChange"
					      range-separator="至"
					      value-format="yyyy-MM-dd"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</el-form-item>
					<el-form-item label="消费时间" id="date-inline" class="height32">
						<el-date-picker
					      v-model="orderDate"
					      type="daterange"
					      class="width100"
					      @change="orderDateChange"
					      value-format="yyyy-MM-dd"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</el-form-item>
					<el-form-item label="会员等级">
						<el-select v-model="memberLevel" multiple placeholder="请选择" @change="levalSelect" class="width100">
							<el-option v-for="item in levalInfo" :key="item.key" :label="item.key" :value="item.key">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="年龄范围">
						<el-input v-model="form.ageBegin" placeholder="最小年龄" class="sectionBegin"></el-input>
						<el-input v-model="form.ageEnd" placeholder="最大年龄" class="sectionEnd"></el-input>
					</el-form-item>
					<el-form-item label="消费次数">
						<el-input v-model="form.realpayCountMin" placeholder="最小次数" class="sectionBegin"></el-input>
						<el-input v-model="form.realpayCountMax" placeholder="最大次数" class="sectionEnd"></el-input>
					</el-form-item>
					<el-form-item label="消费金额">
						<el-input v-model="form.realpayAmountMin" placeholder="最小金额" class="sectionBegin"></el-input>
						<el-input v-model="form.realpayAmountMax" placeholder="最大金额" class="sectionEnd"></el-input>
					</el-form-item>
					<el-form-item class="select-btn-style width100">
						<el-button type="primary" @click="onSubmit">查询</el-button>
						<el-button type="primary" @click="onReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-card v-if="roleBtn.createMemberActivityInfo||roleBtn.sendGroupMessageInfo">	
			<el-button type="primary" @click="creatActivity" v-if="roleBtn.createMemberActivityInfo">创建营销活动</el-button>
			<el-button type="primary" @click="sendGroupMessage" v-if="roleBtn.sendGroupMessageInfo">群发消息</el-button>
		</el-card>
		<el-card>
			<span>{{totalSum}}</span>
			<el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<!-- <el-table-column type="selection" width="50" label="选择"></el-table-column> -->
				<el-table-column prop="userUrl" width="100px" label="头像">
					<template slot-scope="scope">
						<div class="pageImg"><img :src="scope.row.userUrl" /></div>
					</template>
				</el-table-column>
				<el-table-column prop="onLineCardNum" width="150px" label="会员卡号"></el-table-column>
				<el-table-column prop="mobile" width="150px" label="手机号码"></el-table-column>
				<el-table-column prop="userName" width="100px"label="姓名"></el-table-column>
				<el-table-column prop="sex" width="50px" label="性别"></el-table-column>
				<el-table-column prop="memberLevel" width="100px" label="等级"></el-table-column>
				<el-table-column prop="storeName" width="300px" label="服务门店"></el-table-column>
				<el-table-column prop="guideName" label="专属导购"></el-table-column>
				<el-table-column prop="memberLevel" label="标签">
					<template slot-scope="scope">
						<!--<el-button type="primary" @click="labelInfo(scope.$index, scope.row)">查看</el-button>-->
						<!-- 查看 -->
						<el-tooltip class="item" content="打标签" placement="top">
							<i class="iconfont icon-biaoqian" @click.prevent="labelInfo(scope.$index, scope.row)" ></i>
							<!-- <icon-svg icon-class="setLabel" id="icon-setLabel" @click.native.prevent="labelInfo(scope.$index, scope.row)" /> -->
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="action" label="操作">
					<!-- 功能图标 -->
					<template slot-scope="scope">
						<!-- 查看 -->
						<el-tooltip class="item" content="查看" placement="top">
							<i class="iconfont icon-view" @click.prevent="iconInfo(scope.$index, scope.row)" ></i>
							<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index, scope.row)" /> -->
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-footer v-if="count != 0">
				<el-pagination 
					background 
					class="pagination" 
					layout="total, sizes, prev, pager, next, jumper" 
					@size-change="handleSizeChange"
					:page-size="limit" :total="count" 
					@current-change="handleCurrentChange">
				</el-pagination>
			</el-footer>
		</el-card>
		<!--门店区域店组-->
		<el-dialog title="" :visible.sync="handleTabDialog" class="transfer">
			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="门店" name="first">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="店组" name="second">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="区域" name="third">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
				</el-tabs>
			</template>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleTabDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="" :visible.sync="dialogVisible" v-loading="this.labelLoading" width="50%">
			<span class="title">已选标签</span>
			<div class="elInput" v-if="labelGroupSelect.length>0">
				<el-tag
				    v-for="tag in labelGroupSelect"
				    :key="tag.labelValue"
				    closable
				    @close="handleClose(tag.labelValue)"
				    :type="tag.type">
				    {{tag.labelValue}}
				</el-tag>
			</div>
			<span v-else class="noLabel">暂无标签</span>
			<span class="title">新增标签</span>
			<el-form :model="labelForm" :rules="rules" ref="labelForm" v-loading="tableLoading" label-width="100px" class="demo-ruleForm">
				<el-form-item label="标签名称">
					<el-select v-model="labelForm.labelName" placeholder="请选择" @change="lableSelect" class="width200">
						<el-option v-for="item in labelName" :key="item.labelName" :label="item.labelName" :value="item.index">
						</el-option>
					</el-select>
				</el-form-item>
				<div class="labelGroup">
					<span v-for="tag in labelGroup" :value="tag.labelName" :name="tag.labelValue" :code="tag.labelCode" @click="labelClick">
						<el-tag>{{tag.labelValue}}</el-tag>
					</span>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="setLabelEnter" v-if="roleBtn.updatemembershipLabelInfo">确 定</el-button>
		  	</span>
		</el-dialog>
	</el-container>
</template>
<script>
	import { selectMember395 } from '@/api/member/memberSelectInfo'
	import { selectMemberSelect ,maticMarking} from '@/api/member/memberSelect'
	import { selectLevalInfo, selectProCityArea, selectTabData ,selectLabelData} from '@/api/public'
	import { mapGetters } from 'vuex'
	import logo from '@/assets/images/000247589.jpg'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				logo:logo,
				// 权限
				roleBtn: {
					createMemberActivityInfo:false,
					sendGroupMessageInfo:false,
					updatemembershipLabelInfo:false
				},
				userCode:'',
				labelLoading:false,
				labelForm:{
					labelName:'',
					labelValue:''
				},
				//已选标签
				labelGroupSelect:[],
				//新增的标签
				labelGroup:[],
				//标签下拉
				labelName:[],
				orderDate:[],//消费时间
				registeDate:[],//入会周期
				dialogVisible:false,
				totalSum: '共0人', //总人数
				levalInfo: [], //会员等级
				storeArr: '',
				value1: '',
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [],
				handleTabDialog: false,
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				activeName: 'first',
				tabType: '门店',
				memberLevel:[],
				// 搜索数据
				form: {
					"queryParams": "", //会员ID
					"storeId": "", //所属门店
					"flag":"",
					"memberLevel":"", //会员等级
					"ageBegin": "", //年龄范围(起)
					"ageEnd": "", //年龄范围(至)
					"integralMin": "", //积分存量(起)
					"integralMax": "", //积分存量(至)
					"registeDateBegin": "", //入会周期(起)
					"registeDateEnd": "", //入会周期(至)
					"orderDateBegin": "", //消费时间(起)
					"orderDateEnd": "", //消费时间(至)
					"realpayCountMin": "", //消费次数(起)
					"realpayCountMax": "", //消费次数(至)
					"realpayAmountMin": "", //消费金额(起)
					"realpayAmountMax": "" //消费金额(至)
				},
				// 表格数据
				tableData: [],
//				{
//					"id": "记录ID", //隐藏
//					"version": "记录版本", //隐藏
//					"userCode": "会员编号", //隐藏
//					"onLineCard": "会员卡号",
//					"userUrl": "http://img.zcool.cn/community/018299554245910000019ae998f74d.jpg",
//					"userName": "姓名",
//					"mobile": "电话",
//					"sex": "性别",
//					"memberLevel": "等级",
//					"storeName": "服务门店",
//					"guideName": "专属导购"
//				}
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				rules: {
					labelValue: [{
							required: true,
							message: '请选择标签',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最小长度为20',
							trigger: 'change'
						}
					]
				},
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
			//选择标签
			labelClick(val){
				if(!val.target.parentNode.attributes[1].value){
					return false;
				}
				let labelName=val.target.parentNode.attributes[1].value;
				let labelValue=val.target.parentNode.attributes[2].value;
				let labelCode=val.target.parentNode.attributes[3].value;
//				console.log(labelId)
//				console.log(labelName)
//				console.log(labelCode)
				if(this.labelGroupSelect.length>0){
					let flag=0;
					this.labelGroupSelect.forEach((val,index)=>{
//						console.log(labelName+val.name);
						if(labelValue==val.labelValue){
							flag--;
						}else{
							flag++;
						}
					})
					if(flag==this.labelGroupSelect.length){
						this.labelGroupSelect.push({
							labelName:labelName,
							type:'info',
							labelCode:labelCode,
							labelValue:labelValue
						})
					}
				}else{
					this.labelGroupSelect.push({
						labelName:labelName,
						type:'info',
						labelCode:labelCode,
						labelValue:labelValue
					})
				}
				let array=[];
				this.labelGroup.forEach((val,index)=>{
					if(val.labelValue!=labelValue){
						array.push(val);
					}
				})
				this.labelGroup=array;
//				console.log(JSON.stringify(this.labelGroupSelect))
			},
			//标签删除
			handleClose(value){
				let array=[];
				let arrays=[];
				this.labelGroupSelect.forEach((val,index)=>{
					let flag=0;
					if(value!=val.labelValue){
						array.push(val);
					}else{
						this.labelGroup.forEach((data,ind)=>{
							if(val.labelValue==data.labelValue){
								flag--;
							}else{
								flag++;
							}
						})
						if(flag==this.labelGroup.length){
							this.labelGroup.push(val);
						}
					}
				})
				this.labelGroupSelect=array;
			},
			//表格标签查看
			labelInfo(index,row) {
//				console.log(JSON.stringify(row))
				let that = this;
				that.labelGroupSelect =[];
				that.labelGroup=[];
				that.labelForm.labelName='';
				let params = {
					userId: this.userInfo.userCode,
					memId:row.userCode,
					page:'',
					limit:''
				}
				that.userCode=row.userCode;
//				console.log(params)
				selectMember395(params) //已选择的标签
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(data);
						if(data.messageType=="SUCCESS"){
							data.messageContent.labelDetail.forEach((val,index)=>{
								let array=[];
								if(val.labelValue.indexOf(',')>0){
									array = val.labelValue.split(",");
								}else if(val.labelValue.indexOf('，')>0){
									array = val.labelValue.split("，");
								}else{
									array = val.labelValue.split(",");
								}
								array.forEach((value,ind)=>{
									that.labelGroupSelect.push({
										labelName:val.labelName,
										type:'info',
										labelCode:val.labelCode,
										labelValue:value
									})
								})
							})
//							console.log(JSON.stringify(that.labelGroupSelect))
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
//						that.labelGroupSelect = data.messageContent.labelDetail;
					})
					.catch(function(err) {
//						 console.log(err);
					});
 				this.dialogVisible = true;
			},
			//打标签确定按钮
			setLabelEnter(){
//				console.log(this.labelGroupSelect);
				let params={
					userId:this.userInfo.userCode,
					memId:this.userCode,
					labelList:this.labelGroupSelect
				};
				if(params.labelList.length==0){
					this.$message({
						message: "请选择标签",
						type: 'warning'
					});
					return false;
				}
				let that =this;
				this.labelLoading=true;
//				console.log(JSON.stringify(params))
				maticMarking(params) //打标签
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
						if(data.messageType == "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'success'
							});
							that.showTable(that.page, that.limit);
							that.dialogVisible = false
							that.labelLoading=false;
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
							that.labelLoading=false;
						}
//						console.log(data);
					})
					.catch(function(err) {
						that.labelLoading=false;
//						console.log(err);
					});
			},
			//消费时间监听
			orderDateChange(val){
				this.form.orderDateBegin=val[0];
				this.form.orderDateEnd=val[1];
			},
			levalSelect(val){
				this.form.memberLevel=val.join(",");
			},
			registeDateChange(val){
				this.form.registeDateBegin=val[0];
				this.form.registeDateEnd=val[1];
			},
			//弹窗标签下拉监听
			lableSelect(val) {
				this.labelForm.labelName = this.labelName[val].labelName;
//				this.form.levalId = this.levalInfo[val].value;
				let array=[];
				let str =this.labelName[val].value;
				if(str.indexOf(',')>0){
					array = str.split(",");
				}else if(str.indexOf('，')>0){
					array = str.split("，");
				}else{
					array = str.split(",");
				}
				this.labelGroup=[];
				array.forEach((data,index)=>{
					this.labelGroup.push({
						labelName:this.labelForm.labelName,
						labelCode:this.labelName[val].code,
						labelValue:data,
						type:'success'
					})
				})
			},
			//监听tab页
			handleClick(tab, event) {
				this.tabType = event.target.firstChild.data;
				this.data2 = [];
				this.value2 = [];
				this.dataIndex = [];
				this.searchStoreTab();
			},
			//点击所属门店弹窗显示
			searchStorePop() {
				this.handleTabDialog = true;
				this.searchStoreTab();
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.optionsProCityAreaPop=[];
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
			},
			//监听父级选项动态加载省市区数据(弹窗内)
			cascaderSelect(val) {
				if(val.length == 1) {
					let proIndex = val[0];
					let parentId = this.optionsProCityAreaPop[proIndex].key;
					let params = {
						parentId: parentId
					}
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
				this.handleTabDialog = false;
			},
			//监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				this.dataIndex = val;
				that.data2.forEach((data, index) => {
					val.forEach((value, ind) => {
						if(value == data.storeId) {
							idArray += data.storeId + ",";
							nameArray += data.storeName + ",";
						}
					})
				})
				this.form.flag=this.activeName;
				this.form.storeId = idArray.substr(0, idArray.length - 1);
				this.storeArr = nameArray.substr(0, nameArray.length - 1);;
				// console.log(this.form.storeId)
			},
			//搜索
			searchSelete() {
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
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
				this.handleStoreDialog = true;
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
				// console.log(this.tabType);
				if(this.tabType == "门店") {
					params.flag = "1";
				}
				if(this.tabType == "店组") {
					params.flag = "2";
				}
				if(this.tabType == "区域") {
					params.flag = "3";
				}
				// console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data)
						this.data2 = [];
						if(data != "") {
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
							// console.log(this.data2)
						}
						//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
					})
					.catch((err) => {
						// console.log(err)
					})
				$("#transfer").show();
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			onReset(){
				this.form = {
					"queryParams": "", //会员ID
					"storeId": "", //所属门店
					"memberLevel": "", //会员等级
					"ageBegin": "", //年龄范围(起)
					"ageEnd": "", //年龄范围(至)
					"integralMin": "", //积分存量(起)
					"integralMax": "", //积分存量(至)
					"registeDateBegin": "", //入会周期(起)
					"registeDateEnd": "", //入会周期(至)
					"orderDateBegin": "", //消费时间(起)
					"orderDateEnd": "", //消费时间(至)
					"realpayCountMin": "", //消费次数(起)
					"realpayCountMax": "", //消费次数(至)
					"realpayAmountMin": "", //消费金额(起)
					"realpayAmountMax": "" //消费金额(至)
				};
				this.storeArr='';
				this.orderDate=[];
				this.registeDate=[];
				this.memberLevel=[];
			},
			// 会员查询
			onSubmit() {
				this.showTable('', this.limit);
			},
			handleSizeChange(val){
				this.limit = val;
				this.showTable(this.page,val);
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit);
			},
			//请求表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"queryParams": this.form.queryParams,
					"storeId": this.form.storeId,
					"flag": this.form.flag,
					"memberLevel": this.form.memberLevel,
					"ageBegin": this.form.ageBegin,
					"ageEnd": this.form.ageEnd,
					"integralMin": this.form.integralMin,
					"integralMax": this.form.integralMax,
					"registeDateBegin": this.form.registeDateBegin,
					"registeDateEnd": this.form.registeDateEnd,
					"orderDateBegin": this.form.orderDateBegin,
					"orderDateEnd": this.form.orderDateEnd,
					"realpayCountMin": this.form.realpayCountMin,
					"realpayCountMax": this.form.realpayCountMax,
					"realpayAmountMin": this.form.realpayAmountMin,
					"realpayAmountMax": this.form.realpayAmountMax,
					"page": start,
					"limit": limit
				}
//				 console.log(JSON.stringify(params))
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectMemberSelect(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(JSON.stringify(data))
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
								if(result[index].userUrl==""){
									result[index].userUrl=that.logo;
								}
							})
							that.totalSum="共"+data.count+"人";
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
//						 console.log(err);
						that.tableLoading = false;
					});
			},
			//查看详情
			iconInfo(index, row) {
				this.form.limit=this.limit;
				this.form.page=this.page;
				sessionStorage.setItem("selectInfo",JSON.stringify(this.form));
				this.$router.push({
					name: '会员信息会员查询查看详情',
					params: {
						pageType: '查看',
						formData: row.userCode,
						getPageName:'会员查询'
					}
				});
			},
			creatActivity(){
				if(this.tableData.length>0){
					sessionStorage.setItem("selectInfo",JSON.stringify(this.form));
					this.$router.push({
						name: '会员信息会员查询创建营销活动',
						params:{
							pageData:JSON.stringify(this.form),
							type:'memberSelect',
							pageType:''
						}
					});
				}else{
					this.$message({
						message:'由于当前没有会员，不能创建营销活动！',
						type: 'warning'
					});
				}
			},
			sendGroupMessage(){
				if(this.multipleSelection.length>0){
					let idList='';
					this.multipleSelection.forEach((val,index)=>{
						idList+=val.id+',';
					})
					idList=idList.substr(0,idList.length-1);
//					console.log(idList)
					this.$router.push({
						name: '群发信息',
						params:{
							type:'已入会会员',
							pageData:JSON.stringify({
								idList:idList
							}),
						}
					});
				}else{
					this.$router.push({
						name: '群发信息',
						params:{
							type:'已入会会员',
							pageData:JSON.stringify(this.form),
						}
					});
				}
			},
		},
		created() {
			let that = this;
			if(this.getIsMemeber){
				this.form = JSON.parse(sessionStorage.getItem("selectInfo"));
//				console.log(JSON.stringify(this.form))
				this.page=this.form.page;
				this.limit=this.form.limit;
				this.storeArr=this.form.storeId;
				if(this.form.registeDateBegin!=""){
					this.registeDate=[this.form.registeDateBegin,this.form.registeDateEnd];
				}
				if(this.form.orderDateBegin!=""){
					this.orderDate=[this.form.orderDateBegin,this.form.orderDateEnd];
				}
//				this.registeDate=[];
				if(this.form.memberLevel!=""){
					this.memberLevel=this.form.memberLevel.split(",");
				}
//				console.log(this.memberLevel)
				this.showTable(this.page, this.limit);
			}else{
				sessionStorage.removeItem("selectInfo");
				this.showTable(this.page, this.limit);
			}
			// 权限
			this.roleBtn = permission(this.roleBtn);
			let params = {
				userId: this.userInfo.userCode
			}
			that.tableLoading = true;
			selectLevalInfo(params) //请求会员等级
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					//                      console.log(JSON.stringify(data)+"会员等级")
					that.levalInfo = data.data;
					that.tableLoading = false;
				})
				.catch(function(err) {
//					 console.log(err);
					that.tableLoading = false;
				});
			params = {
				userId: this.userInfo.userCode
			}
//			console.log(params)
			that.tableLoading = true;
			selectLabelData(params) //请求标签列表
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
//                  console.log(JSON.stringify(data)+"标签列表");
                    data.messageContent.forEach((val,index)=>{
                    	that.labelName.push({
                    		index:index,
                    		labelName:val.labelName,
                    		value:val.labelValue,
                    		code:val.labelCode
                    	})
                    })
					that.tableLoading = false;
				})
				.catch(function(err) {
//					console.log(err);
					that.tableLoading = false;
				});
			// 钩子函数 -- 初始化 selectLabelData
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getIsMemeber() {//页面名字 所有分组、品牌分组、预置分组、共享分组、我的分组
				return this.$route.params.isMemeber;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.pageImg{
		width:40px;
		height:40px;
	}
	.pageImg img {
		width: 100%;
		height:100%
		
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	
	.dean-form .el-form-item {
		margin: 0;
	}
	
	.el-button {
		margin-top: 0;
	}
	
	.el-form {
		display: inline-block;
	}
	.dateContainer {
		float: left;
		width: 45%
	}
	.dateTextContainer {
		float: left;
		width: 10%;
		text-align: center;
	}
	.sectionBegin {
		width: 46%;
		float: left;
	}
	.sectionEnd {
		width: 46%;
		float: right;
	}
	.storeInput {
		max-width: 60%;
		float: left;
	}
	.demo-form .el-form-item {
		width: 33%;
		float: left;
		.dsh-input{
			width: 120px;
		}
	}
	.height32{
		height: 32px;
	}
	.title{
		display: block;
		font-size: 16px;
		margin-bottom: 15px;
	}
	.elInput{
		padding-left: 30px;
		margin-bottom: 40px;
	}
	.elInput>span{
		height: 30px;
		line-height: 30px;
		margin-right: 5px;
		margin-bottom: 10px;
	}
	.noLabel{
		padding-left: 30px;
		margin-bottom: 30px;
		display: block;
	}
	.labelGroup{
		padding-left: 30px;
	}
	.labelGroup>span{
		height: 30px;
		line-height: 30px;
		margin-right: 5px;
		margin-bottom: 20px;
		cursor: pointer;
	}
	#date-inline .width100{
		width: 100%;
	}
	.demo-form .width100{
		width: 100%;
	}
	.width200{
		width: 200px;
	}
</style>