<!--店铺信息-导入信息-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack">返回</el-button>
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="form.searchContent" placeholder="请输入门店编码或门店名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="storeGroupId" label="店组编码"></el-table-column>
					<el-table-column prop="storeGroupName" label="店组名称"></el-table-column>
					<el-table-column prop="storeQty" label="门店数量"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<el-tooltip class="item" content="查看" placement="top">
								<!-- 查看 -->
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)" />
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
	import { importStoreGroup } from '@/api/base/storeGroupManagement'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				form: {
					searchContent: ''
				},
				// 表格数据
				tableData: [],
				// 分页
				page: 0, // 当前页
				count: 0, // 总页数
				limit: this.GLOBAL.limit // 分页
				//				{
				//					brandName: '', //品牌名称
				//					storeId: '', //门店编码
				//					storeName: '', //门店名称		--------
				//					storeAliasName: '', //门店别名
				//					storeUrl: '', //门店照片url
				//					storeType: '', //门店分类	
				//					addr: '', //详细地址				---------
				//					storeManager: '', //负责人
				//					contactNumber1: '', //联系电话1		--------
				//					contactNumber2: '', //联系电话2
				//					storeArea: '', //门店面积
				//					storePerNumber: '', //门店人数
				//					businessTimeBegin: '', //起始时间
				//					businessTimeEnd: '', //结束时间
				//					storeDesc: '', //门店简介
				//					remarks: '', //备注
				//					label: '', //标签
				//					isChat: '',
				//					shelvesStatus: '' //上架状态
				//				}
			}
		},
		methods: {
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			onSubmit() {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				// 钩子函数 -- 初始化
				this.showTable('', this.limit, res);
			},
			// 分页
			handleCurrentChange(val) {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				//	            console.log(val);
				this.page = val;
				this.showTable(val, this.limit, res);
			},
			handleSizeChange(val) {
				let res = '';
				if(this.getFormData) {
					res = JSON.parse(this.getFormData);
				}
				this.limit = val;
				this.showTable(this.page, this.limit, res);
			},
			// 方法
			showTable(start, limit, res) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: this.form.searchContent,
					masterId: res.id
				}
				//				console.log(JSON.stringify(params) + "入参")
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				importStoreGroup(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data) + "返回值");
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.tableData = result;
						that.count = data.count;
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '数据导入店组信息查看详情',
					params: {
						pageTypeOther: '导入详情',
						pageType: '查看',
						formData: data,
						mainData: this.getFormData
					}
				});
			},
			handleBack() {
				this.$router.push({
					name: '店组信息'
				});
			},
		},
		created() {
			let res = '';
			if(this.getFormData) {
				res = JSON.parse(this.getFormData);
			}
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit, res);
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getFormData() {
				return this.$route.params.formData;
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		float: right;
	}
	
	.el-form-item--small.el-form-item {
		margin-bottom: 0px;
	}
	
	.el-input {
		width: 200px;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-button {
		float: left;
		margin: 0 0 10px 0;
	}
</style>