<!--回访任务列表-->
<template>
  <el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addMemberReturnTask">
        <el-button type="primary" @click="addTask" v-if="roleBtn.addMemberReturnTask">新建任务</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData">
					<el-table-column prop="createdOn"  label="创建时间"></el-table-column>
					<el-table-column prop="taskName"  label="回访标题"></el-table-column>
					<el-table-column prop="createdBy" label="操作者"></el-table-column>
					<el-table-column prop="taskDate" label="回访时间">
            <template  slot-scope="scope">
              {{scope.row.taskDate.taskDateBegin}}-{{scope.row.taskDate.taskDateEnd}}
            </template>
          </el-table-column>
					<el-table-column prop="visitedQty" label="回访人数">
            <template slot-scope="scope">
              {{scope.row.visitedQty}}/{{scope.row.ttlVisitedQty}}
            </template>
          </el-table-column>
					<el-table-column prop="taskStatus" label="任务状态"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<el-tooltip class="item" content="查看" placement="top">
                <i class="iconfont icon-view"  @click="viewTask(scope.row)"></i>
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateMemberReturnTask ">
                <i class="iconfont icon-edit"  @click="updateTask(scope.row)"></i>
							</el-tooltip>
              <!-- 正在执行/已结束/已停止/待执行 -->

							<el-tooltip class="item" :content="scope.row.taskStatus=='正在执行'?'禁用':'启用'" placement="top" v-if="roleBtn.forbiddenMemberReturnTask && scope.row.taskStatus!='已结束'">
                <i class="iconfont icon-forbidden"  @click="changeTaskStatus(scope.row)"></i>
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteMemberReturnTask">
                <i class="iconfont icon-delete"  @click="deleteTask(scope.row)"></i>
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
	</el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { permission } from '@/utils'
import { apiGetMemberReturnVisitList,apiDeleteMemberReturnTask,apiStartMemberReturnTask,apiStopMemberReturnTask } from '@/api/work/memberReturnVisit.js'
export default {
  data(){
    return{
      search:{
        userId: '',
        page: 0, // 当前页
				limit: this.GLOBAL.limit // 条/页
      },
      count:0,
      // 权限
      roleBtn: {
        addMemberReturnTask: true,
        updateMemberReturnTask: true,
        forbiddenMemberReturnTask: true,
        deleteMemberReturnTask: true,
      },
      tableLoading:false,
      // 表格数据
      tableData: [],
    }
  },
  computed:{
    // 计算属性
			...mapGetters([
				'userInfo',
			]),
  },
  created() {
    // this.roleBtn = permission(this.roleBtn);
    this.search.userId = this.userInfo.userCode
  },
  methods:{
    getTableData(){
      console.log(this.search)
      let params = this.$Lodash.cloneDeep(this.search)
      this.tableLoading = true;
      // 查询接口
      apiGetMemberReturnVisitList(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        // if(data.messageType=='SUCCESS') {

          this.count = result.count;
          this.tableData = result.data;
        // } else {
        //   this.$message({
        //     message: result.messageContent,
        //     type: 'warning'
        //   });
        // }
        this.tableLoading = false;
      }).catch((err)=> {
        console.log(err);
        this.tableLoading = false;
      });
    },
    //修改每页条数
    handleSizeChange(val) {
      this.search.limit = val;
    },
    handleCurrentChange(val) {
      this.search.page = val;
    },
    addTask(){
      this.$router.push({
        path:'work-addUpdateMemberReturnTask'
      })
    },
    // 图标 - 查看
    viewTask(row) {
      console.log(row)
      this.$router.push({
        path: `/work/work-memberReturnTaskDetails/${row.id}`
      });
    },
    updateTask(row) {
      var data = JSON.stringify(row);
      this.$router.push({
        path:`/work/work-addUpdateMemberReturnTask/${row.id}`
      })
    },
    changeTaskStatus(row){
      // 正在执行/已结束/已停止/待执行
      let taskStatus = row.taskStatus
      if(taskStatus == '已结束') return

      let params = {
        userId:this.userInfo.userCode,
        id:row.id,
        version:row.version
      }
      if(taskStatus=='正在执行'){ //禁止
        this.stopTask(params)
      }else{
        this.startTask(params)
      }
    },
    stopTask(params){
      apiStopMemberReturnTask(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        if(result.messageType=='SUCCESS') {
          this.$message({
            message: '停止成功',
            type: 'success'
          });
          this.getTableData()
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
      }).catch((err)=> {
        console.log(err);
      });
    },
    startTask(params){
      apiStartMemberReturnTask(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        if(result.messageType=='SUCCESS') {
          this.$message({
            message: '开启成功',
            type: 'success'
          });
          this.getTableData()
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
      }).catch((err)=> {
        console.log(err);
      });
    },
    deleteTask(row){
      let params={
        userId:this.userInfo.userCode,
        id:row.id,
        taskName:row.taskName
      }
      apiDeleteMemberReturnTask(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        if(result.messageType=='SUCCESS') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getTableData()
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
      }).catch((err)=> {
        console.log(err);
      });
    },
  },
  watch:{
    search: {
      handler(n, o) {
        this.getTableData()
      },
      deep: true
    },
  }
}
</script>
