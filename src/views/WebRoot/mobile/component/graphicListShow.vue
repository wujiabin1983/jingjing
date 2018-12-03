// 图文素材 - 新建图文素材 - 显示图文列表
<template>
	<el-container class="app-container">
		<el-main>
			<el-card class="card cardGraphicListShow" v-if="!childDataLists[0] != null">
				<div class="list-time">
					{{childDataLists[0].updateDate}}
				</div>
				<!-- 主标题图片 -->
				<div class="list-image">
					<img :src="!childDataLists[0] ? '' : childDataLists[0].coverUrl" class="coverUrlImage" alt="">
				</div>
				<div class="listImg-title">
					{{ !childDataLists[0] ? '' : childDataLists[0].imageTextTitle }}
				</div>
				<!-- 图文列表 -->
				<div class="list-title" v-for="(item, index) in childDataLists" v-if="index>0" :key="item">
					<p>{{item.imageTextTitle}}</p>
					<img :src="item.coverUrl" alt="">
				</div>
				<div class="list-add">
					<el-row>
						<el-col :span="11">
							<el-button v-if="roleBtn.updateImageTextMaterialInfo" @click="handleEdit(childDataLists[0].masterId)"><i class="el-icon-edit"></i></el-button>
						</el-col>
						<el-col :span="11" :offset="2">
							<el-button v-if="roleBtn.deleteImageTextMaterialInfo" @click="handleDelete(childDataLists[0].masterId)"><i class="el-icon-delete"></i></el-button>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { MaterialLibraryFirstDelete } from '@/api/mobile/graphicMaterial'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleBtn: {
					updateImageTextMaterialInfo: false,
					deleteImageTextMaterialInfo: false
				},
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

				clickIndex: 0
			}
		},
		props: ['childDataLists'],
		methods: {
			// 方法
			handleEdit(masterId) {
				this.$router.push({
					name: '图文素材图文素材新增',
					params: {
						pageType: '修改',
						masterId: masterId
					}
				});
			},
			handleDelete(masterId) {
				//          console.log(masterId);
				let params = {
					'userId': this.userInfo.userCode,
					'masterId': masterId
				}
				this.$confirm('您确定要删除这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					MaterialLibraryFirstDelete(params)
						.then((res) => {
							// console.log(res);return false;
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// count = data.count,
							// msg = data.data;
							if(code == "SUCCESS") {
								this.$message.success(msg);
								this.$emit('parentRefresh', '1');
							} else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				})
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);
			
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			])
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
		margin: 0;
		border: 1px solid #d2d2d2;
	}
	
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
	
	.card {
		position: relative;
	}
	.list-time {
		text-align: center;
		padding-bottom: 10px;
		border-bottom: 1px solid #d2d2d2;
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
		/*position: absolute;
		left: 0;
		bottom: 0;*/
		width: 100%;
		line-height: 20px;
		color: #000;
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
	
	.list-add {
		text-align: center;
		// padding: 10px;
		/*border: 1px solid #CCC;*/
		font-size: 20px;
		.el-button {
			width: 100%;
			height: 40px;
		}
	}
	.coverUrlImage{
		width:100%;
		height:100%;
	}
</style>