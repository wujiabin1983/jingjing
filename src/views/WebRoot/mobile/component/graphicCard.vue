<!-- 素材卡片 -->
<template>
	<el-container class="app-container">
		<el-card>
			<div class="imgBox">
				<img :src="coverUrl" alt="">
			</div>
			<div class="cardInfo">
				<el-checkbox v-model="checked" @change="handleChange">{{ title }}</el-checkbox>
				<span>{{ updateDate }}</span>
			</div>
			<div class="cardHandle">
				<el-button @click="handleEidt">
					<i class="el-icon-edit"></i>
				</el-button>
				<el-button @click="handleDelete">
					<i class="el-icon-delete"></i>
				</el-button>
			</div>
		</el-card>
	</el-container>
</template>
<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 数据
				checked: false
			}
		},
		props: {
			// fileType // 文件类型（视频、音频、图片）
			// classify // 分类
			// coverUrl // 封面图URL
			// title // 标题
			// fieldUrl // 文件路径
			// label // 标签
			// introduCTION // 简介
			// updateDate // 更新时间

			fileType: {
				type: String,
				default: '图片'
			},
			coverUrl: {
				type: String,
				default: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521117746913&di=5327618611e955c5761582b30093afee&imgtype=0&src=http%3A%2F%2Fp2.cri.cn%2FM00%2FE4%2FD0%2FCqgNOllA26iAd9mWAAAAAAAAAAA705.600x391.jpg',
			},
			title: {
				type: String,
				default: '默认标题'
			},
			updateDate: {
				type: String,
				default: '2018-3-15'
			},
			checkedAll: {
				type: Boolean,
				defautl: false
			}
		},
		methods: {
			// 方法
			handleEidt() { // 编辑
				//          console.log('handleEidt');
			},
			handleDelete() { // 删除
				//          console.log('handleDelete');
			},
			handleChange(val) { // 多选框选中
				if(this.checked) {
					this.$emit('clickedCard', this.title);
				} else {
					this.$emit('unclickedCard', this.title);
				}
			},
			clickedSelf() { // 勾选
				this.checked = true;
			},
			unclickedSelf() { // 勾选
				this.checked = false;
			}
		},
		created() {
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
		watch: {
			"checkedAll": function(vewVal, oldVal) {
				//          console.log(newVal, oldVal);
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.graphicCard.el-card {
		background: #FFF;
		margin-top: 10px;
		margin-right: 10px;
		float: left;
	}
	
	.graphicCard .imgBox {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		width: 200px;
		height: 100px;
		border: 1px solid #CCC;
		img {
			width: 200px;
		}
	}
	
	.graphicCard .cardInfo {
		display: flex;
		justify-content: space-between;
		height: 30px;
		line-height: 30px;
	}
	
	.graphicCard .cardHandle {
		display: flex;
		justify-content: space-between;
		.el-button {
			width: 50%;
		}
	}
</style>