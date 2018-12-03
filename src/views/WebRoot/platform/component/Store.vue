<template>
	<!-- <el-container class=""> -->
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!-- 门店 -->
			<el-tab-pane label="门店" name="门店">
				<el-cascader :options="cascaderOptions1" change-on-select v-model="searchInfo1" @change="handleCascader1" placeholder="请选择区域"></el-cascader>
				<el-button type="primary" @click="handleSearch1">查询</el-button>
				<el-transfer filterable filter-placeholder="请输入搜索内容" v-model="transferInfo1" :data="transferOptions1" :titles="['门店数量', '选择门店数量']" :button-texts="['', '']" @change="handleTransferChange1" :format="{
          noChecked: '共${total}家',
          hasChecked: '${checked}/共${total}家'
        }">
					<el-pagination class="transfer-footer" background layout="prev, pager, next, jumper" :total="30" slot="left-footer" small></el-pagination>
					<el-pagination class="transfer-footer" background layout="prev, pager, next, jumper" :total="30" slot="right-footer" small></el-pagination>
				</el-transfer>
			</el-tab-pane>
			<!-- 店组 -->
			<el-tab-pane label="店组" name="店组">
				<el-cascader :options="cascaderOptions2" change-on-select v-model="searchInfo2" @change="handleCascader2" placeholder="请选择区域"></el-cascader>
				<el-button type="primary" @click="handleSearch2">查询</el-button>
				<el-transfer filterable filter-placeholder="请输入搜索内容" v-model="transferInfo2" :data="transferOptions2" :titles="['店组数量', '选择店组数量']" :button-texts="['', '']" @change="handleTransferChange2" :format="{
          noChecked: '共${total}家',
          hasChecked: '${checked}/共${total}家'
        }">
					<el-pagination class="transfer-footer" background layout="prev, pager, next, jumper" :total="30" slot="left-footer" small></el-pagination>
					<el-pagination class="transfer-footer" background layout="prev, pager, next, jumper" :total="30" slot="right-footer" small></el-pagination>
				</el-transfer>
			</el-tab-pane>
			<!-- 区域 -->
			<el-tab-pane label="区域" name="区域">
				<el-cascader :options="cascaderOptions3" change-on-select v-model="searchInfo3" @change="handleCascader3" placeholder="请选择区域"></el-cascader>
				<el-button type="primary" @click="handleSearch3">查询</el-button>
				<el-transfer filterable filter-placeholder="请输入搜索内容" v-model="transferInfo3" :data="transferOptions3" :titles="['区域数量', '选择区域数量']" :button-texts="['', '']" @change="handleTransferChange3" :format="{
          noChecked: '共${total}家',
          hasChecked: '${checked}/共${total}家'
        }">
					<el-pagination class="transfer-footer" background layout="prev, pager, next, jumper" :total="30" slot="left-footer" small></el-pagination>
					<el-pagination class="transfer-footer" background layout="prev, pager, next, jumper" :total="30" slot="right-footer" small></el-pagination>
				</el-transfer>
			</el-tab-pane>
		</el-tabs>
		<!-- </el-container> -->
	</div>
</template>
<script>
	import { showCascader } from '@/api/cascader'
	import { showTransfer } from '@/api/transfer'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 初始化显示的选项卡
				activeName: '门店',
				/**门店 */
				// 搜索表单
				searchInfo1: [],
				// 级联数据
				cascaderOptions1: [],
				//  穿梭框数据
				transferOptions1: [],
				transferInfo1: [],

				/**店组 */
				// 搜索表单
				searchInfo2: [],
				// 级联数据
				cascaderOptions2: [],
				//  穿梭框数据
				transferOptions2: [],
				transferInfo2: [],

				/**区域 */
				// 搜索表单
				searchInfo3: [],
				// 级联数据
				cascaderOptions3: [],
				//  穿梭框数据
				transferOptions3: [],
				transferInfo3: []

			}
		},
		methods: {
			// 选项卡切换
			handleClick(tab, event) {
				//        console.log(tab, event);
			},
			/**门店 */
			// 搜索数据
			handleSearch1() {
				//        console.log(this.searchInfo1);
			},
			// 级联点击事件
			handleCascader1(value) {
				//        console.log(value);
			},
			// 初始化级联选择器
			showCascaderInfo1() {
				showCascader()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.cascaderOptions1 = data.messageContent;
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			},
			// 初始化穿梭框
			showTransferInfo1() {
				showTransfer()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.transferOptions1 = data.messageContent;
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			},
			// 穿梭框切换
			handleTransferChange1(value, direction, movedKeys) {
				//        console.log(value, direction, movedKeys);
			},

			/**店组 */
			// 搜索数据
			handleSearch2() {
				//        console.log(this.searchInfo2);
			},
			// 级联点击事件
			handleCascader2(value) {
				//        console.log(value);
			},
			// 初始化级联选择器
			showCascaderInfo2() {
				showCascader()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.cascaderOptions2 = data.messageContent;
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			},
			// 初始化穿梭框
			showTransferInfo2() {
				showTransfer()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.transferOptions2 = data.messageContent;
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			},
			// 穿梭框切换
			handleTransferChange2(value, direction, movedKeys) {
				//        console.log(value, direction, movedKeys);
			},

			/**区域 */
			// 搜索数据
			handleSearch3() {
				//        console.log(this.searchInfo3);
			},
			// 级联点击事件
			handleCascader3(value) {
				//        console.log(value);
			},
			// 初始化级联选择器
			showCascaderInfo3() {
				showCascader()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.cascaderOptions3 = data.messageContent;
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			},
			// 初始化穿梭框
			showTransferInfo3() {
				showTransfer()
					.then((res) => {
						// let data = JSON.parse(Base64.decode(res.data.data));
						let data = res.data;
						// console.log(data);
						if(data.messageType == 'SUCCESS') {
							this.transferOptions3 = data.messageContent;
						} else {
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						this.$message.error(err);
					})
			},
			// 穿梭框切换
			handleTransferChange3(value, direction, movedKeys) {
				//        console.log(value, direction, movedKeys);
			}
		},
		created() {
			// 钩子函数 -- 初始化
			/**门店 */
			// 初始化级联选择器
			this.showCascaderInfo1()
			// 初始化穿梭框
			this.showTransferInfo1()

			/**店组 */
			// 初始化级联选择器
			this.showCascaderInfo2()
			// 初始化穿梭框
			this.showTransferInfo2()

			/**区域 */
			// 初始化级联选择器
			this.showCascaderInfo3()
			// 初始化穿梭框
			this.showTransferInfo3()
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
		position: absolute;
		margin-left: rem(20px);
	}
	
	.el-button {
		margin-left: 20px;
	}
	
	.el-dialog__body {
		padding: 20px 10px;
	}
	
	.el-transfer {
		margin-top: 20px;
	}
	
	.transfer-footer {
		margin-left: 20px;
		padding: 6px 5px;
	}
</style>