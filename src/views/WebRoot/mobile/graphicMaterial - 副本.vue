<!-- 图文素材 -->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<h4>素材管理</h4>
				<el-tabs v-model="activeName" @tab-click="handleClick" class="dsh-user">
					<el-tab-pane label="图文消息" name="first" v-if="roleBtn['mobile-4-1']"></el-tab-pane>
					<el-tab-pane label="图片" name="second" v-if="roleBtn['mobile-4-2']"></el-tab-pane>
					<el-tab-pane label="语音" name="third" v-if="roleBtn['mobile-4-3']"></el-tab-pane>
					<el-tab-pane label="视频" name="fourth" v-if="roleBtn['mobile-4-4']"></el-tab-pane>
				</el-tabs>
			</el-card>
		</el-header>
		<el-main>
			<el-card v-if="roleBtn['mobile-4-1'] || roleBtn['mobile-4-2'] || roleBtn['mobile-4-3'] || roleBtn['mobile-4-4']">
				<div>
					<graphicMaterialFirst v-if="this.activeName == 'first' && roleBtn['mobile-4-1']"></graphicMaterialFirst>
					<graphicMaterialSecond v-if="this.activeName == 'second' && roleBtn['mobile-4-2']"></graphicMaterialSecond>
					<graphicMaterialThird v-if="this.activeName == 'third' && roleBtn['mobile-4-3']"></graphicMaterialThird>
					<graphicMaterialFourth v-if="this.activeName == 'fourth' && roleBtn['mobile-4-4']"></graphicMaterialFourth>
				</div>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import { graphicMaterialFirst, graphicMaterialSecond, graphicMaterialThird, graphicMaterialFourth } from '@/views/WebRoot/mobile'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 数据
				roleBtn: {
					'mobile-4-1': false,
					'mobile-4-2': false,
					'mobile-4-3': false,
					'mobile-4-4': false
				},
				activeName: 'first',
				form: {
					searchInfo: ''
				}
			}
		},
		components: {
			graphicMaterialFirst,
			graphicMaterialSecond,
			graphicMaterialThird,
			graphicMaterialFourth
		},
		methods: {
			// 方法
			handleClick(tab, event) { // 选项卡
				// console.log(tab, event);
			},
			handleSearch() { // 搜索
				this.$router.push({
					name: '图文素材图文素材新增'
				});
			}
		},
		created() {
			// 钩子函数 -- 初始化
			this.roleBtn = permission(this.roleBtn);
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
		h4{
			padding:0
		}
	}
	
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
</style>