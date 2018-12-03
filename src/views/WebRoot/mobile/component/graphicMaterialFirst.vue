<!-- 图文素材 - 图文消息 -->
<template>
	<el-container>
		<el-header class="header" v-if="roleBtn.selectImageTextMaterialInfo">
			<el-form :inline="true" :model="form" class="demo-form-inline formBox">
				<el-form-item label="">
					<el-input v-model="form.searchInfo" placeholder="请输入标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="btnBox">
				<el-button type="primary" class="marginLeft10" @click="handleAddGraphicMaterial" v-if="roleBtn.addImageTextMaterialInfo">
					新建图文素材
				</el-button>
				<span class="titleBox">图文消息(共<span>{{count}}</span>条)</span>
			</div>
		</el-header>
		<el-main v-loading="elMainLoading">
			<el-row class="msg-list">
				<div class="empty" v-if="items.length == 0">
					<div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
				</div>
				<el-col :span="6" v-for="(item, index) in items" :key="items.id" v-else>
					<div class="component">
						<div :is="item.component" :childDataLists="dataLists[index]" @parentRefresh="handleRefresh"></div>
					</div>
				</el-col>
			</el-row>
			<!-- 分页 -->
		</el-main>
		<el-footer v-if="count != 0">
			<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
			</el-pagination>
		</el-footer>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import graphicListShow from '@/views/WebRoot/mobile/component/graphicListShow'
	import { mapGetters } from 'vuex'
	import { MaterialLibraryFirstShow } from '@/api/mobile/graphicMaterial'
	export default {
		data() {
			return {
				// 数据
				roleBtn: {
					selectImageTextMaterialInfo: false,
					addImageTextMaterialInfo: false,
					previewImageTextMaterialInfo: false
				},
				form: {
					searchInfo: ''
				},
				dataLists: [],

				items: [], // 动态添加的组件

				elMainLoading: false,
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 方法
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.handleShow(this.page, this.limit, this.form.searchInfo);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.handleShow(this.page, this.limit, this.form.searchInfo);
			},
			handleSearch() { // 搜索
				// console.log();
				this.handleShow(this.page, this.limit, this.form.searchInfo);
			},
			handleShow(start, limit, searchContent) { // 显示数据信息
				let that = this;
				this.elMainLoading = true;
				let params = {
					"userId": this.userInfo.userCode, // 当前登录用户账号
					"page": start, // 当前页
					"limit": limit, // 每页记录数
					"imageTextTitle": searchContent, // 图文标题
					"masterId": "" // 主信息Id
				}
//				console.log(params);
				MaterialLibraryFirstShow(params)
					.then((res) => {
						//                  console.log(res);
						let data = JSON.parse(Base64.decode(res.data)),
							// code = data.returnCode,
							// msg = data.returnMsg;
							count = data.count,
							msg = data.data;
						that.count = data.count;
						that.dataLists = msg.length > 0 ? msg : [];
						that.items = [];
						msg.forEach((val, index) => {
							that.items.push({
								'id': length++,
								'component': 'graphic-list-show'
							});
						});
						that.elMainLoading = false;
					})
					.catch((err) => {
//						 console.log(err);
					});
			},
			handleAddGraphicMaterial() { // 新建图文素材
				this.$router.push({
					name: '图文素材图文素材新增',
					params: {
						pageType: '添加',
						masterId:''
					}
				});
			},
			handleRefresh() { // 刷新
				this.handleShow(this.page, this.limit, this.form.searchInfo);
			}
		},
		components: {
			graphicListShow
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);

			// 钩子函数 -- 初始化
			this.handleShow(this.page, this.limit, this.form.searchInfo);
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
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: inline-block;
	}
	.el-form-item--small.el-form-item {
		margin-bottom: 0;
	}
	.header {
		width: 100%;
		height: 34px;
		margin-bottom: 10px;
		clear: both;
		float: left;
	}
	.formBox{
		padding: 0;
		float: right;
	}
	.btnBox{
		width: 60%;
		float: left;
		.titleBox{
			height: 32px;
			line-height: 32px;
			margin-left: 10px;
			display: block;
			float:left;
		}
		.el-button{
			float: left;
		}
	}
	
	.msg-list {
		height: 240px;
		.el-col {
			display: inline-block!important;
			vertical-align: top!important;
		}
		.el-col:nth-child(4n+1) {
			clear: both;
		}
		.empty {
			// border-bottom: 1px solid #d2d2d2;
		}
	}
</style>