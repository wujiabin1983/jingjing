// 平台管理 - 模板管理 - 会员分组模板新增
<template>
	<el-container class="app-container">
		<el-header>
			<el-button @click="handClick" v-if="this.getPageType=='查看'" class="mrgBottom10">返回</el-button>
			<el-card>
				<el-form :inline="true" :rules="this.getPageType=='查看' ? norules : rules" ref="form" :model="form" class="demo-form-inline">
					<el-form-item label="分组名称" v-if="this.getPageType == '查看'">
						<el-input v-model="form.groupName" readonly="readonly"></el-input>
					</el-form-item>
					<el-form-item label="分组类型" >
						<el-input v-model="form.sellerGroupName" readonly="readonly" v-if="this.getPageType == '查看'"></el-input>
						<el-select placeholder="请选择" v-model="form.sellerGroupName" v-else @change="groupChange">
							<el-option v-for="item in userGroupNameData"  :key="item.key" :label="item.key" :value="item.index">
							</el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item label="" >
						<el-checkbox label="是否在APP显示" v-model="form.isAppShow" readonly="readonly"></el-checkbox>
					</el-form-item>
					<table border="0" clsss="dsh-table" cellpadding="0" cellspacing="0">
						<tr>
							<td>
								<el-form-item label="日期维度" prop="memDimension"><span class="el-form-item-td"></span></el-form-item>
							</td>
							<td>
								<el-form-item label="">
									<span class="disInBlock">近</span><el-input v-model="dateBrand.day" class="dateBrandDay" placeholder="请输入" readonly="readonly"></el-input><span class="disInBlock">天</span>
								</el-form-item>
								<el-form-item label="">
									<el-date-picker :editable="false" v-model="timeRangeArr" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" readonly="readonly" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</td>
						</tr>
						<tr>
							<td>
								<el-form-item label="会员维度" prop="memDimension"><span class="el-form-item-td"></span></el-form-item>
							</td>
							<td>
								<el-form-item label="性别">
									<el-input v-model="memDimensionInfo.sex" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="memDimension.sex" multiple placeholder="请选择性别" v-else @change="sexChange">
										<el-option label="男" value="男">男</el-option>
										<el-option label="女" value="女">女</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="地域">
									<el-input v-model="memDimensionInfo.area" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="memDimension.area" multiple placeholder="请选择地域" v-else @change="areaChange">
										<el-option v-for="item in optionsProCityArea" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="会员类型">
									<el-input v-model="news" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="memDimension.new" multiple placeholder="请选择会员类型" v-else @change="typeChange">
										<el-option label="" value="">请选择</el-option>
										<el-option label="新会员" value="新会员">新会员</el-option>
										<el-option label="老会员" value="老会员">老会员</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="入会来源">
									<el-input v-model="source" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="memDimension.source" multiple placeholder="请选择入会来源" v-else @change="sourceChange">
										<el-option label="" value="">请选择</el-option>
										<el-option label="微信" value="微信">微信</el-option>
										<el-option label="门店" value="门店">门店</el-option>
										<el-option label="淘宝" value="淘宝">淘宝</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="会员活跃度">
									<el-input v-model="liveness" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="memDimension.liveness" multiple placeholder="请选择会员活跃度" v-else @change="liveChange">
										<el-option label="" value="">请选择</el-option>
										<el-option label="活跃会员" value="活跃会员">活跃会员</el-option>
										<el-option label="沉寂会员" value="沉寂会员">沉寂会员</el-option>
										<el-option label="睡眠会员" value="睡眠会员">睡眠会员</el-option>
										<el-option label="预流失会员" value="预流失会员">预流失会员</el-option>
										<el-option label="流失会员" value="流失会员">流失会员</el-option>
									</el-select>
								</el-form-item>
								<!--<el-form-item label="">
                                    <el-select v-model="form.memDimension.level" placeholder="请选择会员等级">
                                        <el-option label="会员" value="会员">会员</el-option>
                                        <el-option label="金牌会员" value="金牌会员">金牌会员</el-option>
                                        <el-option label="钻石会员" value="钻石会员">钻石会员</el-option>
                                    </el-select>
                                </el-form-item>-->
							</td>
						</tr>
						<tr>
							<td>
								<el-form-item label="固定维度" class="width132" prop="fixedDimensions"><span class="el-form-item-td"></span></el-form-item>
							</td>
							<td>
								<el-form-item label="">
									<el-checkbox-group v-model="fixedDimensions" @change="fixedChange">
										<el-checkbox label="未及时二回会员" readonly="readonly"></el-checkbox>
										<el-checkbox label="入会未消费" :disabled="disabled"></el-checkbox>
										<el-checkbox label="粉丝" :disabled="disabled"></el-checkbox>
										<el-checkbox label="未绑卡的会员" :disabled="disabled"></el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="会员生日">
									<el-input v-model="fixedDimension.birthday" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="fixedDimension.birthday" v-else placeholder="请选择会员生日">
										<el-option label="" value="">请选择</el-option>
										<el-option label="今日会员生日" value="今日会员生日">今日会员生日</el-option>
										<el-option label="昨日会员生日" value="昨日会员生日">昨日会员生日</el-option>
										<el-option label="本周会员生日" value="本周会员生日">本周会员生日</el-option>
										<el-option label="下周会员生日" value="下周会员生日">下周会员生日</el-option>
										<el-option label="本月会员生日" value="本月会员生日">本月会员生日</el-option>
										<el-option label="下月会员生日" value="下月会员生日">下月会员生日</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="入会周年">
									<el-input v-model="fixedDimension.anniversary" v-if="this.getPageType == '查看'" readonly="readonly"></el-input>
									<el-select v-model="fixedDimension.anniversary" v-else placeholder="请选择入会周年">
										<el-option label="" value="">请选择</el-option>
										<el-option label="入会周年(当日)" value="入会周年(当日)">入会周年(当日)</el-option>
										<el-option label="入会周年(明日)" value="入会周年(明日)">入会周年(明日)</el-option>
										<el-option label="入会周年(本周)" value="入会周年(本周)">入会周年(本周)</el-option>
										<el-option label="入会周年(下周)" value="入会周年(下周)">入会周年(下周)</el-option>
										<el-option label="入会周年(当月)" value="入会周年(当月)">入会周年(当月)</el-option>
										<el-option label="入会周年(下月)" value="入会周年(下月)">入会周年(下月)</el-option>
									</el-select>
								</el-form-item>
							</td>
						</tr>
					</table>
				</el-form>
				<el-dialog title="提示" :visible.sync="dialogVisible" class="box30">
					<el-form :inline="true" ref="formGroup" v-loading="this.enterLoading" :rules="rulesGroup" :model="formGroup" class="demo-form-inline">
						<el-form-item label="请输入分组名称" prop="groupName">
							<el-input v-model="formGroup.groupName" class="width180" placeholder="请输入分组名称"></el-input>
						</el-form-item>
						<el-form-item class="el-footer-btn-con marginTop10">
						   <el-button @click="dialogVisible = false">取 消</el-button>
						   <el-button type="primary" @click="enterSubmit">确 定</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
			</el-card>
		</el-header>
		<el-main v-if="this.getPageType != '查看'">
			<el-card>
				<el-button @click="handClick">返回</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { addMemberGroupInfo, editMemberGroupInfo, showMemberGroupInfo } from '@/api/platform/groupTemp'
	import { selectProCityArea ,selectUserGroupName} from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				timeRangeArr:[],
				disabled: false,
				dialogVisible: false,
				enterLoading:false,
				fixedDimensions: [], //固定维度多选
				memDimension: { // 会员维度
					sex: [], // 性别
					area: [], // 地域
					//              day: '', // 入会天数
					new: [], // 新老会员
					source: [], // 入会来源
					liveness: [], // 会员活跃度
				},
				news: '', // 新老会员
				source: '', // 入会来源
				liveness: '', // 会员活跃度
				dateBrand : { 
					"selectDateBegin" : "",//选择日期起
					"selectDateEnd" : "", //选择日期止
					"day" : "" //近？天
				},
				memDimensionInfo: {
					sex: '',
					area: '',
				},
				fixedDimension: {
					birthday: '', // 会员生日
					anniversary: '' // 入会周年
				},
				memDimensionData: {},
				fixedDimensionsData: {},
				fixedDimensionData: {},
				form: {
					memDimension: '',
					fixedDimensions: '', // 固定维度
					fixedDimension: '', // 固定维度
					dateBrand:'',
					sellerGroupName:'',
					sellerGroupId:'',
					isAppShow:''
				},
				formGroup: {
					groupName: ''
				},
				userGroupNameData:[],
				optionsProCityArea: [],
				getFormData: '',
				norules: {},
				rules: {
					//					memDimension: [{
					//							required: true,
					//							message: '请选择会员维度',
					//							trigger: 'change'
					//						},
					//						{
					//							max: 100,
					//							message: '最大长度不能超过100',
					//							trigger: 'change'
					//						}
					//					],
					//					fixedDimension: [{
					//							required: true,
					//							message: '请选择固定维度（单选）',
					//							trigger: 'change'
					//						},
					//						{
					//							max: 100,
					//							message: '最大长度不能超过100',
					//							trigger: 'change'
					//						}
					//					],
					//					fixedDimensions: [{
					//							required: true,
					//							message: '请选择固定维度（多选）',
					//							trigger: 'change'
					//						},
					//						{
					//							max: 100,
					//							message: '最大长度不能超过100',
					//							trigger: 'change'
					//						}
					//					]
				},
				rulesGroup: {
					groupName: [{
							required: true,
							message: '请输入分组名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				}
			}
		},
		methods: {
			selectDate(val){
				this.dateBrand.selectDateBegin=val[0];
				this.dateBrand.selectDateEnd=val[1];
			},
			groupChange(val){
				this.form.sellerGroupName=this.userGroupNameData[val].key;
				this.form.sellerGroupId=this.userGroupNameData[val].value;
			},
			//性别监听
			sexChange(val) {
				this.memDimensionData.sex = val;
			},
			//地域监听
			areaChange(val) {
				this.memDimensionData.area = val;
			},
			//入会天数监听
			dayChange(val) {
				this.memDimensionData.day = val;
			},
			//新老会员监听
			typeChange(val) {
				this.memDimensionData.new = val;
			},
			//入会来源监听
			sourceChange(val) {
				this.memDimensionData.source = val;
			},
			//会员活跃度
			liveChange(val) {
				this.memDimensionData.liveness = val;
			},
			getUserGroupName(){
				let that =this;
				var params = {
					userId: this.userInfo.userCode
				}
//							console.log(params)
				selectUserGroupName(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType=="SUCCESS"){
							data.messageContent.forEach((val,index)=>{
								that.userGroupNameData.push({
									index:val.index,
									key:val.key,
									value:val.value
								})
							})
						}else {
							that.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
//						console.log(err);
					})
			},
			//监听固定维度（多选）
			fixedChange(val) {
				this.fixedDimensionsData = {};
				val.forEach((data, index) => {
					if(data == "未及时二回会员") {
						this.fixedDimensionsData.noSecond = "是";
					}
					if(data == "入会未消费") {
						this.fixedDimensionsData.noOrder = "是";
					}
					if(data == "粉丝") {
						this.fixedDimensionsData.isFans = "是";
					}
					if(data == "未绑卡的会员") {
						this.fixedDimensionsData.noCard = "是";
					}
				})
			},
			handClick() {
				this.$route.params.pageType = '';
				this.$router.push({
					name: '会员分组模板',
					params: {
						type: '3'
					}
				});
			},
			//弹窗确认
			enterSubmit() {
				this.$refs['formGroup'].validate((valid) => {
					if(valid) {
						this.enterLoading=true;
						this.form.groupName = this.formGroup.groupName;
						if(this.getPageType == '添加') {
							var params = {
								userId: this.userInfo.userCode,
								memGroupTemp: this.form
							}
//												console.log(JSON.stringify(params));return false;
							addMemberGroupInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//	        					console.log(data)
									let code = data.messageType,
										msg = data.messageContent;
									this.enterLoading=false;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										this.$route.params.pageType = '';
										this.$router.push({
											name: '会员分组模板',
											params: {
												type: '3'
											}
										});
									} else {
										this.$message.warning(msg);
									}
								})
								.catch((err) => {
									// console.log(err);
								})
						} else {
							var params = {
								userId: this.userInfo.userCode,
								memGroupTemp: this.form
							}
							//	    				console.log(JSON.stringify(params))
							editMemberGroupInfo(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//	        					console.log(data)
									let code = data.messageType,
										msg = data.messageContent;
									this.enterLoading=false;
									if(code == 'SUCCESS') {
										this.$message.success(msg);
										this.$route.params.pageType = '';
										this.$router.push({
											name: '会员分组模板',
											params: {
												type: '3'
											}
										});
									} else {
										this.$message.error(msg);
									}
								})
								.catch((err) => {
									// console.log(err);
								})
						}
					}
				})
			},
			handleSave() { // 保存
				if(JSON.stringify(this.memDimensionData) != "{}") {
					this.form.memDimension = JSON.stringify(this.memDimensionData);
				}
				if(JSON.stringify(this.fixedDimensionsData) != "{}") {
					this.form.fixedDimensions = JSON.stringify(this.fixedDimensionsData);
				}
				if(this.fixedDimension.birthday != "" || this.fixedDimension.anniversary != "") {
					this.form.fixedDimension = JSON.stringify(this.fixedDimension);
				}
				if(this.dateBrand.selectDateBegin != "" || this.dateBrand.day != "") {
					this.dateBrand.day='近'+this.dateBrand.day+'天';
					this.form.dateBrand = JSON.stringify(this.dateBrand);
				}
				if(this.form.memDimension == "" && this.form.fixedDimensions == "" && this.form.fixedDimension == ""&& this.form.dateBrand == "") {
					this.$message.warning('请您至少选择一项维度信息！');
					return false;
				}
				this.form.isAppShow=this.form.isAppShow?'是':'否';
//				console.log(JSON.stringify(this.form))
				this.dialogVisible = true;

			}
		},
		created() {
			//  	console.log(this.getPageType);
			//请求省市区下拉框
			if(this.getPageType != '查看') {
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.optionsProCityArea=[];
						data.forEach((val, index) => {
							this.optionsProCityArea.push(val);
						})
					})
					.catch((err) => {
						// console.log('err');
					})
				this.getUserGroupName();
			}
			// 钩子函数 -- 初始化
			if(this.getPageType == '查看') {
				this.disabled = true;
				let params = {
					"userId": this.userInfo.userCode,
					"id": this.getId
				}
				let that = this;
//				          console.log(params)
				showMemberGroupInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let code = data.messageType,
							msg = data.messageContent;
//						                  console.log(JSON.stringify(msg));
						if(code == 'SUCCESS') {
//								                    console.log(JSON.stringify(msg));
							that.getFormData = JSON.stringify(msg);
							that.form.groupName = msg.groupName;
							that.memDimension = msg.memDimension;
							that.source=that.memDimension.source.join(",");
							that.liveness=that.memDimension.liveness.join(",");
							that.new=that.memDimension.new.join(",");
							that.form.sellerGroupName = msg.sellerGroupName;
							if(msg.fixedDimensions.noSecond) {
								that.fixedDimensions.push('未及时二回会员');
							}
							if(msg.fixedDimensions.noOrder) {
								that.fixedDimensions.push('入会未消费');
							}
							if(msg.fixedDimensions.isFans) {
								that.fixedDimensions.push('粉丝');
							}
							if(msg.fixedDimensions.noCard) {
								that.fixedDimensions.push('未绑卡的会员');
							}
							that.fixedDimension = msg.fixedDimension;
							//	                    console.log(that.fixedDimension);
							if(msg.memDimension.sex) {
								var sex = '';
								msg.memDimension.sex.forEach((data, index) => {
									sex += data + ',';
								})
								that.memDimensionInfo.sex = sex.substr(0, sex.length - 1);
							}
							if(msg.memDimension.area) {
								var area = '';
								msg.memDimension.sex.forEach((data, index) => {
									area += data + ',';
								})
								that.memDimensionInfo.area = area.substr(0, area.length - 1);
							}
							if(msg.dateBrand.selectDateBegin!=""&&msg.dateBrand.selectDateBegin){
								that.timeRangeArr=[msg.dateBrand.selectDateBegin,msg.dateBrand.selectDateEnd];
							}
							if(msg.dateBrand.day!=""&&msg.dateBrand.day){
								let day =msg.dateBrand.day.substr(1,msg.dateBrand.day.length-2);
								that.dateBrand.day=day;
							}
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
			}
			if(this.getPageType == '修改') {
				let params = {
					"userId": this.userInfo.userCode,
					"id": this.getId
				}
				let that = this;
				//          console.log(params)
				showMemberGroupInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							//	                    console.log(JSON.stringify(msg));
							that.fixedDimension = msg.fixedDimension;
							if(msg.fixedDimensions.noSecond) {
								that.fixedDimensions.push('未及时二回会员');
							}
							if(msg.fixedDimensions.noOrder) {
								that.fixedDimensions.push('入会未消费');
							}
							if(msg.fixedDimensions.isFans) {
								that.fixedDimensions.push('粉丝');
							}
							if(msg.fixedDimensions.noCard) {
								that.fixedDimensions.push('未绑卡的会员');
							}
							//	                    console.log(msg.memDimension.sex);
							if(msg.memDimension.sex) {
								that.memDimension.sex = msg.memDimension.sex;
							}
							if(msg.memDimension.area) {
								that.memDimension.area = msg.memDimension.area;
							}
							//                  if(msg.memDimension.day){
							//                  	that.memDimension.day=msg.memDimension.day;
							//                  }
							if(msg.memDimension.new) {
								that.memDimension.new = msg.memDimension.new;
							}
							if(msg.memDimension.source) {
								that.memDimension.source = msg.memDimension.source;
							}
							if(msg.memDimension.liveness) {
								that.memDimension.liveness = msg.memDimension.liveness;
							}
							if(msg.dateBrand.selectDateBegin!=""&&msg.dateBrand.selectDateBegin){
								that.timeRangeArr=[msg.dateBrand.selectDateBegin,msg.dateBrand.selectDateEnd];
							}
							if(msg.dateBrand.day!=""&&msg.dateBrand.day){
								let day =msg.dateBrand.day.substr(1,msg.dateBrand.day.length-2);
								that.dateBrand.day=day;
							}
							that.form.memDimension = JSON.stringify(msg.memDimension);
							that.form.fixedDimensions = JSON.stringify(msg.fixedDimensions);
							that.form.fixedDimension = JSON.stringify(msg.fixedDimension);
							that.form.groupName = msg.groupName;
							that.formGroup.groupName = msg.groupName;
							that.form.id = that.getId;
							that.form.version = that.getVersion;
							that.form.sellerGroupName = msg.sellerGroupName;
							that.form.sellerGroupId = msg.sellerGroupId;
							//	                    console.log(JSON.stringify(that.form));
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
					
			}
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				let pageType = this.$route.params.pageType;
				return pageType;
			},
			getId() {
				let id = this.$route.params.id;
				return id
			},
			getVersion() {
				let version = this.$route.params.version;
				return version
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
		// width: rem(700px);
		// min-width: 500px;
	}
	
	.el-form-item {
		padding: 0;
		margin: rem(5px);
	}
	
	// 行内文本 span
	.formText {
		display: inline;
		line-height: rem(30px);
	}
	
	table {
		border-top: 1px solid #d2d2d2;
		border-left: 1px solid #d2d2d2;
		tr td:first-child {
			background: #eee;
		}
		td {
			padding: rem(10px);
			border-bottom: 1px solid #d2d2d2;
			border-right: 1px solid #d2d2d2;
		}
	}
	.dsh-table{
		width: 100%;
		border-color: #CCC;
	}
	.el-form-item--small .el-form-item__content {
		line-height: 5px;
	}
	
	.el-form-item-td {
		width: 140px;
		height: 5px;
		line-height: 5px;
		display: inline-block;
	}
	.dateBrandDay{
		width: 40%;
		display: inline-block;
		margin: 0 10px;
	}
	.disInBlock{
		display: inline-block;
	}
	.width132{
		width: 132px;
	}
	.width180{
		width: 180px;
	}
</style>