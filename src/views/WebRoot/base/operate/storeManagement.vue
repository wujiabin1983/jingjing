<!--门店管理-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card>
				<el-form :model="form" v-loading="tableLoading" :rules="this.getPageType=='查看' ? norules : rules" v-if="" ref="form" label-width="130px" class="demo-form">
					<!--<el-row :gutter="10">
						<el-col :span="8">-->
					<el-form-item label="品牌名称" prop="brandId" v-show="false">
						<el-input v-model="form.brandId" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="品牌名称" prop="brandName" v-if="this.getpageTypeOther!='导入详情'">
						<el-input v-model="form.brandName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="门店编码" prop="storeId">
						<el-input v-model="form.storeId" :disabled="disabled" placeholder="请输入门店编码"></el-input>
					</el-form-item>
					<el-form-item label="门店名称" prop="storeName">
						<el-input v-model="form.storeName" :disabled="disabled" placeholder="请输入门店名称"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="contactNumber1">
						<el-input v-model="form.contactNumber1" :disabled="disabled" placeholder="请输入联系电话一"></el-input>
					</el-form-item>
					<el-form-item label="" prop="contactNumber2">
						<el-input v-model="form.contactNumber2" :disabled="disabled" placeholder="请输入联系电话二"></el-input>
					</el-form-item>
					<!--<el-form-item label="省/市/区" prop="provinceName">
						<el-input v-if="this.getPageType=='查看'&&form.provinceName!=''" :disabled="disabled" placeholder="请输入省/市/区" :value="form.provinceName + '/' + form.cityName + '/' + form.areaName"></el-input>
						<el-input v-if="this.getPageType=='查看'&&form.provinceName==''" :disabled="disabled" placeholder="请输入省/市/区"></el-input>
						<el-cascader v-if="this.getPageType!='查看'" :options="optionsProCityArea" v-model="form.province" id="add" clearable @active-item-change="cascaderSelect" @change="selectChange" @click="focusSelect"></el-cascader>
					</el-form-item>-->
					<el-form-item label="省" prop="provinceName">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="" :value="form.provinceName"></el-input>
						<el-select v-model="form.provinceName" v-else filterable placeholder="请选择" @change="provinceChange">
							<el-option v-for="item in optionsPro" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="市" prop="cityName">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="" :value="form.cityName"></el-input>
						<el-select v-model="form.cityName" filterable v-else placeholder="请选择" @change="cityChange">
							<el-option v-for="item in optionsCity" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="区" prop="areaName">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="" :value="form.areaName"></el-input>
						<el-select v-model="form.areaName" filterable v-else placeholder="请选择" @change="areaChange">
							<el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="详细地址" prop="addr">
						<el-input v-model="form.addr" :disabled="disabled" placeholder="不含省市区县,填写地址和门牌号"></el-input>
					</el-form-item>
					<el-form-item label="地标位置" prop="" v-if="this.getPageType=='查看'" class="btn-position methodsInfo">
						<el-button type="primary" @click="methodsInfo()" size="small">查看地标位置</el-button>
					</el-form-item>
					<el-form-item label="地标位置" prop="longitude" v-else class="btn-position methodsInfo">
						<el-button type="primary" @click="getMap()"  size="small">地标位置</el-button><span class="lonlat" v-if="form.longitude!=''">经度：{{form.longitude}}</span><span class="lonlat" v-if="form.latitude!=''"> 维度：{{form.latitude}}</span>
					</el-form-item>
					<el-form-item label="经营资质证件号" prop="credential">
						<el-input v-model="form.credential" :disabled="disabled" placeholder="请输入经营资质证件号"></el-input>
					</el-form-item>
					<el-form-item label="类目" prop="category">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="请输入类目" :value="form.category"></el-input>
						<el-select v-model="form.category" v-else filterable placeholder="请选择" @change="categoryChange">
							<el-option v-for="item in categoryData" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="营业时间" prop="businessTimeBegin">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" class="middle-input middle-input-date" v-model="form.businessTimeBegin" placeholder=""></el-input>
						<el-time-select v-else placeholder="起始时间" class="middle-input middle-input-date" id="middle-input-date"  @change="beginDate" v-model="businessTimeBegin" :picker-options="{
							      start: '00:00',
							      step: '00:15',
							      end: '23:45',
							      maxTime: businessTimeEnd
							    }">
						</el-time-select><span class="labelOterDate">至</span>
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" class="middle-input middle-input-date" v-model="form.businessTimeEnd" placeholder=""></el-input>
						<el-time-select v-else placeholder="结束时间" class=" middle-input middle-input-date" id="middle-input-date" @change="endDate" v-model="businessTimeEnd" :picker-options="{
							      start: '00:00',
							      step: '00:15',
							      end: '23:45',
							      minTime: businessTimeBegin
							    }">
						</el-time-select>
					</el-form-item>
					<el-form-item label="门店别名" prop="storeAliasName">
						<el-input v-model="form.storeAliasName" :disabled="disabled" placeholder="请输入门店别名"></el-input>
					</el-form-item>
					<el-form-item label="门店面积" prop="storeArea">
						<el-input class="middle-input" :disabled="disabled" v-model="form.storeArea" placeholder="请输入门店面积"></el-input><span class="labelOter">平方米</span>
					</el-form-item>
					<el-form-item label="门店人数" prop="storePerNumber">
						<el-input class="middle-input" :disabled="disabled" v-model="form.storePerNumber" placeholder="请输入门店人数"></el-input><span class="labelOter">人</span>
					</el-form-item>
					<el-form-item label="是否启用" prop="shelvesStatus">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.shelvesStatus" placeholder="请选择上架状态"></el-input>
						<el-radio-group v-else v-model="form.shelvesStatus">
							<el-radio label="是">是</el-radio>
							<el-radio label="否">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="同步到微信" prop="auditStatus">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.auditStatus" placeholder="同步到微信"></el-input>
						<el-radio-group v-else v-model="form.auditStatus" @change="auditChange">
							<el-radio label="是">是</el-radio>
							<el-radio label="否">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="标签" prop="label">
						<el-input v-model="form.label" :disabled="disabled" placeholder="请输入标签"></el-input>
					</el-form-item>
					<!--</el-col>
						<el-col :span="8">-->
					<el-form-item label="负责人/店长" prop="storeManager">
						<el-input v-model="form.storeManager" :disabled="disabled" placeholder="请输入负责人/店长"></el-input>
					</el-form-item>
					<el-form-item label="是否默认门店" prop="auditStatus">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.isDefault"></el-input>
						<el-radio-group v-else v-model="form.isDefault">
							<el-radio label="是">是</el-radio>
							<el-radio label="否">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="门店分类" prop="storeType">
						<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.storeType" placeholder="请输入门店分类"></el-input>
						<el-select v-else v-model="form.storeType" placeholder="请选择" @change="roleSelect">
							<el-option v-for="item in storeTypeData" :key="item.key" :label="item.key" :value="item.index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="门店简介" prop="storeDesc">
						<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入门店简介" v-model="form.storeDesc">
						</el-input>
					</el-form-item>
					<el-form-item label="备注" prop="remarks">
						<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入备注" v-model="form.remarks">
						</el-input>
					</el-form-item>
					<el-form-item label="门店照片" prop="storeUrl" v-if="this.getPageType!='查看'">
						<!-- <el-button type="primary" @click="clickTest">上传图片</el-button>
						<el-button type="primary" @click="handleUploadDelete">删除</el-button> -->
						<div class="icon-close" v-loading="imgLoading">
							<img v-if="dialogImageUrl" :src="dialogImageUrl" @click="clickTest" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
							<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
						</div>
						<form :action="uploadAction" method="post" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="storeUrl" alt="">
						</el-dialog>
						<span class="activitySpan">图片建议尺寸：140像素*140像素</span>
					</el-form-item>
					<el-form-item label="门店照片" v-if="this.getPageType=='查看'">
						<i v-if="dialogImageUrl==''" class="el-icon-plus avatar-uploader-icon"></i>
						<img class="avatar" v-else :src="dialogImageUrl" alt="" @click="handlePictureCardPreviewInfo">
						<el-dialog :visible.sync="dialogVisibleInfo">
							<img width="100%" :src="storeUrl" alt="">
						</el-dialog>
					</el-form-item>
					<div v-if="this.getPageType != '查看'" class="el-footer-btn">
						<div class="el-footer-btn-con">
							<el-button @click="handleBack">返  回</el-button>
							<el-button type="primary" @click="submitForm('form')">确  定</el-button>
						</div>
					</div>
				</el-form>
			</el-card>
			<el-dialog :visible.sync="handleMapDialog">
				<span>地标位置：{{form.provinceName+form.cityName+form.areaName+form.addr}}</span><span class="lonlat">经度：{{form.longitude}}</span><span class="lonlat"> 维度：{{form.latitude}}</span>
				<div id="map"></div>
				<span slot="footer" class="dialog-footer">
				  <el-button @click="handleMapDialog = false">关 闭</el-button>
				</span>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail, validateInt, validateFloat} from '@/utils/validate';
	import { selectProCityArea, getBrandInfo,getCategory } from '@/api/public'
	import Cookie from 'js-cookie'
	import { addStoreManagement, setStoreManagement } from '@/api/base/storeManagement'
	// import { uploadImg } from '@/api/base/storeManagement'
	import { uploadImg } from '@/api/base/brandInfo'
	import { mapGetters } from 'vuex'
	import { returnSelectedFile } from '@/api/upload'
	import merchantManagerUserDD from '../component/merchantManagerUserDD.vue'
	const isMobile = (rule, value, callback) => {
		if(!validateMobile(value)&&!validateTel(value)) {
			callback(new Error('请输入正确的联系方式'))
		} else {
			callback()
		}
	}
	const isMobiles = (rule, value, callback) => {
		if(value != "") {
//			console.log(value)
			if(!validateMobile(value)&&!validateTel(value)) {
//			console.log(value)
				callback(new Error('请输入正确的联系方式'))
			} else {
//			console.log(!validateMobile(value)&&!validateTel(value))
				callback()
			}
		} else {
//			console.log(value)
			callback()
		}
	}
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	const isFloat = (rule, value, callback) => {
		if(value != "") {
			if(!validateFloat(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				category:'',
				categoryData:[],//类目
				imgLoading:false,//门店上传照片加载窗
				handleMapDialog: false,//地图弹窗
				tableLoading: false,//表格加载窗
				storeUrl: '',//显示图片
				uploadActUrl: '', //上传图片请求地址
				handleStoreDialog: false, //弹窗标识
				disabled: false, //查看的时候的只读标识
				disabledSet: false,//修改的时候的只读标识
				// form表单数据
				businessTimeBegin: '', //起始时间
				businessTimeEnd: '', //结束时间

				dialogImageUrl: '', // 图片列表
				dialogVisible: false,//查看图片弹窗
				dialogVisibleInfo: false,//查看详情是的图片弹窗
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_378.action', // 上传图片路径
				optionsPro:[],//省
				optionsCity:[],//市
				optionsArea:[],//区
				province:'',//省
				city:'',//市
				area:'',//区
				form: {
					brandId: '', //品牌名称
					brandName: '', //品牌名称
					storeName: '', //门店名称
					storeAliasName: '', //门店别名
					storeUrl: '', //门店照片url
					storeType: '线下', //门店分类
					isDefault:'否',
					addr: '', //详细地址
					storeManager: '', //负责人
					contactNumber1: '', //联系电话1
					contactNumber2: '', //联系电话2
					storeArea: '', //门店面积
					province: [],
					longitude: '', //经度
					latitude: '', //纬度
					storePerNumber: '', //门店人数
					businessTimeBegin: '', //起始时间
					businessTimeEnd: '', //结束时间
					storeDesc: '', //门店简介
					remarks: '', //备注
					label: '', //标签
					provinceName: "", //省名称
					provinceId: "", //省代码
					cityName: "", //市名称
					cityId: "", //市代码
					shelvesStatus: "是", //上架状态
					auditStatus: "否", //同步微信
					areaName: "", //区名称
					areaId: "" ,//区代码
					credential:"",
					category:""
				},
				//省市区
				optionsProCityArea: [],
				// 门店分类
				storeTypeData: [{
					index: '0',
					value: 'xianshang',
					key: '线上'
				}, {
					index: '1',
					value: 'xianshang',
					key: '线下'
				}],
				rules: {},
				norules: {},
				//同步到门店的必填
				rulesAudit: {
					storeId: [{
							required: true,
							message: '请输入门店编码',
							trigger: 'blur'
						},
						{
							max: 16,
							message: '最大长度不能超过16',
							trigger: 'blur'
						}
					],
					storePerNumber: [{
						validator: isInt
					}],
					storeArea: [{
						validator: isFloat
					}],
					storeName: [{
							required: true,
							message: '请输入门店名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					storeUrl: [{
							required: true,
							message: '请上传门店照片',
							trigger: 'blur'
						}
					],
					contactNumber1: [{
							required: true,
							message: '请输入联系电话',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						},
						{
							validator: isMobile,
							type: 'blur'
						}
					],
					contactNumber2: [{
						validator: isMobiles,
						type: 'blur'
					}],
					provinceName: [{
						required: true,
						message: '请选择省',
						trigger: 'blur'
					}],
					cityName: [{
						required: true,
						message: '请选择市',
						trigger: 'blur'
					}],
					areaName: [{
						required: true,
						message: '请选择区',
						trigger: 'blur'
					}],
					addr: [{
							required: true,
							message: '请输入详细地址',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					category: [{
							required: true,
							message: '请选择类目',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					credential: [{
							required: true,
							message: '请输入经营资质证件号',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					longitude: [{
						required: true,
						message: '请点击生成地标位置',
					}],

					storeDesc: [
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					remarks: [
						{
							max: 100,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					]
				},
				//不同步到门店的必填
				rulesNoAudit: {
					storeId: [{
							required: true,
							message: '请输入门店编码',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					storePerNumber: [{
						validator: isInt
					}],
					storeArea: [{
						validator: isFloat
					}],
					longitude: [{
						required: false,
						message: '请点击生成地标位置',
					}],
					provinceName: [{
						required: false,
						message: '请选择省',
						trigger: 'blur'
					}],
					cityName: [{
						required: false,
						message: '请选择市',
						trigger: 'blur'
					}],
					areaName: [{
						required: false,
						message: '请选择区',
						trigger: 'blur'
					}],
					addr: [{
							required: false,
							message: '请输入详细地址',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					category: [{
							required: false,
							message: '请选择类目',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					credential: [{
							required: false,
							message: '请输入经营资质证件号',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					storeName: [{
							required: true,
							message: '请输入门店名称',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					contactNumber1: [{
							required: true,
							message: '请输入联系电话',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						},
						{
							validator: isMobile,
							type: 'blur'
						}
					],
					contactNumber2: [{
						validator: isMobiles,
						type: 'blur'
					}],
					storeDesc: [
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'blur'
						}
					],
					remarks: [
						{
							max: 100,
							message: '最大长度不能超过4000',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			//同步到微信监听
			auditChange(val){
				if(val=="是"){
					this.rules=this.rulesAudit;
				}else{
					this.rules=this.rulesNoAudit;
				}
//				console.log(val)
			},
			//类目监听
			categoryChange(val){
				var data = this.categoryData[val];
				this.form.category=data.label;
			},
			//省
			provinceChange(val){
				var data = this.optionsPro[val-1];
				if(data.label!=this.form.provinceName){
					this.form.cityName="";
					this.form.cityId="";
					this.form.areaName="";
					this.form.areaId="";
				}
				this.form.provinceName=data.label;
				this.form.provinceId=data.key;
				this.focusSelect(data.key,'city');
				this.form.longitude = '';
				this.form.latitude ='';
			},
			//市
			cityChange(val){
				var data = this.optionsCity[val-1];
				if(data.label!=this.form.cityName){
					this.form.areaName="";
					this.form.areaId="";
				}
				this.form.cityName=data.label;
				this.form.cityId=data.key;
				this.focusSelect(data.key,'area');
				this.form.longitude = '';
				this.form.latitude ='';
			},
			//区
			areaChange(val){
				var data = this.optionsArea[val-1];
				this.form.areaName=data.label;
				this.form.areaId=data.key;
				this.form.longitude = '';
				this.form.latitude ='';
			},
			//营业时间起
			beginDate(val) {
				if(!val) {
					this.businessTimeBegin = "";
				}
				//				console.log(this.businessTimeBegin)
			},
			//营业时间止
			endDate(val) {
				if(!val) {
					this.businessTimeEnd = "";
				}
				//				console.log(this.businessTimeEnd)
			},
			//点击地标位置按钮
			getMap() {
				let add = '';
				//				console.log(JSON.stringify(this.form))
				if( this.form.cityName!="" || this.form.areaName!="") { //选择器 选择之后的值
					add = this.form.provinceName + this.form.cityName + this.form.areaName + this.form.addr;
					this.handleMapDialog = true;
					this.$nextTick(function() {
						this.showMap(add);
					})
				} else  { //查看详情
					this.$message({
						message: '地址没有解析到结果,请选择省市区！',
						type: 'warning'
					});
				}
			},
			showMap(addr) {
				let geocoder=null;
				let that = this;
				let marker=null;
			    let map = new qq.maps.Map(document.getElementById("map"), {
			        // 地图的中心地理坐标。
			        center: new qq.maps.LatLng(39.916527, 116.397128),
			        zoom:9
			    });
			    geocoder = new qq.maps.Geocoder();
			    geocoder.getLocation(addr);
	            //设置服务请求成功的回调函数
		        geocoder.setComplete(function(result) {
		            map.setCenter(result.detail.location);
		            var marker = new qq.maps.Marker({
		                map: map,
		                position: result.detail.location
		            });
					that.form.longitude = JSON.stringify(result.detail.location.lng);
					that.form.latitude = JSON.stringify(result.detail.location.lat);
//		            console.log(result.detail.location)
		      		marker.setDraggable(true);
	      		    //设置Marker停止拖动事件
				    qq.maps.event.addListener(marker, 'dragend', function() {
//				    	console.log(marker.getPosition());//经纬度
		    	        var lat = parseFloat(marker.getPosition().lat);
				        var lng = parseFloat(marker.getPosition().lng);
				        var latLng = new qq.maps.LatLng(lat, lng);
						that.form.longitude = JSON.stringify(marker.getPosition().lng);
						that.form.latitude = JSON.stringify(marker.getPosition().lat);
				        //对指定经纬度进行解析
				        geocoder.getAddress(latLng);
		                geocoder.setComplete(function(result) {
				            map.setCenter(result.detail.location);
//				            console.log(JSON.stringify(result.detail))
				            let addComp= result.detail.addressComponents;
							that.form.provinceName=addComp.province;
							that.form.proviceId='';
							that.form.cityName=addComp.city;
							that.form.cityId='';
							that.form.areaName=addComp.district;
							that.form.areaId='';
							that.form.addr=addComp.street+addComp.streetNumber;
//							console.log(that.form.provinceName)
				        });
				    });
		        });
		        //若服务请求失败，则运行以下函数
		        geocoder.setError(function() {
					that.form.provinceName='';
					that.form.proviceId='';
					that.form.cityName='';
					that.form.cityId='';
					that.form.areaName='';
					that.form.areaId='';
					that.form.addr='';
					that.form.longitude = '';
					that.form.latitude ='';
					that.$message({
						message: '地址没有解析到结果！',
						type: 'warning'
					});
		        });
			},
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!files) {
					return false;
				}else {
					if(!/image\/\w+/.test(files.type)) {
						this.$message("请上传一张图片");
						return false;
					}
					this.imgLoading=true;
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
								//							console.log(data)
								that.imgLoading=false;
								if(code == 'SUCCESS') {
									//								console.log(msg.fileName)
									that.form.storeUrl = msg.fileName; // 图片赋值
									that.storeUrl=msg.fileName; // 图片赋值
									that.dialogImageUrl =msg.fileName+'?x-oss-process=style/small'; // 图片回填 - 本地图片
									that.$message.success('上传成功');
								} else {
									that.$message.warning('上传失败');
								}
							})
							.catch((err) => {
								that.imgLoading=false;
//								console.log(err);
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
				this.storeUrl='';
				this.form.storeUrl = '';
				this.$refs.uploadIpt.value = '';
			},
			//查看详情的时候点击地标位置
			methodsInfo() {
				if(this.form.longitude==""&&this.form.latitude==""){
					this.$message.warning('地址为空，没有解析到结果');
					return false;
				}
				this.handleMapDialog = true;
				this.$nextTick(function() {
					this.showMapInfo();
				})
			},
			showMapInfo() {
			    let map = new qq.maps.Map(document.getElementById("map"), {
			        // 地图的中心地理坐标。
			        center: new qq.maps.LatLng(this.form.latitude,this.form.longitude),
			        zoom:9
			    });
		     	var center = new qq.maps.LatLng(this.form.latitude,this.form.longitude);
	            var marker = new qq.maps.Marker({
	                map: map,
	                position: center
	            });
	            marker.setVisible(true);
//				var map = new BMap.Map("map", {
//					enableMapClick: true
//				});
//				//				console.log(this.form.longitude, this.form.latitude);
//				var testpoint = new BMap.Point(this.form.longitude, this.form.latitude);
//				// 初始化地图,设置中心点坐标和地图级别
//				map.centerAndZoom(testpoint, 19);
//				var opts = {
//					type: BMAP_NAVIGATION_CONTROL_SMALL
//				}
//				map.addControl(new BMap.NavigationControl(opts));
//				var marker = new BMap.Marker(testpoint);
////				marker.enableDragging();
//				map.addOverlay(marker);
//				// 添加地图类型控件
//				map.addControl(new BMap.MapTypeControl());
//				map.enableScrollWheelZoom(true);
			},
			//门店分类监听下拉框事件：
			roleSelect(val) {
				let index = parseInt(val);
				let data = this.storeTypeData[index];
				this.form.storeType = data.key;
				//				console.log(JSON.stringify(data))
			},
			selectChange(val) {
				//				console.log(val)
				//				console.log(JSON.stringify(this.optionsProCityArea))
				if(val.length > 0) {
					let proIndex = val[0];
					let cityIndex = val[1];
					let areaIndex = val[2];
					this.form.provinceName = this.optionsProCityArea[proIndex].label;
					this.form.provinceId = this.optionsProCityArea[proIndex].key;

					this.form.cityName = this.optionsProCityArea[proIndex].children[cityIndex].label;
					this.form.cityId = this.optionsProCityArea[proIndex].children[cityIndex].key;

					this.form.areaName = this.optionsProCityArea[proIndex].children[cityIndex].children[areaIndex].label;
					this.form.areaId = this.optionsProCityArea[proIndex].children[cityIndex].children[areaIndex].key;
				} else {
					var params = {
						parentId: '1'
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//	        		console.log(JSON.stringify(data));
							this.optionsProCityArea = [];
							data.forEach((val, index) => {
								this.optionsProCityArea.push({
									children: [],
									...val
								});
							})
						})
						.catch((err) => {
//							console.log('err');
						})
				}
			},
			//监听省市区下拉
			cascaderSelect(val) {
				//				console.log(val)
				if(val.length == 1) {
					let proIndex = val[0];
					let parentId = this.optionsProCityArea[proIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							this.optionsProCityArea[proIndex].children = [];
							data.forEach((val, index) => {
								this.optionsProCityArea[proIndex].children.push({
									children: [],
									...val
								});
							})
							//		        		console.log(JSON.stringify(this.optionsProCityArea[proIndex]))
						})
						.catch((err) => {
//							console.log('err');
						})
					this.form.province = val;
				}
				if(val.length == 2) {
					let proIndex = val[0];
					let cityIndex = val[1];
					let parentId = this.optionsProCityArea[proIndex].children[cityIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							let array = [];
							this.optionsProCityArea[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityArea[proIndex].children[cityIndex].children = array;
							//				        		console.log(JSON.stringify(this.optionsProCityArea[proIndex].children[cityIndex].children))
						})
						.catch((err) => {
//							console.log('err');
						})
					this.form.province = val;
				}
				if(val.length == 3) {
					this.form.province = val;
					this.form.provinceName = val[0];
					this.form.cityName = val[1];
					this.form.areaName = val[2];
				}
			},
			// 方法
			submitForm(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						this.form.businessTime = this.businessTimeBegin+"-"+this.businessTimeEnd;
						let data = JSON.stringify(this.form);
						if(this.getPageType == '添加') {
							var formData = {
								userId: this.userInfo.userCode,
								...this.form
							}
							delete(formData["province"]);
							addStoreManagement(formData)
								.then((res) => {
									//					console.log(JSON.stringify(res.data) + "添加")
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '门店管理'
										});
									} else {
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
//									console.log(err);
									that.tableLoading = false;
								});
						} else if(this.getPageType == '修改') {
							var formData = {
								userId: this.userInfo.userCode,
								...this.form
							}
//							console.log(JSON.stringify(formData))
							setStoreManagement(formData)
								.then((res) => {
									//					console.log(JSON.stringify(res.data) + "添加")
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '门店管理'
										});
									} else {
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
//									console.log(err);
									that.tableLoading = false;
								});
						}
					}
				});
			},
			//返回按钮   由于此页面是门店的查看详情和门店信息导入的详情一样   所以需判断标识
			handleBack() {
				if(this.getpageTypeOther == '导入详情') {
					this.$router.push({
						name: '数据导入店铺信息查询',
						params: {
							pageTypeOther: '',
							formData: this.getMainData
						}
					});
				} else {
					this.$router.push({
						name: '门店管理'
					});
				}
			},
			focusSelect(parentId,type) {
				//请求省市区下拉框
				var params = {
					parentId: parentId
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data));
		        		if(type=="pro"){
		        			this.optionsPro=[];
		        			data.forEach((val, index) => {
		        				if(val.label!="未知"){
			        				this.optionsPro.push({
			        					...val
			        				});
		        				}
		        			})
		        		}
		        		if(type=="city"){
		        			this.optionsCity=[];
		        			data.forEach((val, index) => {
		        				if(val.label!="未知"){
			        				this.optionsCity.push({
			        					...val
			        				});
		        				}
		        			})
		        		}
		        		if(type=="area"){
		        			this.optionsArea=[];
		        			if(data.length>1){
		        				data.forEach((val, index) => {
		        					if(val.label!="未知"){
		        						this.optionsArea.push({
		        							...val
		        						});
		        					}
		        				})
		        			}else{
        						this.optionsArea=[{"value":1,"key":"","label":"未知"}]
		        			}
		        		}
					})
					.catch((err) => {
//						console.log('err');
					})
			}
		},
		created() {
			this.rules=this.rulesNoAudit;
			this.focusSelect('1','pro');
			// 钩子函数 -- 初始化
			this.uploadActUrl = Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action';
//						console.log(this.getFormData)
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				this.storeUrl = res.storeUrl;
				if(res.storeUrl){
					this.dialogImageUrl = res.storeUrl+'?x-oss-process=style/small';
				}
				let dateArr = res.businessTime.split("-");
				this.form.businessTimeBegin = dateArr[0];
				this.form.businessTimeEnd = dateArr[1];
				this.storePerNumber = res.storePerNumber.toString();
				this.storeArea = res.storeArea.toString();
				//				console.log(this.storeUrl)
			} else if(this.getPageType == '修改') {
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					"userId": this.userInfo.userCode,
					...res
				}
				this.storeUrl = res.storeUrl;
				if(res.storeUrl){
					this.dialogImageUrl = res.storeUrl+'?x-oss-process=style/small';
				}
				let dateArr = res.businessTime.split("-");
				this.businessTimeBegin = dateArr[0];
				this.businessTimeEnd = dateArr[1];
				this.storePerNumber = res.storePerNumber.toString();
				this.storeArea = res.storeArea.toString();
				this.optionsProCityArea = [{
					"children": [{
						"children": [{
							"value": 0,
							"key": res.areaId,
							"label": res.areaName
						}],
						"value": 0,
						"key": res.cityId,
						"label": res.cityName
					}],
					"value": 0,
					"key": res.provinceId,
					"label": res.provinceName
				}];
				//				console.log(JSON.stringify(res)+"修改回显值")
			}
			var params = {
				userId: this.userInfo.userCode,
				userType: this.userInfo.userType
			}
			//			console.log(params)
			getBrandInfo(params)//获取品牌信息
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					//					console.log(JSON.stringify(data));
					this.form.brandName = data.messageContent.brandName;
				})
				.catch((err) => {
//					console.log('err');
				})
			var params = {
				userId: this.userInfo.userCode
			}
			//			console.log(params)
			getCategory(params)//获取类目
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//										console.log(JSON.stringify(data));
					this.categoryData = data.messageContent;
				})
				.catch((err) => {
//					console.log(err);
				})
				
				
		},
		components: {
			merchantManagerUserDD
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
			getpageTypeOther() {
				return this.$route.params.pageTypeOther;
			},
			pageTypes() {
				return this.$route.params.pageTypes;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getMainData() {
				return this.$route.params.mainData;
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
		/*width: rem(940px);
		min-width: 500px;*/
	}
	
	.dialog-e {
		height: 360px;
	}
	.el-form-item {
		width: 33%;
		float: left;
	}
	
	.activitySpan {
		display: block;
		color: #AEAEAE;
	}
	@media only screen  
	and (min-device-width : 768px)  
	and (max-device-width : 1024px){  
		.el-form-item {
			width: 50%;
			float: left;
		}
	}  
	.el-select {
		width: 100%;
	}
	
	.el-button {
		margin-bottom: 5px;
	}
	
	.margin10 {
		margin-bottom: 10px;
	}
	
	.middle-input {
		width: 68%;
	}
	
	.middle-input-date {
		width: 44%;
		float: left;
	}
	
	.labelOter {
		position: absolute;
		width: 45px;
		margin-left: 10px;
		right: 0px;
		text-align: right;
	}
	
	.labelOterDate {
		float: left;
		margin: 0 5px;
	}
	/*级联选择器*/
	
	.el-cascader {
		width: 100%;
	}
	/*上传图片*/
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
	.avatar-uploader {
		height: 143px;
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
		width: 140px;
		/*height: 134px;*/
		height: 140px;
		line-height: 140px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		width: 140px;
		height: 140px;
		display: block;
		cursor: pointer;
	}
	/*地图*/
	
	#map {
		width: 100%;
		height: 280px;
		margin-top: 20px;
	}
	.lonlat{
		line-height: 24px;
		display: block;
	}
	.methodsInfo{
		margin: 0;
		margin-bottom:18px;
		height:80px;
		box-sizing:border-box
	}
</style>