<!--店组导入-店组下面的门店的-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card>
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" v-if="" ref="form" label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="8">
							<el-form-item label="品牌名称" prop="brandName">
								<el-input v-model="form.brandName" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="门店别名" prop="storeAliasName">
								<el-input v-model="form.storeAliasName" :disabled="disabled" placeholder="请输入门店别名"></el-input>
							</el-form-item>
							<el-form-item label="联系电话" prop="contactNumber1">
								<el-input v-model="form.contactNumber1" :disabled="disabled" placeholder="请输入联系电话一"></el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input v-model="form.contactNumber2" :disabled="disabled" placeholder="请输入联系电话二"></el-input>
							</el-form-item>

							<el-form-item label="标签" prop="label">
								<el-input v-model="form.label" :disabled="disabled" placeholder="请输入标签"></el-input>
							</el-form-item>
							<el-form-item label="门店人数" prop="storePerNumber">
								<el-input class="middle-input" :disabled="disabled" v-model="form.storePerNumber" placeholder="请输入门店人数"></el-input><span class="labelOter">人</span>
							</el-form-item>
							<el-form-item label="门店面积" prop="storeArea">
								<el-input class="middle-input" :disabled="disabled" v-model="form.storeArea" placeholder="请输入门店面积"></el-input><span class="labelOter">平方米</span>
							</el-form-item>
							<el-form-item label="同步到微信" prop="isChat">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.isChat" placeholder="同步到微信"></el-input>
								<el-radio-group v-else v-model="form.isChat">
									<el-radio label="是">是</el-radio>
									<el-radio label="否">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="门店简介" prop="storeDesc">
								<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入门店简介" v-model="form.storeDesc">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="门店编码" prop="storeId">
								<el-input v-model="form.storeId" :disabled="disabled" placeholder="请输入门店编码"></el-input>
							</el-form-item>
							<el-form-item label="负责人/店长" prop="storeManager">
								<el-input v-model="form.storeManager" :disabled="disabled" placeholder="请输入负责人/店长"></el-input>
							</el-form-item>
							<el-form-item label="门店照片" prop="storeUrl">
								<el-upload :disabled="disabled" class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
									<img v-if="form.storeUrl" :src="form.storeUrl" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
							</el-form-item>
							<el-form-item label="营业时间" prop="businessTimeBegin">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" class="middle-input" v-model="form.businessTimeBegin" placeholder="请输入起始时间"></el-input>
								<el-time-select v-else placeholder="起始时间" class="middle-input" v-model="businessTimeBegin" :picker-options="{
							      start: '08:30',
							      step: '00:15',
							      end: '18:30',
							      maxTime: businessTimeEnd
							    }">
								</el-time-select><span class="labelOter">至</span>
							</el-form-item>
							<el-form-item label="" prop="businessTimeEnd">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" class="middle-input" v-model="form.businessTimeEnd" placeholder="请输入结束时间"></el-input>
								<el-time-select v-else placeholder="结束时间" class=" middle-input" v-model="businessTimeEnd" :picker-options="{
							      start: '08:30',
							      step: '00:15',
							      end: '18:30',
							      minTime: businessTimeBegin
							    }">
								</el-time-select>
							</el-form-item>
							<el-form-item label="上架状态" prop="shelvesStatus">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.shelvesStatus" placeholder="上架状态"></el-input>
								<el-radio-group v-else v-model="form.shelvesStatus">
									<el-radio label="是">是</el-radio>
									<el-radio label="否">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="备注" prop="remarks">
								<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入备注" v-model="form.remarks">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="门店名称" prop="storeName">
								<el-input v-model="form.storeName" :disabled="disabled" placeholder="请输入门店名称"></el-input>
							</el-form-item>
							<el-form-item label="门店分类" prop="storeType">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" v-model="form.storeType" placeholder="请输入门店分类"></el-input>
								<el-select v-else v-model="form.storeType" placeholder="请选择" @change="roleSelect">
									<el-option v-for="item in storeTypeData" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="省/市/区" prop="provinceName">
								<el-input v-if="this.getPageType=='查看'" :disabled="disabled" placeholder="请输入省/市/区" :value="form.provinceName + '/' + form.cityName + '/' + form.areaName"></el-input>
								<el-cascader v-else :options="optionsProCityArea" change-on-select v-model="form.province" id="add" @change="cascaderSelect"></el-cascader>
							</el-form-item>
							<el-form-item label="详细地址" prop="addr">
								<el-input v-model="form.addr" :disabled="disabled" placeholder="请输入详细地址"></el-input>
							</el-form-item>
							<el-form-item label="地标位置" prop="" v-if="this.getPageType!='查看'">
								<el-button type="primary" @click="methodsInfo()">查看地标位置</el-button>
							</el-form-item>
							<el-form-item label="地标位置" prop="" v-else>
								<el-button type="primary" @click="methods()">地标位置</el-button>
							</el-form-item>
							<div id="map"></div>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item v-if="this.getPageType!='查看'">
								<el-button @click="handleBack">返回</el-button>
								<el-button type="primary" @click="submitForm('form')">确定</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { selectProCityArea } from '@/api/public'
	import merchantManagerUserDD from '../component/merchantManagerUserDD.vue'
	const isMobile = (rule, value, callback) => {
		if(!validateMobile(value)) {
			callback(new Error('请输入正确的手机号码'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				clickCode: '0',
				handleStoreDialog: false, //弹窗标识
				disabled: false, //查看的时候的只读标识
				// form表单数据
				businessTimeBegin: '', //起始时间
				businessTimeEnd: '', //结束时间
				form: {
					brandName: '', //品牌名称
					storeId: '', //门店编码
					storeName: '', //门店名称
					storeAliasName: '', //门店别名
					storeUrl: '', //门店照片url
					storeType: '', //门店分类
					addr: '', //详细地址
					storeManager: '', //负责人
					contactNumber1: '', //联系电话1
					contactNumber2: '', //联系电话2
					storeArea: '', //门店面积
					province: [],
					longitude: '', //经度
					latitude: '', //纬度
					storePerNumber: '', //门店人数
					businessTimeBegin: this.businessTimeBegin, //起始时间
					businessTimeEnd: this.businessTimeEnd, //结束时间
					storeDesc: '', //门店简介
					remarks: '', //备注
					label: '', //标签
					provinceName: "", //省名称
					provinceId: "", //省代码
					cityName: "", //市名称
					cityId: "", //市代码
					shelvesStatus: "", //上架状态
					isChat: "", //同步微信
					areaName: "", //区名称
					areaId: "" //区代码
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
				norules: {},
				rules: {
					storeId: [{
							required: true,
							message: '请输入门店编码',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeName: [{
							required: true,
							message: '请输入门店名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					contactNumber1: [{
							required: true,
							message: '至少输入一个联系电话',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					mobile: [
						// { required: true, message: '请输入手机号', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						{
							validator: isMobile,
							type: 'change'
						}
					],
					provinceName: [{
						required: true,
						message: '请选择省市区',
						trigger: 'blur'
					}],
					addr: [{
							required: true,
							message: '请输入详细地址',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeArea: [
						// { required: true, message: '请输入门店面积', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						},
						// { validator: isTel, type: 'change' }       
					],
					storePerNumber: [
						// { required: true, message: '请输入门店人数', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeDesc: [
						// { required: true, message: '请输入门店简介', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					remarks: [
						// { required: true, message: '请输入备注', trigger: 'change' },
						{
							max: 100,
							message: '最大长度不能超过4000',
							trigger: 'change'
						}
					]
				}
			}
		},
		methods: {
			methods() {
				var add = '';
				if(this.form.pca) { //选择器 选择之后的值
					if(this.form.pca == "") {
						this.$message({
							message: '请选择省市区！',
							type: 'warning'
						});
						return false;
					} else if(this.form.addr == "") {
						this.$message({
							message: '请输入详细地址！',
							type: 'warning'
						});
						return false;
					} else {
						add = this.form.pca[0] + this.form.pca[1] + this.form.pca[2] + this.form.addr;
					}
				} else if(this.form.provinceName && this.form.cityName && this.form.areaName) { //查看详情
					this.$message({
						message: '地址没有解析到结果！',
						type: 'warning'
					});
					add = this.form.provinceName + this.form.cityName + this.form.areaName + this.form.addr;
				}
				// 百度地图API功能
				// 创建Map实例
				var map = new BMap.Map("map", {
					enableMapClick: true
				});
				// 初始化地图,设置中心点坐标和地图级别
				map.centerAndZoom(new BMap.Point(116.4035, 39.915), 11);
				// 添加地图类型控件
				map.addControl(new BMap.MapTypeControl());
				// 设置地图显示的城市 此项是必须设置的
				//				map.centerAndZoom(add, 11);
				// 开启鼠标滚轮缩放      
				map.enableScrollWheelZoom(true);
				// 创建地址解析器实例
				var myGeo = new BMap.Geocoder();
				var that = this;
				// 将地址解析结果显示在地图上,并调整地图视野
				myGeo.getPoint(add, function(point) { //地址转成经纬度
					//					console.log(point)
					if(point) {
						map.centerAndZoom(point, 14);
						map.addOverlay(new BMap.Marker(point));
						that.form.longitude = point.lng;
						that.form.latitude = point.lat;
					} else {
						that.$message({
							message: '地址没有解析到结果！',
							type: 'warning'
						});
					}
				}, that.form.pca[1]);
			},
			methodsInfo() {
				var map = new BMap.Map("map", {
					enableMapClick: true
				});
				// 初始化地图,设置中心点坐标和地图级别
				map.centerAndZoom(new BMap.Point(this.form.longitude, this.form.latitude), 11);
				// 添加地图类型控件
				map.addControl(new BMap.MapTypeControl());
				map.enableScrollWheelZoom(true);
			},
			//		监听下拉框事件：
			roleSelect(val) {
				let index = parseInt(val);
				let data = this.storeTypeData[index];
				//				console.log(JSON.stringify(data))
			},
			//监听省市区下拉
			cascaderSelect(val) {
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
							this.optionsProCityArea[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								this.optionsProCityArea[proIndex].children[cityIndex].children.push({
									...val
								});
							})
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
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '门店管理'
					});
					return false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let data = JSON.stringify(this.form);
						//						console.log(data + "提交数据")
						//						console.log(this.getPageType)
						if(this.getPageType == '添加') {
							this.$router.push({
								name: '门店管理',
								params: {
									formData: data,
									pageType: '添加'
								}
							});
						} else if(this.getPageType == '修改') {
							this.$router.push({
								name: '门店管理',
								params: {
									formData: data,
									pageType: '修改'
								}
							});
						}

					} else {
//						console.log('error submit!!');
						return false;
					}
				});
			},
			//返回按钮   由于此页面是门店的查看详情和门店信息导入的详情一样   所以需判断标识
			handleBack() {
				if(this.getpageTypeOther == '导入详情') {
					this.$router.push({
						name: '数据导入店组信息查看详情',
						params: {
							pageTypeOther: '',
							formData: this.getMainData
						}
					});
				}
			},
			//上传图片
			handleAvatarSuccess(res, file) {
				this.form.storeUrl = URL.createObjectURL(file.raw);
				//				console.log(this.form.storeUrl)
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if(!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
		},
		created() {
			// 钩子函数 -- 初始化
			//			console.log(this.getFormData)
			this.form.brandName = this.$route.params.brandName;
			if(this.getPageType == '查看') {
				this.disabled = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				//				console.log(res)
			} else if(this.getPageType == '修改') {
				this.disabled = false;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				//				console.log(res)
			}
			//请求省市区下拉框
			var params = {
				parentId: '1'
			}
			selectProCityArea(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					//	        		console.log(JSON.stringify(data));
					if(this.clickCode == '0') {
						data.forEach((val, index) => {
							this.optionsProCityArea.push({
								children: [],
								...val
							});
						})
					}
				})
				.catch((err) => {
//					console.log('err');
				})
		},
		components: {
			merchantManagerUserDD
		},
		computed: {
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
		width: 115px;
	}
	
	.labelOter {
		position: absolute;
		width: 45px;
		margin-left: 10px;
		right: 0px;
		text-align: right;
	}
	/*级联选择器*/
	
	.el-cascader {
		width: 100%;
	}
	/*上传图片*/
	
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
		width: 134px;
		height: 133px;
		line-height: 133px;
		text-align: center;
	}
	
	.avatar {
		width: 134px;
		height: 133px;
		display: block;
	}
	/*地图*/
	
	#map {
		width: 360px;
		height: 245px;
		margin-top: 20px;
	}
</style>