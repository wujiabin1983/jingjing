<!--会员分组 - 所有分组 - 查看会员列表- 营销活动-->
<template>
    <el-container class="app-container" >
        <el-header>
            <el-card>
                <el-button type="primary" @click="addStore">新增营销活动</el-button>
            </el-card>
        </el-header>
        <el-main>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="coupTempId" label="会员分组类型"></el-table-column>
                    <el-table-column prop="couponType" label="会员分组名称"></el-table-column>
                    <el-table-column prop="coupTempName" label="关联营销活动类型"></el-table-column>
                    <el-table-column prop="createdBy" label="关联营销活动名称"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <el-tooltip class="item" content="查看" placement="top">
                                <!-- 查看 -->
                                <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChaKan(scope.$index, scope.row)"/>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-footer v-if="count != 0">
                    <el-pagination 
                        background 
                        class="pagination" 
                         
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
	export default {
		data() {
			return {
				// 表格数据
				tableData: [{
					"coupTempId": "",
					"couponType": "",
					"coupTempName": "",
					"createdBy": "",
					"createdOn": ""
				}],
				
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
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.count = data.count;
						that.tableData = result;
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			iconChaKan(){
				
			},
			// 添加表格数据
			addStore() {
				this.$router.push({
					name: '优惠券模板-添加',
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
	            this.$route.params.pageType = '';
	        	this.getPageType='';
	            this.handleAddSellerInfo(data);
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

.el-form {
	display: inline-block;
	position: absolute;
	margin-left: rem(20px);
}</style>