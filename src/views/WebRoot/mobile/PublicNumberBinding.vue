<!-- 公众号绑定 -->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card v-loading="mainLoading">
				<el-form :model="form" ref="form" label-width="120px" class="form">
					<el-form-item label="授权方昵称">
						<el-input v-model="form.authorNikeName" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="授权方头像">
						<el-input v-if="!disabled" v-model="form.authorHeadUrl" :disabled="disabled"></el-input>
						<img v-else :src="form.authorHeadUrl" alt="" class="imgUrl">
					</el-form-item>
					<el-form-item label="公众号名称">
						<el-input v-model="form.pubNumName" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="公众号原始ID">
						<el-input v-model="form.pubNumOrigId" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="开通功能">
						<!-- <el-input v-model="form.opernFunction" :disabled="disabled"></el-input> -->
						<ul class="openFunList">
							<li>
								<label>开通微信支付功能</label>
								<el-switch v-model="form.opernFunction['open_pay']" :disabled="disabled"></el-switch>
								<span></span>
							</li>
							<li>
								<label>开通微信摇一摇功能</label>
								<el-switch v-model="form.opernFunction['open_shake']" :disabled="disabled"></el-switch>
							</li>
							<li>
								<label>开通微信扫商品功能</label>
								<el-switch v-model="form.opernFunction['open_scan']" :disabled="disabled"></el-switch>
							</li>
							<li>
								<label>开通微信卡券功能</label>
								<el-switch v-model="form.opernFunction['open_card']" :disabled="disabled"></el-switch>
							</li>
							<li>
								<label>开通微信门店功能</label>
								<el-switch v-model="form.opernFunction['open_store']" :disabled="disabled"></el-switch>
							</li>
						</ul>
					</el-form-item>
					<el-form-item label="二维码URL" v-if="false">
						<el-input v-if="!disabled" v-model="form.qrCodeUrl" :disabled="disabled"></el-input>
						<img v-else :src="form.qrCodeUrl" alt="" class="imgUrl">
					</el-form-item>
					<el-form-item label="AppID">
						<el-input v-model="form.appId" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="AppScret" v-if="false">
						<el-input v-model="form.appScret" :disabled="disabled"></el-input>
					</el-form-item>
					<!-- <el-form-item label="授权列表">
						<el-input v-model="form.authorizationList" :disabled="disabled"></el-input>
					</el-form-item> -->
				</el-form>
				<div class="select-btn-style mrgBottom10">
					<el-button type="primary" @click="handleCancelBinding"  v-if="roleBtn.cancelPublicNumberInfo && isBtnShow">取消绑定</el-button>
				</div>
				<iframe src="" frameborder="0" v-show=""></iframe>
			</el-card>
			<el-dialog title="提示" :visible.sync="dialogVisibleOfficial" width="80%" class="openDialog" @open="handleIframeOpen">
				<!-- <brandInfoQrcode :qrcodeUrl="qrcodeUrl"></brandInfoQrcode> -->
				<iframe ref="iframe" id="iframe" :src="qrcodeUrl" frameborder="0" class="dsh-iframe"></iframe>
				<span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleOfficial = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisibleOfficial = false">确 定</el-button>
                </span>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { PublicNumberBindingShow, PublicNumberBindingCancel } from '@/api/mobile/PublicNumberBinding'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	import { brandInfoQrcode } from '@/views/WebRoot/base' // 二维码
	export default {
		data() {
			return {
				mainLoading: false,
				// 数据
				form: {
					authorNikeName: '', // 授权方昵称
					authorHeadUrl: '', // 授权方头像
					pubNumName: '', // 公众号名称
					pubNumOrigId: '', // 公众号原始ID
					opernFunction: {
						"open_pay": false,  // 是否开通微信支付功能
						"open_shake": false, // 是否开通微信摇一摇功能
						"open_scan": false,  // 是否开通微信扫商品功能
						"open_card": false, // 是否开通微信卡券功能
						"open_store": false // 是否开通微信门店功能
					}, // 开通功能
					qrCodeUrl: '', // 二维码URL
					appId: '', // appID
					appScret: '', // AppScret
					authorizationList: '' // 授权列表
				},
				isBtnShow: false,
				// 权限
				roleBtn: {
					selectPublicNumberInfo: false,
					cancelPublicNumberInfo:false
				},
				dialogVisibleOfficial: false, // 弹出窗口
				qrcodeUrl: '',
				disabled: true,
				// rules: {
				//     authorNikeName: [
				//         { required: true, message: '请输入授权方昵称', trigger: 'change'  },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     authorHeadUrl: [
				//         { required: true, message: '请输入授权方头像', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     pubNumName: [
				//         { required: true, message: '请输入公众号名称', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     pubNumOrigId: [
				//         { required: true, message: '请输入公众号原始ID', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     opernFunction: [
				//         { required: true, message: '请输入开通功能', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     qrCodeUrl: [
				//         { required: true, message: '请输入二维码URL', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     appId: [
				//         { required: true, message: '请输入appID', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     appScret: [
				//         { required: true, message: '请输入AppScret', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
				//     ],
				//     authorizationList: [
				//         { required: true, message: '请输入授权列表', trigger: 'change' },
				//         { max: 100, message: '最大长度不能超过100', trigger: 'change' } 
				//     ]
				// }
			}
		},
		components: {
			brandInfoQrcode
		},
		methods: {
			// 方法
			handlePublicNumberBindingShow() { // 显示列表
				this.mainLoading = true;
				let params = {
					userId: this.userInfo.userCode
				}
				PublicNumberBindingShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							if(msg.httpUrl === '') {
								// 已绑定
								for (let i in msg.opernFunction) {
									msg.opernFunction[i] = msg.opernFunction[i] == 1 ? true : false;
								}
								this.form = msg;
								this.isBtnShow = true;
								// this.disabled = false;
								// 返回显示数据
							} else {
								// 显示弹出窗口
								// console.log(msg);
								this.qrcodeUrl = msg.httpUrl;
								this.dialogVisibleOfficial = true;
							}
							// this.form = val
							this.mainLoading = false;
						} else {
							this.$message.error(msg);
							this.mainLoading = false;
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleCancelBinding() {
				// 取消绑定
				let params = {
					userId: this.userInfo.userCode
				}
				PublicNumberBindingCancel(params).then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent,
						val = data.valueObj;
					//                  console.log(code, msg, val, 'PublicNumberBindingCancel');
					if(code == 'SUCCESS') {
						this.$message.success(msg);
						location.reload(); // 成功解除绑定之后需要刷新页面重新加载
					} else {
						this.$message.error(msg);
					}
				})

			},
			handleIframeOpen() {
				this.$nextTick(() => {
					// console.log(document.getElementById('iframe').contentDocument, '\\\\\\\\this.$refs.iframe');
				});
			},
			handleIframeClose() {
				this.handlePublicNumberBindingShow();
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.handlePublicNumberBindingShow();
			let that = this;
			var boolean = false;
			var time = setInterval(function() {
				boolean = sessionStorage.getItem('dialogVisibleOfficialQrcode');
				if(boolean == 'true') {
					that.dialogVisibleOfficial = false;
					sessionStorage.setItem('dialogVisibleOfficialQrcode', 'false');
					that.handlePublicNumberBindingShow();
					window.clearInterval(time);
					// window.location.reload();
				}
			}, 1000);
		},	
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
		watch: {
			'dialogVisibleOfficial': function(val) {
				if(val) {
					let iframe = document.querySelector('iframe');
					// console.log(iframe);
				}
			},
			'qrcodeUrl': function(val) {
				// console.log(val, 'qrcodeUrl');
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
		width: 50%;
		margin-left: rem(20px);
		margin: 0 auto;
	}

	.openFunList {
		list-style: none;
		label {
			margin-right: 20px;
			vertical-align: center;
		}
	}
	.dialog-footer{
		margin-top: 10px;
	}
	.dsh-iframe{
		width: 100%;
		height: 460px;
	}
	.imgUrl{
		width: 120px;
		height: 80px;
	}
	.imgUrl{
		width: 120px;
		height: 80px;
	}
</style>