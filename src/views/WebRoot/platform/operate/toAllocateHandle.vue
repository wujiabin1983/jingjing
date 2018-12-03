// 权限分配 - 子页面
<template>
	<el-container class="app-container">
		<el-main>
            <span>
	             <el-button @click="handback">返回</el-button>
                <el-button type="primary" @click="handleOpenTree">全部展开</el-button>
                <el-button type="primary" @click="handleCloseTree">全部收缩</el-button>
            </span>
			<el-form ref="form" :model="form" label-width="100px" class="marginTop10">
				<el-card v-loading="loading">
					<toAllocateTree ref="tree" :selected="getId" :pageType="getPageType" v-show="isShow" @setTreeShow="setTreeShow"></toAllocateTree>
				</el-card>
			</el-form>
		</el-main>
	</el-container>
</template>
<script>
	import { validateInt } from "@/utils/validate";
	import { showDropDownTree, editDropDownTree, sellerGroupCombox } from "@/api/platform/toAllocate";
	import { toAllocateTree } from "@/views/WebRoot/platform"
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				loading: false,
				// 商户名称
				form: {
					name: ""
				},
				// 下拉选择商户
				options: [],
				//   下拉树默认数据
				//   data2: [],
				//   defaultProps: {
				//     children: "children",
				//     label: "label"
				//   },
				//   defaultExpandedKeys: [],
				//   defaultCheckedKeys: [],

				isShow: true // 是否显示下拉树
			};
		},
		components: {
			toAllocateTree
		},
		methods: {
            handleOpenTree () {
                this.$refs.tree.handleOpenTree();
            },
            handleCloseTree () {
                this.$refs.tree.handleCloseTree();
            },
			//返回上一个页面
			handback() {
				this.$router.push({
					name: '商户组管理'
				});
			},
			setTreeShow(boolean) {
				// 重新显示tree组件
				let that = this;
				setTimeout(function() {
					that.isShow = true;
				}, 1000);
			},
			//   显示下拉树，并展示默认选中
			//			showData(params) {
			//				this.loading = true;
			//				showDropDownTree(params)
			//					.then((res) => {
			//						let data = JSON.parse(Base64.decode(res.data));
			//						// let data = res.data;
			//						let code = data.returnCode;
			//						let msg = data.returnMsg;
			//						console.log(data);
			//						if(code == 0) {
			//							this.data2 = msg.data;
			//							this.defaultExpandedKeys = msg.defaultExpandedKeys;
			//							this.defaultCheckedKeys = msg.defaultCheckedKeys;
			//							this.loading = false;
			//						} else {
			//							this.$message.error(msg);
			//							this.laoding = false;
			//						}
			//					})
			//					.catch((err) => {
			//						console.log(err);
			//						this.loading = false;
			//					})
			//			},
			//   设置权限
			//			editData(params) {
			//				this.loading = true;
			//				editDropDownTree(params)
			//					.then((res) => {
			//						let data = JSON.parse(Base64.decode(res.data));
			//						let code = data.returnCode;
			//						let msg = data.returnMsg;
			//						console.log(data);
			//						if(code == 0) {
			//							this.data2 = msg.data;
			//							// this.form.name = msg.name;
			//							this.form.name = params.name;
			//							this.loading = false;
			//						} else {
			//							this.$message.error(msg);
			//							this.laoding = false;
			//						}
			//					})
			//					.catch((err) => {
			//						console.log(err);
			//						this.loading = false;
			//					})
			//			},
			//       获取选中的节点
			//			getCheckedKeys() {
			//				let pageType = this.getPageType;
			//				if(pageType == "查看") {
			//					this.$router.push({
			//						name: '权限分配',
			//						params: {
			//							pageType: '查看'
			//						}
			//					});
			//				}
			//				if(pageType == "设置") {
			//					let checkedKeys = this.$refs.tree.getCheckedKeys();
			//					this.$router.push({
			//						name: '权限分配',
			//						params: {
			//							pageType: '设置',
			//							checkedKeys: checkedKeys
			//						}
			//					});
			//				}
			//			},
		},
		created() {

		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			},
			getId() {
				return this.$route.params.id;
			},
			getName() {
				return this.$route.params.name;
			},
			returnSelected() {
				return this.form.name
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}

	.el-input {
		width: rem(200px);
	}

	.el-textarea {
		width: rem(500px);
	}
</style>
