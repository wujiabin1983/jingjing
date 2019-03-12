<!--扫码领券-->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item class="floatLeft">
                        <el-button type="primary" @click="shoppingGuide">新建活动</el-button>
                    </el-form-item>
                	<div class="floatRight">
                		<el-form-item label="状态">
	                        <el-select v-model="form.status" clearable placeholder="请选择状态">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option label="未开始" value="未开始"></el-option>
	                            <el-option label="进行中" value="进行中"></el-option>
	                            <el-option label="禁用" value="禁用"></el-option>
	                            <el-option label="已结束" value="已结束"></el-option>
	                        </el-select>
	                    </el-form-item>
	                    <el-form-item>
	                        <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
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
                <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="createdOn" label="创建时间"></el-table-column>
                    <el-table-column prop="activityName" label="活动名称"></el-table-column>
                    <el-table-column prop="" label="活动时间" width="280">
                    	<template slot-scope="scope">
                			{{scope.row.activiteDateBegin+" ~ "+scope.row.activiteDateEnd}}
                    	</template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态"></el-table-column>
                    <el-table-column prop="action" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <!-- 查看 -->
                            <el-tooltip class="item" content="查看" placement="top">
                            	<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
                                <!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                            <!-- 修改 -->
                            <el-tooltip class="item" content="修改" placement="top" v-if="scope.row.status!='已结束'">
                            	<i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
                                <!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                             <!-- 启用 -->
                            <el-tooltip class="item" content="启用" placement="top" v-if="scope.row.status != '进行中'&&scope.row.status!='已结束'">
                            	<i class="iconfont icon-shezhiqiyong" @click.prevent="iconQiyong(scope.$index, scope.row)" ></i>
                     	    	<!-- <icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                            <!-- 停用 -->
                            <el-tooltip class="item" content="停用 " placement="top" v-if="scope.row.status== '进行中'&&scope.row.status!='已结束'">
                            	<i class="iconfont icon-forbidden" @click.prevent="iconTingzhi(scope.$index, scope.row)" ></i>
                            	<!-- <icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                             <!-- 复制链接 -->
	                        <el-tooltip class="item" content="复制链接" placement="top" v-if="scope.row.status!='已结束'">
	                        	<i class="iconfont icon-copylink" @click.prevent="iconCopyTemplate(scope.$index, scope.row)" ></i>
	                            <!-- <icon-svg icon-class="copyLink" id="icon-copyLink" @click.native.prevent="iconCopyTemplate(scope.$index, scope.row)"/> -->
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
		    <el-dialog title="" :visible.sync="handleQrcode">
				<qrcode :qrcodeUrl="qrcodeUrl" ref="qrcode"></qrcode>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleQrcode = false">取 消</el-button>
				</div>
		    </el-dialog>
        </el-main>
  </el-container>
</template>
<script>import { selectScavengingVoucherData, scavengingVoucherBegin, scavengingVoucherStop, scavengingVoucherCopyLink } from '@/api/tool/scavengingVoucher'
import { mapGetters } from 'vuex'
import qrcode from '@/components/tool/qrcode'
export default {
	data() {
		return {
			handleQrcode: false,
			qrcodeUrl: 'http://www.baidu.com',
			// 搜索数据
			form: {
				activityName: '', // 活动标题
				status: ''
			},
			// 表格数据
			tableData: [],
			// 表格多选
			multipleSelection: [],
			// 表格是否为加载状态
			tableLoading: false,
			// 活动分页
			page: 0, // 当前页
			count: 0, // 总条数
			limit: this.GLOBAL.limit, // 条/页
		}
	},
	components: {
		qrcode
	},
	methods: {
		// 表格选择数据
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 活动列表分页
		handleCurrentChange(val) {
			this.page = val;
			this.showTable(val, this.limit);
		},
		handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit);
		},
		onSubmit() {
			this.showTable('', this.limit);
		},
		//添加
		shoppingGuide() {
			this.$router.push({
				name: '扫码领券新增',
				params: {
					pageType: '添加',
				}
			});
		},
		// 图标 - 修改
		iconXiugai(index, row) {
			var data = JSON.stringify(row);
			this.$router.push({
				name: '扫码领券修改',
				params: {
					pageType: '修改',
					formData: data
				}
			});
		},
		// 图标 - 查看
		iconChakan(index, row) {
			var data = JSON.stringify(row);
			this.$router.push({
				name: '扫码领券查询',
				params: {
					pageType: '查看',
					formData: data
				}
			});
		},
		showTable(start, limit) {
			// console.log(JSON.stringify(this.userInfo));
			let that = this;
			let data = this.form.roleInfo;
			let params = {
				userId: this.userInfo.userCode,
				page: start,
				limit: limit,
				activityName: this.form.activityName,
				status: this.form.status
			}
			// 使表格加载
			this.tableLoading = true;
			// 查询接口
			selectScavengingVoucherData(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					// console.log(JSON.stringify(data));
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
		//启用
		iconQiyong(index, row) {
			let that = this;
			that.tableLoading = true;
			this.$confirm('您确定要启用这条数据吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					"userId": this.userInfo.userCode,
					"id": row.id,
					"version": row.version,
					"status": "进行中"
				}
				//    console.log(data);
				// 启用接口
				scavengingVoucherBegin(data)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(JSON.stringify(data));
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.tableLoading = false;
							that.showTable(this.page, this.limit, this.form);
						} else {
							that.$message.error(data.messageContent);
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
		iconTingzhi(index, row) {
			let that = this;
			that.tableLoading = true;
			this.$confirm('您确定要停用这条数据吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					"userId": this.userInfo.userCode,
					"id": row.id,
					"version": row.version,
					"status": "禁用"
				}
				//    console.log(data);
				// 停用接口
				scavengingVoucherStop(data)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							that.$message.success(data.messageContent);
							that.tableLoading = false;
							that.showTable(this.page, this.limit, this.form);
						} else {
							that.$message.error(data.messageContent);
							that.tableLoading = false;
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			}).catch(() => {
				that.tableLoading = false;
			});
		},

		//复制链接
		iconCopyTemplate(index,row) {
			let data = {
				"userId": this.userInfo.userCode,
				"id": row.id
			}
			let that = this;
			scavengingVoucherCopyLink(data)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					if(data.messageType == 'SUCCESS') {
						that.handleQrcode = true;
						that.qrcodeUrl=data.messageContent;
						that.$nextTick(function(){
							that.$refs['qrcode'].qrcode();
						})
					} else {
						that.$message.warning(data.messageContent);
					}
				})
				.catch((err) => {
//					 console.log(err);
				});

		}
	},
	created() {
		this.showTable(this.page, this.limit);
		// 钩子函数 -- 初始化
	},
	computed: {
		// 计算属性
		//登录时候缓存的用户类型和用户代码
		...mapGetters([
			'userInfo',
		]),
		// 计算属性
	}
};</script>
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width: 100%;
}

.el-form {
	display: unset;
	.el-form-item {
		margin-bottom: 10px;
	}
}</style>