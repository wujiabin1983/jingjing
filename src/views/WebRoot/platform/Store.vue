<template>
	<!-- <el-container class=""> -->
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="门店" name="门店">
				<el-cascader :options="cascaderOptions" change-on-select v-model="form.searchInfo" @change="handleCascader"></el-cascader>
				<el-button type="primary" @click="handleSearch">查询</el-button>

			</el-tab-pane>
			<el-tab-pane label="店组" name="店组">店组</el-tab-pane>
			<el-tab-pane label="区域" name="区域">区域</el-tab-pane>
		</el-tabs>
		<!-- </el-container> -->
	</div>
</template>
<script>
	import { showCascader } from '@/api/cascader'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 初始化显示的选项卡
				activeName: '门店',
				// 搜索表单
				form: {
					searchInfo: []
				},
				// 级联数据
				cascaderOptions: []

			}
		},
		methods: {
			// 选项卡切换
			handleClick(tab, event) {
				//        console.log(tab, event);
			},
			// 搜索数据
			handleSearch() {
				//        console.log(this.form.searchInfo);
			},
			// 级联点击事件
			handleCascader(value) {
				//        console.log(value);
			},
			// 初始化级联选择器
			showCascaderInfo() {
				showCascader()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.cascaderOptions = data.messageContent;
						} else {
							that.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// 初始化级联选择器
			this.showCascaderInfo()
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
		position: absolute;
		margin-left: rem(20px);
	}
	
	.el-dialog__body {
		padding: 20px 10px;
	}
</style>