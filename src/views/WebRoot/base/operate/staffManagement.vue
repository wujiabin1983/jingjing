<!--员工管理-子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'">返回</el-button>
			<el-card>
				<el-form :model="form" :rules="rules"  v-loading="this.tableLoading"  ref="form" label-width="120px" class="demo-form demo-form-sub">
					<!--<el-row :gutter="10">
						<el-col :span="8">-->
					<el-form-item label="登录账号" prop="loginId">
						<el-input v-model="form.loginId" :readonly="disabledSet" placeholder="请输入手机号码" ref="elementLoginId" @change="handleChangeLoginId" @focus="handleFocusLoginId" @blur="handleBlurLoginId"></el-input>
						<div class="el-form-item__error error-color" v-if="loginIdErrShow">{{loginIdErr}}</div>
					</el-form-item>
					<el-form-item label="密码" prop="password" v-if="this.getPageType=='添加'">
						<el-input v-model="form.password" :type="type" @focus="passChange" :readonly="disabledPassSet" placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item label="员工姓名" prop="userName">
						<el-input v-model="form.userName" :readonly="disabled" placeholder="请输入员工姓名"></el-input>
					</el-form-item>
					<el-form-item label="员工编码" prop="userCode">
						<el-input v-model="form.userCode" :readonly="disabledSet" placeholder="请输入员工编码"></el-input>
					</el-form-item>
					<el-form-item label="员工类型" prop="userType">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.userType" placeholder=""></el-input>
						<el-select v-else v-model="form.userType" placeholder="请选择" @change="userTypeChange">
							<el-option v-for="item in userType" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属角色" prop="roleTypeName">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.roleTypeName" placeholder=""></el-input>
						<el-select v-else v-model="form.roleTypeName" placeholder="请选择" @change="roleInfoChange">
							<el-option v-for="item in roleTypeName" :key="item.key" :label="item.key" :value="item.index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属品牌" prop="brandName" v-if="this.userInfo.userType!='EMPLOYEE'">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.brandName" placeholder=""></el-input>
						<el-select v-else v-model="form.brandName" placeholder="请选择" @change="brandChange">
							<el-option v-for="item in brandName" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属品牌" prop="brandName" v-else>
						<el-input :readonly="true" v-model="form.brandName" placeholder="请选择所属品牌"></el-input>
					</el-form-item>
					<el-form-item :label="this.storeLabelName" prop="storeName" v-if="this.getPageType=='查看'&&this.storeFlag">
						<el-input :readonly="disabled" v-model="storeArr" :placeholder="this.storeLabelName"></el-input>
					</el-form-item>
					<el-form-item :label="this.storeLabelName" prop="storeName" v-else-if="this.storeFlag" class="height32">
						<el-input :readonly="true" v-model="storeArr" class="dsh-input" :placeholder="this.storeLabelName"></el-input>
						<el-button type="primary" @click="searchStorePop()" class="dsh-input-button">选择</el-button>
					</el-form-item>
					<el-form-item label="年龄" prop="age">
						<el-input v-model="form.age" :readonly="disabled" placeholder="请输入年龄"></el-input>
					</el-form-item>
					<el-form-item label="工作地址" prop="workAddress">
						<el-input v-model="form.workAddress" :readonly="disabled" placeholder="请输入工作地址"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.sex" placeholder=""></el-input>
						<el-radio-group v-else v-model="form.sex">
							<el-radio label="男">男</el-radio>
							<el-radio label="女">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.status" placeholder=""></el-input>
						<el-radio-group v-else v-model="form.status">
							<el-radio label="激活">激活</el-radio>
							<el-radio label="停用">停用</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="证件类型" prop="documentType">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.documentType" placeholder=""></el-input>
						<el-select v-else v-model="form.documentType" placeholder="请选择" @change="documentChange">
							<el-option v-for="item in documentType" :key="item.key" :label="item.key" :value="item.index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件号码" prop="idNumber">
						<el-input v-model="form.idNumber" :readonly="disabledIdCard" placeholder="请输入证件号码"></el-input>
					</el-form-item>
					<el-form-item label="个性签名" prop="specialSignature">
						<el-input v-model="form.specialSignature" :readonly="disabled" placeholder="请输入个性签名"></el-input>
					</el-form-item>
					<!--</el-col>
						<el-col :span="8">-->
					<el-form-item label="出生日期" prop="birthDate">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.birthDate" placeholder=""></el-input>
						<el-date-picker v-else format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :editable="false" v-model="form.birthDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="入职日期" prop="entryDate">
						<el-input v-if="this.getPageType=='查看'" :readonly="disabled" v-model="form.birthDate" placeholder=""></el-input>
						<el-date-picker v-else format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :editable="false" v-model="form.entryDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<!--</el-col>
						<el-col :span="8">-->
					<el-form-item label="员工头像" prop="storeUrl" v-if="this.getPageType!='查看'">
						<el-button type="primary" @click="clickTest">上传图片</el-button>
						<el-button type="primary" @click="handleUploadDelete" class="margin10">删除</el-button>
						<!-- <div class="icon-close" v-loading="imgLoading"> -->
						<img v-if="dialogImageUrl" :src="dialogImageUrl" @click="clickTest" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
							<!-- <i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
						</div> -->
						<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="imageUrl" alt="">
						</el-dialog>
						<span class="activitySpan">图片建议尺寸：140像素*140像素</span>
					</el-form-item>
					<el-form-item label="员工头像" prop="storeUrl" v-if="this.getPageType=='查看'">
						<img v-if="imageUrl" :src="dialogImageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" v-loading="this.imgLoading"></i>
					</el-form-item>
					<div v-if="this.getPageType != '查看'" class="el-footer-btn">
						<div class="el-footer-btn-con">
							<el-button @click="handleBack">返  回</el-button>
							<el-button type="primary" @click="submitForm('form')">确  定</el-button>
						</div>
					</div>
				</el-form>
				<!--门店-->
				<el-dialog title="选择门店" :visible.sync="handleStoreDialog" class="transfer">
					<template>
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab('门店')">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</template>
					<div slot="footer" class="dialog-footer">
						<el-button @click="handleStoreDialog = false">取 消</el-button>
						<el-button type="primary" @click="enterStore">确 定</el-button>
					</div>
				</el-dialog>
				<!--店组-->
				<el-dialog title="选择店组" :visible.sync="handleGroupDialog" class="transfer">
					<template>
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab('店组')">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</template>
					<div slot="footer" class="dialog-footer">
						<el-button @click="handleGroupDialog = false">取 消</el-button>
						<el-button type="primary" @click="enterStore">确 定</el-button>
					</div>
				</el-dialog>
				<!--区域-->
				<el-dialog title="选择区域" :visible.sync="handleAreaDialog" class="transfer">
					<template>
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab(区域)">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</template>
					<div slot="footer" class="dialog-footer">
						<el-button @click="handleAreaDialog = false">取 消</el-button>
						<el-button type="primary" @click="enterStore">确 定</el-button>
					</div>
				</el-dialog>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail, validateLoginId, validateInt, validateIdCard, validatePassword } from '@/utils/validate';
	import { addStaffManagement, setStaffManagement } from '@/api/base/staffManagement'
	import { isLoginId, selectBrand } from '@/api/base/staffManagement'
	import Cookie from 'js-cookie'
	import { uploadImg } from '@/api/base/brandInfo'
	import { mapGetters } from 'vuex'
	import { selectProCityArea, selectStoreData, getBrandInfo,selectTabData, selectRoleInfo, selectContentInfo } from '@/api/public'
	const isMobile = (rule, value, callback) => {
		if(!validateMobile(value)) {
			callback(new Error('请输入正确的手机号码'))
		} else {
			callback()
		}
	};
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback();
		}
	};
	const isIdCard = (rule, value, callback) => {
		if(value != "") {
			if(!validateIdCard(value)) {
				callback(new Error('请输入正确的身份证号码'))
			} else {
				callback()
			}
		} else {
			callback();
		}
	};
	const isPassword = (rule, value, callback) => {
		if(!validatePassword(value)) {
			callback(new Error('密码为至少6位的数字或字母'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				type:'text',
				disabledPassSet:false,
				handleStoreDialog:false,
				handleGroupDialog:false,
				handleAreaDialog:false,
				dataIndex:[],
				data2:[],//搜索优惠券的值
				value2: ['WD0001'],//选择的值
				optionsProCityAreaPop: [],//级联选择器省市区数据
				provinceId:'',//弹窗搜索省代码
				cityId:'',//弹窗搜索市代码
				areaId:'',//弹窗搜索区代码
				storeArr: '',//回显所属门店
				searchContent:'',
				titleDataStore:['未选择门店','已选择门店'],//穿梭框的左右两侧的标题
				titleDataGroup:['未选择店组','已选择店组'],//穿梭框的左右两侧的标题
				titleDataArea:['未选择区域','已选择区域'],//穿梭框的左右两侧的标题
				
				dialogVisible:false,
				// 用户登录名切换
				loginIdErr: '',
				loginIdErrShow: false,
				storeFlag:true,
				storeLabelName:'所属门店',
				imgLoading:false,
				selectDataType:'',//回显所属门店时的类型
				disabled: false,//文本只读查看、修改用
				tableLoading:false,//form遮罩层
				disabledSet: false,//文本只读修改用
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				dialogImageUrl: '', // 图片列表、
				imageUrl:'',
				// form表单数据
				form: {
					loginId: '', //登录账号
					password: '', //密码
					userCode: '', //员工编号
					userName: '', //员工姓名
					userHeaderUrl: '', //员工头像URL	--------
					//					storeAliasName: '', //所属门店
					age: '', //年龄	
					birthDate: '', //出生日期
					entryDate: '', //入职日期		--------
					userType: '', //员工类型
					specialSignature: '', //个性签名
					documentType: '', //证件类型
					idNumber: '', //证件号码
					status: '激活', //状态
					workAddress: '', //工作地址
					sex: '男', //性别				---------
					roleType: '', //所属角色id
					roleTypeName: '', //所属角色名称
					brandId: '', //品牌编码
					brandName: '', //品牌名称
					storeId: '', //门店编码
					storeName: '' //门店名称
				},
				// 员工类型
				userType: [{
					value: '品牌用户',
					label: '品牌用户'
				}, {
					value: '区域用户',
					label: '区域用户'
				}, {
					value: '店组用户',
					label: '店组用户'
				}, {
					value: '门店用户-店长',
					label: '门店用户-店长'
				}, {
					value: '门店用户-导购',
					label: '门店用户-导购'
				}, {
					value: '门店用户-收银员',
					label: '门店用户-收银员'
				}, {
					value: '门店用户-其他',
					label: '门店用户-其他'
				}],
				// 所属角色
				roleTypeName: [],
				// 所属品牌
				brandName: [],
				// 证件类型
				documentType: [],
				limit: this.GLOBAL.limitDialog, // 条/页
				disabledIdCard: true,
				ruleInfo: {}, //查看时form验证
				//级联选择器数据
				rules: { //添加form验证
					loginId: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'change'
						},
						{
							validator: isMobile,
							trigger: 'change'
						}
					],
					age: [{
						validator: isInt
					}],
					brandName: [{
							required: true,
							message: '请选择品牌',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}, {
							validator: isPassword
						}
					],
					userCode: [{
							required: true,
							message: '请输入员工编号',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					userName: [{
							required: true,
							message: '请输入员工姓名',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					userType: [{
							required: true,
							message: '请选择员工类型',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					roleTypeName: [{
							required: true,
							message: '请选择所属角色',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeName: []
				},
				noRulesInfo:{},
				noRules: { //修改form验证
					age: [{
						validator: isInt
					}],
					//					idNumber: [{
					//						validator: isIdCard
					//					}],
					brandName: [{
							required: true,
							message: '请选择品牌',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					userName: [{
							required: true,
							message: '请输入员工姓名',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					userType: [{
							required: true,
							message: '请选择员工类型',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					roleTypeName: [{
							required: true,
							message: '请选择所属角色',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					storeName: []
				}
			}
		},
		methods: {
			// 用户登陆名失去焦点
			handleBlurLoginId(str) {
				this.handleChangeLoginId(str.target.value);
			},
			// 用户登录名获取焦点
			handleFocusLoginId() {
				this.loginIdErrShow = false;
			},
			// 用户登录名切换错误提示
			handleChangeLoginId(value) {
				let params = {
					"loginId": value
				}
				isLoginId(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						let code = data.messageType;
						let msg = data.messageContent;
//						console.log(msg)
						if(msg == '') {
							this.loginIdErrShow = false;
							this.disabledPassSet=false;
							this.form.password="";
						} else {
							this.loginIdErrShow = true;
							this.type='password';
							this.form.password="a12345";
							this.disabledPassSet=true;
							this.loginIdErr = '该登录账号已存在';
						}
					})
			},
			passChange(event){
				if(event.target.attributes[5].value=="text"){
					this.type='password';
				}else if(event.target.attributes[2].value=="text"){
					this.type='password';
				}
			},
			//用户类型
			userTypeChange(val) {
//				console.log(val)
				this.storeArr='';
				this.dataIndex=[];
				this.value2=[];
				this.data2=[];
				if(val=="门店用户-店长"||val=="门店用户-其他"||val=="门店用户-收银员"||val=="门店用户-导购"){
					this.noRules.storeName=[{
								required: true,
								message: '请选择所属门店',
								trigger: 'change'
							}]
					this.rules.storeName=[{
								required: true,
								message: '请选择所属门店',
								trigger: 'change'
							}]
					this.storeFlag=true;
					this.storeLabelName="所属门店";
				}else if(val=="品牌用户"){
					this.storeFlag=false;
					this.noRules.storeName=[];
					this.rules.storeName=[];
				}else if(val=="区域用户"){
					this.storeFlag=true;
					this.storeLabelName="所属区域";
					this.noRules.storeName=[{
								required: true,
								message: '请选择所属区域',
								trigger: 'change'
							}]
					this.rules.storeName=[{
								required: true,
								message: '请选择所属区域',
								trigger: 'change'
							}]
				}else if(val=="店组用户"){
					this.storeFlag=true;
					this.storeLabelName="所属店组";
					this.noRules.storeName=[{
								required: true,
								message: '请选择所属店组',
								trigger: 'change'
							}]
					this.rules.storeName=[{
								required: true,
								message: '请选择所属店组',
								trigger: 'change'
							}]
				}
			},
			//所属角色
			roleInfoChange(val) {
				//				console.log(val)
				var index = parseInt(val);
				this.form.roleType = this.roleTypeName[index].value;
				this.form.roleTypeName = this.roleTypeName[index].key;
				//				console.log(JSON.stringify(this.roleTypeName[index]))
			},
			//所属品牌
			brandChange(val) {
				var index = parseInt(val);
				this.form.brandId = this.brandName[index].key;
				this.form.brandName = this.brandName[index].label;
				//				console.log(JSON.stringify(this.brandName[index]))
			},
			//证件类型
			documentChange(val) {
				this.disabledIdCard = false;
				if(val!=""){
					var index = parseInt(val);
					this.form.documentType = this.documentType[index].key;
				}
				//				console.log(JSON.stringify(this.roleTypeName[index]))
			},
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				this.imgLoading=true;
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!/image\/\w+/.test(files.type)) {
					this.$message("请上传一张图片");
					return false;
				}
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
							//							console.log(data)
							if(code == 'SUCCESS') {
								//								console.log(msg.fileName)
								that.form.userHeaderUrl = msg.fileName; // 图片赋值
								that.imageUrl=msg.fileName; // 图片赋值
								that.dialogImageUrl = msg.fileName+'?x-oss-process=style/small'; // 图片回填 - 本地图片
								that.$message.success('上传成功');
							} else {
								that.$message.success('上传失败');
							}
							that.imgLoading=false;
						})
						.catch((err) => {
							that.imgLoading=false;
							// console.log(err);
						})
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
				this.form.brandLogo = '';
				this.$refs.uploadIpt.value = '';
			},
			// 方法
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loginIdErrShow = false;
						this.loginIdErr = '';
						let that = this;
						this.tableLoading = true;
						var params = {
							userId: this.userInfo.userCode,
							baseStoreGroupVO: this.form,
							storesIdList: this.form.storesIdList
						}
						//						console.log(JSON.stringify(params)+"入参")
						if(this.getPageType == '添加') {
							addStaffManagement(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '员工管理'
										});
									} else {
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
									// console.log(err);
								});
						} else if(this.getPageType == '修改') {
							setStaffManagement(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									that.tableLoading = false;
									if(data.messageType == 'SUCCESS') {
										that.$message.success(data.messageContent);
										that.$router.push({
											name: '员工管理'
										});
									} else {
										that.$message.warning(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
									// console.log(err);
								});
						}
					}
				});
			},
			//请求省信息
			selectProCityArea(){
				let params = {
					parentId :'1'
				}
		        selectProCityArea(params)
		        	.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
	//	        		console.log(JSON.stringify(data));
		        		this.optionsProCityAreaPop=[];
	        			data.forEach((val, index) => {
	        				if(val.label=="未知"){
		        				this.optionsProCityAreaPop.push({
		        					...val
		        				});
	        				}else{
	        					this.optionsProCityAreaPop.push({
	        						children:[],
	        						...val
	        					});
	        				}
	        			})
		        	})
		        	.catch((err) => {
						// console.log('err');        		
		        	})
			},
			
			//监听穿梭框事件
			storeArray(val){
				this.dataIndex=val;
//				console.log(this.value2)
//				console.log(val);
				if(val.length==1){
					this.data2.forEach((value,index)=>{
						if(value.storeId==val[0]){
							this.storeArr=value.storeName;
							this.form.storeName=value.storeName;
							this.form.storeId=value.storeId;
						}
					})
				}
			},
			//门店搜索（tab）
			searchStoreTab(tabType) {
				let params = {}
				if(tabType=="门店"){
					params = {
						"flag":'1',
						"userId": this.userInfo.userCode,
						"searchContent":this.searchContent,
						"provinceId":this.provinceId,
						"cityId":this.cityId,
						"areaId":this.areaId
					}
				}
				if(tabType=="店组"){
					params = {
						"flag":'2',
						"userId": this.userInfo.userCode,
						"searchContent":this.searchContent,
						"provinceId":this.provinceId,
						"cityId":this.cityId,
						"areaId":this.areaId
					}
				}
				if(tabType=="区域"){
					params = {
						"flag":'3',
						"userId": this.userInfo.userCode,
						"searchContent":this.searchContent,
						"provinceId":this.provinceId,
						"cityId":this.cityId,
						"areaId":this.areaId
					}
				}
//				console.log(params);
				selectTabData(params)
					.then((res) => {
		        		let data = JSON.parse(Base64.decode(res.data));
						this.data2=[];
						if(data!=""){
							if(tabType == "门店") {
							data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
//							console.log(this.value2)
						}
		        	})
		        	.catch((err) => {
//						console.log(err)   		
		        	})
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
			//点击所属门店弹窗显示
			searchStorePop() {
				if(this.form.userType == "") {
					this.$message({
						message: '请选择员工类型',
						type: 'warning'
					});
					return false;
				} else if(this.form.userType == "区域用户") {
					this.selectDataType='区域';
					this.handleAreaDialog = true;
//					this.searchStoreTab('区域');
				} else if(this.form.userType == "店组用户") {
					this.selectDataType='店组';
					this.handleGroupDialog = true;
//					this.searchStoreTab('店组');
				} else if(this.form.userType == "门店用户-店长"||this.form.userType == "门店用户-导购"||this.form.userType == "门店用户-收银员"||this.form.userType == "门店用户-其他") {
					this.selectDataType='门店';
					this.handleStoreDialog = true;
//					this.searchStoreTab('门店');
				}
				if(this.form.storeName!=""&&this.form.storeId!=""){
					this.data2=[{
						index:0,
						storeId:this.form.storeId,
						storeName:this.form.storeName
					}]
					this.value2=[this.form.storeId]
				}
				this.selectProCityArea();
			},
			//弹窗确认
			enterStore(val) {
				if(this.data2.length==0){
					this.storeArr='';
					this.form.storeName='';
					this.form.storeId='';
				}
				if(this.selectDataType=="门店"){
					if(this.dataIndex.length>1){
						this.$message.warning('只能选择一个门店！');
						return false;
					}
					this.storeArr=this.form.storeName;
					this.handleStoreDialog = false; 
				}
				if(this.selectDataType=="店组"){
					if(this.dataIndex.length>1){
						this.$message.warning('只能选择一个店组！');
						return false;
					}
					this.storeArr=this.form.storeName;
					this.handleGroupDialog = false;
				}
				if(this.selectDataType=="区域"){
					if(this.dataIndex.length>1){
						this.$message.warning('只能选择一个区域！');
						return false;
					}
					this.storeArr=this.form.storeName;
					this.handleAreaDialog = false;
				}
//				console.log(this.storeArr)
			},
			handleBack() {
				if(this.getpageTypeOther == '导入详情') {
					this.$router.push({
						name: '数据导入员工信息查询',
						params: {
							formData: this.getMainData,
						}
					});
				} else {
					this.$router.push({
						name: '员工管理'
					});
				}
			},
		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			// console.log(this.getPageType);
			if(this.userInfo.userType=='EMPLOYEE'){
				//品牌信息 员工登录展示品牌信息
				var params = {
					userId: this.userInfo.userCode
				}
//				console.log(this.userInfo.userType)
				getBrandInfo(params)	
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data) + "所属品牌")
						if(data != "") {
							this.form.brandName = data.messageContent.brandName;
							this.form.brandId = data.messageContent.brandId;
						}
					})
					.catch((err) => {
					})
			}else{
				//品牌下拉 商户登录展示品牌下拉框
				var params = {
					userId: this.userInfo.userCode,
					userType: this.userInfo.userType
				}
				// console.log(params)
				selectBrand(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(JSON.stringify(data) + "所属品牌")
						if(data != "") {
							this.brandName = data;
						}
					})
					.catch((err) => {
						// console.log(err)
					})
			}
			//证件类型
			var params = {
				"getConstantCode": "DOCUMENT_TYPE"
			}
			selectContentInfo(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					if(data != "") {
						data.unshift({
							index:'',
							key:'请选择',
							value:''
						})
						this.documentType = data;
//					console.log(JSON.stringify(data))
					}
				})
				.catch((err) => {
				})
			//角色下拉
			var params = {
				userId: this.userInfo.userCode
			}
			//			console.log(params)
			selectRoleInfo(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					if(data != "") {
						this.roleTypeName = data.messageContent;
					}
				})
				.catch((err) => {
					// console.log(err)
				})
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				let val = this.form.userType;
				if(val=="门店用户-店长"||val=="门店用户-其他"||val=="门店用户-收银员"||val=="门店用户-导购"){
					this.storeFlag=true;
					this.storeLabelName="所属门店";
				}else if(val=="品牌用户"){
					this.storeFlag=false;
					this.noRules.storeName=[];
					this.rules.storeName=[];
				}else if(val=="区域用户"){
					this.storeFlag=true;
					this.storeLabelName="所属区域";
				}else if(val=="店组用户"){
					this.storeFlag=true;
					this.storeLabelName="所属店组";
				}
				if(this.form.userHeaderUrl!=""){
					this.dialogImageUrl = this.form.userHeaderUrl+'?x-oss-process=style/small'; // 上传图片路径
				}
				this.imageUrl = this.form.userHeaderUrl; // 上传图片路径
				this.storeArr = this.form.storeName;
				this.rules = this.ruleInfo;
				//				console.log(JSON.stringify(this.form))
				// this.form.status
			} else if(this.getPageType == '修改') {
				this.rules = this.noRules;
				this.disabledSet = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				let val = this.form.userType;
				if(val=="门店用户-店长"||val=="门店用户-其他"||val=="门店用户-收银员"||val=="门店用户-导购"){
					this.noRules.storeName=[{
								required: true,
								message: '请选择所属门店',
								trigger: 'change'
							}]
					this.rules.storeName=[{
								required: true,
								message: '请选择所属门店',
								trigger: 'change'
							}]
					this.storeFlag=true;
					this.storeLabelName="所属门店";
				}else if(val=="品牌用户"){
					this.storeFlag=false;
					this.noRules.storeName=[];
					this.rules.storeName=[];
				}else if(val=="区域用户"){
					this.storeFlag=true;
					this.storeLabelName="所属区域";
					this.noRules.storeName=[{
								required: true,
								message: '请选择所属区域',
								trigger: 'change'
							}]
					this.rules.storeName=[{
								required: true,
								message: '请选择所属区域',
								trigger: 'change'
							}]
				}else if(val=="店组用户"){
					this.storeFlag=true;
					this.storeLabelName="所属店组";
					this.noRules.storeName=[{
								required: true,
								message: '请选择所属店组',
								trigger: 'change'
							}]
					this.rules.storeName=[{
								required: true,
								message: '请选择所属店组',
								trigger: 'change'
							}]
				}
//				console.log(JSON.stringify(this.form))
				if(this.form.userHeaderUrl!=""){
					this.dialogImageUrl = this.form.userHeaderUrl+'?x-oss-process=style/small'; // 
				}
				this.imageUrl = this.form.userHeaderUrl; // 上传图片路径
//				console.log(this.form.storeId.split(","))
				this.value2 = this.form.storeId.split(",");
				this.storeArr = this.form.storeName;
				if(this.form.documentType != "") {
					this.disabledIdCard = false;
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
			getpageTypeOther() {
				return this.$route.params.pageTypeOther;
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
	.height32{
		height: 32px;
	}
	.search {
		position: relative;
	}
	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	
	.Store .el-dialog .el-form {
		position: inherit;
	}
	.Store .el-dialog .role {
		height: 400px;
		width: 100%;
	}
	
	.el-form {
		overflow: hidden;
	}
	
	.el-form-item {
		width: 33%;
		float: left;
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
		margin-bottom: -1px;
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
		width: 140px;
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
	.activitySpan {
		display: block;
		color: #AEAEAE;
	}
	/*文本框width*/
	
	.el-date-editor.el-input,
	.el-date-editor.el-input__inner {
		width: 100%;
	}
	
	#transfer {
		display: none;
	}
	.error-color {
		color: blue;
	}
	.margin10{
		margin-bottom:10px
	}
</style>