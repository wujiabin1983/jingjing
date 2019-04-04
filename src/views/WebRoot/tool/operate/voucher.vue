<!--积分兑券-新增-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'" class="marginBottom10">返回</el-button>
			<el-card>
				<el-form :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? norules : rules" ref="form" label-width="125px" class="demo-form">
					<el-form-item label="兑换名称" prop="exchangeName" class="name">
						<el-input v-model="form.exchangeName" :disabled="disabled" placeholder="请输入兑换名称"></el-input>
					</el-form-item>
					<el-form-item label="兑换图标" prop="iconUrl" v-if="this.getPageType != '查看'">
						<div class="icon-close" v-loading="imgLoading">
							<img v-if="imageUrl" :src="imageUrl" @click="clickTest" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
							<i v-if="imageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
						</div>
						<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
						<p class="activitySpan">图片建议尺寸：140像素*140像素</p>
					</el-form-item>
					<el-form-item label="兑换图标" prop="iconUrl" v-if="this.getPageType == '查看'">
						<img width="100%" :src="imageUrl" alt="" class="imageUrl" @click="handlePictureCardPreviewInfo">
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</el-form-item>
					<el-form-item label="使用组织" placeholder="请选择门店" prop="useObject">
						<el-input v-model="storeArr" :disabled="true" placeholder="请选择门店" class="store width220"></el-input>
						<el-button type="primary" id="search" v-if="this.getPageType!='查看'" @click="searchStorePop">选择</el-button>
					</el-form-item>
					<el-form-item label="选择券" prop="couponJson">
						<el-input v-model="coupTempName" :disabled="true" placeholder="选择券模板" class="width220"></el-input>
						<el-button type="primary" id="search" @click="coupTempClick" v-if="this.getPageType!='查看'">选择</el-button>
					</el-form-item>
					<el-form-item label="消费者等级" prop="consumerGrade">
						<el-input v-model="leavel" :readonly="disabled" v-if="this.getPageType=='查看'" class="width220"></el-input>
						<!--选择天-->
						<el-select v-model="leavel" multiple placeholder="请选择" @change="leavelChange" v-else>
							<el-option v-for="item in leavelOptions" :key="item.value" :label="item.key" :value="item.key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="使用说明" prop="instructions">
						<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入使用说明" v-model="form.instructions">
						</el-input>
					</el-form-item>
					<el-form-item label="兑换持续时间" prop="exchangeDate">
						<el-input v-model="form.exchangeDate" v-show=""></el-input>
						<el-radio-group v-model="activityDate" @change="radioTimeHandle">
							<div class="mrgBottom10">
								<el-radio label="时间段" :disabled="disabled">
									<el-date-picker :picker-options="pickerOptions0" :disabled="datePickerDisabled" v-model="timeRangeArr" @change="selectDate" :editable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-radio>
							</div>
							<div>
								<el-radio label="长期" :disabled="disabled">长期</el-radio>
							</div>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="券发放总量" prop="grantNum" class="name">
						<el-input v-model="form.grantNum" :disabled="disabled" placeholder="请输入券发放总量"></el-input>
					</el-form-item>
					<el-form-item label="券有效期" prop="coupNum">
						<el-radio-group v-model="coupNo" @change="radioChange" class="marginTop10">
							<div>
								<el-radio label="长期" class="radio" :disabled="disabled">
									<div class="radioInfo">
										<span class="formText">自领取之日起</span>
										<el-input class="inlineFormItem" v-model="form.coupNum" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
										<span class="formText">天内有效</span>
									</div>
								</el-radio>
							</div>
							<div class="activityContainerM" v-if="activityDate!='长期'">
								<el-radio label="时间段" :disabled="disabled">
									<el-date-picker :picker-options="pickerOptions0" :disabled="dateCoupDisabled" v-model="timeCoupArr" :editable="false" @change="selectCoupDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-radio>
							</div>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="兑换需积分值" prop="integralValue" class="name">
						<el-input v-model="form.integralValue" :disabled="disabled" placeholder="请输入兑换需积分值"></el-input>
					</el-form-item>
					<el-form-item label="每人限兑换次数" prop="restrictNum" class="name">
						<el-input v-model="form.restrictNum" :disabled="disabled" placeholder="请输入每人限兑换次数" class="restrictNumInput"></el-input><span class="restrictNumSpan">次</span>
					</el-form-item>
					<el-form-item label="审核人" prop="auditBy">
						<el-input v-model="form.auditBy" class="width220" :disabled="disabled" v-if="this.getPageType=='查看'" placeholder="请输入"></el-input>
						<el-select v-model="form.auditBy" placeholder="请选择审核人" @change="audioSelect" v-else>
							<el-option v-for="item in audioUser" :key="item.key" :label="item.key" :value="item.index">
							</el-option>
						</el-select>
					</el-form-item>
					<div v-if="this.getPageType!='查看'" class="el-footer-btn-con">
						<el-button @click="handleBack">取消</el-button>
						<el-button type="primary" @click="save">保存</el-button>
						<el-button type="primary" @click="submit">提交</el-button>
					</div>
				</el-form>
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
				<el-dialog title="" :visible.sync="handleTabDialogCoup" class="dialogTab">
					<template>
						<el-tabs v-model="activeName1" @tab-click="handleClickCoup">
							<el-tab-pane label="选择优惠券" name="first" v-loading="tableSelectLoading" >
								<div class="search">
									<el-select v-model="couponType" class="searchContent" clearable placeholder="请选择券类型">
										<el-option label="礼品券" value="礼品券"></el-option>
										<el-option label="折扣券" value="折扣券"></el-option>
										<el-option label="代金券" value="代金券"></el-option>
									</el-select>
									<el-input v-model="coupLibraryKey" class="searchContent" placeholder="请输入券ID或券名称"></el-input>
									<el-button type="primary" id="search" @click="searchLibrary">搜索</el-button>
								</div>
								<el-table ref="tableDataTab" :data="coupDataTab" highlight-current-row border class="el-tableRadio" @current-change="handleSelectionChangeTab">
									<el-table-column type="index" width="50" label="序号"></el-table-column>
									<el-table-column prop="couponType" label="类型"></el-table-column>
									<el-table-column prop="coupName" label="券名称"></el-table-column>
								</el-table>
								<!-- 分页 -->
								<el-footer v-if="count != 0">
									<el-pagination background layout="total,prev, pager, next, jumper" :page-size="limit" :total="count" @current-change="handleCoupChange">
									</el-pagination>
								</el-footer>
							</el-tab-pane>
							<el-tab-pane label="选择券包" name="second" v-loading="tableSelectLoading" >
								<div class="search">
									<el-input v-model="coupPackInfo" class="searchContent" placeholder="请输入券包名称"></el-input>
									<el-button type="primary" id="search" @click="searchPackage">搜索</el-button>
								</div>
								<el-table ref="tableDataTab" :data="coupPackDataTab" highlight-current-row border class="el-tableRadio" @current-change="handlePackSelectionChangeTab">
									<el-table-column type="index" width="50" label="序号"></el-table-column>
									<el-table-column prop="coupPackName" label="券包名称"></el-table-column>
								</el-table>
								<!-- 分页 -->
								<el-footer v-if="count != 0">
									<el-pagination background layout="total,prev, pager, next, jumper" class="pagination" :page-size="limit" :total="countPack" @current-change="handleCoupPackChange">
									</el-pagination>
								</el-footer>
							</el-tab-pane>
							<el-tab-pane label="选择门店券" name="third" v-loading="tableSelectLoading">
								<div class="search">
									<el-input v-model="storeLibName" class="searchContent" placeholder="请输入门店券名称"></el-input>
									<el-button type="primary" id="search" @click="searchStoreLibrary">搜索</el-button>
								</div>
								<el-table ref="tableDataTab"  :data="coupDataTab" class="el-tableRadio" highlight-current-row border @current-change="handleSelectionChangeTab2">
									<el-table-column type="index" width="50" label="序号"></el-table-column>
									<el-table-column prop="storeLibId" label="券ID"></el-table-column>
									<el-table-column prop="storeLibName" label="券名称"></el-table-column>
									<el-table-column prop="enableBy" label="创建人"></el-table-column>
								</el-table>
								<!-- 分页 -->
								<el-footer v-if="countStore!=0">
									<el-pagination background class="pagination" layout="total,prev, pager, next, jumper" :page-size="limit" :total="countStore" @current-change="handleStoreChange">
									</el-pagination>
								</el-footer>
							</el-tab-pane>
						</el-tabs>
					</template>
					<div slot="footer" class="dialog-footer overHidden">
						<el-button @click="handleTabDialogCoup = false">取 消</el-button>
						<el-button type="primary" @click="enterCoup">确 定</el-button>
					</div>
				</el-dialog>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { uploadImg } from '@/api/base/brandInfo'
	import { returnSelectedFile } from '@/api/upload'
	import { selectCouponLibraryJurisdiction } from '@/api/member/couponLibrary'
	import { selectCouponPackageJurisdiction } from '@/api/member/couponPackage'
	import { selectStoreVoucherLibraryJurisdiction } from '@/api/member/storeVoucherLibrary'
	import { validateInt, validateFloat } from '@/utils/validate'
	import { selectAudioUser, selectLevalInfo, selectProCityArea, selectStoreData, selectTabData, getBrandInfo } from '@/api/public'
	import { creatVoucherData, setVoucherData } from '@/api/tool/voucher'
	import Cookie from 'js-cookie'
	import { mapGetters } from 'vuex'

	const isInt = (rule, value, callback) => {
		if(!validateInt(value)) {
			callback(new Error('请输入有效数字'))
		} else {
			callback()
		}
	}
	const isFloat = (rule, value, callback) => {
		if(!validateFloat(value)) {
			callback(new Error('请输入有效数字'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				tableSelectLoading:false,
				storeLibName: '',
				audioUser: [], //审核人
				coupNo: '长期', //
				activityDate: '长期', //兑换持续时间
				type: '',
				timeRangeArr: [], //兑换持续时间
				timeCoupArr: [], //券有效期
				leavel: [], //消费者等级
				leavelOptions: [], //消费者等级下拉数据
				dialogVisible: false, //图片查看
				activeName: "first",
				brandLogoInfo: '',
				dialogImageUrl: '', // 图片列表
				imageUrl: '',
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				// 弹窗优惠券分页
				disabled: false,
				page: 0, // 
				pagePack: 0, // 
				pageStore: 0, // 当前页
				count: 0, // 
				countPack: 0, // 总条数
				countStore: 0, // 总条数
				limit: 5, // 条/页
				handleTabDialogCoup: false, //优惠券弹窗
				handleTabDialog: false, //门店弹窗
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				coupPackInfo: '', //券包
				coupLibraryKey: '', //优惠券库 id 和 name
				couponType: '', //优惠券库类型
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值optionsProCityAreaPop: [],//级联选择器省市区数据
				optionsProCityAreaPop: [], //级联选择器省市区数据
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				storeArr: '', //门店input容器
				coupTempName: '', //优惠券input容器
				activeName: 'first',
				activeName1: 'first',
				tabType: '门店',
				coupDataTab: [], //弹窗优惠券
				coupPackDataTab: [], //弹窗券包
				dateInputDisabled: false, //券有效期
				dateCoupDisabled: true, //券有效期
				datePickerDisabled: true, //兑换持续时间
				dialogVisibleInfo: false,
				// 搜索数据
				form: {
					"exchangeName": "", //兑换活动名称
					"iconUrl": "", //兑换图标
					"useObject": "", //使用对象（json格式字符串）
					"couponType": "", //券类型（代金券/折扣券/礼品券）
					"couponJson": "", //优惠券对象（json格式字符串）
					"consumerGrade": "", //消费者等级（json格式字符串)
					"instructions": "", //使用说明
					"exchangeDate": "长期", //兑换时间（json格式字符串）
					"grantNum": "", //发放量
					"validityDate": "", //券有效期（json格式字符串）
					"integralValue": "", //兑换所需积分值
					"restrictNum": "", //每人限兑次数（0为不限制）
					"auditPersionId": "", //审核人id
					"auditBy": "" //审核人姓名
				},
				// 表格数据
				norules: {},
				rules: {
					exchangeName: [{
						required: true,
						message: '请输入兑换活动名称',
						trigger: 'change'
					}],
					iconUrl: [{
						required: true,
						message: '请选择兑换图标',
						trigger: 'change'
					}],
					useObject: [{
						required: true,
						message: '请选择使用组织',
						trigger: 'change'
					}],
					couponJson: [{
						required: true,
						message: '请选择优惠券',
						trigger: 'change'
					}],
					consumerGrade: [{
						required: true,
						message: '请选择消费者等级',
						trigger: 'change'
					}],
					exchangeDate: [{
						required: true,
						message: '请选择兑换时间',
						trigger: 'change'
					}],
					grantNum: [{
							required: true,
							message: '请输入发放量',
							trigger: 'change'
						},
						{
							validator: isInt
						}
					],
					coupNum: [{
						required: true,
						message: '请输入券有效期',
						trigger: 'change'
					}],
					integralValue: [{
							required: true,
							message: '请输入兑换所需积分值',
							trigger: 'change'
						},
						{
							validator: isFloat
						}
					],
					restrictNum: [{
							required: true,
							message: '请输入每人限兑次数',
							trigger: 'change'
						},
						{
							validator: isInt
						}
					],
					auditBy: [{
						required: true,
						message: '请选择审核人',
						trigger: 'change'
					}]
				},
//				brandName: '', //品牌下拉值
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				imgLoading: false
			}
		},
		methods: {
			handleStoreChange(val) {
				this.pagePack = val;
				this.showStoreLibrary(val, this.limit);
			},
			//点击搜索门店券库
			searchStoreLibrary() {
				this.showStoreLibrary('', this.limit);
			},
			//查询门店券库
			showStoreLibrary(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"storeLibName": this.storeLibName
				}
				// 使表格加载
				//			console.log(params)
				that.tableSelectLoading=true;
				// 查询接口
				selectStoreVoucherLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//					console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						that.coupDataTab=[];
						if(data.data) {
							that.coupDataTab = data.data;
							that.countStore = data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						//					console.log(err);
					});
			},
			//选择审核人
			audioSelect(val) {
				//      	console.log(this.audioUser[val].value);
				this.form.auditPersionId = this.audioUser[val].value;
				this.form.auditBy = this.audioUser[val].key;
			},
			//消费者等级consumerGrade
			leavelChange(data) {
				let str = '';
				data.forEach((val, index) => {
					str += val + ",";
				})
				//			console.log(str.substr(0, str.length - 1))
				this.form.consumerGrade = str.substr(0, str.length - 1);
			},
			// 兑换持续时间单选
			radioTimeHandle(str) {
				this.type = str;
				if(this.type == '时间段') {
					this.datePickerDisabled = false;
					this.form.exchangeDate = "";
				}
				if(this.type == '长期') {
					this.form.exchangeDate = "长期";
					this.datePickerDisabled = true;
				}
//				console.log(this.form.exchangeDate)
			},
			// 券有效期单选
			radioChange(str) {
				this.type = str;
				if(this.type == '时间段') {
					this.dateCoupDisabled = false;
					this.dateInputDisabled = true;
					this.form.validityDate = "";
					this.form.coupNum = "";
				} else if(this.type == '长期') {
					this.timeCoupArr = [];
					this.dateCoupDisabled = true;
					this.dateInputDisabled = false;
					this.form.validityDate = "";
				}
			},
			//兑换持续时间选择时间监听
			selectDate(val) {
				//      	console.log(val)
				var params = {
					exchangeDateBegin: val[0],
					exchangeDateEnd: val[1]
				}
				// console.log(JSON.stringify(params)+"?")
				this.form.exchangeDate = JSON.stringify(params);
			},
			//券有效期选择时间监听
			selectCoupDate(val) {
				//      	console.log(val)
				var params = {
					validityDateBegin: val[0],
					validityDateEnd: val[1]
				}
				this.form.coupNum = JSON.stringify(params);
				this.form.validityDate = JSON.stringify(params);
			},
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!files) {
					return false;
				} else {
					if(!/image\/\w+/.test(files.type)) {
						this.$message("请上传一张图片");
						return false;
					}
					this.imgLoading = true;
					var reader = new FileReader();
					reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件 
					//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片 
					reader.onload = function(e) {
						// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
						// that.$refs.uploadSubmit.dispatchEvent(new MouseEvent('click')); // 上传图片
						let formData = new FormData(); // 可以增加表单数据
						formData.append("file", files); // 文件对象
						uploadImg(formData)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								// console.log(msg.fileName)
								that.imgLoading = false;
								if(code == 'SUCCESS') {
									that.form.iconUrl = msg.fileName; // 图片赋值
									that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
									that.imageUrl = msg.fileName + '?x-oss-process=style/small';
									that.$message.success('上传成功');
								} else {
									that.$message({
										message: msg,
										type: 'warning'
									});
								}
							})
							.catch((err) => {
								// console.log(err);
								that.imgLoading = false;
							})
					}
				}
			},
			clickTest() {
				// 点击测试
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handlePictureCardPreviewInfo(file) { // 图片查看
				this.dialogVisibleInfo = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.imageUrl = '';
				this.form.brandLogo = '';
				this.$refs.uploadIpt.value = '';
			},
			// 弹窗优惠券分页
			handleCoupChange(val) {
				this.page = val;
				this.showCouponLibrary(val, this.limit);
			},
			handleSelectionChangeTab(val) {
				//	        	console.log(JSON.stringify(val))
				if(val) {
					this.form.couponType = val.couponType;
					let params = {
						coupName: val.coupName,
						coupId: val.coupId
					}
					this.coupTempName = val.coupName;
					this.form.couponJson = JSON.stringify(params); //@
				}
			},
			handleCoupPackChange(val) {
				this.pagePack = val;
				this.showCouponLibrary(val, this.limit);
			},
			handlePackSelectionChangeTab(val) {
				// console.log(JSON.stringify(val))
				if(val) {
					let params = {
						coupName: val.coupPackName,
						coupId: val.id
					}
					this.form.couponType = "门店券";
					this.coupTempName = val.coupPackName;
					this.form.couponJson = JSON.stringify(params); //@
				}
			},
			handleSelectionChangeTab2(val) {
				if(val) {
					let params = {
						coupName: val.storeLibName,
						coupId: val.storeLibId
					}
					this.form.couponType = "门店券";
					this.coupTempName = val.storeLibName;
					this.form.couponJson = JSON.stringify(params); //@
				}
			},
			//点击选择券模板
			coupTempClick() {
				this.showCouponLibrary(this.page, this.limit);
				this.handleTabDialogCoup = true;
			},
			//监听弹窗tab页
			handleClickCoup(tab, event) {
				//			console.log(tab.label)
				this.tabType = tab.label;
				if(tab.label == "选择优惠券") {
					this.showCouponLibrary(this.page, this.limit);
				}
				if(tab.label == "选择券包") {
					this.showCouponPackage(this.pagePack, this.limit);
				}
				if(tab.label == "选择门店券") {
					this.showStoreLibrary(this.pageStore, this.limit);
				}
				this.data2 = [];
				this.value2 = [];
			},
			//点击搜索优惠券库
			searchLibrary() {
				this.showCouponLibrary('', this.limit);
			},
			//点击搜索券包
			searchPackage() {
				this.showCouponPackage('', this.limit);
			},
			//查询优惠券库
			showCouponLibrary(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"coupLibraryKey": this.coupLibraryKey,
					"couponType": this.couponType
				}
				this.tableSelectLoading=true;
				//			console.log(params)
				// 使表格加载
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						if(data.data) {
							that.coupDataTab = data.data;
							that.count = data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
			},
			//查询券包
			showCouponPackage(start, limit) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					coupPackName: this.coupPackInfo
				}
				// 使表格加载
				// 查询接口
				that.tableSelectLoading=true;
				selectCouponPackageJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						if(data.data) {
							that.countPack = data.count;
							that.coupPackDataTab = data.data;
						} else if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
			},
			//弹窗确认
			enterCoup(val) {
				this.handleTabDialogCoup = false;
			}, //下面的门店  上面的优惠券//
			//监听tab页
			handleClick(tab, event) {
				this.tabType = event.target.firstChild.data;
				this.searchStoreTab();
				this.data2 = [];
				this.value2 = [];
				this.dataIndex = [];
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
				this.handleTabDialog = true;
			},
			//监听穿梭框事件
			storeArray(val) {
				// console.log(val)
				var idArray = '';
				var nameArray = '';
				var that = this;
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
				this.storeArr = nameArray;
				let flag = '';
				if(this.tabType == "门店") {
					flag = 0;
				}
				if(this.tabType == "店组") {
					flag = 1;
				}
				if(this.tabType == "区域") {
					flag = 2;
				}
				let params = {
					flag: flag,
					idArray: idArray,
					nameArray: nameArray
				}
				this.form.useObject = JSON.stringify(params); //@
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
				//				console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(JSON.stringify(data))
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
							//						console.log(err);
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
							//						console.log(err);
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
			//取消
			handleBack() {
				this.$router.push({
					name: '积分兑券',
					params: {
						pageType: this.getPageTypes,
					}
				});
			},
			//保存
			save() {
				let that = this;
				if(this.form.coupNum != "") {
					this.form.validityDate = this.form.coupNum;
				}
				this.$refs['form'].validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						var params = {
							userId: this.userInfo.userCode,
							...this.form,
							status: '暂存'
						}
						// console.log(JSON.stringify(params))
						if(this.getPageType == '添加' || this.getPageType == '复制') {
							creatVoucherData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									//						console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '积分兑券'
										});
										that.$message.success(data.messageContent);
										that.tableLoading = false;
									} else {
										that.$message.error(data.messageContent);
										that.tableLoading = false;
									}
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
						if(this.getPageType == '修改') {
							setVoucherData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									// console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '积分兑券'
										});
										that.$message.success(data.messageContent);
										that.tableLoading = false;
									} else {
										that.$message.error(data.messageContent);
										that.tableLoading = false;
									}
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			//提交
			submit() {
				let that = this;
				if(this.form.coupNum != "") {
					this.form.validityDate = this.form.coupNum;
				}
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var params = {
							userId: this.userInfo.userCode,
							...this.form,
							status: '未审核'
						}
						if(this.activityDate=='时间段'){
							var activityDate = new Date(that.timeRangeArr[1]).getTime();
							var coupDate = new Date(that.timeCoupArr[1]).getTime();
							if(activityDate>coupDate){
								that.$message.warning('优惠券有效期不能小于活动日期！');
								return false;
							}
						}
						that.tableLoading = true;
//						console.log(JSON.stringify(params));
						if(this.getPageType == '添加' || this.getPageType == '复制') {
							creatVoucherData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									//						console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '积分兑券'
										});
										that.$message.success(data.messageContent);
										that.tableLoading = false;
									} else {
										that.$message.error(data.messageContent);
										that.tableLoading = false;
									}
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
						if(this.getPageType == '修改') {
							setVoucherData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									// console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '积分兑券'
										});
										that.$message.success(data.messageContent);
										that.tableLoading = false;
									} else {
										that.$message.error(data.messageContent);
										that.tableLoading = false;
									}
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			//复选框
			handleCheckedChange(value) {
				if(!value) {
					$(".title").hide();
				} else {
					$(".title").show();
				}
			},
			handleCheckedChange1(value) {
				if(!value) {
					$(".headerImg").hide();
				} else {
					$(".headerImg").show();
				}
			},
			handleCheckedChange2(value) {
				if(!value) {
					$(".name").hide();
				} else {
					$(".name").show();
				}
			},
			handleCheckedChange3(value) {
				if(!value) {
					$(".twoImg").hide();
				} else {
					$(".twoImg").show();
				}
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		},
		created() {
			//			this.showTable('', '', '');
			let that = this;
			var params = {
				userId: this.userInfo.userCode
			}
			that.tableLoading = true;
			selectAudioUser(params) //请求审核人
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					//console.log(JSON.stringify(data)+"审核人")
					that.audioUser = data.data;
					that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
			var params = {
				userId: this.userInfo.userCode
			}
			that.tableLoading = true;
			selectLevalInfo(params) //请求等级
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					let result = [];
					//console.log(JSON.stringify(data)+"等级")
					that.leavelOptions = data.data;
					that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
			// 钩子函数 -- 初始化
//			var params = {
//				userId: this.userInfo.userCode,
//				userType: this.userInfo.userType
//			}
//			//			console.log(params)
//			getBrandInfo(params)
//				.then((res) => {
//					let data = JSON.parse(Base64.decode(res.data));
//					//	        		console.log(JSON.stringify(data)+"所属品牌")
//					this.brandName = data.messageContent.brandName;
//				})
//				.catch((err) => {
//					// console.log(err)   		
//				})
			// console.log(this.getPageType);
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.dateCoupDisabled = true;
				this.dateInputDisabled = true;
				this.datePickerDisabled = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
//				console.log(this.getFormData)
				this.dialogImageUrl = this.form.iconUrl;
				if(this.form.iconUrl != "") {
					this.imageUrl = this.form.iconUrl + '?x-oss-process=style/small';
				}
				this.coupTempName = this.form.couponJson.coupName;
				this.storeArr = this.form.useObject.nameArray;
				this.leavel = this.form.consumerGrade;
				//兑换持续时间
				if(this.form.exchangeDate != "长期") {
					if(!this.form.exchangeDate.exchangeDateEnd){
						this.activityDate = "长期";
					}else{
						this.timeRangeArr.push(this.form.exchangeDate.exchangeDateBegin);
						this.timeRangeArr.push(this.form.exchangeDate.exchangeDateEnd);
						this.activityDate = "时间段";
					}
				} else {
					this.activityDate = "长期";
				}
				//券有效期
				if(this.form.validityDate.validityDateBegin) {
					this.timeCoupArr.push(this.form.validityDate.validityDateBegin);
					this.timeCoupArr.push(this.form.validityDate.validityDateEnd);
					this.coupNo = "时间段";
				} else {
					this.form.coupNum = this.form.validityDate;
					this.coupNo = "长期";
				}
				this.form.useObject = JSON.stringify(this.form.useObject);
				this.form.couponJson = JSON.stringify(this.form.couponJson);
				this.form.exchangeDate = JSON.stringify(this.form.exchangeDate);
			} else if(this.getPageType == '修改' || this.getPageType == '复制') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				//				delete this.form.modifiedOn
				//				delete this.form.createdOn
				//				delete this.form.setDate
				//				delete this.form.auditDate
//				console.log(JSON.stringify(this.form));
				this.dialogImageUrl = this.form.iconUrl;
				if(this.form.iconUrl != "") {
					this.imageUrl = this.form.iconUrl + '?x-oss-process=style/small';
				}
				this.coupTempName = this.form.couponJson.coupName;
				// console.log(this.form.couponType.coupName)
				this.storeArr = this.form.useObject.nameArray;
				this.leavel = this.form.consumerGrade.split(",");
				//console.log(this.leavel)
				//兑换持续时间
				if(this.form.exchangeDate != "长期") {
					this.timeRangeArr.push(res.exchangeDate.exchangeDateBegin);
					this.timeRangeArr.push(res.exchangeDate.exchangeDateEnd);
					this.activityDate = "时间段";
					this.datePickerDisabled = false;
				} else {
					this.activityDate = "长期";
					this.datePickerDisabled = true;
				}
				//券有效期
				if(this.form.validityDate.validityDateBegin) {
					this.timeCoupArr.push(res.validityDate.validityDateBegin);
					this.timeCoupArr.push(res.validityDate.validityDateEnd);
					this.coupNo = "时间段";
					this.dateInputDisabled = true;
					this.dateCoupDisabled = false;
				} else {
					this.form.coupNum = this.form.validityDate;
					this.dateCoupDisabled = true;
					this.dateInputDisabled = false;
					this.coupNo = "长期";
				}
				this.form.useObject = JSON.stringify(this.form.useObject);
				this.form.couponJson = JSON.stringify(this.form.couponJson);
				this.form.exchangeDate = JSON.stringify(this.form.exchangeDate);
				//				this.form.grantNum = JSON.stringify(this.form.grantNum);
				//				this.form.integralValue = JSON.stringify(this.form.integralValue);
				//				this.form.restrictNum = JSON.stringify(this.form.restrictNum);
				this.form.validityDate = JSON.stringify(this.form.validityDate);
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
			getPageTypes() {
				return this.$route.params.pageTypes;
			},
			getFormData() {
				return this.$route.params.formData;
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.demo-form{
		width: 42%;
		margin: 0 auto;
		display: block;
		margin-left: 29%;
	}
	.el-form {
		display: inline-block;
	}
	
	.el-tabs {
		margin-bottom: 10px;
	}
	
	.el-button {
		margin-left: 10px;
	}
	
	.inlineFormItem {
		width: 130px;
	}
	.imageUrl{
		width:134px;
		height:134px;
		display: inline-block;
	}
	.radio {
		position: relative;
		width: 100%;
	}
	
	.radioInfo {
		position: absolute;
		left: 24px;
		top: -8px;
	}
	
	.searchContent {
		width: 150px;
		margin-bottom: 10px;
	}
	
	.activityContainerM {
		margin-top: 20px;
	}
	/*上传图片*/
	
	// 上传图片
	.icon-close {
		position: relative;
		display: inline-block;
		.el-icon-circle-close {
			font-size: 14px;
			position: absolute;
			top: -5px;
			right: -7px;
			color: #fa5555;
			cursor: pointer;
		}
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
		border-radius: 8px;
		width: 140px;
		height: 140px;
		line-height: 140px;
		text-align: center;
		float: left;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 140px;
		height: 140px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		float: left;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	.activitySpan {
		display: block;
		color: #AEAEAE;
	}
	.restrictNumInput{
		width: 90%;
	}
	.restrictNumSpan{
		padding-left: 10px;
	}
	.width220{
		width: 220px;
	}
</style>