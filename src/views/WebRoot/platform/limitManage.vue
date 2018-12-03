<!--平台管理 权限分配-->
<template>
	<el-container class="app-container">
		<el-aside class="aside">
			<el-card v-loading="roleConversionLoading">
				<h4 class="paddingBottom0">请选择用户组</h4>
				<el-checkbox-group v-model="checkListAside" @change="handleCheckedAside" v-loading="checkboxLoading">
					<el-checkbox v-for="item in checkListAsideData" :key="item.key" :label="item.value">{{item.key}}</el-checkbox>
				</el-checkbox-group>
			</el-card>
		</el-aside>
		<el-main>
			<el-card v-loading="roleConversionLoading">
				<!-- 全选按钮 -->
				<el-checkbox v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
				<table class="width100" v-loading="tableLoading" cellspacing="0">
					<thead>
						<tr>
							<th>选择模块</th>
							<th>权限设置</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in checkListMainData" :key="item.label">
							<td>
								<el-checkbox :label="item.label" v-model="item.checked" :checked="item.checked" @change="handleSelectMode(index,item.checked)">{{item.msg}}</el-checkbox>
							</td>
							<td>
								<div v-for="(subItem, a) in item.children" class="dsh-checkbox">
									<el-checkbox :key="subItem.label" :label="subItem.label" v-model="subItem.checked" :checked="subItem.checked" @change="handlePurviewSetting(subItem.checked, item.children,index)">{{subItem.msg}}</el-checkbox>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<el-button type="primary" @click="handleSubmit" v-if="roleBtn.authorityUserInfo">确定</el-button>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	/**
	 * api功能列表
	 * selectCommonManage  显示左侧列表
	 * showLimit  权限列表
	 * limitSubmit 发送权限
	 */
	import { permission } from '@/utils'
	import { selectCommonManage, showLimit, limitSubmit } from '@/api/platform/limitManage'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleConversionLoading: false,
				// 权限
				roleBtn: {
					authorityUserInfo: false
				},
				name: '权限管理',
				checkAll: false,
				checkboxLoading: false, // 左侧列表加载
				tableLoading: false, // 数据加载

				// 左侧 - 结果
				checkListAside: [],
				// 左侧 - 数据
				checkListAsideData: [],

				// 右侧 - 结果
				checkListMain: [],
				// 右侧 - 数据
				checkListMainData: [],
			}
		},
		methods: {
			// 选择模块中的复选框监听
			handleSelectMode(val, index) {
				var num = 0;
				if(index) {
					this.checkListMainData[val].children.forEach((data, index) => {
						data.checked = true;
					})
					this.checkListMainData.forEach((value, index) => {
						if(!value.checked) {
							num--;
						}
					})
					if(num == 0) {
						this.checkAll = true;
					} else {
						this.checkAll = false;
					}
				} else {
					this.checkListMainData[val].children.forEach((data, index) => {
						data.checked = false;
					})
					this.checkAll = false;
				}
			},
			// 权限设置中的复选框监听
			handlePurviewSetting(flag, data, index) {
				if(flag) {
					this.checkListMainData[index].checked = true;
					var num = 0;
					this.checkListMainData.forEach((value, index) => {
						if(!value.checked) {
							num--;
						}
					})
					if(num == 0) {
						this.checkAll = true;
					} else {
						this.checkAll = false;
					}
				} else {
					this.checkListMainData[index].checked = false;
					this.checkAll = false;
				}
			},
			// 全选复选框的监听
			handleCheckAll(str) {
				//      	console.log(str)
				if(str) {
					this.checkListMainData.forEach((data, index) => {
						data.checked = true;
						data.children.forEach((data, index) => {
							data.checked = true;
						})
					})
				} else {
					this.checkListMainData.forEach((data, index) => {
						data.checked = false;
						data.children.forEach((data, index) => {
							data.checked = false;
						})
					})
				}
			},
			// 全选 - 侧边栏
			handleCheckedAside(str) {
				this.tableLoading = true;
				var that = this;
				let msg = str[str.length - 1];
				if(str.length > 1) {
					this.checkListAside.shift();
				}
				// console.log(msg);
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": msg
				}
				// console.log(params);
				// 展示权限列表
				showLimit(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// let data = res.data;
						//                  console.log(JSON.stringify(data.messageContent));
						let code = data.messageType;
						let msg = data.messageContent;
						if(code == 'SUCCESS') {
							this.checkAll = false;
							this.checkListMainData = msg;
							let num = 0;
							msg.forEach(function(val, index) {
								// console.log(val, index);
								if(val.checked) {
									num++;
								}
							});
							this.tableLoading = false;
							if(num == msg.length) {
								// 当选中所有模板时， 点亮全选按钮
								this.checkAll = true;
							} else {
								this.checkAll = false;
							}
							// console.log(that.checkListMain);
						} else {
							this.$message.error(msg);
						}

					})
					.catch((err) => {
						// console.log(err);
					});

			},
			// handleConversion(obj, dataObj) {
			//     let data = []
			//     let childData = [];
			//     obj.forEach((val, index) => {
			//         if(val.checked) {
			//             if(!val.children) {
			//                 dataObj.child.push(val.label);
			//             }else {
			//                 data.push({
			//                     msg: [val.label],
			//                     child: []
			//                 });
			//                 this.handleConversion(val.children, data[index]);
			//             }
			//         }

			//     });
			//     return data;
			// },
			handleConversion(obj, dataObj) {
				let data = !dataObj ? [] : dataObj;
				// console.log(obj, dataObj);
				obj.forEach((val, index) => {
					if(val.checked) {
						if(!val.children) {
							data.push(val.label);
						} else {
							data.push(val.label);
							this.handleConversion(val.children, data);
						}
					} else {
						if(val.children) {
							this.handleConversion(val.children, data);
						}
					}

				});
				return data;
			},
			// 发送权限
			handleSubmit() {
				// console.log(this.checkListMainData);
				// let a = [];
				// a.push(
				//     
				// );
				// console.log(a);
				// this.handleConversion(this.checkListMainData)
				// return false;
				this.roleConversionLoading = true
				let roleConversion = !this.handleConversion(this.checkListMainData) ? [] : this.handleConversion(this.checkListMainData)
				if(roleConversion.length == 0) {
					this.$message.error('请正确分配权限');
					return false;
				} else {
					let params = {
						"userId": this.userInfo.userCode,
						"userGroupId": this.checkListAside[0],
						"menuCode": roleConversion
					}
					limitSubmit(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//                      console.log(data);
							if(data.messageType == 'SUCCESS') {
								this.$message.success(data.messageContent + "  退出后生效!");
								this.roleConversionLoading = false;
							} else {
								this.$message.error(data.messageContent);
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			// console.log(this.userInfo);
			this.checkboxLoading = true;
			let params = {
				userId: this.userInfo.userCode
			}
			// console.log(params);
			// 获取后台返回的左侧列表数据
			selectCommonManage(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					//                 console.log(JSON.stringify(data));
					let code = data.messageType;
					let msg = data.messageContent;
					if(code == 'SUCCESS') {
						this.checkListAsideData = msg;
						this.checkboxLoading = false;
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
	
	.el-aside .el-checkbox {
		display: block;
		margin: 10px;
	}
	.aside{
		padding-right: 10px
	}
	.el-checkbox-group {
		padding: rem(10px);
	}
	
	table {
		margin: 10px 0;
		border-left: 1px solid #d2d2d2;
		border-top: 1px solid #d2d2d2;
		th,
		td {
			border-right: 1px solid #d2d2d2;
			border-bottom: 1px solid #d2d2d2;
			padding: 10px;
		}
	}
	.paddingBottom0{
		padding-bottom: 0;
	}
	.dsh-checkbox{
		display: inline-block;
		margin: 0 10px;
	}
</style>