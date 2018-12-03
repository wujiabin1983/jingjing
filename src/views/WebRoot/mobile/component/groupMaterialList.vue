<!-- 图文素材 - 素材库 -->
<template>
	<el-container>
		<el-header class="header">
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item label="">
					<el-input v-model="form.searchInfo" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main> 
			<span>图文消息(共<span>{{count}}</span>条)</span>
		</el-main>
		<el-main class="overHidden" v-loading="elMainLoading">
			<el-row class="msg-list">
				<el-col :span="7" v-for="(item, index) in items" :key="items.id">
					<div class="component">
						<div :is="item.component" :childDataLists="dataLists[index]" @parentMasterId="handleMasterId" :childChecked="checked" :isCheckBox="true" ref="groupMaterialListShow"></div>
					</div>
				</el-col>
			</el-row>
			<!-- 分页 -->
			<el-footer v-if="count != 0">
				<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
				</el-pagination>
			</el-footer>
		</el-main>
	</el-container>
</template>
<script>
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import groupMaterialListShow from '@/views/WebRoot/mobile/component/groupMaterialListShow'
	import { mapGetters } from 'vuex'
	import { MaterialLibraryFirstShow } from '@/api/mobile/graphicMaterial'
	export default {
		data() {
			return {
				// 数据
				form: {
					searchInfo: ''
				},
				dataLists: [],

				items: [], // 动态添加的组件

				elMainLoading: false, // loading
				checked: false, // 选中

				checkedList: [], // 选中的项

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 方法
			handleCommit() {
				// console.log(this.dataLists, this.items);
//				console.log(this.dataLists, 'this.dataLists');
			},
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
//				 console.log(params);
				MaterialLibraryFirstShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							// code = data.returnCode,
							// msg = data.returnMsg;
							count = data.count,
							msg = data.data;
						that.elMainLoading = false;
						that.count = data.count;
						that.dataLists = msg.length > 0 ? msg : [];
						that.items = [];
						msg.forEach((val, index) => {
							that.items.push({
								'id': length++,
								'component': 'group-material-list-show'
							});
						});
						if(that.$refs.groupMaterialListShow.length > 0) {
							that.$refs.groupMaterialListShow.forEach((val, index) => {
								val.checked = false; // 清除选中
							});
						}
						that.dataLists.forEach((val, index) => {
							val.forEach((subVal, subIndex) => {
								subVal.checked = false;
							});
						});
					})
					.catch((err) => {
//						 console.log(err);
					});
			},
			handleAddGraphicMaterial() { // 新建图文素材
				this.$router.push({
					name: '图文素材图文素材新增',
					params: {
						pageType: '添加'
					}
				});
			},
			handleMasterId(masterId) { // 传递masterId
				let data = {};
				if(this.$refs.groupMaterialListShow.length > 0) {
					this.$refs.groupMaterialListShow.forEach((val, index) => {
						if(val.groupId == masterId) {
//							val.checked = true; // 清除选中
							data = val.childDataLists;
						} else {
//							val.checked = false; // 清除选中
						}
					});
				}
				let params = {
					masterId: masterId,
					data: data
				}
				this.$emit('parentMasterId', params);
			}
		},
		components: {
			groupMaterialListShow
		},
		created() {
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
	.el-main{
		width: 100%!important;
	}
	.el-form {
		display: inline-block;
		position: absolute;
		// margin-left: rem(20px);
	}
	
	.header {
		width: 100%;
		height: 34px!important;
		margin-bottom: 10px;
		clear: both;
	}
	
	.msg-list {
		.el-col {
			display: inline-block!important;
			vertical-align: top!important;
		}
		.el-col:nth-child(4n+1) {
			clear: both;
		}
	}
</style>