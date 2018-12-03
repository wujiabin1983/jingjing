// 图文素材 - 新建图文素材 - 图文列表
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="card cardGraphicListShow">
				<!-- 主标题图片 -->
				<div class="list-image" @mouseover="handleTitleShow(0)" @mouseout="handleTitleHide(0)" @click.stop="handleClickCard(0)">
					<img :src="!articleData01[0].fieldUrl ? '' : articleData01[0].fieldUrl" alt="" class="image">
					<div class="listImg-operate" v-show="!articleData01[0].titleShow ? '' : articleData01[0].titleShow">
					</div>
				</div>
				<div class="listImg-title">
					{{ !articleData01[0].imageTextTitle ? '' : articleData01[0].imageTextTitle }}
				</div>
				<!-- 图文列表 -->
				<div class="list-title" @mouseover="handleTitleShow(index)" @mouseout="handleTitleHide(index)" @click.stop="handleClickCard(index)" v-for="(item, index) in articleData01" v-if="index > 0" :key="item">
					<p>{{ !item.imageTextTitle ? '' : item.imageTextTitle }}</p>
					<img :src="!item.fieldUrl ? '' : item.fieldUrl" alt="">
					<div class="listImg-operate" v-show="!item.titleShow ? '' : item.titleShow">
						<span>
                            <i class="el-icon-sort-up dsh-icon" @click="handleClickUp(index)"></i>
                            <i class="el-icon-sort-down dsh-icon" @click="handleClickDown(index)"></i>
                        </span>
						<span @click.stop="handleDelete(index)">删除</span>
					</div>
				</div>
				<!--<div class="list-add" @click="handleAddBtn">
					<i class="el-icon-plus"></i>
				</div>-->
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import { MaterialLibraryFirstShow, MaterialLibraryFirstAdd, MaterialLibraryFirstEdit } from '@/api/mobile/graphicMaterial'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 数据

				articleData01: [{
						// "imageTextId": "图文编号",
						"imageTextTitle": "",
						"author": "",
						"coverUrl": "", // 素材mediaId
						"fieldUrl": "", // 阿狸图片
						"summary": "",
						"mainBody": {
							"mb01":"", // 阿里图片
							"mb02":"" // 微信图片
						},
						"linkAddress": "",
						"label": {
							"read": [], //阅读
							"share": [], // 分享
							"collect": [] // 收藏
						},
						"titleShow": false
					}
					// ,
					// {
					//     // "imageTextId": "图文编号",
					//     "imageTextTitle": "图文标题",
					//     "author": "作者",
					//     "coverUrl": "http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png",
					//     "summary": "摘要",
					//     "mainBody": "正文",
					//     "linkAddress": "外链地址",
					//     // "label": "标签（json格式字符串）",
					//     "seq": "排序",
					//     "titleShow": false
					// }
				],
				articleData02: [],
				clickIndex: 0
			}
		},
		props: ['pTitle', 'fileNameObj', 'picObj'],
		methods: {
			// 方法
			handleTitleShow(index) {
				return false;
				// console.log(index)
				this.articleData01[index].titleShow = true;
			},
			handleTitleHide(index) {
				this.articleData01[index].titleShow = false;
			},
			handleClickCard(clickIndex) {
				this.$emit('cForm', this.articleData01[clickIndex]);
			},

			handleShow(start, limit, masterId) { // 显示数据信息
				let params = {
					"userId": this.userInfo.userCode, // 当前登录用户账号
					"page": start, // 当前页
					"limit": limit, // 每页记录数
					"imageTextTitle": '',
					"masterId": masterId // 主信息Id
				}
				// console.log(params);
				MaterialLibraryFirstShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						msg[0].forEach((val, index) => {
							val.titleShow = false;
						});
						this.articleData01 = msg[0];
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleAddBtn() { // 添加图文
				if(this.articleData01.length<8){
					this.articleData01.push({
							// "imageTextId": "图文编号",
							"imageTextTitle": "",
							"author": "",
							"coverUrl": "", // 素材mediaId
							"fieldUrl": "", // 阿狸图片
							"summary": "",
							"mainBody": {
								"mb01":"", // 阿里图片
								"mb02":"" // 微信图片
							},
							"linkAddress": "",
							"label": {
								"read": [], //阅读
								"share": [], // 分享
								"collect": [] // 收藏
							},
							"titleShow": false
						});
				}
			},
			handleClickUp(index) {
				if(index == 0) {
					return false;
				} else {
					let spliceArticle = this.articleData01.splice(index, 1)[0];
					// console.log(this.articleData01, spliceArticle);
					this.articleData01.splice(index - 1, 0, spliceArticle);
					// console.log(this.articleData01);
				}
			},
			handleClickDown(index) {
				if(index == this.articleData01.length - 1) {
					return false;
				} else {
					let spliceArticle = this.articleData01.splice(index, 1)[0];
					// console.log(this.articleData01, spliceArticle);
					this.articleData01.splice(index + 1, 0, spliceArticle);
					// console.log(this.articleData01);
				}
			},
			transform() {
				let that = this;
				let fileNameObj = that.fileNameObj;
				let picObj = that.picObj;
				let str = JSON.stringify(that.articleData01);
				// console.log(that.articleData01);
				if(JSON.stringify(fileNameObj) == '{}') {
					let mbarr01 = [], mbarr02 = [];
					for(let item of this.articleData01) {
						// 富文本编辑器图片遍历
						let mb01 = item.mainBody.mb01;
						let mb02 = item.mainBody.mb02;
						
						// 使用replace回调，截取src字符串
						mb01.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
							mbarr01.push(capture);
						});
						mb02.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
							mbarr02.push(capture);
						});
					}
					mbarr01.forEach((item, index) => {
						fileNameObj[item] = mbarr02[index];
					})
					// console.log(fileNameObj, 'fileNameObj')
				}
				if(JSON.stringify(picObj) == '{}') {
					for(let item of this.articleData01) {
						let fieldUrl = item.fieldUrl;
						let coverUrl = item.coverUrl;
						picObj[fieldUrl] = coverUrl;
						// console.log(picObj)
					}
				}
				// 替换
				for(let item in fileNameObj) {
					str = str.replace(item, fileNameObj[item]);
				}
				for(let item in picObj) {
					str = str.replace(item, picObj[item]);
				}
				
				let articleData02 = JSON.parse(str);
				// console.log(articleData02, 'articleData02')
				let articleData = [];
				this.articleData01.forEach((val, index) => {
					articleData.push({
						...val,
						fieldUrl: val.fieldUrl,
						coverUrl: articleData02[index].fieldUrl,
						mainBody: {
							mb01: val.mainBody.mb01,
							mb02: articleData02[index].mainBody.mb01	
						},
					});
				});
				// console.log(articleData, 'articleData');
				this.articleData01 = articleData;

				// this.fileNameObj = {};
				// this.picObj = {};
				return articleData;
			},
			handleSave() {
				let params;
				this.transform();
				// return false;
				if(this.getPageType == '添加') {
					params = {
						"userId": this.userInfo.userCode,
						// "masterId":"", // 主信息id
						"params": [
							...this.articleData01,
						]
					}
					this.handleAdd(params);
				}
				if(this.getPageType == '修改') {
					params = {
						"userId": this.userInfo.userCode,
						"masterId": this.getMasterId, // 主信息id
						"params": [
							...this.articleData01,
						]
					}
					this.handleEdit(params);
//					 console.log(params);return false;
					// alert('修改');console.log(params);
				}
				return params;
			},
			handleAdd(params) {
				const that = this;
				MaterialLibraryFirstAdd(params)
					.then((res) => {
						// console.log(res);
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
//							console.log(data)
						// count = data.count,
						// msg = data.data;
						if(code == "SUCCESS") {
							this.$message({
								message: msg,
								type: "success",
								duration: 2500,
								onClose: function() {
									that.$router.push({
										name: '图文素材'
									});
								}
							});
						} else {
							this.$message.warning(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleEdit(params) {
				const that = this;
				MaterialLibraryFirstEdit(params)
					.then((res) => {
						//                  console.log(res);
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// count = data.count,
						// msg = data.data;
						if(code == "SUCCESS") {
							this.$message({
								message: msg,
								type: "success",
								duration: 2500,
								onClose: function() {
									that.$router.push({
										name: '图文素材'
									});
								}
							});
						} else {
							this.$message.warning(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleDelete(index) {
				// console.log(index)
				let that = this;
				//          console.log(this.articleData01);
				this.$nextTick(function() {
					that.articleData01.splice(index, 1);
					//              console.log(that.articleData01);
				});
				// return false;
			}
		},
		created() {
			// 钩子函数 -- 初始化
			if(this.getPageType == '添加') {
			     this.handleClickCard(0);
			}
			if(this.getPageType == '修改') {
				this.handleShow(0, 1, this.getMasterId);
			}
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			subArticleData: function() {
				// `this` 指向 vm 实例
				return this.articleData01.slice(1) ? this.articleData01.slice(1) : false;
			},
			getPageType() {
				let pageType = this.$route.params.pageType;
				return pageType;
			},
			getMasterId() {
				let masterId = this.$route.params.masterId;
				return masterId;
			},
		},
		watch: {
			"child": function(val, oldVal) {
				// console.log(val)
			},
			deep: true
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
		padding: 0;
	}
	.image{
		width:100%;
		height:100%;
	}
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
	
	.card {
		position: relative;
	}
	
	.list-image {
		position: relative;
		width: 100%;
		height: 140px;
	}
	
	.list-image {
		cursor: pointer;
	}
	
	.listImg-title {
		width: 100%;
		color: #000;
		line-height: 20px;
		padding:5px 10px;
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
	
	.list-add {
		text-align: center;
		padding: 10px;
		border: 1px solid #CCC;
		font-size: 30px;
		cursor: pointer;
	}
</style>