<!--分配专属导购-->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card>
                <el-form :inline="true" :model="form" class="demo-form-inline">
					<p class="selectContainer">
	                    <div class="floatRight">
	                    	<el-form-item label="专属导购:">
								<el-radio v-model="form.radio" @change="radioChange1" label="未分配导购">未分配导购</el-radio>
								<el-radio v-model="form.radio" @change="radioChange" label="导购">导购</el-radio>
								<el-input placeholder="请输入姓名、手机号或工号" class="width200" :disabled="radioDisablad" v-model="form.guideCodeParams" ></el-input>
		                    </el-form-item>
		                    <el-form-item label="消费者等级:">
		                        <el-select v-model="form.memberLevel" class="width200" placeholder="请选择消费者等级">
		                        	<el-option v-for="item in options" :key="item.key" :label="item.key" :value="item.key"></el-option>
		                        </el-select>
		                    </el-form-item>
		                    <el-form-item label="会员:">
								<el-input placeholder="请输入姓名、手机号" v-model="form.nameOrPhone"></el-input>
		                    </el-form-item>
	                    </div>
	                    <el-form-item class="select-btn-style">
	                        <el-button type="primary" @click="onSubmit">查询</el-button>
							<el-button type="primary" @click="onReset">重置</el-button>
	                    </el-form-item>
					</p>
                </el-form>
            </el-card>
            <el-card>
        	    <el-button type="primary" @click="allocation" v-if="roleBtn.addExclusiveGuidInfo">分配导购</el-button>
            </el-card>
        </el-header>
            <el-main>
            <el-card>
                <el-table v-loading="this.tableLoading" ref="tableData" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column type="selection" width="50" label="选择"></el-table-column>
                    <el-table-column prop="userName" label="会员姓名"></el-table-column>
                    <el-table-column prop="sex" label="性别"></el-table-column>
                    <el-table-column prop="memberLevel" label="等级"></el-table-column>
                    <el-table-column prop="mobile" label="手机号"></el-table-column>
                    <el-table-column prop="storeName" label="服务门店"></el-table-column>
                    <el-table-column prop="guideName" label="专属导购"></el-table-column>
                </el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background class="pagination" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" @size-change="handleSizeChange" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
            </el-card>
        </el-main>
        <el-dialog title="分配导购" :visible.sync="setDistributeShop" v-loading="setDistributeShoploading" class="box50 dialogOne">
		    <el-form :inline="true" :model="formShop" class="demo-form-inline marginTop10">
	            <el-form-item class="floatRight">
	                <el-button type="primary" @click="onSubmitShop">查询</el-button>
	            </el-form-item>
			    <el-form-item label="" class="floatRight marginRight10">
					<el-input placeholder="请输入姓名、手机号" v-model="formShop.nameOrMobile"></el-input>
	            </el-form-item>
	            <el-form-item label="" class="floatLeft">
					<span>不知道分配给谁?可以立即</span><el-button type="primary" class="marginLeft10" @click="onSubmitRandom">随机分配</el-button>
		    	</el-form-item>
            </el-form>
			<el-table ref="tableDataShop" v-loading="tableSelectLoading" :data="tableDataShop" class="el-tableRadio" highlight-current-row border @current-change="handleSelectionShopChange">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="userName" label="导购姓名"></el-table-column>
                <el-table-column prop="userCode" label="工号"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
            </el-table>
			<!-- 分页 -->
			<el-footer v-if="countShop!=0">
				<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limitDialog" :total="countShop" @current-change="handleCurrentShopChange">
				</el-pagination>
			</el-footer>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="setDistributeShop = false,formShop.nameOrMobile=''">取 消</el-button>
				<el-button type="primary" @click="setDistributeEnter">确 定</el-button>
			</div>
		</el-dialog>
  </el-container>
</template>
<script>
import { selectDistributeShop ,serDistribute} from '@/api/work/distributeShop'
import { selectStoreManagementShop } from '@/api/work/ShopManagement'
import { selectLevalInfo} from '@/api/public'
import { mapGetters } from 'vuex'
import { permission } from '@/utils'
export default {
    data() {
        return {
        	radioDisablad:true,
        	setDistributeShop:false,
        	setDistributeShoploading:false,
        	tableSelectLoading:false,
        	// 权限
			roleBtn: {
				addExclusiveGuidInfo:false,
			},
            // 数据
            form:{
            	radio:'',
            	nameOrPhone:'',
            	memberLevel:'',
            	guideCodeParams:''
            },
            formShop:{
            	nameOrMobile:''
            },
            options:[],
			//表格是否为加载状态
			tableLoading: false,
			// 活动分页
			page: 0, // 当前页
			count: 0, // 总条数
			pageShop: 0, // 当前页
			countShop: 0, // 总条数
			limitDialog: this.GLOBAL.limitDialog, // 条/
			limit: this.GLOBAL.limit, // 条/页
			// 表格数据
			tableData: [],//表格数据 - 会员
			tableDataShop:[],//分配的导购弹窗 - 表格数据 - 导购
			multipleSelection:[],//表格数据 - 会员 - 选择的数据
			multipleSelectionShop:{},//分配的导购弹窗 - 表格数据 - 导购  - 选择的数据
        }
    },
    methods: {
    	// 表格选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelectionShopChange(val){
        	if(val){
        		this.multipleSelectionShop = val;
        	}
        },
		handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit, this.formInline.searchInfo);
		},
    	onReset(){
    		this.form={
            	radio:'',
            	selectContent:'',
            	shelvesStatus:''
           };
    	},
    	radioChange(value){
			this.radioDisablad=false;
    	},
    	radioChange1(value){
    		this.radioDisablad=true;
    		this.form.guideCodeParams='';
    	},
		// 活动列表分页
		handleCurrentChange(val) {
			this.page = val;
			this.showTable(val, this.limit);
		},
		// 活动列表分页
		handleCurrentShopChange(val) {
			this.pageShop = val;
			this.showTableShop(val, this.limitDialog);
		},
        //查询
        onSubmit(){
			this.showTable('', this.limit);
        },
        //查询分配导购弹出
        onSubmitShop(){
			this.showTableShop(this.pageShop, this.limitDialog);
        },
    	showTable(start,limit){
    		let that = this;
        	let params={
        		userId:this.userInfo.userCode,
        		page:start,
        		limit:limit,
        		nameOrPhone:this.form.nameOrPhone,
        		memberLevel:this.form.memberLevel,
        		guideCodeParams:this.form.guideCodeParams,
        		noGuideCode:''
        	}
        	if(this.form.radio=="未分配导购"){
        		params.noGuideCode='是';
        	}
//      	console.log(JSON.stringify(params)+"12")
        	this.tableLoading = true;
				// 查询接口
			selectDistributeShop(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(data);
					if(data.data) {
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								...val
							});
						})
						that.tableData = result;
						that.tableLoading = false;
						that.count=data.count;
					} else if(data.messageType != 'SUCCESS') {
						that.$message.warning(data.messageContent);
						that.tableLoading = false;
					}
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
    	},
    	showTableShop(start,limit){
    		let that = this;
        	let params={
        		userId:this.userInfo.userCode,
        		page:start,
        		limit:limit,
        		nameOrMobile:this.formShop.nameOrMobile
        	}
//      	console.log(JSON.stringify(params))
			that.tableSelectLoading=true;
			// 查询接口
			selectStoreManagementShop(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(data);
					if(data.data) {
						let result = [];
						data.data.forEach((val, index) => {
							result.push({
								...val
							});
						})
						that.tableDataShop = result;
						that.tableSelectLoading = false;
						that.countShop=data.count;
					} else if(data.messageType != 'SUCCESS') {
						that.$message.warning(data.messageContent);
						that.tableSelectLoading = false;
					}
				})
				.catch(function(err) {
//					 console.log(err);
					that.tableSelectLoading = false;
				});
    	},
        //分配导购
        allocation(){
    		this.setDistributeShop=true;
			this.showTableShop(this.pageShop, this.limitDialog);
        },
        serDistributeFn(params){
        	let that = this;
//      	console.log(params);
        	serDistribute(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					if(data.messageType == 'SUCCESS') {
						that.$message.success(data.messageContent);
        				that.setDistributeShop=false;
						that.setDistributeShoploading = false;
						that.multipleSelectionShop={};
						that.showTable(that.page, that.limit);
					}else{
						that.$message.warning(data.messageContent);
						that.setDistributeShoploading = false;
					}
				})
				.catch(function(err) {
					// console.log(err);
					that.setDistributeShoploading = false;
				});
        },
        //随机分配
        onSubmitRandom(){
        	if(this.tableDataShop.length==0){
				this.$message.warning('当前没有可分配的导购！');
				return false;
        	}
			this.setDistributeShoploading = true;
			let param={
				"userId": this.userInfo.userCode,
				"guideId": ''
			};
        	if(this.form.radio=="未分配导购"){
        		param.noGuideCode='是';
        	}else{
        		param.noGuideCode='';
        	}
        	if(this.multipleSelection.length>0){
        		let params="";
        		this.multipleSelection.forEach((val,index)=>{
        			params+=val.id+",";
        		})
        		param.params=params;
        	}else{
				param.guideCodeParams=this.form.guideCodeParams;
				param.memberLevel=this.form.memberLevel;
				param.nameOrPhone=this.form.nameOrPhone;
        	}
			this.serDistributeFn(param);
        },
        //分配导购 弹出确认按钮
        setDistributeEnter(){
        	if(this.tableDataShop.length==0){
				this.$message.warning('当前没有可分配的导购！');
				return false;
        	}
        	if(this.multipleSelectionShop.id){
				let param={
					"userId": this.userInfo.userCode,
					"guideId": this.multipleSelectionShop.id
				};
	        	if(this.form.radio=="未分配导购"){
	        		param.noGuideCode='是';
	        	}else{
	        		param.noGuideCode='';
	        	}
	        	if(this.multipleSelection.length>0){
	        		let params="";
	        		this.multipleSelection.forEach((val,index)=>{
	        			params+=val.id+",";
	        		})
	        		param.params=params;
	        	}else{
					param.guideCodeParams=this.form.guideCodeParams;
					param.memberLevel=this.form.memberLevel;
					param.nameOrPhone=this.form.nameOrPhone;
	        	}
//	        	console.log(param)
				this.serDistributeFn(param);
        	}else{
				this.$message.warning('请您选择导购,或直接点击随机分配');
        	}
        }
    },
    created() {
    	let that = this;
    	let params={
    		userId:this.userInfo.userCode
    	}
    	selectLevalInfo(params)
			.then(function(res) {
				let data = JSON.parse(Base64.decode(res.data));
//				console.log(data)
				if(data.data) {
					that.options=data.data;
				}else{
					that.$message.warning(data.messageContent);
				}
			})
			.catch(function(err) {
			});
        // 钩子函数 -- 初始化
		this.showTable(this.page, this.limit);
		// 权限
		this.roleBtn = permission(this.roleBtn);
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
    display: block;
}
.width200{
	width: 200px;
}
.selectContainer{
	display: block;
	margin: 5px 0;
}
.marginLeft10{
	margin-left: 10px;
}
.marginRight10{
	margin-right: 10px;
}
.marginTop10{
	margin-top: 10px;
}
</style>