<!-- 会员分组 - 预置分组 -->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card class="height55" v-if="roleBtn.selectInitGroupInfo">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item>
                        <el-input v-model="form.searchContent" placeholder="请输入分组名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-header>
        <el-main class="main-container" v-loading="tableLoading">
            <!-- <el-card> -->
            <el-row :gutter="16">
                <el-col :span="6" v-for="item in data" :key="item.id">
                    <groupCard :childData="item" :childPageName="groupName" :childCopy="roleBtn.copyInitGroupInfo"></groupCard>
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
import { selectGroupInit } from '@/api/member/group'
import { mapGetters } from 'vuex'
import { groupCard } from '@/views/WebRoot/member'
export default {
    data() {
        return {
            roleBtn: {
                selectInitGroupInfo: false, // 查询
                copyInitGroupInfo: false // 复制
            },
            tableLoading:false,
            // 分页
            page: 0, // 当前页
            count: 0, // 总条数
            // limit: this.GLOBAL.limit, // 条/页
            limit: 8, // 条/页

            groupName: '预置分组',

            // 数据
            form: {
                searchContent: ''
            },
            noData:false,
            data: []
        }
    },
    methods: {
        // 方法
        // 分页方法
        handleCurrentChange(val) {
            this.page = val; // 获取当前页
            this.showGroup(this.page, this.limit, this.form.searchContent);
        },
        handleSizeChange(val) {
			this.limit = val;
			this.showGroup(this.page, this.limit, this.form.searchContent);
		},
        handleSearch () {
            // 搜索
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
//          console.log(JSON.stringify(params))
            this.tableLoading=true;
            selectGroupInit(params)
                .then((res) => {
                    let data = JSON.parse(Base64.decode(res.data)),
                        count = data.count,
                        msg = data.data;
//                  console.log(JSON.stringify(data))
                    this.data=[];
            		this.tableLoading=false;
                	this.count = count;
                    if(msg.length == 0) {
                    	this.noData=true;
                    }else {
                    	this.noData=false;
                    	msg.forEach((value,index)=>{
                    		this.data.push({
                    			...value
                    		})
                    	})
                    }
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
