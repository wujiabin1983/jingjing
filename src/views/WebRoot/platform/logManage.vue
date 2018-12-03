<!--平台系统管理-日志管理-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.selectLogInfo">
				<el-form :inline="true" :model="form" class="demo-form-inline" v-if="roleBtn.selectLogInfo">
					<div class="floatRight">
						<el-form-item>
							<!-- <el-date-picker v-model="form.time" type="date" placeholder="选择日期"></el-date-picker> -->
							<el-date-picker v-model="form.time" type="daterange" :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleTimeChange">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="日志类型">
							<el-select v-model="form.logType" placeholder="请选择日志类型">
								<el-option v-for="item in logTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
			<el-card v-if="roleBtn.exportLogInfo">
				<el-button type="primary" @click="handleExport">导出</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange" v-loading="tableLoading">
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
	import { selectLogManageInfo, exportLogManageInfo } from '@/api/platform/logManage'
	import { selectLogType } from '@/api/public'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				// 权限
				roleBtn: {
					exportLogInfo: false,
					selectLogInfo: false
				},
				// 搜索数据
				form: {
					time: '', // 时间段
					logDateBegin: '', // 开始时间
					logDateEnd: '', // 结束时间
					logType: '', // 日志类型
					userName: '' // 操作人
				},
				logTypeOptions: [], // 日志类型下拉数据
				// 表格数据
				tableData: [{
					logType: '123',
					desc: 'XXX组',
					logDate: 'XXXX',
					userName: 'XXXXX'
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
			// 选择时间
			handleTimeChange(str) {
				this.form.logDateBegin = str[0];
				this.form.logDateEnd = str[1];
			},
			//重置
			onReset() {
				this.form = {
					time: '', // 时间段
					logDateBegin: '', // 开始时间
					logDateEnd: '', // 结束时间
					logType: '', // 日志类型
					userName: '' // 操作人
				}
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit, this.form);
			},
			showTable(page, limit, searchContent) {
				let that = this;
				let data = this.form.roleInfo;
				let params = {
					"userId": this.userInfo.userCode,
					page: page,
					limit: limit,
					logDateBegin: this.form.logDateBegin, // 开始时间
					logDateEnd: this.form.logDateEnd, // 结束时间
					logType: this.form.logType, // 日志类型
					userName: this.form.userName, //  操作人 
				}
				//          console.log(params);
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectLogManageInfo(params)
					.then(function(res) {

						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
						// console.log(data);return false;
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
			},
			// 分页的方法
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit, this.form);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit, this.form);
			},
			// 导出
			handleExport() {
				let that = this;
				let ids = '';
				// if(this.multipleSelection.length == 0) {
				//     this.$message.error('请选择数据');
				//     return false;
				// }
				this.multipleSelection.forEach((val, index) => {
					ids += val.id + ',';
				});
				let params = {
					userId: this.userInfo.userCode,
					idList: ids,
					logDateBegin: this.form.logDateBegin,
					logDateEnd: this.form.logDateEnd,
					userName: this.form.logType,
					logType: this.form.userName
				}
				//          console.log(params);
				exportLogManageInfo(params)
					.then((res) => {
						// console.log(res);return false;
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							window.location.href = Cookie.get('baseUrl') + msg;
						} else {
							that.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err)
					})
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			this.showTable(this.page, this.limit, this.form);
			// 钩子函数 -- 初始化

			// logTypeOptions       
			selectLogType()
				.then((res) => {
					// console.log(JSON.stringify(res), 'asdkjfasldkjfl');
					let data = JSON.parse(Base64.decode(res.data));
					let logTypeData = [];
					data.forEach((val, index) => {
						//                  console.log(val, index);
						logTypeData.push({
							label: val.key,
							value: val.value
						});
					});
					this.logTypeOptions = logTypeData;
				})
				.catch((err) => {
					// console.log(err)
				})
		},
		computed: {
			// 计算属性
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
		.el-form-item {
			margin-bottom: 10px;
		}
	}
</style>