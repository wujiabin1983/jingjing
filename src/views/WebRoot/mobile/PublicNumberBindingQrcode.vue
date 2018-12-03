<!-- 公众号绑定 -->
<template>
	<el-container class="app-container">
		
	</el-container>
</template>
<script>
	import { qrcode } from '@/api/mobile/PublicNumberBinding'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	import { brandInfoQrcode } from '@/views/WebRoot/base' // 二维码
	export default {
		data() {
			return {
				
			}
		},
		components: {
			brandInfoQrcode
		},
		methods: {
			
		},
		created() {
//          console.log(window.location.href);
            let url = window.location.href.split('?')[1];
            qrcode(qrcode)
                .then(res => {
//                  console.log(res);
                }) 

		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		// display: inline-block;
		// position: absolute;
		margin-left: rem(20px);
		width: 50%;
	}

	.openFunList {
		list-style: none;
		label {
			margin-right: 20px;
			vertical-align: center;
		}
	}
</style>