<!--员工信息-导入-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectEmplImportInfo">
					<el-form-item class="floatLeft">
						<el-button type="primary" @click="upload" v-if="roleBtn.importEmplInfo">选择文件导入</el-button>
						<el-button type="primary" @click="download" :disabled="downDis">下载模板</el-button>
					</el-form-item>
					<div class="floatRight">
						<el-form-item label="选择日期">
							<el-date-picker v-model="form.selectDate" :editable="false" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
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
				<form ref="uploadForm" :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
					<input type="text" name="userId" :value="userCode" />
					<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
					<input type="submit" value="上传" ref="uploadSubmit" />
				</form>
				<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="uploadUser" width="100px" label="上传用户"></el-table-column>
					<el-table-column prop="uploadFiles" width="300px" label="上传文件">
						<template slot-scope="scope" >
	                    	<el-popover trigger="hover" placement="top">
					          <p> {{ scope.row.uploadFiles }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.uploadFiles }}</el-tag>
					          </div>
					        </el-popover>
			            </template>
					</el-table-column>
					<el-table-column prop="uploadTime" width="140px" label="上传时间"></el-table-column>
					<el-table-column prop="fileSize" width="80px" label="文件大小"></el-table-column>
					<el-table-column prop="lineNumber" width="80px" label="处理行数"></el-table-column>
					<el-table-column prop="processStatus" width="80px" label="处理状态"></el-table-column>
					<el-table-column prop="processDate"  width="140px" label="处理完成时间"></el-table-column>
					<el-table-column prop="returnMsg"  width="80px" label="返回消息"></el-table-column>
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
					<el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { staffImportInfo, staffImportDownload, staffImportFile } from '@/api/base/importInfo'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				downDis:false,
				// 权限
				roleBtn: {
					selectEmplImportInfo: false,
					importEmplInfo: false
				},
				// 搜索数据
				form: {
					selectDate: [] // 日期区间
				},
				// 表格数据
				tableData: [],
				// 表格多选
				multipleSelection: [],
				userCode: '',
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_407.action', // 导入路径
				// 表格是否为加载状态
				tableLoading: false,
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			onReset() {
				this.form.selectDate = [];
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit);
			},

			// 分页
			handleCurrentChange(val) {
				//	            console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			showTable(start, limit) {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					type: 8,
					page: start,
					limit: limit
				}
				if(this.form.selectDate.length > 0) {
					params.uploadTimeBegin = this.form.selectDate[0];
					params.uploadTimeEnd = this.form.selectDate[1];
				}
				// console.log(params);return false;
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				staffImportInfo(params)
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
						}else if(data.messageType != 'SUCCESS'){
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
			// 图标 - 查看
			iconChakan(index, row) {
				var data = JSON.stringify(row);
				this.$router.push({
					name: '数据导入员工信息查询',
					params: {
						pageType: '查看',
						formData: data
					}
				});
			},
			// 导入
			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				let formData = new FormData(this.$refs.uploadForm); // 可以增加表单数据
				this.tableLoading = true;
				staffImportFile(formData)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						//						console.log(data)					
						if(code == 'SUCCESS') {
							this.$message.success({
								message: msg,
								onClose() {
									that.showTable(that.page, that.limit);
								}
							});
						} else {
							this.$message.error({
								dangerouslyUseHTMLString: true,
								message: msg,
								showClose: true,
								onClose() {
									that.showTable(that.page, that.limit);
								}
							});
						}
						this.$refs.uploadForm.reset();
						this.tableLoading = false;
					})
					.catch((err) => {
						this.loading = false;
						this.tableLoading = false;
					})
			},
			upload() {
				// 点击测试
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			//下载模板
			download() {
				this.downDis=true;
				staffImportDownload()
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data)+"返回值")
						let code = data.messageType;
						let msg = data.messageContent;
						this.downDis=false;
						if(code == 'SUCCESS') {
							//							console.log(Cookie.get('baseUrl') + msg);
							window.location.href = Cookie.get('baseUrl') + msg;
						} else {
							this.$message({
								message: msg,
								type: 'warning'
							});
						}
					})
					.catch((err) => {
						this.downDis=false;
						// console.log(err);
					})
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit);
			this.userCode = this.userInfo.userCode;
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
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: unset;
		overflow: hidden;
		.el-form-item {
			margin-bottom: 10px;
		}
	}
</style>