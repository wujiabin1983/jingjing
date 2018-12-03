<!--业务规则-会员标签-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addMemberLabelInfo">
				<el-button type="primary" @click="addLabel" class="floatLeft">创建新标签</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column prop="labelName" width="120" label="标签名称">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isEdit" v-model="scope.row.labelName"></el-input>
							<span v-else>{{scope.row.labelName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="labelValue" label="标签值">
						<template slot-scope="scope">
							<el-tag v-for="tag in scope.row.labelValueArr" :key="tag.name" :type="tag.type">
								{{tag.name}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="action" width="65" label="操作" v-if="roleBtn.updateMemberLabelInfo || roleBtn.deleteMemberLabelInfo">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<!-- 修改 -->
							<el-tooltip class="iconItem" content="修改" placement="top" v-if="roleBtn.updateMemberLabelInfo && !scope.row.isEdit">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 确认 -->
							<!--<el-tooltip class="iconItem" content="确认" placement="top" v-if="roleBtn.updateMemberLabelInfo && scope.row.isEdit">>
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="iconQueren(scope.$index, scope.row)" />
							</el-tooltip>-->
							<!-- 删除 -->
							<el-tooltip class="iconItem" content="删除" placement="top" v-if="roleBtn.deleteMemberLabelInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
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
			<el-dialog :title="clickType" :visible.sync="handleStoreDialog">
				<el-form :model="form" ref="form" :rules="rules" v-loading="tableLoading">
					<el-form-item label="标签名称" prop="labelName" :label-width="formLabelWidth">
						<el-input v-model="form.labelName" placeholder="请输入标签名称"></el-input>
					</el-form-item>
					<el-form-item label="标签值" prop="labelValue" :label-width="formLabelWidth">
						<el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
						<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
						<el-button v-else type="primary" class="button-new-tag" size="small" @click="showInput">添加</el-button>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="handleStoreDialog = false,form.labelName='',form.labelValue=''">取 消</el-button>
					<el-button type="primary" @click="addLabelFn" class="enterBtn">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { importMemberLabel, addMemberLabel, setMemberLabel, deleteMemberLabel } from '@/api/base/memberLabel'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				clickType:'',
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				labelValue: [],
				// 权限
				roleBtn: {
					selectMemberLabelInfo: false,
					addMemberLabelInfo: false,
					updateMemberLabelInfo: false,
					deleteMemberLabelInfo: false
				},
				handleStoreDialog: false,
				handleSetDialog: false,
				form: {
					labelName: '',
					labelValue: ''
				},
				// 表格数据
				tableData: [],
				formLabelWidth: '120px',
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				rules: {
					labelName: [{
							required: true,
							message: '请输入标签名称',
							trigger: 'change'
						},
						{
							max: 100,
							message: '最大长度不能超过100',
							trigger: 'change'
						}
					],
					labelValue: [{
							required: true,
							message: '请添加标签',
							trigger: 'change'
						},
						{
							max: 2000,
							message: '最大长度不能超过2000',
							trigger: 'change'
						}
					]
				},
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit // 条/页
			}
		},
		methods: {
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
				this.form.labelValue='';
				this.dynamicTags.forEach((val,index)=>{
					this.form.labelValue+=val+",";
				})
				this.form.labelValue=this.form.labelValue.substr(0,this.form.labelValue.length-1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				let count = 0;
//				console.log(inputValue);
				if(this.dynamicTags.length>0){
					this.dynamicTags.forEach((val,index)=>{
						if(val==inputValue){
							this.$message.warning('标签值不能相等！');
							count++;
						}
					})
				}
				if(count>0){
					return false;
				}
				if(inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
				this.form.labelValue='';
				this.dynamicTags.forEach((val,index)=>{
					this.form.labelValue+=val+",";
				})
				this.form.labelValue=this.form.labelValue.substr(0,this.form.labelValue.length-1);
//				console.log(this.form.labelValue)
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 分页
			handleCurrentChange(val) {
				//	            console.log(val+ '当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			// 方法
			showTable(start, limit) {
				if(this.roleBtn.selectMemberLabelInfo) {
					let that = this;
					let params = {
						userId: this.userInfo.userCode,
						masterId: '',
						page: start,
						limit: limit
					}
					// 使表格加载
					this.tableLoading = true;
					// 查询接口
					importMemberLabel(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
//							console.log(JSON.stringify(data) + "返回值");
							let result = [];
							data.data.forEach((val, index) => {
								let array = [];
								let labelValue = [];
								if(val.labelValue.indexOf(',') > 0) {
									array = val.labelValue.split(",");
								} else if(val.labelValue.indexOf('，') > 0) {
									array = val.labelValue.split("，");
								} else {
									array = val.labelValue.split(",");
								}
//								console.log(array)
								array.forEach((val, index) => {
									labelValue.push({
										name: val,
										type: ''
									})
								})
								result.push({
									labelValueArr: labelValue,
									...val
								});

							})
							that.tableData = result;
							that.count = data.count;
							that.tableLoading = false;
						})
						.catch(function(err) {
//							console.log(err);
							that.tableLoading = false;
						});
				}
			},
			// 图标 - 修改
			iconXiugai(index, row) {
				this.clickType="修改标签";
				this.form.labelName = row.labelName;
				this.form.labelValue = row.labelValue;
				this.form.id = row.id;
				this.form.version = row.version;
				this.dynamicTags=this.form.labelValue.split(",");
				this.handleStoreDialog = true;
			},
			// 图标 - 确认
			iconQueren() {
				let that = this;
				var params = {
					userId: that.userInfo.userCode,
					...this.form
				}
				this.$refs.form.validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						//						console.log(JSON.stringify(params))
						setMemberLabel(params)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data));
								//								console.log(JSON.stringify(data)+"返回值")
								if(data.messageType == 'SUCCESS') {
									that.handleStoreDialog = false;
									that.tableLoading = false;
									that.$message.success(data.messageContent);
									that.showTable(that.page, that.limit);
								} else {
									that.tableLoading = false;
									that.$message.warning(data.messageContent);
								}
							})
							.catch((err) => {
								that.tableLoading = false;
//								console.log(err);
							});
					}
				})
			},
			// 图标 - 删除
			iconShanchu(index, row) {
				let that = this;
				this.$confirm('您确定要删除吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						userId: that.userInfo.userCode,
						params: row.id
					}
					that.tableLoading = true;
					//				console.log(JSON.stringify(params))
					deleteMemberLabel(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							if(data.messageType == 'SUCCESS') {
								that.tableLoading = false;
								that.form = {
									labelName: '',
									labelValue: ''
								};
								that.$message.success(data.messageContent);
								that.showTable(that.page, that.limit);
							} else {
								that.tableLoading = false;
								that.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							that.tableLoading = false;
//							console.log(err);
						});
				}).catch(() => {});
			},
			//取消
			handleBack() {
				this.$router.push({
					name: '会员标签'
				});
			},
			//添加新标签
			addLabel() {
				this.clickType="新增标签";
				this.handleStoreDialog = true;
			},
			//添加标签确认
			addLabelFn() {
				let that = this;
				that.handleStoreDialog = true;
				if(this.clickType=="新增标签"){
					this.$refs.form.validate((valid) => {
						if(valid) {
							that.tableLoading = true;
							var params = that.form;
							params.userId = that.userInfo.userCode;
							//              		console.log(JSON.stringify(params))
							addMemberLabel(params)
								.then((res) => {
									let data = JSON.parse(Base64.decode(res.data));
									//								console.log(JSON.stringify(data)+"返回值")
									if(data.messageType == 'SUCCESS') {
										that.handleStoreDialog = false;
										that.$message.success(data.messageContent);
										that.showTable(that.page, that.limit);
										that.form.labelName = "";
										that.form.labelValue = "";
										that.dynamicTags=[];
										that.tableLoading = false;
									} else {
										that.tableLoading = false;
										that.$message.error(data.messageContent);
									}
								})
								.catch((err) => {
									that.tableLoading = false;
//									console.log(err);
								});
						}
					})
				}else{
					this.iconQueren();
				}
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.showTable(this.page, this.limit);
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
	
	.el-form {}
	
	.el-select {
		width: 100%;
	}
	
	.el-button {
		margin: 0px 0 10px 0;
	}
	
	.el-tag {
		margin-right: 5px;
		height: 32px;
		margin-top: 0px;
		line-height: 32px;
	}
	
	.button-new-tag {
		margin-left: 0px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	
	.input-new-tag {
		width: 90px;
		margin-left: 0px;
		vertical-align: bottom;
	}
	.enterBtn{
		margin-right: 10px;
	}
</style>