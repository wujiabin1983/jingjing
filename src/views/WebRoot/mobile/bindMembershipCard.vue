// 移动管理 - 绑定会员卡
<template>
	<el-container class="app-container">
		<el-header>
			<h4>绑定会员卡</h4>
		</el-header>
		<el-main class="container-main">
			<el-row>
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{ headerSelect }}</div>
					</el-header>
					<el-main class="main-mobile">
						<el-form :model="mobileForm" ref="mobileForm" label-width="80px" class="mobileForm">
							<div v-for="(item, index) in tableData" :key="item">
								<el-form-item :label="item.name" v-if="item.isOpen">
									<el-input v-model="mobileForm[item.label]" :placeholder="`请输入${item.name}`" :disabled="!verificationChecked"></el-input>
								</el-form-item>
							</div>
							<el-button type="primary" class="btn-binding" @click="handleBinding" :disabled="!verificationChecked" v-if="roleBtn.bindingRuleSetInfo">立即绑定</el-button>
						</el-form>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>设置绑定会员卡内容</span>
					</el-header>
					<el-main class="main-mobile-info" v-loading="handlePushLoading">
						<el-button type="primary" class="space-around" @click="handleRuleSet">设置会员奖励规则</el-button>
						<div class="title">
							<h6 class="space-around">手机号的绑卡/合卡资料验证项</h6>
							<span>(只有通过验证，才能合卡成功)</span>
							<!--<el-checkbox v-model="verificationChecked">启用</el-checkbox>-->
						</div>
						<el-table :data="tableData" border class="dsh-table" v-loading="tableLoading">
							<el-table-column prop="name" label="验证资料名称"></el-table-column>
							<el-table-column prop="isOpen" label="是否启用">
								<template slot-scope="scope">
									<el-checkbox v-model="scope.row.isOpen" >启用</el-checkbox>
								</template>
							</el-table-column>
						</el-table>
						<div class="el-footer-btn-con marginTop10">
							<el-button type="primary" @click="handlePush">发布</el-button>
						</div>
					</el-main>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>
<script>import { permission } from '@/utils'
import { uploadImg } from '@/api/base/brandInfo' // 上传图片
import Cookie from 'js-cookie'
import { bindMembershipCardBinding, bindMembershipCardShow } from "@/api/mobile/bindMembershipCard";
import { mapGetters } from "vuex";
import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
export default {
	data() {
		return {
			roleBtn: {
				selectRuleSetInfo: false,
				bindingRuleSetInfo: false
			},
			handlePushLoading:false,
			// 数据
			headerSelect: "",
			mobileForm: {
				mobile: '', // 手机号
				verificationCode: '', // 验证码
				birthday: '', // 生日
				cardNo: '', // 会员卡号
				password: '' // 密码
			},
			verificationChecked: true, // 是否启用验证
			tableLoading: false,
			tableData: [ // 启用单个验证
				{
					"label": 'mobile',
					"name": "手机号", // 字段名称
					"isOpen": false, // 是否必填
				},
				{
					"label": 'verificationCode',
					"name": "验证码", // 字段名称
					"isOpen": false, // 是否必填
				},
				{
					"label": 'birthday',
					"name": "生日", // 字段名称
					"isOpen": false, // 是否必填
				},
				{
					"label": 'cardNo',
					"name": "会员卡号", // 字段名称
					"isOpen": false, // 是否必填
				},
				{
					"label": 'password',
					"name": "密码", // 字段名称
					"isOpen": false, // 是否必填
				},
			],
			data: ''

		};
	},
	methods: {
		// 设置会员奖励规则
		handleRuleSet() {
			sessionStorage.setItem("bindCardTable",JSON.stringify(this.tableData));
			this.$router.push({
				name: '页面设置绑定会员卡设置会员奖励制度',
				params: {
					pageName: '绑定会员卡',
					formData: JSON.stringify(this.data)
				},
				query: {
					time: +new Date()
				},
			});
		},

		// 绑定会员卡
		handleBinding() {

		},
		tableShow() {
			let params = {
				userId: this.userInfo.userCode,
				type: '绑卡'
			}
			bindMembershipCardShow(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						count = data.count,
						msg = data.data;
//					console.log(JSON.stringify(msg) + "查询");
					if(count > 0) {
//						if(msg[0].isEnable == 'true') {
//							this.verificationChecked = true;
//						} else {
//							this.verificationChecked = false;
//						}
						if(sessionStorage.getItem("bindCardTable")){
							this.tableData=JSON.parse(sessionStorage.getItem("bindCardTable"));
						}else{
							this.tableData.forEach((val, index) => {
								val.isOpen = msg[0].bindOption[val.label];
							});
						}
						this.data = msg;
						// 缓存会员奖励规则
						if(!sessionStorage.getItem('bindCardRuleSet')){
							sessionStorage.setItem('bindCardRuleSet', JSON.stringify(msg[0].ruleSet));
						}
					} else {
						// this.$message.error('当前没有数据，请重新设置');
					}
				})
				.catch((err) => {
					// console.log(err);
				})

		},
		// 发布
		handlePush() {
			this.handlePushLoading=true;
			let value = "";
			if(sessionStorage.getItem('bindCardRuleSet')){
				value = sessionStorage.getItem('bindCardRuleSet');
			}
			let params = {};
			let form;
			if(value == "") {
				params = {
					"userId": this.userInfo.userCode,
					"type": "绑卡",
					"rewardStatus": "否",
					"ruleSet": {},
//					"isEnable": this.verificationChecked,
					"bindOption": {
						"mobile": this.tableData[0].isOpen,
						"verificationCode": this.tableData[1].isOpen,
						"birthday": this.tableData[2].isOpen,
						"cardNo": this.tableData[3].isOpen,
						"password": this.tableData[4].isOpen,
					}
				}
			} else {
				form = JSON.parse(sessionStorage.getItem('bindCardRuleSet'));
				let expiryDate = [];
//				console.log(JSON.stringify(form) + "入参");
				if(form.expiryDate.value == '时间段') {
					expiryDate = {
						expiryDateBegin: form.expiryDate.slot.start,
						expiryDateEnd: form.expiryDate.slot.end,
					}
				} else {
					if(form.expiryDate.point){
						expiryDate = {
							days: form.expiryDate.point.day
						}
					}
				}
				params = {
					"userId": this.userInfo.userCode,
					"type": "绑卡",
					"rewardStatus": form.status ? '是' : '否',
					"ruleSet": {},
//					"isEnable": this.verificationChecked,
					"bindOption": {
						"mobile": this.tableData[0].isOpen,
						"verificationCode": this.tableData[1].isOpen,
						"birthday": this.tableData[2].isOpen,
						"cardNo": this.tableData[3].isOpen,
						"password": this.tableData[4].isOpen,
					}
				}
				params.ruleSet = {
					"type": form.type,
					"id": form.card,
					"name": form.cardName,
					"expiryDate": expiryDate,
					"instructions":form.instructions,
					"presentExp": form.presentExp
				}
			}
//			console.log(JSON.stringify(params) + "入参");
			bindMembershipCardBinding(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					this.handlePushLoading=false;
					if(code == 'SUCCESS') {
						this.$message.success(msg);
						sessionStorage.removeItem('bindCardRuleSet');
						sessionStorage.removeItem("bindCardTable")
						this.tableShow();
					} else {
						this.$message.warning(msg);
						this.tableShow();
					}
				})
				.catch((err) => {
					this.handlePushLoading=false;
					// console.log(err);
				})
		}

	},
	created() {
		// 权限
		this.roleBtn = permission(this.roleBtn);
		this.tableShow();
		let params = {
			userId: this.userInfo.userCode
		}
		customizeSelect(params)
			.then((res) => {
				let data = JSON.parse(Base64.decode(res.data)),
					code = data.messageType,
					msg = data.messageContent;
				if(code == 'SUCCESS') {
					this.headerSelect = msg.brandName;
				} else {
					this.$message.warning(msg);
				}
			})
	},
	computed: {
		// 计算属性
		...mapGetters(["userInfo"]),
		getPageType() {
			let pageType = this.$route.params.pageType;
			this.$route.params.pageType = '';
			return pageType;
		},
		getFormData() {
			let formData = this.$route.params.formData;
			this.$route.params.formData = '';
			return formData;
		}
	}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width: 100%;
}

.el-form {
	//   display: inline-block;
	//   position: absolute;
	//   margin-left: rem(20px);
}

.el-input {
	// width: 40%;
}

.el-textarea {
	width: 80%;
}

.dsh-center {
	display: flex;
	justify-content: center;
	.el-input {
		width: 40%;
	}
}

.dsh-vertical-center {
	display: flex;
	align-items: center;
}

.container-main .el-col.el-col-container {
	border: 1px solid #d2d2d2;
	font-size: 14px;
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
	height: 400px;
}

.contentItem span {
	margin-right: rem(10px);
	cursor: pointer;
}

.form-item-msg {
	font-size: rem(12px);
	color: #999;
}

.dsh-flex {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 80px;
}

.hidden {
	display: none;
}

.component {
	// display: block;
	overflow: hidden;
}

.btn-save {
	text-align: center;
	padding-bottom: 10px;
	.el-button {
		width: 100px;
	}
}

.mobileForm {
	padding: 10px;
}

.btn-binding {
	width: 100%;
	// margin: 10px;
}

.space-around {
	margin-bottom: 10px;
}

.title {
	h6 {
		display: inline-block;
	}
	span {
		margin-left: 20px;
		font-size: rem(12px);
	}
	.el-checkbox {
		float: right;
	}
}

.main-mobile {
	position: relative;
	background: #FFF;
	.mobileForm {
		margin: 0 10px;
	}
}
.dsh-header{
	display: flex;
	justify-content: space-between;
}
.main-mobile-info{
	background: #FFF;
	padding: 10px;
}
.dsh-table{
	width: 60%;
}
</style>
