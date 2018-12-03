<!--摇一摇活动管理-新增-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<el-form :model="form" v-loading="this.tableLoading" ref="form" label-width="86px" :rules="rules" class="demo-form">
					<div class="activityContainer">
						<div class="leftBox">
							<div class="title">活动链接</div>
							<div class="activityLink icon-close" v-loading="this.imgLoading">
								<img v-if="dialogImageUrl" :src="dialogImageUrl" @click="clickTest" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
								<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
							</div>
							<el-input v-model="form.activityTitle" class="activityInput activityContainerM" :disabled="true" placeholder="活动标题"></el-input>
							<el-input v-model="form.activitySubtitle" class="activityInput" :disabled="true" placeholder="活动副标题"></el-input>
						</div>
						<div class="rightBox">
							<div class="title">设置活动链接内容</div>
							<div class="activityInfo">
								<el-form-item label="活动图片" prop="activityUrl">
									<!-- <el-button type="primary" @click="clickTest">选择</el-button>
									<el-button type="primary" @click="handleUploadDelete">删除</el-button> -->
									<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
										<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
										<input type="submit" value="上传" ref="uploadSubmit" />
									</form>
									<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
									<el-dialog :visible.sync="dialogVisible">
										<img width="100%" :src="imageUrl" alt="">
									</el-dialog>
									<span class="activitySpan">请您点击左侧按钮选择活动图片</span>
								</el-form-item>
							</div>
							<el-form-item label="主标题" prop="activityTitle" class="activityInputOther">
								<el-input v-model="form.activityTitle" placeholder="请输入活动标题"></el-input>
							</el-form-item>
							<el-form-item label="副标题" prop="activitySubtitle" class="activityInputOther">
								<el-input v-model="form.activitySubtitle" placeholder="请输入活动副标题"></el-input>
							</el-form-item>
						</div>
					</div>
					<div class="activityContainer activityContainerM">
						<!--<div class="leftBox leftBoxBorder">
							<div class="title">活动</div>
							<div class="activityLink minH"></div>
						</div>-->
						<div class="rightBox rightBoxBorder">
							<div class="title">设置活动</div>
							<div class="activityInfo minH">
								<el-row :gutter="24">
									<el-col :span="24">
										<el-form-item label="类型" prop="activityJson">
											<el-input v-model="form.activityJson" v-show=""></el-input>
											<el-radio-group v-model="type" @change="radioHandle">
												<el-radio label="自定义链接">自定义链接</el-radio>
												<el-radio label="关注微信公众号">关注微信公众号</el-radio>
												<el-radio label="摇优惠券">摇优惠券</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :span="24">
										<el-card v-show="type=='自定义链接'">
											<el-form :model="formCustom" ref="formCustom" label-width="86px" :rules="rulesFormCustom" class="demo-form">
												<el-form-item label="选择门店" placeholder="请选择门店" prop="storeId">
													<el-input v-model="storeArr" :readonly="true" placeholder="请选择门店" class="store width270"></el-input>
													<el-button type="primary" id="search" @click="searchStorePop">选择</el-button>
												</el-form-item>
												<el-form-item label="跳转URL" prop="jumpUrl" class="activityInputOther">
													<el-input v-model="formCustom.jumpUrl" placeholder="请输入跳转URL"></el-input>
												</el-form-item>
												<el-form-item label="备注说明" prop="remarks" class="activityInputOther">
													<el-input type="textarea" resize="none" v-model="formCustom.remarks" placeholder="请输入备注说明"></el-input>
												</el-form-item>
											</el-form>
										</el-card>
										<el-card v-show="type=='摇优惠券'">
											<el-form :model="formCoupon" ref="formCoupon" label-width="86px" :rules="rulesFormCoupon" class="demo-form">
												<el-form-item label="活动时间" prop="activityDate">
													<el-date-picker v-model="timeRangeArr" @change="selectDate" :editable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
													</el-date-picker>
												</el-form-item>
												<el-form-item label="选择门店" placeholder="请选择门店" prop="storeId">
													<el-input v-model="storeArrOther" :readonly="true" placeholder="请选择门店" class="store width240"></el-input>
													<el-button type="primary" id="search" @click="searchStorePop">选择</el-button>
												</el-form-item>
												<el-form-item label="领取次数" prop="drawNo" class="recTime">
													<el-select class="inlineFormItem margin0" v-model="formCoupon.drawNo" @change="drawNoChange" placeholder="请选择">
														<el-option label="每日" value="每日"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="" prop="drawNum" class="recTimeCount">
													<span class="formText">最多抽奖</span>
													<el-input class="inlineFormItem width100" v-model="formCoupon.drawNum" @change="drawNumChange" placeholder="请输入" prop="recTime.time"></el-input>
													<span class="formText">次（0为次数不限）</span>
												</el-form-item>
												<el-form-item label="未中奖说明" prop="remarks" class="notWin">
													<el-input type="textarea" resize="none" v-model="formCoupon.notWin" placeholder="请输入未中奖说明"></el-input>
												</el-form-item>
												<el-form-item label="奖品设置" prop="remarks" class="notWin">
													<div class="component" v-for="(item, index) in templateItems"  :key="templateItems.id">
														<div :is="item.component" class="overHidden" :index="index" v-on:message="recieveMessage" :data="item.data" ref="child"></div>
														<div class="deteleBtn" @click="handleDelete(index)">
															<el-tooltip class="iconItem" content="删除" placement="top">
																<icon-svg icon-class="shanchu" @click.native.prevent="handleDelete(index)" />
															</el-tooltip>
														</div>
													</div>
													<div class="addBtn" @click="iconAddTr">
														<i class="el-icon-plus iconAdd"></i>
													</div>
												</el-form-item>
												<el-form-item label="活动简介" prop="activiteDesc" class="activiteDesc">
													<el-input type="textarea" resize="none" v-model="formCoupon.activiteDesc" placeholder="请输入备注说明"></el-input>
												</el-form-item>
											</el-form>
										</el-card>
									</el-col>
								</el-row>
							</div>
						</div>
					</div>
					<div class="el-footer-btn-con">
						<el-button @click="handleBack">返回</el-button>
						<el-button type="primary" @click="submitForm('form')" class="marginTop10">确定</el-button>
					</div>
				</el-form>
			</el-card>
			<el-dialog width="80%" :visible.sync="dialogVisiblePic">
				<!-- 图片选择 -->
				<groupMaterialListPic v-show="dialogVisiblePic" @handleChecked="handleChecked"></groupMaterialListPic>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisiblePic = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSurePic">确 定</el-button>
				</span>
			</el-dialog>
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
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { returnSelectedFile } from '@/api/upload'
	import { award } from '@/views/WebRoot/tool'
	import { uploadImg } from '@/api/base/brandInfo'
	import { validateFloat,validateInt } from '@/utils/validate';
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import { creatActivityData, selectActivityInfo, setActivityData } from '@/api/tool/activityManagement'
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import { selectAudioUse, selectLevalInfo, selectProCityArea, selectStoreData, selectTabData } from '@/api/public'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	const isFloat = (rule, value, callback) => {
		if(value != "") {
			if(!validateFloat(value)) {
				callback(new Error('请输入有效浮点数'))
			} else {
				callback()
			}
		}
	}
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		}
	}
	export default {
		data() {
			return {
				dialogVisiblePic:false,
				checkedPic: [],
				//				http://img17.3lian.com/d/file/201701/16/f62df7a683e4dd91ff062d00b1b1f6a7.jpg
				activityFlag: false,
				dialogImageUrl: '',
				imageUrl:'',
				templateItems: [],
				activeTempDtl: [],
				tableLoading: false,
				imgLoading:false,
				dialogVisible: false,
				handleTabDialog: false,
				submitFlag: false,
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				storeArr: '',
				storeArrOther: '',
				activeName: 'first',
				tabType: '门店',
				uploadActUrl: '', //上传图片请求地址
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				form: {
					"activityUrl": "", //活动图片URL
					"activityTitle": "", //活动标题
					"activitySubtitle": "", //活动副标题
					"activiteDesc": "", //活动说明
					"activityJson": ""
				},
				winRateSum:'',
				rules: {
					activityUrl: [{
							required: true,
							message: '请选择图片',
							trigger: 'change'
						},
						{
							max: 10000,
							message: '最大长度不能超过10000',
							trigger: 'change'
						}
					],
					activityTitle: [{
							required: true,
							message: '请输入主标题',
							trigger: 'change'
						},
						{
							max: 6,
							message: '最大长度不能超过6个汉字',
							trigger: 'change'
						}
					],
					activitySubtitle: [{
							required: true,
							message: '请输入副标题',
							trigger: 'change'
						},
						{
							max: 7,
							message: '最大长度不能超过7个汉字',
							trigger: 'change'
						}
					],
					activityJson: [{
						required: true,
						message: '请配置活动信息',
						trigger: 'change'
					}]
				},
				timeRangeArr: [],
				type: '自定义链接',
				formCustom: {
					type: '自定义链接',
					storeId: '',
					storeName: '',
					jumpUrl: '', //跳转URL
					remarks: '' //备注信息
				},
				rulesFormCustom: {
					storeId: [{
						required: true,
						message: '请选择门店',
						trigger: 'change'
					}],
					jumpUrl: [{
							required: true,
							message: '请输入跳转URL',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					]
				},
				count: 1,
				formCoupon: {
					type: '', //类型
					activityDate: '', //活动时间
					storeId: '',
					storeName: '',
					drawNo: '', //抽奖时间
					drawNum: '', //抽奖次数
//					winRate: '', //中奖率
					notWin: '', //未中奖说明
					prizes: '', //奖品设置
					activiteDesc: '', //活动简介
					wechatUrl:''//微信URL
				},
				rulesFormCoupon: {
					activityDate: [{
							required: true,
							message: '请选择活动时间',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeId: [{
						required: true,
						message: '请选择门店',
						trigger: 'change'
					}],
//					winRate: [{
//							required: true,
//							message: '请输入中奖率',
//							trigger: 'change'
//						},
//						{
//							max: 100,
//							message: '最大长度不能超过100',
//							trigger: 'change'
//						},
//						{
//							validator: isFloat
//						}
//					],
					drawNo: [{
						required: true,
						message: '请选择领取类型',
						trigger: 'change'
					}],
					drawNum: [{
							required: true,
							message: '请输入抽奖次数',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}, {
							validator: isInt
						}
					],
				}
			}
		},
		components: {
			groupMaterialListPic,
			award
		},
		methods: {
			recieveMessage(val){
				let sum = 0;
				let num = 0;
				this.$refs.child.forEach((value,index)=>{
					sum+=parseInt(JSON.parse(value.form.draw).drawNum);
				})
				this.$refs.child.forEach((value,index)=>{
//					console.log(JSON.parse(value.form.draw).drawNum)
//					console.log(JSON.stringify(value.form))
					if(this.$refs.child.length==1){
						this.$refs.child[0].form.winRate='100';
					}else{
						this.$refs.child[index].form.winRate=(parseInt(JSON.parse(value.form.draw).drawNum)/sum*100).toFixed(0);
					}
				})
				this.$refs.child.forEach((value,index)=>{
					num+=parseInt(this.$refs.child[index].form.winRate);
				})
				if(num!=100){
					this.$refs.child[0].form.winRate=parseInt(this.$refs.child[0].form.winRate)+1;
				}
//				console.log(sum)
			},
			// 图片选择
			handleChecked(str) {
				this.checkedPic[0] = str.id
			},
			//选择图片
			handleDialogSurePic() {
				this.dialogVisiblePic = false;
				let params = {
					userId: this.userInfo.userCode,
					id: this.checkedPic[0]
				}
				MaterialLibraryCardShow3(params)
					.then(res => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.count,
							msg = data.data;
						if(code == 1) {
							this.form.activityUrl = msg[0].coverUrl; // 图片赋值
							this.form.wechatUrl = msg[0].fieldUrl; // 图片赋值
							this.dialogImageUrl= msg[0].coverUrl;
						}
					})
					.catch()
			},
			handleBack() {
				this.$router.push({
					path: "/mar/mar-1-1" 
				});
			},
			//删除
			handleDelete(index) {
				if(this.templateItems.length != 1) {
					this.templateItems.splice(index, 1);
				} else {
					this.templateItems = [];
				}
			},
			iconAddTr() { // 添加
				let that =this;
				let setTableData = that.templateItems[that.count];
				that.count++;
				if(that.count > 5) {
					that.$message.warning('最多可添加5张');
					return false;
				}
				let length = that.templateItems.length;
				that.templateItems.push({
					'id': length++,
					'component': 'award',
					'data': ''
				});
//				console.log(JSON.stringify(this.templateItems))
			},
			// 方法
			submitForm() {
				let that = this;
				let num = 0;
				// console.log(this.type)
				if(this.type == "自定义链接") {
					this.$refs['formCustom'].validate((valid) => {
						if(valid) {
							this.form.activityJson = JSON.stringify(this.formCustom);
							this.submitFlag = true;
						} else {
							this.submitFlag = false;
						}
					})
				}
				if(this.type == "关注微信公众号") {
					this.form.activityJson = "关注微信公众号";
					this.submitFlag = true;
				}
				if(this.type == "摇优惠券") {
					this.activeTempDtl = [];
					if(this.$refs.child.length==0){
						that.$message.warning('至少需要一个奖品');
						return false;
					}//验证优惠券的表单
					that.$refs['formCoupon'].validate((valid) => {
						if(valid) {
							that.submitFlag = true;
							that.formCoupon.draw={
								"drawNo":that.formCoupon.drawNo,
								"drawNum":that.formCoupon.drawNum
							};
							that.$refs.child.forEach((val,index)=>{
								that.$refs.child[index].$refs['form'].validate((valid) => {
									if(valid) {
										that.activeTempDtl.push(val.form);
										that.formCoupon.prizes = JSON.stringify(that.activeTempDtl);
										that.submitFlag = true;
										if(JSON.parse(val.form.coupNo).activityDateEnd&&that.timeRangeArr.length>0){
											var activityDate = new Date(that.timeRangeArr[1]).getTime();
											var coupDate = new Date(JSON.parse(val.form.coupNo).activityDateEnd).getTime();
											if(activityDate<=coupDate){
												that.submitFlag = true;
											}else{
												that.submitFlag = false;
												that.$message.warning('优惠券有效期不能小于活动日期！');
											}
										}
									} else {
										that.submitFlag = false;
										// console.log("验证失败");
									}
								})
							})
							that.form.activityJson = JSON.stringify(that.formCoupon);
//							console.log(JSON.stringify(that.formCoupon));
						} else {
							that.submitFlag = false;
						}
					})
				}
				if(that.submitFlag) {
					that.$refs['form'].validate((valid) => {
						if(valid) {
							that.tableLoading = true;
							let params = {
								userId: that.userInfo.userCode,
								...that.form
							}
//							console.log(JSON.stringify(params));
//							return false;
							// console.log(JSON.stringify(params))
							if(that.getPageType == "添加") {
								creatActivityData(params)
									.then((res) => {
										let data = JSON.parse(Base64.decode(res.data)),
											code = data.messageType,
											msg = data.messageContent;
//										console.log(JSON.stringify(data))
										if(code == 'SUCCESS') {
											that.tableLoading = false;
											that.$message.success(msg);
											that.$router.push({
												path: '/mar/mar-1-1'
											});
										} else {
											that.$message.warning(msg);
											that.tableLoading = false;
										}
									})
									.catch((err) => {
										// console.log(err);
										that.tableLoading = false;
									})
							} else {
								setActivityData(params)
									.then((res) => {
										let data = JSON.parse(Base64.decode(res.data)),
											code = data.messageType,
											msg = data.messageContent;
//										console.log(JSON.stringify(data))
										if(code == 'SUCCESS') {
											that.tableLoading = false;
											that.$message.success(msg);
											that.$router.push({
												path: '/mar/mar-1-1'
											});
										} else {
											that.$message.warning(msg);
											that.tableLoading = false;
										}
									})
									.catch((err) => {
										that.tableLoading = false;
										// console.log(err);
									})
							}
						}
					})
				} else {
					// console.log(1)
				}
			},
			//抽奖次数-抽奖时间
			drawNoChange(val) {},
			//抽奖次数-抽奖次数
			drawNumChange(val) {},
			//监听单选
			radioHandle(str) {
				// console.log(str)
				this.form.activityJson = '';
				this.formCustom.storeName = '';
				this.formCustom.storeId = '';
				this.formCoupon.storeName = '';
				this.formCoupon.storeId = '';
				this.type = str;
				if(str == "自定义链接") {
					this.formCustom.type = str;
				}
				if(str == "关注微信公众号") {
					this.formCustom = {
						type: '自定义链接',
						storeId: '',
						storeName: '',
						jumpUrl: '', //跳转URL
						remarks: '' //备注信息
					}
					this.form.activityJson = str;
					this.storeArr = '';
					this.storeArrOther = '';
					this.data2 = [];
					this.value2 = [];
					this.dataIndex = [];
				}
				if(str == "摇优惠券") {
					this.formCustom = {
						type: '自定义链接',
						storeId: '',
						storeName: '',
						jumpUrl: '', //跳转URL
						remarks: '' //备注信息
					}
					this.formCoupon.type = str;
					this.storeArr = '';
					this.storeArrOther = '';
					this.data2 = [];
					this.value2 = [];
					this.dataIndex = [];
				}
			},
			//监听时间选择器
			selectDate(val) {
				let params = {
					activityDateBegin: val[0],
					activityDateEnd: val[1]
				}
				this.formCoupon.activityDate = JSON.stringify(params);
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
//						console.log('err');
					})
//				this.searchStoreTab();
				this.handleTabDialog = true;
			},
			//监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				//				let indexArray='';
				var that = this;
				// console.log(val)
				that.data2.forEach((data, index) => {
					val.forEach((value, ind) => {
						if(value == data.storeId) {
							idArray += data.storeId + ",";
							nameArray += data.storeName + ",";
						}
					})
				})
				idArray = idArray.substr(0, idArray.length - 1);
				nameArray = nameArray.substr(0, nameArray.length - 1);
				if(this.type == "自定义链接") {
					this.storeArr = nameArray;
					this.formCustom.storeId = idArray;
					this.formCustom.storeName = nameArray;
				}
				if(this.type == "摇优惠券") {
					this.storeArrOther = nameArray;
					this.formCoupon.storeId = idArray;
					this.formCoupon.storeName = nameArray;
				}

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
//							        		console.log(data)
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
						}
					})
					.catch((err) => {
//						console.log(err)
					})
				$("#transfer").show();
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
//							console.log('err');
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
				        		this.optionsProCityAreaPop[proIndex].children[cityIndex].children=[];
								data.forEach((val, index) => {
									array.push({
										...val
									});
								})
				        		this.optionsProCityAreaPop[proIndex].children[cityIndex].children=array;
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
				//				var nameArray='';
				//				var that = this;
				//				this.dataIndex.forEach((val, index) => {
				//					nameArray+=that.data2[val].storeName+",";
				//					this.storeArr=nameArray;
				//					this.storeArrOther=nameArray;
				//				})
				this.handleTabDialog = false;
			},
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				this.imgLoading = true;
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!/image\/\w+/.test(files.type)) {
					this.$message("请上传一张图片");
					return false;
				}
				var reader = new FileReader();
				reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件 
				reader.onload = function(e) {
					let formData = new FormData(); // 可以增加表单数据
					formData.append("file", files); // 文件对象
					uploadImg(formData)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							//								console.log(msg.fileName)
							if(code == 'SUCCESS') {
								that.form.activityUrl = msg.fileName; // 图片赋值
								that.imageUrl= msg.fileName; // 图片赋值
								that.dialogImageUrl = msg.fileName+'?x-oss-process=style/small'; // 图片回填 - 本地图片
								that.$message.success('上传成功');
							} else {
								that.$message({
									message: msg,
									type: 'warning'
								});
							}
							that.imgLoading = false;
						})
						.catch((err) => {
							that.imgLoading = false;
							// console.log(err);
						})
				}
			},
			clickTest() {
				this.dialogVisiblePic = true;
				// 点击测试
//				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.imageUrl = '';
				this.form.activityUrl = '';
				this.$refs.uploadIpt.value = '';
			},
		},
		created() {
			// 钩子函数 -- 初始化
			if(this.getPageType) {
				if(this.getPageType == "修改") {
					let params = {
						userId: this.userInfo.userCode,
						id: JSON.parse(this.getFormData).id
					}
//										console.log(params)
					selectActivityInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
//							console.log(JSON.stringify(data));
							if(code == 'SUCCESS') {
								this.form = {
									...msg
								}
								this.imageUrl= this.form.activityUrl; // 图片赋值
								if(this.form.activityUrl!=""){
									this.dialogImageUrl = this.form.activityUrl+'?x-oss-process=style/small'; // 图片回填 - 本地图片
								}
								if(msg.activityJson == "关注微信公众号") {
									this.type = "关注微信公众号";
								}
								let activityJson = JSON.parse(msg.activityJson);
//																	console.log(activityJson)
								if(activityJson.type) {
									if(activityJson.type == "自定义链接") {
										this.type = "自定义链接";
										this.formCustom = activityJson;
//										console.log(JSON.stringify(activityJson))
										this.value2=activityJson.storeId.split(",");
										let array = activityJson.storeId.split(",");
										let arrayName = activityJson.storeName.split(",");
										array.forEach((val,index) => {
//											console.log(val)
											this.data2.push({
												index: index,
												storeName:'',
												storeId: val
											});
											this.value2.push(val);
										})
										arrayName.forEach((nameval,nameIndex)=>{
											this.data2[nameIndex].storeName=nameval;
										})
										this.storeArr =activityJson.storeName;
									}
									if(activityJson.type == "摇优惠券") {
										this.type = "摇优惠券";
										this.formCoupon = activityJson;
//										console.log(JSON.stringify(activityJson))
										let array = activityJson.storeId.split(",");
										let arrayName = activityJson.storeName.split(",");
										array.forEach((val,index) => {
//											console.log(val)
											this.data2.push({
												index: index,
												storeName:'',
												storeId: val
											});
											this.value2.push(val);
										})
										arrayName.forEach((nameval,nameIndex)=>{
											this.data2[nameIndex].storeName=nameval;
										})
										this.storeArrOther = activityJson.storeName; //选择门店input
										this.timeRangeArr.push(JSON.parse(activityJson.activityDate).activityDateBegin); //活动时间
										this.timeRangeArr.push(JSON.parse(activityJson.activityDate).activityDateEnd); //活动时间
//										this.draw = JSON.parse(activityJson.draw); //抽奖次数
//										console.log(activityJson.prizes)
										this.activeTempDtl = JSON.parse(activityJson.prizes); //奖品设置
										this.templateItems = [];
										this.count = JSON.parse(activityJson.prizes).length;
										JSON.parse(activityJson.prizes).forEach((val, index) => {
											this.templateItems.push({
												'id': index,
												'component': 'award',
												'data': JSON.parse(activityJson.prizes)[index]
											});
										})
									}
								}
							}
						})
						.catch((err) => {
							// console.log(err);
						})
					//					this.form={
					//						...data
					//					}
					//					this.dialogImageUrl=Cookie.get('baseUrl') +'/'+ this.form.activityUrl;
					//					console.log(JSON.stringify(this.form))
				} else {
					// console.log(1)
					this.iconAddTr();
				}
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
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
	
	.el-form {
		width: 100%;
		display: inline-block;
		padding: 0 rem(20px);
	}
	
	.el-tabs {
		margin-bottom: 10px;
	}
	
	.minH {
		min-height: 285px;
	}
	
	.activityContainer {
		width: 100%;
		border: 1px solid #C8C8C8;
		overflow: hidden;
	}
	
	.leftBox {
		width: 40%;
		float: left;
		overflow: hidden;
	}
	
	.rightBox {
		width: 60%;
		float: left;
		overflow: hidden;
		border-left: 1px solid #C8C8C8;
	}
	
	.rightBoxBorder {
		width:100%;
		border-left: 1px solid #C8C8C8;
	}
	
	.leftBoxBorder {
		border: none
	}
	
	.title {
		width: 100%;
		height: 40px;
		line-height: 40px;
		padding-left: 15px;
		background: #F2F2F2;
		color: #000000;
	}
	
	.activityInput {
		width: 52%;
		margin: 5px 10px;
		float: left;
	}
	
	.activityInputRea {
		position: relative;
	}
	
	.activityInputRea span {
		position: absolute;
		right: -20px;
	}
	
	.activitySpan {
		color: #AEAEAE;
	}
	
	.activityInputOther {
		width: 360px;
	}
	
	.activityInputOther .el-input {
		margin-left: 0px;
	}
	
	.activityInfo {
		padding-top: 10px;
		padding-left: 15px;
		padding-right: 15px;
		margin-bottom: 10px;
	}
	
	.activityLink {
		width: 40%;
		float: left;
		padding-left: 15px;
		padding-top: 15px;
	}
	
	.activityContainerM {
		margin-top: 20px;
	}
	/*弹出窗*/
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}	
	/*上传图片*/
	// 上传图片
	.icon-close {
		position: relative;
		display: inline-block;
		.el-icon-circle-close {
			font-size: 14px; 
			position: absolute;
			top: 10px;
			right: -7px;
			color: #fa5555;
			cursor: pointer;
		}
	}
	.avatar-uploader {
		height: 133px;
	}
	
	.avatar-uploader .el-upload {
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		border: 1px dashed #d9d9d9;
		width: 110px;
		height: 110px;
		line-height: 110px;
		text-align: center;
	}
	
	.avatar {
		width: 110px;
		height: 110px;
		float: left;
		margin-bottom: 15px;
		cursor: pointer;
	}
	/*行内文本*/
	
	.formText {
		float: left;
		margin-bottom: 0px;
	}
	/*行内form*/
	
	.inlineFormItem {
		width: 130px;
		float: left;
		margin: 0 10px;
	}
	
	.addBtn {
		cursor: pointer;
		border: 1px solid #d9d9d9;
		border-radius: 5px;
		text-align: center;
	}
	
	.deteleBtn {
		margin-bottom: 10px;
		cursor: pointer;
		border: 1px solid #d9d9d9;
		border-radius: 5px;
		text-align: center;
	}
	
	.recTime {
		width: 220px;
		display: inline-block;
	}
	
	.recTimeCount {
		width: 350px;
		display: inline-block;
	}
	.width270{
		width: 270px;
	}
	.width240{
		width: 240px;
	}
	.wid100{
		width: 100px;
	}
	.margin0{
		margin: 0;
	}
</style>