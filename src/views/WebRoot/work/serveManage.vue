<!--服务管理-->
<template>
	<el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="服务申请" name="first">
				<el-header>
					<el-card>
						<el-form :inline="true" :model="form" class="demo-form-inline dean-form">
							<el-form-item label="状态">
								<el-select v-model="form.status" clearable placeholder="请选择券类型">
									<el-option label="全部" value=""></el-option>
									<el-option label="待处理" value="待处理"></el-option>
									<el-option label="已处理" value="已处理"></el-option>
									<el-option label="已关闭" value="已关闭"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="申请类型">
								<el-select v-model="form.questionType" clearable placeholder="请选择券类型">
									<el-option v-for="data in typeData" :key="data.key" :label="data.key" :value="data.key"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-input v-model="form.searchContent" placeholder="请输入姓名或电话"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="onSubmit">查询</el-button>
								<el-button type="primary" @click="onReset">重置</el-button>
							</el-form-item>
						</el-form>
					</el-card>
				</el-header>
				<el-card>
					<el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
						<el-table-column prop="questionDate" label="申请时间"></el-table-column>
						<el-table-column prop="questionName" label="申请人"></el-table-column>
						<el-table-column prop="mobile" label="联系电话"></el-table-column>
						<el-table-column prop="questionType" label="申请类型"></el-table-column>
						<el-table-column prop="status" label="状态"></el-table-column>
						<el-table-column prop="action" label="操作">
							<!-- 功能图标 -->
							<template slot-scope="scope">
							    <!-- 查看 -->
	                        	<el-tooltip class="item" content="查看" placement="top">
	                        		<i class="iconfont icon-view" @click.prevent="iconChakan(scope.$index, scope.row)" ></i>
	                                <!-- <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconChakan(scope.$index, scope.row)"/> -->
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
			</el-tab-pane>
			<el-tab-pane label="申请设置" name="second">
				<el-card class="applySet" v-loading="applySetLoading">
					<el-button type="primary" class="disBlock" @click="addApplyType" v-if="roleBtn.addApplySetInfo">添加申请类型</el-button>
					<div class="applySet" v-for="item in applyTypeList" :key="item.id">
						<table width="80%" border="0" cellspacing="0" v-loading="tableLoading">
							<thead>
								<tr>
									<th colspan="2">{{item.tempType}}</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="name in item.tempApply">
									<td colspan="2" v-if="name.isEdit">
										<el-input placeholder="请输入" v-model="name.value.name" class="addInput"></el-input>
										<i class="el-icon-success addValue" v-if="name.isEdit" @click="valueSave(item,name)"></i>
										<i class="el-icon-edit addValue" v-else @click="iconEdit(item,name)"></i>
									</td>
									<td colspan="2" v-else>{{name.value.name}}
										<i class="el-icon-delete addValue" @click="iconDelete(item,name)"></i>
										<i class="el-icon-success addValue" v-if="name.isEdit" @click="valueSave(item,name)"></i>
										<i class="el-icon-edit addValue" v-else @click="iconEdit(item,name)"></i>
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td colspan="2" @click="iconAdd(item)">
										<i class="el-icon-plus iconAdd"></i>
									</td>
								</tr>
								<tr v-if="roleBtn.deleteApplySetInfo">
									<td colspan="2" @click="iconDeketeAll(item)">
										<i class="el-icon-delete iconAdd"></i>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</el-card>
			</el-tab-pane>
		</el-tabs>
		<el-dialog :visible.sync="handleInfoDialog" class="box40" v-loading="handleLoading">
			<el-form :model="formInfo" label-width="120px" class="demo-form demo-form-sub">
				<el-form-item label="申请时间">
					<el-input v-model="formInfo.questionDate" type="text" :disabled="true" ></el-input>
				</el-form-item>
				<el-form-item label="申请人">
					<el-input v-model="formInfo.questionName" type="text" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="联系电话">
					<el-input v-model="formInfo.mobile" type="text" :disabled="true"></el-input>
				</el-form-item>
				<div v-for="item in this.formInfo.questionDesc">
					<el-form-item :label="item.name" v-if="item.name!='备注'">
						<el-input v-model="item.value" type="text" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item :label="item.name" v-else>
						<el-input v-model="item.value" resize="none" type="textarea" :disabled="true"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="回复内容">
					<el-input v-model="formInfo.answerDesc" resize="none" placeholder="请输入回复内容" :disabled="!closeApplyFlag" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			  <el-button @click="handleInfoDialog = false">关闭</el-button>
			  <el-button type="primary" @click="processed" v-if="processedFlag&&roleBtn.updateServiceRequestInfo">已处理</el-button>
			  <el-button type="primary" @click="closeApply" v-if="closeApplyFlag&&roleBtn.updateServiceRequestInfo">关闭申请</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="handleTabDialog" class="box30" v-loading="handleLoading">
			<el-form :model="formTab" label-width="120px" :rules="rules" ref="formTab" class="demo-form demo-form-sub">
				<el-form-item label="申请类型名称:" prop="tempType">
					<el-input v-model="formTab.tempType" placeholder="请输入申请类型名称" type="text"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			  <el-button @click="handleTabDialog = false">关闭</el-button>
			  <el-button type="primary" @click="addTempType">确定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>
<script>
	import { selectserveData,replyServeApply,selectApplyType,addApplyType,setApplyType,deleteApplyType,selectApplyTypes} from '@/api/work/serveManage'
	import { mapGetters } from 'vuex'
	import { permission } from '@/utils'
	export default {
		data() {
			return {
	        	// 权限
				roleBtn: {
					addApplySetInfo :false,
					deleteApplySetInfo:false,
					updateServiceRequestInfo:false
				},
				typeData:[],
				rules:{
					tempType: [{
							required: true,
							message: '请输入申请类型名称',
							trigger: 'change'
						},
						{
							max: 8,
							message: '最大长度不能超过8',
							trigger: 'change'
						}
					],
				},
				formTab:{
					tempType:''
				},
				applySetLoading:false,
				applyTypeList:[],
				handleTabDialog:false,
				////
				handleLoading:false,
				handleInfoDialog:false,
				closeApplyFlag:true,
				processedFlag:true,
	        	activeName: 'first',
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					questionType: '', 
					status: '',
					searchContent:''
				},
				formInfo:{
					questionDate:'',
					questionName:'',
					mobile:'',
					questionDesc:'',
					answerDesc:''
				},
				// 表格数据
				tableData: [],
	            // 表格数据
	            tableDataTab: [],
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false,
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
			}
		},
		methods: {
			//点击添加申请类型
			addApplyType(){
				this.handleTabDialog=true;
			},
			//申请类型弹出确定
			addTempType(){
				this.$refs['formTab'].validate((valid) => {
					if(valid) {
						let params={
							"userId": this.userInfo.userCode,
							"tempType": this.formTab.tempType,
							"tempApply":""
						}
						let that = this;
						that.handleLoading = true;
						addApplyType(params)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data));
//								console.log(data);
								let result = [];
								that.handleLoading = false;
								if(data.messageType == 'SUCCESS'){
									that.$message({
										message: data.messageContent,
										type: 'success'
									});
									that.formTab.tempType="";
									that.handleTabDialog=false;
	    							that.showTableTab();
								}else{
									that.$message({
										message: data.messageContent,
										type: 'warning'
									});
								}
							})
							.catch(function(err) {
								// console.log(err);
								that.handleLoading = false;
							});
					}
				})
			},
	    	//tab切换
	    	handleClick(tab, event) {
//	    		console.log(tab.label)
	    		if(this.tableDataTab.length==0&&tab.label=="申请设置"){
	    			this.showTableTab();
	    		}else{
					this.showTable(this.page, this.limit);
	    		}
	    	},
	    	//行内保存按钮
	    	valueSave(data,value){
//	    		console.log(JSON.stringify(data.tempApply))
	    		if(data.tempApply[data.tempApply.length-1].value.name==""){
					this.$message({
						message: '请输入',
						type: 'warning'
					});
					return false;
	    		}
	    		this.applySetLoading=true;
	    		data.tempApply.forEach((val,index)=>{
	    			data.tempApply[index].isEdit=false;
	    		})
	    		let params={
					"userId": this.userInfo.userCode,
					"id": data.id,
					"version": data.version,
					"tempType": data.tempType,
					"tempApply":data.tempApply
	    		}
	    		let that =this;
//	    		console.log(JSON.stringify(params))
	    		setApplyType(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	    				that.applySetLoading=false;
						if(data.messageType == 'SUCCESS'){
							that.$message({
								message: data.messageContent,
								type: 'success'
							});
							that.showTableTab();
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
	    	},
	    	//底部添加按钮
			iconAdd(data){
				let flag=0;
				data.tempApply.forEach((value,index)=>{
					if(value.isEdit){
						flag++;
					}
				})
				if(flag<1){
					this.applyTypeList[data.index].tempApply.push({
						value:{
							name:'',
							key:'key'+this.applyTypeList[data.index].tempApply.length
						},
						isEdit:true
					})
				}
			},
			//行内修改按钮
			iconEdit(data,value){
				this.applyTypeList[data.index].tempApply[value.index].isEdit=true;
			},
			//行内删除按钮
			iconDelete(data,value){
				this.applySetLoading=true;
				data.tempApply.splice(value.index,1);
//				console.log(data.tempApply)
	    		let params={
					"userId": this.userInfo.userCode,
					"id": data.id,
					"version": data.version,
					"tempType": data.tempType,
					"tempApply":data.tempApply
	    		}
	    		let that =this;
//	    		console.log(JSON.stringify(params))
	    		setApplyType(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	    				that.applySetLoading=false;
						if(data.messageType == 'SUCCESS'){
							that.$message({
								message: '删除成功',
								type: 'success'
							});
							that.showTableTab();
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						// console.log(err);
					});
			},
			//底部删除按钮
			iconDeketeAll(data){
				let params={
					"userId": this.userInfo.userCode,
					"id": data.id,
				}
				let that = this;
				that.applySetLoading=true;
				deleteApplyType(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
	    				that.applySetLoading=false;
//								console.log(data);
						if(data.messageType == 'SUCCESS'){
							that.$message({
								message: data.messageContent,
								type: 'success'
							});
							that.showTableTab();
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			//加载申请设置数据
	    	showTableTab(){
				let params = {
					"userId": this.userInfo.userCode
				}
				let that = this;
				// 查询接口
				this.applySetLoading=true;
				selectApplyType(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(data.messageContent)
						that.applySetLoading=false;
						that.applyTypeList=[];
						data.messageContent.forEach((val,index)=>{
							that.applyTypeList.push({
								"index":index,
								"id": val.id,
								"version": val.version,
								"tempType":  val.tempType,
								"tempApply":[]
							});
							if(val.tempApply!=""){
								val.tempApply.forEach((value,ind)=>{
									that.applyTypeList[index].tempApply.push({
										value:{
											name:value.value.name,
											key:'key'+ind
										},
										isEdit:false,
										index:ind
									})
								})
							}
						})
//						console.log(JSON.stringify(that.applyTypeList)+"返回值")
					})
					.catch(function(err) {
						// console.log(err);
					});
	    	},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 方法
			onSubmit() {
				this.showTable('', this.limit);
			},
			//重置
			onReset(){
				this.form = {
					questionType: '', 
					status: '',
					searchContent:''
				};
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val, '当前页');
				this.page = val;
				this.showTable(val, this.limit);
			},
			handleSizeChange(val) {
				this.limit = val;
				this.showTable(this.page, this.limit);
			},
			//请求表格数据
			showTable(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					...this.form
				}
//				console.log(params)
				// 使表格加载
				this.tableLoading = true;
				// 查询接口
				selectserveData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(JSON.stringify(data));
						let result = [];
						if(data.data){
							data.data.forEach((val, index) => {
								result.push({
									isEdit: false,
									...val
								});
							})
							that.count = data.count;
							that.tableData = result;
						}else if(data.messageType != 'SUCCESS'){
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
						}
						that.tableLoading = false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
					});
			},
			//查看详情
			iconChakan(index ,row){
//				console.log(JSON.stringify(row))
            	this.formInfo={
					"id": row.id,
					"version": row.version,
					"status": row.status,
					"answerDesc":row.answerDesc,
					"questionDate":row.questionDate,
					"questionName":row.questionName,
					"mobile":row.mobile,
					"questionDesc":'',
					"answerDesc":row.answerDesc
            	}
//          	for(var key in row.questionDesc){
//          		this.formInfo.questionDesc+=row.questionDesc[key]+"; ";
//			    }
				this.formInfo.questionDesc=[];
            	for(var key in row.questionDesc){
            		this.formInfo.questionDesc.push({
            			name:row.questionDesc[key].split(":")[0],
            			value:row.questionDesc[key].split(":")[1]
            		})
			    }
//          	console.log(JSON.stringify(this.formInfo.questionDesc))
            	if(row.status=="待处理"){
            		this.closeApplyFlag=true;
            		this.processedFlag=true;
            	}else{
            		this.closeApplyFlag=false;
            		this.processedFlag=false;
            	}
            	this.handleInfoDialog=true;
			},
			closeApply(){
            	this.handleLoading=true;
				this.formInfo.status="已关闭";
				let that = this;
				let params={
					"userId": this.userInfo.userCode,
					...this.formInfo
				}
				replyServeApply(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
						if(data.messageType == 'SUCCESS'){
							that.$message({
								message: data.messageContent,
								type: 'success'
							});
            				that.handleInfoDialog=false;
							that.showTable(that.page, that.limit);
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableLoading = false;
            			that.handleLoading=false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
            			that.handleLoading=false;
					});
			},
			processed(){
            	this.handleLoading=true;
				this.formInfo.status="已处理";
				let that = this;
				let params={
					"userId": this.userInfo.userCode,
					...this.formInfo
				}
				replyServeApply(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
						if(data.messageType == 'SUCCESS'){
							that.$message({
								message: data.messageContent,
								type: 'success'
							});
            				that.handleInfoDialog=false;
							that.showTable(that.page, that.limit);
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
						that.tableLoading = false;
            			that.handleLoading=false;
					})
					.catch(function(err) {
						// console.log(err);
						that.tableLoading = false;
            			that.handleLoading=false;
					});
			},
			loadingTypeData(){//查询条件 类型
				let that = this;
				let params={
					"userId": this.userInfo.userCode
				}
				selectApplyTypes(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						 console.log(data);
						if(data.messageType == 'SUCCESS'){
							that.typeData=data.messageContent;
						}else{
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
					});
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
//			console.log(JSON.stringify(this.roleBtn))
			this.showTable(this.page, this.limit);
			this.loadingTypeData();
			// 钩子函数 -- 初始化
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
	.dean-form .el-form-item{
		margin-bottom: 10px;
	}
	.el-button{
		margin-top:0;
	}
	.el-form {
		display: inline-block;
	}
	.disBlock{
		display: block;
	}
	.addValue{
		color: #008A00;
		margin-left: 10px;
		margin-top: 7px;
		cursor: pointer;
		float: right;
	}
	table {
		border-top: 1px solid #ebebeb;
		border-left: 1px solid #ebebeb;
		margin-top: 20px;
		width:240px;
		thead {
			background: #f5f7fa;
		}
		th,
		td {
			height: 40px;
			border-bottom: 1px solid #ebebeb;
			border-right: 1px solid #ebebeb;
			text-align: left;
			padding: 0 10px;
			min-width:120px;
		}
		tfoot td{
			text-align: center;		
			cursor: pointer;	
		}
		.el-input {
			width:65%;
			height:28px;
			float: left;
		}
	}
	.applySet{
		float: left;
		margin-right: 20px;
		padding-bottom: 20px;
	}
</style>