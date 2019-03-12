<!--摇一摇活动管理-->
<template>
    <el-container class="app-container">
        <el-header>
            <el-card>
                 <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item class="floatLeft">
                        <el-button type="primary" @click="shoppingGuide" v-if="roleBtn.addShakeActivityInfo">新建页面</el-button>
                    </el-form-item>
                    <div class="floatRight">
	                    <el-form-item  label="">
	                        <el-input v-model="form.activityTitle" placeholder="请输入标题或关键字"></el-input>
	                    </el-form-item>
	                    <el-form-item>
	               			<el-button type="primary" @click="onSubmit">查询</el-button>
	                    </el-form-item>
                    </div>
                </el-form>
            </el-card>
        </el-header>
        <el-main>
            <el-card>
                <el-table ref="tableData" v-loading="this.tableLoading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="createdOn" width="145" label="创建时间"></el-table-column>
                    <el-table-column prop="type" label="类型"></el-table-column>
                    <el-table-column prop="" label="页面">
                    	<template slot-scope="scope" >
                    		<div class="page"><img :src="scope.row.activityUrl"/><span>{{scope.row.activityTitle}}</span><span>{{scope.row.activitySubtitle}}</span></div>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="activityDate" width="170" label="活动时间">
	                    	<template slot-scope="scope" >
	                    		<div v-if="scope.row.activityDate!=''">
	                    			{{scope.row.activityDate.activityDateBegin+" ~ "+scope.row.activityDate.activityDateEnd}}
	                    		</div>
	                    		<div v-else>
	                    			{{scope.row.activityDate}}
	                    		</div>
	                    	</template>
	                    </el-table-column>
                    <el-table-column prop="activityStatus" width="70" label="状态"></el-table-column>
                    <el-table-column prop="activiteDesc" label="活动说明"></el-table-column>
                    <el-table-column prop="action" label="操作" v-if="roleBtn.updateShakeActivityInfo&&roleBtn.deleteShakeActivityInfo">
                        <template slot-scope="scope">
                            <!-- 功能图标 -->
                            <!-- 修改 -->
                            <el-tooltip class="item" content="修改" placement="top" v-if="!scope.row.isEdit&&roleBtn.updateShakeActivityInfo">
                                <i class="iconfont icon-edit" @click.prevent="iconXiugai(scope.$index, scope.row)" ></i>
                                <!-- <icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="iconXiugai(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                            <el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteShakeActivityInfo">
                                <!-- 删除 -->
                                <i class="iconfont icon-delete" @click.prevent="iconShanchu(scope.$index, scope.row)" ></i>
                                <!-- <icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)"/> -->
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-footer v-if="count != 0">
                    <el-pagination 
                        background 
                        class="pagination" 
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" 
                        :page-size="limit"
                        :total="count" 
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </el-footer>
            </el-card>
        </el-main>
  </el-container>
</template>
<script>
import {selectActivityData,deleteData} from '@/api/tool/activityManagement'
import { mapGetters } from 'vuex'
import Cookie from 'js-cookie'
import { permission } from '@/utils'
export default {
    data() {
        return {
			// 权限
			roleBtn: {
				"addShakeActivityInfo":false,
                "updateShakeActivityInfo":false,
                "deleteShakeActivityInfo":false
			},
            // 搜索数据
            form: {
                activityTitle: '' // 活动标题
            },
            // 表格数据
            tableData: [],
            tableDataOther: [],
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
    	// 表格选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    	// 活动列表分页
        handleCurrentChange(val) {
            this.page = val;
            this.showTable(val, this.limit, this.form);
        },
        handleSizeChange(val) {
            this.limit = val;
            this.showTable(this.page, this.limit, this.form);
        },
        // 方法
        onSubmit() {
        	this.showTable('',this.limit);
        },
        //修改
        iconXiugai(index,row){
        	var data = JSON.stringify(this.tableDataOther[index]);
			this.$router.push({
                name: '门店摇一摇活动管理修改',
				params: {
					pageType: '修改',
                	formData: data
				}
			});
        },
         //新建页面
        shoppingGuide(){
            this.$router.push({
                name: '门店摇一摇活动管理新增',
				params: {
					pageType: '添加',
				}
            });
        },
        
        showTable(start, limit, searchContent) {
            let that = this;
            let params = {
            	userId:this.userInfo.userCode,
                page: start,
                limit: limit,
                activityTitle: this.form.activityTitle
            }
            // 使表格加载
            this.tableLoading = true;
            // 查询接口
            // console.log(params)
            selectActivityData(params)
                .then(function(res) {
                    let data = JSON.parse(Base64.decode(res.data));
                    // console.log(data);
                    let result = [];
                    let resultOther = [];
                    data.data.forEach((val, index) => {
                        result.push({
                            isEdit: false,
                            ...val,
                            activityUrl: val.activityUrl
                        });
                    })
                    data.data.forEach((val, index) => {
                        resultOther.push({
                            isEdit: false,
                            ...val
                        });
                    })
                    that.tableDataOther = resultOther;
                    that.count = data.count;
                    that.tableData = result;
                    that.tableLoading = false;
                })
                .catch(function(err) {
                    // console.log(err);
                    that.tableLoading = false;
                });
        },
        // 图标 - 删除
        iconShanchu(index, row) {
            // console.log(index);
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
	            // console.log(JSON.stringify(param)+"入参")
				deleteData(param)
	                .then((res) => {
	                    let data = JSON.parse(Base64.decode(res.data));
	                    //    console.log(JSON.stringify(data)+"返回值");
	                    if(data.messageType == 'SUCCESS') {
	                        that.$message.success(data.messageContent);
							that.showTable(that.page, that.limit, that.form);
							that.tableLoading = false;
	                    }else {
	                        that.$message.error(data.messageContent);
							that.showTable(that.page, that.limit, that.form);
							that.tableLoading = false;
	                    }
	                })
	                .catch((err) => {
	                    // console.log(err);
	                });
            }).catch(() => {
				this.tableLoading = true;
            });
        },
    },
    created() {
    	this.showTable(this.page,this.limit);
        // 钩子函数 -- 初始化
		// 权限
		this.roleBtn = permission(this.roleBtn);
//		console.log(JSON.stringify(this.roleBtn))
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
</style>