// 电子券维护
<template>
	<el-container class="app-container">
		<!--<el-header>
			<el-card>
				<el-steps :active="active" finish-status="success" simple>
					<el-step title="优惠券生成规则"></el-step>
					<el-step title="微信卡券设置"></el-step>
					<el-step title="微信卡券自定义入口设置"></el-step>
				</el-steps>
			</el-card>
		</el-header>-->
		<el-main>
			<el-card>
				<el-main>
					<electronicVoucherA v-if="active == 0" v-on:message="recieveMessage"></electronicVoucherA>
					<electronicVoucherB v-if="active == 1" v-on:message1="recieveMessage"></electronicVoucherB>
					<electronicVoucherC v-if="active == 2" v-on:message2="recieveMessage"></electronicVoucherC>
				</el-main>

			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	// import templateInfoOne from '@/views/WebRoot/platform/component/templateInfoOne'
	// import templateInfoTwo from '@/views/WebRoot/platform/component/templateInfoTwo'
	// import templateInfoThree from '@/views/WebRoot/platform/component/templateInfoThree'
	import { electronicVoucherA, electronicVoucherB, electronicVoucherC } from '@/views/WebRoot/base'
	export default {
		data() {
			return {
				roleBtn: {
					selectElectronicRuleInfo: false,
					addElectronicRuleInfo: false,
					updateElectronicRuleInfo: false
				},
				active: 0
			}
		},
		methods: {
			back() {
				this.$router.push({
					name: '模板管理'
				});
			},
			//      prev() {
			//          console.log(this.active);
			//          if (this.active-- < 1){
			//              this.active = 0;
			//          }
			//      },
			//      next() {
			//          if (this.active++ > 2){
			//              this.active = 3;
			//          }
			//      },
			//      finish() {
			//
			//      },
			//      handleCheckStep1 () {
			//          alert(1);
			//      },
			recieveMessage: function(text) {
				this.active = parseInt(text);
			},
		},
		created() {
			// this.$router.push({
			//     name: '模板管理 - 查看详情'
			// });
			// 钩子函数 -- 初始化
			// console.log(this.getPageType);
			//      console.log(this.getPageType);
			if(this.getPageType == '查看') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
				// this.form.status
			}
		},
		components: {
			electronicVoucherA,
			electronicVoucherB,
			electronicVoucherC
		},
		computed: {
			// 计算属性
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
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
	
	.el-select {
		width: 100%;
	}
	.el-steps--simple {
		background: transparent;
	}
</style>