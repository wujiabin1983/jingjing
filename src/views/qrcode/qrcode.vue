<!--公众号绑定-->
<template>
	<div id="qrcode" v-loading="loading" v-if="isShow">
	</div>
</template>
<script>
	import { qrcode } from '@/api/mobile/PublicNumberBinding'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	import { brandInfoQrcode } from '@/views/WebRoot/base' // 二维码
	export default {
		data() {
			return {
				msg: '',
				loading: false,
				isShow:false
			}
		},
		components: {
			brandInfoQrcode
		},
		methods: {
			GetRequest() {  
				var url = window.location.href; //获取url中"?"符后的字串  
				// let url = 'http://www.baidu.com?auth_code=queryauthcode@@@0FVdpxOMQlOBTWQ-P9tsV5_8OBq7yK-BQb_ciPjTYsJkj9zAeDNV-8ogfErDS3JIP-bbBvGFID5rCh7PuuBtqQ&expires_in=3600#/';
				let theRequest = {};  
				if(url.indexOf('?') != '-1') {
					let strArr = url.split('?')[1].split('&');
					strArr.forEach(val => {
						let str = val.split('=');
						theRequest[str[0]] = str[1]
					});
				}
				return theRequest;  
			}
		},
		created() {
			let that = this;
			var time = null;
			time = setInterval(function() {
				if(!that.GetRequest) {
					return null;
				}else {
					let qrcodeRequest = that.GetRequest();
					if(JSON.stringify(qrcodeRequest) === '{}' || qrcodeRequest.auth_code == '' || !that.userInfo || !that.userInfo.userCode || qrcodeRequest.hasOwnProperty('time')) {
						that.msg = '';
						that.isShow=false;
					} else {
						that.loading = true;
						let params = {
							'auth_code': qrcodeRequest.auth_code,
							'userId': that.userInfo.userCode
						}
						qrcode(params)
							.then(res => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent,
									val = data.valueObj;
									that.isShow=true;
								if(code === 'SUCCESS') {
									that.msg = msg;
									that.$message.success('绑定成功！');
									that.loading = false;
								}else {
									that.msg = msg;
									that.$message.success('绑定失败！');
									that.loading = false;
								}
								// setTimeout(function() {
								sessionStorage.setItem('dialogVisibleOfficialQrcode', 'true');
								that.loading = false;
								// }, 3000)
								
								window.clearInterval(time);
							})
							.catch();
						
					}
				}
			}, 3000);
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	#qrcode {
		height: 100%;
	}
</style>