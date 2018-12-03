// 页面设置 - 完善资料
<template>
	<el-container class="app-container">
		<el-header>
			<h4>完善资料</h4>
		</el-header>
		<el-main class="container-main" v-loading="enterLoading">
			<el-row>
				<el-col :span="7" class="el-col-container">
					<el-header class="dsh-center dsh-vertical-center">
						<div>{{ headerSelect }}</div>
					</el-header>
					<el-main class="main-mobil">
						<perfectInformationComponent :childData="tableDataCopy" :imgSrc="dialogImageUrl"></perfectInformationComponent>
					</el-main>
				</el-col>
				<el-col :span="17" class="el-col-container">
					<el-header class="dsh-vertical-center dsh-header">
						<span>编辑完善资料内容</span>
					</el-header>
					<el-main class="main-content">
						<div class="main-content-div">
							<el-button type="primary" class="space-around" @click="handleRuleSet" v-if="roleBtn.setMemInfoSetInfo">设置会员奖励规则</el-button>
							<h5 class="space-around">背景图</h5>
							<el-row class="bgImage space-around">
								<el-col :span="6">
									<el-form>
										<el-form-item label="" prop="bgUrl">
											<!-- <el-button type="primary" @click="clickTest">上传图片</el-button>	
											<el-button type="primary" @click="handleUploadDelete">删除</el-button> -->
											<div class="icon-close" v-loading="imgLoading">
												<img v-if="dialogImageUrl" :src="dialogImageUrl + '?x-oss-process=style/small'" @click="clickTest" class="avatar">
												<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
												<i v-if="dialogImageUrl" class="el-icon-circle-close" @click="handleUploadDelete"></i>
											</div>
											<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
												<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
												<input type="submit" value="上传" ref="uploadSubmit" />
											</form>
											<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
											<el-dialog :visible.sync="dialogVisible">
												<img width="100%" :src="dialogImageUrl" alt="">
											</el-dialog>
										</el-form-item>
									</el-form>
								</el-col>
								<el-col :span="18">
									<p class="editBg">
										<!-- <span @click="clickTest">修改背景图</span>
										<span @click="handleUploadDelete">删除</span> -->
									</p>
									<p class="advice">建议尺寸：640 * 320 像素</p>
								</el-col>
							</el-row>
							<h5 class="space-around">编辑</h5>
							<el-table :data="tableData" border class="width60" v-loading="tableLoading">
								<el-table-column prop="name" label="字段名称"></el-table-column>
								<el-table-column prop="name" label="是否必填">
									<template slot-scope="scope">
										<el-checkbox v-model="scope.row.isRequired" @change="handleCheckbox(scope.row)">必填</el-checkbox>
									</template>
								</el-table-column>
								<el-table-column prop="sort" label="排序" width="60">
									<template slot-scope="scope">
										<el-tooltip class="item" content="排序" placement="left">
											<i class="el-icon-rank icon-rank"></i> - {{ scope.row.id }}
										</el-tooltip>
									</template>
								</el-table-column>
								<el-table-column prop="remove" label="删除" width="60">
									<template slot-scope="scope">
										<el-tooltip class="item" content="删除" placement="left">
											<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
										</el-tooltip>
									</template>
								</el-table-column>
							</el-table>
							<el-button class="width60" @click="handleAdd">添加</el-button>

						</div>

					</el-main>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8" class="el-col-button">
					<!-- <el-button type="primary" @click="handleSubmit">保存并发布</el-button> -->
				</el-col>
				<el-col :span="16" class="el-col-button">
					<el-button type="primary" @click="handlePush" v-if="roleBtn.releaseMemInfoSetInfo">发布</el-button>
				</el-col>
			</el-row>
		</el-main>
		<el-dialog title="" :visible.sync="dialogTableVisible" @close="handleClose">
			<el-table :data="extendFieldData">
				<el-table-column property="" width="40">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.checked"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column property="name" label="字段名称" width="200"></el-table-column>
				<el-table-column property="type" label="字段类型"></el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleExtendFieldAdd">确 定</el-button>
            </span>
		</el-dialog>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { uploadImg } from '@/api/base/brandInfo' // 上传图片接口
	import Cookie from 'js-cookie'
	import { perfectInfoTableShow, extendFieldDataShow, perfectInfoTableSort, perfectInfoTableAdd, setRuleSet, perfectInfoSave, selectRuleSet, extendFieldDataDelete } from "@/api/mobile/perfectInformation";
	import { mapGetters } from "vuex";
	import { perfectInformationComponent } from '@/views/WebRoot/mobile'
	import { customizeSelect } from '@/api/mobile/customizeMenu' // 选择品牌
	import Sortable from 'sortablejs'
	export default {
		data() {
			return {
				enterLoading:false,
				roleBtn: {
					selectMemInfoSetInfo: false,
					releaseMemInfoSetInfo: false,
					setMemInfoSetInfo: false
				},
				// 数据
				headerSelect: "",
				headerSelectItems: [{
					value: "双皮奶",
					label: "双皮奶"
				}],
				tableLoading: false,
				tableData: [
					// {
					// 	"name": "头像", // 字段名称
					// 	"isRequired": true, // 是否必填 
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "姓名", // 字段名称
					// 	"isRequired": false, // 是否必填 
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "性别", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(选择)'
					// },
					// {
					// 	"name": "生日", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '日期'
					// },
					// {
					// 	"name": "手机", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '数字'
					// },
					// {
					// 	"name": "所在地址", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "学历", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(选择)'
					// },
					// {
					// 	"name": "身高", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(选择)'
					// },
					// {
					// 	"name": "婚姻状况", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(选择)'
					// },
					// {
					// 	"name": "邮箱", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "证件类型", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(选择)'
					// },
					// {
					// 	"name": "证件", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "微博ID", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "QQ号码", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(录入)'
					// },
					// {
					// 	"name": "淘宝ID", // 字段名称
					// 	"isRequired": false, // 是否必填
					// 	"type": '文本(录入)'
					// },
				],
				tableDataCopy: [],
				sortedTableData: null,
				sortable: null, // 拖拽排序对象

				dialogTableVisible: false,
				extendFieldData: [
					// {
					// 	checked: true,
					// 	name: '结婚纪念日',
					// 	type: '日期'
					// },
					// {
					// 	checked: false,
					// 	name: '预产期',
					// 	type: '日期'
					// },
				],
				// 会员奖励规则
				ruleSet: '',

				childData: '', // 传递数据

				form: {
					"rewardRuleId": "", // 奖励规则ID
					"bgUrl": "", // 背景图片URL
					"pageContent": "", // 页面设置内容
				},

				imgLoading: false,
				dialogImageUrl: '', // 图片列表
				dialogVisible: false,
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
			};
		},
		components: {
			perfectInformationComponent
		},
		methods: {
			// 发布
			handlePush() {
				this.enterLoading=true;
				let hasRewardRule = false;
				if(!this.form.rewardRuleId) {
					hasRewardRule = false;
				}else {
					// 已设置会员奖励规则
					hasRewardRule = true;
				}
				// 已设置会员奖励规则
				if(hasRewardRule) {
					let rewardStatus = '';
					let params = {
						userId: this.userInfo.userCode,
						rewardRuleId: this.form.rewardRuleId
					}
					selectRuleSet(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								count = data.count,
								msg = data.data;
							this.enterLoading=false;
							if(msg.length > 0) {
								rewardStatus = msg[0].ruleSet.status ? '是' : '否';
								let params = {
									"userId": this.userInfo.userCode,
									"rewardStatus": rewardStatus,
									"rewardRuleId": this.form.rewardRuleId,
									"bgUrl": this.form.bgUrl,
									"pageContent": this.tableDataCopy,
									"remarks": ""
								}
								perfectInfoSave(params)
									.then((res) => {
										let data = JSON.parse(Base64.decode(res.data)),
											code = data.messageType,
											msg = data.messageContent;
											// console.log(data);
										if(code == 'SUCCESS') {
											this.$message.success(msg);
											this.handleTableDataShow(); // 显示表格
											this.showTable(); // 显示预留字段表格
										} else {
											this.$message.warning(msg);
											this.handleTableDataShow(); // 显示表格
											this.showTable(); // 显示预留字段表格
										}
									})
									.catch((err) => {
//										 console.log(err);
									})
							}
						})
				}else {
					// let form = JSON.parse(this.getFormData);
					// 未启用会员奖励规则
					let params = {
						"userId": this.userInfo.userCode,
						"rewardStatus": '否',
						"rewardRuleId": this.form.rewardRuleId,
						"bgUrl": this.form.bgUrl,
						"pageContent": this.tableDataCopy,
						"remarks": ""
					}
					perfectInfoSave(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							this.enterLoading=false;
								// console.log(data);
							if(code == 'SUCCESS') {
								this.$message.success(msg);
								this.handleTableDataShow(); // 显示表格
								this.showTable(); // 显示预留字段表格
							} else {
								this.$message.warning(msg);
								this.handleTableDataShow(); // 显示表格
								this.showTable(); // 显示预留字段表格
							}
						})
						.catch((err) => {
//							 console.log(err);
						})
				}

			},
			// 是否必填选项
			handleCheckbox(obj) {
				//          console.log(obj);
				this.tableDataCopy.forEach((val, index) => {
					if(val.name == obj.name) {
						val.isRequired = obj.isRequired;
					}
				});
			},
			// 设置会员奖励规则 - 按钮
			handleRuleSet() {
//				console.log(this.form.rewardRuleId, 'this.form.rewardRuleId');
				if(this.form.rewardRuleId.length > 0) {
					let rewardRuleId = this.form.rewardRuleId;
					// console.log(rewardRuleId);
					this.$router.push({
						name: '页面设置完善资料设置会员奖励制度',
						params: {
							pageName: '完善资料',
							"formRewardRule": rewardRuleId
							// formData: this.form.rewardRuleId
						},
						query: {
							time: +new Date()
						},
					});
				}else {
					this.$router.push({
						name: '页面设置完善资料设置会员奖励制度',
						params: {
							pageName: '完善资料',
							// formData: JSON.stringify(this.data)
						},
						query: {
							time: +new Date()
						},
					});
				}
			},
			// 显示数据
			handleTableDataShow() {
				this.tableLoading = true;
				let params = {
					userId: this.userInfo.userCode,
					type: '资料'
				}
				perfectInfoTableShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
//	                      	console.log(JSON.stringify(msg), '查询返回值');
							this.tableLoading = false;
							// this.$message.success(msg);
							// this.tableData.push(...msg);
							if(msg.length != 0) {
								// console.log(msg);
								let form = msg.pageContent[0];
								this.form.rewardRuleId = form.rewardRuleId; // 奖励规则ID
								this.form.bgUrl = form.bgUrl;
								this.dialogImageUrl = form.bgUrl;

								// let pageContent = [];
								// form.pageContent.forEach(val => {
								// 	console.log(val)
								// });
								this.form.pageContent = form.pageContent;
								let pageContent = [];
								form.pageContent.forEach(val => {
									pageContent.push({
										isRequired: val.isRequired,
										name: val.name,
										type: val.type,
										length:val.length,
										defaultDesc:val.defaultDesc
									});
								});
								this.tableData = pageContent;
								this.tableDataCopy = JSON.parse(JSON.stringify(pageContent));
							}
							this.$nextTick(() => {
								this.setSort(); // 拖拽排序
							});
						} else {
							this.tableLoading = false;
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
						this.tableLoading = false;
					});
			},
			// 显示预留字段表格
			showTable() {
				let params = {
					userId: this.userInfo.userCode
				}
				extendFieldDataShow(params)
					.then((res) => {
						                //  console.log(res, 'showTable');
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
//	                    console.log(JSON.stringify(msg)+"?");
						if(code == 'SUCCESS') {
							// console.log(msg, '|||预留字段');
						// 	checked: false,
						// name: '预产期',
						// type: '日期'
							let data = [];
							msg.forEach((val, index) => {
								if(val.type=="预留字段"){
									data.push({
										name: val.characterName,
										isRequired: false,
										type: val.characterType,
										length:100,
										defaultDesc:''
									});
								}else{
									data.push({
										name: val.characterName,
										isRequired: false,
										type: val.characterType,
										length:val.length,
										defaultDesc:val.defaultDesc
									});
								}
							});
							this.extendFieldData = data;
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			// 排序
			setSort() {
				const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
				this.sortable = Sortable.create(el, {
					// ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
					setData: function(dataTransfer) {
						dataTransfer.setData('Text', '')
						// to avoid Firefox bug
						// Detail see : https://github.com/RubaXa/Sortable/issues/1012
					},
					onEnd: evt => {
						let targetRow = this.tableDataCopy.splice(evt.oldIndex, 1)[0];
						this.tableDataCopy.splice(evt.newIndex, 0, targetRow);
					}
				});
			},
			pushSort(params) {
				perfectInfoTableSort(params)
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data)),
						let data = res.data,
							code = data.messageType,
							msg = data.messageContent,
							val = data.valueObj;
						// count = data.count,
						// msg = data.data;
						// console.log(data);
						if(code == 'SUCCESS') {
							this.$message.success(msg);
							this.handleTableDataShow(); // 重新加载
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			handleSubmit() { // 保存并发布
				// this.childData = '保存并发布';
			},
			handleAdd() { // 预览
				// this.childData = '预览'
				// this.showTable(); // 显示预留字段表格
				this.dialogTableVisible = true;
			},
			iconShanchu(index, obj) {
				this.tableData.splice(index, 1);
				this.tableDataCopy.splice(index, 1);
				this.extendFieldData.push({
					checked: false,
					name: obj.name,
					type: obj.type,
					length:obj.length,
					defaultDesc:obj.defaultDesc
				});
				// let params = {

				// }
				// extendFieldDataDelete()
				// 	.then()
				// 	.catch()
			},
			handleExtendFieldAdd() {
				this.dialogTableVisible = false;
				//          console.log(this.extendFieldData);
				let extendFieldData = this.extendFieldData;
				let checkedObj = [];
				let extendFieldDataLeft = [];
				extendFieldData.forEach((val, index) => {
					if(val.checked) {
						checkedObj.push({
							name: val.name,
							isRequired: false,
							type: val.type,
							length:val.length,
							defaultDesc:val.defaultDesc
						});
					}else {
						extendFieldDataLeft.push({
							...val
						});
					}
				});
				this.extendFieldData = extendFieldDataLeft;
				checkedObj = Array.from(new Set(checkedObj));
				this.tableData.push(...checkedObj);
				this.tableDataCopy.push(...checkedObj);
			},
			handleClose() {
				this.extendFieldData.forEach(val => {
					val.checked = false;
				});
			},

			handleSelectImg(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(files) {
					if(!/image\/\w+/.test(files.type)) {
						this.$message("请上传一张图片");
						return false;
					}
					this.imgLoading = true;
					var reader = new FileReader();
					reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件 
					//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片 
					reader.onload = function(e) {
						// that.form.bgUrl = e.target.result; // 图片回填 - 本地图片
						// that.$refs.uploadSubmit.dispatchEvent(new MouseEvent('click')); // 上传图片
						let formData = new FormData(); // 可以增加表单数据
						formData.append("file", files); // 文件对象
						uploadImg(formData)
							.then((res) => {
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								//                          console.log(msg.fileName)
								that.form.bgUrl = msg.fileName; // 图片赋值
								// that.form.bgUrl = e.target.result; // 图片回填 - 本地图片
								that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
								that.$message.success('上传成功');
								that.imgLoading = false;
							})
							.catch((err) => {
								that.imgLoading = false;
								// console.log(err);
							})
					}
				}
			},
			clickTest() {
				// 点击测试
				this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.form.bgUrl = '';
				this.$refs.uploadIpt.value = '';
			}
		},
		created() {

			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData));
			// console.log(this.tableDataCopy);
			this.handleTableDataShow(); // 显示表格
			this.showTable(); // 显示预留字段表格
			if(this.getPageType == '设置会员奖励规则') {
				let form = JSON.parse(this.getFormData);
//				console.log(this.getFormData);
				if(form.status){
					let expiryDate = [];
					if(form.expiryDate.value == '时间段') {
						expiryDate = [form.expiryDate.slot.start, form.expiryDate.slot.start]
					} else {
						expiryDate = [form.expiryDate.point.type, form.expiryDate.point.day]
					}
				}
				let params = {
					"userId": this.userInfo.userCode,
					"type": "资料",
					"rewardStatus": form.status ? '是' : '否',
					"ruleSet": {
						...form
					},
					"isEnable": false,
					"bindOption": {}
				}
//				console.log(JSON.stringify(params));
//				return false;
				setRuleSet(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.form.rewardRuleId = msg;
//							console.log(msg);
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					})
			};
			
			// 显示品牌
			let params = {
				userId: this.userInfo.userCode
			}
			customizeSelect(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data)),
						code = data.messageType,
						msg = data.messageContent;
					// count = data.count,
					// msg = data.data;
					// console.log(msg)
					if(code == 'SUCCESS') {
						this.headerSelect = msg.brandName;
					} else {
						this.$message.error(msg);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"]),
			getPageType() {
				let pageType = this.$route.params.pageType;
				this.$route.params.pageType = '';
				return pageType;
			},
			getFormData() {
				let formData = this.$route.params.formData;
				this.$route.params.formData = '';
				return formData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		//   display: inline-block;
		//   position: absolute;
		//   margin-left: rem(20px);
	}
	.width60{
		width: 60%;
	}
	.el-input {
		width: 40%;
	}
	
	.el-textarea {
		width: 80%;
	}
	
	.dsh-center {
		display: flex;
		justify-content: center;
	}
	
	.dsh-vertical-center {
		display: flex;
		align-items: center;
	}
	
	.container-main .el-col.el-col-container {
		overflow-x: hidden;
		border: 1px solid #d2d2d2;
		font-size: 14px;
		background: #FFF;
	}
	
	.container-main .el-col.el-col-button {
		padding: rem(20px);
		display: flex;
		justify-content: center;
		font-size: 14px;
	}
	
	.container-main .el-header {
		width: 100%;
		height: 50px !important;
		padding: 10px;
		background: #f5f7fa;
	}
	
	.container-main .el-main {
		position: relative;
		// height: 440px;
	}
	
	.bgImage {
		.el-col:last-child {
			height: 80px;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
		}
	}
	
	.space-around {
		margin-bottom: 10px;
	}
	
	.editBg {
		color: #009ee2;
		cursor: pointer;
	}
	
	.advice {
		color: #d2d2d2;
	}
	
	.icon-rank {
		font-size: 20px;
	}
	
	.sortable-ghost {
		opacity: .8;
		color: #fff!important;
		background: red!important;
	}
	/* 上传图片 */
	// 上传图片
	.icon-close {
		position: relative;
		display: inline-block;
		.el-icon-circle-close {
			font-size: 14px; 
			position: absolute;
			top: -5px;
			right: -7px;
			color: #fa5555;
			cursor: pointer;
		}
	}
	.avatar-uploader .el-upload {
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		width: 160px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 160px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}

	.main-mobil {
		.app-container {
			padding: 10px 0 0;
		}
	}
	.main-content {
		padding: 10px;
	}
	.dsh-header{
		display: flex;
		justify-content: space-between;
	}
</style>