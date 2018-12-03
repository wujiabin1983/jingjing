<!--设备绑定-->
<template>
	<el-container class="app-container">
		<el-header>
			<el-card>
				<el-button type="primary" @click="shoppingGuide" v-if="roleBtn.addEquipmentBindInfo">添加设备</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="storeName" label="门店名称"></el-table-column>
					<el-table-column prop="equipmentId" label="绑定设备ID"></el-table-column>
					<el-table-column prop="remarks" label="备注"></el-table-column>
					<el-table-column prop="bindBy" label="绑定人"></el-table-column>
					<el-table-column prop="bindDate" label="绑定时间"></el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
					<el-table-column prop="action" label="操作" v-if="roleBtn.deleteEquipmentBindInfo&&roleBtn.updateEquipmentBindInfo&&roleBtn.bindPageInfo">
						<template slot-scope="scope">
							<!-- 功能图标 -->
							<!-- 修改 -->
							<el-tooltip class="item" content="绑定页面" placement="top" v-if="!scope.row.isEdit&&roleBtn.bindPageInfo">
								<icon-svg icon-class="bindingicon" id="icon-binding" @click.native.prevent="iconBinding(scope.$index, scope.row)" />
							</el-tooltip>
							<!-- 修改 -->
							<el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit&&roleBtn.updateEquipmentBindInfo">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteEquipmentBindInfo">
								<!-- 删除 -->
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
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
			<el-dialog title="绑定页面" :visible.sync="handleTabDialog" class="dialogOneImg">
				<template>
				    <el-form :inline="true" :model="form" class="demo-form-inline marginTop10">
			            <el-form-item class="floatRight">
			                <el-button type="primary" @click="onSubmitStore">查询</el-button>
			            </el-form-item>
					    <el-form-item label="" class="floatRight marginRight10">
							<el-input placeholder="请输入标题或关键字" class="width200" v-model="form.activityTitle"></el-input>
			            </el-form-item>
		            </el-form>
				    <el-table ref="bindingDataTab" :data="bindingDataTab" class="el-tableRadio" highlight-current-row @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<!--<el-table-column type="selection" width="50" label="选择"></el-table-column>-->
						<el-table-column prop="" label="请选择要绑定的页面">
							<template slot-scope="scope" >
	                    		<div class="page"><img :src="scope.row.activityUrl"/><span>{{scope.row.activityTitle}}</span><span>{{scope.row.activitySubtitle}}</span></div>
	                    	</template>
						</el-table-column>
						<el-table-column prop="type" label="页面类型"></el-table-column>
						<el-table-column prop="createdOn" label="创建时间"></el-table-column>
					</el-table>
	                <!-- 分页 -->
	                <el-footer v-if="count != 0">
	                    <el-pagination 
	                        background 
	                        class="pagination" 
	                        layout="total, prev, pager, next, jumper" 
	                        :page-size="limitBinding"
	                        :total="counts" 
	                        @current-change="handleBindingChange">
	                    </el-pagination>
	                </el-footer>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>import { selectDeviceBindingData, creatDeviceBindingData, deleteData,selectBindingInfo,BindingInfoFn } from '@/api/tool/deviceBinding'
import { mapGetters } from 'vuex'
import { permission } from '@/utils'
export default {
	data() {
		return {
			pages: 0, // 当前页
			limitBinding:4,
			counts:0,
			multipleBindingSelection:{},
			bindingDataTab:[],
			handleTabDialog:false,
			// 权限
			roleBtn: {
				"addEquipmentBindInfo": false,
				"updateEquipmentBindInfo": false,
				"deleteEquipmentBindInfo": false,
				"bindPageInfo":false
			},
			form:{
				activityTitle:''
			},
			bindingId:'',
			// 表格数据
			tableData: [{
				storeName: '',
				equipmentId: '',
				remarks: '',
				bindBy: '',
				bindDate: '',
				status: ''
			}],
			// 表格多选
			multipleSelection: [],
			// 表格是否为加载状态
			tableLoading: false,
			// 活动分页
			page: 0, // 当前页
			count: 0, // 总条数
			limit: this.GLOBAL.limit, // 条/页
		}
	},
	methods: {
		//查询
		onSubmitStore(){
			this.showTableBinding(this.pages, this.limitBinding);
		},
		//监听表格数据
		handleSelectionChangeTab(val){
			this.multipleBindingSelection=val;
		},
		//分页
		handleBindingChange(val){
			this.pages = val;
			this.showTableBinding(val, this.limitBinding);
		},
		//limit监听
		handleBindingSizeChange(val){
			this.limitBinding = val;
			this.showTableBinding(this.pages, val);
		},
		//弹出确认
		enterStore(){
			let param={
				userId: this.userInfo.userCode,
				id:this.bindingId,
				pageId:this.multipleBindingSelection.pageId
			}
			let that=this;
//			console.log(JSON.stringify(param))
			BindingInfoFn(param)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(JSON.stringify(data) + "返回值");
					if(data.messageType == 'SUCCESS') {
						that.$message.success(data.messageContent);
						that.handleTabDialog=false;
						that.showTableBinding(that.pages, that.limitBinding);
					} else {
						that.$message.warning(data.messageContent);
					}
				})
				.catch((err) => {
//					 console.log(err);
				});
//			console.log(JSON.stringify(this.multipleBindingSelection))
		},
		iconBinding(index,row){
			this.bindingId=row.id;
			this.handleTabDialog=true;
			this.showTableBinding(this.pages, this.limitBinding);
		},
		showTableBinding(start, limit) {
			// console.log(JSON.stringify(this.userInfo));
			let that = this;
			let params = {
				userId: this.userInfo.userCode,
				page: start,
				limit: limit,
                activityTitle: this.form.activityTitle
			}
			// console.log(JSON.stringify(params) + "入参")
			selectBindingInfo(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
//					 console.log(JSON.stringify(data) + "查询数据");
					let result = [];
					data.data.forEach((val, index) => {
						result.push({
							...val
						});
					})
					that.counts = data.count;
					that.bindingDataTab = result;
				})
				.catch(function(err) {
					// console.log(err);
				});
		},
		//添加设备
		// 表格选择数据
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 活动列表分页
		handleCurrentChange(val) {
			this.page = val;
			this.showTable(val, this.limit);
		},
		//主页面分页
		handleSizeChange(val) {
			this.limit = val;
			this.showTable(this.page, this.limit);
		},
		//新建门店送券规则
		shoppingGuide() {
			this.$router.push({
				name: '门店摇一摇设备绑定新增',
				params: {
					pageType: '添加'
				}
			});
		},
		// 图标 - 修改
		iconXiugai(index, row) {
			var data = JSON.stringify(row);
			this.$router.push({
				name: '门店摇一摇设备绑定修改',
				params: {
					pageType: '修改',
					formData: data
				}
			});
		},
		// 图标 - 删除
		iconShanchu(index, row) {
			let that = this;
			this.tableLoading = true;
			this.$confirm('您确定要删除吗, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let param = {
					"userId": this.userInfo.userCode,
					"id": row.id
				}
				// console.log(JSON.stringify(param) + "入参")
				deleteData(param)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						// console.log(JSON.stringify(data) + "返回值");
						if(data.messageType == 'SUCCESS') {
							that.tableLoading = false;
							that.$message.success(data.messageContent);
							that.showTable(that.page, that.limit, that.form);
						} else {
							that.tableLoading = false;
							that.$message.error(data.messageContent);
						}
					})
					.catch((err) => {
						that.tableLoading = false;
						// console.log(err);
					});
			}).catch(() => {
				this.tableLoading = true;
			});
		},
		showTable(start, limit) {
			// console.log(JSON.stringify(this.userInfo));
			let that = this;
			let params = {
				userId: this.userInfo.userCode,
				page: start,
				limit: limit
			}
			// 使表格加载
			this.tableLoading = true;
			// 查询接口
			// console.log(JSON.stringify(params) + "入参")
			selectDeviceBindingData(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					// console.log(JSON.stringify(data) + "查询数据");
					let result = [];
					data.data.forEach((val, index) => {
						result.push({
							isEdit: false,

							...val
						});
					})
					that.count = data.count;
					that.tableData = result;
					that.tableLoading = false;
				})
				.catch(function(err) {
					// console.log(err);
					that.tableLoading = false;
				});
		},
	},
	created() {
		this.showTable(this.page, this.limit);
		// 钩子函数 -- 初始化
		// 权限
		this.roleBtn = permission(this.roleBtn);
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
<style rel="stylesheet/scss" lang="scss" scoped>@import "src/styles/_function.scss";
.el-card {
	width: 100%;
}
.page{
	width:160px;
	overflow: hidden;
}
.page img{
	width: 50%;
	height: 60px;
	float: left;
}
.page span{
	float: left;
	width: 50%;
	height:30px;
	padding: 0 10px;
	box-sizing: border-box;
}
.el-form {
	display: inline-block;
	/*margin-left: rem(20px);*/
	width: 100%;
}
.marginTop10{
	margin-top: 10px;
}
.marginRight10{
	margin-right: 10px;
}
.width200{
	width: 200px;
}
</style>