<!-- 会员分组 - 所有分组 -->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card class="height55" v-if="roleBtn.selectAllGroupInfo">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item class="float-right">
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item class="float-right">
                        <el-input v-model="form.searchContent" placeholder="请输入分组名称"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-header>
        <el-main class="main-container" v-loading="tableLoading">
            <!-- <el-card> -->
                <el-row :gutter="16">
                    <el-col :span="6" v-for="item in data" :key="item.id">
                        <groupCard :childData="item" :allData="data" :childPageName="groupName" childType="所有分组" :childCopy="roleBtn.selectAllGroupInfo" @childReload="childReload"></groupCard>
                        <!-- <groupCard :childData="item" :childPageName="groupName" childType="共享分组" :childCopy="roleBtn.copyShareGroupInfo"></groupCard> -->
                    </el-col>
                </el-row>
            	<p class="noData" v-if="noData">暂无数据</p>
            <!-- </el-card> -->
            <el-footer v-if="count != 0">
                <el-pagination
                    background
                    class="pagination"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    :page-sizes="[8, 16, 24, 48, 96]"
                    :page-size="limit"
                    :total="count"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </el-footer>
        </el-main>
  </el-container>
</template>
<script>
import { permission } from '@/utils'
import { selectGroupAll } from '@/api/member/group'
import { mapGetters } from 'vuex'
import { groupCard } from '@/views/WebRoot/member'
export default {
    data() {
        return {
        	tableLoading:true,
            roleBtn: {
                selectAllGroupInfo: false
            },
            noData:false,
            // 分页
            page: 0, // 当前页
            count: 0, // 总条数
            // limit: this.GLOBAL.limit, // 条/页
            limit: 8, // 条/页

            groupName: '所有分组',

            // 数据
            form: {
                searchContent: ''
            },
            data: [
                // {
                //     id: 0,
                //     groupType: '所有分组',
                //     groupName: '所有分组分组名称',
                //     appUserCount: 3758,
                //     createdBy: '江',
                //     createdOn: '刚刚'
                // },
                // {
                //     id: 1,
                //     groupType: '预置分组',
                //     groupName: '预置分组分组名称',
                //     appUserCount: 8347,
                //     createdBy: '江',
                //     createdOn: '刚刚'
                // },
                // {
                //     id: 2,
                //     groupType: '品牌分组',
                //     groupName: '品牌分组分组名称',
                //     appUserCount: 2873,
                //     createdBy: '江',
                //     createdOn: '刚刚'
                // },
                // {
                //     id: 3,
                //     groupType: '共享分组',
                //     groupName: '共享分组分组名称',
                //     appUserCount: 934,
                //     createdBy: '江',
                //     createdOn: '刚刚'
                // },
                // {
                //     id: 4,
                //     groupType: '我的分组',
                //     groupName: '我的分组分组名称',
                //     appUserCount: 934,
                //     createdBy: '江',
                //     createdOn: '刚刚'
                // },
            ]
        }
    },
    methods: {
        // 方法
         childReload(str) {
            if(str === '复制') {
                this.showGroup(this.page, this.limit, this.form.searchContent);
            }
        },
        // 分页方法
        handleCurrentChange(val) {
            this.page = val; // 获取当前页
            this.showGroup(this.page, this.limit, this.form.searchContent);
            // 根据当前页、每页条书、搜索条件 重新载入数据 - 该语句用于添加删除修改等操作之后，刷新数据
        },
        handleSizeChange(val) {
            this.limit = val;
            this.showGroup(this.page, this.limit, this.form.searchContent);
        },
        handleSearch () {
            // console.log(this.form.searchContent, 'this.form.searchContent');
            this.showGroup(this.page, this.limit, this.form.searchContent);
        },
        // 显示数据
        showGroup(start, limit, searchContent) {
            let params = {
                "userId" : this.userInfo.userCode,
                "page": start,
                "limit": limit,
                "groupName": searchContent // (可空)
            }
            this.tableLoading=true;
            selectGroupAll(params)
                .then((res) => {
                    let data = JSON.parse(Base64.decode(res.data)),
                        count = data.count,
                        msg = data.data;
                	this.count = count;
                	this.data=[];
                    if(count > 0) {
                        msg.map((v,i)=>{
                            this.$set(v,'isShowDetail',false)
                        })
                        this.data = msg;
                    	this.noData=false;
                    }else{
                    	this.noData=true;
                    }
                    this.tableLoading=false;
                })
        }
    },
    components: {
        groupCard
    },
    created() {
        this.roleBtn = permission(this.roleBtn);
        // 钩子函数 -- 初始化
        this.showGroup(this.page, this.limit, this.form.searchContent);
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
.height55{
	height: 55px;
}
.el-form {
	display: unset;
	.el-form-item {
		margin-bottom: 10px;
	}
}
.noData{
	width:100%;
	height: 40px;
	line-height: 40px;
	text-align: center;
	font-size: 16px;
}
.main-container {
    min-width: rem(830px);
    min-height:rem(480px);
    padding: rem(10px);
    overflow-x: hidden;
    .el-col {
    	margin: 0px;
    }
}
</style>
