// 活动管理-新建活动
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-steps :active="active" finish-status="success" simple>
					<el-step title="基本信息"></el-step>
					<el-step title="活动对象"></el-step>
					<el-step title="赠送内容"></el-step>
					<el-step title="执行计划"></el-step>
				</el-steps>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-main class="marginTop40">
					<template-info-one v-if="active == 0" v-on:message="recieveMessage"></template-info-one>
					<template-info-two v-if="active == 1" v-on:message1="recieveMessage"></template-info-two>
					<template-info-three v-if="active == 2" v-on:message2="recieveMessage"></template-info-three>
					<template-info-four v-if="active == 3" v-on:message3="recieveMessage"></template-info-four>
				</el-main>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import templateInfoOne from '@/views/WebRoot/member/component/templateOne'
	import templateInfoTwo from '@/views/WebRoot/member/component/templateTwo'
	import templateInfoThree from '@/views/WebRoot/member/component/templateThree'
	import templateInfoFour from '@/views/WebRoot/member/component/templateFour'
	export default {
		data() {
			return {
				type: "",
				active: 0
			}
		},
		methods: {
			recieveMessage: function(text) {
				this.active = parseInt(text);
			},
		},
		created() {
			//			console.log(this.getPageType);
			if(this.getPageType == '查看') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			} else if(this.getPageType == '修改' || this.getPageType == '复制') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			}
		},
		components: {
			templateInfoOne,
			templateInfoTwo,
			templateInfoThree,
			templateInfoFour
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getActive() {
				return this.$route.params.active;
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
		width: rem(700px);
		min-width: 500px;
	}
	.marginTop40{
		margin-top: 40px;
	}
	.el-select {
		width: 100%;
	}
	
	.el-steps--simple {
		background: transparent;
	}
</style>