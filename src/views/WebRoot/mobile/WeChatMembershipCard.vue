// 页面设置 - 微信会员卡
<template>
	<el-container class="app-container">
        <div class="transitionArea">
            <transition name="el-zoom-in-top">
                <el-card v-show="show2" class="transition-box" :style="{'background-color': auditStatus.color}">{{auditStatus.txt}}</el-card>
            </transition>
        </div>
		<el-header>
			<h4>微信会员卡</h4>
		</el-header>
		<el-main class="container-main" v-loading="enterLoading">
			<el-row>
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{ headerSelect }}</div>
					</el-header>
					<el-main class="main-mobile">
						<div class="main-mobile-container">
							<div @click="contDisabled ? clickNo() : groupType = '会员卡片'">
								<div class="cardBox">
									<div class="imgBox" ref="imgBox" :style="{'background-color': '#63b359'}">
										<img v-if="form.coverType=='图片'" :src="dialogImageUrl2" class="dialogImage" alt="">
									</div>
									<div class="imgHeader">
										<img :src="dialogImageUrl" alt="">
										<div class="imgHeaderTitle">
											<span>{{form.cardBrandName}}</span>
											<span>{{form.title}}</span>
										</div>
									</div>
									<div class="cardInfo">
										1314159
									</div>
								</div>
								<el-row class="couponInfo">
									<el-col :span="8">
										<el-row class="borderRight">
											<el-col>积分</el-col>
											<el-col :style="centerkeycolor">查看</el-col>
										</el-row>
									</el-col>
									<el-col :span="8">
										<el-row class="borderRight">
											<el-col>优惠券</el-col>
											<el-col :style="centerkeycolor">查看</el-col>
										</el-row>
									</el-col>
									<el-col :span="8">
										<el-row>
											<el-col>等级</el-col>
											<el-col :style="centerkeycolor">普通会员</el-col>
										</el-row>
									</el-col>
								</el-row>
							</div>
							<!-- 暂时改为不可编辑-->
							<!-- <div class="btnMenberCenter" @click="contDisabled ? clickNo() : groupType = '中心按钮'" v-if="form.customButtom.buttomType == '自定义按钮'">  -->
							<div class="btnMenberCenter"> 
								<el-button plain disabled ref="centkeycolor" :style="centerkeycolor">{{form.customButtom.buttomName}}</el-button>
							</div>
							<div class="btnAdd" @click="contDisabled ? clickNo() : groupType = '添加自定义入口'">
								<div class="weui-cells">
									<a class="weui-cell weui-cell_access" href="javascript:;" v-for="item in form.customEntry" :key="item" v-if="item.name.length > 0">
										<div class="weui-cell__bd">
											<p>{{ item.name }}</p>
										</div>
										<div class="weui-cell__ft">
										</div>
									</a>
								</div>
								<el-button class="marginTop10" v-if="form.customEntry.length == 0" @click="contDisabled ? clickNo() : groupType = '添加自定义入口'"><i class="el-icon-plus"></i></el-button>
							</div>
						</div>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>设置微信会员卡内容</span>
					</el-header>
					<el-main class="padding10">
						<el-form :model="form" :rules="rules" ref="form" label-width="90px" class="demo-form">
							<div v-if="groupType == '会员卡片'">
                                <el-form-item label="主标题" prop="cardBrandName">
                                    <el-input v-model="form.cardBrandName" placeholder="请输入主标题" :disabled="contDisabled"></el-input>
                                </el-form-item>
								<el-form-item label="副标题" prop="title">
									<el-input v-model="form.title" placeholder="请输入副标题" :disabled="contDisabled"></el-input>
								</el-form-item>
								<el-form-item label="品牌logo" prop="brandLogo">
									<el-row class="bgImage space-around">
										<el-col :span="6" class="height100" v-loading="imgLoading1">
											<div class="icon-close">
												<img v-if="dialogImageUrl" :src="dialogImageUrl + '?x-oss-process=style/small'" @click="contDisabled ? clickNo() : clickTest()" class="avatar">
												<i v-else class="el-icon-plus avatar-uploader-icon" @click="contDisabled ? clickNo() : clickTest()"></i>
												<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="contDisabled ? clickNo() : handleUploadDelete()"></i>
											</div>
											<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
												<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
												<input type="submit" value="上传" ref="uploadSubmit" />
											</form>
											<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
											<el-dialog :visible.sync="dialogVisible">
												<img width="100%" :src="form.brandLogo" alt="">
											</el-dialog>
										</el-col>
										<p class="advice">建议尺寸 ：300 * 300 像素</p>
									</el-row>
								</el-form-item>
								<el-form-item label="卡券封面" prop="coverDesc">
									<el-radio-group v-model="form.coverType" placeholder="请选择卡券封面" :disabled="contDisabled" @change="handleCoverType">
										<el-radio label="颜色"></el-radio>
										<el-radio label="图片"></el-radio>
									</el-radio-group>
									<el-row>
										<el-col class="coverColor">
											<el-radio-group v-model="form.coverDesc" v-if="form.coverType == '颜色'" @change="funShowColor">
												<el-radio v-for="item in colorSelectList" :key="item.key" :label="item.value" class="marginLeft0" :disabled="contDisabled">
													<div class="colorBox" :style="{backgroundColor: item.key}"></div>
												</el-radio>
											</el-radio-group>
										</el-col>
									</el-row>
									<el-row class="bgImage space-around" v-if="form.coverType == '图片'">
										<el-col :span="6" class="height100">
											<div class="icon-close" v-loading="imgLoading2">
												<img v-if="dialogImageUrl2" :src="dialogImageUrl2 + '?x-oss-process=style/small'" @click="contDisabled ? clickNo() : clickTest2()" class="avatar">
												<i v-else class="el-icon-plus avatar-uploader-icon" @click="contDisabled ? clickNo() : clickTest2()"></i>
												<i v-if="dialogImageUrl2" class="el-icon-circle-close" @click="contDisabled ? clickNo() : handleUploadDelete2()"></i>
											</div>
											<form :action="uploadAction2" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
												<input type="file" name="file" ref="uploadIpt2" @change="handleSelectImg2" />
												<input type="submit" value="上传" ref="uploadSubmit2" />
											</form>
											<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
											<el-dialog :visible.sync="dialogVisible2">
												<img width="100%" :src="form.coverDesc" alt="">
											</el-dialog>
											<p class="advice">300 * 300 像素</p>
										</el-col>
									</el-row>
								</el-form-item>
								<h6 class="space-around">会员卡号</h6>
								<el-card>
									<el-form-item label="会员卡号">
										<el-radio-group v-model="form.cardSet.cardType" placeholder="输入会员卡号" :disabled="contDisabled">
                                            <el-radio label="电子卡号">电子卡号</el-radio>
                                            <el-radio label="手机号">手机号</el-radio>
                                            <el-radio label="品牌卡号">品牌卡号</el-radio>
                                        </el-radio-group>
									</el-form-item>
									<el-form-item label="会员识别" class="memberIdentification">
										<el-radio-group v-model="form.cardSet.cardDiscern" class="width70" :disabled="contDisabled">
											<el-row :gutter="20">
												<el-col :span="8">
													<el-radio label="仅卡片"></el-radio>
												</el-col>
												<el-col :span="8">
													<el-radio label="卡号和二维码"></el-radio>
												</el-col>
												<el-col :span="8">
													<el-radio label="卡号和条形码"></el-radio>
												</el-col>
											</el-row>
										</el-radio-group>
										<el-row class="instructionsInfo" :gutter="20">
											<el-col :span="8">
												<el-card class="onlyNum">
													<span>111-222-333</span>
												</el-card>
											</el-col>
											<el-col :span="8">
												<el-card>
													<img :src="qrCodeUrl" alt="">
													<span>111-222-333</span>
												</el-card>
											</el-col>
											<el-col :span="8">
												<el-card>
													<img :src="barCodeUrl" alt="" class="width100">
													<span>111-222-333</span>
												</el-card>
											</el-col>
										</el-row>
									</el-form-item>
									<el-form-item label="操作提示">
										<el-input v-model="form.cardSet.opHint" placeholder="请输入操作提示" :disabled="contDisabled"></el-input>
									</el-form-item>
								</el-card>
								<h5 class="space-around">会员卡详情</h5>
								<el-card>
									<el-form-item label="会员特权" prop="cardDetail.prerogative">
										<el-input type="textarea" :rows="3" resize="none" placeholder="请输入内容" v-model="form.cardDetail.prerogative" :disabled="contDisabled">
										</el-input>
									</el-form-item>
									<el-form-item label="使用说明">
										<el-input type="textarea" :rows="3" resize="none" placeholder="请输入内容" v-model="form.cardDetail.useDesc" :disabled="contDisabled">
										</el-input>
									</el-form-item>
								</el-card>
								<h5 class="space-around" v-show="">微信会员卡中转页</h5>
								<div class="isJump" v-show="">
									<span>开启后，注册时会先跳转到中转页，由消费者选择注册或绑定，常用于绑定老会员卡号时使用。</span>
									<el-checkbox label="禁用" v-model="isJump" :disabled="contDisabled"></el-checkbox>
								</div>
							</div>
							<div v-if="groupType == '中心按钮'">
								<h5 class="space-around">中心按钮(会员卡激活后才会显现)</h5>
								<el-form-item label="会员特权">
									<el-radio-group v-model="form.customButtom.buttomType" placeholder="请选择按钮类型" @change="handleSelectCustom" :disabled="contDisabled">
										<el-radio label="自定义按钮"></el-radio>
										<el-radio label='微信支付(打开"钱包支付")'></el-radio>
									</el-radio-group>
								</el-form-item>
								<div v-if="form.customButtom.buttomType == '自定义按钮'">
									<el-form-item label="按钮名称">
										<el-input v-model="form.customButtom.buttomName" placeholder="请输入按钮名称" :disabled="contDisabled"></el-input>
									</el-form-item>
									<el-form-item label="跳转地址">
										<el-input v-model="form.customButtom.gotoUrl" placeholder="请输入跳转地址" :disabled="contDisabled"></el-input>
									</el-form-item>
									<el-form-item label="提示语">
										<el-input v-model="form.customButtom.hint" placeholder="请输入提示语" :disabled="contDisabled"></el-input>
									</el-form-item>
								</div>
							</div>
							<div v-if="groupType == '添加自定义入口'">
								<h5 class="space-around">添加自定义入口(最多添加3个)</h5>
								<div v-for="(item, index) in form.customEntry" :key="item">
									<el-form-item label="入口名">
										<el-input v-model="item.name" placeholder="请输入入口名" :disabled="disabled[index] && contDisabled"></el-input>
										<span>链接到</span>
										<el-dropdown trigger="click" @visible-change="handleBtnDropDown(index)" @command="handleClickDropdown" :disabled="contDisabled">
											<el-button type="primary" class="minWidth50" >
												{{item.urlName}}<i class="el-icon-arrow-down el-icon--right"></i>
											</el-button>
											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item v-for="item in dropDownItems" :key="item" :command="item.name">{{item.name}}</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>

										<!-- <a class="marginLR colorRed" href="javascript:;" @click="contDisabled ? clickNo() : handleCustomEntryEdit(index)" v-if="disabled[index]" :disabled="contDisabled">
											<el-tooltip class="item" content="修改" placement="top">
												<i class="iconfont icon-edit" ></i>
											</el-tooltip>
										</a>
										<a class="marginLR colorBlue" href="javascript:;" @click="contDisabled ? clickNo() : handleCustomEntryEdit(index)" v-else :disabled="contDisabled">
											<el-tooltip class="item" content="确认" placement="top">
												<i class="iconfont icon-shezhiqiyong" ></i>
											</el-tooltip>
										</a>
										<a class="marginLR" href="javascript:;" @click="contDisabled ? clickNo() : handleCustomEctryDelete(index)" :disabled="contDisabled">
											<el-tooltip class="item" content="删除" placement="top">
												<i class="iconfont icon-delete"  ></i>
											</el-tooltip>
										</a> -->
									</el-form-item>
								</div>
								<el-button class="width70" @click="contDisabled ? clickNo() : handleCustomEctryAdd()" :disabled="contDisabled">添加</el-button>
							</div>
						</el-form>
					</el-main>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8" class="el-col-button"></el-col>
				<el-col :span="16" class="el-col-button">
					<el-button type="primary" @click="contDisabled ? clickNo() : handleSave()" v-if="roleBtn.saveWechatCardConfigInfo">保存</el-button>
					<el-button type="primary" @click="contDisabled ? clickNo() : handlePush()" v-if="roleBtn.submitWechatCardConfigInfo">保存并新建</el-button>
				</el-col>
			</el-row>
		</el-main>

	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { uploadImg, uploadImg2 } from '@/api/base/brandInfo' // 上传图片接口
	import Cookie from 'js-cookie'
	import { mapGetters } from "vuex";
	import Sortable from 'sortablejs' // 排序
	import qrCodeUrl from '@/assets/images/twoQcode.png' // 二维码图片
	import barCodeUrl from '@/assets/images/oneQcode.png' // 条形码图片
	import { WeChatMembershipCardShow, WeChatMembershipCardEdit, dropDownShow, WeChatMembershipCardLogo, WeChatMembershipCardCardPicture, WeChatMembershipCardPush, selectLevel } from '@/api/mobile/WeChatMembershipCard'
	import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
	import { selectLevalInfo ,getCustomLinksConstCustomize} from '@/api/public';
	let colorSelect = {
		'Color010': '#63b359',
		'Color020': '#2c9f67',
		'Color030': '#509fc9',
		'Color040': '#5885cf',
		'Color050': '#9062c0',
		'Color060': '#d09a45',
		'Color070': '#e4b138',
		'Color080': '#ee903c',
		'Color081': '#f08500',
		'Color082': '#a9d92d',
		'Color090': '#dd6549',
		'Color100': '#cc463d',
		'Color101': '#cf3e36',
		'Color102': '#5E6671',
	}
	export default {
		data() {
			return {
				enterLoading:false,
				getUrlName:'',
                show2: false,
                auditStatus: {
                    txt: '',
                    color: '#FFF'
                },
                contDisabled: false,
				roleBtn: {
					selectWechatCardConfigInfo: false,
					saveWechatCardConfigInfo: false,
					submitWechatCardConfigInfo: false
				},
				// 数据
				qrCodeUrl,
				barCodeUrl,
				// 上传图片
				imgLoading1: false,
				imgLoading2: false,
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_832.action', // 上传图片路径
				dialogImageUrl2: '', // 图片列表
				dialogVisible2: false,
				uploadAction2: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_833.action', // 上传图片路径

				groupType: '会员卡片',
				headerSelect: "",
				headerSelectItems: [{
					value: "双皮奶",
					label: "双皮奶"
				}],
				colorSelectList: [{
						key: '#63b359',
						value: 'Color010'
					},
					{
						key: '#2c9f67',
						value: 'Color020'
					},
					{
						key: '#509fc9',
						value: 'Color030'
					},
					{
						key: '#5885cf',
						value: 'Color040'
					},
					{
						key: '#9062c0',
						value: 'Color050'
					},
					{
						key: '#d09a45',
						value: 'Color060'
					},
					{
						key: '#e4b138',
						value: 'Color070'
					},
					{
						key: '#ee903c',
						value: 'Color080'
					},
					{
						key: '#f08500',
						value: 'Color081'
					},
					{
						key: '#a9d92d',
						value: 'Color082'
					},
					{
						key: '#dd6549',
						value: 'Color090'
					},
					{
						key: '#cc463d',
						value: 'Color100'
					},
					{
						key: '#cf3e36',
						value: 'Color101'
					},
					{
						key: '#5E6671',
						value: 'Color102'
					},
				],
				form: {
					"levelCode": "", // 等级编码
					"levelName": "", // 等级名称
					"brandLogo": "", // 品牌Logo
                    "cardBrandName": "", // 主标题
					"title": "", // 副标题
					"coverType": "颜色", // 封面类型（颜色、图片）
					"coverDesc": "Color010", // 封面内容
					"cardSet": { // 会员卡号设置（json格式字符串）
						"cardType": "电子卡号", // 电子卡号/手机号/品牌卡号
						"cardDiscern": "仅卡片", // 仅卡号/卡号和二维码/卡号和条形码
						"opHint": "" // 操作提示
					},
					"cardDetail": { // 会员卡详情（json格式字符串）
						"prerogative": "", // 会员特权
						"useDesc": "" // 使用说明
					},
					"status": "", // 状态（启用、禁用）
					"customEntry": [ // 自定义入口（json格式字符串）
						{
							"name": "会员卡详情", // 入口名
							"url": "", // 跳转入径
							"urlName":""
						}
					],
					"customButtom": { // 自定义按钮（json格式字符串）
						"buttomType": "自定义按钮", // 自定义按钮/微信支付
						"buttomName": "会员中心", // 按钮名称
						"gotoUrl": "", // 跳转地址
						"hint": "" // 提示语
					}
				},
				centerkeycolor: {"color":"#63b359","border-color":"#63b359"},
				disabled: [true, true, true],
				rules: {
					title: [
						{ required: true, message: '请输入副标题', trigger: 'blur' },
					],
                    cardBrandName: [
                        { required: true, message: '请输入主标题', trigger: 'blur' }
					],
					'cardDetail.prerogative': [
						{ required: true, message: '请输入会员特权', trigger: 'blur' }
					],
					'brandLogo': [
						{ required: true, message: '请选择品牌LOGO', trigger: 'blur' }
					],
					'coverDesc': [
						{ required: true, message: '请选择卡券封面', trigger: 'blur' }
					]
				},
				// 是否跳转页面
				isJump: true,
				// 自定义入口数据
				items: [{
					name: '会员卡详情',
					link: '我的会员卡详情',
					isRequired: true
				}],
				dropDownIndex: '',
				// 下拉菜单
				dropDownItems: [
					// {
					// 	label: '我的专属导购',
					// 	value: '我的专属导购'
					// },
					// {
					// 	label: '首页',
					// 	value: '首页'
					// }
				],
				levelNameOptions: [
					// {
					// 	label: '金卡',
					// 	value: '金卡'
					// },
					// {
					// 	label: '银卡',
					// 	value: '银卡'
					// },
					// {
					// 	label: '铂金卡',
					// 	value: '铂金卡'
					// },
				],
				// 添加导航
				dialogTableVisible: false,

			};
		},
		// components: {
		//     activePhoneSortable
		// },
		methods: {
			// 卡券封面切换 【颜色，图片】
			handleCoverType(str) {
				if(str == '颜色') {
					this.form.coverDesc = 'Color010';
				}else {
					this.form.coverDesc = '';
				}
			},
			// 会员中心 - 会员特权
			handleSelectCustom(str) {
				// console.log(str);
				// if(str == '微信支付(打开"钱包支付")') {
				// 	this.form.customButtom.buttomName = '';
				// 	this.form.customButtom.gotoUrl = '';
				// 	this.form.customButtom.hint = '';
				// }
			},
			handleSelectLevelName(str) {
				this.form.levelCode = this.levelNameOptions[str].value;
				this.form.levelName = this.levelNameOptions[str].key;
			},
			handlePush() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.form.status = this.isJump ? "禁用" : "启用";
						let params = {
							"userId": this.userInfo.userCode,
							...this.form
						}
						this.enterLoading=true;
						WeChatMembershipCardPush(params)
							.then((res) => {
								//                  console.log(res);
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								this.enterLoading=false;
								if(code == 'SUCCESS') {
									this.$message.success(msg);
									this.tableShow();
								} else {
									this.$message.error(msg);
									this.tableShow();
								}
							})
							.catch((err) => {
								// console.log(err);
							})
					}
				});
			},
			// 方法
			funShowColor(str) {
				        //  console.log(str);
			},
			tableShow() {
				let params = {
					"userId": this.userInfo.userCode
				}
				WeChatMembershipCardShow(params) //830配置信息
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						    console.log(JSON.stringify(msg));
						if(code == 'SUCCESS') {
							if(JSON.stringify(msg) != '{}') {
								this.dialogImageUrl = msg.brandLogo;
								if(msg.coverType == '图片') {
									this.dialogImageUrl2 = msg.coverDesc;
								}
                                if(!msg.cardBrandName) {
                                    msg.cardBrandName = '';
								}
								
                                if(msg.auditStatus == '待审核') {
									this.show2 = true;
                                    this.auditStatus.txt = '会员卡状态：微信正在进行审核处理，审核一般在1-3个工作日，审核时间不允许修改会员卡';
                                    this.auditStatus.color = '#FFA847';
                                    this.contDisabled = true;
                                } else if(msg.auditStatus == '已生效') {
                                    this.show2 = true;
                                    this.auditStatus.txt = '会员卡状态：会员卡已生效，可正常使用';
                                    this.auditStatus.color = '#21BA5C';
                                    this.contDisabled = false;
                                }else {
                                    this.show2 = false;
                                    this.contDisabled = false;
                                }
								this.form = msg;
								if(this.form.customEntry.length==1){
									if(this.form.customEntry.url==""){
										this.form.customEntry.urlName='';
									}
								}
								this.dropDownItems.forEach((value,index)=>{
									this.form.customEntry.forEach((val,ind)=>{
										if(value.url==val.url){
											this.form.customEntry[ind].urlName = val.name;
										}else{
											this.form.customEntry[ind].urlName ='';
										}
									})
								})
//								console.log(JSON.stringify(this.dropDownItems))
								this.isJump = msg.status == '禁用' ? true : false;
							}
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
//						 console.log(err);
					});
			},
			droupDownShow() {
				let params = {
					userId:this.userInfo.userCode
				}
				getCustomLinksConstCustomize(params) //381菜单列表
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							msg = data.messageContent;
//							console.log(JSON.stringify(data))
							if(!msg) {
								this.dropDownItems = [
									{
										label: '暂无数据',
										value: '暂无数据'
									},
								];
							}else {
								this.dropDownItems = msg;
							}

					})
					.catch((err) => {
//						 console.log(err);
					})
			},
			handleBtnDropDown(index) {
				this.dropDownIndex = index;
			},
			handleClickDropdown(command) {
//				console.log(this.dropDownIndex)
				this.dropDownItems.forEach((val,index)=>{
					if(command==val.name){
						this.form.customEntry[this.dropDownIndex].url = val.url;
						this.form.customEntry[this.dropDownIndex].urlName = val.name;
						if(this.getUrlName.length==0){
							this.getUrlName=val.name;
						}else{
							this.getUrlName=val.name;
						}
					}
				})
//				console.log(JSON.stringify(this.getUrlName))
			},
			// 自定义入口编辑
			handleCustomEntryEdit(index) {
				this.disabled.splice(index, 1, !this.disabled[index]);
			},
			// 自定义入口删除
			handleCustomEctryDelete(index) {
				this.form.customEntry.splice(index, 1);
			},
			// 自定义入口添加
			handleCustomEctryAdd() {
				// this.items.push({
				//     name: '',
				//     link: '',
				//     isRequired: false
				// });
				if(this.form.customEntry.length < 3) {
					this.form.customEntry.push({
						name: '',
						url: '',
						urlName: ''
					});
				}
			},
			// 发布
			handleSave() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.form.status = this.isJump ? "禁用" : "启用";
						let params = {
							"userId": this.userInfo.userCode,
							...this.form
						}
//                      console.log(JSON.stringify(params)); return false;
						this.enterLoading=true;
						WeChatMembershipCardEdit(params)
							.then((res) => {
								//                  console.log(res);
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								this.enterLoading=false;
								if(code == 'SUCCESS') {
									this.$message.success(msg);
									this.tableShow();
								} else {
									this.$message.warning(msg);
									this.tableShow();
								}
							})
							.catch((err) => {
								// console.log(err);
							});
					} else {
						return false;
					}
				});
			},

			// 上传图片
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
					this.imgLoading1 = true;
					var reader = new FileReader();
					reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件
					//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
					reader.onload = function(e) {
						// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
						// that.$refs.uploadSubmit.dispatchEvent(new MouseEvent('click')); // 上传图片
						let formData = new FormData(); // 可以增加表单数据
						formData.append("file", files); // 文件对象
						uploadImg2(formData)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								//                          console.log(msg.fileName)
								that.form.brandLogo = msg.fileName; // 图片赋值
								// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
								that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
//								console.log(msg.fileName);
	
								that.$message.success('上传成功');
								that.imgLoading1 = false;
							})
							.catch((err) => {
								// console.log(err);
								that.imgLoading1 = false;
							})
					}
				}
			},
			clickTest() {
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.form.brandLogo = '';
				this.$refs.uploadIpt.value = '';
			},

			handleSelectImg2(file) { // 上传图片
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
					this.imgLoading2 = true;
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
								//                          console.log(msg.fileName)
								that.form.coverDesc = msg.fileName; // 图片赋值
								// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
								that.dialogImageUrl2 = msg.fileName; // 图片回填 - 本地图片
								that.$message.success('上传成功');
								that.imgLoading2 = false;
							})
							.catch((err) => {
								// console.log(err);
								that.imgLoading2 = false;
							})
					}
				}
			},
			clickTest2() {
				this.$refs.uploadIpt2.dispatchEvent(new MouseEvent('click'));
			},

			clickNo() {
				this.$message('会员卡正在审核当中，不允许当前操作！');
			},

			handlePictureCardPreview2(file) { // 图片查看
				this.dialogVisible2 = true;
			},
			handleUploadDelete2() { // 删除图片
				this.dialogImageUrl2 = '';
				this.form.brandLogo = '';
				this.$refs.uploadIpt2.value = '';
			},

		},
		created() {
			let that = this;
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			// this.handleTableDataShow(); // 显示表格
			this.droupDownShow(); // dropDownShow 381菜单列表
			this.tableShow();//830配置信息

			// 会员模式
			let params = {
				userId: this.userInfo.userCode
			}
			customizeSelect(params) //343品牌
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					// count = data.count,
					// msg = data.data;
					// console.log(msg)
					if(code == 'SUCCESS') {
						this.headerSelect = msg.brandName;
					} else {
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
			// 会员等级
			let params2 = {
				userId: this.userInfo.userCode
			}
			selectLevalInfo(params2) //请求会员等级603
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					if(!data.data) {
						that.levelNameOptions = [];
					}else {
						that.levelNameOptions = data.data;
					}
				})
		},
		computed: {
//			getUrlName:function(){
//				if(this.dropDownIndex){
//					console.log(this.form.customEntry[this.dropDownIndex].urlName)
//					return this.form.customEntry[this.dropDownIndex].urlName;
//				}
//			},
			// 计算属性
			...mapGetters(["userInfo"])
		},
		watch: {
			'form.coverDesc': function(val, index) {
				if(this.form.coverType == '颜色') {
					this.$refs.imgBox.style.backgroundColor = colorSelect[val];
					this.centerkeycolor.color = colorSelect[val];
					this.centerkeycolor.borderColor = colorSelect[val];
				}
			},
            'form.cardBrandName': function(val, oldVal) {
//              console.log(val, oldVal);
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
		//   display: inline-block;
		//   position: absolute;
		//   margin-left: rem(20px);
	}

	.el-input {
		width: 40%;
	}

	.el-textarea {
		width: 80%;
	}

	.dsh-center {
		display: flex;
		justify-content: center;
	}
	.dsh-vertical-center {
		display: flex;
		align-items: center;
	}

	.container-main .el-col.el-col-container {
		border: 1px solid #d2d2d2;
		font-size: 14px;
		background: #FFF;
	}

	.container-main .el-col.el-col-button {
		padding: rem(20px);
		display: flex;
		justify-content: center;
		font-size: 14px;
	}

	.container-main .el-header {
		width: 100%;
		height: 50px !important;
		padding: 10px;
		background: #f5f7fa;
	}

	.container-main .el-main {
		position: relative;
		// height: 440px;
	}
	.cardBox {
		position: relative;
		color: #FFF;
		.imgBox {
			width: 100%;
			height: 150px;
			// padding: 5px;
		}
		.imgHeader {
			position: absolute;
			top: 20px;
			left: 20px;
			height: 60px;
			img {
				width: 60px;
				height: 60px;
				border-radius: 50%;
			}
            .imgHeaderTitle {
                position: absolute;
                top: 0;
                left: 80px;
                min-width: 130px;
                height: 100%;
                display: inline-block;
                span {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    float: left;
                }
            }
		}
		.cardInfo {
			position: absolute;
			left: 20px;
			bottom: 20px;
		}
	}

	.couponInfo {
		text-align: center;
		border-bottom: 1px solid #d2d2d2;
		padding-bottom: 10px;
		margin-bottom: 10px;
		margin-top: 10px;
		.borderRight {
			border-right: 1px solid #d2d2d2;
		}
		.el-col {
			line-height: 24px;
		}
		.colorActive {
			color: #3399FF;
		}
	}

	.btnMenberCenter {
		text-align: center;
		.el-button {
			width: 30%;
			height:40px;
		}
	}

	.btnAdd {
		margin-top: 10px;
		.el-button {
			width: 100%;
		}
	}

	.sortable-ghost {
		opacity: .8;
		color: #fff!important;
		background: red!important;
	}

	.width70{
		width: 70%;
	}
	.minWidth50{
		min-width: 50px;
	}
	// 使用说明
	.memberIdentification {
		.instructionsInfo {
			width: 70%;
			img {
				height: 35px;
				display: block;
				margin: 0 auto;
			}
			.el-card {
				height: 80px;
				width: 90%;
			}
			.onlyNum {
				display: flex;
				align-items: center;
			}
		}
	}

	.marginLR {
		margin: 0 10px;
	}

	.coverColor {
		.el-radio {
			margin: 10px;
		}
		div.colorBox {
			display: inline-block;
			width: 40px;
			height: 40px;
			border: 1px solid #d2d2d2;
		}
	}

	// 上传图片
	/* 上传图片 */
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
	.bgImage {
		.el-col:last-child {
			height: 80px;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
		}
	}

	.space-around {
		margin-bottom: 10px;
	}

	.editBg {
		color: #009ee2;
		cursor: pointer;
	}

	.advice {
		color: #d2d2d2;
		margin-top: 68px;
	}

	.icon-rank {
		font-size: 20px;
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
		width: 100px;
		height: 100px;
		line-height: 80px;
		text-align: center;
		cursor: pointer;
	}

	.avatar {
		display: block;
		width: 100px;
		height: 100px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		cursor: pointer;
	}

	.avatar:hover {
		border-color: #409EFF;
	}
	.isJump {
		.el-checkbox {
			float: right;
		}
	}

    .transitionArea {
        display: flex;
        // margin-top: 20px;
        // height: 40px;
    }
    .transition-box {
        height: 40px;
        text-align: center;
	}
	
	.main-mobile {
		positiion: relative;
		.main-mobile-container {
			margin: 0px;
		}
	}
	.dsh-header{
		display: flex;
		justify-content: space-between;
	}
	.dialogImage{
		width: 100%; 
		height: 100%;
		border-radius: 5px;
	}
	.padding10{
		padding: 10px;
	}
	.height100{
		height: 100px;
	}
	.marginLeft0{
		margin-left: 0;
	}
</style>
