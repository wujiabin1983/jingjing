<!--日志管理-->
<template>
	<el-container class="app-container" >
		<el-header>
			<el-card v-if=" roleBtn.selectTemplateClassifyInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectTemplateClassifyInfo">
					<div class="floatRight">
						<el-form-item>
							<el-date-picker v-model="timeRangeArr" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :clearable="false" type="daterange" :editable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="日志类型">
							<el-select v-model="form.logType" placeholder="请选择日志类型">
								<!--<el-option label="登录" value="登录"></el-option>
	                            <el-option label="查询" value="查询"></el-option>
	                            <el-option label="导入" value="导入"></el-option>
	                            <el-option label="修改" value="修改"></el-option>
	                            <el-option label="添加" value="添加"></el-option>
	                            <el-option label="删除" value="删除"></el-option>
	                            <el-option label="编辑" value="编辑"></el-option>-->
								<el-option v-for="item in logOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-input v-model="form.userName" placeholder="请选择操作人姓名"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
			<el-card v-if="roleBtn.addTemplateClassifyInfo">
				<el-button type="primary" @click="exportDataFn">导出</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column type="selection" width="50" label="选择"></el-table-column>
					<el-table-column prop="logType" label="日志类型"></el-table-column>
					<el-table-column prop="logDate" label="操作日期"></el-table-column>
					<el-table-column prop="userName" label="操作人"></el-table-column>
					<el-table-column prop="logDesc" label="描述">
						<template slot-scope="scope" >
	                    	<el-popover trigger="hover" placement="top">
					          <p> {{ scope.row.logDesc }}</p>
					          <div slot="reference" class="name-wrapper">
					            <el-tag size="medium">{{ scope.row.logDesc }}</el-tag>
					          </div>
					        </el-popover>
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
	import { selectLogInfo, logInfoData, selectLogType, improtData } from '@/api/platform/log'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					selectTemplateClassifyInfo: false,
					addTemplateClassifyInfo: false
				},
				timeRangeArr: [],
				// 搜索数据
				form: {
					logDateBegin: '', // 操作时间
					logDateEnd: '', // 操作时间
					logType: '', // 日志类型
					userName: '' // 操作人姓名
				},
				logOption: [],
				// 表格数据
				tableData: [{}],
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
			// 分页方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			//时间区间监听
			selectDate(val) {
				this.form.logDateBegin = val[0];
				this.form.logDateEnd = val[1];
			},
			//导出数据
			exportDataFn() {
				let params = '';
				this.multipleSelection.forEach((val, index) => {
					params += val.id + ',';
				})
				var param = {
					"userId": this.userInfo.userCode,
					"ids": params,
					...this.form
				}
				//			console.log(param);
				this.tableLoading = true;
				improtData(param)
					.then((res) => {
						//					console.log(JSON.stringify(res) + "导出返回值");
						let data = JSON.parse(Base64.decode(res.data));
						if(data.messageType == 'SUCCESS') {
							window.location.href = Cookie.get("baseUrl") + data.messageContent;
						} else {
							this.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
				this.tableLoading = false;
			},
			//重置
			onReset() {
				this.form = {
					logDateBegin: '', // 操作时间
					logDateEnd: '', // 操作时间
					logType: '', // 日志类型
					userName: '' // 操作人姓名
				};
				this.timeRangeArr = [];
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form);
			},
			showTable(start, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					...searchContent
				}
				// 使表格加载
				this.tableLoading = true;
				//          console.log(JSON.stringify(params))
				// 查询接口
				selectLogInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						//                      console.log(JSON.stringify(data))
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
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit, this.form);
			let that = this;
			let params = {
				userId: this.userInfo.userCode
			}
			selectLogType(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					//                  console.log(JSON.stringify(data))
					if(code == 'SUCCESS') {
						msg.forEach((val, index) => {
							that.logOption.push({
								lable: val,
								value: val
							});
						})
					}
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
			// 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			])
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
		.el-form-item {
			margin-bottom: 10px;
		}
	}
</style>