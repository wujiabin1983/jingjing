<!-- 会员分组 - 所有分组-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack">返回</el-button>
			<el-card>
				<el-form :model="form"  v-loading="tableLoading"  ref="form" label-width="120px" class="demo-form">
					<el-form-item label="分组名称" prop="groupName">
						<el-input v-model="form.groupName" :readonly="disabledSet"></el-input>
					</el-form-item>
					<el-form-item label="会员数量" prop="appUserCount">
						<el-input v-model="form.appUserCount" :readonly="disabledSet"></el-input>
					</el-form-item>
					<el-form-item label="创建人" prop="createdBy">
						<el-input v-model="form.createdBy" :readonly="disabledSet"></el-input>
					</el-form-item>
					<el-form-item label="创建日期" prop="createdOn">
						<el-input v-model="form.createdOn" :readonly="disabledSet"></el-input>
					</el-form-item>
					<!--<el-form-item label="创建日期" prop="birthDate">
						<el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :editable="false" v-model="form.birthDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>-->
				</el-form>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
	import { setMemberData } from '@/api/member/memberDataModification'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				num1:0,
				disabledSet:true,
	        	activeName: 'first',
	        	formLabelWidth:'120px',
				// 搜索数据
				form: {
					"groupName": "", // 分组名称
					"appUserCount": "", // 会员数量
					"createdBy": "", // 创建人
					"createdOn": "", // 创建日期
				},
				tableLoading: false,
			}
		},
		methods: {
	    	//tab切换
			// 会员调整记录查询
			handleBack(){
				this.$router.push({
					name: this.getPageName
				});
			},
		},
		created() {
			// 钩子函数 -- 初始化
//			console.log(this.getFormData, '\\\\||||||//////');
			this.form = JSON.parse(this.getFormData);
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
			getPageName() {
				return this.$route.params.pageName;
			}
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
	.el-form-item {
	}
</style>