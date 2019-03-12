<!--优惠券-优惠券模板-->
<template>
    <el-container class="app-container" >
        <el-header v-if="roleBtn.addCouponTemplateInfo">
            <el-card>
                <el-button type="primary" @click="addStore">新增券模板</el-button>
            </el-card>
        </el-header>
        <el-main>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="coupTempId" label="模板ID"></el-table-column>
                    <el-table-column prop="couponType" label="券类型"></el-table-column>
                    <el-table-column prop="coupTempName" label="优惠券模板"></el-table-column>
                    <el-table-column prop="createdBy" label="创建人"></el-table-column>
                    <el-table-column prop="createdOn" label="创建时间"></el-table-column>
                    <el-table-column prop="action" label="操作" v-if="roleBtn.deleteCouponTemplateInfo">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <el-tooltip class="item" content="删除" placement="top">
                                <!-- 删除 -->
                                <i class="iconfont icon-view" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
                                <!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                            
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-footer v-if="count != 0">
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
	import { selectCouponTemplate , addCouponTemplate,deleteCouponTemplate} from '@/api/member/couponTemplate'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				// 表格数据
				tableData: [],
//				{
//					"coupTempId": "",
//					"couponType": "",
//					"coupTempName": "",
//					"createdBy": "",
//					"createdOn": ""
//				}
				// 权限
				roleBtn: {
					"addCouponTemplateInfo":false,
	            	"deleteCouponTemplateInfo":false
				},
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
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			//请求表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					page: start,
					limit: limit
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(params)
				selectCouponTemplate(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data)
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
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
			//	删除图标
			iconShanchu(index, row) {
				// console.log(index);
				var that = this;
				this.tableLoading = true;
	            this.$confirm('您确定要删除吗, 是否继续?', '提示', {
	            	confirmButtonText: '确定',
	            	cancelButtonText: '取消',
	            	type: 'warning'
	            }).then(() => {
					var param = {
						"userId": this.userInfo.userCode,
						"id": row.id
					}
					deleteCouponTemplate(param)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.tableLoading = false;
								that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit);
							} else {
								that.tableLoading = false;
								that.$message.warning(data.messageContent);
							}
						})
						.catch((err) => {
							that.tableLoading = false;
							that.$message.error('系统错误！');
							// console.log(err);
						});
	            }).catch(() => {
					that.tableLoading = false;
	            });
			},
			// 添加表格数据
			addStore() {
				this.$router.push({
					name: '优惠券优惠券模板添加',
					params: {
						pageType: '添加',
						brandName: this.brandName,
						pageTypes: this.pageTypeOther
					}
				});
			},
		},
		created() {
			this.showTable(this.page, this.limit);
			// 钩子函数 -- 初始化
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// console.log(JSON.stringify(this.roleBtn))
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

.el-form {
	display: inline-block;
	position: absolute;
	margin-left: rem(20px);
}</style>