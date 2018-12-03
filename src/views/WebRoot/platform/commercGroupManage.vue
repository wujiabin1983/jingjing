// 商户组管理
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addSellerUserGroupInfo || roleBtn.deleteSellerUserGroupInfo || roleBtn.selectSellerUserGroupInfo">
				<el-form :inline="true" :model="formInline" class="demo-form-inline" v-if="roleBtn.selectSellerUserGroupInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="handleAdd" v-if="roleBtn.addSellerUserGroupInfo">添加</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="">
							<el-input v-model="formInline.searchInfo" placeholder="请输入用户组名称或用户组代码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<!-- 表格 -->
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">>
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="codeGroup" label="用户组代码"></el-table-column>
					<el-table-column prop="nameGroup" label="用户组名称">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.nameGroup" size="mini"></el-input>
							<span v-else>{{scope.row.nameGroup}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="描述">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.desc" size="mini"></el-input>
							<span v-else>{{scope.row.desc}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="byOwn" label="所属用户" v-if="roleBtn.selectSellerByGroupId">
						<template slot-scope="scope">
							<!-- 查看 -->
							<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
						</template>
					</el-table-column>
					<el-table-column prop="action" label="操作" v-if="roleBtn.updateSellerUserGroupInfo || roleBtn.deleteSellerUserGroupInfo">
						<template slot-scope="scope">
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateSellerUserGroupInfo && !scope.row.isEdit">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 确认 -->
							<!--<el-tooltip class="iconItem" content="确认" placement="top" v-if="roleBtn.updateSellerUserGroupInfo && scope.row.isEdit">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>-->
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.deleteSellerUserGroupInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
							</el-tooltip>
                            <el-tooltip class="item" content="设置权限" placement="top">
								<!-- 设置权限 -->
								<icon-svg icon-class="rule" id="icon-rule" @click.native.prevent="iconSetRole(scope.$index, scope.row)" />
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
	// axios
	import { permission } from '@/utils'
	import { selectSellerUserGroupInfo, addSellerUserGroupInfo, updateSellerUserGroupInfo, deleteSellerUserGroupInfo, uploadImgInfo } from '@/api/platform/commercGroupManage'
	// vuex
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectSellerUserGroupInfo: false,
					addSellerUserGroupInfo: false,
					updateSellerUserGroupInfo: false,
					deleteSellerUserGroupInfo: false,
					selectSellerByGroupId: false
				},
				// 数据
				formInline: {
					searchInfo: ''
				},
				// 表格数据
				tableData: [
					// {
					//     isEdit: false,

					//     codeGroup: val.userGroupId,
					//     nameGroup: val.userGroupName,
					//     desc: val.userGroupDesc
					// }
				],
				// 表格加载loading
				tableLoading: false,
				// 表格多选
				multipleSelection: [],

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(val);
			},
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.formInline.searchInfo);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.formInline.searchInfo);
			},
			// 搜索
			handleSearch() {
				let data = this.formInline.searchInfo
				this.showTable('', this.limit, this.formInline.searchInfo);
			},
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.formInline.roleInfo;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: searchContent
				}
				this.tableLoading = true;
				selectSellerUserGroupInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						// if(data.returnCode == 0) {
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								isEdit: false,

								codeGroup: val.userGroupId,
								nameGroup: val.userGroupName,
								desc: val.userGroupDesc,
								...val
							});
						})
						that.count = count;
						that.tableData = result;
						that.tableLoading = false;
						// }else {
						//     that.$message.error(data.returnMsg);
						// }
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			addTable() {

			},
			// 功能图标 - 查看
			iconChakan(index, row) {
				this.$router.push({
					name: '商户管理商户用户组管理所属用户',
					params: {
						formData: JSON.stringify(row)
					}
				});
			},
			// 功能图标 - 修改
			iconXiugai(index, row) {
				this.$router.push({
					name: '商户管理商户组管理修改',
					params: {
						pageType: '修改',
						data:JSON.stringify(row)
					}
				})
			},
			// 功能图标 - 确认
//			iconQueren(index, row) {
//				row.isEdit = false;
//				let params = {
//					"userId": this.userInfo.userCode,
//					"userGroupId": row.codeGroup,
//					"userGroupName": row.nameGroup,
//					"userGroupDesc": row.desc,
//					"id": row.id,
//					"version": row.version
//				}
//				updateSellerUserGroupInfo(params)
//					.then((res) => {
//						// console.log(res)
//						let data = JSON.parse(Base64.decode(res.data));
//						if(data.messageType == 'SUCCESS') {
//							this.showTable(this.page, this.limit, this.formInline.searchInfo);
//							this.$message.success(data.messageContent);
//						} else {
//							this.$message.error(data.messageContent);
//						}
//					})
//					.catch((err) => {
//						// console.log(err);
//					});
//			},
			// 功能按钮 - 删除
			handleDeleteSellerUserGroupInfo() {
				let that = this;
				if(this.multipleSelection.length == 0) {
					this.$message.warning('请选择数据');
					return false;
				}
				let ids = '';
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach((val, index) => {
						ids += val.id + ',';
					});
					let params = {
						"userId": this.userInfo.userCode,
						"params": ids
					}
					this.tableLoading = true;
					// console.log(params);
					deleteSellerUserGroupInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							// console.log(data);
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.formInline.searchInfo);
							} else {
								that.$message.error(data.messageContent);
								that.showTable(that.page, that.limit, that.formInline.searchInfo);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}).catch(() => {});
			},
			// 功能图标 - 删除
			iconShanchu(index, row) {
				let that = this;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.tableLoading=true;
					let params = {
						"userId": this.userInfo.userCode,
						"params": row.id
					}
					// console.log(params);
					deleteSellerUserGroupInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//	                    console.log(data)
							if(data.messageType == 'SUCCESS') {
								that.tableLoading=false;
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.formInline.searchInfo);
							} else {
								that.$message.warning(data.messageContent);
								that.tableLoading=false;
								that.showTable(that.page, that.limit, that.formInline.searchInfo);
							}
						})
						.catch((err) => {
							that.tableLoading=false;
							// console.log(err);
						});
				}).catch(() => {
					that.tableLoading=false;
				});
			},
            iconSetRole(index, row) {
//              console.log(row, 'row')
                this.$router.push({
					name: '商户管理商户组管理设置',
					params: {
						pageType: '设置',
						id: row.userGroupId,
						name: row.userGroupName
					}
				});
            },
			// 功能按钮 - 添加
			handleAdd() {
				this.$router.push({
					name: '商户管理商户组管理新增',
					params: {
						pageType: '添加'
					}
				})
			},
			// 添加 - 操作
			//      handleAddSellerUserGroupInfo(res) {
			//          let params = {
			//              "userId" : this.userInfo.userCode,
			//              "userGroupId": res.codeGroup,
			//              "userGroupName": res.nameGroup,
			//              "userGroupDesc": res.desc,
			//              "sellerId": res.sellerId,
			//              "sellerMan": res.sellerMan
			//          }
			//          addSellerUserGroupInfo(params)
			//              .then((res) => {
			//                  // console.log(res)
			//                  let data = JSON.parse(Base64.decode(res.data.data));
			//					if(data.messageType == 'SUCCESS') {
			//                      this.$message.success(data.messageContent);
			//                      this.showTable(this.page, this.limit, this.formInline.searchInfo);
			//                  }else {
			//                      this.$message.error(data.messageContent);
			//                  }
			//              })
			//              .catch((err) => {
			//                  console.log(err);
			//              });
			//      }
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			//      let that = this;
			//      let data = this.getFormData;
			//      if(data) {
			//          let res = JSON.parse(data);
			//          let params = {
			//              userCode: this.userInfo.userCode,
			//              userType: this.userInfo.userType,
			//              codeGroup: res.codeGroup,
			//              nameGroup: res.nameGroup,
			//              desc: res.desc,
			//              sellerId: res.sellerId,
			//              sellerMan: res.sellerMan
			//          }
			//          this.handleAddSellerUserGroupInfo(params);
			//      }
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, this.formInline.searchInfo);
		},
		computed: {
			// 计算属性
			getFormData() {
				let formData = this.$route.params.formData;
				this.$route.params.formData = '';
				return formData;
			},
			// 获取用户信息
			...mapGetters([
				'userInfo',
			])
		}
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
</style>
