// 平台管理- 模板管理
<template>
	<el-container class="app-container">
		<el-row :gutter="10">
			<el-col :span="6">
				<el-card>
					<el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect">
						<el-menu-item index="1">预置活动模板</el-menu-item>
						<el-menu-item index="2">短信模板</el-menu-item>
						<el-menu-item index="3">会员分组模板</el-menu-item>
					</el-menu>
				</el-card>
			</el-col>
			<el-col :span="18">
				<precastActTemp v-show="activeIndex == '1'"></precastActTemp>
				<SMSTemp v-show="activeIndex == '2'"></SMSTemp>
				<MemberGroupTemp v-show="activeIndex == '3'" @activeNav="handleActiveNav"></MemberGroupTemp>
			</el-col>
		</el-row>
	</el-container>
</template>
<script>
	// import { selectTemplateInfo} from '@/api/platform/template'
	import { mapGetters } from 'vuex'

	import { precastActTemp, SMSTemp, MemberGroupTemp } from '@/views/WebRoot/platform'

	export default {
		data() {
			return {
				// 左侧导航默认
				activeIndex: '1',
				// 控制激活哪个视图
				routerViewShow: [1, 0, 0],
			}
		},
		methods: {
			handleSelect(val) {
				this.activeIndex = val;
			},
			handleActiveNav(str) {
				this.activeIndex = str;
			}
		},
		created() {
			// 钩子函数 -- 初始化
			if(this.getType) {
				//      	console.log(this.getType);
				//      	console.log(typeof this.getType);
				this.activeIndex = this.getType;
				//          $(".el-menu-demo .el-menu-item").eq(1).addClass("is-active");
			}
		},
		components: {
			precastActTemp,
			SMSTemp,
			MemberGroupTemp
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getType() {
				return this.$route.params.type;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.app-container {
		padding-right: 0;
	}
	
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
	
	.el-aside {
		width: rem(300px);
		margin-right: rem(10px);
	}
	
	.el-row {
		width: 100%;
	}
</style>