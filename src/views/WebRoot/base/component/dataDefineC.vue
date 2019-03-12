<!--数据定义 - 扩展字段-->
<template>
	<div id="">
		<el-card>
			<el-button type="primary" class="mrgBottom10 floatLeft" @click="dialogFormVisible = true" v-if="roleBtn.addBasicExpandConfigInfo">添加字段</el-button>
		</el-card>
		<el-card>
			<el-dialog title="添加字段" :visible.sync="dialogFormVisible">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item label="字段名称" prop="characterName" :label-width="formLabelWidth">
						<el-input v-model="form.characterName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="字段类型" prop="characterType" :label-width="formLabelWidth">
						<el-select v-model="form.characterType" placeholder="请选择字段类型">
							<el-option label="文本(录入)" value="文本(录入)"></el-option>
							<el-option label="文本(选择)" value="文本(选择)"></el-option>
							<el-option label="数值" value="数值"></el-option>
							<el-option label="日期" value="日期"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="默认文案" prop="defaultDesc" :label-width="formLabelWidth">
						<el-input v-model="form.defaultDesc" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="输入限制" prop="inputRestrict" :label-width="formLabelWidth">
						<el-input v-model="form.inputRestrict" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleFieldAdd">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="维度配置" :visible.sync="dialogFormVisible2" width="70%" lock-scroll>
				<dimensionConfiguration ref="dimensionConfiguration" v-if="dialogFormVisible2" :childType="dimensionInfo.type" :childName="dimensionInfo.name" :childPlaceholder="dimensionInfo.placeholder" :childLimit="dimensionInfo.limit" :childValue="dimensionInfo.value">
				</dimensionConfiguration>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible2 = false">取 消</el-button>
					<el-button type="primary" @click="handleDimensionConfig">确 定</el-button>
				</div>
			</el-dialog>
	
			<el-table ref="tableData" v-loading="tableLoading" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="characterName" label="字段名称"></el-table-column>
				<el-table-column prop="characterType" label="字段类型"></el-table-column>
				<el-table-column prop="action" label="维度配置">
					<template slot-scope="scope">
						<!-- 功能图标 -->
						<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.setDimDimensionConfigInfo">
							<!-- 修改 -->
							<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
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
	</div>
</template>
<script>
	import { permission } from '@/utils'
	import { ExtendFieldInfo, ExtendFieldAdd,dimensionAdd, ExtendFieldEdit, dimensionSettingAdd, dimensionSettingSet } from '@/api/base/dataDefine'
	// import { dimensionSettingShow, dimensionSettingAdd, dimensionSettingDelete } from '@/api/base/dataDefine'
	import { mapGetters } from 'vuex'
	import dimensionConfiguration from '@/views/WebRoot/base/component/dimensionConfiguration'
	import { validateInt } from '@/utils/validate';

	const isInt = (rule, value, callback) => {
		if(!validateInt(value)) {
			callback(new Error('请输入整数'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
				roleBtn: {
					addBasicExpandConfigInfo: false,
					setDimDimensionConfigInfo: false
				},
				// 数据
				// 表格数据
				tableData: [],
				//				{
				//					"id": '',
				//					"version": '',
				//					"characterName": "结婚纪念日",
				//					"characterType": "日期",
				//					"defaultDesc": "请输入结婚纪念日维度",
				//					"inputRestrict": "12"
				//				}
				tableLoading: false,
				// 表格多选
				multipleSelection: [],
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页

				dialogFormVisible: false, // 弹窗 - 添加字段
				dialogFormVisible2: false, // 弹窗 - 维度配置
				form: {
					characterName: '', // 字段名称
					characterType: '', // 字段类型
					defaultDesc: '', // 默认文案
					inputRestrict: '' // 输入限制
				},
				rules: {
					characterName: [ // 字段名称
						{
							required: true,
							message: '请输入字段名称',
							trigger: 'change'
						}
					],
					characterType: [ // 字段类型
						{
							required: true,
							message: '请选择字段类型',
							trigger: 'change'
						}
					],
					defaultDesc: [ // 默认文案
						{
							required: true,
							message: '请输入默认文案',
							trigger: 'change'
						}
					],
					inputRestrict: [ // 输入限制
						{
							required: true,
							message: '请输入输入限制',
							trigger: 'change'
						},
						{
							validator: isInt
						},
					],
				},
				rowData: {},
				// 维度信息
				dimensionInfo: {
					type: '', // 维度类型
					name: '', // 维度名称
					placeholder: '', // 默认文案
					limit: '', // 维度限制
					value: '', // 信息
				},
				formLabelWidth: '120px'
			}
		},
		methods: {
			// 方法
			// 维度配置
			handleDimensionConfig() {
				let formData = this.$refs.dimensionConfiguration.handleSave();
				//console.log(formData)
				let that = this;
				if(formData.main[0].value==''){
					return false;
				}

				if(formData.dimensionName == "") {
					//console.log(JSON.stringify(that.rowData))
					let params = {
						"userId": that.userInfo.userCode, // 用户类型
						"id": '',
						"version": '',
						"dimensionId": formData.dimensionId, // 维度ID
						"dimensionName": formData.characterName, // 维度名称
						"status": formData.isOpen ? '启用' : '禁止', // 状态（启用、禁止）
						"expendConfigId": that.rowData.id, // 扩展字段id
						"expendConfigVersion": that.rowData.version, // 扩展字段版本号
						"subItem": formData.main, // 具体维度信息
						"subItemName": that.rowData.characterName, // 维度名称
						"type": "1"
					}
										 //console.log(JSON.stringify(params));return false;
					dimensionAdd(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// console.log(data, '添加');return false;
							if(code == 'SUCCESS') {
								that.$message.success(msg);
								that.dialogFormVisible2 = false;
								that.showTable(that.page, that.limit);
							} else {
								that.$message.error(msg);
								that.dialogFormVisible2 = false;
								that.showTable(that.page, that.limit);
							}
						})
						.catch((err) => {
//							console.log(err);
						});
				} else {
					//console.log(formData);console.log(JSON.stringify(that.rowData));
					let params = {
						"userId": that.userInfo.userCode, // 用户类型
						"id": formData.dimenRecordId,
						"version": formData.dimenRecordVersion,
						"dimensionId": formData.dimensionId, // 维度ID
						"dimensionName": formData.characterName, // 维度名称
						"status": formData.isOpen ? '启用' : '禁止', // 状态（启用、禁止）
						"expendConfigId": that.rowData.id, // 扩展字段id
						"expendConfigVersion": that.rowData.version, // 扩展字段版本号
						"subItem": formData.main, // 具体维度信息 
						"subItemName": that.rowData.characterName, // 维度名称
						"type": "1"
					}
					 //console.log(params);return false;
					ExtendFieldEdit(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							// console.log(data, '修改');return false;
							if(code == 'SUCCESS') {
								that.$message.success(msg);
								that.dialogFormVisible2 = false;
								that.showTable(that.page, that.limit);
							} else {
								that.$message.error(msg);
								that.dialogFormVisible2 = false;
								that.showTable(that.page, that.limit);
							}
						})
						.catch((err) => {
//							console.log(err);
						});
				}
				// ExtendFieldEdit(params)
			},
			// 新增字段
			handleFieldAdd() {
				this.$refs.form.validate((valid) => {
					if(valid) {
						let params = {
							"userId": this.userInfo.userCode,
							...this.form
						}
						ExtendFieldAdd(params)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								if(code == 'SUCCESS') {
									this.$message.success(msg);
									this.showTable(this.page, this.limit);
									this.dialogFormVisible = false;
									
									this.form.characterName = '';
									this.form.characterType = '';
									this.form.defaultDesc = '';
									this.form.inputRestrict = '';
								} else {
									this.$message.error(msg);
								}
							})
							.catch((err) => {
//								console.log(err);
							});

					} else {
//						console.log('error submit!!');
						return false;
					}
				});
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				this.showTable(this.page, this.limit);
				// 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 显示表格
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start, //可为空
					"limit": limit //可为空
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				ExtendFieldInfo(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						// 获取后台返回的数据总条数 赋值
						that.count = data.count;
						let msg = data.data;
						//						console.log(JSON.stringify(data));
						let result = [];
						msg.forEach((val, index) => {
							result.push({
								// "id": val.id,
								// "characterName": val.characterName,
								// "characterType": val.characterType,
								// "defaultDesc": val.defaultDesc,
								// "inputRestrict": val.inputRestrict,
								// "isRequired": val.isRequired
								...val
							});
						})
						that.tableData = result;
						that.tableLoading = false;
					})
					.catch(function(err) {
//						console.log(err);
						that.tableLoading = false;
					});
			},
			iconXiugai(index, row) {
				//console.log(JSON.stringify(row))
				this.rowData = row;
				this.dimensionInfo.type = row.characterType; // 维度类型
				this.dimensionInfo.name = row.characterName; // 维度名称
				this.dimensionInfo.placeholder = row.defaultDesc; // 默认文案
				this.dimensionInfo.limit = row.inputRestrict; // 维度限制
				this.dimensionInfo.value = row, // 信息childValue
				this.dialogFormVisible2 = true;
			}
		},
		components: {
			dimensionConfiguration
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit);
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
		display: inline-block;
		// position: absolute;
		margin-left: rem(20px);
	}
</style>