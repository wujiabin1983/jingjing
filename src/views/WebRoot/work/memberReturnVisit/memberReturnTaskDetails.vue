<!--回访任务详情-->
<template>
  <el-container class="app-container">
    <el-header>
      <el-button type="primary">
        <router-link to="/work/work-memberReturnVisit">
          返回
        </router-link>
      </el-button>
      <div class="task-name">{{tableData && tableData.length>0 ? tableData[0].taskName : ''}}</div>
    </el-header>
    <!-- 筛选条件 -->
    <el-card class="mt20">
      <el-form ref="form" :model="searchForm"  :inline="true" class="filter-form-wrap" label-width="80px">
        <el-form-item label="状态" prop="taskStatus">
          <el-select v-model="searchForm.taskStatus" placeholder="请选择状态">
            <el-option label="已回访" value="已回访"></el-option>
            <el-option label="未回访" value="未回访"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织" prop="selectStoreInfo">
          <el-input v-model="searchForm.selectStoreInfo.nameArray" class="select-store-input" :readonly="true" placeholder="请选择组织"></el-input>
          <el-button type="primary" size="small" @click="openStore">选择组织</el-button>
        </el-form-item>
        <el-form-item label="回访人" prop="visitedBy">
          <el-input v-model="searchForm.visitedBy" placeholder="请输入回访人"></el-input>
        </el-form-item>
        <el-form-item label="回访时间" prop="taskDateArray">
          <el-date-picker v-model="searchForm.taskDateArray" type="daterange" range-separator="至" 
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="width100 text-center" >
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-main>
      <el-card>
        <el-table ref="tableData" v-loading="tableLoading" :data="tableData">
          <el-table-column prop="userName" label="会员名称"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="visitedBy" label="回访人"></el-table-column>
          <el-table-column prop="visitedDate" label="回访时间"></el-table-column>
          <el-table-column prop="communicationMode" label="沟通方式"></el-table-column>
          <el-table-column prop="totalScode" label="总评分"></el-table-column>
          <el-table-column prop="action" label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" content="查看" placement="top">
                <i class="iconfont icon-view"  @click="viewTask(scope.row)"></i>
              </el-tooltip>
            </template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
          <el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="search.limit" :total="count" @current-change="handleCurrentChange">
          </el-pagination>
				</el-footer>
			</el-card>
		</el-main>
    <SelectStore :is-show-dialog.sync="isShowSelectStore" :select-store-info.sync="searchForm.selectStoreInfo" />
    <MemberReturnRecordDetailsModal :isShowDialog.sync="isShowDetailsModal" :current="currentMemberReturn" />
	</el-container>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    permission
  } from '@/utils'
  import SelectStore from '@/components/common/SelectStore/SelectStore.vue'
  import MemberReturnRecordDetailsModal from './components/MemberReturnRecordDetailsModal'
  import { apiGetMemberReturnTaskDetailsList } from '@/api/work/memberReturnVisit.js'
  export default {
    components: {
      SelectStore,
      MemberReturnRecordDetailsModal
    },
    data() {
      return {
        //门店、组织
        // selectStoreInfo: {},
        isShowSelectStore: false,
        searchForm:{
          taskStatus:'',
          visitedBy:'',
          selectStoreInfo:{},
          taskDateArray:[],
        },
        search: {
          id: '',
          userId: '',
          page: 0, // 当前页
          limit: this.GLOBAL.limit, // 条/页
          taskStatus: '', // "任务状态"(可以为空),
          visitedBy: '', //"回访人(可以为空)",
          relationObj: {}, // "门店(json格式) (可以为空)",
          taskDate: {} //"任务时间（json格式
        },
        count: 0,
        tableLoading: false,
        
        // 表格数据
        tableData: [],
        currentMemberReturn: null,
        isShowDetailsModal: false,
  
      }
    },
    computed: {
      // 计算属性
      ...mapGetters([
        'userInfo',
      ]),
    },
    created() {
      this.search.id = this.$route.params.id
      this.search.userId = this.userInfo.userCode
    },
    mounted() {
      console.log(this.$Fun)
      this.getData()
    },
    methods: {
      //重置筛选
      onReset(){
        this.$refs.form.resetFields();
        console.log(this.searchForm)
      },
      //查询
      onSubmit(){
        let { taskStatus,visitedBy,selectStoreInfo,taskDateArray } = this.searchForm
        // console.log(selectStoreInfo)
        this.search.taskStatus =  taskStatus
        this.search.visitedBy = visitedBy
        this.search.relationObj = this.$Fun.isEmptyObj(selectStoreInfo) ? '' : selectStoreInfo
        this.search.taskDate = {
          taskDateBegin: taskDateArray[0] || '',
          taskDateEnd: taskDateArray[1]||''
        }
        // console.log(this.search)
        this.getData()
      },
      getData() {
        let params = this.$Lodash.cloneDeep(this.search)
        this.tableLoading = true;
        // 查询接口
        apiGetMemberReturnTaskDetailsList(params).then((res) => {
          let { code, count, data} = JSON.parse(Base64.decode(res.data));

          console.log( JSON.parse(Base64.decode(res.data)))
          // if ( code == 'SUCCESS') {
            this.count = count;
            this.tableData = data;
          // } else {
          //   this.$message({
          //     message: '系统错误',
          //     type: 'warning'
          //   });
          // }
          this.tableLoading = false;
        }).catch((err) => {
          this.tableLoading = false;
        });
      },
      
      //筛选条件
      changeStoreCondition(val) {
        console.log(val)
        this.search.relationObj = val
      },
      changeTaskDate(val) {
        console.log(val)
      },
      openStore() {
        this.isShowSelectStore = true
      },
      //修改每页条数
      handleSizeChange(val) {
        this.search.limit = val;
        this.getData()
      },
      handleCurrentChange(val) {
        this.search.page = val;
        this.getData()
      },
      // 图标 - 查看
      async viewTask(row) {
        this.currentMemberReturn = row
        this.isShowDetailsModal = true
      },
    },
    watch: {
    }
  }
</script>
<style lang="scss" scoped>
.text-center{
  text-align: center;
}
.mt20{
  margin-top:20px;
}
.filter-form-wrap{
  .el-form-item{
    .select-store-input{
      width:60%;
    }
  }
}
</style>
