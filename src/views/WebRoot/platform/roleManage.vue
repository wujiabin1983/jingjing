<!--平台角色-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addUserRoleInfo || roleBtn.updateUserRoleInfo || roleBtn.selectUserRoleInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectUserRoleInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="addTable" v-if="roleBtn.addUserRoleInfo">添加</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="">
							<el-input v-model="form.roleInfo" placeholder="请输入角色名称或角色代码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
					<el-table-column prop="id" label="序号" type="index" width="50px"></el-table-column>
					<el-table-column prop="codeRole" label="角色代码"></el-table-column>
					<el-table-column prop="nameRole" label="角色名称">
						<template slot-scope="scope">
							<el-input v-if="scope.row.edit" v-model="scope.row.nameRole"></el-input>
							<span v-else>{{scope.row.nameRole}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="department" label="可查看部门">
						<template slot-scope="scope" >
	                    	<el-popover trigger="hover" placement="top">
					          <p> {{ scope.row.department }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.department }}</el-tag>
					          </div>
					        </el-popover>
			            </template>
					</el-table-column>
					<el-table-column prop="describe" label="描述"></el-table-column>
					<el-table-column prop="action" label="操作" v-if="roleBtn.updateUserRoleInfo || roleBtn.deleteUserRoleInfo">
						<template slot-scope="scope">
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateUserRoleInfo && !scope.row.edit">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 确认 -->
							<el-tooltip class="iconItem" content="确认" placement="top" v-if="roleBtn.updateUserRoleInfo && scope.row.edit">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, tableData)" />
							</el-tooltip>
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.deleteUserRoleInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconDeleteRow(scope.$index, tableData)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectUserRoleInfo, addUserRoleInfo, updateUserRoleInfo, deleteUserRoleInfo } from '@/api/platform/roleManage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectUserRoleInfo: false,
					addUserRoleInfo: false,
					updateUserRoleInfo: false,
					deleteUserRoleInfo: false
				},
				// 搜索数据
				form: {
					roleInfo: ''
				},
				tableLoading: false,
				tableData: [
					// {
					//     edit: false,
					//     id: '',
					//     select: '',
					//     codeRole: '角色代码',
					//     nameRole: '角色名称',
					//     department: '可查看部门',
					//     describe: '描述',
					//     action: '操作'
					// }
				],
				multipleSelection: [],
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			handleSelectionChange(val) {
				// 多选
				this.multipleSelection = val;
			},
			// 查询
			onSubmit() {
				this.showTable('', this.limit, this.form.roleInfo);
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form.roleInfo);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.roleInfo);
			},
			// 显示表格
			showTable(page, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					page: page,
					limit: limit,
					userRoleName: searchContent
				}
				// console.log(params);
				this.tableLoading = true;
				selectUserRoleInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						// console.log(count, msg);return false;
						// if(data.returnCode == 0) {
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								edit: false,
								// id: val.id,
								...val,
								codeRole: val.userRoleId,
								nameRole: val.userRoleName,
								department: val.departmentListDesc,
								describe: val.userRoleDesc,
								sellerNameList: val.sellerNameList,
							});
						})
						that.count = count;
						that.tableData = result;
						// }else {
						//     that.$message.error(data.returnMsg);
						// }
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						this.tableLoading = false;
					});
			},
			// 修改
			iconXiugai(index, table) {
				// 改变状态，显示确认按钮
				// table[index].edit = true;
				// console.log(table);
				// console.log(JSON.stringify(table[index]));return false;
				let data = table[index];
				let params = {
					userRoleId: data.userRoleId,
					userRoleName: data.userRoleName,
					department: data.department,
					commercial: data.commercial,
					describe: data.describe,
					departmentListCode: data.departmentListCode,
					departmentListDesc: data.departmentListDesc,
					"sellerIdList": data.sellerIdList,
					"sellerNameList": data.sellerNameList,
					version: data.version,
					id: data.id,
				}
				this.$router.push({
					name: '平台系统管理角色管理修改',
					params: {
						'formData': JSON.stringify(params),
						'pageType': '修改'
					}
				});
			},
			// 确认
			iconQueren(index, table) {
				table[index].edit = false;
			},
			// 删除
			iconDeleteRow(index, table) {
				// this.tableData.splice(index, 1);
				this.tableLoading = true;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"params": table[index].id
					}
					//	            console.log(params);
					deleteUserRoleInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// count = data.count,
							// msg = data.data;

							// console.log(data)
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.tableLoading = false;
								this.showTable(this.page, this.limit, this.form.roleInfo);
							} else {
								this.$message.warning(msg);
								this.tableLoading = false;
							}
						})
						.catch((err) => {
								this.tableLoading = false;
							// console.log(err);
						});
				}).catch(() => {
					this.tableLoading = false;
				});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '平台系统管理角色管理新增',
					params: {
						'pageType': '添加'
					}
				});
			},
			deleteTable() {
				if(this.multipleSelection.length == 0) {
					this.$message.warning('请选择要删除的数据');
				}
				var idArray = '';
				this.multipleSelection.forEach((data, index) => {
					idArray += data.id + ",";
				})
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"userId": this.userInfo.userCode,
						"params": idArray
					}
					//	            console.log(params);
					deleteUserRoleInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// count = data.count,
							// msg = data.data;

							// console.log(data)
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.showTable(this.page, this.limit, this.form.roleInfo);
							} else {
								this.$message.error(msg);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			},
		},
		created() {
			this.roleBtn = permission(this.roleBtn);
			let that = this;
			//      if(this.getPageType == "添加") {
			//          let params = JSON.parse(this.getFormData);
			//          addUserRoleInfo(params)
			//              .then((res) => {
			//                  // console.log(res);return false;
			//                  let data = JSON.parse(Base64.decode(res.data)),
			//                      code = data.messageType,
			//                      msg = data.messageContent;
			//                      // count = data.count,
			//                      // msg = data.data;
			//                  if(code == 'SUCCESS') {
			//                      that.$message.success(msg);
			//                      that.showTable(that.page, that.limit, that.form.roleInfo);
			//                  }else {
			//                      that.$message.error(msg);
			////                      that.showTable(that.page, that.limit, that.form.roleInfo);
			//                  }
			//              })
			//              .catch((err) => {
			//                  // console.log(err);
			//              });
			//      }
			//      if(this.getPageType == "修改") {
			//          let params = JSON.parse(this.getFormData);
			//          // console.log(params);return false;
			//          updateUserRoleInfo(params)
			//              .then((res) => {
			//                  let data = JSON.parse(Base64.decode(res.data)),
			//                      code = data.messageType,
			//                      msg = data.messageContent;
			//                      // count = data.count,
			//                      // msg = data.data;
			//                  // console.log(data, code, msg);
			//                  if(code == 'SUCCESS') {
			//                      that.$message.success(msg);
			////                      that.showTable(that.page, that.limit, that.form.roleInfo);
			//                  }else {
			//                      that.$message.error(msg);
			////                      that.showTable(that.page, that.limit, that.form.roleInfo);
			//                  }
			//              })
			//              .catch((err) => {
			//                  // console.log(err);
			//              });
			//      }
			this.showTable(this.page, this.limit, this.form.roleInfo);
		},
		computed: {
			getFormData() {
				let data = this.$route.params.formData;
				this.$route.params.formData = '';
				return data;
			},
			getPageType() {
				let data = this.$route.params.pageType;
				this.$route.params.pageType = '';
				return data;
			},
			...mapGetters([
				'userInfo',
			])
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: unset;
		.el-form-item {
			margin-bottom: 10px;
			.el-input{
				width: 220px;
			}
		}
	}
	
	.el-main {
		overflow: hidden;
	}
</style>