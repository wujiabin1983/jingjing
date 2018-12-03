<template>
	<el-container class="app-container" v-loading="tableLoading">
		<el-main>
			<el-tree ref="tree" :props="defaultProps" :load="loadNode" @check-change="handleCheckChange" lazy node-key="id" show-checkbox default-expand-all>
			</el-tree>
			<!-- default-expand-all -->
		</el-main>
		<el-footer>
			<el-button type="primary" class="floatLeft marginTop10" @click="handleSubmit" v-if="isButtonShow">确定</el-button>
		</el-footer>
	</el-container>
</template>
<script>
	import { showDropDownTree, editDropDownTree, setTreeSelected } from "@/api/platform/toAllocate";
	import { getDropDownTreeInfo, addRoleInfo, setRoleInfo, getDataInfo, setRolePrivileges } from "@/api/base/rolePrivileges";
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableLoading: false,
				//   下拉树默认数据
				defaultProps: {
					children: "children",
					label: "label",
					isLeaf: "leaf",
					id: "id",
					"showControl": "showControl",
					"canShowControl": "canShowControl",
					"checked": "checked"
				},
				// 下拉树状态
				isLeaf: false,
				// 选中的下拉树
				selectedTreeNode: [],
				parentSelectData: '',
				// 加载树的相关数据

				selectedData: '', // 选中的下拉选项
				checkedKey: [], // 选中的节点

				isButtonShow: false // 是否显示按钮
			}
		},
		props: ['selected'],
		methods: {
			// 更新下拉树勾选项
			updateSelected() {
				// console.log(this.selectedData);
				// this.$refs.tree.setCheckedKeys(["deleteSellerInfo", 'updateSellerInfo']);
				this.isButtonShow = true;
				let params = {
					"groupId": this.selectedData
				}
				setTreeSelected(params)
					.then((res) => {
						// console.log(JSON.parse(Base64.decode(res.data)));return false;
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// count = data.count,
						// msg = data.data;
						//                      console.log(msg);
						if(code == 'SUCCESS') {
							this.$refs.tree.setCheckedKeys(msg);
						}
					})
					.catch((err) => {
//						console.log(err);
					})
			},
			// 加载下拉树
			loadNode(node, resolve) {
				this.node = node;
				this.resolve = resolve;
				//          console.log(node.childNodes)
				//             console.log(node, resolve);
				let id = '';
				let that = this;
				if(node.level != 0) {
					id = node.data.id;
				}
				let params = {
					userId: this.userInfo.userCode,
					"userGroupId": !this.selectedData ? '' : this.selectedData,
					"nodeId": id
				}
				// console.log(params, '传的值');
				getDropDownTreeInfo(params)
					.then(function(res) {
						//                  console.log(res, 'resData');
						let treeData = [];
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.data.messageType,
							msg = data.data.messageContent;
						// console.log(code, msg);
						if(node.childNodes.length > 0) {
							resolve();
						}
						// console.log(msg.length);
						if(code == 'SUCCESS') {
							let res = msg;
							let treeData = [];
							if(res.length > 0) {
								res.forEach((val, index) => {
									treeData.push({
										label: val.text,
										leaf: val.leaf,
										id: val.id,
										showControl: val.showControl,
										canShowControl: val.canShowControl,
										checked: val.checked,
									});
								});
							}
							resolve(treeData);
						} else {
							that.$message.error(msg);
						}
					})
					.catch(function(err) {
//						console.log(err);
					});

			},
			handleCheckChange(data, checked, indeterminate) {
				// console.log('****************************');
				// console.log(JSON.stringify(data), 'data');
				// console.log(JSON.stringify(checked), '节点本身是否被选中');
				// console.log(JSON.stringify(indeterminate), '节点的子树中是否有被选中的节点');
				// console.log('****************************');
				if(checked) { // 节点本身被选中
					// console.log(data);
					this.selectedTreeNode.push({
						label: data.departmentNameFull,
						value: data.departmentIdFull
					});
				}
			},
			// 确定
			handleSubmit() {
				let params = {
					"userId": this.userInfo.userCode,
					"userGroupId": this.selectedData,
					"menuCode": this.$refs.tree.getCheckedKeys()
				}
				this.tableLoading = true;
				editDropDownTree(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.data.messageType,
							msg = data.data.messageContent;
						//                  console.log(data, code, msg);
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.tableLoading = false;
						} else {
							this.$message.warning(msg);
							this.tableLoading = false;
						}
					})
					.catch((err) => {
//						console.log(err);
					});
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
			]),
			returnSelected() {
				return this.selected;
			}
		},
		created() {
			this.isShow = true;
		},
		watch: {
			'selected': function(newVal, oldVal) {
				this.selectedData = newVal;
				this.updateSelected();
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

	.el-main {
		height: 300px; 
		overflow-y: auto;
	}
</style>
