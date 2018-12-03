<!--优惠券-优惠券礼包-->
<template>
    <el-container class="app-container" >
        <el-header>
            <el-card class="height54 overHidden">
                 <el-form :inline="true" :model="form">
                    <el-form-item class="floatLeft">
                 		<el-button type="primary" @click="addStore" v-if="roleBtn.addCouponPackageInfo">新增优惠券礼包</el-button>
                    </el-form-item>
               		<div class="floatRight">
               			<el-form-item>
	                        <el-input v-model="form.searchContent" placeholder="请输入优惠券包名称"></el-input>
	                    </el-form-item>
	                    <el-form-item>
	                        <el-button type="primary" @click="onSubmit">查询</el-button>
							<!--<el-button type="primary" @click="onReset">重置</el-button>-->
	                    </el-form-item>
               		</div>
                </el-form>
            </el-card>
        </el-header>
        <el-main>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="coupPackName" label="券包名称"></el-table-column>
                    <el-table-column prop="operateBy" label="创建人"></el-table-column>
                    <el-table-column prop="operateOn" label="创建时间"></el-table-column>
                    <el-table-column prop="coupStatus" label="状态"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <el-tooltip class="item" content="查看" placement="top">
                                <!-- 查看 -->
                                <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)"/>
                            </el-tooltip>
                            <el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit&&roleBtn.updateCouponPackageInfo">
                                <!-- 修改 -->
                                <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)"/>
                            </el-tooltip>
                            <el-tooltip class="item" content="确认" placement="top" v-else>
                                <!-- 确认 -->
                                <icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)"/>
                            </el-tooltip>
                            <!-- 启用 -->
                            <el-tooltip class="item" content="启用" placement="top" v-if="scope.row.coupStatus != '已生效'&&roleBtn.enableCouponPackageInfo">
                     	    	<icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, tableData)"/>
                            </el-tooltip>
                            <!-- 禁用 -->
                            <el-tooltip class="item" content="禁用 " placement="top" v-if="scope.row.coupStatus == '已生效'&&roleBtn.disableCouponPackageInfo">
                            	<icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, tableData)"/>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-footer  v-if="count != 0">
                    <el-pagination 
                        background 
                        class="pagination" 
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" 
                        :page-size="limit"
                        :total="count" 
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </el-footer>
            </el-card>
        </el-main>
  </el-container>
</template>
<script>
	import { selectCouponPackage,couponPackageBegin,couponLibraryStop} from '@/api/member/couponPackage'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					searchContent: '' // 
				},
				// 权限
				roleBtn: {
		            "addCouponPackageInfo":false,
		            "updateCouponPackageInfo":false,
		            "enableCouponPackageInfo":false,
		            "disableCouponPackageInfo":false
				},
				// 表格数据
				tableData: [],
//				{
//					"coupPackName": "",  //券包名称
//					"operateBy": "",    //创建人
//					"operateOn": "",    //创建时间
//					"coupStatus": ""    //状态
//				}
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
	
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			onReset(){
				this.form.searchContent='';
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
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit, this.form.searchContent);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form.searchContent);
			},
			//请求表格数据
			showTable(start, limit, searchContent) {
				let that = this;
				let params = {
					userId :this.userInfo.userCode,
					page: start,
					limit: limit,
					coupPackName: searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectCouponPackage(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = that.count;
							that.tableData = result;
						}else if(data.messageType != 'SUCCESS') {
	                        that.$message.warning(data.messageContent);
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			iconQiyong(index,row){
	            let that = this;
				this.tableLoading = true;
	            this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            let data = {
		                "userId": this.userInfo.userCode,
		                "id" : row[index].id,
		                "version" : row[index].version
		            }
		            // 停用接口
		            // console.log(data)
		            couponPackageBegin(data)
		                .then((res) => {
		                    let data = JSON.parse(Base64.decode(res.data));
		                    // console.log(data);
							if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
								that.tableLoading = false;
								that.showTable(this.page, this.limit, this.form.searchContent);
		                    }else {
								that.tableLoading = false;
		                        that.$message.warning(data.messageContent);
		                    }
		                })
		                .catch((err) => {
		                    // console.log(err);
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
			},
			iconTingzhi(index,row){
	            let that = this;
				this.tableLoading = true;
	            this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            let data = {
		                "userId": this.userInfo.userCode,
		                "id" : row[index].id,
		                "version" : row[index].version
		            }
		            // 停用接口
		            couponLibraryStop(data)
		                .then((res) => {
		                    let data = JSON.parse(Base64.decode(res.data));
		                    // console.log(data);
							if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.form.searchContent);
								that.tableLoading = false;
		                    }else {
		                        that.$message.warning(data.messageContent);
								that.tableLoading = false;
		                    }
		                })
		                .catch((err) => {
							that.tableLoading = false;
		                    // console.log(err);
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
			},
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '优惠券优惠券礼包查询',
					params: {
						pageType: '查看',
						brandName: this.brandName,
						pageTypes: this.pageTypeOther,
						formData: data
					}
				});
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '优惠券优惠券礼包修改',
					params: {
						pageType: '修改',
						formData: data
					}
				});
			},
			//	删除图标
			iconShanchu(index, row) {
				// console.log(index);
				var that = this;
	            this.$confirm('您确定要删除吗, 是否继续?', '提示', {
	            	confirmButtonText: '确定',
	            	cancelButtonText: '取消',
	            	type: 'warning'
	            }).then(() => {
					var param = {
						"userCode": this.userInfo.userCode,
						"userType": this.userInfo.userType,
						"id": row.id
					}
					that.tableLoading = true;
					deleteCouponTemplate(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data.data));
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit, that.form);
							} else {
								that.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							that.$message.error('系统错误！');
							// console.log(err);
						});
					that.tableLoading = false;
	            }).catch(() => {
	            });
			},
			// 添加表格数据
			addStore() {
				this.$router.push({
					name: '优惠券优惠券礼包新建',
					params: {
						pageType: '添加'
					}
				});
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// console.log(JSON.stringify(this.roleBtn))
			this.showTable(this.page, this.limit, this.form.searchContent);
			// 钩子函数 -- 初始化
			let that = this;
	        let formData;
	        let data;
	        if(this.getFormData){
	            formData = JSON.parse(this.getFormData);
	        }
		},
		computed: {
			// 计算属性
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
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width: 100%;
}
.height54{
	height:54px
}
.el-form {
	display: unset;
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>