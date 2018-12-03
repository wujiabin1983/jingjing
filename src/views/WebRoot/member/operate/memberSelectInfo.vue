<!-- 会员信息   会员查询 详情 -->
<template>
	<el-container>
		<el-card class="userCenter">
			<el-tabs v-model="activeName" @tab-click="handleClick" class="width100 dsh-tabs">
				<el-tab-pane label="会员信息" name="会员信息">
					<userInfo ref="userInfo"></userInfo>
				</el-tab-pane>
				<el-tab-pane label="积分记录" name="积分记录">
					<integralInfoRecord ref="integralInfoRecord"></integralInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="消费记录" name="消费记录">
					<saleInfoRecord ref="saleInfoRecord"></saleInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="购买商品" name="购买商品">
					<buyInfoRecord ref="buyInfoRecord"></buyInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="活动记录" name="活动记录">
					<activityInfoRecord ref="activityInfoRecord"></activityInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="用券记录" name="用券记录">
					<useCouponsRecord ref="useCouponsRecord"></useCouponsRecord>
				</el-tab-pane>
				<el-tab-pane label="沟通记录" name="沟通记录">
					<communicationInfoRecord ref="communicationInfoRecord"></communicationInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="邀请记录" name="邀请记录">
					<inviteInfoRecord ref="inviteInfoRecord"></inviteInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="服务记录" name="服务记录">
					<serviceInfoRecord ref="serviceInfoRecord"></serviceInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="标签记录" name="标签记录">
					<labelInfoRecord ref="labelInfoRecord"></labelInfoRecord>
				</el-tab-pane>
				<el-tab-pane label="资料修改记录" name="资料修改记录">
					<dataModificationInfoRecord ref="dataModificationInfoRecord"></dataModificationInfoRecord>
				</el-tab-pane>
			</el-tabs>
			<span @click="handleBack" class="dsh-back">返回</span>
		</el-card>
	</el-container>
</template>
<script>
	import { selectMemberData ,selectMemberInfo} from '@/api/member/memberDataModification'
//	会员信息
	import userInfo from '@/views/WebRoot/member/component/userInfo'
//	积分记录
	import integralInfoRecord from '@/views/WebRoot/member/component/integralInfoRecord' 
//	消费记录
	import saleInfoRecord from '@/views/WebRoot/member/component/saleInfoRecord'
//	购买记录
	import buyInfoRecord from '@/views/WebRoot/member/component/buyInfoRecord'
//	活动记录
	import activityInfoRecord from '@/views/WebRoot/member/component/activityInfoRecord'
//	用券记录
	import useCouponsRecord from '@/views/WebRoot/member/component/useCouponsRecord'
//	沟通记录
	import communicationInfoRecord from '@/views/WebRoot/member/component/communicationInfoRecord'
//	邀请记录
	import inviteInfoRecord from '@/views/WebRoot/member/component/inviteInfoRecord'
//	服务记录
	import serviceInfoRecord from '@/views/WebRoot/member/component/serviceInfoRecord'
//	标签记录
	import labelInfoRecord from '@/views/WebRoot/member/component/labelInfoRecord'
//	资料修改记录
	import dataModificationInfoRecord from '@/views/WebRoot/member/component/dataModificationInfoRecord'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				activeName:"会员信息",
				integral:false,
				sale:false,
				buy:false,
				activity:false,
				useCoupons:false,
				communication:false,
				invite:false,
				service:false,	
				label:false,
				dataModification:false
			}
		},
		components: {
			userInfo,
			integralInfoRecord,
			saleInfoRecord,
			buyInfoRecord,
			activityInfoRecord,
			useCouponsRecord,
			communicationInfoRecord,
			inviteInfoRecord,
			serviceInfoRecord,
			labelInfoRecord,
			dataModificationInfoRecord
		},
		methods: {
			//tabs监听
			handleClick(tab,event){
				this.$route.params.pageType = event.target.firstChild.data;
				if(event.target.firstChild.data=="会员信息"){
					this.$refs['userInfo'].selectMember();
				}
				if(event.target.firstChild.data=="积分记录"){
					this.$refs['integralInfoRecord'].showTable(0, this.GLOBAL.limit);
				}
				if(event.target.firstChild.data=="消费记录"){
					this.$refs['saleInfoRecord'].showTable(0, this.GLOBAL.limit);
					this.$refs['saleInfoRecord'].showOther();
				}
				if(event.target.firstChild.data=="购买商品"){
					this.$refs['buyInfoRecord'].showTable(0, this.GLOBAL.limit);
					this.$refs['buyInfoRecord'].showOther();
				}
				if(event.target.firstChild.data=="活动记录"){
					this.$refs['activityInfoRecord'].showTable(0, this.GLOBAL.limit);
				}
				if(event.target.firstChild.data=="用券记录"){
					this.$refs['useCouponsRecord'].showTable(0, this.GLOBAL.limit);
					this.$refs['useCouponsRecord'].showOther();
				}
				if(event.target.firstChild.data=="沟通记录"){
					this.$refs['communicationInfoRecord'].showTable(0, this.GLOBAL.limit);
					this.$refs['communicationInfoRecord'].showOther();
				}
				if(event.target.firstChild.data=="邀请记录"){
					this.$refs['inviteInfoRecord'].showTable(0, this.GLOBAL.limit);
				}
				if(event.target.firstChild.data=="服务记录"){
					this.$refs['serviceInfoRecord'].showTable(0, this.GLOBAL.limit);
				}
				if(event.target.firstChild.data=="标签记录"){
					this.$refs['labelInfoRecord'].showTable(0, this.GLOBAL.limit);
				}
				if(event.target.firstChild.data=="资料修改记录"){
					this.$refs['dataModificationInfoRecord'].showTable(0, this.GLOBAL.limit);
				}
			},
			handleBack(){
				if(this.getPageName=="所有分组"){
	                this.$router.push({
	                    name: '所有分组-系统分析',
	                    params: {
	                        pageType: this.getPageType,
	                        pageName: this.getPageName,
	                        formData: this.getFormData
	                    }
	                });
				}
				if(this.getPageName=="品牌分组"){
	                this.$router.push({
	                    name: '品牌分组-系统分析',
	                    params: {
	                        pageType: this.getPageType,
	                        pageName: this.getPageName,
	                        formData: this.getFormData
	                    }
	                });
				}
				if(this.getPageName=="预置分组"){
	                this.$router.push({
	                    name: '预置分组-系统分析',
	                    params: {
	                        pageType: this.getPageType,
	                        pageName: this.getPageName,
	                        formData: this.getFormData
	                    }
	                });
				}
				if(this.getPageName=="共享分组"){
	                this.$router.push({
	                    name: '共享分组-系统分析',
	                    params: {
	                        pageType: this.getPageType,
	                        pageName: this.getPageName,
	                        formData: this.getFormData
	                    }
	                });
				}
				if(this.getPageName=="我的分组"){
	                this.$router.push({
	                    name: '我的分组-系统分析',
	                    params: {
	                        pageType: this.getPageType,
	                        pageName: this.getPageName,
	                        formData: this.getFormData
	                    }
	                });
				}
				if(this.getPageName=="会员查询"||!this.getPageName){
	                this.$router.push({
	                    name: '会员查询',
	                    params: {
	                        isMemeber: true
	                    }
	                });
				}
			}
		},
		created() {
			window.scroll(0,0);	
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getFormData() {//会员分组列表带过来的数据
				return this.$route.params.otherData;
			},
			getPageName() {//页面名字 所有分组、品牌分组、预置分组、共享分组、我的分组
				return this.$route.params.getPageName;
			},
			getPageType() {//页面名字 所有分组、品牌分组、预置分组、共享分组、我的分组
				return this.$route.params.pageType;
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%!important;
		margin: 0;
		position: relative;
	}
	.dsh-back{
		position: absolute;
		right: 10px;
		top: 16px;
		border-radius: 5px;
		cursor: pointer;
		background: #f3f3f3;
		border: 1px solid #c1c1c1;
		padding: 2px 12px;
	}
	.dean-form .el-form-item{
		margin: 0;
	}
	.el-button{
		margin-top:0;
	}
	.sortIcon{
		width: 30px;
		display: inline-block;
	}
	.el-form {
		display: inline-block;
	}
	.tabPane{
		border:1px solid #ebebeb;
		border-top: none;
		padding: 10px 20px;
	}
	table {
		border-top: 1px solid #ebebeb;
		border-left: 1px solid #ebebeb;
		thead {
			background: #f5f7fa;
		}
		th{
			height: 40px;
			border-bottom: 1px solid #ebebeb;
			border-right: 1px solid #ebebeb;
			text-align: left;
			padding-left: 20px;
			background-color: #1992ff;
			color: #fff;
		}
		td {
			width:25%;
			height: 40px;
			border-bottom: 1px solid #ebebeb;
			border-right: 1px solid #ebebeb;
			text-align: center;
		}
		.el-input {
			width: 60%;
		}
	}
</style>