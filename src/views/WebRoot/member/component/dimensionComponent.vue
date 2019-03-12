<!--我的分组子组件-->
<template>
	<div class="dimension-container">
		<el-row>
			<el-col :span="4">
				<h6 class="title" @click="handleShow" v-if="tagItemListArr.length > 0"><i :class="show?'el-icon-remove-outline':'el-icon-circle-plus-outline'"></i> {{type}}</h6>
				<h6 class="title subTitle" v-else>{{type}}</h6>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="20" :offset="3">
				<el-collapse-transition name="el-zoom-in-top" class="transition">
					<div v-show="show" :class="type == '固定维度(多选)' ? 'transition-box line-bottom' : 'transition-box'">
						<div v-for="items in tagItemListArr" :key="items.index" :class="items.type == 'checkbox' ? 'transition-items-checkbox' : 'transition-items'">
							<el-tooltip class="item" effect="light" :content="items.innerText" placement="left">
								<span class="label" v-if="items.innerText == '地域'" @click="handleSubAreaShow">
                                        <!--小图标+<i :class="subAreaShow?'el-icon-remove-outline':'el-icon-circle-plus-outline'" class="sub-area-show-icon"></i>-->
                                        <span>{{items.innerText}}</span>
								</span>
								<span class="label" v-else>{{items.innerText}}</span>
							</el-tooltip>
							<div v-if="items.type == 'input'" class="line-bottom" size="mini">
								<span v-for="item in items.text" :key="item">
                                        <span v-if="item != '$'">{{item}}</span>
								<span v-else>
                                            <el-input class="item-ipt"  :disabled="getPageType=='查看'" v-model="items.iptModel" placeholder="请输入" @change="handleChangeIpt(items.field, items.iptModel)"></el-input>
                                        </span>
								</span>
							</div>
							<div v-if="items.type == 'date'" class="line-bottom">
								<!-- {{items}} -->
								<el-date-picker class="item-date" v-model="items.dataModel[0]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="getPageType=='查看'" @change="handleChangeDate(items.field[0], items.dataModel[0])">
								</el-date-picker>
								至
								<el-date-picker class="item-date" v-model="items.dataModel[1]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :disabled="getPageType=='查看'" @change="handleChangeDate(items.field[1], items.dataModel[1])">
								</el-date-picker>
							</div>
							<span v-if="items.type == 'checkbox'">
                                    <el-checkbox v-model="items.checkboxModel" :disabled="getPageType=='查看'" :label="items.label" @change="handleChangeCheckbox(items.field, items.checkboxModel)"></el-checkbox>
                                </span>
							<div v-if="items.type == 'buttonM' && items.innerText != '地域'" class="line-bottom">
								<el-checkbox-group class="transition-item" v-model="items.btnModel" @change="handleSetCheckbox(items.field, items.btnModel)" v-if="items.type == 'buttonM'">
									<el-checkbox v-for="item in items.dimension" :disabled="getPageType=='查看'" :key="item" :label="item"></el-checkbox>
								</el-checkbox-group>
							</div>
							<div v-if="items.type == 'buttonM' && items.innerText == '地域'" class="line-bottom">
								<el-checkbox-group class="transition-item" v-model="items.btnModel" @change="handleSetCheckbox(items.field, items.btnModel)" v-if="items.type == 'buttonM'">
									<el-checkbox v-for="item in items.dimension" :disabled="getPageType=='查看'" :key="item.value" :label="item.label" @change="handleSetCheckboxSub(item.value)"></el-checkbox>
								</el-checkbox-group>
							</div>
							<div v-if="items.type == 'buttonR'" class="line-bottom">
								<el-radio-group class="transition-item" :disabled="getPageType=='查看'" v-model="items.btnModel" @change="handleSetRadio(items.field, items.btnModel)">
									<el-radio v-for="item in items.dimension" :key="item" :label="item"></el-radio>
								</el-radio-group>
							</div>
						</div>
					</div>
				</el-collapse-transition>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { dimensionSettingShow } from '@/api/base/dataDefine'
	import { selectProCityArea } from '@/api/public'
	export default {
		props: ['dimensionItems', 'type', 'dateBrand', 'memLabel', 'memIndex', 'fixedBrandMulti', 'fixedBrandRadio', 'memBrand', 'defineJson1'],
		data() {
			return {
				show: false, // 基础维度折叠面板
				customDimension: false, // 自定义维度面板
				subAreaShow: false,
				tagItemList: [],
				checkList: [],
				tagItemListArr: [],
				areaData: [],
				itemsArea: ['江苏', '上海', '浙江', '安徽', '江西', '北京', '河北', '山东', '内蒙古']
			}
		},
		methods: {
			dimensionChange(key, value, btn) {
				let keyArr = key.split('.');
				if(keyArr.length == 2) {
					this[keyArr[0]][keyArr[1]] = value;
				} else if(keyArr.length == 3) {
					this[keyArr[0]][keyArr[1][keyArr[2]]] = value;
				}
				if(btn) {
					let dimensionItems = this.dimensionItems;
					dimensionItems.forEach((val, index) => {
						if(val.field == key) {
							this.dimensionItems[index].model = value;
						}
					})
				}
				let params = {
					dateBrand: JSON.parse(JSON.stringify(this.dateBrand)),
					memBrand: this.memBrand,
					memIndex: this.memIndex,
					memLabel: this.memLabel,
					fixedBrandMulti: this.fixedBrandMulti,
					fixedBrandRadio: this.fixedBrandRadio,
					defineJson1: this.defineJson1
				}
				console.log(params);
				this.$emit('commitParams', params);
				return false;
			},
			// 多选框修改
			handleChangeCheckbox(key, value) {
				this.dimensionChange(key, value ? '是' : '否');
			},
			// 输入框修改
			handleChangeIpt(key, value) {
				this.dimensionChange(key, value);
			},
			// 日期修改
			handleChangeDate(key, value) {
				this.dimensionChange(key, value);
			},
			// 按钮多选修改
			handleSetCheckbox(key, value) {
				if(key == 'memBrand.area') {
					if(value.length > 0) {
						this.subAreaShow = false;
					} else {
						this.subAreaShow = false;
					}
				}
				this.dimensionChange(key, value, true);
			},
			handleSetCheckboxSub(str) {
				// console.log(str);
				selectProCityArea({
						parentId: str
					})
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(data)
					})
					.catch((err) => {
//						console.log(err);
					})
			},
			// 按钮单选修改
			handleSetRadio(key, value) {
				this.dimensionChange(key, value, true);
			},
			// 初始化多选框
			handleCheckbox(item, index) {
				let checkboxModel = '';
				let keyArr = item.field.split('.');
				if(keyArr.length == 2) {
					checkboxModel = this[keyArr[0]][keyArr[1]];
				} else if(keyArr.length == 3) {
					checkboxModel = this[keyArr[0]][keyArr[1][keyArr[2]]];
				}
				this.tagItemListArr.push({
					index:index,
					type: item.type,
					label: item.label,
					field: item.field,
					checkboxModel: checkboxModel=='是'
				});
//				              console.log(JSON.stringify(this.tagItemListArr));
			},
			// 初始化输入框
			handleIpt(item,index) {

				let iptModel = '';
				let keyArr = item.field.split('.');
				if(keyArr.length == 2) {
					iptModel = this[keyArr[0]][keyArr[1]];
				} else if(keyArr.length == 3) {
					iptModel = this[keyArr[0]][keyArr[1][keyArr[2]]];
				}

				this.tagItemListArr.push({
					index:index,
					type: item.type,
					innerText: item.innerText,
					text: item.text,
					field: item.field,
					iptModel: iptModel
				});
			},
			// 初始化时间
			handleDate(item,index) {
				let keyArr = ['', ''];
				let dataModel = [null, null];

				keyArr[0] = item.field[0].split('.');
				keyArr[1] = item.field[1].split('.');
				if(keyArr[0].length == 2) {
					dataModel[0] = this[keyArr[0][0]][keyArr[0][1]];
				} else if(keyArr.length == 3) {
					dataModel[0] = this[keyArr[0][0]][keyArr[0][1]];
				}
				if(keyArr[1].length == 2) {
					dataModel[1] = this[keyArr[1][0]][keyArr[1][1]];
				} else if(keyArr.length == 3) {
					dataModel[1] = this[keyArr[1][0]][keyArr[1][1]];
				}
				// console.log(dataModel, 'dateFiled');
				this.tagItemListArr.push({
					index:index,
					type: item.type,
					innerText: item.innerText,
					field: item.field,
					dataModel: dataModel
				});
			},
			// 初始化按钮
			handleBtn(item,index) {

//				console.log(JSON.stringify(item)+"??????")
				let btnModel;
				let keyArr = item.field.split('.');
				if(keyArr.length == 2) {
					if(this[keyArr[0]]){
						btnModel = this[keyArr[0]][keyArr[1]];
					}
				} else if(keyArr.length == 3) {
					if(this[keyArr[0]]){
						btnModel = this[keyArr[0]][keyArr[1][keyArr[2]]];
					}
				}
				this.tagItemListArr.push({
					index:index,
					type: item.type,
					innerText: item.innerText,
					field: item.field,
					btnModel: btnModel,
					dimension: item.dimension
				});
//				console.log(JSON.stringify(this.tagItemListArr))
			},

			handleShow() {
				this.show = !this.show;
			},
			handleSubAreaShow() {
				this.subAreaShow = !this.subAreaShow;
			}
		},
		created() {
			let that = this;
			this.getDimensionItems.forEach((val, index) => {
//				              console.log(JSON.stringify(val));
				if(val.type == 'buttonM' || val.type == 'buttonR') {
					this.handleBtn(val, index);
				}
				if(val.type == 'input') {
					this.handleIpt(val, index);
				}
				if(val.type == 'date') {
					this.handleDate(val, index);
				}
				if(val.type == 'checkbox') {
					this.handleCheckbox(val, index);
				}
			});
			// console.log(this.getPageType, this.getPageName, this.getFormData);

			// console.log(that.dateBrand);
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() { //类型   例如：查看
				return this.$route.params.pageType;
			},
			// getFormData() {
			// 	return this.$route.params.formData;
			// },
			// getPageType() {
			// 	return this.$route.params.pageType;
			// },
			// getPageName() {
			// 	return this.$route.params.pageName;
			// },
			// getId() {
			// 	let id = this.$route.params.id;
			// 	return id
			// },
			// getVersion() {
			// 	let version = this.$route.params.version;
			// 	return version
			// },
			// dateBrand() {
			//     console.log(that.dataBrand, 'laskdjflkasjdflkj');
			//     return that.dateBrand
			// },
			getDimensionItems() {
				this.dimensionItems.forEach((val, index) => {
					if(val.type == 'date') { //日期
						val.model = ['', ''];
					} else if(val.type == 'buttonM') { //复选框
						val.model = [];
					} else if(val.type == 'buttonR') { //单选框
						val.model = '否';
					} else if(val.type == 'input') { //输入框
						val.model = '';
					} else {
						val.model = '';
					}
				});
				return this.dimensionItems;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.dimension-container {
		padding: 10px 0 0;
	}
	
	.title {
		// padding: 10px 0;
		// line-height: 32px;
		font-size: 15px;
		font-weight: normal;
		cursor: pointer;
		margin: 0;
	}
	
	.subTitle {
		margin-left: 34px;
	}
	
	.content {
		padding: 10px 0;
		border-bottom: 1px solid #ECEEF4;
	}
	
	.dimension-item {
		display: inline-block;
		margin-right: 20px;
		margin-bottom: 5px;
		white-space: nowrap;
	}
	
	// 时间
	.item-date {
		width: 170px;
	}
	
	.item-ipt {
		width: 80px;
		margin: 0 5px;
	}
	
	.item {
		// vertical-align: center;
	}
	
	// 子菜单
	.transition-box {
		position: relative;
		min-height: 40px;
		margin-left: 30px;
		.transition-items {
			position: relative;
			line-height: 40px;
			min-height: 40px;
		}
		.transition-items-checkbox {
			height: 40px;
			line-height: 40px;
			float: left;
			padding-right: 20px;
			border-bottom: 1px solid #d2d2d2;
		}
		.transition-item {
			// height: 40px;
			line-height: 40px;
		}
		.item {
			width: 100px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.label {
			padding-left: 20px;
			position: relative;
			float: left;
			margin-left: -108px;
			color: #8c8c8c;
			font-weight: 500;
			cursor: pointer;
			.sub-area-show-icon {
				position: absolute;
				left: 0px;
				top: 50%;
				margin-top: -6px;
			}
		}
		.class-area {
			color: #d2d2d2;
			background: #F8FAFC;
			span {
				margin-left: 10px;
			}
			.class-area-main {
				height: 40px;
			}
			.checkbox-area {
				// height: 40px;
				border-bottom: 1px solid #d2d2d2;
			}
		}
		// line-height: 40px;
		// height: 40px;
		// border-bottom: 1px solid #ECEEF4;
		// background: #F8FAFC;
	}
	
	.line-bottom {
		// padding-left: 10px;
		border-bottom: 1px solid #d2d2d2;
		.el-checkbox {
			margin-right: 30px;
			margin-left: 0;
		}
	}
	
	.el-input--small .el-input__inner {
		height: 26px!important;
	}
</style>