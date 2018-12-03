// 预置活动模板 - 新建模板 - 赠送内容
<template>
	<el-main>
		<el-card>
			<el-form :model="form" ref="form" :rules="this.getPageType=='查看' ? norules : rules" label-width="120px" class="demo-form">
				<el-form-item label="赠送类型" prop="giveType">
					<el-radio-group v-model="type" @change="handleChangeType">
						<el-radio :disabled="disabled" label="送券">送券</el-radio>
						<el-radio :disabled="disabled" label="送积分">送积分</el-radio>
						<el-radio :disabled="disabled" label="发消息">发消息</el-radio>
					</el-radio-group>
				</el-form-item>
				<div ref="subForm2" v-show="type=='送积分'">
					<el-form :model="subForm2" label-width="120px" class="demo-form">
						<el-form-item label="">
							<el-radio-group v-model="subForm2.couponValid" @change="handleChangeCouponValid">
								<el-radio label="赠送" :disabled="disabled">
									<el-form :inline="true" class="demo-form-inline disInBlock">
										<span class="formText">赠送</span>
										<el-form-item class="inlineFormItem">
											<el-input v-model="subForm2.validA" placeholder="请输入" type="number" min="1" class="subFormValid" :disabled="subForm2ValidA"></el-input>积分
										</el-form-item>
									</el-form>
								</el-radio>
								<br>
								<el-radio label="消费送" :disabled="disabled">
									<el-form :inline="true" class="demo-form-inline disInBlock">
										<span class="formText">消费送</span>
										<el-form-item class="inlineFormItem">
											<el-input v-model="subForm2.validB" placeholder="请输入" type="number" min="1" class="subFormValid" :disabled="subForm2ValidB"></el-input>倍积分
										</el-form-item>
									</el-form>
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-form>
				</div>
				<el-form-item label="发放限制" prop="grantLimit" v-if="type=='发消息'">
					<el-form :inline="true" class="demo-form-inline">
						<span class="formText">对同一会员的两次发送时间间隔</span>
						<el-form-item>
							<el-input v-model="form.grantLimit" type="number" min="1" :disabled="disabled" placeholder="请输入"></el-input>
						</el-form-item>
						<span class="formText">小时</span>
					</el-form>
				</el-form-item>
				<el-form-item label="活动说明" prop="activiteDesc">
					<el-input type="textarea" :rows="2" placeholder="请输入内容" :disabled="disabled" resize="none" v-model="form.activiteDesc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
				</el-form-item>
				<el-button type="primary" class="marginTop15" @click="back">上一步</el-button>
				<el-button type="primary" class="marginTop15" @click="next">下一步</el-button>
			</el-form>
		</el-card>
	</el-main>
</template>
<script>
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { selectAudioUser } from '@/api/public'
	//import { Store } from '@/views/WebRoot/platform'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				disabled: false,
				//弹窗  选择优惠券
				tabType: '选择优惠券',
				coupTempName: '',
				activeName: 'first',
				data2: [], //搜索门店的值
				value2: [], //选择的值
				// form表单数据
				type: '送券', // 赠送类型
				form: {
					giveType: '', // 赠送类型
					grantLimit: '', // 发放限制
					activiteDesc: '' // 活动说明
				},
				// 赠送类型 form表单数据
				subForm1: {
					couponArray: '', // 发送电子券   选择的优惠券 或者券包的json串
					couponValid: '有效时段', // 券有效期
					validA1: '', // 券有效期 - 限时有效
					validA2: '', // 券有效期 - 限时有效
					validB1: '', // 券有效期 - 自定义
					validB2: '' // 券有效期 - 自定义
				},
				sendStamps: { // 送券
					stampsType: '1',
					couponArray: '', //发送电子券
					couponDate: '', //券有效期
					getCouponDate: '' //领券时间
				},
				awardPoints: '', //送积分
				norules: {},
				rules: { //验证整体
					//          	giveType: [
					//                  { required: true, message: '请输入赠送类型信息', trigger: 'change'  },
					//                  { max: 10000, message: '最大长度不能超过100', trigger: 'change' }       
					//              ],
					//              grantLimit: [
					//                  { required: true, message: '请输入发放时间间隔', trigger: 'change'  },
					//                  { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					//              ],
					//              activiteDesc: [
					//                  { required: true, message: '请输入活动说明', trigger: 'change'  },
					//                  { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					//              ],
				},
				rules1: { //验证送券
					//          	couponArray: [
					//                  { required: true, message: '请选择电子券', trigger: 'change'  },
					//                  { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					//              ],
					//              couponDate : [
					//                  { required: true, message: '请选择券有效期', trigger: 'change'  },
					//                  { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					//              ],
					//              getCouponDate: [
					//                  { required: true, message: '请输入领券时间', trigger: 'change'  },
					//                  { max: 100, message: '最大长度不能超过100', trigger: 'change' }       
					//              ]
				},
				subForm1ValidA: false,
				subForm1ValidB: true,
				subForm2: {
					couponValid: '赠送', // 券有效期
					validA: '', // 券有效期 - 赠送
					validB: '', // 券有效期 - 消费送
				},
				subForm2ValidA: false,
				subForm2ValidB: true,
				// 适用门店 的dialog弹窗框
				handleStoreDialog: false,
				radiusType: '送券',

				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limitDialog, // 条/页
			}
		},
		//  components: {
		//      Store
		//  },
		methods: {
			// 状态单选框改变
			radioStatusChange(val) {
				//          console.log(val);
			},
			// 单选
			radioTimeHandle(str) {
				if(str == '时间段') {
					this.datePickerDisabled = false;
				} else if(str == '长期') {
					this.datePickerDisabled = true;
				}
			},
			leftChange(val) {
				//      	console.log(val)
			},
			// 时间选择器
			datePickerTime(str) {
				this.timeRange = str;
			},
			// 切换类型
			handleChangeType(str) {
				//      	console.log(str)
				this.radiusType = str;
			},
			// 切换券有效期
			handleChangeCouponValid(str) {
				//      	console.log(str)
				if(str == '有效时段') {
					this.subForm1ValidA = false;
					this.subForm1ValidB = true;
					this.subForm1.validB1 = ''; // 券有效期 - 自定义
					this.subForm1.validB2 = ''; // 券有效期 - 自定义

					var params = {
						type: 　this.subForm1.validA1,
						day: 　this.subForm1.validA2
					}
					this.sendStamps.couponDate = JSON.stringify(params);
					this.sendStamps.stampsType = '1';
				}
				if(str == '同活动起止日期') {
					this.subForm1ValidA = true;
					this.subForm1ValidB = true;
					this.subForm1.validB1 = ''; // 券有效期 - 自定义
					this.subForm1.validB2 = ''; // 券有效期 - 自定义
					this.subForm1.validA1 = ''; // 券有效期 - 限时有效
					this.subForm1.validA2 = ''; // 券有效期 - 限时有效

					this.sendStamps.couponDate = '同活动起止日期';
					this.sendStamps.stampsType = '2';
				}
				if(str == '自定义') {
					this.subForm1ValidA = true;
					this.subForm1ValidB = false;
					this.subForm1.validA1 = ''; // 券有效期 - 限时有效
					this.subForm1.validA2 = ''; // 券有效期 - 限时有效

					this.sendStamps.stampsType = '3';
				}
				if(str == '赠送') {
					this.subForm2ValidA = false;
					this.subForm2ValidB = true;
					this.subForm2.validB = ''; //消费送的倍数值
				}
				if(str == '消费送') {
					this.subForm2ValidA = true;
					this.subForm2ValidB = false;
					this.subForm2.validA = ''; //赠送的倍数值
				}
			},
			back() {
				this.$emit('message2', '1');
			},
			next() {
				var that = this;
				if(this.radiusType == "送券") {
					this.form.giveType = '送券';
//					//				console.log(JSON.stringify(this.subForm1))
////					this.$refs['form1'].validate((valid) => { //验证送券里面的必填项
//						if(this.subForm1.couponValid == "有效时段") {
//							var params = {
//								type:this.subForm1.validA1,
//								day:this.subForm1.validA2
//							}
//							//		                console.log(params)
//							this.sendStamps.couponDate = JSON.stringify(params);
//						}
//
//						if(this.subForm1.couponValid == "自定义") {
//							var params = {
//								dataBegin :this.subForm1.validB1,
//								dataEnd :this.subForm1.validB2
//							}
//							this.sendStamps.couponDate = JSON.stringify(params);
//						}
//						if(valid) {
//							this.form.giveType = JSON.stringify(this.sendStamps);
//						} else {
//							// console.log('验证失败+送券')
//						}
////					})
				}
				if(this.radiusType == "送积分") {
					if(this.subForm2.couponValid == "赠送") {
						//	                if(this.subForm2.validA!=""){
						var params = {
							type: "赠送",
							value: this.subForm2.validA
						}
						this.awardPoints = JSON.stringify(params);
						//	                }
					}
					if(this.subForm2.couponValid == "消费送") {
						//					if(this.subForm2.validB!=""){
						var params = {
							type: "消费送",
							value: this.subForm2.validB
						}
						this.awardPoints = JSON.stringify(params);
						//	                }
					}
					//				console.log(this.awardPoints)
					this.form.giveType = this.awardPoints;
					delete(this.form["couponArray"]);
				}
				if(this.radiusType == "发消息") {
					this.form.giveType = '发消息';
				}
				this.$refs['form'].validate((valid) => {
					if(valid) {
						if(this.getPageType != "查看") {
							that.form.radiusType = that.radiusType;
//							console.log(JSON.stringify(that.form))
							sessionStorage.setItem("dataThree", JSON.stringify(that.form));
						}
						that.$emit('message2', '3');
					} else {
						// console.log('验证失败！')
					}
				})
			},
		},
		created() {
			let that = this;

			//      console.log(this.getPageType)
			// 钩子函数 -- 初始化
			//      console.log(JSON.stringify(sessionStorage.getItem("dataOne")))
			//      console.log(JSON.stringify(sessionStorage.getItem("dataTwo")))
			//      console.log(JSON.stringify(sessionStorage.getItem("dataThree")))
			if(sessionStorage.getItem("dataThree")) {
				let data = JSON.parse(sessionStorage.getItem("dataThree"));
//				      	console.log(data)
				this.type = data.radiusType; //回显赠送类型
				this.radiusType = data.radiusType; //回显赠送类型s
				this.form = { //回显数据
					...data
				}
				//送券
				if(data.radiusType == "送券") {
					this.form.giveType = this.type;
				}
				if(data.radiusType == "送积分") {
					let giveType = JSON.parse(data.giveType);
					if(giveType.type == "赠送") {
						this.subForm2.validA = giveType.value;
					}
					if(giveType.type == "消费送") {
						this.subForm2ValidA = true,
							this.subForm2ValidB = false,
							this.subForm2.couponValid = "消费送";
						this.subForm2.validB = giveType.value;
					}
				}
				//          console.log(JSON.parse(data.giveType))
				//      	console.log(JSON.stringify(data));
			}
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.subForm1ValidA = true;
				this.subForm1ValidB = true;
				this.subForm2ValidA = true;
				this.subForm2ValidB = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res.activeTempMas
				}
				//      	console.log(this.getFormData)
				if(res.activeTempMas.giveType.stampsType) {
					if(res.activeTempMas.giveType.stampsType != "") {
						//电子券回显
						let giveType = res.activeTempMas.giveType;
						if(giveType.couponArray != "") {
							let str = JSON.parse(giveType.couponArray).indexArray;
							let strArr = str.substr(0, str.length - 1);
							let array = strArr.split(",");
							for(let i = 0; i < array.length; i++) {
								this.value2.push(parseInt(array[i]));
							}
							this.form.couponArray = giveType.couponArray;
							this.coupTempName = JSON.parse(giveType.couponArray).nameArray;
						}
						this.sendStamps.couponArray = giveType.couponArray;

						//券有限期
						let stampsType = giveType.stampsType;
						if(stampsType == "1") {
							this.subForm1.validA1 = giveType.couponDate.type;
							this.subForm1.validA2 = giveType.couponDate.day;
						}
						if(stampsType == "2") {
							this.subForm1.couponValid = "同活动起止日期";
						}
						if(stampsType == "3") {
							this.subForm1ValidA = true;
							this.subForm1ValidB = false;
							this.subForm1.couponValid = "自定义";
							this.subForm1.validB1 = giveType.couponDate.dataBegin;
							this.subForm1.validB2 = giveType.couponDate.dataEnd;
						}
						//回显领券时间
						this.sendStamps.getCouponDate = giveType.getCouponDate;
					}
				}
				if(res.activeTempMas.giveType.type) {
					let giveType = res.activeTempMas.giveType;
					//          	console.log(giveType)
					this.type = "送积分";
					if(giveType.type == "赠送") {
						this.subForm2.validA = giveType.value;
					}
					if(giveType.type == "消费送") {
						this.subForm2ValidA = true,
							this.subForm2ValidB = false,
							this.subForm2.couponValid = "消费送";
						this.subForm2.validB = giveType.value;
					}
				}
				if(res.activeTempMas.giveType == "发消息") {
					this.type = "发消息";
				}
				if(res.activeTempMas.giveType == "送券") {
					this.type = "送券";
				}
			} else if(this.getPageType == '修改'|| this.getPageType == '复制'&& !sessionStorage.getItem("dataThree")) {
				let res = JSON.parse(this.getFormData);
//				           console.log(JSON.stringify(res.activeTempMas))
				this.form = {
					giveType: res.activeTempMas.giveType, // 赠送类型
					grantLimit: res.activeTempMas.grantLimit, // 发放限制
					activiteDesc: res.activeTempMas.activiteDesc // 活动说明
				}
				this.type = res.activeTempMas.giveType;
				if(res.activeTempMas.giveType.stampsType) {
					if(res.activeTempMas.giveType.stampsType != "") {
						//电子券回显
						let giveType = res.activeTempMas.giveType;
						if(giveType.couponArray != "") {
							let str = JSON.parse(giveType.couponArray).indexArray;
							let strArr = str.substr(0, str.length - 1);
							let array = strArr.split(",");
							for(let i = 0; i < array.length; i++) {
								this.value2.push(parseInt(array[i]));
							}
							this.form.couponArray = giveType.couponArray;
							this.coupTempName = JSON.parse(giveType.couponArray).nameArray;
						}
						this.sendStamps.couponArray = giveType.couponArray;

						//券有限期
						let stampsType = giveType.stampsType;
						if(stampsType == "1") {
							this.subForm1.validA1 = giveType.couponDate.type;
							this.subForm1.validA2 = giveType.couponDate.day;
						}
						if(stampsType == "2") {
							this.subForm1.couponValid = "同活动起止日期";
						}
						if(stampsType == "3") {
							this.subForm1ValidA = true;
							this.subForm1ValidB = false;
							this.subForm1.couponValid = "自定义";
							this.subForm1.validB1 = giveType.couponDate.dataBegin;
							this.subForm1.validB2 = giveType.couponDate.dataEnd;
						}
						//回显领券时间
						this.sendStamps.getCouponDate = giveType.getCouponDate;
					}
				}
				if(res.activeTempMas.giveType.type) {
					this.type = "发消息";
					let giveType = res.activeTempMas.giveType;
					//          	console.log(giveType)
					this.type = "送积分";
					if(giveType.type == "赠送") {
						this.subForm2.validA = giveType.value;
					}
					if(giveType.type == "消费送") {
						this.subForm2ValidA = true,
							this.subForm2ValidB = false,
							this.subForm2.couponValid = "消费送";
						this.subForm2.validB = giveType.value;
					}
				}
				if(res.activeTempMas.giveType == "发消息") {
					this.type = "发消息";
				}
				if(res.activeTempMas.giveType == "送券") {
					this.type = "送券";
				}
				//      	this.radiusType = res.activeTempMas.radiusType;//回显赠送类型s
			} 
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	div.el-dialog__body {
		padding: 10px 10px!important;
	}
	
	.Store .el-dialog .el-form {
		position: inherit;
	}
	
	.Store .el-dialog .role {
		height: 400px;
		width: 100%;
	}
	
	// 行内文本
	.formText {
		display: inline-block;
		line-height: rem(30px);
	}
	
	// 行内form
	.inlineFormItem {
		width: rem(130px);
	}
	
	.el-card .el-form {
	    padding-top: 0px;
	}
	.el-date-editor.el-input {
		width: auto;
	}
	.marginTop15{
		margin-top: 15px;
	}
	.disInBlock{
		display: inline-block;
	}
	.subFormValid{
		margin: 0 5px;
	}
</style>