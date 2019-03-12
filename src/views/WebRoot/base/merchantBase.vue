<!--商品基本设置-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" class="demo-form-inline" v-if="roleBtn.addSellerBasicInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="addTable" v-if="roleBtn.addSellerBasicInfo">新增</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="memberSystemName" label="所属会员体系"></el-table-column>
					<el-table-column prop="integralValue" label="积分值"></el-table-column></el-table-column>
					<el-table-column prop="cashExchangeValue" label="现金兑换值"></el-table-column></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateSellerBasicInfo && !scope.row.isEdit">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteSellerBasicInfo">
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
	import { mapGetters } from 'vuex'
	import { selectMerChantBase,addMerChantBase,setMerChantBase,deleteMerChantBase } from '@/api/base/merchantBase'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectSellerBasicInfo: false,
					addSellerBasicInfo: false,
					updateSellerBasicInfo: false,
					deleteSellerBasicInfo: false
				},
				// 表格数据
				tableData: [],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
				// 表单
				tableLoading:false,
			}
		},
		methods: {
			// 添加表格数据
			addTable() {
				this.$router.push({
					name: '商户基本设置新增',
					params: {
						pageType: '添加'
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
					deleteMerChantBase(param)
						.then((res) => {
//							console.log(res);
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(that.page, that.limit);
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
			iconXiugai(index,row){
				var data = JSON.stringify(row);
				this.$router.push({
					name: '商户基本设置修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			iconChakan(index,row){
				var data = JSON.stringify(row);
				this.$router.push({
					name: '商户基本设置修改',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			//查询表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(params)
				selectMerChantBase(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
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
		},
		created() {
			// 权限
			this.showTable(this.page,this.limit);
			this.roleBtn = permission(this.roleBtn);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-form{
		height: 32px;
		overflow: hidden;
		padding: 0;
	}
	.el-input {
		width: rem(500px);
	}
	
	.el-textarea {
		width: rem(500px);
	}
</style>