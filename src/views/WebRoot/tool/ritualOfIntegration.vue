<!--积分兑礼-->
<template>
    <el-container class="app-container">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="width100">
			<el-tab-pane label="礼品列表" name="first">
				<el-header>
		            <el-card>
		                <el-form :inline="true" :model="form" class="demo-form-inline">
		                    <el-form-item class="floatLeft">
		                        <el-button type="primary" @click="shoppingGuide" v-if="roleBtn.addGiftConfigInfo">新增礼品</el-button>
		                    </el-form-item>
		                	<div class="floatRight">
		                		<el-form-item label="状态">
			                        <el-select v-model="form.status" clearable placeholder="请选择状态">
										<el-option label="未审核" value="未审核"></el-option>
										<el-option label="已生效" value="已生效"></el-option>
										<el-option label="执行中" value="执行中"></el-option>
										<el-option label="已停止" value="已停止"></el-option>
										<el-option label="已结束" value="已结束"></el-option>
			                        </el-select>
			                    </el-form-item>
			                    <el-form-item>
			                        <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
			                    </el-form-item>
			                    <el-form-item>
			                		<el-button type="primary" @click="onSubmit">查询</el-button>
			                		<el-button type="primary" @click="onReset">重置</el-button>
			                    </el-form-item>
		                	</div>
		                </el-form>
		            </el-card>
		        </el-header>
            <el-card>
                <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                    <!--<el-table-column type="index" width="50" label="序号"></el-table-column>-->
                    <el-table-column prop="goodName" label="商品" width="190">
                    	<template slot-scope="scope" >
                    		<div class="page"><img :src="scope.row.goodUrl"/><span>{{scope.row.goodName}}</span><span>{{scope.row.goodCode}}</span><span>￥{{scope.row.salePrice}}元</span></div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="activityName" label="活动名称"></el-table-column>
                    <el-table-column prop="" width="180px"  label="兑换有效期">
                    	<template slot-scope="scope" >
                			{{scope.row.validityDateBegin+" ~ "+scope.row.validityDateEnd}}
                    	</template>
                    </el-table-column>
                    <el-table-column prop="goodType" width="80px" label="礼品类型"></el-table-column>
                    <el-table-column prop="totalNum" width="100px" label="可兑换总数"></el-table-column>
                    <el-table-column prop="residualQty" width="80px" label="剩余数量"></el-table-column>
                    <el-table-column prop="status"  width="100px" label="活动状态"></el-table-column>
                    <el-table-column prop="action" label="操作" width="120">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <!-- 查看 -->
                            <el-tooltip class="item" content="查看" placement="top" v-if="!scope.row.isEdit">
                                <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconShow(scope.$index, tableDataOther)"/>
                            </el-tooltip>
                            <!-- 修改 -->
                            <el-tooltip class="item" content="修改" placement="top"  v-if="scope.row.status == '已生效'&&roleBtn.updateGiftConfigInfo">
                                <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconEdit(scope.$index, tableDataOther)"/>
                            </el-tooltip>
                             <!-- 启用 -->
                            <el-tooltip class="item" content="启用" placement="top" v-if="scope.row.status == '已停止'&&roleBtn.enableGiftConfigInfo">
                     	    	<icon-svg icon-class="qiyong" id="icon-qiyong" @click.native.prevent="iconQiyong(scope.$index, scope.row)"/>
                            </el-tooltip>
                            <!-- 停止 -->
                            <el-tooltip class="item" content="停止 " placement="top" v-if="scope.row.status == '执行中'&&roleBtn.disableGiftConfigInfo">
                            	<icon-svg icon-class="tingzhi" id="icon-tingzhi" @click.native.prevent="iconTingzhi(scope.$index, scope.row)"/>
                            </el-tooltip>
                             <!-- 复制链接 -->
	                        <el-tooltip class="item" content="复制链接" placement="top" v-if="roleBtn.copyGiftConfigInfo">
	                            <icon-svg icon-class="copyLink" id="icon-copyLink" @click.native.prevent="iconCopyTemplate(scope.$index, scope.row)"/>
	                        </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
	            <!-- 分页 -->
	            <el-footer v-if="count != 0">
	                <el-pagination 
	                    background 
	                    class="pagination" 
	                    layout="prev, pager, next, jumper" 
	                    :page-size="limit"
	                    :total="count" 
	                    @size-change="handleSizeChange"
	                    @current-change="handleCurrentChange">
	                </el-pagination>
	            </el-footer>
            </el-card>
		</el-tab-pane>
		<el-tab-pane label="订单管理" name="second">
			<el-header>
	            <el-card>
					<el-form :inline="true" :model="formTab" class="demo-form-inline">
	                    <div class="floatRight">
	                    	<el-form-item label="订单号">
		                        <el-input v-model="formTab.orderNum" class="width140" placeholder="请输入订单号"></el-input>
		                    </el-form-item>
		                     <el-form-item label="收货人姓名">
		                        <el-input v-model="formTab.consigneeName" class="width140" placeholder="请输入收货人姓名"></el-input>
		                    </el-form-item>
		                     <el-form-item label="收货人电话">
		                        <el-input v-model="formTab.consigneeTel" class="width140" placeholder="请输入收货人电话"></el-input>
		                    </el-form-item>
		                     <el-form-item  label="下单时间">
		                         <el-date-picker
							      v-model="timeRangeArr"
							      :editable="false" 
							      @change="selectDate"
							      format="yyyy 年 MM 月 dd 日" 
							      value-format="yyyy-MM-dd"
							      type="daterange"
							      range-separator="至"
							      start-placeholder="开始日期"
							      end-placeholder="结束日期">
							    </el-date-picker>
		                    </el-form-item>
		                    <el-form-item class="select-btn-style">
		                        <el-button type="primary" @click="onSubmitTab">查询</el-button>
		                        <el-button type="primary" @click="onResetTab">重置</el-button>
		                    </el-form-item>
	                    </div>
	                </el-form>
	            </el-card>
	            <el-card>
            	    <el-button type="primary" @click="uploadOut" v-if="roleBtn.exportOrderInfo">导出订单</el-button>
	            </el-card>
	        </el-header>
            <el-card>
                <el-table ref="tableDataTab" v-loading="this.tableLoading" :data="tableDataTab" @selection-change="handleSelectionChangeTab">
                    <!--<el-table-column type="index" width="50" label="序号"></el-table-column>-->
                    <el-table-column type="selection" width="50" label="选择"></el-table-column>
                    <el-table-column prop="" label="订单号/下单时间" width="150">
                    	<template slot-scope="scope">
                    		<div>{{scope.row.orderNum}}</div>
                    		<div>{{scope.row.orderDate}}</div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="" label="商品" width="240">
                    	<template slot-scope="scope">
                    		<div class="page">
                    			<img :src="scope.row.goodUrl"/>
                    			<span>{{scope.row.goodName}}</span>
                    			<span>{{scope.row.goodCode}}</span>
                    			<span>￥{{scope.row.salePrice}}</span>
                    		</div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="" label="数量/价格" width="90">
                    	<template slot-scope="scope">
                    		<div>{{scope.row.qty}}/{{scope.row.salePrice}}元</div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="createdOn" label="买家信息" width="100px">
                    	<template slot-scope="scope">
                    		<div>{{scope.row.menName}}</div>
                    		<div>{{scope.row.consigneeName}}</div>
                    		<div>{{scope.row.consigneeTel}}</div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="payIntegral" label="实付积分"></el-table-column>
                    <el-table-column prop="couStatus" label="券状态"></el-table-column>
                    <el-table-column prop="payAmount" label="实付金额">
                    	<template slot-scope="scope">
                    		<div>￥{{scope.row.payAmount}}</div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="orderIntegral" label="兑换积分"></el-table-column>
                    <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
                    <el-table-column prop="action" width="50" label="操作">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <!-- 查看详情 -->
                            <el-tooltip class="item" content="查看详情" placement="top">
                                <icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="iconInfo(scope.$index,tableDataTabOther)"/>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-footer v-if="count != 0">
                    <el-pagination 
                        background 
                        class="pagination" 
                        layout="prev, pager, next, jumper" 
                        :page-size="limitTab"
                        :total="countTab" 
                        @size-change="handleSizeChangeTab"
                        @current-change="handleCurrentChangeTab">
                    </el-pagination>
                </el-footer>
            </el-card>
		</el-tab-pane>
		</el-tabs>
		<el-dialog title="订单详情" :visible.sync="orderInfoDialog" class="orderInfoDialog">
			<el-form :model="orderForm" ref="orderForm" class="orderDialog">
				<el-form-item label="订单号" :label-width="formLabelWidth">
					<el-input v-model="orderForm.orderNum" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="下单时间" :label-width="formLabelWidth">
					<el-input v-model="orderForm.orderDate" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="商品名称" :label-width="formLabelWidth">
					<el-input v-model="orderForm.goodName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="商品编码" :label-width="formLabelWidth">
					<el-input v-model="orderForm.goodCode" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="商品价格" :label-width="formLabelWidth">
					<el-input v-model="orderForm.salePrice" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="买家名称" :label-width="formLabelWidth">
					<el-input v-model="orderForm.menName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="自提人姓名" :label-width="formLabelWidth">
					<el-input v-model="orderForm.consigneeName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" :label-width="formLabelWidth">
					<el-input v-model="orderForm.consigneeTel" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="兑换积分" :label-width="formLabelWidth">
					<el-input v-model="orderForm.orderIntegral" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="实付积分" :label-width="formLabelWidth">
					<el-input v-model="orderForm.payIntegral" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="实付金额" :label-width="formLabelWidth">
					<el-input v-model="orderForm.payAmount" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="活动所属门店" :label-width="formLabelWidth">
					<el-input v-model="orderForm.serviceStroeName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="自提门店" :label-width="formLabelWidth">
					<el-input v-model="orderForm.storeName" :disabled="true"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="closeOrderInfo">关 闭</el-button>
			</div>
		</el-dialog>
	    <el-dialog title="" :visible.sync="handleQrcode">
			<qrcode :qrcodeUrl="qrcodeUrl" ref="qrcode"></qrcode>
			<div slot="footer" class="dialog-footer overHidden">
				<el-button @click="handleQrcode = false">取 消</el-button>
			</div>
	    </el-dialog>
  	</el-container>
</template>
<script>
import {selectRitualData,selectOrderData,beginRitual,stopRitual,exportData,creatRitualQrcode} from '@/api/tool/ritualOflntegration'
import { mapGetters } from 'vuex'
import Cookie from 'js-cookie'
import qrcode from '@/components/tool/qrcode'
import { permission } from '@/utils'
export default {
    data() {
        return {
        	formLabelWidth:"110px",
        	orderInfoDialog:false,
        	qrcodeUrl: '',
        	handleQrcode:false,
        	orderForm:{},
        	timeRangeArr:[],
        	// 搜索数据
        	// 权限
			roleBtn: {
				"addGiftConfigInfo":false,
                "updateGiftConfigInfo":false,
                "enableGiftConfigInfo":false,
                "disableGiftConfigInfo":false,
                "copyGiftConfigInfo":false,
				"exportOrderInfo":false
			},
            form: {
                status: '', // 活动状态
                activityName:''//活动名称
            },
            formTab: {
                orderNum: '', //活动类型
                consigneeName:'',//活动名称
                consigneeTel:'',
                orderDateBegin:'',
                orderDateEnd:''
            },
            activeName:'first',
            // 表格数据
            tableData: [],
            tableDataOther: [],
            // 表格数据
            tableDataTab: [],
            tableDataTabOther: [],
            // 表格多选
            multipleSelection: [],
            multipleSelectionTab: [],
            // 表格是否为加载状态
            tableLoading: false,
            // 活动分页
            page: 0, // 当前页
            count: 0, // 总条数
            limit: this.GLOBAL.limit, // 条/页
			rules: {
                reasonForRejection: [
                    { required: true, message: '请输入驳回理由', trigger: 'change' },
                    { max: 100, message: '最小长度为20', trigger: 'change' }       
                ]
            },
            // 订单分页
            pageTab: 0, // 当前页
            countTab: 0, // 总条数
            limitTab: this.GLOBAL.limit // 条/页
        }
    },
    components: {
    	qrcode
	},
    methods: {
    	//tab切换
    	handleClick(tab, event) {
			// console.log(event.target.firstChild.data);
			let type=event.target.firstChild.data;
			if(type=="礼品列表"){
            	this.showTable(this.page, this.limit, this.form);
			}else{
				this.showTableTab(this.pageTab, this.limitTab, this.formTab);
			}
    	},
    	// 活动列表表格选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    	// 订单列表表格选择数据
        handleSelectionChangeTab(val) {
            this.multipleSelectionTab = val;
        },
    	// 活动列表分页
        handleCurrentChange(val) {
            this.page = val;
            this.showTable(val, this.limit, this.form);
        },
    	// 订单列表分页
        handleCurrentChangeTab(val) {
            this.page = val;
            this.showTableTab(val, this.limit, this.formTab);
        },
        // 活动列表查询按钮
        onSubmit() {
        	this.showTable('', this.limit,this.form);
        },
        onReset(){
        	this.form={
                status: '', // 活动状态
                activityName:''//活动名称
            };
        },
        // 订单列表查询按钮
        onSubmitTab() {
        	this.showTableTab('', this.limitTab,this.formTab);
        },
        onResetTab(){
        	this.formTab={
                orderNum: '', //活动类型
                consigneeName:'',//活动名称
                consigneeTel:'',
                orderDateBegin:'',
                orderDateEnd:''
           };
           this.timeRangeArr=[];
        },
        handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit,this.formTab,this.form);
		},
		handleSizeChangeTab(val) {
			this.limitTab = val;
			this.showTableTab(this.pageTab, this.limitTab,this.formTab);
		},
        //查询 - 下单时间
        selectDate(val){
        	this.formTab.orderDateBegin=val[0];
        	this.formTab.orderDateEnd=val[1];
        },
        //导出订单
        uploadOut(){
        	let params = '';
			this.multipleSelectionTab.forEach((val, index) => {
				params += val.id + ',';
			})
			var param = {
				"userId": this.userInfo.userCode,
				"params": params,
				...this.formTab
			}
			// console.log(param);
			this.tableLoading = true;
			exportData(param)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
					// console.log(JSON.stringify(data) + "导出返回值");
					if(data.messageType == 'SUCCESS') {
						window.location.href = Cookie.get("baseUrl") + data.messageContent;
					} else {
						this.$message.error(data.messageContent);
					}
				})
				.catch((err) => {
					// console.log(err);
				});
			this.tableLoading = false;
        },
        //活动列表查询方法
        showTable(start, limit, searchContent) {
            let that = this;
            let params = {
                userId: this.userInfo.userCode,
                page: start,
                limit: limit,
                status: searchContent.status,
                activityName: searchContent.activityName
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
        //  console.log(params)
            selectRitualData(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    let result = [];
                    let resultOther = [];
//              	console.log(JSON.stringify(data));
					if(data.data){
	                    data.data.forEach((val, index) => {
	                        resultOther.push({
	                            isEdit: false,
	                            ...val
	                        });
	                    })
	                    data.data.forEach((val, index) => {
	                        result.push({
	                            isEdit: false,
	                            ...val,
                           	 	goodUrl: val.goodUrl.main.attaUrl
	                        });
	                    })
	            		that.count = data.count;
	                    that.tableData = result;
	                    that.tableDataOther = resultOther;
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
        //订单列表查询方法
        showTableTab(start, limit, searchContent) {
            let that = this;
            let params = {
                userId: this.userInfo.userCode,
                page: start,
                limit: limit,
                orderNum: searchContent.consigneeName,
                consigneeName: searchContent.consigneeName,
                consigneeTel:searchContent.consigneeTel,
                orderDateBegin:'',
                orderDateEnd:''
            }
            if(this.timeRangeArr.length>0){
            	params.orderDateBegin=this.timeRangeArr[0];
            	params.orderDateEnd=this.timeRangeArr[1];
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
//             console.log(params)
            selectOrderData(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    // console.log(JSON.stringify(data)+"订单列表");
                    let result = [];
                    let resultOther = [];
					if(data.data){
	                    data.data.forEach((val, index) => {
	                        result.push({
	                            isEdit: false,
	                            ...val,
                           	 	goodUrl: val.goodUrl.main.attaUrl
	                        });
	                    })
	                    data.data.forEach((val, index) => {
	                        resultOther.push({
	                            isEdit: false,
	                            ...val
	                        });
	                    })
	            		that.countTab = data.count;
	                    that.tableDataTab = result;
	                    that.tableDataTabOther = resultOther;
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
        //新增
        shoppingGuide(){
            this.$router.push({
                name: '积分商城积分兑礼新增',
                params: {
                    pageType: '添加'
                }
            });
        },
        closeOrderInfo(){
        	this.orderInfoDialog = false;
        },
        // 订单 - 查看详情
        iconInfo(index, row) {
			this.orderForm=row[index];
			this.orderInfoDialog=true;
//         	var that = this;
//             var params =  {
//             	userId : this.userInfo.userCode,
//             	id : row.id
//             };
//             selectActivityInfo(params)
//                 .then(function(res) {
//                     let data = JSON.parse(Base64.decode(res.data));
//                     let result = [];
// //                  console.log(JSON.stringify(data))
// 					if(data.messageType != 'SUCCESS') {
// 							that.$message({
// 								message: data.messageContent,
// 								type: 'warning'
// 							});
// 					}else{
// 			            that.$router.push({
// 			                name: '积分商城积分兑礼查询',
// 			                params: {
// 			                    pageType: '查看',
// 			                    formData: JSON.stringify(data.messageContent)
// 			                }
// 			            });
// 					}
//                     that.tableLoading = false;
//                 })
//                 .catch(function(err) {
//                     // console.log(err);
//                     that.tableLoading = false;
//                 });
        },
        // 活动列表图标 - 修改
        iconEdit(index, row) {
//    	 	console.log(row[index].version)
//    	 	console.log(JSON.stringify(row[index]))
            this.$router.push({
                name: '积分商城积分兑礼修改',
                params: {
                    pageType: '修改',
                    formData: JSON.stringify(row[index])
                }
            });
	    },
        // 活动列表图标 - 开启
        iconQiyong(index, row) {
        	let that = this;
            this.tableLoading = true;
        	this.$confirm('您确定要启用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	id:row.id,
		            	version:row.version
		            };
		            // console.log(params)
		        	beginRitual(params)
		                .then(function(res) {
		                    let data = JSON.parse(Base64.decode(res.data));
		                    // console.log(data);
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		                        that.tableLoading = false;
		        				that.showTable(that.page, that.limit,that.form);
		                    }else {
		                        that.$message.warning(data.messageContent);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
        },
        // 活动列表图标 - 停止
        iconTingzhi(index, row) {
        	let that = this;
            this.tableLoading = true;
        	this.$confirm('您确定要禁用这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	id:row.id,
		            	version:row.version
		            };
//		             console.log(params)
		        	stopRitual(params)
		                .then(function(res) {
		                    let data = JSON.parse(Base64.decode(res.data));
		                    // console.log(data);
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		                        that.tableLoading = false;
		        				that.showTable(that.page, that.limit,that.form);
		                    }else {
		                        that.$message.error(data.messageContent);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }).catch(() => {
					that.tableLoading = false;
				});
        },
        // 订单列表图标 - 查看详情
        iconShow(index, row) {
            var data = JSON.stringify(row[index]);
            this.$router.push({
                name: '积分商城积分兑礼查询',
                params: {
                    pageType: '查看',
                    formData: data
                }
            });
        },
        // 订单列表图标 - 通过
        iconAudioYes(index, row) {
            let that = this;
            that.tableLoading = true;
        	this.$confirm('您确定要审核通过这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		            var params = {
		                userId: this.userInfo.userCode,
		            	version:row.version,
		            	id:row.id
		            };
		            // console.log(params)
		        	audioYesData(params)
		                .then(function(res) {
		                //  console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
		        				that.showTable(that.page, that.limit,that.form);
		                        that.tableLoading = false;
		                    }else {
		        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
		        				that.showTable(that.page, that.limit,that.form);
		                        that.$message.warning(data.messageContent);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
	            }).catch(() => {
					that.tableLoading = false;
				});
        },
        //驳回弹窗确定
        addLabelFn(){
            this.handleStoreDialog=false;
			this.$refs['formName'].validate((valid) => {
				if(valid) {
		        	var params = {
		                userId: this.userInfo.userCode,
		            	id:this.selectData.id,
            			version:this.selectData.version,
		            	reclaimRemark :this.formAudio.reasonForRejection
		            };
		            // console.log(JSON.stringify(params))
		            let that = this;
		        	audioNoData(params)
		                .then(function(res) {
		                    // console.log(res);
		                    let data = JSON.parse(Base64.decode(res.data));
		                    if(data.messageType == 'SUCCESS') {
		                        that.$message.success(data.messageContent);
		        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
		        				that.showTable(that.page, that.limit,that.form);
		                        that.tableLoading = false;
		                    }else {
		                        that.$message.error(data.messageContent);
		        				that.showTableTab(that.pageTab, that.limitTab,that.formTab);
		        				that.showTable(that.page, that.limit,that.form);
		                        that.tableLoading = false;
		                    }
		                })
		                .catch(function(err) {
		                    // console.log(err);
		                    that.tableLoading = false;
		                });
                }
			});
        },
        // 订单列表图标 - 驳回
        iconAudioNo(index, row) {
            let that = this;
            that.tableLoading = true;
        	this.$confirm('您确定要审核驳回这条数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
		         	this.selectData=this.tableDataTab[index];
		            this.handleStoreDialog=true;
          		}).catch(() => {
					that.tableLoading = false;
				});
        },
        //复制链接
	    iconCopyTemplate(index,row){
//	    	console.log(row.id)
        	var params = {
                userId: this.userInfo.userCode,
            	id:row.id
            };
            let that = this;
	    	creatRitualQrcode(params)
                .then(function(res) {
                    // console.log(res);
                    let data = JSON.parse(Base64.decode(res.data));
//                  console.log(JSON.stringify(data))
                    if(data.messageType == 'SUCCESS') {
	    				that.handleQrcode=true;
	    				that.qrcodeUrl=data.messageContent;
						that.$nextTick(function(){
							that.$refs['qrcode'].qrcode();
						})
		         	}else {
                        that.$message.warning(data.messageContent);
                    }
                })
                .catch(function(err) {
//                     console.log(err);
                });
	    }
    },
    created() {
		this.showTable(this.page, this.limit,this.form);
        // 钩子函数 -- 初始化
        
		// 权限
		this.roleBtn = permission(this.roleBtn);
        sessionStorage.removeItem("dataOne");
        sessionStorage.removeItem("dataTwo");
        sessionStorage.removeItem("dataThree");
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
.el-form {
	display: unset;
	.el-form-item {
		margin-bottom: 10px;
	}
}
.el-form--inline .el-form-item{
	margin-bottom: 10px;
}
.form .el-form--inline .el-form-item{
	margin-bottom: 18px;
}
.page{
	overflow: hidden;
}
.page img{
	width: 80px;
	height:80px;
	float: left;
}
.page span{
	float: right;
	width: 90px;
	line-height:24px;
	padding: 0 4px;
	box-sizing: border-box;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.orderDialog{
	display: block;
	overflow: hidden;
}
.orderDialog .el-form-item{
	width:33.3%;
	float: left;
}
.width140{
	width: 140px;
}
</style>