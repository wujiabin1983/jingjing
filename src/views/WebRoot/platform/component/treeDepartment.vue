// 部门名称下拉树
<template>
	<el-container class="app-container">
		<el-main>
			<el-tree :props="defaultProps" ref="tree" :load="loadNode" lazy show-checkbox :expand-on-click-node="true" default-expand-all node-key="departmendIdFull" :default-checked-keys="childCode"></el-tree>
			<!-- default-expand-all -->
		</el-main>
		<el-footer>
			<el-button type="primary" class="floatLeft marginTop10" @click="handleSubmit">确定</el-button>
		</el-footer>
	</el-container>
</template>
<script>
	import { selectDepartment } from "@/api/public";
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				//   下拉树默认数据
				defaultProps: {
					children: "children",
					label: "label",
					isLeaf: "leaf",
					departmendIdFull: "departmendIdFull"
				},
				// 下拉树状态
				isLeaf: false,
				// 选中的下拉树
				selectedTreeNode: []
			}
		},
		props: ['selectedData', 'childCode'],
		methods: {
			// 加载下拉树
			loadNode(node, resolve) {
				let id;
				let that = this;
				if(node.level === 0) {
					id = '';
				} else {
					id = node.data.departmendIdFull;
					// if(node.data.isExistChildNode) {
					//   this.$message('当前为叶子节点');
					//   resolve();
					// }
				}
				let params = {
					userId: this.userInfo.userCode,
					"parentId": id
				}
				// console.log(params);
				// console.log(params, '传的值');
				selectDepartment(params)
					.then(function(res) {
						// console.log(JSON.parse(Base64.decode(res.data))); 
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// console.log(code, msg);return false;
						if(node.childNodes.length > 0) {
							resolve();
						}
						if(code == 'SUCCESS') {
							let res = msg;
							let treeData = [];
							if(res.length > 0) {
								res.forEach((val, index) => {
									treeData.push({
										label: val.departmentName,
										leaf: val.isExistChildNode,
										departmendIdFull: val.departmendIdFull
									});
								});
							}
							resolve(treeData);
						} else {
							that.$message.error(msg);
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			// 确定
			handleSubmit() {
				this.$emit('childSubmit', this.$refs.tree.getCheckedNodes());
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
			])
		},
		created() {

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
	
	.el-main {
		height: 300px; 
		overflow-y: auto;
	}
</style>