<!--工牌制作-->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card>
                <el-button type="primary" @click="shoppingGuide" v-if="roleBtn.addGuidQcInfo">导购二维码</el-button>
                <el-button type="primary" @click="store" v-if="roleBtn.addStoreQcInfo">门店二维码</el-button>
            </el-card>
        </el-header>
        <el-main>
            <el-card>
                <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="identityType" label="身份类型"></el-table-column>
                    <el-table-column prop="qrCodeNum" label="二维码数量"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间"></el-table-column>
                    <el-table-column prop="createBy" label="创建人"></el-table-column>
                    <el-table-column prop="taskStatus" label="任务状态"></el-table-column>
                    <el-table-column prop="action" label="操作" v-if="roleBtn.downloadWordCardInfo">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <el-tooltip class="item" content="下载" placement="top">
                                <icon-svg icon-class="xiazai" id="icon-xiazai" @click.native.prevent="iconShanchu(scope.$index, scope.row)"/>
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
        </el-main>
  </el-container>
</template>
<script>
import { selectCardProduction} from '@/api/work/cardProduction'
import { permission } from '@/utils'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
        	// 权限
			roleBtn: {
				addGuidQcInfo:false,
				addStoreQcInfo:false,
				downloadWordCardInfo:false
			},
            // 表格数据
            tableData: [],
            // 表格多选
            multipleSelection: [],
            // 表格是否为加载状态
            tableLoading: false,
			// 分页
			page: 0, // 
			count: 0, // 总条数
			limit: this.GLOBAL.limit, // 条/页
        }
    },
    methods: {
    	// 表格选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },		
        // 列表分页
		handleCurrentChange(val) {
			this.page = val;
			this.showTable(val, this.limit);
        },
        handleSizeChange(val) {
            this.limit = val;
            this.showTable(this.page, this.limit);
        },
        // 方法
        onSubmit() {
        	this.showTable(this.page,this.limit);
        },
        //导购二维码
        shoppingGuide(){
            this.$router.push({
                name: '营销助手工牌制作导购二维码'
            });
        },
        //门店二维码
        store(){
            this.$router.push({
                name: '营销助手工牌制作门店二维码'
            });
        },
        showTable(start, limit, searchContent) {
            let that = this;
            let params = {
            	userId:this.userInfo.userCode,
                page: start,
                limit: limit
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
            selectCardProduction(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
//                  console.log(data);
                    if(data.data) {
                        that.tableData = data.data;
                        that.count = data.count;
                        that.tableLoading = false;
                    }else if(data.messageType != 'SUCCESS'){
                        that.$message.warning(data.messageContent);
                        that.tableLoading = false;
                    }
                })
                .catch(function(err) {
                    // console.log(err);
                    that.tableLoading = false;
                });
        },
        // 图标 - 下载
        iconShanchu(index, row) {
        	if(row.qrUrl!=""){
        		window.location.href=row.qrUrl;
        	}
        },
    },
    created() {
    	this.showTable(this.page,this.limit);
        // 钩子函数 -- 初始化
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
</style>