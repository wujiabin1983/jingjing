<template>
	<div>
		<!--{{childType}}-->
		<!-- 日期（年月日） -->
		<el-container class="app-container" v-if="childType == '日期'">
			<el-card class="noPadding">
				<el-header>
					<el-row>
						<el-col :span="5">
							{{ childName }}（最多可添加{{ childLimit }}项） 
						</el-col>
						<el-col :span="4">
						<span v-if="dateSelected=='日'">日维度不能大于31</span>
						</el-col>
						<el-col :span="7">
							<el-select v-model="dateSelected" placeholder="请选择日期类型" class="width150" @change="handleFormDate">
								<el-option label="年" value="年"></el-option>
								<el-option label="月" value="月"></el-option>
								<el-option label="日" value="日"></el-option>
							</el-select>
						</el-col>
						<el-col :span="8">
							<el-checkbox v-model="formDateYear.isOpen">启用筛选</el-checkbox>
						</el-col>
					</el-row>
				</el-header>
				<el-main v-if="dateSelected == '年'">
					<dataDefineBComponent ref="formDateYear" :childDateType="dateSelected" childRef="formDateYear" :childForm="formDateYear" :childName="childName" :childMax="childLimit" @parentDelete="handleParentDelete" :noTitle="true"></dataDefineBComponent>
				</el-main>
				<el-main v-if="dateSelected == '月'">
					<el-form ref="formDateMonth" :model="formDateMonth" label-width="120px" :inline="true">
						<el-row :gutter="20" v-for="(item, index) in formDateMonth.main" :key="item.key">
							<el-col :span="8">
								<el-form-item label="">
									<el-input v-model="item.value" class="width180" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<p class="textInfo">
									<span>{{ formDateMonth.main[index].value }}</span>
								</p>
							</el-col>
						</el-row>
					</el-form>
				</el-main>
				<el-main v-if="dateSelected == '日'">
					<dataDefineBComponent ref="formDateDay" :childDateType="dateSelected" childRef="formDateDay" :childForm="formDateDay" :childName="childName" :childMax="childLimit" @parentDelete="handleParentDelete" :noTitle="true"></dataDefineBComponent>
				</el-main>
			</el-card>
		</el-container>
		<!-- 数值 -->
		<el-container class="app-container" v-if="childType == '数值'">
			<el-card class="noPadding">
				<el-header>
					<el-row>
						<el-col :span="8">
							{{ childName }}（最多可添加{{ childLimit }}项）
						</el-col>
						<el-col :span="8">
							<el-input v-model="formNumber.selected" class="width150"></el-input>
						</el-col>
						<el-col :span="8">
							<el-checkbox v-model="formNumber.isOpen">启用筛选</el-checkbox>
						</el-col>
					</el-row>
				</el-header>
				<el-main>
					<dataDefineBComponent ref="formNumber" childRef="formNumber" :childForm="formNumber" :childName="childName" :childMax="childLimit" @parentDelete="handleParentDelete" :noTitle="true"></dataDefineBComponent>
				</el-main>
			</el-card>
		</el-container>
		<!-- 文本(选择) -->
		<el-container class="app-container" v-if="childType == '文本(选择)'">
			<el-card class="noPadding">
				<el-header>
					<el-row>
						<el-col :span="8">
							{{ childName }}（最多可添加{{ childLimit }}项）
						</el-col>
						<el-col :span="8" :offset="8">
							<el-checkbox v-model="formSelectText.isOpen">启用筛选</el-checkbox>
						</el-col>
					</el-row>
				</el-header>
				<el-main>
					<el-form ref="formSelectText" :model="formSelectText" label-width="120px" :inline="true">
						<el-row :gutter="20" v-for="(item, index) in formSelectText.main" :key="item.key">
							<el-col :span="8">
								<el-form-item label="" v-if="index == 0" :prop="'main.' + index + '.value'" :rules="[
                                        {required: true, message: '维度不能为空', trigger: 'blur'}
                                    ]">
									<el-input v-model="item.value" class="width180" :placeholder="childPlaceholder" :disabled="index != formSelectText.main.length-1"></el-input>
								</el-form-item>
								<el-form-item label="" v-else :prop="'main.' + index + '.value'" :rules="[
                                        { required: true, message: '维度不能为空', trigger: 'blur' }
                                    ]">
									<el-input v-model="item.value" class="width180" :placeholder="childPlaceholder" :disabled="index != formSelectText.main.length-1"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<p class="textInfo" v-if="index == 0">
									<span>{{ formSelectText.main[index].value }}</span>
								</p>
								<p class="textInfo" v-else>
									<span>{{ formSelectText.main[index].value }}</span>
								</p>
							</el-col>
							<el-col :span="8">
								<p class="textInfo">
									<el-tooltip class="iconItem dsh-tooltip" content="删除" placement="top">
										<icon-svg icon-class="shanchu" @click.native.prevent="handleSelectTextDelete(index)" />
									</el-tooltip>
								</p>
							</el-col>
						</el-row>
					</el-form>
					<div @click="handleSelectTextAdd" class="btnAdd">
						<i class="el-icon-plus"></i>
					</div>
				</el-main>
			</el-card>
		</el-container>

		<!-- 文本(录入) -->
		<el-container class="app-container" v-if="childType == '文本(录入)'">
			<el-card class="noPadding">
				<el-header>
					<el-row>
						<el-col :span="8">
							{{ childName }}（最多可添加{{ childLimit }}项）
						</el-col>
						<el-col :span="8" :offset="8">
							<el-checkbox v-model="formEnterText.isOpen">启用筛选</el-checkbox>
						</el-col>
					</el-row>
				</el-header>
				<el-main>
					<el-form ref="formEnterText" :model="formEnterText" label-width="120px" :inline="true">
						<el-row :gutter="20" v-for="(item, index) in formEnterText.main" :key="item.key">
							<el-col :span="8">
								<el-form-item label="" v-if="index == 0" :prop="'main.' + index + '.value'" :rules="[
                                        {required: true, message: '维度不能为空', trigger: 'blur'}
                                    ]">
									<el-input v-model="item.value" class="wid100" :placeholder="childPlaceholder" :disabled="true"></el-input>
								</el-form-item>
								<el-form-item label="" v-else :prop="'main.' + index + '.value'" :rules="[
                                        { required: true, message: '维度不能为空', trigger: 'blur' }
                                    ]">
									<el-input v-model="item.value" class="wid100" :placeholder="childPlaceholder" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<p class="textInfo" v-if="index == 0">
									<span>{{ formEnterText.main[index].value }}</span>
								</p>
								<p class="textInfo" v-else>
									<span>{{ formEnterText.main[index].value }}</span>
								</p>
							</el-col>
							<el-col :span="8">
							</el-col>
						</el-row>
					</el-form>
				</el-main>
			</el-card>
		</el-container>
	</div>
</template>
<script>
	import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo } from '@/api/platform/userGroup'
	import dataDefineBComponent from './dataDefineBComponent.vue'
	import { dimensionSelect } from '@/api/base/dataDefine'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			dataDefineBComponent
		},
		data() {
			return {
				// 数据   
				dateSelected: '年',
				// 日期（年）  formDateYear
				formDateYear: {
					id: '',
					version: '',
					isOpen: true,
					selected: '年',
					main: []
				},
				// 日期（月）  formDateMonth
				formDateMonth: {
					id: '',
					version: '',
					isOpen: true,
					selected: '月',
					main: [{
							value: '1月'
						},
						{
							value: '2月'
						},
						{
							value: '3月'
						},
						{
							value: '4月'
						},
						{
							value: '5月'
						},
						{
							value: '6月'
						},
						{
							value: '7月'
						},
						{
							value: '8月'
						},
						{
							value: '9月'
						},
						{
							value: '10月'
						},
						{
							value: '11月'
						},
						{
							value: '12月'
						}
					]
				},
				// 日期（日）  formDateDay
				formDateDay: {
					id: '',
					version: '',
					isOpen: true,
					selected: '日',
					main: []
				},
				// 数值  formNumber
				formNumber: {
					id: '',
					version: '',
					isOpen: true,
					selected: '',
					main: []
				},
				// 文本(选择)  formSelectText
				formSelectText: {
					id: '',
					version: '',
					isOpen: true,
					selected: '',
					main: []
				},
				// 文本(录入)  formEnterText
				formEnterText: {
					id: '',
					version: '',
					isOpen: true,
					selected: '',
					main: [
						{
							value: '未录入'
						},
						{
							value: '已录入'
						},
					]
				},
			}
		},
		props: ['childType', 'childName', 'childLimit', 'childPlaceholder', 'childValue'],
		methods: {
			// 方法
			handleParentDelete(str) {
				let type = str.type;
				let index = str.index;
				this.handleDelete(type, index);
			},
			// 方法
			handleFormDate(str) {
				// if(str == '年') {
				// 	// 日
				// 	this.formDateDay.id = '';
				// 	this.formDateDay.version = '';
				// 	this.formDateDay.isOpen = true;
				// 	this.formDateDay.main = [{
				// 		value: ''
				// 	}];
				// }else if(str == '月') {
				// 	// 年
				// 	this.formDateYear.id = '';
				// 	this.formDateYear.version = '';
				// 	this.formDateYear.isOpen = true;
				// 	this.formDateYear.main = [{
				// 		value: ''
				// 	}];
				// 	// 日
				// 	this.formDateDay.id = '';
				// 	this.formDateDay.version = '';
				// 	this.formDateDay.isOpen = true;
				// 	this.formDateDay.main = [{
				// 		value: ''
				// 	}]
				// }else if(str == '日') {
				// 	// 年
				// 	this.formDateYear.id = '';
				// 	this.formDateYear.version = '';
				// 	this.formDateYear.isOpen = true;
				// 	this.formDateYear.main = [{
				// 		value: ''
				// 	}]
				// }
			},
			handleSaveSub(msg) {
				let arr = [];
				JSON.parse(msg).main.forEach((val, index) => {
					arr.push(`${val.value}`);
				});
				return arr;
			},
			// 保存
			handleSave() {
				if(this.childType == '日期') {
					
					let data = {
						id: this.childValue.id,
						version: this.childValue.version,
						main: [],
						// id: this.formDateYear.id,
						// version: this.formDateMonth.version,
						isOpen: [this.formDateYear.isOpen, this.formDateMonth.isOpen, this.formDateDay.isOpen],
						...this.childValue
					}
					let mainDate = {}
					mainDate.type = this.dateSelected;
					if(this.dateSelected == '年') {
						mainDate.value = this.$refs.formDateYear.handleSave();
					}else if(this.dateSelected == '月') {
						mainDate.value = this.formDateMonth.main;
					}else if(this.dateSelected == '日') {
						mainDate.value = this.$refs.formDateDay.handleSave();
					}
					data.main.push(mainDate);
					// console.log(data)
					return data;
				}
				if(this.childType == '数值') {
					let data = {
						...this.formNumber, // 数值
						id: this.childValue.id,
						version: this.childValue.version,
						...this.childValue,
						main: this.$refs.formNumber.handleSave()
					}
					return data;
				}
				if(this.childType == '文本(选择)') {
					let data = {
						...this.formSelectText, // 文本(选择)
						id: this.childValue.id,
						version: this.childValue.version,
						...this.childValue,
						main: this.handleSaveSub(JSON.stringify(this.formSelectText))
					}
					return data;
				}
				if(this.childType == '文本(录入)') {
					let data = {
						...this.formEnterText, // 文本(录入)
						id: this.childValue.id,
						version: this.childValue.version,
						main: this.handleSaveSub(JSON.stringify(this.formEnterText))
					}
					return data;
				}
			},
			// 日期（年） - 添加
			handleDateYearAdd() {
				this.$refs.formDateYear.validate((valid) => {
					if(valid) {
						let childLimit = this.childLimit.length == 0 ? '12' : this.childLimit;
						if(this.formDateYear.main.length < parseInt(childLimit)) {
							this.formDateYear.main.push({
								value: ''
							});
						}
					} else {
						return false;
					}
				});
			},
			// 日期（年） - 删除
			handleDateYearDelete(index) {
				this.handleDelete('formDateYear', index);
			},
			// 日期（日） - 添加   
			handleDateDayrAdd() {
				this.$refs.formDateDay.validate((valid) => {
					if(valid) {
						let childLimit = this.childLimit.length == 0 ? '12' : this.childLimit;
						if(this.formDateDay.main.length < parseInt(childLimit)) {
							this.formDateDay.main.push({
								value: ''
							});
						}
					} else {
						return false;
					}
				});
			},
			// 日期（日） - 删除  
			handleDateDayDelete(index) {
				this.handleDelete('formDateDay', index);
			},
			// 数值 - 添加   
			handleNumberAdd() {
				this.$refs.formNumber.validate((valid) => {
					if(valid) {
						let childLimit = this.childLimit.length == 0 ? '12' : this.childLimit;
						if(this.formNumber.main.length < parseInt(childLimit)) {
							this.formNumber.main.push({
								value: ''
							});
						}
					} else {
						return false;
					}
				});
			},
			// 数值 - 删除
			handleNumberDelete(index) {
				this.handleDelete('formNumber', index);
			},
			// 文本(选择) - 添加   
			handleSelectTextAdd() {
				this.$refs.formSelectText.validate((valid) => {
					if(valid) {
						let childLimit = this.childLimit.length == 0 ? '12' : this.childLimit;
						if(this.formSelectText.main.length < parseInt(childLimit)) {
							this.formSelectText.main.push({
								value: ''
							});
						}
					} else {
						return false;
					}
				});
			},
			// 文本(选择) - 删除
			handleSelectTextDelete(index) {
				this.handleDelete('formSelectText', index);
			},
			// 删除
			handleDelete(formName, index) {
				// console.log(formName);
				this[formName].main.splice(index, 1);
			},
			// 修改回显
			handleInfo() {
				let params = {
					userId: this.userInfo.userCode,
					dimensionId: this.childValue.dimensionId
				}
//				console.log(params, 'aaaaa');
				dimensionSelect(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
							if(code == 'SUCCESS') {
							msg.forEach((val, index) => {
								if(this.childType == "数值") {
									// console.log(val);
									this.formNumber.id = val.id;
									this.formNumber.version = val.version;
									this.formNumber.selected = val.subItemName;
									this.formNumber.isOpen = val.isEnabled == '启用' ? true : false;
									// console.log(val.subItem, 'val.subItem');
									if(val.subItem.length == 2 && val.subItem[0].value == '') {
											val.subItem.pop();
											val.subItem.pop();
										}
									this.formNumber.main = this.show(val.subItem);
								}
								if(this.childType == "文本(选择)") {
									// console.log(val);
									this.formSelectText.id = val.id;
									this.formSelectText.version = val.version;
									this.formSelectText.isOpen = val.isEnabled == '启用' ? true : false;
									this.formSelectText.main = this.showSub(val.subItem);
									// this.formSelectText.main = val.subItem;
								}
								if(this.childType == "文本(录入)") {
									this.formEnterText.id = val.id;
									this.formEnterText.version = val.version;
									this.formEnterText.isOpen = val.isEnabled == '启用' ? true : false;
									this.formEnterText.main = this.showSub(val.subItem);
									// this.formEnterText.main = val.subItem;
								}
								if(this.childType == "日期") {
									this.dateSelected = val.subItem[0].type;
									// console.log(this.dateSelected, 'this.dateSelected');
									if(this.dateSelected == '年') {
										this.formDateYear.id = val.id;
										this.formDateYear.version = val.version;
										this.formDateYear.isOpen = val.isEnabled == '启用' ? true : false;
										if(val.subItem[0].value.length == 2 && val.subItem[0].value[0].value == '') {
											val.subItem[0].value.pop();
											val.subItem[0].value.pop();
										}
										this.formDateYear.main = this.show(val.subItem[0].value);
									}
									if(this.dateSelected == '月') {
										this.formDateMonth.id = val.id;
										this.formDateMonth.version = val.version;
										this.formDateMonth.isOpen = val.isEnabled == '启用' ? true : false;
										// this.formDateMonth.main = val.subItem[0].value;
									}
									if(this.dateSelected == '日') {
										this.formDateDay.id = val.id;
										this.formDateDay.version = val.version;
										this.formDateDay.isOpen = val.isEnabled == '启用' ? true : false;
										if(val.subItem[0].value.length == 2 && val.subItem[0].value[0].value == '') {
											val.subItem[0].value.pop();
											val.subItem[0].value.pop();
										}
										this.formDateDay.main = this.show(val.subItem[0].value);
									}
								}
							})
						} else {
							this.$message.error(msg);
						}
					})
					.catch((err) => {
						// console.log(err);
					});
			},
			showSub(msg) {
//				console.log(msg)
				let arr = [];
				msg.forEach((val, index) => {
					arr.push({
						value: val
					});
				});
				return arr;
			},
			show(msg) {
				// console.log(msg, 'msgmsgmsgmsg');
				let array = [];
				msg.forEach((data, index) => {
					if(!data.value) {
						if(index == 0) {
							if(data.length > 1) {
								array.push({
									value: data.substr(1, data.length - 1)
								})
							}
						} else {
							if(data.split('-')[1] != '' && data.split('-')[1] != undefined) {
								array.push({
									value: data.split('-')[1]
								})
							} else {
								array.push({
									value: ''
								})
							}
						}
					}
				})
				if(array.length == 1 && array[0].value == '') {
					array.pop();
				}
				// console.log(array, 'sdfasfsdfasfsdfasfsdfasfsdfasf');
				// this[formArray[val.subItemName]].main = array;
				return array;
			}
		},
		created() {
			// 钩子函数 -- 初始化
			// console.log(this.childValue.dimensionName, 'this.childValue.dimensionName');
			if(this.childValue.dimensionId != "") {
				this.handleInfo();
			}
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
		overflow: hidden;
		min-width: 500px;
	}
	.dsh-tooltip{
		cursor: pointer;
		font-size: 20px;
	}
	.el-form-item {
		display: block;
		margin-bottom: 0;
		padding: 10px 0;
	}
	
	.el-select {
		width: 100%;
	}
	
	// 行内文本 span
	.formText {
		display: inline;
		line-height: rem(30px);
	}
	
	.el-header {
		padding: rem(10px);
		background: #EEE;
		position: relative;
	}
	
	.el-main {
		padding: rem(10px);
	}
	
	.widthInline {
		width: rem(90px);
		margin: 0 rem(10px);
	}
	
	.noPadding .el-card__body {
		padding: 0!important;
		.el-row {
			text-align: center;
			line-height: 32px;
			.el-col:first-child {
				text-align: left;
			}
			.el-col:last-child {
				text-align: right;
			}
		}
	}
	
	p {
		text-align: center;
	}
	
	.textInfo {
		height: 53px;
		line-height: 53px;
	}
	
	.btnAdd {
		width: 100%;
		height: 40px;
		border: 1px solid #D2d2d2;
		text-align: center;
		line-height: 40px;
		cursor: pointer;
	}
	.el-form-item {
		padding-bottom: 15px;
	}
	.wid100{
		width: 100px;
	}
	.height60{
		height: 60px;
	}
	.width180{
		width: 180px;
	}
	.width150{
		width: 150px;
	}
</style>