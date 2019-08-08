// 邀请有礼 - 邀请有礼
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addInviteSetInfo || roleBtn.selectInviteSetInfo">
				<!-- 功能按钮 -->
				<el-button type="primary" @click="handleAdd" v-if="roleBtn.addInviteSetInfo">新建活动</el-button>

				<!-- 查询功能 -->
				<el-form :inline="true" :model="form" class="floatRight" v-if="roleBtn.selectInviteSetInfo">
					<el-form-item label="">
						<el-input v-model="form.searchContent" placeholder="请输入活动名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<!-- 表格 -->
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="activityName" label="活动名称"></el-table-column>
					<el-table-column prop="createdOn" label="创建时间"></el-table-column>
					<el-table-column prop="activityDate" label="活动时间">
						<template slot-scope="scope">
							<span>{{scope.row.activityDate.value == '短期' ? `${scope.row.activityDate.short[0]} 至 ${scope.row.activityDate.short[1]}` : '长期'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="flag1" label="邀请人奖励">
						<template slot-scope="scope">
							{{scope.row.flag1}}
						</template>
					</el-table-column>
					<el-table-column prop="flag2" label="被邀请人奖励">
						<template slot-scope="scope">
							{{scope.row.flag2}}
						</template>
					</el-table-column>
					<el-table-column prop="activityStatus" label="状态">
						<template slot-scope="scope">
							{{scope.row.activityStatus}}
						</template>
					</el-table-column>
					<el-table-column prop="action" width="110" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit && roleBtn.updateInviteSetInfo">
								<!-- 修改 -->
								<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="启用" placement="top" v-if="scope.row.activityStatus == '禁止' && roleBtn.enableInviteSetInfo">
								<!-- 启用 -->
								<i class="iconfont icon-shezhiqiyong" @click.prevent="iconChangeStatus(scope.$index, tableData)" ></i>
								<!-- <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconChangeStatus(scope.$index, tableData)" /> -->
							</el-tooltip>
							<el-tooltip class="item" content="禁用" placement="top" v-if="scope.row.activityStatus == '启用' && roleBtn.disableInviteSetInfo">
								<!-- 禁用 -->
								<i class="iconfont icon-forbidden" @click.prevent="iconChangeStatus(scope.$index, tableData)" ></i>
								<!-- <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconChangeStatus(scope.$index, tableData) " /> -->
							</el-tooltip>
							<el-tooltip class="item" content="查看邀请记录" placement="top">
								<!-- 查看 -->
								<i class="iconfont icon-view" @click.prevent="handleShowInfo(scope.$index, scope.row)" ></i>
								<!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="handleShowInfo(scope.$index, scope.row)" /> -->
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
	//        显示表格数据                          编辑表格数据                        
	// import { selectCommonManage, addCommonManage,setCommonManage,deleteCommonManage, showDownSelect } from '@/api/platform/commonManage'
	import { permission } from '@/utils'
	import { inviteGiftShow, inviteGiftChangeStatus } from '@/api/mobile/inviteGift'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleBtn: {
					selectInviteSetInfo: false,
					addInviteSetInfo: false,
					updateInviteSetInfo: false,
					enableInviteSetInfo: false,
					disableInviteSetInfo: false
				},
				// 搜索数据
				form: {
					searchContent: '',
					selected: ''
				},
				selectOptions: [{
						value: '品牌1',
						label: '品牌1'
					},
					{
						value: '品牌2',
						label: '品牌2'
					}
				],
				// table数据
				tableData: [],
				// 表格是否为加载状态
				tableLoading: false,

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(this.page, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 显示表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"activityName": this.form.searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				inviteGiftShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
//						console.log(JSON.stringify(msg));
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.count = count;
						that.tableData = result;
						that.tableLoading = false;
					})
					.catch((err) => {
						that.tableLoading = false;
					});
			},

			// 搜索数据
			handleSearch() {
				 this.showTable(this.page, this.limits);
			},
			// 按钮 - 添加
			handleAdd() {
				this.$router.push({
					name: '页面设置邀请有礼新建活动',
					params: {
						pageType: '新增'
					}
				});
			},

			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				// this.$router.push({
				//     name: '常量管理查询',
				//     params: {
				//         pageType: '查看',
				//         formData: data
				//     }
				// });
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '页面设置邀请有礼新建活动',
					params: {
						pageType: '修改',
						formData: data
					}
				});

			},
			// 修改状态 - 图标
			iconChangeStatus(index, row) {
				let params = {
					"userId": this.userInfo.userCode,
					"id": row[index].id,
					"activityStatus": row[index].activityStatus == '启用' ? '禁止' : '启用',
					"version": row[index].version
				}
				this.tableLoading = true;
				inviteGiftChangeStatus(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.showTable(this.page, this.limit);
							this.tableLoading = false;
						} else {
							this.$message.error(msg);
							this.showTable(this.page, this.limit);
							this.tableLoading = false;
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleShowInfo(index,row) { // 查看邀请记录
				var data = JSON.stringify(row);
				this.$router.push({
					name: '页面设置邀请有礼查看邀请记录',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			}

		},
		created() {
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, this.form.searchContent);

			sessionStorage.removeItem('inviterAwardSetRuleSet');
			sessionStorage.removeItem('invitedAwardSetRuleSet');
			sessionStorage.removeItem('inviteGiftAdd');
		},
		computed: {
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
	
	.el-form {
		display: inline-block;
		height: 30px;
		padding-top: 0;
	}
</style>