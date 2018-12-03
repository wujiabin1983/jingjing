<!--工牌制作-门店二维码-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-card>
				<div class="radio-group"><div class="label">选择范围：</div><el-radio-group v-model="radio" @change="radioChange">
							<el-radio label="全部门店">全部门店</el-radio>
							<el-radio label="选取门店">选取门店
								<el-input placeholder="请选择门店"  class="storeInput" :readonly="true" v-model="storeName" ></el-input>
		                 		<el-button @click="selectStore" type="primary" :disabled="disabledStore">选择</el-button>
							</el-radio>
						</el-radio-group></div>
                <div class="radio-group"><div class="label">扫码路径：</div><el-radio-group v-model="radio1" @change="radioPathChange">
						<el-radio label="关注服务号">关注服务号</el-radio>
						<el-radio label="领取微信卡">领取微信卡</el-radio>
					</el-radio-group></div>	
				<el-form :model="form" ref="form" v-loading="this.tableLoading" label-width="120px" class="demo-form">
					<el-tabs v-model="activeName" class="form-tabs" @tab-click="tabChange">
						<el-tab-pane label="工牌" name="first">
							<div class="box">
								<p class="title">xxx品牌旗舰店</p>
								<img :src="img_user" class="headerImg" />
								<img :src="img_404" class="twoImg" />
							</div>
						</el-tab-pane>
						<el-tab-pane label="仅二维码" name="second">
							<div class="box">
								<img :src="img_404" class="twoImg marTop88" />
							</div>
						</el-tab-pane>
					</el-tabs>
					<el-row :gutter="10">
						<el-col :span="24" class="footer">
							<el-button @click="handleBack">返回</el-button>
							<el-button type="primary" @click="submitForm('form')">确定</el-button>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-dialog title="选择门店" :visible.sync="setDistributeStore" class="box50 dialogOne">
			    <el-form :inline="true" :model="formStore" class="demo-form-inline marginTop10">
		            <el-form-item class="floatRight">
		                <el-button type="primary" @click="onSubmitStore">查询</el-button>
		            </el-form-item>
				    <el-form-item label="" class="floatRight marginRight10">
						<el-input placeholder="请输入门店名称或门店编码" class="width200" v-model="formStore.searchContent"></el-input>
		            </el-form-item>
	            </el-form>
				<el-table ref="tableDataStore" v-loading="tableSelectLoading" :data="tableDataStore" class="el-tableRadio" border @selection-change="handleSelectionStoreChange">
	                <el-table-column type="index" width="50" label="序号"></el-table-column>
	                <el-table-column type="selection" width="50" label="选择"></el-table-column>
	                <el-table-column prop="storeId" label="门店编码"></el-table-column>
	                <el-table-column prop="storeName" label="门店名称"></el-table-column>
	                <el-table-column prop="address" label="地址"></el-table-column>
	            </el-table>
				<!-- 分页 -->
				<el-footer v-if="countStore>limit">
					<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countStore" @current-change="handleCurrentChangeStore">
					</el-pagination>
				</el-footer>
				<div slot="footer" class="dialog-footer">
					<el-button @click="setDistributeStore = false,formStore.searchContent=''">取 消</el-button>
					<el-button type="primary" @click="setStoreEnter">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { cardProductionStore} from '@/api/work/cardProduction'
	import { selectStoreData } from '@/api/public'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				radio: "全部门店",
				radio1: "关注服务号",
				activeName: "first",
				// 搜索数据
				form: {
					"allStore":"是",
					"storeId":"",
					"pubNum":"是",
					"weCard":"",
					"name":"是"
				},
	            formStore:{
	            	searchContent:'',
	            },
				img_user:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=371582480,3552328750&fm=200&gp=0.jpg',
				img_404:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526125987238&di=5b5512ac2c57ef2fe4e5631d6e191ff3&imgtype=0&src=http%3A%2F%2F5.pic.paopaoche.net%2Fup%2F2016-3%2F201634153158007.jpg',
	            setDistributeStore:false,
				storeName:'',
				disabledStore:true,
				// 表格是否为加载状态
				tableSelectLoading:false,
				tableLoading: false,
				limit: this.GLOBAL.limitDialog, // 条/页
				tableDataStore:[],
				multipleSelectionStore:{},
				pageStore: 0, // 当前页
				countStore: 0, // 当前页
			}
		},
		methods: {
			radioChange(val){
				if(val=="选取门店"){
					this.form.allStore='';
					this.disabledStore=false;
				}else{
					this.disabledStore=true;
					this.storeName='';
					this.form.allStore='是';
				}
			},
			radioPathChange(val){
				if(val=="关注服务号"){
					this.form.pubNum='是';
					this.form.weCard='';
				}else{
					this.form.pubNum='';
					this.form.weCard='是';
				}
			},
			handleClick(tab, event) {
				if(event.target.firstChild.data=="仅二维码"){
					this.form.name='';
				}else{
					this.form.name='是';
				}
			},
			tabChange(tab,event){
				if(event.target.firstChild.data=="仅二维码"){
					this.form.name='';
				}else{
					this.form.name='是';
				}
			},
			handleBack() {
				this.$router.push({
					name: '工牌制作'
				});
			},
			//复选框
			handleCheckedChange(value) {
				if(!value) {
					$(".title").hide();
				} else {
					$(".title").show();
				}
			},
			handleCheckedChange1(value) {
				if(!value) {
					$(".headerImg").hide();
				} else {
					$(".headerImg").show();
				}
			},
			handleCheckedChange2(value) {
				if(!value) {
					$(".name").hide();
				} else {
					$(".name").show();
				}
			},
			handleCheckedChange3(value) {
				if(!value) {
					$(".twoImg").hide();
				} else {
					$(".twoImg").show();
				}
			},
			handleCheckedChange4(value) {
				// console.log()
			},
			handleCheckedChange5(value) {
				// console.log()
			},
			// 表格选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
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
	            this.multipleSelectionStore = val;
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
	//  		console.log(params)
				that.tableSelectLoading=true;
	    		selectStoreData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						that.tableSelectLoading=false;
						if(data.data) {
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
	    	setStoreEnter(){
//	    		console.log(this.multipleSelectionStore)
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
				this.storeName=storeName.substr(0,storeName.length-1);
				this.form.storeId=storeId.substr(0,storeId.length-1);;
	    		this.setDistributeStore=false;
	    	},
			// 方法
			submitForm() {
				// console.log(this.form.brandNum);
//				console.log(JSON.stringify(this.form));
				let that = this;
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
				cardProductionStore(params)
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
			},
			
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
	.radio-group{
		padding-left: 10px;
		.label{
			font-size: 14px;
			display: inline-block;
			height: 34px;
			line-height: 34px;
		}
	}
	.el-tabs {
		margin-bottom: 10px;
	}
	
	.box .title {
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		font-weight: bold;
		color: #000000;
		width: 100%;
		text-align: center;
		margin: 0;
	}
	
	.box .headerImg {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		overflow: hidden;
		margin: 10px auto;
		display: block;
	}
	
	.box span {
		width: 100%;
		display: block;
		text-align: center;
		margin: 20px 0 0 0;
	}
	
	.box .twoImg {
		width: 40%;
		display: block;
		margin: 10px auto;
	}
	
	.box .marTop88 {
		margin-top: 88px;
	}
	.storeInput{
		width: 160px;
		margin-left: 5px;
	}
	.demo-form{
		width:54%;
		margin: 0 auto;
	}
	.form-tabs{
		width:440px;
		border:1px solid #E1F3D8;
		padding: 0 20px 20px 20px;
		height: 450px;
		margin-top: 20px;
	}
	.footer{
		text-align: center;
		margin-top: 10px;
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