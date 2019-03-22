// 会员查询-会员信息详情-会员信息页签
<template>
	<el-card class="userCenter">
		<div class="dsh-userInfo" :style="basicInfoStyle">
			<div class="dsh-basicInfo">
				<div class="floatLeft basicInfo">
					<div class="dsh-headerImg">
						<img :src="userInfos.userUrl"/>
					</div>
				</div>
				<div class="floatLeft overHidden dsh-otherBasicInfo">
					<div class="name"><span>姓名：{{userInfos.userName}}</span><span class="sex sexWomen" v-if="this.userInfos.sex=='女'"><img :src="sexWomen"/><span>{{userInfos.age==""?0:userInfos.age}}</span></span><span class="sex sexMan" v-else><img :src="sexMan"/><span>{{userInfos.age==""?0:userInfos.age}}</span></span></div>
					<div class="name">生日：{{userInfos.birthDate}}</div>
					<div class="name">等级：{{userInfos.memberLevel}}</div>
				</div>
				<div class="dsh-growthValue">
						<b>成长值:</b><span>{{userInfos.expValue==""?0:userInfos.expValue}}</span>
				</div>
				<!-- <div class="dsh-progress" :style="{backgroundImage: 'url(' + grouthvalue + ')' }"> -->
				<div class="nextGrowth">
					<div class="dsh-progress">
						<!-- <img :src="grouthvalue"> -->
						<span :style="{width:GrowthVal+'%'}"></span>
					</div>
					<p>{{userInfos.nextExpValue}}</p>
				</div>

			</div>
			<div class="overHidden dsh-otherInfo">
				<div class="name">手机：{{userInfos.mobile}}</div>
				<div class="name">昵称：{{userInfos.nickName}}</div>
				<div class="name">线上卡号：{{userInfos.onLineCardNum}}</div>
				<div class="name">线下卡号：{{userInfos.lineCardNum}}</div>
			</div>
			<div class="dsh-saleInfo">
				<ul>
					<li><span><img :src="consumption"/><b>累计消费</b></span><span class="orderAmout dsh-btn">{{orderInfo.orderAmout}}</span></li>
					<li><span><img :src="integration"/><b>可用积分</b></span><span class="availableIntegral dsh-btn">{{integralInfo.availableIntegral}}</span></li>
					<li><span><img :src="activity"/><b>活跃度</b></span><span class="liveness dsh-btn"></span></li>
					<li><span><img :src="recently"/><b>最近消费时间</b></span><span class="lastOrderDate dsh-btn">{{orderInfo.lastOrderDate}}</span></li>
				</ul>
			</div>
			<div class="dsh-moreBtn" @click="moreUserInfo"><div><b>更多资料</b><img v-show="isMoreinformation" :src="moreinformation"/><img v-show="!isMoreinformation" :src="moreinformation" class="isMoreinformation"/></div></div>
		</div>
		<div class="moreUserInfo" v-if="!isMoreinformation">
			<ul>
				<li><span>生肖: </span><span>{{userInfos.constellation}}</span></li>
				<li><span>学历: </span><span>{{userInfos.education}}</span></li>
				<li><span>身高尺码: </span><span></span></li>
				<li><span>证件类型: </span><span>{{userInfos.idType}}</span></li>
				<li><span>生日农历：</span><span>{{userInfos.birthDateLunar}}</span></li>
				<li><span>QQ: </span><span>{{userInfos.qqId}}</span></li>
				<li><span>微信openid: </span><span class="cursor" :title="userInfos.openId">{{userInfos.openId}}</span></li>
				<li><span>证件号码: </span><span class="cursor" :title="userInfos.idNumber">{{userInfos.idNumber}}</span></li>
				<li><span>星座: </span><span>{{userInfos.constellation}}</span></li>
				<li><span>微信: </span><span></span></li>
				<li><span>微信UnionId: </span><span class="cursor" :title="userInfos.unionId">{{userInfos.unionId}}</span></li>
				<li><span>地址信息: </span><span class="cursor" :title="userInfos.addr">{{userInfos.addr}}</span></li>
			</ul>
		</div>
		<div class="dsh-sale">
			<div class="dsh-saleInfoItem">
				<p>累计消费</p>
				<img :src="consumption_big"/>
				<ul>
					<li><span>累计消费金额 : </span><span>{{orderInfo.orderAmout}}</span></li>
					<li><span>累计消费件数 : </span><span>{{orderInfo.orderQty}}</span></li>
					<li><span>累计消费次数 : </span><span>{{orderInfo.orderCount}}</span></li>
					<li><span>累计退货次数 : </span><span>{{orderInfo.returnCount}}</span></li>
					<li><span>累计积分 : </span><span>{{orderInfo.totalIntegral}}</span></li>
					<li><span>累计退款金额 : </span><span>{{orderInfo.returnAmout}}</span></li>
				</ul>
			</div>
			<div class="dsh-saleInfoItem">
				<p>平均消费</p>
				<img :src="averageconsumption"/>
				<ul>
					<li><span>客单价 : </span><span>{{orderInfo.orderCustomerPrice}}</span></li>
					<li><span>折扣 : </span><span>{{orderInfo.discount}}</span></li>
					<li class="width100"><span>客单件 : </span><span>{{orderInfo.orderNo}}</span></li>
					<li><span>件单价 : </span><span>{{orderInfo.orderNo}}</span></li>
				</ul>
			</div>
			<div class="dsh-saleInfoItem">
				<p>最近消费</p>
				<img :src="recentconsumption"/>
				<ul>
					<li><span>最近消费渠道 : </span><span>{{orderInfo.lastOrderOrigin}}</span></li>
					<li><span>最近消费时间 : </span><span>{{orderInfo.lastOrderDate}}</span></li>
					<li><span>最近消费金额 : </span><span>{{orderInfo.lastOrderAmout}}</span></li>
					<li><span>最近消费件数 : </span><span>{{orderInfo.lastOrderQty}}</span></li>
					<li><span>最早消费渠道 : </span><span>{{orderInfo.firstOrderOrigin}}</span></li>
					<li><span>最早消费时间 : </span><span>2019-02-02</span></li>
				</ul>
			</div>
		</div>
		<span class="el-title">个人标签</span>
		<div class="dsh-labelInfo">
			<!-- <span class="dsh-labelAdd" type="text" @click="dialogVisible = true">+添加自定义标签</span> -->
			<div class="labelSpan">
				<div v-for="item in labelInfo" class="labelSpanItem">
					<div class="labelNames">{{item.labelName}} :<span v-for="labelValue in item.labelValue" :class="labelValue.color">{{labelValue.label}}</span>
					</div>
				</div>
				<div v-if="labelInfo.length==0">暂无标签</div>
			</div>
		</div>
		<span class="el-title">积分信息</span>
		<div class="dsh-integralInfo">
			<div class="integralInfo">
				<ul>
					<li><span>累计积分 : </span><span>{{integralInfo.totalIntegral}}</span></li>
					<li><span>可用积分 : </span><span>{{integralInfo.availableIntegral}}</span></li>
					<li><span>已兑换积分 : </span><span>{{integralInfo.convertibilityIntegral}}</span></li>
					<li><span>即将过期积分 : </span><span>{{integralInfo.forthcomIntegral}}</span></li>
				</ul>
			</div>
		</div>
		<span class="el-title">互粉互动</span>
		<div class="dsh-table">
			<el-table :data="interactionInfo" class="dsh-custom">
			    <el-table-column prop="platform" label="平台"></el-table-column>
			    <el-table-column prop="nickName" label="昵称"></el-table-column>
			    <el-table-column prop="wechat" label="微信号"></el-table-column>
			    <el-table-column prop="pubNumName" label="公众号名称"></el-table-column>
			    <el-table-column prop="interactionDate" label="互动时间"></el-table-column>
			    <el-table-column prop="interactionContent" label="互动内容"></el-table-column>
			</el-table>
		</div>
		<span class="el-title">会员变更记录</span>
		<div class="dsh-table">
			<el-table :data="memberChangeInfo" class="dsh-custom">
			    <el-table-column prop="changeName" label="变更名称"></el-table-column>
			    <el-table-column prop="changeContent" label="变更内容"></el-table-column>
			    <el-table-column prop="changeDate" label="变更时间"></el-table-column>
			    <el-table-column prop="changeBy" label="变更人"></el-table-column>
			    <el-table-column prop="remarks" label="备注"></el-table-column>
			</el-table>
		</div>
		<!-- <el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="30%"
		  :before-close="handleClose">
		  <span>这是一段信息</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog> -->
	</el-card>
	
</template>
<script>
	import { selectMember870} from '@/api/member/memberSelectInfo'
	import img1 from '@/assets/images/img1.png' 
	import img2 from '@/assets/images/img2.png' 
	import img3 from '@/assets/images/img3.png' 
	import img4 from '@/assets/images/img4.png' 
	import logo from '@/assets/images/000247589.jpg'
	import basicInfoBg from '@/assets/img_userInfo/member_bg_title.png'
	import sexWomen from '@/assets/img_userInfo/nav_icon_women.png'
	import sexMan from '@/assets/img_userInfo/nav_icon_man.png'
	import grouthvalue from '@/assets/img_userInfo/member_bg_grouthvalue.png'
	import consumption from '@/assets/img_userInfo/member_icon_consumption.png'
	import integration from '@/assets/img_userInfo/member_icon_integration.png'
	import activity from '@/assets/img_userInfo/menber_icon_activity.png'
	import recently from '@/assets/img_userInfo/menber_icon_recently.png'
	import moreinformation from '@/assets/img_userInfo/member_icon_moreinformation.png'
	import consumption_big from '@/assets/img_userInfo/member_icon_consumption_big.png'
	import averageconsumption from '@/assets/img_userInfo/member_icon_averageconsumption.png'
	import recentconsumption from '@/assets/img_userInfo/member_icon_recentconsumption.png'
	import { selectLabelData} from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				//dialogVisible: false,
				//labelGroupSelect: [],
				isMoreinformation:true, 
				img1:img1,
				img2:img2,
				img3:img3,
				img4:img4,
				GrowthVal:0,//成长值占比
				sexWomen:sexWomen,//性别女
				sexMan:sexMan,//性别男
				consumption:consumption,//累计消费
				integration:integration,//可用积分
				activity:activity,//活跃会员
				recently:recently,//最近消费日期
				basicInfoBg:basicInfoBg,//背景图片
				grouthvalue:grouthvalue,//等级进度条
				moreinformation:moreinformation,//更多资料
				consumption_big:consumption_big,//累计消费
				averageconsumption:averageconsumption,//平均消费
				recentconsumption:recentconsumption,//最近消费
				basicInfoStyle:{
					backgroundImage: 'url('+basicInfoBg+')'
				},
				labelName:[],
				//会员信息
				userInfos : {
		            "userUrl": "",//https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=371582480,3552328750&fm=200&gp=0.jpg
				    "nickName": "",//昵称
		            "userName": "",//姓名
		            "sex": "",//性别
		            "memberLevel": "",//会员等级
		            "nextExpValue":"",//下一等级
		            "onLineCardNum": "",//线上卡号
		            "lineCardNum": "",//线下卡号
		            "mobile": "",//手机号码
		            "email": "",//电子邮箱
		            "qqId": "",//QQ
		            "addr": "",//地址
		            "birthDate": "",//生日
		            "birthDateLunar": "",//生日农历
		            "constellation": "",//星座
		            "zodiac": "",//生肖
		            "idType": "",//证件类型
		            "idNumber": "",//证件号码
		            "maritalStatus": "",//婚姻状况
		            "education": ""//学历
		       },
				//个人标签
				labelInfo:[],
		        //入会信息
		        "memberInfo":{
		            "registeDate": "",//入会时间
		            "storeName": "",//入会门店
		            "entryPlatform": "",//入会平台
		            "registeDateLong": "",//入会时长
		            "guideName": "",//专属导购
		            "referrer": ""//推荐人
		        },
				//积分信息
				integralInfo:{
					"totalIntegral": "",
		  			"availableIntegral": "",
            		"convertibilityIntegral": "",
            		"forthcomIntegral": ""
				},
				//消费记录
				orderInfo:{
		            "orderAmout": "",
				    "orderCount": "",
		            "orderQty": "",
		            "returnCount": "",
		            "totalIntegral": "",
		            "returnAmout": "",
		            "orderCustomerPrice": "",
		            "orderNo": "",
		            "unitPrice": "",
		            "discount": "",
		            "lastOrderOrigin": "",
		            "lastOrderDate": "",
		            "lastOrderAmout": "",
		            "lastOrderQty": "",
		            "firstOrderOrigin": "",
		            "firstOrderDate": ""
		        },
		        //互粉互动
		        interactionInfo:[
//		        {
//		            "platform": "",//平台
//				    "nickName": "",//昵称
//		            "wechat": "",//微信号
//		            "pubNumName": "",//公众号名称
//		            "interactionDate": "",//互动时间
//		            "interactionContent": ""//互动内容
//		        }
		        ],
				//会员变更记录
				memberChangeInfo:[
//				{
//						"changeName":"变更名称",
//						"changeContent":"变更内容",
//						"changeDate":"变更时间",
//						"changeBy":"变更人",
//						"remarks":"备注"
//					}
				],
			}
		},
		methods: {
			//查看更多资料
			moreUserInfo(){
				if(this.isMoreinformation){
					this.isMoreinformation=false;
				}else{
					this.isMoreinformation=true;
				}
			},
			//添加自定义标签
			addLabel(){
				
			},
			//对话框
			handleClose(done) {
		        this.$confirm('确认关闭？')
		          .then(_ => {
		            done();
		          })
		          .catch(_ => {});
		    },
			//查询会员信息
			selectMember(){
				let params={
					"userId":this.userInfo.userCode,
					"memCode" : this.getFormData
				}
				let that =this;
				selectMember870(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let msg = data.messageContent;
						let result = [];
						if(data.messageType == "SUCCESS") {
							if(JSON.stringify(msg)=="{}"){
								that.$message({
									message:'没有查到会员信息！',
									type: 'warning'
								});
								return false;
							}
//							console.log(JSON.stringify(msg))
							that.userInfos = msg.userInfo;
							if(that.userInfos.userUrl==''){
								that.userInfos.userUrl= logo;
							}
							that.memberInfo = msg.memberInfo;
							that.integralInfo = msg.integralInfo;
							that.orderInfo = msg.orderInfo;
							that.interactionInfo = msg.interactionInfo;
							that.memberChangeInfo = msg.memberChangeInfo;
							//成长值占比
							if (!that.userInfos.nextExpValue) {
								that.GrowthVal = 100
							}else{
								that.GrowthVal = that.userInfos.expValue / that.userInfos.nextExpValue * 100
							};
							let labelStr = '';
							that.labelInfo=[];
							that.labelName.forEach((val,index)=>{
								msg.labelInfo.forEach((labelName,labelIndex)=>{
									if(labelName.labelName==val){
										if(labelStr.indexOf(val)==-1){
											labelStr+=val;
											that.labelInfo.push({
												labelName:val,
												labelValue:[]
											})
										}
									}
								})
							})
							that.labelInfo.forEach((labelData,labelIndex)=>{
								msg.labelInfo.forEach((val,index)=>{
									if(val.labelName==labelData.labelName){
										that.labelInfo[labelIndex].labelValue.push({
											label:val.labelValue
										});
									}
								})
							})
							that.labelInfo.forEach((labelData,index)=>{
								labelData.labelValue.forEach((label,labelIndex)=>{
									if(labelIndex%4==0){
										that.labelInfo[index].labelValue[labelIndex].color='spanColor';
									}
									if(labelIndex%4==1){
										that.labelInfo[index].labelValue[labelIndex].color='spanColor1';
									}
									if(labelIndex%4==2){
										that.labelInfo[index].labelValue[labelIndex].color='spanColor2';
									}
									if(labelIndex%4==3){
										that.labelInfo[index].labelValue[labelIndex].color='spanColor3';
									}
								})
							})
//							console.log(JSON.stringify(that.labelInfo))
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
//						 console.log(err);
					});
			},
		},
		created() {
			this.selectMember();
			let	that = this;
			let params={
				userId:this.userInfo.userCode
			}
			selectLabelData(params) //请求标签列表
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					data.messageContent.forEach((val,index)=>{
						that.labelName.push(val.labelName);
					})
				})
				.catch(function(err) {
//					console.log(err);
				});
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
			getFormData() {
				return this.$route.params.formData;
			},
			getFlag() {
				return this.$route.params.flag;
			}
		},
		mounted() {

		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
		padding: 0;
	}
	.userCenter{
		padding-bottom: 20px;
	}
	ul,li{
		list-style: none;
		overflow: hidden;
	}
	.el-title{
		height: 40px;
		line-height: 40px;
		text-align: left;
		margin: 10px 10px 0 10px;
		font-size: rem(14px);
		display: block;
		font-weight: bold;
		/*border-bottom:1px solid #00a0e9;*/
	}
	.el-table-filter {
		max-height: 300px;
		overflow: auto;
	}
	.dsh-labelInfo{
		width: 100%;
		padding: 0 10px;
		position: relative;
		.dsh-labelAdd{
			cursor: pointer;
			position: absolute;
			right: 14px;
			top:-40px;
			color: #0fa1d3;
			font-size: rem(16px);
		}
		.labelSpan{
			width: 100%;
			border: 1px solid #E6E6E6;
			padding:15px 20px;
			overflow:hidden;
			.labelSpanItem{
				display: inline-block;
				float: left;
				padding: 0 10px;
				.labelNames{
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #666;
					span{
						padding: 2px 8px;
						margin-left: 4px;
						background: #b7eafb;
						color: #111;
						display: inline-block;
					}
					.spanColor{
						background: #f7c1d8;
					}
					.spanColor1{
						background: #a6e9a1;
					}
					.spanColor2{
						background: #b7eafb;
					}
					.spanColor3{
						background: #f7d49a;
					}
				}
			}
		} 
	}
	.dsh-userInfo{
		width: 100%;
		height: 180px;
		overflow: hidden;
		position: relative;
		background-repeat: no-repeat;
		background-size: cover;
		font-size: rem(14px);
	}
	.dsh-moreBtn{
		position: absolute;
		right:10px;
		bottom:5px;
		height: 30px;
		line-height: 30px;
		div{
			width: 100%;
			position: relative;
			padding-right: 20px;
			cursor: pointer;
			b{
				display: block;
				height: 30px;
				line-height: 30px;
				color: #0fa1d3;
				font-weight: normal;
				font-size: rem(13px);
			}
			img{
				position: absolute;
				right: 0;
				top:8px;
			}
		}
	}
	.isMoreinformation{
		transform:rotate(-90deg);
	}
	.dsh-basicInfo{
		width: rem(300px);
		height: 180px;
		overflow: hidden;
		position: relative;
		float: left;
		.basicInfo{
			padding-left: 4%;
		}
	}
	.dsh-headerImg{
		width: rem(92px);
		height: rem(92px);
		border: 6px solid #fff;
		border-radius: 50%;
		box-shadow: 0 0 4px #fff;
		margin-top: 18px;
		overflow: hidden;
		box-sizing: border-box;
		img{
			border-radius: 50%;
			width: rem(86px);
			height: rem(86px);
		}
	}
	.dsh-growthValue{
		margin-left: 12px;
		height: 30px;
		overflow: hidden;
		margin-top: 120px;
		span{
			display: inline-block;
			font-size: rem(16px);
			color: #ff8a16;
			height: 30px;
			line-height: 30px;
			float: left;
		}
		b{
			display: inline-block;
			height: 30px;
			line-height: 30px;
			font-weight: normal;
			float: left;
			margin-right: 3px;
		}
	}
	.dsh-otherBasicInfo{
		width: rem(180px);
		height: rem(105px);
		margin-top: 14px;
		margin-left: rem(15px);
		.name{
			height: 35px;
			line-height: 30px;
			position: relative;
			overflow: hidden;
		}
		.sex{
			border-radius: 8px;
			color: #fff;
			padding: 0 5px;
			margin-left: 6px;
			position: relative;
			padding-left: 20px;
		}
		span{
			height: 19px;
			line-height: 19px;
			display: inline-block;
			img{
				position: absolute;
				left:4px;
				bottom: 2px;
			}
		}
		.sexWomen{
			background: #ff5a5a;
		}
		.sexMan{
			background: #5aa4ff;
		}
	}

	.nextGrowth{
		p{
			float:left;
			display:block;
			line-height: 12px;
			margin-left: 75%;
		}
	}
	.dsh-progress{
		width: 70%;
		height: 14px;
		background: #e2e2e2;
		position: absolute;
		left: 4%;
		bottom: 18px;
		border-radius: 8px;
		overflow: hidden;
		span{
			height: 13px;
			border-radius: 8px;
			border:1px solid #ff8a16;
			background: linear-gradient(180deg, #ffffff 0%,  #ff8a16 50%);
			display: block;
		}
	}
	
	.dsh-otherInfo{
		width: rem(200px);
		float: left;
		margin-top: 14px;
		.name{
			height: 40px;
			line-height: 40px;
			position: relative;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	.dsh-saleInfo{
		width: 100%;
		padding-left: rem(500px);
		position: absolute;
		right: 0;
		float: left;
		box-sizing: border-box;
		ul{
			width: 100%;
			li{
				width: 24%;
				float: left;
				padding-top: 70px;
				margin-right: 1%;
				span{
					width: 100%;
					display: block;
					color: #666;
					font-size: rem(14px);
					position: relative;
					overflow: hidden;
				}
				img{
					width: 16px;
					height: 16px;
					position: absolute;
					left: 0;
				}
				b{
					width: 100%;
					height: 16px;
					line-height: 16px;
					display: inline-block;
					padding-left: 20px;
					box-sizing: border-box;
					float: left
				}
				.dsh-btn{
					width: 100%;
					height: 40px;
					line-height: 40px;
					margin-top: 15px;
					font-size: rem(15px);
					text-align: center;
					color: #000000;
					border-radius: 6px;
				}
				.orderAmout{
					background: #b7eafb;
				}
				.availableIntegral{
					background: #f7d49a;
				}
				.liveness{
					background: #a6e9a1;
				}
				.lastOrderDate{
					background: #f7c1d8;
				}
			}
		}
	}
	.moreUserInfo{
		width: 100%;
		overflow: hidden;
        transition: All 0.4s ease-in-out;
		ul{
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			overflow: hidden;
			li{
				width: 25%;
				float: left;
				height: 32px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				span{
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #666;
				}
				span:last-child{
					color: #111;
				}
				.cursor{
					cursor: pointer;
				}
			}
		}
	}
	.dsh-sale{
		width: 100%;
		padding: 10px;
		overflow: hidden;
		.dsh-saleInfoItem{
			float: left;
			min-height: 140px;
			box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.2);
			border-radius: 4px;
			overflow: hidden;
			padding: 10px;
			position: relative;
			box-sizing: border-box;
			p{
				width: 100%;
				font-weight: bold;
			}
			img{
				width: 50px;
				height: 50px;
				display: block;
				float: left;
				position: absolute;
				left: 12px;
				top: 60px;
			}
			ul{
				width: 100%;
				overflow: hidden;
				float: left;
				padding-left: 64px;
				margin-top: 10px;
				box-sizing: border-box;
				li{
					width: 50%;
					float: left;
					height: 30px;
					line-height: 30px;
					span{
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						color: #666;
					}
					span:last-child{
						color: #111;
					}
				}
				.width100{
					width: 100%;
				}
			}
		}
		.dsh-saleInfoItem:nth-child(1){
			width: 34%;
		}
		.dsh-saleInfoItem:nth-child(2){
			width: 26%;
			margin: 0 1%;
		}
		.dsh-saleInfoItem:nth-child(3){
			width: 38%;
		}
	}
	.dsh-integralInfo{
		width: 100%;
		padding: 10px;
		.integralInfo{
			width: 100%;
			border: 1px solid #E6E6E6;
			height: 50px;
			ul{
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				overflow: hidden;
				li{
					width: 25%;
					height: 50px;
					line-height: 50px;
					float: left;
					span{
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						color: #666;
					}
					span:last-child{
						color: #111;
					}
				}
			}
		}
	}
	.dsh-table{
		width: 100%;
		padding:0 10px;
	}
</style>