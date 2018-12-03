<!--工牌制作-导购二维码-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<el-radio-group v-model="radio" @change="radioChange" class="floatRight">
					<el-radio label="全部导购"></el-radio>
					<el-radio label="选择员工">选择员工
						<el-input placeholder="请选择员工" class="width120" :readonly="true" v-model="userName" ></el-input>
                 		<el-button @click="selectStaff" type="primary" :disabled="disabled">选择</el-button>
					</el-radio>
					<el-radio label="选取门店">选取门店
						<el-input placeholder="请选择门店" class="width120" :readonly="true" v-model="storeName" ></el-input>
                 		<el-button @click="selectStore" type="primary" :disabled="disabledStore">选择</el-button>
					</el-radio>
				</el-radio-group>
				<el-form :model="form" v-loading="this.tableLoading" ref="form" label-width="120px" class="demo-form">
					<el-tabs v-model="activeName" @tab-click="tabChange" class="tabsFirst">
						<el-tab-pane label="工牌" name="first">
							<el-checkbox-group v-model="checked">
								<el-checkbox @change="storeNameCheckedChange" label="店铺名称">店铺名称</el-checkbox>
								<el-checkbox @change="headUrlCheckedChange" label="头像">头像</el-checkbox>
								<el-checkbox @change="nameCheckedChange" label="姓名">姓名（职位）</el-checkbox>
								<el-checkbox @change="qrCodeCheckedChange" label="二维码">二维码</el-checkbox>
							</el-checkbox-group>
							<div class="box">
								<p class="title">xxx品牌旗舰店</p>
								<img :src="img_404" class="headerImg"/>
								<span class="name">张三 | 店长</span>
								<img :src="img_user" class="twoImg twoImgCode"/>
							</div>
						</el-tab-pane>
						<el-tab-pane label="仅二维码" name="second">
							<div class="box">
								<img :src="img_user" class="twoImg marTop88"/>
							</div>
						</el-tab-pane>
					</el-tabs>
					<el-row :gutter="10">
						<el-col :span="24" class="el-footer-btn-con marginTop10">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitForm">确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-dialog title="选择员工" :visible.sync="setDistributeShop" class="box50 dialogOne">
			    <el-form :inline="true" :model="formShop" class="demo-form-inline marginTop10">
		            <el-form-item class="floatRight">
		                <el-button type="primary" @click="onSubmitShop">查询</el-button>
		            </el-form-item>
				    <el-form-item label="" class="floatRight marginRight10">
						<el-input placeholder="请输入姓名、手机号" v-model="formShop.nameOrMobile"></el-input>
		            </el-form-item>
	            </el-form>
				<el-table ref="tableDataShop" v-loading="tableSelectLoading" :data="tableDataShop"   class="el-tableRadio" border @selection-change="handleSelectionShopChange">
	                <el-table-column type="index" width="50" label="序号"></el-table-column>
	                <el-table-column type="selection" width="50" label="选择"></el-table-column>
                    <el-table-column prop="userName" label="员工姓名"></el-table-column>
	                <el-table-column prop="userCode" label="员工编号"></el-table-column>
	                <el-table-column prop="mobile" label="电话"></el-table-column>
	            </el-table>
				<el-footer v-if="countShop!=0">
					<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countShop" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="setDistributeShop = false,formShop.nameOrMobile=''">取 消</el-button>
					<el-button type="primary" @click="setDistributeEnter">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="选择门店" :visible.sync="setDistributeStore" class="box50 dialogOne">
			    <el-form :inline="true" :model="formStore" class="demo-form-inline marginTop10">
		            <el-form-item class="floatRight">
		                <el-button type="primary" @click="onSubmitStore">查询</el-button>
		            </el-form-item>
				    <el-form-item label="" class="floatRight marginRight10">
						<el-input placeholder="请输入门店名称或门店编码" class="width200" v-model="formStore.searchContent"></el-input>
		            </el-form-item>
	            </el-form>
				<el-table ref="tableDataStore" v-loading="tableSelectLoading" :data="tableDataStore" class="el-tableRadio" highlight-current-row border @selection-change="handleSelectionStoreChange">
	                <el-table-column type="index" width="50" label="序号"></el-table-column>
	                <el-table-column type="selection" width="50" label="选择"></el-table-column>
	                <el-table-column prop="storeId" label="门店编码"></el-table-column>
	                <el-table-column prop="storeName" label="门店名称"></el-table-column>
	                <el-table-column prop="address" label="地址"></el-table-column>
	            </el-table>
				<el-footer v-if="countStore>limit">
					<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countStore" @current-change="handleCurrentChangeStore">
					</el-pagination>
				</el-footer>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="setDistributeStore = false,formStore.searchContent=''">取 消</el-button>
					<el-button type="primary" @click="setStoreEnter">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { selectStoreManagementShop } from '@/api/work/ShopManagement'
	import { cardProductionShop} from '@/api/work/cardProduction'
	import { selectStoreData } from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				radio: "全部导购",
				checked: ['店铺名称','头像','姓名','二维码'],
				activeName: "first",
				// 搜索数据
				storeName:'',
				userName:'',
				disabled:true,
				disabledStore:true,
	        	setDistributeShop:false,
	        	setDistributeStore:false,
	        	tableSelectLoading:false,
				form: {
					allEmployee:'是',
					userCode:'',
					storeId:'',
					storeName:'是',//店铺名称
					name:'是',//姓名（职务）
					headUrl: '是', // 头像
					qrCode: '是' //二维码
				},
				// 表格数据
				tableData: [{
					brandId: '',
					brandName: '',
					brandLogo: '',
					brandDesc: '',
					nickname: '',
					integralRuleName: ''
				}],
				img_404:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=371582480,3552328750&fm=200&gp=0.jpg',
				img_user:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526125987238&di=5b5512ac2c57ef2fe4e5631d6e191ff3&imgtype=0&src=http%3A%2F%2F5.pic.paopaoche.net%2Fup%2F2016-3%2F201634153158007.jpg',
	            formShop:{
	            	nameOrMobile:''
	            },
	            formStore:{
	            	searchContent:'',
	            },
				// 分页
				pageShop: 0, // 当前页
				countShop: 0, // 总条数
				limit: this.GLOBAL.limitDialog, // 条/页
				
				pageStore: 0, // 当前页
				countStore: 0, // 当前页
				tableDataShop:[],//员工
           		tableDataStore:[],//门店
				multipleSelectionShop:[],//员工  - 选择的数据
         	    multipleSelectionStore:{},//门店-选择的数据
				// 表格是否为加载状态
				tableLoading: false
			}
		},
		methods:{
			radioChange(val){
				if(val=="选取门店"){
					this.disabled=true;
					this.disabledStore=false;
					this.userName='';
					this.storeName='';
					this.form.allEmployee='';
					this.form.userCode='';
				}else if(val=="选择员工"){
					this.disabled=false;
					this.disabledStore=true;
					this.storeName='';
					this.form.allEmployee='';
					this.form.storeId='';
				}else{
					this.disabled=true;
					this.disabledStore=true;
					this.userName='';
					this.form.storeId='';
					this.form.userCode='';
					this.form.allEmployee='是';
				}
			},
			handleBack(){
				this.$router.push({
					name: '工牌制作'
				});
			},
			tabChange(tab,event){
				if(event.target.firstChild.data=="仅二维码"){
					this.form.storeName='';
					this.form.headUrl='';
					this.form.name='';
					this.form.qrCode='是';
				}else{
					this.form.storeName='是';
					this.form.headUrl='是';
					this.form.name='是';
					this.form.qrCode='是';
				}
			},
			//复选框
			storeNameCheckedChange(value){
				if(!value){
					this.form.storeName='';
					$(".title").hide();
				}else{
					this.form.storeName='是';
					$(".title").show();
				}
			},
			headUrlCheckedChange(value){
				if(!value){
					this.form.headUrl='';
					$(".headerImg").hide();
				}else{
					this.form.headUrl='是';
					$(".headerImg").show();
				}
			},
			nameCheckedChange(value){
				if(!value){
					this.form.name='';
					$(".name").hide();
				}else{
					this.form.name='是';
					$(".name").show();
				}
			},
			qrCodeCheckedChange(value){
				if(!value){
					this.form.qrCode='';
					$(".twoImgCode").hide();
				}else{
					this.form.qrCode='是';
					$(".twoImgCode").show();
				}
			},
			
			// 员工分页
			handleCurrentChange(val) {
				this.page = val;
				this.showTableShop(val, this.limit);
			},
			//选择数据员工
	        handleSelectionShopChange(val){
        		this.multipleSelectionShop = val;
	        },
	        //员工弹窗查询
	        onSubmitShop(){
				this.showTableShop('', this.limit);
	        },
	        //员工数据
	        showTableShop(start,limit){
	    		let that = this;
	        	let params={
	        		userId:this.userInfo.userCode,
	        		page:start,
	        		limit:limit,
	        		nameOrMobile:this.formShop.nameOrMobile
	        	}
//	        	console.log(JSON.stringify(params))
				that.tableSelectLoading=true;
				// 查询接口
				selectStoreManagementShop(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(data);
						that.tableSelectLoading=false;
						if(data.data) {
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.tableDataShop = result;
							that.countShop=data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
//						console.log(err);
					});
	    	},
			//选择员工
			selectStaff(){
	    		this.setDistributeShop=true;
				this.showTableShop(this.pageShop, this.limit);
			},
			//员工弹窗确定
			setDistributeEnter(){
				if(this.multipleSelectionShop.length==0){
					this.$message.warning('请选择员工！');
					return false;
				}
				this.multipleSelectionShop.forEach((val,index)=>{
					this.userName+=val.userName+",";
					this.form.userCode+=val.id+",";
				})
				this.userName=this.userName.substr(0,this.userName.length-1);
				this.form.userCode=this.form.userCode.substr(0,this.form.userCode.length-1);
	    		this.setDistributeShop=false;
			},
			
	        //查询门店
	        onSubmitStore(){
				this.showTableStore('', this.limit);
	        },
			// 门店列表分页
			handleCurrentChangeStore(val) {
				this.pageStore = val;
				this.showTableStore(val, this.limit);
			},
	        // 表格选择数据门店
	        handleSelectionStoreChange(val) {
	        	if(val){
		            this.multipleSelectionStore = val;
	        	}
	        },
			//选择门店
			selectStore(){
	        	this.setDistributeStore=true;
	        	this.showTableStore(this.pageStore,this.limit);
			},
			showTableStore(start,limit){
	    		let params ={
	    			userId:this.userInfo.userCode,
	    			page:start,
	    			limit:limit,
	    			searchContent:this.formStore.searchContent
	    		}
	    		let that =this;
				that.tableSelectLoading=true;
	//  		console.log(params)
	    		selectStoreData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						that.tableSelectLoading=false;
						if(data.data) {
	//						console.log(JSON.stringify(data))
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.tableDataStore = result;
							that.countStore=data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
	    	},
	    	//门店
	    	setStoreEnter(){
				if(this.multipleSelectionStore.length==0){
					this.$message.warning('请您选择门店！');
					return false;
				}
				let storeName='';
				let	storeId='';
				this.multipleSelectionStore.forEach((val,index)=>{
//					console.log(val)
					storeName+=val.storeName+",";
					storeId+=val.storeId+",";
				})
				this.storeName=storeName;
				this.form.storeId=storeId;
	    		this.setDistributeStore=false;
	    	},
			// 方法
			submitForm() {
				let that = this;
				if(this.radio=="选择员工"&&this.form.userCode==""){
					this.$message.warning('请您选择员工！');
					return false;
				}
				if(this.radio=="选取门店"&&this.form.storeId==""){
					this.$message.warning('请您选取门店！');
					return false;
				}
				let params= {
					userId:this.userInfo.userCode,
					...this.form
				}
				this.tableLoading=true;
//				console.log(params)
				cardProductionShop(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
//						console.log(data)
						if(data.messageType == 'SUCCESS') {
							that.tableLoading=false;
							that.$message.success(data.messageContent);
							that.$router.push({
								name: '工牌制作'
							});
						}else{
							that.tableLoading=false;
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						that.tableLoading=false;
						// console.log(err);
					});
			}
		},
		created() {
			// 钩子函数 -- 初始化
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
		margin-left: rem(20px);
	}
	.el-form-item--small.el-form-item{
		margin-right: 0;
	}
	.el-tabs{
		margin-bottom: 10px;
	}
	.box .title{
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		font-weight: bold;
		color: #000000;
		width: 100%;
		text-align: center;
		margin: 0;
	}
	.box .headerImg{
		width: 70px;
		height: 70px;
		border-radius: 50%;
		overflow: hidden;
		margin: 10px auto;
		display: block;
	}
	.box span{
		width: 100%;
		display: block;
		text-align: center;
		margin: 20px 0 0 0;
	}
	.box .twoImg{
		width:40%;
		display: block;
		margin:10px auto;
	}
	.box .marTop88{
		margin-top: 88px;
	}
	.width120{
		width: 120px;
	}
	.width200{
		width: 200px;
	}
	.tabsFirst{
		width:440px;
		height: 450px;
		border:1px solid #E1F3D8;
		padding: 0 20px 20px 20px;
		margin: 60px auto 0 auto;
	}
	.marginTop10{
		margin-top: 10px;
	}
	.marginRight10{
		margin-right: 10px;
	}
</style>