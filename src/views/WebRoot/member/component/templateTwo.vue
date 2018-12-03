// 预置活动模板 - 新建模板 - 活动对象
<template>
	<el-form :model="form" v-loading="this.uploadLoading" ref="form" label-width="120px" class="demo-form">
		<el-form-item label="分组类型">
			<el-input v-model="form.sellerGroupName" v-if="this.getPageType=='查看'" :disabled="true"></el-input>
			<el-select v-model="form.sellerGroupName" v-else placeholder="请选择" @change="groupChange">
				<el-option v-for="item in userGroupNameData" :key="item.key" :label="item.key" :value="item.index">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="活动对象" prop="activeObjectInfo">
			<el-input v-model="form.activeObjectInfo" :disabled="true" v-show=""></el-input>
			<el-row :gutter="24">
				<el-col :span="4">
					<el-radio-group v-model="activeObject" @change="radioActiveObjectHandle">
						<el-radio label="预置分组" :disabled="disabled" class="disBlock">预置分组</el-radio>
						<el-radio label="自定义条件" :disabled="disabled" class="dsh-radio">自定义条件</el-radio>
					</el-radio-group>
				</el-col>
				<el-col :span="19" class="floatLeft">
					<el-card v-show="activeObject == '预置分组'">
						<el-form :inline="true" :model="presetGroupForm" class="demo-form-inline" v-if="this.getPageType!='查看'">
							<el-form-item>
								<el-input v-model="presetGroupForm.groupName" placeholder="请输入分组名称"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="searchHandle">查询</el-button>
								<el-button type="primary" @click="clickSelet" v-show id="returnData">回显</el-button>
							</el-form-item>
						</el-form>
						<!-- 表格 -->
						<el-table ref="multipleTable" v-loading="" v-if="this.getPageType!='查看'" border :data="tableDataPreset" @selection-change="handleCurrentChange">
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column type="selection" width="50" label="选择"></el-table-column>
							<el-table-column prop="groupName" label="分组名称"></el-table-column>
						</el-table>
						<el-table ref="multipleTable" v-else :data="tableDataPresetInfo" border>
							<el-table-column type="index" width="50" label="序号"></el-table-column>
							<el-table-column prop="groupName" label="分组名称"></el-table-column>
						</el-table>
						<!-- 分页 -->
						<el-footer v-if="countPreset>limit">
							<el-pagination background class="pagination"layout="prev, pager, next, jumper" :page-size="limit" :total="countPreset" @current-change="presetChange">
							</el-pagination>
						</el-footer>
					</el-card>
					<el-card v-show="activeObject == '自定义条件'">
						<el-form :model="customConditionForm"  ref="customConditionForm" label-width="110px" class="demo-form">
							<el-form-item label="性别">
								<el-radio-group v-model="customConditionForm.sex">
									<el-radio label="不限" :disabled="disabled">不限</el-radio>
									<el-radio label="女" :disabled="disabled">女</el-radio>
									<el-radio label="男" :disabled="disabled">男</el-radio>
									<el-radio label="未知" :disabled="disabled">未知</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="会员等级">
								<el-select v-model="customConditionForm.levalName" :disabled="disabled" placeholder="请选择" @change="levalSelect">
									<el-option v-for="item in levalInfo" :key="item.key" :label="item.key" :value="item.index">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="会员消费">
								<el-radio-group v-model="customConditionForm.consumption" @change="consumptionHandle">
									<el-form :inline="true" class="demo-form-inline padding0">
										<el-form-item label="">
											<el-radio label="单笔消费" :disabled="disabled">单笔消费</el-radio>
										</el-form-item>
										<el-form-item label="">
											<el-select v-model="customConditionForm.compare1" placeholder="请选择" :disabled="compareDisabled1">
												<el-option label="大于" value="大于"></el-option>
												<el-option label="等于" value="等于"></el-option>
												<el-option label="小于" value="小于"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="">
											<el-input v-model="customConditionForm.yuan1" placeholder="请输入金额" :disabled="compareDisabled1"></el-input>
										</el-form-item>
										<el-form-item label="元"></el-form-item>
									</el-form>
									<el-form :inline="true" class="demo-form-inline">
										<el-form-item label="">
											<el-radio label="累计消费" :disabled="disabled">累计消费</el-radio>
										</el-form-item>
										<el-form-item label="">
											<el-select v-model="customConditionForm.compare2" placeholder="请选择" :disabled="compareDisabled2">
												<el-option label="大于" value="大于"></el-option>
												<el-option label="等于" value="等于"></el-option>
												<el-option label="小于" value="小于"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="">
											<el-input v-model="customConditionForm.yuan2" placeholder="请输入金额" :disabled="compareDisabled2"></el-input>
										</el-form-item>
										<el-form-item label="元"></el-form-item>
									</el-form>
									<el-radio label="不限" :disabled="disabled" >不限</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="入会时长">
								<el-form :inline="true" class="demo-form-inline padding0">
									<el-form-item label="入会">
										<el-input v-model="customConditionForm.langTime" :disabled="disabled" placeholder="请输入入会时长"></el-input>
									</el-form-item>
									<el-form-item label="周年会员"></el-form-item>
								</el-form>
							</el-form-item>
							<el-form-item label="生日当天会员">
								<el-radio-group v-model="customConditionForm.birthdayDay">
									<el-radio label="是" :disabled="disabled">是</el-radio>
									<el-radio label="否" :disabled="disabled">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="生日当月会员">
								<el-radio-group v-model="customConditionForm.birthdayMonth">
									<el-radio label="是" :disabled="disabled">是</el-radio>
									<el-radio label="否" :disabled="disabled">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-form>
					</el-card>
				</el-col>
			</el-row>

		</el-form-item>
		<el-button type="primary" class="marginTop15" @click="back">上一步</el-button>
		<el-button type="primary" class="marginTop15" @click="next">下一步</el-button>
	</el-form>
</template>
<script>
	import { selectLevalInfo ,selectUserGroupName} from '@/api/public'
	import { selectMemberGroupInfoJurisdiction  } from '@/api/platform/groupTemp'
	import { mapGetters } from 'vuex'
	import { importMemberInfo } from '@/api/base/memberInfo'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				uploadLoading: false,
				disabled: false, //查看只读
				disabledSet: false, //添加，修改的只读
				levalInfo: [], //会员等级
				tableLoading: '', // 等待框
				activeObject: '预置分组', // 活动对象
				// form表单数据
				userGroupNameData:[],
				norules: {},
				form:{
					"sellerGroupId":'', // 商户组编码
					"sellerGroupName": '', // 商户组名称
				},
				userCode: '',
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_623.action', // 导入路径
				// 适用门店 的dialog弹窗框
				handleStoreDialog: false,
				// 预置分组form表单数据
				presetGroupForm: {
					groupType: '', // 分组类型
					groupName: '' // 请输入分组名称
				},
				customConditionForm: {
					sex: '不限', // 性别
					levalName: '', // 会员等级
					levalId: '', // 会员等级
					consumption: '不限', // 会员消费
					compare1: '', // 单笔消费大小
					yuan1: '', // 单笔消费金额
					compare2: '', // 批量消费大小
					yuan2: '', // 批量消费金额
					langTime: '', // 入会时长
					birthdayDay: '否', // 生日当天会员
					birthdayMonth: '否' // 生日当月会员
				},
				// 单笔消费禁用
				compareDisabled1: true,
				// 累计消费禁用
				compareDisabled2: true,
				// 预置分组table数据
				tableDataPreset:[],//预置分组
				tableDataPresetInfo:[],//预置分组查看
				multipleSelectionGroup: [], //预置分组选择的数据
				radiusType: '预置分组', //活动对象
				// 预置分组分页
				pagePreset: 0, // 当前页
				countPreset: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
			presetChange(val){
				this.pagePreset = val;
				this.showTable(val, this.limit);
			},
			//商户组监听
			groupChange(val){
				this.form.sellerGroupName=this.userGroupNameData[val].key;
				this.form.sellerGroupId=this.userGroupNameData[val].value;
				this.showTable(this.pagePreset, this.limit,this.userGroupNameData[val].key);
			},
			//等级下拉监听
			levalSelect(val) {
				//      	console.log(val);
				this.customConditionForm.levalId = this.levalInfo[val].value;
				this.customConditionForm.levalName = this.levalInfo[val].key;
			},
			// 单选
			radioActiveObjectHandle(str) {
				//          console.log(str);
				this.radiusType = str;
				let that = this;
				if(str == "自定义条件") {
					let params = {
						userId: this.userInfo.userCode
					}
					that.tableLoading = true;
					selectLevalInfo(params) //请求会员等级
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							let result = [];
							//                      console.log(JSON.stringify(data)+"会员等级")
							that.levalInfo = data.data;
							that.tableLoading = false;
						})
						.catch(function(err) {
							// console.log(err);
							that.tableLoading = false;
						});
				}
			},
			// 会员消费单选选中事件
			consumptionHandle(str) {
				if(str == '单笔消费') {
					this.compareDisabled1 = false;
					this.compareDisabled2 = true;
					this.customConditionForm.compare2 = '';
					this.customConditionForm.yuan2 = '';
				} else if(str == '累计消费') {
					this.compareDisabled1 = true;
					this.compareDisabled2 = false;
					this.customConditionForm.compare1 = '';
					this.customConditionForm.yuan1 = '';
				}
			},
			getUserGroupName(){
				var params = {
					userId: this.userInfo.userCode
				}
				//			console.log(params)
				selectUserGroupName(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(data);
						if(data.messageType=="SUCCESS"){
							this.userGroupNameData=data.messageContent;
						}else {
							this.$message.warning(data.messageContent);
						}
					})
					.catch((err) => {
//						console.log(err);
					})
			},
			// 显示表格 预置分组
			showTable(page, limit,groupType) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": page,
					"limit": limit,
					"groupType":groupType,
					"groupName":this.presetGroupForm.groupName
				}
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
//				          console.log(JSON.stringify(params)+"入参")
				selectMemberGroupInfoJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						                  console.log(JSON.stringify(data)+"返回值")
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								"index":index,
								...val
							});
						})
						that.countPreset = data.count;
						that.tableDataPreset = result;
						that.tableLoading = false;
						if(that.getPageType != "查看") {
							that.$nextTick(function(){
								document.getElementById('returnData').dispatchEvent(new MouseEvent('click'));
							})
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			//预置分组 中的数据
			handleCurrentChange(val) {
				if(val.length==0){
					this.form.data='';
				}else{
					this.form.data=JSON.stringify(val);
				}
				this.multipleSelectionGroup=[];
				val.forEach((val,index)=>{
					this.multipleSelectionGroup.push({
						page:this.pagePreset,
						...val
					})
				})
			},
			// 预置分组搜索
			searchHandle() {
				this.showTable(this.pagePreset, this.limit);
				// console.log(this.form.activityType);
				// console.log(this.form.templateName);
			},
			clickSelet(){
				let array=[];
				let that=this;
				if(that.multipleSelectionGroup.length>0){
					that.multipleSelectionGroup.forEach((val,ind)=>{
						that.pagePreset=val.page;
						array.push(that.tableDataPreset[val.index]);
					})
					array.forEach(row => {
			            that.$refs.multipleTable.toggleRowSelection(row);
		            });
//					console.log(that.multipleSelectionGroup);
				}
			},
			back() { //上一步
				this.$emit('message1', '0');
			},
			next() { //下一步
				let that = this;
				if(this.getPageType != "查看") {
					let params = {}
					if(this.radiusType == "预置分组") {
						var params={
							presetGroup:JSON.stringify(this.multipleSelectionGroup),
							radiusType: "预置分组",
							"sellerGroupId": this.form.sellerGroupId, // 商户组编码
							"sellerGroupName": this.form.sellerGroupName, // 商户组名称
						}
						sessionStorage.setItem("dataTwo", JSON.stringify(params));
					}
					if(this.radiusType == "自定义条件") {
						params = {
							customConditions: this.customConditionForm,
							radiusType: "自定义条件",
							"sellerGroupId": this.form.sellerGroupId, // 商户组编码
							"sellerGroupName": this.form.sellerGroupName, // 商户组名称
						}
						sessionStorage.setItem("dataTwo", JSON.stringify(params));
					}
				}
				this.$emit('message1', '2');
			},
		},
		created() {
			// 钩子函数 -- 初始化
			if(sessionStorage.getItem("dataTwo")) {
				let data = sessionStorage.getItem("dataTwo");

				//回显数据
				this.form = JSON.parse(data);
				//选择用户数据回显
				if(JSON.parse(data).radiusType == "预置分组") {
					let msg = JSON.parse(data).presetGroup;
					this.multipleSelectionGroup=JSON.parse(msg);
				}
				if(JSON.parse(data).radiusType == "自定义条件") {
					this.activeObject = "自定义条件";
					
					let msg = this.form.customConditions;
					this.customConditionForm=msg
					this.consumption = this.customConditionForm.consumption;
					if(this.consumption == "单笔消费") {
						this.compareDisabled1=false;
						this.compareDisabled2=true;
						this.memberConsume =this.customConditionForm.memberConsume;
					} else if(this.consumption == "累计消费"){
						this.compareDisabled1=true;
						this.compareDisabled2=false;
						this.memberConsume1 =this.customConditionForm.memberConsume;
					}
				}
				if(this.form.presetGroup) {
					this.activeObject = "预置分组";
				}
				//根据提交的活动对象类型回显
			}
			this.userCode = this.userInfo.userCode;
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.compareDisabled1 = true;
				this.compareDisabled2 = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res.activeTempMas
				}
				res = res.activeTempMas;
				if(res.presetGroup != "") {
					this.activeObject = "预置分组";
					this.tableDataPresetInfo=res.presetGroup;
				}
				if(res.customConditions != "") {
					this.activeObject = "自定义条件";
//					this.customConditionForm = res.customConditions;
					let msg = res.customConditions;
					this.customConditionForm=msg
					this.consumption = this.customConditionForm.consumption;
					if(this.consumption == "单笔消费") {
						this.memberConsume =this.customConditionForm.memberConsume;
					} else if(this.consumption == "累计消费"){
						this.memberConsume1 =this.customConditionForm.memberConsume;
					}
				}
			} else if(this.getPageType == '修改'||this.getPageType == '复制' && !sessionStorage.getItem("dataTwo")) {
				let res = JSON.parse(this.getFormData);
				//          console.log(this.getFormData)
				res = res.activeTempMas;
				this.form = {
					...res
				}
//				console.log(JSON.stringify(res))
				if(res.presetGroup != "") {
					this.activeObject = "预置分组";
					this.radiusType = "预置分组";
					let msg = res.presetGroup;
					this.multipleSelectionGroup=msg;
					this.showTable(this.pagePreset, this.limit,msg[0].groupType);
				}
				if(res.customConditions != "") {
					this.activeObject = "自定义条件";
					this.radiusType = "自定义条件";
				        //   console.log(JSON.stringify(res)+"？")
					let msg = res.customConditions;
					this.customConditionForm=msg
					this.consumption = this.customConditionForm.consumption;
					if(this.consumption == "单笔消费") {
						this.compareDisabled1=false;
						this.compareDisabled2=true;
						this.memberConsume =this.customConditionForm.memberConsume;
					} else if(this.consumption == "累计消费"){
						this.compareDisabled1=true;
						this.compareDisabled2=false;
						this.memberConsume1 =this.customConditionForm.memberConsume;
					}
				}
			}  
			if(this.getPageType != '查看') {
				// 初始加载表格预置分组
				this.getUserGroupName();
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
			},
			getFlag() {
				return this.$route.params.flag;
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
		overflow: hidden;
		width: 100%;
	}
	.width220{
		width:220px;
	}
	div.el-dialog__body {
		padding: 10px 10px!important;
	}
	.disBlock{
		display: block;
	}
	.dsh-radio{
		margin-left: 0; margin-top: 10px;
	}
	.padding0{
		padding: 0;
	}
	.marginTop15{
		margin-top: 15px;
	}
</style>