<!--优惠券-门店券库-->
<template>
    <el-container class="app-container" >
        <el-header>
            <el-card class="height54 overHidden">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                	<el-form-item class="floatLeft">
                	 	<el-button type="primary" @click="addStore" v-if="roleBtn.addStoreVoucherLibraryInfo">新增门店券</el-button>
                    </el-form-item>
                	<div class="floatRight">
                		<el-form-item label="状态">
	                        <el-select v-model="form.status" clearable placeholder="请选择状态">
	                        	<el-option label="全部" value=""></el-option>
	                            <el-option label="已生效" value="已生效"></el-option>
	                            <el-option label="已禁用" value="已禁用"></el-option>
	                        </el-select>
	                    </el-form-item>
	                    <el-form-item>
	                        <el-input v-model="form.storeLibName" placeholder="请输入门店券名称"></el-input>
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
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="storeLibId" label="门店券ID"></el-table-column>
                    <el-table-column prop="storeLibName" label="门店券名称"></el-table-column>
                    <el-table-column prop="enableBy" label="创建人"></el-table-column>
                    <el-table-column prop="enableDate" label="最后编辑时间"></el-table-column>
                    <el-table-column prop="status" label="状态"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                             <el-tooltip class="item" content="查看" placement="top">
                                <!-- 查看 -->
                                <i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
                                <!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                            <!-- 启用 -->
                            <el-tooltip class="item" content="启用" placement="top" v-if="scope.row.status != '已生效'&&roleBtn.enableStoreVoucherLibraryInfo">
                            	<i class="iconfont icon-shezhiqiyong" @click.prevent="iconQiyong(scope.$index, scope.row)" ></i>
                     	    	<!-- <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                            <!-- 停用 -->
                            <el-tooltip class="item" content="停用 " placement="top" v-if="scope.row.status == '已生效'&&roleBtn.disableStoreVoucherLibraryInfo">
                            	<i class="iconfont icon-forbidden" @click.prevent="iconTingzhi(scope.$index, scope.row)" ></i>
                            	<!-- <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, scope.row)"/> -->
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
	import { selectStoreVoucherLibrary , StoreVoucherLibraryYes,StoreVoucherLibraryNo} from '@/api/member/storeVoucherLibrary'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
				// 搜索数据
				form: {
					"storeLibName":"",
					"status":""
				},
				// 表格数据
				tableData: [],
				// 权限
				roleBtn: {
					"addStoreVoucherLibraryInfo":false,
		            "enableStoreVoucherLibraryInfo":false,
		            "disableStoreVoucherLibraryInfo":false
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
			onReset(){
				this.form={
					"storeLibName":"",
					"status":""
				};
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
				this.showTable('',this.limit);
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
				let data = this.form.roleInfo;
				let params = {
					"userId" : this.userInfo.userCode,
					"page":start,
					"limit":limit,
					"storeLibName":this.form.storeLibName,
					"status":this.form.status
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				// console.log(JSON.stringify(params))
				selectStoreVoucherLibrary(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								isEdit: false,
								...val
							});
						})
						that.tableData = result;
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			
			},
			//启用
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
		                "id" : row.id,
		                "version" : row.version
		            }
		            StoreVoucherLibraryYes(data)
		                .then((res) => {
		                    let data = JSON.parse(Base64.decode(res.data));
	//	                    console.log(data);
			        		if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit);
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
			//禁用
			iconTingzhi(index,row){
	            let that = this;
				this.tableLoading = true;
				this.$confirm('您确定要禁用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            let data = {
		                "userId": this.userInfo.userCode,
		                "id" : row.id,
		                "version" : row.version,
		            }
		            // 停用接口
		            StoreVoucherLibraryNo(data)
		                .then((res) => {
		                    let data = JSON.parse(Base64.decode(res.data));
	//	                    console.log(data);
			        		if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
								that.showTable(this.page, this.limit);
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
					name: '优惠券门店券库查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			
			// 添加表格数据
			addStore() {
				this.$router.push({
					name: '优惠券门店券库新建门店券',
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
			this.showTable(this.page,this.limit);
			// 钩子函数 -- 初始化
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