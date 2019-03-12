<!--品牌管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addBrandInfo || roleBtn.selectBrandInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectBrandInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="addTable" v-if="roleBtn.addBrandInfo">新增</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="">
							<el-input v-model="form.searchContent" placeholder="请输入品牌编码或名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="brandId" label="品牌编码"></el-table-column>
					<el-table-column prop="brandName" label="品牌名称"></el-table-column>
					<el-table-column prop="brandLogo" label="品牌Logo">
						<template slot-scope="scope">
							<div class="page"><img :src="scope.row.brandLogo" /></div>
						</template>
					</el-table-column>
					<el-table-column prop="brandDesc" label="品牌描述"></el-table-column>
					<el-table-column prop="publicNumberName" label="绑定公众号昵称"></el-table-column>
					<!-- <el-table-column prop="integralRuleName" label="所属积分规则"></el-table-column> -->
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateBrandInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.updateBrandInfo && scope.row.isEdit">
								<!-- 确认 -->
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteBrandInfo">
								<!-- 删除 -->
								<i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" /> -->
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background  class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { selectBrandInfo, addBrandInfo, setBrandInfo, deleteBrandInfo } from '@/api/base/brandInfo'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectBrandInfo: false,
					addBrandInfo: false,
					updateBrandInfo: false,
					deleteBrandInfo: false
				},
				// 搜索数据
				form: {
					searchContent: '', // 品牌编码
				},
				// 表格数据
				tableData: [],
				//          {
				//              brandId: '', // 品牌编码
				//              brandName: '', // 品牌名称
				//              brandLogo: '', // 品牌Logo
				//              brandDesc: '', // 品牌描述
				//              publicNumberName: ''  // 绑定公众号昵称
				//              // integralRuleName: ''
				//          }
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
			//重置
			onReset() {
				this.form = {
					searchContent: '' // 品牌编码
				};
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form.searchContent);
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit, this.form.searchContent);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchContent);
			},
			//查询表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(params)
				selectBrandInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);return false;
						//               	  console.log(JSON.stringify(data)+"返回值");
						let result = [];
						if(data.data) {
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						} else if(data.messageType != "SUCCESS") {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						that.tableLoading = false;
					});
			},
			// 添加请求后台
			//      handleAddSellerInfo(formData) {
			//          // console.log(JSON.stringify(formData));return false;
			//          let that = this;
			//          this.tableLoading = true;
			//          addBrandInfo(formData)
			//              .then((res) => {
			//               let data = JSON.parse(Base64.decode(res.data));
			//					// let data = res.data;
			//					// console.log(data); return false;
			//					if(data.messageType == 'SUCCESS') {
			//                      that.$message.success(data.messageContent);
			//			            that.$route.params.pageType = '';
			//			        	that.getPageType='';
			//			        	that.showTable(this.page, this.limit, this.form.searchContent);
			//                  }else {
			//			            that.$router.push({
			//			                name: '品牌信息新增'
			//			            })
			//                      that.$message.error(data.messageContent);
			//                  }
			//              })
			//              .catch((err) => {
			//                  console.log(err);
			//              });
			//          this.tableLoading = false;
			//      },
			// 修改请求后台
			//      handleUpdateSellerInfo(formData) {
			//          // console.log(formData)
			//          let that = this;
			//          this.tableLoading = true;
			//          // console.log(formData);
			//          setBrandInfo(formData)
			//              .then((res) => {
			//                  let data = JSON.parse(Base64.decode(res.data));
			//                  console.log(data)
			//					if(data.messageType == 'SUCCESS') {
			//                      that.$message.success(data.messageContent);
			//			            that.$route.params.pageType = '';
			//			        	that.getPageType='';
			//			        	that.showTable(this.page, this.limit, this.form.searchContent);
			//                  }else {
			//			            that.$router.push({
			//			                name: '品牌信息修改'
			//			            })
			//                      that.$message.error(data.messageContent);
			//                  }
			//              })
			//              .catch((err) => {
			//                  console.log(err);
			//              });
			//          that.tableLoading = false;
			//      },
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '品牌信息查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '品牌信息修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				var that = this;
				this.tableLoading = true;
				// console.log(JSON.stringify(row));
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"params": row.id
					}
					//	            console.log(param)
					deleteBrandInfo(param)
						.then((res) => {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit, that.form.searchContent);
							} else {
								that.$message.error(data.messageContent);
								that.tableLoading = false;
							}
						})
						.catch((err) => {
							that.tableLoading = false;
//							console.log(err);
						});
				}).catch(() => {
					that.tableLoading = false;
				});
			},
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '品牌信息新增',
					params: {
						pageType: '添加'
					}
				});
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit, this.form.searchContent);
			// 钩子函数 -- 初始化

			let that = this;
			let formData;
			let data;
			if(this.getPageType) {
				formData = JSON.parse(this.getFormData);
				data = {
					"userId": this.userInfo.userCode,
					...formData
				}
			}
			if(this.getPageType == "添加") {
				this.handleAddSellerInfo(data);
			} else if(this.getPageType == '修改') {
				this.handleUpdateSellerInfo(data);
			}
		},
		computed: {
			//计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			//添加或修改返回的值
			getFormData() {
				return this.$route.params.formData;
			},
			//添加或修改返回的类型
			getPageType() {
				return this.$route.params.pageType;
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
		display: unset;
		// position: absolute;
		.el-form-item {
			margin-bottom: 10px;
		}
	}
	
	.page {
		width:40px;
		height:40px
	}
	
	.page img {
		width:40px;
		height:40px
	}
</style>