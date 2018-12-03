<!--员工管理-角色权限-子页面-下一步-->
<template>
	<el-main v-loading="tableLoading">
		<!-- <el-form ref="form" :model="form" label-width="100px"> -->
		<el-button class="mainBtn" @click="handleBack">返回</el-button>
		<el-button type="primary" class="mainBtn" @click="handleOpenTree">全部展开</el-button>
		<el-button type="primary" class="mainBtn" @click="handleCloseTree">全部收缩</el-button>
		<el-card v-loading="loading">
			<el-tree :data="data2" show-checkbox node-key="id" :load="handleLoad" :lazy="true" :default-expanded-keys="defaultExpendedKeys" @check-change="handleCheckChange" :default-checked-keys="defaultCheckedKeys" :props="defaultProps" ref="tree">
			</el-tree>
			<el-button type="primary" @click="handleGetCheckedKeys" v-if="this.getPageType != '查看'">确定</el-button>
		</el-card>
	</el-main>
</template>
<script>
	import { validateInt } from "@/utils/validate";
	import { mapGetters } from 'vuex'
	import { getDropDownTreeInfo, addRoleInfo, setRoleInfo, getDataInfo, setRolePrivileges, getDropDownTreeInfoAPP, setRoleInfoAPP } from "@/api/base/rolePrivileges";
	export default {
		data() {
			return {
				loading: false,
				tableLoading: false,
				//   下拉树默认数据
				form: {},
				data2: [],
				defaultProps: {
					children: "children",
					label: "label",
					isLeaf: "leaf",
					checked: "checked",
					id: "msg"
				},
				// defaultExpandedKeys: [],
				defaultCheckedKeys: [],
				checkValue: [],
				checkValueAll: [],

				returnSelected: '',

				treeLevel: {},
				defaultExpendedKeys: [],

				// 懒加载树
				time: null,
			};
		},
		// components: {
		// 	rolePrivilegesSetTree
		// },
		props: ['getFormData', 'getPageType'],
		methods: {
			// 返回
			handleBack() {
				this.$router.push({
					name: '角色权限'
				});
			},
			handleOpenTree() {
				for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
					// console.log(this.$refs.tree.store._getAllNodes()[i]);
					this.$refs.tree.store._getAllNodes()[i].expanded=true;
				}
			},
			handleCloseTree() {
				// this.defaultExpendedKeys.splice(0, this.defaultExpendedKeys.length);
				for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
					// console.log(this.$refs.tree.store._getAllNodes()[i]);
					this.$refs.tree.store._getAllNodes()[i].expanded=false;
				}
			},
			// 加载下拉树
			loadNode(node, resolve) {
				// console.log(node, resolve);
				let id;
				let that = this;
				if(node.level === 0) {
					id = '';
				} else {
					id = node.data.id;
				}
				let formData = this.getFormData;
				let params = {
					userId: this.userInfo.userCode,
					userRoleId: JSON.parse(formData).userRoleId,
					"nodeId": id
				}
				// console.log(params);
				
				clearTimeout(this.time);
				getDropDownTreeInfo(params)
					.then(function(res) {
						// console.log(JSON.parse(Base64.decode(res.data))); 
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(node.childNodes.length > 0) {
							resolve();
						}
						this.time = setTimeout(function() {
							if(code == 'SUCCESS') {
								let res = msg;
								let treeData = [];
//								console.log(JSON.stringify(res))
								if(res.length > 0) {
									// 获取所有带子节点的节点集合
									// that.treeLevel[node.level] = !that.treeLevel[node.level] ? [] : that.treeLevel[node.level];
									// res.forEach((val, index) => {
									// 	// if(!val.leaf) {
									// 		that.treeLevel[node.level].push(val.msg);
									// 	// }
									// 	// 只展开前两级
									// 	// if(node.level < 2) {
									// 	// 	// that.defaultExpendedKeys.push(val.msg);
									// 	// }
									// });
									res.forEach((val, index) => {
//										console.log(val)
										treeData.push({
											label: val.label,
											leaf: val.showControl,
											id: val.msg
										});
										if(val.checked) {
											that.defaultCheckedKeys.push(val.msg);
										}
										// console.log(val.showControl, val.msg, val.label);
										// 只展开前两级
										if(!val.showControl) {
											that.defaultExpendedKeys.push(val.msg);
										}
										// console.log(that.defaultCheckedKeys);
										that.checkValue = that.defaultCheckedKeys;
										that.checkValueAll = that.$refs.tree.getCheckedAll();
									});
								}
								resolve(treeData);
							} else {
								that.$message.warning(msg);
							}
						}, 20);
					})
					.catch(function(err) {
						//						console.log(err);
					});
			},
			
			// 加载下拉树
			loadNodeApp(node, resolve) {
				// console.log(node, resolve);
				let id;
				let that = this;
				if(node.level === 0) {
					id = '';
				} else {
					id = node.data.id;
				}
				let formData = this.getFormData;
				let params = {
					userId: this.userInfo.userCode,
					userRoleId: JSON.parse(formData).userRoleId,
					"nodeId": id
				}
				// console.log(params);
				
				clearTimeout(this.time);
				getDropDownTreeInfoAPP(params)
					.then(function(res) {
						// console.log(res)
						// console.log(JSON.parse(Base64.decode(res.data))); 
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						// console.log(code, msg);
						if(node.childNodes.length > 0) {
							resolve();
						}
						this.time = setTimeout(function() {
							if(code == 'SUCCESS') {
								let res = msg;
								let treeData = [];
								if(res.length > 0) {
									res.forEach((val, index) => {
										// console.log(val);
										treeData.push({
											label: val.label,
											leaf: val.isButton,
											id: val.msg
										});
										if(val.checked) {
											that.defaultCheckedKeys.push(val.msg);
										}
										// 只展开前两级
										if(!val.isButton) {
											that.defaultExpendedKeys.push(val.msg);
										}
										// console.log(that.defaultCheckedKeys);
										that.checkValue = that.defaultCheckedKeys;
										that.checkValueAll = that.$refs.tree.getCheckedAll();
									});
								}
								resolve(treeData);
							} else {
								that.$message.warning(msg);
							}
						}, 20);
					})
					.catch(function(err) {
						//						console.log(err);
					});
			},
			
			
			handleCheckChange() {
				this.checkValue = this.$refs.tree.getCheckedKeys();
				this.checkValueAll = this.$refs.tree.getCheckedAll();
			},
			//点击确定
			getCheckedKeys() {
				this.tableLoading = true;
				let that = this;
				let pageType = this.getPageType;
				this.checkValueAll = this.checkValueAll.length === 0 ? this.$refs.tree.getCheckedAll() : this.checkValueAll;
				if(pageType == "查看") {
					this.$router.push({
						name: '角色权限'
					});
				}
				if(pageType == "修改") {
					let params = {
						"userId": this.userInfo.userCode,
						"menuCode": !JSON.stringify(this.checkValue) ? [] : JSON.stringify(this.checkValue),
						"menuCodeAll": !JSON.stringify(this.checkValueAll) ? [] : JSON.stringify(this.checkValueAll),
						"emplRoleVO": this.getFormData
					}
					// console.log(params);alert(1);return false;
					//					console.log(JSON.stringify(params))
					setRoleInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(JSON.stringify(data)+"返回值")
							let code = data.messageType;
							let msg = data.messageContent;
							if(code == 'SUCCESS') {
								that.$message.success(msg);
								that.$router.push({
									name: '角色权限'
								});
							} else {
								that.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
							that.loading = false;
						})
				}
				if(pageType == "添加") {
					let params = {
						"userId": this.userInfo.userCode,
						"menuCode": !JSON.stringify(this.checkValue) ? [] : JSON.stringify(this.checkValue),
						"menuCodeAll": !JSON.stringify(this.checkValueAll) ? [] : JSON.stringify(this.checkValueAll),
						"emplRoleVO": this.getFormData
					}
					// console.log(params);alert(2);return false;
					//					console.log(JSON.stringify(params))
					addRoleInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(JSON.stringify(data)+"返回值")
							let code = data.messageType;
							let msg = data.messageContent;
							if(code == 'SUCCESS') {
								that.$message.success(msg);
								that.$router.push({
									name: '角色权限'
								});
							} else {
								that.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
							that.loading = false;
						})
				}
				if(pageType == "权限分配") {
					let params = {
						"userId": this.userInfo.userCode,
						"menuCode": !JSON.stringify(this.checkValue) ? [] : JSON.stringify(this.checkValue),
						"menuCodeAll": !JSON.stringify(this.checkValueAll) ? [] : JSON.stringify(this.checkValueAll),
						"userRoleId": JSON.parse(this.getFormData).userRoleId
					}
					// console.log(params);alert(3);return false;
					// console.log(params);
					setRolePrivileges(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(JSON.stringify(data)+"返回值")
							let code = data.messageType;
							let msg = data.messageContent;
							if(code == 'SUCCESS') {
								that.$message.success(msg);
								that.$router.push({
									name: '角色权限'
								});
							} else {
								that.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
							that.loading = false;
						})
				}
				if(pageType == "APP权限分配") {
					let params = {
						"userId": this.userInfo.userCode,
						// "menuCode": !JSON.stringify(this.checkValue) ? [] : JSON.stringify(this.checkValue),
						// "menuCodeAll": !JSON.stringify(this.checkValueAll) ? [] : JSON.stringify(this.checkValueAll),
						"userRoleId": JSON.parse(this.getFormData).userRoleId
					}
					// console.log(params);alert(3);return false;
					// console.log(params);
					setRolePrivilegesAPP(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(JSON.stringify(data)+"返回值")
							let code = data.messageType;
							let msg = data.messageContent;
							if(code == 'SUCCESS') {
								that.$message.success(msg);
								that.$router.push({
									name: '角色权限'
								});
							} else {
								that.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
							that.loading = false;
						})
				}
			},
			//点击确定
			getCheckedKeysAPP() {
				this.tableLoading = true;
				let that = this;
				let pageType = this.getPageType;
				this.checkValueAll = this.checkValueAll.length === 0 ? this.$refs.tree.getCheckedAll() : this.checkValueAll;
				if(pageType == "查看") {
					this.$router.push({
						name: '角色权限'
					});
				}
				// console.log(this.checkValue, JSON.stringify(this.checkValue));return false;
				let params = {
					"userId": this.userInfo.userCode,
					"menuCode": !JSON.stringify(this.checkValue) ? [] : this.checkValue,
					"userRoleId": JSON.parse(this.getFormData).userRoleId
				}
				setRoleInfoAPP(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//							console.log(JSON.stringify(data)+"返回值")
						let code = data.messageType;
						let msg = data.messageContent;
						if(code == 'SUCCESS') {
							that.$message.success(msg);
							that.$router.push({
								name: '角色权限'
							});
						} else {
							that.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
						that.loading = false;
					})
			},
		},
		created() {
			// 钩子函数 -- 初始化
			let pageType = this.getPageType;
			let formData = this.getFormData;
			// console.log(pageType, formData, 'pageType, formData');
			let that = this;
			let params = {
				userId: this.userInfo.userCode,
				userRoleId: ''
			}
			// this.showData(params);
			//			console.log(formData+"")
//						console.log(this.getPageType)
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			handleLoad() {
				return this.getPageType == '权限分配' || this.getPageType == '添加' || this.getPageType == '修改' || this.getPageType == '查看' ? this.loadNode : this.loadNodeApp
			},
			handleGetCheckedKeys() {
				return this.getPageType == '权限分配' || this.getPageType == '添加' || this.getPageType == '修改' || this.getPageType == '查看' ? this.getCheckedKeys : this.getCheckedKeysAPP
			}
			// getPageType() {
			// 	return this.$route.params.pageType;
			// },
			// getFormData() {
			// 	return this.$route.params.formData;
			// },
			// getId() {
			// 	return this.$route.params.id;
			// },
			// getName() {
			// 	return this.$route.params.name;
			// }
		},
		watch: {
			'data2': function(val, oldVal) {
				// console.log(val)
			},
			'defaultCheckedKeys': function(val, oldVal) {
				// console.log(val)
			},
			deep: true
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
	.mainBtn {
		margin-bottom: 10px;
	}
</style>