<!-- 会员信息   会员信息调整  子页面-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card v-loading="tableLoading" >
				<el-form :model="form"  :rules="rules" v-if="" ref="form" label-width="120px" class="demo-form">
					<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
						<el-tab-pane label="基础资料" name="first" class="height372">
							<el-form-item label="姓名" prop="userName">
								<el-input v-model="form.userName" :disabled="disabledSet" placeholder="请输入姓名"></el-input>
							</el-form-item>
							<el-form-item label="性别" prop="sex"  class="textLeft">
								<el-radio-group v-model="form.sex">
									<el-radio label="男">男</el-radio>
									<el-radio label="女">女</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="出生日期" prop="birthDate">
								<el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :editable="false" v-model="form.birthDate" type="date" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="手机号码" prop="mobile">
								<el-input v-model="form.mobile" :disabled="disabledSet" placeholder="请输入手机号码"></el-input>
							</el-form-item>
							<el-form-item label="当前等级">
								<el-input v-model="memberLevel" :disabled="true" placeholder=""></el-input>
							</el-form-item>
							<el-form-item label="调整等级" prop="memberLevel">
								<el-select v-model="form.memberLevel" placeholder="请选择" class="width100" @change="userLevelChange">
									<el-option v-for="item in userLevel" :key="item.key" :label="item.key" :value="item.key">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="备注" prop="remarks">
								<el-input v-model="form.remarks" type="textarea" resize="none" :disabled="disabledSet" placeholder="请输入备注"></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="积分" name="second" class="height372">
							<el-form-item label="当前积分">
								<el-input v-model="form.availableIntegral" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="积分调整" prop="integral" class="textLeft">
								<el-input v-model="form.integral" @change="handleChange" :min="0" label=""></el-input>
							</el-form-item>
							<el-form-item label="" prop="type" class="textLeft">
								<el-radio-group v-model="form.type">
									<el-radio label="加">加</el-radio>
									<el-radio label="减" :disabled="this.form.availableIntegral==''">减</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="备注">
								<el-input v-model="form.remarks1" type="textarea" resize="none" :disabled="disabledSet" :value="0"></el-input>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>
				</el-form>
				<div class="textCenter width100">
					<el-button type="primary" @click="onSubmit">保存</el-button>
				</div>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { validateMobile,validateInt} from '@/utils/validate';
	import { setMemberData } from '@/api/member/memberDataModification'
	import { selectLevalInfo } from '@/api/public'
	import { mapGetters } from 'vuex'
	const isMobile = (rule, value, callback) => {
		if(value!=""){
			if(!validateMobile(value)) {
				callback(new Error('请输入正确的手机号'))
			} else {
				callback()
			}
		}else{
			callback()
		}
	}
	const isInt = (rule, value, callback) => {
		if(value != "") {
			if(!validateInt(value)) {
				callback(new Error('请输入有效数字'))
			} else {
				callback()
			}
		} else {
			callback();
		}
	};
	export default {
		data() {
			return {
				num1:0,
				memberLevel:'',
				disabledSet:false,
	        	activeName: 'first',
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					"userName": "",
					"sex": "男",
					"mobile": "",
					"birthDate": "",
					"remarks": "",
					"memberLevel": "",
					"availableIntegral": "",
					"remarks1":"",
					"integral":"",
					"type":"加"
				},
				userLevel:[],
				// 表格是否为加载状态  userName   sex   birthDate   mobile   memberLevel   userType
				tableLoading: false,
				rules: {
					mobile:[{
						validator: isMobile
					}],
					integral:[{
						validator: isInt
					}]
	            },
			}
		},
		methods: {
			userLevelChange(){
				
			},
	    	//tab切换
	    	handleClick(tab, event) {
	    		
	    	},
			// 会员调整记录查询
			onSubmit() {
				let that =this;
				this.$refs['form'].validate((valid) => {
					if(valid) {
						that.tableLoading = true;
						var params = {
							"userId": this.userInfo.userCode,
							...that.form
						}
//						console.log(JSON.stringify(params))
						setMemberData(params)
							.then(function(res) {
			                    let data = JSON.parse(Base64.decode(res.data));
								if(data.messageType == 'SUCCESS') {
									that.tableLoading = false;
									that.$message.success(data.messageContent);
									that.$router.push({name: '会员资料修改'});
								} else {
									that.tableLoading = false;
									that.$message.error(data.messageContent);
								}
							})
							.catch(function(err) {
								// console.log(err);
								that.tableLoading = false;
							});
					}
				})
			},
			handleChange(val){
				// console.log(val)
			},
		},
		created() {
			var params = {
				"userId": this.userInfo.userCode
			}
			let that=this;
			selectLevalInfo(params)
				.then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
//					console.log(JSON.stringify(data))
					that.userLevel=data.data;
				})
				.catch(function(err) {
//					console.log(err)
				});
			// 钩子函数 -- 初始化
//			console.log(this.getFormData)
			if(this.getFormData){
				let data=JSON.parse(this.getFormData);
				this.form= {
					"userName":data.userName,
					"sex": data.sex,
					"mobile": data.mobile,
					"birthDate": data.birthDate,
					"remarks":data.remarks,
					"remarks1":data.remarks1,
					"memberLevel":"",
					"availableIntegral":data.availableIntegral,
					"id":data.id,
					"masterId":data.masterId,
					"masterVersion":data.masterVersion,
					"version":data.version,
					"type":"加",
					"integral":""
				};
				this.memberLevel=data.memberLevel;
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getFormData() {
				return this.$route.params.formData;
			},
			getPageType() {
				return this.$route.params.pageType;
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	/*.el-form-item{
		margin: 0;
	}*/
	.dean-form .el-form-item{
		margin: 0;
	}
	.el-button{
		margin-top:0;
	}
	.el-form {
		display: inline-block;
	}
	.height372{
		height: 372px;
	}
	.textCenter{
		text-align: center;
	}
	.textLeft{
		text-align: left;
	}
</style>