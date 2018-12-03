// 会员首页 - 导航 - 会员特权
<template>
	<div class="">
		<!-- background: `url(${childBgUrl})` -->

		<div class="wrap">
			<div class="imgBox" v-show="childShow">
				<div @click="handleHead">
					<img :src="bgUrl" class="image" alt="">
					<div class="headPicture">
						<img :src="imgSrc" class="headIng" v-if="childLogo == '品牌LOGO'" />
						<img :src="headPicture" class="headIng" v-if="childLogo == '会员头像'" />
					</div>
					<div class="headBar" v-if="childLevel||childMemCardOption">
						<span v-if="!childLevel">会员等级</span>
						<span v-if="childMemCardOption=='显示电子卡号'">电子卡号</span>
						<span v-if="childMemCardOption=='显示手机号'">手机号</span>
						<span v-if="childMemCardOption=='会员卡号'">会员卡号</span>
						<span v-if="childMemCardOption=='显示品牌号'">品牌号</span>
					</div>
				</div>
			</div>
			<p v-if="!childAddBar" class="imgBox ql-editor" v-html="childQuillEditor"></p>
		</div>
	</div>
	<!--btn3-->
</template>
<script>
	import { mapGetters } from "vuex";
	import headPicture from '@/assets/images/000247589.jpg'
	import logo from '@/assets/images/LOGO.jpg'
	export default {
		props: {
            'pageName': {},
			'imgSrc': {},
			'bgUrl':{},
			'childMemCardOption': {},
			'childLogo': {},
			'childLevel': {},
			'childTempName': {},
			'childBgUrl': {},
			'childBgTransparency': {},
			'childNavBox': {
                'default': function() {
                    return []
				}
			},
			'childAddBar': {
                default: true
			},
			'childShow': {},
			'childQuillEditor': {}

        },
		data() {
			return {
				logo:'',
				headPicture: headPicture, // 头像
				isLogo: false, // 是否显示品牌LOGO
				isLevel: false, // 是否显示会员等级
				mainNavBox: [],
				navBoxIndex: 0
			}
		},
		methods: {
			handleHead() { // 头部卡片
				this.$emit('parentClick', {
					index: '-1',
					type: '卡片'
				});
			},
		},
		created() {
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"])

		},
		watch: {
			childNavBox: function(val, oldVal) {
//				console.log(childNavBox);
				this.mainNavBox[this.navBoxIndex].navSet = val;
//	          	console.log(this.mainNavBox);
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.image{
		width: 100%;
		height: 150px;
	}
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
	
	.dsh-center {
		display: flex;
		justify-content: center;
	}
	
	.dsh-vertical-center {
		display: flex;
		align-items: center;
	}
	
	.app-container {
		margin: 10px;
		height: 90%;
		background-size: cover;
		border-radius: 5px;
		overflow: hidden;
		.backgroundBox {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
		}
		.wrap {
			overflow: hidden;
		}
	}
	
	.el-carousel__item {
		img {
			width: 100%;
			height: 100%;
		}
	}
	
	.hidden {
		display: none;
	}
	
	.headQrcode {
		position: absolute;
		top: 10px;
		right: 10px;
		img.qrcode {
			width: 30px;
			height: 30px;
			// border-radius: 5px;
		}
	}
	.imgBox {
		position: relative;
		width: 100%;
		height: auto;
		z-index: 1;
		padding: 0px;
		// 头像
		.headPicture {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				border: 2px solid #FFF;
			}
		}
		.headBar {
			// 卡片部分
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 30px;
			line-height: 30px;
			color: #FFF;
			text-indent: 10px;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.functionBox {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 200;
			width: 100%;
			height: 100%;
			background-color: rgba(242, 242, 242, 1);
			border: 1px solid rgba(242, 242, 242, 1);
			.weui-grid {
				padding: 10px;
			}
			.weui-grid:hover {
				background-color: #FFF;
			}
		}
	}
	
	.addBar {
		// 添加按钮
		position: relative;
		width: 100%;
		height: 30px;
		margin-top: 10px;
		border: 1px dashed #2d2d2d;
		cursor: pointer;
		text-align: center;
		line-height: 30px;
		z-index: 1;
	}
	
	#icon-daohang,
	#icon-fuwulianjie,
	#icon-image,
	#icon--,
	#icon-straight,
	#icon-duojibiaoti {
		font-size: 30px;
		color: #2d2d2d;
	}
	
	.component {
		width: 100%;
		position: relative;
		z-index: 1;
		cursor: pointer;
		clear: both;
	}
	
	.listImg-operate {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 30px;
		line-height: 30px;
		color: #FFF;
		background: rgba(0, 0, 0, 0.8);
		text-indent: 10px;
		padding-right: 10px;
		display: flex;
		justify-content: space-between;
		.dsh-icon {
			font-size: 16px;
			line-height: 30px;
		}
		.dsh-icon:hover {
			// font-size: 18px;
			color: rgb(172, 255, 251);
			// color: #009ee2;
		}
	}
</style>