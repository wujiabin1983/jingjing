<!--订单信息-导入信息-会员销售信息-详情-->
<template>
    <el-container class="app-container">
        <el-main>
			<el-button @click="handleBack">返回</el-button>
            <el-card>
            	<el-form label-width="120px" class="demo-form">
					<el-row :gutter="10">
						<el-col :span="8">
							<el-form-item label="门店编码" prop="storeId">
								<el-input v-model="tableData.storeId" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="订单状态" prop="orderStatus">
								<el-input v-model="tableData.orderStatus" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="订单件数" prop="qty">
								<el-input v-model="tableData.qty" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="订单实付金额" prop="orderRealpayAmount">
								<el-input v-model="tableData.orderRealpayAmount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="订单编码" prop="orderNum">
								<el-input v-model="tableData.orderNum" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="线下卡号" prop="offlineCardNum">
								<el-input v-model="tableData.offlineCardNum" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="订单吊牌金额" prop="orderTagAmount">
								<el-input v-model="tableData.orderTagAmount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="关联单号" prop="relationOrderNum">
								<el-input v-model="tableData.relationOrderNum" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="订单时间" prop="orderDate">
								<el-input v-model="tableData.orderDate" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="订单应付金额" prop="orderPayableAmount">
								<el-input v-model="tableData.orderPayableAmount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
            </el-card>
        </el-main>
  </el-container>
</template>
<script>
import { selectOrderDetail} from '@/api/base/orderInfo'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
        	// 表格数据
            tableData: {
				storeId: '', //门店编码
				orderNum: '', //订单编码		--------
				relationOrderNum: '', //关联单号
				orderStatus: '', //订单状态
				offlineCardNum: '', //线下卡号	
				orderDate: '', //订单时间				---------
				qty: '', //订单件数
				orderTagAmount: '', //订单吊牌金额		--------
				orderPayableAmount: '', //订单应付金额
				orderRealpayAmount: '' //订单实付金额
            }
        }
    },
    methods: {
        // 返回方法
        handleBack() {
            this.$router.push({ name: '数据导入订单信息查询' ,
			params: {
				formData: this.getFormData
			}});
        },
    },
    created() {
        // 钩子函数 -- 初始化
        this.tableData = JSON.parse(this.getDetail);
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
		getDetail(){
			return this.$route.params.detail;
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
}
.el-button{
	margin-bottom: 5px;
}
.el-select {
    width: 100%;
}
</style>