// 图文素材 - 新建图文素材 - 图文列表
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="card" v-if="!childDataLists[0] != null">
				<div class="list-time">
					<el-checkbox v-model="checked" v-if="isCheckBox" @change="handleChecked(childDataLists[0].masterId)">{{childDataLists[0].updateDate}}</el-checkbox>
					<p v-else>{{childDataLists[0].updateDate}}</p>
				</div>
				<!-- 主标题图片 -->
				<div class="list-image">
					<img :src="!childDataLists[0] ? '' : childDataLists[0].coverUrl" alt="" class="image">
					<div class="listImg-title">
						{{ !childDataLists[0] ? '' : childDataLists[0].imageTextTitle }}
					</div>
				</div>
				<!-- 图文列表 -->
				<div class="list-title" v-for="(item, index) in childDataLists" v-if="index>0" :key="item">
					<p>{{item.imageTextTitle}}</p>
					<img :src="item.coverUrl" alt="">
				</div>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { MaterialLibraryFirstDelete } from '@/api/mobile/graphicMaterial'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 数据
				imgShow: false,

				articleData: [
					// {
					//     // "imageTextId": "图文编号",
					//     "imageTextTitle": "图文标题1",
					//     "author": "作者",
					//     "coverUrl": "http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png", // 封面图URL
					//     "summary": "摘要",
					//     // "mainBody": "正文",
					//     // "linkAddress": "外链地址",
					//     // "label": "标签（json格式字符串）",
					//     "seq": "排序",
					//     "titleShow": false
					// },
					// {
					//     // "imageTextId": "图文编号",
					//     "imageTextTitle": "图文标题",
					//     "author": "作者",
					//     "coverUrl": "http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png",
					//     "summary": "摘要",
					//     // "mainBody": "正文",
					//     // "linkAddress": "外链地址",
					//     // "label": "标签（json格式字符串）",
					//     "seq": "排序",
					//     "titleShow": false
					// }
				],

				clickIndex: 0,
				checked: false,
			}
		},
		props: ['childDataLists','isCheckBox'],
		methods: {
			// 方法
			handleChecked(masterId) {
				// console.log(masterId);
//				 console.log(this.checked)
				if(this.checked){
					this.$emit('parentMasterId', masterId);
				}else{
					this.$emit('parentMasterId', '');
				}
				// this.childDataLists[0].checked = !this.childDataLists[0].checked;
			},
			handleDelete(masterId) {
				// console.log(masterId);
				let params = {
					'userId': this.userInfo.userCode,
					'masterId': masterId
				}
				MaterialLibraryFirstDelete(params)
					.then((res) => {
						// console.log(res);return false;
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// count = data.count,
						// msg = data.data;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});

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
			groupId() {
				return this.childDataLists[0].masterId;
			}
		},
		watch: {

			deet: true
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
	.image{
		width: 100%;
		height: 100%;
	}
	.card {
		position: relative;
	}
	
	.list-time {
		text-align: center;
		margin-bottom: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid #d2d2d2;
	}
	
	.list-image {
		position: relative;
		width: 100%;
		height: 140px;
	}
	
	.list-image {
		.listImg-title {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			color: #FFF;
			background: #000;
			line-height: 20px;
			padding:0 15px;
		}
		cursor: pointer;
	}
	
	.list-title {
		position: relative;
		// display: flex;
		// justify-content: space-between;  
		padding: 10px;
		border: 1px solid #CCC;
		height: 60px;
		p {
			margin: 0;
			float: left;
			height: 40px;
			line-height: 40px;
		}
		img {
			float: right;
			width: 40px;
			height: 40px;
		}
		cursor: pointer;
	}
	
	.list-add {
		text-align: center;
		// padding: 10px;
		border: 1px solid #CCC;
		font-size: 20px;
		.el-button {
			width: 100%;
			height: 40px;
			border: none;
		}
	}
</style>