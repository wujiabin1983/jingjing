<!-- 群发消息 -->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card v-if="roleBtn['mobile-3-1'] || roleBtn['mobile-3-2']">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="群发消息" name="first" v-if="roleBtn['mobile-3-1']">
						<groupMsgMasterFirst :childData="data" @tabIndex="handleChangeTabIndex"></groupMsgMasterFirst>
					</el-tab-pane>
					<el-tab-pane label="群发记录" name="second" v-if="roleBtn['mobile-3-2']">
						<groupMsgMasterSecond ref="secondTab" @tabIndex="handleChangeTabIndex"></groupMsgMasterSecond>
					</el-tab-pane>
				</el-tabs>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { groupMsgMasterFirst, groupMsgMasterSecond } from '@/views/WebRoot/mobile'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleBtn: {
					'mobile-3-1': false,
					'mobile-3-2': false
				},
				// 数据
				activeName: 'first',
				data: {}
			}
		},
		components: {
			groupMsgMasterFirst,
			groupMsgMasterSecond
		},
		methods: {
			// 方法
			handleClick(str) {
				//          console.log(str);
			},
			handleChangeTabIndex(str) {
				let that = this;
				if(str.index == 'first') {
					// console.log(str.data, '----str.data');
					// console.log(str.data, '\\\||||');
					this.data = str.data;
					this.activeName = str.index;
				} else if(str.index == 'second') {
					this.activeName = str.index;
					setTimeout(function() {
					    that.$refs.secondTab.showTable(1, 7, '');
					}, 600);
				}
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);
			if(this.getFormType){
				if(this.getFormType=="群发消息记录"){
					this.activeName="second";
				}
			}
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getFormType() {
				return this.$route.params.clickType;
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
</style>