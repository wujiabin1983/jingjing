<!--回访任务详情-->
<template>
  <el-container class="app-container">
		<el-header>
      <el-button type="primary">
        <router-link to="/work/work-memberReturnVisit">
          返回
        </router-link>
      </el-button>
      <div class="task-name">{{taskDetails.name}}</div>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData">
					<el-table-column prop="operationDate"  label="会员名称"></el-table-column>
					<el-table-column prop="taskName"  label="电话"></el-table-column>
					<el-table-column prop="createdBy" label="回访人"></el-table-column>
          <el-table-column prop="createdBy" label="回访时间"></el-table-column>
					<el-table-column prop="visitedQty" label="沟通方式"></el-table-column>
					<el-table-column prop="taskStatus" label="总评分"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<el-tooltip class="item" content="查看" placement="top">
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="viewTask(scope.row)" />
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
import { getMemberReturnTaskDetails } from '@/api/work/memberReturnVisit.js'
export default {
  data(){
    return{
      search:{
        id:'',
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
      taskDetails:{},
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
    this.search.id= this.$route.params.id
    console.log(this.$route)
    this.search.userId = this.userInfo.userCode
  },
  methods:{
    getData(){
      console.log(this.search)
      let params = this.$Lodash.cloneDeep(this.search)
      this.tableLoading = true;
      // 查询接口
      getMemberReturnTaskDetails(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)

        if(result.messageType=='SUCCESS') {
          let data = result.messageContent.marketingActivitie
          this.taskDetails = data
          // this.count = data.list.count;
          // this.tableData = data.list.data;
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
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
        path:'work-addMemberReturnTask'
      })
    },
    // 图标 - 查看
    viewTask(index, row) {
      var data = JSON.stringify(row);
      this.$router.push({
        name: '门店管理店组管理查询',
        params: {
          pageType: '查看',
          formData: data
        }
      });
    },
    updateTask(index, row) {
      var data = JSON.stringify(row);
      
    },
    forbiddenTask(index,row){

    },
    deleteTask(index,row){

    },
  },
  watch:{
    search: {
      handler(n, o) {
        this.getData()
      },
      deep: true
    },
  }
}
</script>
