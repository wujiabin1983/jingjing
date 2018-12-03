// 移动管理 - 绑定会员卡
<template>
	<div class="app-container">
		<div class="backgroundBox" :style="childTempName ? {
                backgroundImage: `url(${childBgUrl})`,
                opacity: childBgTransparency*0.01
            } : null">
		</div>
		<div class="wrap">
			<div class="imgBox">
				<div @click="handleHead">
					<img :src="imgSrc" class="image" alt="">
					<div class="headPicture">
						<img :src="headPicture" :class="{ hidden: childLogo }" />
					</div>
					<div class="headBar">
						<span :class="{ hidden: childLevel }">会员等级</span>
						<span :class="{ hidden: childMemCardOption != '显示电子卡号' }">电子卡号</span>
						<span :class="{ hidden: childMemCardOption != '显示手机号' }">手机号</span>
						<span :class="{ hidden: childMemCardOption != '显示品牌号' }">品牌号</span>
					</div>
				</div>
				<div class="weui-grids functionBox" :class="{ hidden: isFunctionBoxHide }">
					<a href="javascript:;" class="weui-grid" @click="handleDaohang">
						<div class="weui-grid__icon">
							<icon-svg icon-class="icon-daohang" id="icon-daohang" />
						</div>
						<p class="weui-grid__label">
							图片导航
						</p>
					</a>
					<a href="javascript:;" class="weui-grid" @click="handleFuwulianjie">
						<div class="weui-grid__icon">
							<icon-svg icon-class="icon-fuwulianjie" id="icon-fuwulianjie" />
						</div>
						<p class="weui-grid__label">
							文字导航
						</p>
					</a>
					<a href="javascript:;" class="weui-grid" @click="handleImage">
						<div class="weui-grid__icon">
							<icon-svg icon-class="icon-image" id="icon-image" />
						</div>
						<p class="weui-grid__label">
							图片
						</p>
					</a>
					<a href="javascript:;" class="weui-grid" @click="handleLine">
						<div class="weui-grid__icon">
							<icon-svg icon-class="icon--" id="icon--" />
						</div>
						<p class="weui-grid__label">
							辅助空白
						</p>
					</a>
					<a href="javascript:;" class="weui-grid" @click="handleStraight">
						<div class="weui-grid__icon">
							<icon-svg icon-class="icon-straight" id="icon-straight" />
						</div>
						<p class="weui-grid__label">
							辅助线
						</p>
					</a>
					<a href="javascript:;" class="weui-grid" @click="handleDuojibiaoti">
						<div class="weui-grid__icon">
							<icon-svg icon-class="icon-duojibiaoti" id="icon-duojibiaoti" />
						</div>
						<p class="weui-grid__label">
							标题
						</p>
					</a>
				</div>
			</div>
			<div class="addBar" @click="handleAddBar" :class="{ hidden: !isFunctionBoxHide }"><i class="el-icon-plus"></i></div>
			<div class="component" v-for="(item, index) in items" :key="items.id">
				<div :is="item.component" :text="items.id" @click.native.prevent="handleClick(item.component)"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import homePagePictureNav from '@/views/WebRoot/mobile/component/homePagePictureNav'
	export default {
		props: {
			'childData': {},
			'imgSrc': {
				'default': 'https://up.enterdesk.com/edpic_source/1b/79/40/1b7940ec78c11a7e897bf702db3a77ac.jpg'
			},
			'childMemCardOption': {},
			'childLogo': {},
			'childLevel': {},
			'childTempName': {},
			'childBgUrl': {},
			'childBgTransparency': {},
			'childNavBox': {
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				headPicture: 'http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg', // 头像
				isFunctionBoxHide: true,
				isLogo: false, // 是否显示品牌LOGO
				isLevel: false, // 是否显示会员等级
				memCardOption: '', // 会员卡号选项（显示电子卡号、显示手机号、显示品牌号、不显示）
				BgUrlAll: {
					background: `url(${this.childBgUrl})`
				},
				items: [], // 动态添加的组件
				navBox: [
					// {
					//     url: '',
					//     name: '12',
					//     link: ''
					// },
				],
			};
		},
		methods: {
			// 方法
			handleAddBar() {
				this.isFunctionBoxHide = false;
				this.navBox.push({
					type: '图片导航',
					navSet: [{
						url: '',
						name: '12',
						link: ''
					}]
				});
			},
			handleHead() { // 头部卡片
				this.$emit('parentClick', '卡片');
			},
			handleDaohang() { // 图片导航

				this.isFunctionBoxHide = true;
				this.handlePictureNaveAdd();
			},
			handleFuwulianjie() { // 文字导航
				this.isFunctionBoxHide = true;
				this.$emit('parentClick', '文字导航');
			},
			handleImage() { // 图片
				this.isFunctionBoxHide = true;
				this.$emit('parentClick', '图片');
			},
			handleLine() { // 辅助空白
				this.isFunctionBoxHide = true;
				this.$emit('parentClick', '辅助空白');
			},
			handleStraight() { // 辅助线
				this.isFunctionBoxHide = true;
				this.$emit('parentClick', '辅助线');
			},
			handleDuojibiaoti() { // 标题
				this.isFunctionBoxHide = true;
				this.$emit('parentClick', '标题');
			},
			handlePictureNaveAdd() { // 动态组件
				let length = this.items.length;
				this.items.push({
					'id': length++,
					'component': 'home-page-picture-nav'
				});
			},

			handleClick(component) {
				if(component == 'home-page-picture-nav') {
					this.$emit('parentClick', '图片导航');
				}
			}

		},
		components: {
			homePagePictureNav
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
				//          console.log(val);
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
	.image{
		width: 100%; 
		height: 150px;
		border-radius: 5px;
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
	
	.imgBox {
		position: relative;
		width: 100%;
		height: 150px;
		// padding: 5px;
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
				border-radius: 5px;
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
</style>