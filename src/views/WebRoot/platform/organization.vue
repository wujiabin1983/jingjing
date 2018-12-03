<!--组织架构-->
<template>
	<el-container class="app-container">
		<!-- 功能按钮 -->
		<el-header>
			<el-card class="box-card" v-if="roleBtn.addContOrgInfo || roleBtn.deleteContOrgInfo">
				<el-button type="primary" @click="addOrganization" v-if="roleBtn.addContOrgInfo">添加</el-button>
				<!-- <el-button type="primary" @click="editOrganization">编辑</el-button> -->
				<el-button type="primary" @click="deleteOrganization" v-if="roleBtn.deleteContOrgInfo">删除</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-row :gutter="10" class="main-row">
				<el-col :span="8" class="card-tree">
					<!-- 下拉树 - 左侧 -->
					<el-card>
						<h4>SCRM平台</h4>
						<!-- <el-tree :data="data" ref="tree" node-key="id" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
						<el-tree :props="defaultProps" ref="tree" :load="loadNode" lazy :expand-on-click-node="false" node-key="0" default-expand-all @node-click="handleNodeClick">
						</el-tree>
					</el-card>
				</el-col>

				<el-col :span="16">
					<el-card>
						<h4>组织架构信息</h4>
						<el-form ref="form" :model="form" label-width="140px">
							<el-row :gutter="20">
								<el-col :span="12">
									<!-- code -->
									<el-form-item label="上级组织架构代码">
										<el-input v-model="form.codeHigher" :disabled="true"></el-input>
									</el-form-item>
									<!-- code -->
									<el-form-item label="当前组织架构代码">
										<el-input v-model="form.codeCurrent" :disabled="true"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<!-- name -->
									<el-form-item label="上级组织架构名称">
										<el-input v-model="form.nameHigher" :disabled="true"></el-input>
									</el-form-item>
									<!-- name -->
									<el-form-item label="当前组织架构名称">
										<el-input v-model="form.nameCurrent" :disabled="true"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-form-item label="组织架构描述">
								<el-input type="textarea" v-model="form.desc" resize="none" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item v-if="false">
								<el-button type="primary" @click="submitForm()">立即创建</el-button>
								<el-button>取消</el-button>
							</el-form-item>
						</el-form>
					</el-card>
					<el-card>
						<h4>当前组织架构用户</h4>
						<!-- 用户账号 真实名 用户组 部门 角色 状态 table 表格-->
						<el-table :data="tableData" v-loading="tableLoading" border>
							<el-table-column prop="account" label="用户账号"></el-table-column>
							<el-table-column prop="name" label="真实名"></el-table-column>
							<el-table-column prop="group" label="用户组"></el-table-column>
							<el-table-column prop="department" label="部门"></el-table-column>
							<el-table-column prop="role" label="角色"></el-table-column>
							<el-table-column prop="status" label="状态"></el-table-column>
						</el-table>
						<!-- 分页 -->
						<el-footer v-if="count != 0">
							<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
							</el-pagination>
						</el-footer>
					</el-card>
				</el-col>
			</el-row>
		</el-main>

	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { validateInt } from "@/utils/validate";
	import { lazyTree, addContOrgInfo, deleteContOrgInfo, showUserInfoByDepartmentId } from '@/api/platform/organization'
	import { mapGetters } from 'vuex';
	export default {
		data() {
			const isInt = (rule, value, callback) => {
				if(!validateInt(value)) {
					callback(new warning("请输入整数"));
				} else {
					callback();
				}
			};
			return {
				roleBtn: {
					selectContOrgInfo: false,
					addContOrgInfo: false,
					deleteContOrgInfo: false
				},
				//   下拉树默认数据
				defaultProps: {
					children: "children",
					label: "label",
					isLeaf: "leaf",
					id: "id",
					parentIdFull: "parentIdFull", // 上级
					parentNameFull: "parentNameFull", // 上级
					"departmentId": "departmentId", /// 当前组织架构代码  
					"departmentName": "departmentName", // 当前组织架构名称   
					departmentIdFull: "departmentIdFull",
					departmentNameFull: "departmentNameFull",
					departmentDesc: "departmentDesc",
				},
				// 下拉树状态
				isLeaf: false,
				//   表单数据
				form: {
					id: '',
					codeHigher: "", // 上级组织架构代码
					nameHigher: "", // 上级组织架构名称
					codeCurrent: "", // 当前组织架构代码
					nameCurrent: "", // 当前组织架构名称
					desc: "" // 组织架构描述
				},
				tableData: [
					// {
					//   account: "admin01",
					//   name: "艾德敏",
					//   group: "系统管理员组",
					//   department: "经理部",
					//   role: "",
					//   status: "激活"
					// }
				],
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
				tableLoading: false
			};
		},
		methods: {
			// 加载下拉树
			loadNode(node, resolve) {
				let id;
				let that = this;
				if(node.level === 0) {
					id = '';
				} else {
					id = node.data.departmentIdFull;
					// if(node.data.isExistChildNode) {
					//   this.$message('当前为叶子节点');
					//   resolve();
					// }
				}
				let params = {
					userId: this.userInfo.userCode,
					"id": id
				}
				lazyTree(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(data.messageContent, 'msg');
						if(node.childNodes.length > 0) {
							resolve();
						}
						if(data.messageType == 'SUCCESS') {
							let res = data.messageContent;
							let treeData = [];
							if(res.length > 0) {
								res.forEach((val, index) => {
									treeData.push({
										label: val.departmentName,
										leaf: !val.isExistChildNode,
										id: val.id,
										parentIdFull: val.parentIdFull,
										parentNameFull: val.parentNameFull,
										departmentId: val.departmentId, /// 当前组织架构代码  
										departmentName: val.departmentName, // 当前组织架构名称   
										departmentIdFull: val.departmentIdFull,
										departmentNameFull: val.departmentNameFull,
										departmentDesc: val.departmentDesc
									});
								});
							}
							// console.log(JSON.stringify(treeData));
							resolve(treeData);
						} else {
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						// console.log(err);
					});

			},
			// 下拉节点点击
			handleNodeClick(data, node, self) {
				//				console.log(data.parentIdFull);
				let label = data.lanel;
				let children = data.children;
				this.form.id = data.id;
				this.form.codeHigher = data.parentIdFull; // 上级组织架构代码
				this.form.nameHigher = data.parentNameFull; // 上级组织架构名称
				this.form.codeCurrent = data.departmentId; // 当前组织架构代码
				this.form.nameCurrent = data.departmentName; // 当前组织架构名称
				this.form.desc = data.departmentDesc; // 组织架构描述
				this.form.departmentIdFull = data.departmentIdFull; //   部门全节点ID
				this.form.departmentNameFull = data.departmentNameFull; // 部门全节点名称

				// 勾选前面的复选框
				this.showTable(this.page, this.limit, this.form.departmentIdFull);
			},
			submitForm(data) {
				this.$refs["form"].validate(valid => {
					if(valid) {
						// console.log(data);
						// console.log("submit!");
					} else {
						// console.log("warning submit!!");
						return false;
					}
				});
			},
			// 添加
			addOrganization() {
				let id = this.form.id;
				if(id.length > 0) {
					// 要将当前节点的代码作为上级节点代码传过去
					let data = {
						codeHigher: this.form.codeCurrent,
						nameHigher: this.form.nameCurrent,
						departmentIdFull: this.form.departmentIdFull,
						departmentNameFull: this.form.departmentNameFull
					}
					// console.log(data);return false;
					this.$router.push({
						name: '平台系统管理组织架构新增',
						params: {
							pageType: '添加',
							treeData: JSON.stringify(data)
						}
					}); // actOrganizational
				} else {
					this.$message.warning('请选择节点');
				}
			},
			// 删除
			deleteOrganization() {
				// if(!this.isLeaf) {
				//   this.$message("该节点不是子节点，确认要删除吗");
				// }      
				let that = this;
				let id = this.form.id;
				//				console.log(id)
				if(id.length > 0) {
					this.$confirm('您确定要删除吗, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							"userId": that.userInfo.userCode,
							"id": that.form.id, // 记录ID
							"parentIdFull": that.form.parentIdFull, // 父级完全节点ID
							"departmentIdFull": that.form.departmentIdFull, // 部门完全节点ID
							"departmentNameFull": that.form.nameCurrent // 部门完全节点名称
						}
						//						console.log(data)
						deleteContOrgInfo(data)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data));
								//								console.log(data, '删除')
								if(data.messageType == 'SUCCESS') {
									that.$message.success(data.messageContent);
									that.$router.push({
										name: '平台系统管理组织架构新增',
										params: {
											type: '1'
										}
									});
								} else {
									that.$message.warning(data.messageContent);
								}
							})
							.catch(function(err) {
								// console.log(err)
							})
					}).catch(() => {});
				} else {
					this.$message.warning('请选择节点');
				}
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.departmentIdFull);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.departmentIdFull);
			},
			// 显示表格数据
			showTable(page, limit, id) {
				if(this.roleBtn.selectContOrgInfo) {
					let that = this;
					if(!id) {
						return false;
					}
					let data = {
						"userId": this.userInfo.userCode,
						"page": page, //可为空
						"limit": limit, //可为空
						"departmentId": id
					}
					this.tableLoading = true;
					//					console.log(data)
					showUserInfoByDepartmentId(data)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								count = data.count,
								msg = data.data;
							// if(data.code == 0) {
							this.count = count;
							let tableData = [];
							msg.forEach((val, index) => {
								tableData.push({
									account: val.userId,
									name: val.realName,
									group: val.userGroupName,
									department: val.departmentName,
									role: val.userRoleName,
									status: val.status
								});
							});

							this.tableData = tableData;
							this.tableLoading = false;
							// }else {
							//   that.$message.warning(data.returnMsg);
							//   this.tableLoading = false;
							// }
						})
						.catch((err) => {
							// console.log(err);
						});
				}

			}
		},
		computed: {
			// 计算属性
			getFormData() {
				return this.$route.params.formData;
			},
			getPageType() {
				return this.$route.params.pageType;
			},
			...mapGetters([
				'userInfo',
			])
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-main {
		overflow: hidden;
	}
	
	.el-card {
		width: 100%;
	}
	
	.content {
		display: flex;
	}
	
	.main-row {
		// padding-top: 40px;
	}
</style>